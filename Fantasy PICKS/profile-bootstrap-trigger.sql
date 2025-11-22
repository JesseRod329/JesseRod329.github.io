-- Profile Bootstrap Trigger Migration
-- This ensures a users row exists for each authenticated user automatically

-- Create schema if not exists (should already exist)
create schema if not exists public;

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Upsert profile row keyed by auth uid
  insert into public.users (id, email, created_at)
  values (new.id, new.email, now())
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger on auth.users
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant execute on function public.handle_new_user() to authenticated;

-- Verify the trigger was created
select 
  trigger_name, 
  event_manipulation, 
  action_timing, 
  action_statement
from information_schema.triggers 
where trigger_name = 'on_auth_user_created';
