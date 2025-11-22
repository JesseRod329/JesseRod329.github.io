-- Secure Admin RPCs for updating match results
-- Run in Supabase SQL editor after admin-rls.sql

-- 1) Single-match upsert (update existing match)
create or replace function public.admin_upsert_match_result(
  match_id uuid,
  winner text,
  method text,
  extras jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  update public.matches
  set winner = admin_upsert_match_result.winner,
      method = lower(coalesce(admin_upsert_match_result.method, method)),
      extras = coalesce(admin_upsert_match_result.extras, '{}'::jsonb)
  where id = admin_upsert_match_result.match_id;
end;
$$;

grant execute on function public.admin_upsert_match_result(uuid, text, text, jsonb) to authenticated;

-- 2) Bulk upsert via JSON array: [{id, winner, method, extras}, ...]
create or replace function public.admin_upsert_matches(
  updates jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  rec jsonb;
  _id uuid;
  _winner text;
  _method text;
  _extras jsonb;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  if updates is null or jsonb_typeof(updates) <> 'array' then
    raise exception 'updates must be a json array';
  end if;

  for rec in select jsonb_array_elements(updates)
  loop
    _id := (rec->>'id')::uuid;
    _winner := rec->>'winner';
    _method := rec->>'method';
    _extras := coalesce(rec->'extras', '{}'::jsonb);

    update public.matches set
      winner = _winner,
      method = lower(coalesce(_method, method)),
      extras = coalesce(_extras, '{}'::jsonb)
    where id = _id;
  end loop;
end;
$$;

grant execute on function public.admin_upsert_matches(jsonb) to authenticated;

