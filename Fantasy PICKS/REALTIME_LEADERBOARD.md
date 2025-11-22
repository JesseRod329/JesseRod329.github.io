# Real-Time Leaderboard — Implementation Guide

## Overview

The `js/leaderboard-realtime.js` module provides real-time leaderboard updates using Supabase Realtime subscriptions. This enables instant leaderboard changes when users make picks or match results are updated.

---

## Features

### 1. Real-Time Subscriptions
- **Picks Table:** Monitor when users submit new predictions
- **Matches Table:** Track when match results are posted
- **Match Completions:** Auto-refresh materialized views when matches finish

### 2. Live Scoring Computation
- Calculate user scores in real-time without waiting for DB refresh
- Immediate feedback on prediction accuracy
- Support for winner, method, and bonus point calculations

### 3. Manual Refresh Controls
- Batch reload leaderboard data from materialized views
- Support for pagination (limit, offset)
- Query by leaderboard type (global, event, weekly)

### 4. Unified API
- Single initialization function for all real-time features
- Automatic cleanup to prevent memory leaks
- Configurable auto-refresh behavior

---

## Installation & Setup

### Prerequisites
- Supabase project with Real-Time enabled
- Tables: `users`, `matches`, `picks`
- Materialized views: `leaderboard_global_mv`, `leaderboard_event_mv`, `leaderboard_weekly_mv`

### Enable Supabase Realtime

In Supabase dashboard:
1. Go to **Realtime** settings
2. Enable for `public` schema
3. Enable for `matches` and `picks` tables

### Import Module
```javascript
import {
  subscribeToLeaderboardUpdates,
  initializeRealtimeLeaderboard,
  refreshLeaderboardData,
  computeLiveLeaderboardEntry
} from './js/leaderboard-realtime.js';
```

---

## Usage Examples

### Basic Setup - Auto-Refresh on Match Completion

```javascript
const realtimeLeaderboard = initializeRealtimeLeaderboard({
  onUpdate: (table, payload) => {
    console.log(`${table} updated:`, payload);
    // Trigger UI update here
  },
  autoRefreshMV: true // Auto-refresh materialized views
});

// Later: Cleanup when page unloads
window.addEventListener('beforeunload', () => {
  realtimeLeaderboard.cleanup();
});
```

### Manual Leaderboard Refresh

```javascript
// Refresh global leaderboard
const leaderboardData = await realtimeLeaderboard.refresh();

// Or use the raw function
import { refreshLeaderboardData } from './js/leaderboard-realtime.js';

const data = await refreshLeaderboardData('global', {
  limit: 50,
  offset: 0
});

// For event leaderboard
const eventData = await refreshLeaderboardData('event', {
  limit: 100,
  offset: 0
});
```

### Live Score Computation

```javascript
import { computeLiveLeaderboardEntry } from './js/leaderboard-realtime.js';

const userPicks = [
  { match_id: 1, prediction: { winner: 'wrestler1', method: 'pin', bonuses: [] } },
  { match_id: 2, prediction: { winner: 'wrestler2', method: 'submission', bonuses: ['blood'] } }
];

const matchResults = [
  { id: 1, winner: 'wrestler1', method: 'pin', bonuses: [] },
  { id: 2, winner: 'wrestler2', method: 'submission', bonuses: ['blood'] }
];

const score = computeLiveLeaderboardEntry(userPicks, matchResults);
console.log(`Score: ${score.totalPoints}, Accuracy: ${score.accuracy}%`);
// Output: Score: 30, Accuracy: 100%
```

### Custom Update Handling

```javascript
function handleLeaderboardUpdate(table, payload) {
  if (table === 'matches') {
    console.log('Match updated:', payload.new);
    // Update match display
    updateMatchUI(payload.new);
  } else if (table === 'picks') {
    console.log('User made a pick:', payload.new);
    // Refresh leaderboard ranking
    refreshLeaderboardUI();
  }
}

const unsub = subscribeToLeaderboardUpdates(handleLeaderboardUpdate);

// Later: Stop listening
unsub();
```

### Integration with Leaderboard Page

```javascript
// In leaderboard.html
import { initializeRealtimeLeaderboard } from './js/leaderboard-realtime.js';

let realtimeControl = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize with update callback
  realtimeControl = initializeRealtimeLeaderboard({
    onUpdate: (table, payload) => {
      console.log('Real-time update received');
      // Re-render leaderboard section
      rerenderLeaderboard();
    },
    autoRefreshMV: true
  });

  // Initial load
  await rerenderLeaderboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (realtimeControl) {
    realtimeControl.cleanup();
  }
});

async function rerenderLeaderboard() {
  const data = await realtimeControl.refresh();
  renderLeaderboardTable(data);
}
```

---

## API Reference

### `initializeRealtimeLeaderboard(config)`

Initialize all real-time leaderboard features.

**Parameters:**
- `config.onUpdate` (Function, optional) - Callback when data changes
- `config.autoRefreshMV` (Boolean, optional, default: true) - Auto-refresh materialized views

**Returns:**
```javascript
{
  cleanup: Function,        // Call to stop all subscriptions
  refresh: Function,        // Reload leaderboard data
  computeEntry: Function    // Compute live scores
}
```

**Example:**
```javascript
const control = initializeRealtimeLeaderboard({
  onUpdate: (table, payload) => console.log(table, payload),
  autoRefreshMV: true
});
```

