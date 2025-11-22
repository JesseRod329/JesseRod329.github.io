-- Scoring Logic Compatibility Layer
-- This migration adds wrapper RPCs to preserve old API calls while introducing new stable RPCs

-- Create schema if not exists
create schema if not exists public;

-- Wrapper RPC: leaderboard(event_id, extras)
-- Forwards to public.event_scores(event_id) for backward compatibility
create or replace function public.leaderboard(
    event_id uuid,
    extras jsonb default '{}'::jsonb
)
returns table (
    user_id uuid,
    email text,
    total_points integer,
    correct_winners integer,
    total_predictions integer,
    accuracy numeric
)
language plpgsql
security definer
as $$
begin
    -- Forward to the new event_scores RPC
    return query
    select 
        es.user_id,
        es.email,
        es.total_points,
        es.correct_winners,
        es.total_predictions,
        es.accuracy
    from public.event_scores(event_id) es
    order by es.total_points desc, es.accuracy desc;
end;
$$;

-- Wrapper RPC: calculate_scores(event_id, rules)
-- Forwards to public.event_scores(event_id) for backward compatibility
create or replace function public.calculate_scores(
    event_id uuid,
    rules jsonb default '{}'::jsonb
)
returns table (
    user_id uuid,
    email text,
    total_points integer,
    correct_winners integer,
    total_predictions integer,
    accuracy numeric
)
language plpgsql
security definer
as $$
begin
    -- Forward to the new event_scores RPC
    -- Note: rules parameter is ignored for now, but kept for compatibility
    return query
    select 
        es.user_id,
        es.email,
        es.total_points,
        es.correct_winners,
        es.total_predictions,
        es.accuracy
    from public.event_scores(event_id) es
    order by es.total_points desc, es.accuracy desc;
end;
$$;

-- Grant necessary permissions
grant execute on function public.leaderboard(uuid, jsonb) to authenticated, anon;
grant execute on function public.calculate_scores(uuid, jsonb) to authenticated, anon;

-- Verify the functions were created
select 
    routine_name,
    routine_type,
    data_type,
    'Wrapper RPC created successfully' as status
from information_schema.routines 
where routine_name in ('leaderboard', 'calculate_scores')
and routine_schema = 'public';

-- Test the wrapper functions (commented out - uncomment to test)
-- select * from public.leaderboard('your-event-id-here'::uuid);
-- select * from public.calculate_scores('your-event-id-here'::uuid);
