-- Additive migration. Apply only to Caro Bara Smart Print's verified database.
-- Existing appointments, customers, requests and booking slots are preserved.
begin;
create table if not exists public.cb_booking_settings (
  id boolean primary key default true check (id), policy jsonb not null, updated_at timestamptz not null default now()
);
insert into public.cb_booking_settings(id,policy) values(true,'{"version":1,"horizonDays":60,"leadMinutes":60,"urgentPriceCents":2000,"cancellationHours":24,"visitBufferMinutes":30,"weekly":{"we_come_free":[{"days":[2,3],"start":660,"end":1080},{"days":[5],"start":900,"end":1140}],"at_store":[{"days":[1,2,3,4,5],"start":540,"end":1080},{"days":[6],"start":540,"end":900}],"phone_call":[{"days":[0,1,2,3,4,5,6],"start":0,"end":1440}]},"durations":{"we_come_free":[60,90,120],"at_store":[30,60],"phone_call":[15,30]},"closedDates":[]}') on conflict do nothing;
create table if not exists public.cb_appointments (
  id uuid primary key default gen_random_uuid(), reference text not null unique,
  idempotency_key uuid not null unique, payload_hash text not null,
  mode text not null check(mode in ('we_come_free','at_store','phone_call')),
  start_at timestamptz not null, end_at timestamptz not null,
  reserved_start timestamptz not null, reserved_end timestamptz not null,
  status text not null default 'pending' check(status in ('pending','confirmed','cancelled','rejected')),
  full_name text not null, email text not null, phone text not null, address text not null default '', notes text not null default '',
  language text not null check(language in ('ar','de','en')),
  urgent boolean not null default false, price_cents integer not null default 0 check(price_cents in (0,2000)),
  cancellation_requested_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), revision integer not null default 0,
  check(end_at > start_at and end_at <= start_at + interval '2 hours'),
  check(reserved_start <= start_at and reserved_end >= end_at)
);
create index if not exists cb_appointments_availability on public.cb_appointments(start_at,end_at) where status in ('pending','confirmed');
create table if not exists public.cb_booking_outbox (
  id uuid primary key default gen_random_uuid(), appointment_id uuid not null references public.cb_appointments(id),
  revision integer not null, event text not null, recipient text not null check(recipient in ('customer','owner')),
  snapshot jsonb not null, prepared_payload jsonb, created_at timestamptz not null default now(), sent_at timestamptz,
  leased_until timestamptz, lease_token uuid, attempts integer not null default 0, last_error text,
  unique(appointment_id,revision,event,recipient)
);
create table if not exists public.cb_booking_rate_limits (
  key text primary key, window_start timestamptz not null, hits integer not null
);
alter table public.cb_booking_settings enable row level security;
alter table public.cb_appointments enable row level security;
alter table public.cb_booking_outbox enable row level security;
alter table public.cb_booking_rate_limits enable row level security;
revoke all on public.cb_booking_settings, public.cb_appointments, public.cb_booking_outbox, public.cb_booking_rate_limits from anon,authenticated;
grant all on public.cb_booking_settings, public.cb_appointments, public.cb_booking_outbox, public.cb_booking_rate_limits to service_role;

create or replace function public.cb_booking_limit(p_key text) returns boolean language plpgsql security invoker set search_path=public as $$
declare n integer;
begin
 insert into cb_booking_rate_limits(key,window_start,hits) values(p_key,now(),1)
 on conflict(key) do update set hits=case when cb_booking_rate_limits.window_start < now()-interval '1 hour' then 1 else cb_booking_rate_limits.hits+1 end,
 window_start=case when cb_booking_rate_limits.window_start < now()-interval '1 hour' then now() else cb_booking_rate_limits.window_start end returning hits into n;
 delete from cb_booking_rate_limits where window_start < now()-interval '2 days';
 return n <= 12;
end $$;

