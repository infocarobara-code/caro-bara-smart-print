-- Release together with the matching application; old app rejects the new policy price.
alter table public.cb_appointments drop constraint if exists cb_appointments_price_cents_check;
alter table public.cb_appointments add constraint cb_appointments_price_cents_check check(price_cents in (0,2000,8000));
update public.cb_booking_settings set policy=jsonb_set(policy,'{urgentPriceCents}','8000'::jsonb) where id=true;
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
 if (not allowed and not coalesce((p_data->>'urgent')::boolean,false)) or extract(minute from local_start)::integer % 30 <> 0 or extract(second from local_start)<>0 then raise exception 'SLOT_UNAVAILABLE'; end if;
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
