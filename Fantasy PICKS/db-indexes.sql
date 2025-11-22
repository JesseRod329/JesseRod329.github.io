-- Recommended indexes for scaling
-- Run in Supabase SQL editor

-- Events by date
create index if not exists events_date_idx on public.events(date);

-- Matches by event and order
create index if not exists matches_event_order_idx on public.matches(event_id, match_order);
create index if not exists matches_event_id_idx on public.matches(event_id);

-- Picks unique key and access patterns
-- Ensure unique constraint exists for (user_id, match_id)
alter table public.picks
  add constraint if not exists picks_user_match_uniq unique (user_id, match_id);

create index if not exists picks_user_id_idx on public.picks(user_id);
create index if not exists picks_match_id_idx on public.picks(match_id);
create index if not exists picks_event_id_idx on public.picks(event_id);

