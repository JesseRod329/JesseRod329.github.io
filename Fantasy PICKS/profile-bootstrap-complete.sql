-- Profile Bootstrap Complete Migration
-- A) Profile bootstrap on signup (idempotent)
-- B) Picks unique constraint (safe upsert target)
-- C) Demo seed (idempotent)
-- D) Sanity checks (interactive)

-- A) SQL — Profile bootstrap on signup (idempotent)
-- Creates a public.users row automatically for each new auth.users entry.
-- If your public.users DOES NOT have an email column, comment it out below.

create schema if not exists public;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- B) SQL — Picks unique constraint (safe upsert target)
-- Ensures one pick per user per match (keeps your upsert path reliable).

do $$
begin
  if not exists (
    select 1
    from   pg_indexes
    where  schemaname = 'public'
    and    indexname = 'uniq_picks_user_match'
  ) then
    alter table public.picks
    add constraint uniq_picks_user_match unique (user_id, match_id);
  end if;
end$$;

-- C) SQL — Demo seed (idempotent)
-- Seeds one event with two matches you can use immediately.
-- [Inference] Uses today's date and a lock_time 24h from now for easy testing.

do $$
declare
  v_event uuid;
  v_m1 uuid;
  v_m2 uuid;
begin
  -- Event: Demo PPV
  select id into v_event
  from public.events
  where name = 'Demo PPV';

  if v_event is null then
    insert into public.events (name, date, lock_time)
    values ('Demo PPV', current_date, now() + interval '24 hours')
    returning id into v_event;
  end if;

  -- Match 1
  select id into v_m1
  from public.matches
  where event_id = v_event and title = 'Alpha vs Bravo';

  if v_m1 is null then
    insert into public.matches (event_id, title, winner, method, extras)
    values (v_event, 'Alpha vs Bravo', null, null, null)
    returning id into v_m1;
  end if;

  -- Match 2
  select id into v_m2
  from public.matches
  where event_id = v_event and title = 'Charlie vs Delta';

  if v_m2 is null then
    insert into public.matches (event_id, title, winner, method, extras)
    values (v_event, 'Charlie vs Delta', null, null, null)
    returning id into v_m2;
  end if;
end $$;

-- Grant necessary permissions
grant execute on function public.handle_new_user() to authenticated;
grant usage on schema public to authenticated;

-- Verify the trigger was created
select 
  trigger_name, 
  event_manipulation, 
  action_timing, 
  action_statement,
  'Profile bootstrap trigger created successfully' as status
from information_schema.triggers 
where trigger_name = 'on_auth_user_created';

-- Verify the unique constraint was created
select 
  constraint_name,
  table_name,
  'Unique constraint created successfully' as status
from information_schema.table_constraints 
where constraint_name = 'uniq_picks_user_match'
and table_schema = 'public';

-- Verify demo data was created
select 
  'Demo event created' as status,
  id,
  name,
  date,
  lock_time
from public.events 
where name = 'Demo PPV';

select 
  'Demo matches created' as status,
  m.id,
  m.title,
  e.name as event_name
from public.matches m
join public.events e on e.id = m.event_id
where e.name = 'Demo PPV'
order by m.title;
