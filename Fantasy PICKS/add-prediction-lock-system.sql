-- Add Prediction Lock System to Fantasy Wrestling Platform
-- Run these commands in Supabase SQL Editor

-- 1. Add lock_time column to events table
ALTER TABLE events 
ADD COLUMN lock_time TIMESTAMPTZ;

-- 2. Update existing events to have lock_time (2 hours before event date)
UPDATE events 
SET lock_time = date - INTERVAL '2 hours'
WHERE lock_time IS NULL;

-- 3. Set default lock_time for future events (2 hours before event date)
ALTER TABLE events 
ALTER COLUMN lock_time SET DEFAULT (date - INTERVAL '2 hours');

-- 4. Make lock_time NOT NULL for data integrity
ALTER TABLE events 
ALTER COLUMN lock_time SET NOT NULL;

-- 5. Create function to check if event is locked
CREATE OR REPLACE FUNCTION is_event_locked(event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM events 
        WHERE id = event_id 
        AND lock_time <= NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Update RLS policy for picks table to enforce lock_time
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert their own picks" ON picks;
DROP POLICY IF EXISTS "Users can update their own picks" ON picks;

-- Create new policies that check lock_time
CREATE POLICY "Users can insert picks before lock_time" ON picks
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        AND NOT is_event_locked(
            (SELECT event_id FROM matches WHERE id = match_id)
        )
    );

CREATE POLICY "Users can update picks before lock_time" ON picks
    FOR UPDATE
    USING (
        auth.uid() = user_id 
        AND NOT is_event_locked(
            (SELECT event_id FROM matches WHERE id = match_id)
        )
    );

-- Keep existing read policy (users can always read their own picks)
CREATE POLICY "Users can read their own picks" ON picks
    FOR SELECT
    USING (auth.uid() = user_id);

-- 7. Create view for event lock status (useful for frontend)
CREATE OR REPLACE VIEW event_lock_status AS
SELECT 
    e.id,
    e.name,
    e.date,
    e.lock_time,
    e.status,
    CASE 
        WHEN e.lock_time <= NOW() THEN true
        ELSE false
    END as is_locked,
    CASE 
        WHEN e.lock_time <= NOW() THEN 'locked'
        WHEN e.lock_time <= NOW() + INTERVAL '1 hour' THEN 'warning'
        ELSE 'open'
    END as lock_status,
    EXTRACT(EPOCH FROM (e.lock_time - NOW())) as seconds_until_lock
FROM events e
WHERE e.status IN ('upcoming', 'live');

-- 8. Grant permissions for the new view
GRANT SELECT ON event_lock_status TO anon;
GRANT SELECT ON event_lock_status TO authenticated;

-- 9. Test the lock system
SELECT 'Testing lock system...' as status;

-- Test with a future event
INSERT INTO events (name, date, promotion, venue, status) 
VALUES ('Test Event', NOW() + INTERVAL '1 day', 'WWE', 'Test Arena', 'upcoming')
RETURNING id, name, lock_time, is_event_locked(id);

-- Test with a past event (should be locked)
INSERT INTO events (name, date, promotion, venue, status) 
VALUES ('Past Event', NOW() - INTERVAL '1 day', 'WWE', 'Test Arena', 'upcoming')
RETURNING id, name, lock_time, is_event_locked(id);

-- Show all events with lock status
SELECT * FROM event_lock_status ORDER BY date DESC;
