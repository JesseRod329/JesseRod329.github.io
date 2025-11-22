-- Fix leaderboard views for Fantasy Wrestling Platform
-- Run these commands in Supabase SQL Editor

-- 1. Create the missing 'leaderboard' view for event-specific leaderboards
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
    u.email,
    p.event_id,
    COUNT(*) FILTER (WHERE p.winner = m.winner AND p.method = m.method) as correct,
    COUNT(*) as total,
    ROUND(
        COUNT(*) FILTER (WHERE p.winner = m.winner AND p.method = m.method)::decimal / 
        NULLIF(COUNT(*), 0), 
        2
    ) as accuracy
FROM picks p
JOIN matches m ON m.id = p.match_id
JOIN users u ON u.id = p.user_id
WHERE m.winner IS NOT NULL AND m.method IS NOT NULL
GROUP BY u.email, p.event_id
ORDER BY correct DESC, total DESC;

-- 2. Update the leaderboard_global view to match the expected structure
CREATE OR REPLACE VIEW leaderboard_global AS
SELECT 
    u.email,
    COUNT(*) FILTER (WHERE p.winner = m.winner AND p.method = m.method) as correct,
    COUNT(*) as total,
    ROUND(
        COUNT(*) FILTER (WHERE p.winner = m.winner AND p.method = m.method)::decimal / 
        NULLIF(COUNT(*), 0), 
        2
    ) as accuracy
FROM picks p
JOIN matches m ON m.id = p.match_id
JOIN users u ON u.id = p.user_id
WHERE m.winner IS NOT NULL AND m.method IS NOT NULL
GROUP BY u.email
ORDER BY correct DESC, total DESC;

-- 3. Update the leaderboard_weekly view to match the expected structure
CREATE OR REPLACE VIEW leaderboard_weekly AS
SELECT 
    u.email,
    COUNT(*) FILTER (WHERE p.winner = m.winner AND p.method = m.method) as correct,
    COUNT(*) as total,
    ROUND(
        COUNT(*) FILTER (WHERE p.winner = m.winner AND p.method = m.method)::decimal / 
        NULLIF(COUNT(*), 0), 
        2
    ) as accuracy,
    DATE_TRUNC('week', p.submitted_at) as week_start
FROM picks p
JOIN matches m ON m.id = p.match_id
JOIN users u ON u.id = p.user_id
WHERE m.winner IS NOT NULL AND m.method IS NOT NULL
    AND p.submitted_at >= CURRENT_DATE - INTERVAL '52 weeks'
GROUP BY u.email, DATE_TRUNC('week', p.submitted_at)
ORDER BY week_start DESC, correct DESC, total DESC;

-- 4. Set security invoker for all views
ALTER VIEW leaderboard SET (security_invoker = true);
ALTER VIEW leaderboard_global SET (security_invoker = true);
ALTER VIEW leaderboard_weekly SET (security_invoker = true);

-- 5. Grant select permissions to anon role
GRANT SELECT ON leaderboard TO anon;
GRANT SELECT ON leaderboard_global TO anon;
GRANT SELECT ON leaderboard_weekly TO anon;

-- 6. Test the views
SELECT 'Testing leaderboard view...' as status;
SELECT * FROM leaderboard LIMIT 5;

SELECT 'Testing leaderboard_global view...' as status;
SELECT * FROM leaderboard_global LIMIT 5;

SELECT 'Testing leaderboard_weekly view...' as status;
SELECT * FROM leaderboard_weekly LIMIT 5;
