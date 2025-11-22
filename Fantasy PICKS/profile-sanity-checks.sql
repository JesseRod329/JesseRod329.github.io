-- Profile Bootstrap Sanity Checks
-- Copy/paste these queries to run interactively when signed in
-- NOTE: These SELECT/INSERTs assume you're executing as an authenticated user token.
-- They will fail on purpose if RLS or lock_time blocks them (as intended).

-- 1) Confirm demo event
select id, name, date, lock_time from public.events where name = 'Demo PPV';

-- 2) Grab its matches (note the UUIDs returned)
select id, title from public.matches m
join public.events e on e.id = m.event_id
where e.name = 'Demo PPV'
order by title;

-- 3) Try a pick upsert (replace :match_id with an actual UUID from step 2)
-- Example: Replace :match_id with actual UUID from step 2
-- insert into public.picks (user_id, event_id, match_id, winner, method, extras)
-- select auth.uid(), e.id, 'REPLACE_WITH_ACTUAL_MATCH_ID', 'Alpha', 'Pin', jsonb_build_object('blood','no','table','no')
-- from public.events e where e.name = 'Demo PPV'
-- on conflict (user_id, match_id) do update
-- set winner = excluded.winner,
--     method = excluded.method,
--     extras = excluded.extras;

-- 4) Admin: set an official result for that match (run as your admin account)
-- Example: Replace :match_id with actual UUID from step 2
-- update public.matches set winner = 'Alpha', method = 'Pin', extras = jsonb_build_object('blood','no','table','no')
-- where id = 'REPLACE_WITH_ACTUAL_MATCH_ID';

-- 5) View leaderboard tables (relies on your existing views)
select * from public.leaderboard        where event_id in (select id from events where name='Demo PPV') order by total_points desc;
select * from public.leaderboard_global order by total_points desc;
select * from public.leaderboard_weekly order by week desc, total_points desc;

-- 6) Test profile creation (should work for authenticated user)
insert into public.users (id, email, display_name) 
values (auth.uid(), 'test@example.com', 'Test User') 
on conflict (id) do update set 
  email = excluded.email,
  display_name = excluded.display_name;

-- 7) Verify profile exists
select id, email, display_name, created_at 
from public.users 
where id = auth.uid();

-- 8) Test RLS - should only see your own profile
select count(*) as total_profiles_visible,
       'Should be 1 (only your own record due to RLS)' as note
from public.users;

-- 9) Test unique constraint on picks
-- This should fail if you try to insert duplicate (user_id, match_id)
-- insert into public.picks (user_id, event_id, match_id, winner, method, extras)
-- select auth.uid(), e.id, 'SAME_MATCH_ID', 'Different Winner', 'Submission', '{}'::jsonb
-- from public.events e where e.name = 'Demo PPV';

-- 10) Verify trigger function exists
select 
  routine_name,
  routine_type,
  security_type,
  'Trigger function exists' as status
from information_schema.routines 
where routine_name = 'handle_new_user'
and routine_schema = 'public';

-- 11) Verify trigger exists
select 
  trigger_name, 
  event_manipulation, 
  action_timing, 
  action_statement,
  'Trigger exists and is active' as status
from information_schema.triggers 
where trigger_name = 'on_auth_user_created';

-- 12) Test lock_time functionality
-- This should work if lock_time is in the future
select 
  name,
  lock_time,
  case 
    when lock_time > now() then 'Predictions OPEN'
    else 'Predictions CLOSED'
  end as status
from public.events 
where name = 'Demo PPV';
