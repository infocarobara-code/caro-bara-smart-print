-- Internal wakeups carry no customer data and grant only a single queue dispatch.
-- No permanent API key, credential, or paid external scheduler is introduced.
begin;
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
create table if not exists public.cb_booking_wakeups (
 ticket uuid primary key default gen_random_uuid(), expires_at timestamptz not null default now()+interval '2 minutes', used_at timestamptz
);
alter table public.cb_booking_wakeups enable row level security;
revoke all on public.cb_booking_wakeups from anon,authenticated;
grant all on public.cb_booking_wakeups to service_role;
create or replace function public.cb_booking_consume_wakeup(p_ticket uuid) returns boolean language plpgsql security invoker set search_path=public as $$
declare changed integer;
begin
 update cb_booking_wakeups set used_at=now() where ticket=p_ticket and expires_at>now() and used_at is null;
 get diagnostics changed=row_count;return changed=1;
end $$;
create or replace function public.cb_booking_wakeup() returns void language plpgsql security invoker set search_path=public as $$
declare token uuid;
begin
 delete from cb_booking_wakeups where expires_at<now()-interval '1 day';
 if not exists(select 1 from cb_booking_outbox where sent_at is null and attempts<5 and created_at>now()-interval '23 hours' and (leased_until is null or leased_until<now())) then return;end if;
 insert into cb_booking_wakeups default values returning ticket into token;
 perform net.http_post(url:='https://caro-bara-smart-print.vercel.app/api/appointments/notifications',body:=jsonb_build_object('ticket',token),headers:='{"Content-Type":"application/json"}'::jsonb,timeout_milliseconds:=5000);
end $$;
revoke all on function public.cb_booking_consume_wakeup(uuid),public.cb_booking_wakeup() from public,anon,authenticated;
grant execute on function public.cb_booking_consume_wakeup(uuid) to service_role;
-- cron runs as the migration owner. Public callers cannot mint wakeups.
select cron.schedule('carobara-booking-outbox','*/5 * * * *','select public.cb_booking_wakeup();');
commit;
