begin;
-- Normalize historical user-facing time labels without modifying stored records.
create or replace function public.cb_legacy_booking_start(p_date text,p_time text) returns timestamptz language plpgsql immutable security invoker set search_path=public as $$
declare d text; t text; h integer; m integer; local_day date;
begin
 d:=translate(p_date,'٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹','01234567890123456789');
 if d !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then return null; end if;
 local_day:=d::date;
 t:=translate(p_time,'٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹','01234567890123456789');
 if t !~ '^[0-9]{1,2}:[0-9]{2}' then return null; end if;
 h:=split_part(t,':',1)::integer;m:=substring(split_part(t,':',2) from 1 for 2)::integer;
 if h>23 or m>59 then return null;end if;
 if t ~* '(pm|م)' and h<12 then h:=h+12;end if;
 if t ~* '(am|ص)' and h=12 then h:=0;end if;
 return (local_day+make_time(h,m,0)) at time zone 'Europe/Berlin';
exception when others then return null;
end $$;
revoke all on function public.cb_legacy_booking_start(text,text) from public,anon,authenticated;
grant execute on function public.cb_legacy_booking_start(text,text) to service_role;

create or replace function public.cb_booking_busy() returns jsonb language plpgsql security invoker set search_path=public as $$
declare result jsonb; legacy jsonb;
begin
 select coalesce(jsonb_agg(jsonb_build_object('reserved_start',reserved_start,'reserved_end',reserved_end)),'[]') into result from cb_appointments where status in ('pending','confirmed') and reserved_end > now();
 if to_regclass('public.booking_slots') is not null then
  execute $q$with source as (select cb_legacy_booking_start(to_jsonb(s)->>'booking_date',to_jsonb(s)->>'start_time') s, cb_legacy_booking_start(to_jsonb(s)->>'booking_date',to_jsonb(s)->>'end_time') e, cb_legacy_booking_start(to_jsonb(s)->>'booking_date','00:00') d from booking_slots s where to_jsonb(s)->>'status' in ('booked','blocked')) select coalesce(jsonb_agg(jsonb_build_object('reserved_start',case when s is null or e is null or e<=s then d else s end,'reserved_end',case when s is null or e is null or e<=s then d+interval '1 day' else e end)),'[]') from source where d is not null and coalesce(e,d+interval '1 day')>now()$q$ into legacy;
  result:=result||legacy;
 end if;
 if to_regclass('public.appointments') is not null then
  execute $q$with source as (select cb_legacy_booking_start(to_jsonb(a)->>'date',to_jsonb(a)->>'time') s, cb_legacy_booking_start(to_jsonb(a)->>'date','00:00') d from appointments a where coalesce(to_jsonb(a)->>'status','new') in ('new','confirmed','in_progress')) select coalesce(jsonb_agg(jsonb_build_object('reserved_start',coalesce(s,d),'reserved_end',case when s is null then d+interval '1 day' else s+interval '2 hours' end)),'[]') from source where d is not null and coalesce(s+interval '2 hours',d+interval '1 day')>now()$q$ into legacy;
  result:=result||legacy;
 end if;
 return result;
end $$;
revoke all on function public.cb_booking_busy() from public,anon,authenticated;
grant execute on function public.cb_booking_busy() to service_role;

-- All application access is server-side with service_role; public clients need no grants.
alter table public.appointments enable row level security;
revoke all on public.appointments from anon,authenticated;
grant all on public.appointments to service_role;
alter table public.customers enable row level security;
revoke all on public.customers from anon,authenticated;
grant all on public.customers to service_role;
alter table public.booking_slots enable row level security;
revoke all on public.booking_slots from anon,authenticated;
grant all on public.booking_slots to service_role;
alter table public.booking_available_days enable row level security;
revoke all on public.booking_available_days from anon,authenticated;
grant all on public.booking_available_days to service_role;
commit;
