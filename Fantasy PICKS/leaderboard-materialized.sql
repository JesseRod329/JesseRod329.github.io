-- Optional: Materialized leaderboards for performance
-- Run in Supabase SQL editor

-- Create materialized views
create materialized view if not exists public.leaderboard_mv as
select 
  u.email,
  p.event_id,
  count(*) filter (where p.winner = m.winner and p.method = m.method) as correct,
  count(*) as total,
  coalesce(round(
    (count(*) filter (where p.winner = m.winner and p.method = m.method))::numeric / nullif(count(*),0), 2
  ), 0) as accuracy
from public.picks p
join public.matches m on m.id = p.match_id
join public.users u on u.id = p.user_id
where m.winner is not null and m.method is not null
group by u.email, p.event_id
with no data;

create materialized view if not exists public.leaderboard_global_mv as
select 
  u.email,
  count(*) filter (where p.winner = m.winner and p.method = m.method) as correct,
  count(*) as total,
  coalesce(round(
    (count(*) filter (where p.winner = m.winner and p.method = m.method))::numeric / nullif(count(*),0), 2
  ), 0) as accuracy
from public.picks p
join public.matches m on m.id = p.match_id
join public.users u on u.id = p.user_id
where m.winner is not null and m.method is not null
group by u.email
with no data;

create materialized view if not exists public.leaderboard_weekly_mv as
select 
  u.email,
  count(*) filter (where p.winner = m.winner and p.method = m.method) as correct,
  count(*) as total,
  coalesce(round(
    (count(*) filter (where p.winner = m.winner and p.method = m.method))::numeric / nullif(count(*),0), 2
  ), 0) as accuracy,
  date_trunc('week', p.submitted_at) as week
from public.picks p
join public.matches m on m.id = p.match_id
join public.users u on u.id = p.user_id
where m.winner is not null and m.method is not null
group by u.email, date_trunc('week', p.submitted_at)
with no data;

-- Refresh function
create or replace function public.refresh_leaderboards()
returns void language plpgsql security definer as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;
  refresh materialized view concurrently public.leaderboard_mv;
  refresh materialized view concurrently public.leaderboard_global_mv;
  refresh materialized view concurrently public.leaderboard_weekly_mv;
end; $$;

grant select on public.leaderboard_mv, public.leaderboard_global_mv, public.leaderboard_weekly_mv to anon, authenticated;
grant execute on function public.refresh_leaderboards() to authenticated;
