-- User Profiles: columns, defaults, and RLS
-- Run in Supabase SQL editor

create schema if not exists public;

-- 1) Ensure columns exist
alter table public.users
  add column if not exists email text,
  add column if not exists display_name text,
  add column if not exists username text,
  add column if not exists avatar_url text,
  add column if not exists created_at timestamptz default now();

-- 2) Username uniqueness (case-insensitive)
create unique index if not exists users_username_unique_idx
  on public.users (lower(username));

-- 3) Defaulting function for username/display_name
create or replace function public.apply_user_defaults()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base text;
  candidate text;
  suffix int := 0;
begin
  -- Default display_name from email prefix
  if new.display_name is null or btrim(new.display_name) = '' then
    if new.email is not null then
      new.display_name := split_part(new.email, '@', 1);
    else
      new.display_name := 'User';
    end if;
  end if;

  -- Default username slug from email prefix
  if new.username is null or btrim(new.username) = '' then
    if new.email is not null then
      base := regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9_]+', '_', 'g');
    else
      base := 'user';
    end if;
    candidate := base;
    -- Ensure uniqueness by adding numeric suffix if needed
    while exists (select 1 from public.users u where lower(u.username) = lower(candidate) and u.id <> new.id) loop
      suffix := suffix + 1;
      candidate := base || '_' || suffix::text;
    end loop;
    new.username := candidate;
  end if;

  return new;
end;
$$;

drop trigger if exists set_user_defaults on public.users;
create trigger set_user_defaults
before insert or update on public.users
for each row execute function public.apply_user_defaults();

-- 4) RLS: users table (self access)
alter table public.users enable row level security;

drop policy if exists "Users can select own profile" on public.users;
drop policy if exists "Users can upsert own profile" on public.users;

create policy "Users can select own profile" on public.users
  for select using ( id = auth.uid() );

create policy "Users can upsert own profile" on public.users
  for all using ( id = auth.uid() )
  with check ( id = auth.uid() );

-- 5) Verify structure briefly
select 'users columns' as check, column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'users'
order by column_name;