-- Return only intervals, never customer identities, to the public availability service.
create or replace function public.cb_booking_busy() returns jsonb language plpgsql security invoker set search_path=public as $$
declare result jsonb; legacy jsonb;
begin
 select coalesce(jsonb_agg(jsonb_build_object('reserved_start',reserved_start,'reserved_end',reserved_end)),'[]') into result from cb_appointments where status in ('pending','confirmed') and reserved_end > now();
 if to_regclass('public.booking_slots') is not null then
  execute $q$select coalesce(jsonb_agg(jsonb_build_object('reserved_start',((to_jsonb(s)->>'booking_date')::date+(to_jsonb(s)->>'start_time')::time) at time zone 'Europe/Berlin','reserved_end',((to_jsonb(s)->>'booking_date')::date+(to_jsonb(s)->>'end_time')::time) at time zone 'Europe/Berlin')),'[]') from booking_slots s where to_jsonb(s)->>'status' in ('booked','blocked')$q$ into legacy;
  result := result || legacy;
 end if;
 -- Conservatively protect legacy appointments, including any whose old slot was lost.
 if to_regclass('public.appointments') is not null then
  execute $q$select coalesce(jsonb_agg(jsonb_build_object('reserved_start',((to_jsonb(a)->>'date')::date+substring(to_jsonb(a)->>'time' from 1 for 5)::time) at time zone 'Europe/Berlin','reserved_end',(((to_jsonb(a)->>'date')::date+substring(to_jsonb(a)->>'time' from 1 for 5)::time) at time zone 'Europe/Berlin')+interval '2 hours')),'[]') from appointments a where coalesce(to_jsonb(a)->>'status','new') in ('new','confirmed','in_progress') and to_jsonb(a)->>'date' ~ '^\d{4}-\d{2}-\d{2}$' and to_jsonb(a)->>'time' ~ '^\d{2}:\d{2}'$q$ into legacy;
  result := result || legacy;
 end if;
 return result;
end $$;

create or replace function public.cb_booking_create(p_data jsonb) returns jsonb language plpgsql security invoker set search_path=public as $$
declare a cb_appointments; p jsonb; s timestamptz; e timestamptz; rs timestamptz; re timestamptz; b jsonb; local_start timestamp; local_end timestamp; m text; minutes integer; buffer integer; allowed boolean;
begin
 perform pg_advisory_xact_lock(8917152026);
 select * into a from cb_appointments where idempotency_key=(p_data->>'idempotency_key')::uuid;
 if found then
  if a.payload_hash <> p_data->>'payload_hash' then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
  return to_jsonb(a);
 end if;
 select policy into p from cb_booking_settings where id=true for update;
 m:=p_data->>'mode'; s:=(p_data->>'start_at')::timestamptz; e:=(p_data->>'end_at')::timestamptz;
 local_start:=s at time zone 'Europe/Berlin'; local_end:=e at time zone 'Europe/Berlin';
 minutes:=extract(epoch from e-s)::integer/60;
 if s < now()+make_interval(mins=>(p->>'leadMinutes')::integer) or local_start::date >= (now() at time zone 'Europe/Berlin')::date+(p->>'horizonDays')::integer or local_start::date < (now() at time zone 'Europe/Berlin')::date then raise exception 'SLOT_UNAVAILABLE'; end if;
 if not (p->'durations'->m @> to_jsonb(array[minutes])) or extract(epoch from local_end-local_start)::integer <> minutes*60 or (p->'closedDates') ? local_start::date::text then raise exception 'SLOT_UNAVAILABLE'; end if;
 select exists(select 1 from jsonb_array_elements(p->'weekly'->m) w where w->'days' @> to_jsonb(array[extract(dow from local_start)::integer]) and extract(hour from local_start)*60+extract(minute from local_start)>=(w->>'start')::integer and extract(epoch from (local_end-local_start::date)) / 60 <= (w->>'end')::integer) into allowed;
 if not allowed or extract(minute from local_start)::integer % 30 <> 0 or extract(second from local_start)<>0 then raise exception 'SLOT_UNAVAILABLE'; end if;
 buffer:=case when m='we_come_free' then (p->>'visitBufferMinutes')::integer else 0 end;
 rs:=s-make_interval(mins=>buffer); re:=e+make_interval(mins=>buffer);
 for b in select * from jsonb_array_elements(cb_booking_busy()) loop
  if rs<(b->>'reserved_end')::timestamptz and re>(b->>'reserved_start')::timestamptz then raise exception 'SLOT_UNAVAILABLE'; end if;
 end loop;
 insert into cb_appointments(reference,idempotency_key,payload_hash,mode,start_at,end_at,reserved_start,reserved_end,full_name,email,phone,address,notes,language,urgent,price_cents)
 values(p_data->>'reference',(p_data->>'idempotency_key')::uuid,p_data->>'payload_hash',m,s,e,rs,re,p_data->>'full_name',p_data->>'email',p_data->>'phone',p_data->>'address',p_data->>'notes',p_data->>'language',(p_data->>'urgent')::boolean,case when (p_data->>'urgent')::boolean then (p->>'urgentPriceCents')::integer else 0 end) returning * into a;
 insert into cb_booking_outbox(appointment_id,revision,event,recipient,snapshot) select a.id,a.revision,'pending',v,to_jsonb(a) from unnest(array['customer','owner']) v;
 return to_jsonb(a);
