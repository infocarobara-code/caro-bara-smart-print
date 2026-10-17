-- Independent disabled trial; no changes to existing sign-studio allowance.
create table public.cb_inquiry_trial_budget (
  id boolean primary key default true check (id),
  enabled boolean not null default false,
  limit_cents integer not null default 0 check (limit_cents between 0 and 500),
  reserved_cents integer not null default 0 check (reserved_cents >= 0),
  expires_at timestamptz,
  last_attempt_at timestamptz
);
alter table public.cb_inquiry_trial_budget enable row level security;
revoke all on public.cb_inquiry_trial_budget from public, anon, authenticated;
grant select, update on public.cb_inquiry_trial_budget to service_role;
insert into public.cb_inquiry_trial_budget (id) values (true);
create function public.cb_inquiry_trial_available() returns boolean
language sql security invoker set search_path = '' as $$
  select exists(select 1 from public.cb_inquiry_trial_budget
    where id and enabled and expires_at > now()
      and expires_at <= now() + interval '24 hours'
      and reserved_cents + 50 <= limit_cents);
$$;
create function public.cb_inquiry_trial_reserve() returns boolean
language plpgsql security invoker set search_path = '' as $$
begin
  update public.cb_inquiry_trial_budget
  set reserved_cents = reserved_cents + 50, last_attempt_at = clock_timestamp()
  where id and enabled and expires_at > now()
    and expires_at <= now() + interval '24 hours'
    and reserved_cents + 50 <= limit_cents;
  return found;
end;
$$;
revoke all on function public.cb_inquiry_trial_available() from public, anon, authenticated;
revoke all on function public.cb_inquiry_trial_reserve() from public, anon, authenticated;
grant execute on function public.cb_inquiry_trial_available() to service_role;
grant execute on function public.cb_inquiry_trial_reserve() to service_role;
