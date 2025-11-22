# Scoring Logic Compatibility Layer

## Overview
This document outlines the implementation of a compatibility layer for scoring logic, preserving old API calls while introducing new stable RPCs.

## SQL Wrapper RPCs

### 1. `public.leaderboard(event_id uuid, extras jsonb default '{}')`
- **Purpose**: Legacy API wrapper for backward compatibility
- **Forwards to**: `public.event_scores(event_id)`
- **Parameters**: 
  - `event_id`: UUID of the event
  - `extras`: JSONB object (ignored, kept for compatibility)
- **Returns**: Table with user_id, email, total_points, correct_winners, total_predictions, accuracy
- **Security**: SECURITY DEFINER with proper permissions

### 2. `public.calculate_scores(event_id uuid, rules jsonb default '{}')`
- **Purpose**: Legacy API wrapper for backward compatibility
- **Forwards to**: `public.event_scores(event_id)`
- **Parameters**:
  - `event_id`: UUID of the event
  - `rules`: JSONB object (ignored, kept for compatibility)
- **Returns**: Table with user_id, email, total_points, correct_winners, total_predictions, accuracy
- **Security**: SECURITY DEFINER with proper permissions

## Client Helper Functions

### 1. `ApiHelpers.apiLeaderboard(eventId, extras = {})`
- **Purpose**: Legacy API call with backward compatibility
- **Parameters**:
  - `eventId`: UUID of the event
  - `extras`: Object with additional parameters (default: {})
- **Returns**: Promise resolving to leaderboard data
- **Usage**: `await ApiHelpers.apiLeaderboard(eventId, {extras: true})`

### 2. `ApiHelpers.apiEventScores(eventId)`
- **Purpose**: New preferred API call to stable RPC
- **Parameters**:
  - `eventId`: UUID of the event
- **Returns**: Promise resolving to event scores data
- **Usage**: `await ApiHelpers.apiEventScores(eventId)`

### 3. `ApiHelpers.getLeaderboardData(eventId, useLegacy = false)`
- **Purpose**: Helper with automatic fallback logic
- **Parameters**:
  - `eventId`: UUID of the event
  - `useLegacy`: Boolean to force legacy API usage
- **Returns**: Promise resolving to leaderboard data
- **Fallback**: Automatically falls back to legacy API if new API fails
- **Usage**: `await ApiHelpers.getLeaderboardData(eventId, false)`

## JSONB Comparison Fixes

### Search Results
- **Files Searched**: All JavaScript and SQL files in the project
- **Patterns Searched**: 
  - `jsonb = text`
  - `jsonb = '`
  - `extras = '`
  - `jsonb = "`
- **Results**: No problematic JSONB comparison patterns found

### Current JSONB Usage
All JSONB operations in the codebase use proper patterns:

1. **Object Construction**:
   ```javascript
   const extras = {
       titleChange: !!checkbox.checked,
       interference: !!checkbox.checked,
       // ... other properties
   };
   ```

2. **Object Comparison**:
   ```javascript
   const extrasCorrect = Object.keys(extras).every(key => 
       predictionExtras[key] === extras[key]
   );
   ```

3. **Database Operations**:
   ```javascript
   await window.sb.from('matches').update({
       winner,
       method,
       extras  // Properly constructed object
   });
   ```

## Migration Steps

1. **Run SQL Migration**:
   ```sql
   -- Execute scoring-compatibility-layer.sql
   \i scoring-compatibility-layer.sql
   ```

2. **Update Client Code** (if needed):
   ```javascript
   // Old way (still works)
   const data = await ApiHelpers.apiLeaderboard(eventId, extras);
   
   // New preferred way
   const data = await ApiHelpers.apiEventScores(eventId);
   
   // With fallback
   const data = await ApiHelpers.getLeaderboardData(eventId, false);
   ```

3. **Test Compatibility**:
   - Run `test-scoring-compatibility.html`
   - Verify both legacy and new APIs work
   - Test fallback behavior

## Error Handling

All API functions include comprehensive error handling:

- **Console Logging**: Detailed logs for debugging
- **Error Propagation**: Errors are properly thrown for caller handling
- **Fallback Logic**: Automatic fallback from new API to legacy API
- **User Notifications**: Error messages displayed to users when appropriate

## Testing

### Manual Testing
1. Load `test-scoring-compatibility.html`
2. Sign in with Google
3. Run test functions:
   - Test Legacy API
   - Test New API
   - Test Fallback

### Console Testing
```javascript
// Test legacy API
await window.FantasyWrestling.ApiHelpers.apiLeaderboard('event-id');

// Test new API
await window.FantasyWrestling.ApiHelpers.apiEventScores('event-id');

// Test fallback
await window.FantasyWrestling.ApiHelpers.getLeaderboardData('event-id', false);
```

## Files Created/Modified

### New Files
- `scoring-compatibility-layer.sql` - SQL migration with wrapper RPCs
- `test-scoring-compatibility.html` - Interactive test page
- `SCORING_COMPATIBILITY_NOTES.md` - This documentation

### Modified Files
- `main.js` - Added ApiHelpers object with client functions

## Backward Compatibility

✅ **Preserved**: All existing API calls continue to work
✅ **Enhanced**: New stable RPCs available
✅ **Fallback**: Automatic fallback ensures reliability
✅ **Documentation**: Complete usage examples provided

## Future Migration Path

1. **Phase 1** (Current): Compatibility layer with both APIs
2. **Phase 2** (Future): Update all code to use new API
3. **Phase 3** (Future): Remove legacy API wrappers

This approach ensures zero downtime and allows for gradual migration.