end $$;

create or replace function public.cb_booking_transition(p_id uuid,p_status text,p_expected integer) returns jsonb language plpgsql security invoker set search_path=public as $$
declare a cb_appointments;
begin
 perform pg_advisory_xact_lock(8917152026);
 select * into a from cb_appointments where id=p_id for update;
 if not found or a.revision<>p_expected then raise exception 'STATE_CONFLICT'; end if;
 if not ((a.status='pending' and p_status in ('confirmed','rejected','cancelled')) or (a.status='confirmed' and p_status='cancelled')) then raise exception 'STATE_CONFLICT'; end if;
 if p_status='confirmed' and a.start_at<=now() then raise exception 'STATE_CONFLICT'; end if;
 update cb_appointments set status=p_status,revision=revision+1,updated_at=now() where id=p_id returning * into a;
 insert into cb_booking_outbox(appointment_id,revision,event,recipient,snapshot) select a.id,a.revision,p_status,v,to_jsonb(a) from unnest(array['customer','owner']) v;
 return to_jsonb(a);
end $$;

create or replace function public.cb_booking_cancel(p_reference text,p_email text) returns text language plpgsql security invoker set search_path=public as $$
declare a cb_appointments; hours integer;
begin
 perform pg_advisory_xact_lock(8917152026);
 select * into a from cb_appointments where reference=p_reference and email=p_email for update;
 if not found then return 'NOT_FOUND'; end if;
 if a.status in ('cancelled','rejected') then return 'cancelled'; end if;
 select (policy->>'cancellationHours')::integer into hours from cb_booking_settings where id=true;
 if a.start_at < now()+make_interval(hours=>hours) then
  if a.cancellation_requested_at is null then
   update cb_appointments set cancellation_requested_at=now(),revision=revision+1,updated_at=now() where id=a.id returning * into a;
   insert into cb_booking_outbox(appointment_id,revision,event,recipient,snapshot) select a.id,a.revision,'late_cancellation',v,to_jsonb(a) from unnest(array['customer','owner']) v;
  end if;
  return 'review_required';
 end if;
 perform cb_booking_transition(a.id,'cancelled',a.revision);
 return 'cancelled';
end $$;

create or replace function public.cb_booking_claim(p_id uuid default null) returns setof cb_booking_outbox language sql security invoker set search_path=public as $$
 update cb_booking_outbox set leased_until=now()+interval '5 minutes',lease_token=gen_random_uuid(),attempts=attempts+1 where id in (
 select o.id from cb_booking_outbox o where sent_at is null and (leased_until is null or leased_until<now()) and attempts<5 and created_at>now()-interval '23 hours' and (p_id is null or appointment_id=p_id) and not exists(select 1 from cb_booking_outbox prior where prior.appointment_id=o.appointment_id and prior.recipient=o.recipient and prior.revision<o.revision and prior.sent_at is null) order by created_at,revision limit 8 for update skip locked) returning *;
$$;
-- Functions are privileged service operations, never browser RPCs.
revoke all on function cb_booking_limit(text),cb_booking_busy(),cb_booking_create(jsonb),cb_booking_transition(uuid,text,integer),cb_booking_cancel(text,text),cb_booking_claim(uuid) from public,anon,authenticated;
grant execute on function cb_booking_limit(text),cb_booking_busy(),cb_booking_create(jsonb),cb_booking_transition(uuid,text,integer),cb_booking_cancel(text,text),cb_booking_claim(uuid) to service_role;
commit;
