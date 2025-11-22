# Leaderboard 400 Error Fix

## Problem
The leaderboard.html page fails with "Failed to load resource: 400 (leaderboard)" because the Supabase views don't exist or have incorrect permissions.

## Root Cause
1. **Missing `leaderboard` view** - The main.js queries `leaderboard` for event-specific leaderboards, but this view wasn't defined in the data model
2. **Incorrect field names** - The existing views may not match what the frontend expects
3. **Missing permissions** - Views may not be accessible to the `anon` role

## Solution

### Step 1: Run SQL in Supabase SQL Editor
Execute the SQL commands in `/Users/jesse/Fantasy PICKS/fix-leaderboard-views.sql`:

```sql
-- This creates all three required views:
-- 1. leaderboard (event-specific)
-- 2. leaderboard_global (all-time)  
-- 3. leaderboard_weekly (weekly)

-- Plus sets proper permissions for anon role
```

### Step 2: Verify Views Work
After running the SQL, test each view:

```sql
-- Test event leaderboard
SELECT * FROM leaderboard LIMIT 5;

-- Test global leaderboard  
SELECT * FROM leaderboard_global LIMIT 5;

-- Test weekly leaderboard
SELECT * FROM leaderboard_weekly LIMIT 5;
```

### Step 3: Check Data Requirements
The views expect:
- `matches` table with `winner` and `method` fields populated
- `picks` table with user predictions
- `users` table with email addresses

If no data exists, the views will return empty results (not an error).

## Expected Results

### After Fix:
- ✅ No more 400 errors
- ✅ Leaderboard tabs load without errors
- ✅ Tables show data (if matches have results)
- ✅ Console shows successful data fetching

### Console Output Should Show:
```
LeaderboardSystem.fetchAndRender() called
Current tab: event
Loading event leaderboard
Event ID: [some-uuid]
Event leaderboard data: [...]
Rendering table with X rows
Table rendered successfully
```

## Troubleshooting

### If Still Getting 400 Errors:
1. Check Supabase logs for specific error messages
2. Verify views were created successfully
3. Check if `anon` role has SELECT permissions
4. Ensure tables have data with `winner` and `method` populated

### If Tables Are Empty:
1. Check if matches have `winner` and `method` set
2. Check if users have made predictions
3. Verify the JOIN conditions in the view queries

### If Permission Errors:
```sql
-- Grant additional permissions if needed
GRANT SELECT ON matches TO anon;
GRANT SELECT ON picks TO anon;  
GRANT SELECT ON users TO anon;
```

## Files Modified
- ✅ Created: `fix-leaderboard-views.sql` - SQL to create/fix views
- ✅ Created: `LEADERBOARD_FIX.md` - This documentation
- ✅ Existing: `main.js` - Already has proper query structure
- ✅ Existing: `leaderboard.html` - Already has proper UI structure

## Next Steps
1. Run the SQL in Supabase
2. Test the leaderboard page
3. Check console for successful data loading
4. Verify tables display data correctly
