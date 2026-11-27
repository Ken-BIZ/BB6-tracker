-- Google 登入 第 1 步：成員對照表（可以先跑，不影響現在的網站）
-- 哪個公司信箱是哪位成員。不在表裡的 @hcatwn.com 帳號登入後只能檢視。
-- 在 Supabase → SQL Editor 貼上整份 → Run。

create table if not exists public.bb6_members (
  email text primary key check (email = lower(email)),
  name  text not null check (name in ('Daniel', 'Ken', 'Ellen'))
);
alter table public.bb6_members enable row level security;

-- Signed in with Google on the company domain
create or replace function public.bb6_is_company() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') ilike '%@hcatwn.com'
     and coalesce(auth.jwt() -> 'app_metadata' ->> 'provider', '') = 'google'
$$;

-- The BB6 member behind this sign-in, or null for view-only accounts
create or replace function public.bb6_member() returns text
language sql stable security definer set search_path = public as $$
  select m.name from public.bb6_members m
  where public.bb6_is_company() and m.email = lower(auth.jwt() ->> 'email')
$$;

drop policy if exists "company read members" on public.bb6_members;
create policy "company read members" on public.bb6_members
  for select to authenticated using (public.bb6_is_company());

-- 成員信箱（全部小寫）；之後加人或換信箱，改這裡再跑一次即可
insert into public.bb6_members (email, name) values
  ('daniel@hcatwn.com', 'Daniel'),
  ('ken.lai@hcatwn.com', 'Ken'),
  ('ellen@hcatwn.com',  'Ellen')
on conflict (email) do update set name = excluded.name;
