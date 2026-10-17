-- Isolated owner trial: EUR 5 maximum authorization; reserve EUR .50 for each
-- of at most 10 calls, without refunds. This is not provider billing telemetry.
create table public.cb_sign_trial_budget (
  id boolean primary key default true check (id),
  enabled boolean not null default false,
  attempts integer not null default 0 check (attempts between 0 and 10),
  expires_at timestamptz not null,
  last_attempt_at timestamptz
);
alter table public.cb_sign_trial_budget enable row level security;
revoke all on public.cb_sign_trial_budget from public, anon, authenticated;
grant select, update on public.cb_sign_trial_budget to service_role;
insert into public.cb_sign_trial_budget (id,expires_at) values (true,'2026-10-18T10:00:00Z');

create function public.cb_sign_trial_reserve() returns boolean
language plpgsql security invoker set search_path = '' as $$
declare reserved boolean;
begin
  update public.cb_sign_trial_budget
  set attempts=attempts+1, last_attempt_at=clock_timestamp()
  where id=true and enabled and attempts<10 and expires_at>clock_timestamp()
    and (last_attempt_at is null or last_attempt_at<clock_timestamp()-interval '15 seconds')
  returning true into reserved;
  return coalesce(reserved,false);
end;
$$;
revoke all on function public.cb_sign_trial_reserve() from public, anon, authenticated;
grant execute on function public.cb_sign_trial_reserve() to service_role;