---

### `subscribeToLeaderboardUpdates(onUpdate)`

Subscribe to picks and matches table changes.

**Parameters:**
- `onUpdate` (Function) - Callback `(table, payload) => void`

**Returns:**
- Cleanup function to unsubscribe

**Example:**
```javascript
const unsubscribe = subscribeToLeaderboardUpdates((table, payload) => {
  console.log(`Table: ${table}`, payload);
});

// Later
unsubscribe();
```

---

### `refreshLeaderboardData(leaderboardView, options)`

Fetch fresh leaderboard data from materialized views.

**Parameters:**
- `leaderboardView` (String, default: 'global') - 'global', 'event', or 'weekly'
- `options.limit` (Number, default: 50) - Rows to fetch
- `options.offset` (Number, default: 0) - Pagination offset

**Returns:** Promise<Array> - Leaderboard entries

**Example:**
```javascript
const globalLeaderboard = await refreshLeaderboardData('global', {
  limit: 100,
  offset: 0
});

const eventLeaderboard = await refreshLeaderboardData('event', {
  limit: 50,
  offset: 50 // Page 2
});
```

---

### `computeLiveLeaderboardEntry(userPicks, matchResults)`

Compute live score for a user without waiting for DB refresh.

**Parameters:**
- `userPicks` (Array) - User's predictions
- `matchResults` (Array) - Match results from DB

**Returns:**
```javascript
{
  correctWinners: Number,    // Count of correct winner predictions
  correctMethods: Number,    // Count of correct method predictions
  correctBonuses: Number,    // Count of events with correct bonuses
  totalPoints: Number,       // Total points earned
  accuracy: Number           // Accuracy percentage (0-100)
}
```

**Example:**
```javascript
const score = computeLiveLeaderboardEntry(picks, matches);
// { correctWinners: 2, correctMethods: 1, correctBonuses: 1, totalPoints: 30, accuracy: 100 }
```

---

### `subscribeToMatchCompletions()`

Listen specifically for match results and auto-refresh leaderboard views.

**Returns:** Cleanup function

**Example:**
```javascript
const cleanup = subscribeToMatchCompletions();
// Auto-refreshes leaderboard MVs when matches complete

// Later
cleanup();
```

---

## Performance Considerations

### Database
- **Materialized Views:** Leaderboard queries hit pre-computed MVs (O(1) for top rankings)
- **Real-Time Subscriptions:** Minimal overhead; filters at database level
- **Batch Refresh:** Use pagination for large datasets (limit 50-100 per page)

### Memory
- Subscriptions are automatically cleaned up when you call `cleanup()`
- Avoid creating multiple subscriptions for same table
- Remove event listeners when pages unload

### Network
- Real-Time uses WebSocket connection; minimal bandwidth
- Payload includes only changed fields (not entire row)
- Consider debouncing UI updates if high frequency

### Best Practices

1. **Initialize Once Per Page:**
   ```javascript
   const realtimeLeaderboard = initializeRealtimeLeaderboard(...);
   // Don't create multiple subscriptions for same view
   ```

2. **Cleanup on Page Unload:**
   ```javascript
   window.addEventListener('beforeunload', () => {
     realtimeLeaderboard.cleanup();
   });
   ```

3. **Debounce UI Updates:**
   ```javascript
   const debouncedUpdate = debounce(() => rerenderLeaderboard(), 500);
   
   const control = initializeRealtimeLeaderboard({
     onUpdate: debouncedUpdate,
     autoRefreshMV: true
   });
   ```

4. **Handle Errors Gracefully:**
   ```javascript
   const control = initializeRealtimeLeaderboard({
     onUpdate: (table, payload) => {
       try {
         rerenderLeaderboard();
       } catch (e) {
         console.error('Failed to update UI:', e);
       }
     }
   });
   ```

---

## Troubleshooting

### "Supabase not initialized" Error

**Cause:** Module imported before Supabase client is available

**Solution:** Import after `await initializeApp()`
```javascript
import { initializeApp } from './js/init.js';
import { initializeRealtimeLeaderboard } from './js/leaderboard-realtime.js';

await initializeApp();
const control = initializeRealtimeLeaderboard(...); // Safe now
```

### No Real-Time Updates

**Cause:** Real-Time not enabled in Supabase settings

**Solution:**
1. Go to Supabase dashboard → Realtime
2. Enable for `public` schema
3. Enable for `matches` and `picks` tables

### Materialized View Not Refreshing

**Cause:** `refresh_leaderboards()` RPC doesn't exist

**Solution:** Run SQL migration `leaderboard-materialized.sql` in Supabase
```sql
select public.refresh_leaderboards();
```

### Memory Leak / High CPU

**Cause:** Multiple subscriptions or missing cleanup

**Solution:** Ensure cleanup is called
```javascript
window.addEventListener('beforeunload', () => {
  realtimeControl?.cleanup();
});
```

---

## Future Enhancements

1. **Selective Updates:** Only refresh section of leaderboard that changed
2. **Optimistic Updates:** Update UI immediately before server confirmation
3. **Compression:** Compress real-time payloads for mobile users
4. **Caching:** Cache leaderboard data locally with TTL
5. **Analytics:** Track real-time performance metrics

---

## Related Documentation

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) — Architecture overview
- [design.md](./design.md) — UI/UX design guidelines






