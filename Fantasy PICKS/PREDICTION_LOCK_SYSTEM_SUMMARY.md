# Prediction Lock System Implementation Summary

## Overview
Implemented a comprehensive prediction lock system that enforces deadlines on predictions using database constraints, real-time countdown timers, and UI state management.

## Database Changes

### 1. Events Table Updates
- **Added `lock_time` column**: `TIMESTAMPTZ` field marking when predictions close
- **Default value**: 2 hours before event start time
- **Constraint**: `NOT NULL` for data integrity

### 2. RLS Policy Updates
- **New function**: `is_event_locked(event_id)` checks if event is locked
- **Updated policies**: Users can only insert/update picks before lock_time
- **Read access**: Users can always read their own past predictions

### 3. Database Views
- **`event_lock_status`**: View showing lock status for all events
- **Permissions**: Granted to `anon` and `authenticated` roles

## Frontend Implementation

### 1. HTML Updates (predictions.html)
- **Lock Banner**: Red banner shown when event is locked
- **Countdown Timer**: Real-time countdown with color-coded urgency
- **Visual States**: Clear indication of locked vs. open events

### 2. CountdownSystem (main.js)
- **Real-time Updates**: Updates every second
- **Color Coding**: 
  - Green: > 1 hour remaining
  - Orange: < 1 hour remaining  
  - Red: < 10 minutes remaining
- **Auto-lock**: Automatically disables UI when timer reaches zero

### 3. UI State Management
- **Locked State**: Disables all inputs, submit button, event selector
- **Visual Feedback**: Opacity changes, cursor changes, button text updates
- **Error Handling**: Clear error messages for locked attempts

## Key Features

### 1. Real-time Countdown
```javascript
// Updates every second with color coding
updateCountdown: (lockTime) => {
    const timeLeft = lockTime - now;
    // Color changes based on time remaining
    if (timeLeft <= 600000) { // 10 minutes
        countdownContainer.classList.add('bg-red-600');
    } else if (timeLeft <= 3600000) { // 1 hour
        countdownContainer.classList.add('bg-orange-600');
    }
}
```

### 2. Lock Checking
```javascript
// Check event lock before saving
const { data: eventData } = await sb
    .from('events')
    .select('lock_time')
    .eq('id', eventId)
    .single();

if (eventData && eventData.lock_time && new Date(eventData.lock_time) <= new Date()) {
    Utils.showNotification('Predictions are closed for this event.', 'error');
    return;
}
```

### 3. UI State Management
```javascript
disablePredictionUI: () => {
    // Disable all inputs
    const inputs = document.querySelectorAll('#matchList input, #matchList select, #matchList button');
    inputs.forEach(input => {
        input.disabled = true;
        input.classList.add('opacity-50', 'cursor-not-allowed');
    });
    
    // Update submit button
    submitBtn.textContent = 'Predictions Locked';
}
```

## Database Schema

### Events Table
```sql
ALTER TABLE events ADD COLUMN lock_time TIMESTAMPTZ;
UPDATE events SET lock_time = date - INTERVAL '2 hours' WHERE lock_time IS NULL;
ALTER TABLE events ALTER COLUMN lock_time SET NOT NULL;
```

### RLS Policies
```sql
CREATE POLICY "Users can insert picks before lock_time" ON picks
    FOR INSERT WITH CHECK (
        auth.uid() = user_id 
        AND NOT is_event_locked((SELECT event_id FROM matches WHERE id = match_id))
    );
```

## User Experience

### 1. Visual States
- **Open Event**: Countdown timer with time remaining
- **Locked Event**: Red banner with lock icon
- **Near Lock**: Color-coded urgency (yellow → orange → red)

### 2. Error Handling
- **Locked Attempts**: "Predictions are closed for this event."
- **Database Errors**: Graceful fallback with user-friendly messages
- **Network Issues**: Clear error notifications

### 3. Accessibility
- **Disabled States**: Clear visual indication of disabled inputs
- **Screen Readers**: Proper ARIA labels and states
- **Keyboard Navigation**: Respects disabled states

## Testing

### 1. Test Scenarios
- **Future Event**: Countdown shows, UI enabled
- **Past Event**: Lock banner shows, UI disabled
- **Near Lock**: Color changes, auto-lock at zero
- **Locked Attempts**: Error messages, database blocks

### 2. Console Output
```
CountdownSystem.init() called
CountdownSystem.start() called with event: {...}
Starting countdown for event: [Event Name]
Countdown reached zero, locking predictions
Disabling prediction UI due to lock
```

## Files Modified

### 1. Database
- ✅ Created: `add-prediction-lock-system.sql` - Complete database setup

### 2. Frontend
- ✅ Modified: `predictions.html` - Added lock banner and countdown container
- ✅ Modified: `main.js` - Added CountdownSystem and lock checking logic

### 3. Testing
- ✅ Created: `test-lock-system.html` - Interactive test page
- ✅ Created: `PREDICTION_LOCK_SYSTEM_SUMMARY.md` - This documentation

## Security Features

### 1. Database Level
- **RLS Policies**: Enforce lock_time constraints at database level
- **Function Security**: `is_event_locked()` function with proper permissions
- **Data Integrity**: NOT NULL constraints on lock_time

### 2. Application Level
- **Client-side Checks**: Prevent unnecessary API calls
- **Error Handling**: Graceful handling of locked attempts
- **State Management**: Consistent UI state across all interactions

## Performance Considerations

### 1. Real-time Updates
- **Efficient Timer**: Single setInterval per event
- **Memory Management**: Proper cleanup when switching events
- **DOM Updates**: Minimal DOM manipulation for performance

### 2. Database Queries
- **Optimized Queries**: Single query to check lock status
- **Caching**: Event data cached in CountdownSystem
- **Error Handling**: Graceful degradation on query failures

## Next Steps

### 1. Database Setup
1. Run `add-prediction-lock-system.sql` in Supabase SQL Editor
2. Verify views and policies are created correctly
3. Test with sample events

### 2. Frontend Testing
1. Open `test-lock-system.html` for testing instructions
2. Test with events having different lock times
3. Verify countdown timer and lock banner functionality

### 3. Production Deployment
1. Ensure all events have proper lock_time values
2. Test with real user scenarios
3. Monitor console for any errors

## Troubleshooting

### Common Issues
- **Countdown not showing**: Check if event has lock_time set
- **UI not disabling**: Verify CountdownSystem.start() is called
- **Database errors**: Check RLS policies are applied correctly
- **Timer not updating**: Check for JavaScript errors in console

### Debug Steps
1. Check console for CountdownSystem messages
2. Verify event data includes lock_time
3. Test database queries directly in Supabase
4. Check RLS policies are working correctly

The prediction lock system is now fully implemented with comprehensive database constraints, real-time UI updates, and robust error handling! 🔒⏰
