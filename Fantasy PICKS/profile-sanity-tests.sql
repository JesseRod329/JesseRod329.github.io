-- Profile Bootstrap Sanity Tests
-- Run these tests in Supabase SQL Editor as an authenticated user

-- Test 1: Should succeed - Insert/upsert your own profile
-- This should work because RLS allows users to manage their own data
insert into public.users (id, display_name, email) 
values (auth.uid(), 'Test User', 'test@example.com') 
on conflict (id) do update set 
  display_name = excluded.display_name,
  email = excluded.email;

-- Test 2: Should return exactly one row (yours)
-- This verifies RLS is working and you can only see your own data
select 
  id, 
  email, 
  display_name, 
  created_at,
  'This should be your user record' as note
from public.users 
where id = auth.uid();

-- Test 3: Should return 0 rows (other users' data)
-- This verifies RLS prevents access to other users' data
select 
  id, 
  email, 
  display_name,
  'This should be empty due to RLS' as note
from public.users 
where id != auth.uid()
limit 5;

-- Test 4: Should be denied - Try to update another user's record
-- This should fail with RLS error
-- Uncomment the line below to test (it should fail):
-- update public.users set display_name='HACKED' where id != auth.uid();

-- Test 5: Verify trigger function exists
select 
  routine_name,
  routine_type,
  security_type
from information_schema.routines 
where routine_name = 'handle_new_user';

-- Test 6: Verify trigger exists
select 
  trigger_name, 
  event_manipulation, 
  action_timing, 
  action_statement,
  'Trigger should exist for automatic profile creation' as note
from information_schema.triggers 
where trigger_name = 'on_auth_user_created';

-- Test 7: Test profile creation via auth.users (if you have admin access)
-- This would normally be triggered automatically when a new user signs up
-- Uncomment to test (requires admin privileges):
-- insert into auth.users (id, email, created_at) 
-- values (gen_random_uuid(), 'trigger-test@example.com', now());

-- Test 8: Verify RLS policies exist
select 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies 
where tablename = 'users' 
and schemaname = 'public';

-- Test 9: Count total users (should only see your own due to RLS)
select 
  count(*) as total_users_visible,
  'Should be 1 (only your own record)' as note
from public.users;

-- Test 10: Verify user data structure
select 
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns 
where table_name = 'users' 
and table_schema = 'public'
order by ordinal_position;
