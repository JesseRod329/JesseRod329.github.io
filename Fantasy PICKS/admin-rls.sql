-- Admin RLS and helpers for secure results updates
-- Run in Supabase SQL editor

-- 1) Admins table (list of admin emails)
create table if not exists public.admins (
  email text primary key
);

-- Optional: seed your admin
-- insert into public.admins(email) values ('jesse.rodriguez89@gmail.com')
-- on conflict do nothing;

-- 2) Helper: is_admin() for current auth user
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.users u
    join public.admins a on a.email = u.email
    where u.id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- 3) Enforce RLS on matches
alter table public.matches enable row level security;

-- Remove conflicting policies if they exist (adjust names if different)
drop policy if exists "update matches" on public.matches;
drop policy if exists "insert matches" on public.matches;

-- Allow only admins to update/insert match results
create policy "Admins can update matches" on public.matches
  for update using ( public.is_admin() )
  with check ( public.is_admin() );

create policy "Admins can insert matches" on public.matches
  for insert with check ( public.is_admin() );

-- Read remains unrestricted (or add appropriate select policy)
-- Example: allow read to everyone
drop policy if exists "select matches" on public.matches;
create policy "select matches" on public.matches
  for select using ( true );

-- 4) Verify
select 'is_admin for current user' as check, public.is_admin();
-- Try an update as authenticated user to confirm enforcement
-- update public.matches set method = method where false; -- no-op

