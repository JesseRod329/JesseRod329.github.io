-- Batch save picks RPC enforcing RLS and user binding
-- Run in Supabase SQL editor

-- Function: save_picks(picks jsonb)
-- picks example: [{"match_id":"<uuid>","winner":"Name","method":"pinfall","extras":{"interference":true}}]

create or replace function public.save_picks(picks jsonb)
returns void
language plpgsql
security invoker -- rely on RLS for picks table
set search_path = public
as $$
declare
  rec jsonb;
begin
  if picks is null or jsonb_typeof(picks) <> 'array' then
    raise exception 'picks must be a json array';
  end if;

  -- Upsert all picks in one statement using jsonb_to_recordset
  insert into public.picks (user_id, event_id, match_id, winner, method, extras)
  select
    auth.uid() as user_id,
    m.event_id,
    r.match_id,
    nullif(trim(r.winner), '') as winner,
    nullif(lower(trim(r.method)), '') as method,
    coalesce(r.extras, '{}'::jsonb) as extras
  from jsonb_to_recordset(picks) as r(match_id uuid, winner text, method text, extras jsonb)
  join public.matches m on m.id = r.match_id
  on conflict (user_id, match_id) do update set
    winner = excluded.winner,
    method = excluded.method,
    extras = excluded.extras;
end;
$$;

grant execute on function public.save_picks(jsonb) to authenticated;

