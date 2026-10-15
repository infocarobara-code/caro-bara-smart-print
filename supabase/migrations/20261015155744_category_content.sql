create table if not exists public.cb_category_content (
 id boolean primary key default true check (id),
 revision integer not null default 0 check (revision >= 0),
 draft jsonb not null default '{"version":1,"entries":[]}'::jsonb check (jsonb_typeof(draft)='object'),
 published jsonb not null default '{"version":1,"entries":[]}'::jsonb check (jsonb_typeof(published)='object'),
 published_at timestamptz
);
alter table public.cb_category_content enable row level security;
revoke all on public.cb_category_content from public, anon, authenticated;
grant select,update on public.cb_category_content to service_role;
insert into public.cb_category_content(id) values(true) on conflict(id) do nothing;
