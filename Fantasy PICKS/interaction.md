# Fantasy Wrestling Booking - Interaction Design

## Core Game Loop Interactions

### 1. Event Prediction System
**Primary Interaction**: Users select upcoming wrestling events and make predictions
- **Event Selection**: Dropdown/filter system showing upcoming WWE/AEW events with dates
- **Match Card Display**: Visual cards showing scheduled matches with wrestler images
- **Prediction Interface**: 
  - Click to select winner for each match
  - Method of victory dropdown (pinfall, submission, DQ, countout)
  - Bonus predictions: interference yes/no, title change yes/no
  - Prop bets: blood spot, table spot, surprise return
- **Lock System**: Countdown timer showing when predictions lock (2 hours before event)
- **Submit Button**: Saves predictions and shows confirmation

### 2. Live Scoring Dashboard
**Real-time Updates**: Points awarded as matches conclude
- **Live Event Tracker**: Current match status with real-time scoring
- **Points Breakdown**: Visual breakdown of how points are earned
  - +10 for correct winner
  - +5 for correct finish method
  - +3 for correct fall participant
  - +5 for title change prediction
  - +2 for stipulation correct
  - +1 for match occurrence prediction
- **Progress Bars**: Visual representation of current event progress
- **Instant Notifications**: Popup alerts when points are awarded

### 3. League Management System
**Social Competition**: Create and join private/public leagues
- **League Creation**: Form to create new leagues with custom scoring rules
- **Join League**: Search and join existing leagues with invite codes
- **League Dashboard**: 
  - Member list with avatars and current standings
  - Weekly matchups between league members
  - League chat/message board
  - Custom league settings and scoring modifications

### 4. Leaderboard & Statistics
**Competitive Tracking**: Comprehensive scoring and ranking system
- **Global Leaderboard**: All-time rankings with user profiles
- **Season Standings**: Current season performance tracking
- **Weekly Rankings**: Short-term competition results
- **Streak Tracking**: Current hot streaks and longest streaks
- **Achievement Badges**: Unlockable badges for various accomplishments
- **Detailed Stats**: Individual user statistics and prediction accuracy

## Interactive Components Details

### Prediction Card Component
- Wrestler images with names and titles
- Radio buttons for winner selection
- Dropdown menus for method predictions
- Toggle switches for bonus props
- Visual feedback for completed predictions
- Save/lock indicator with timestamp

### Live Scoring Component
- Real-time match status updates
- Animated point additions with sound effects
- Match timeline showing completed predictions
- Color-coded accuracy (green=correct, red=incorrect)
- Cumulative score display with animations

### League Hub Component
- League member grid with current scores
- Weekly challenge system
- Head-to-head matchup displays
- League-specific leaderboards
- Social features and trash talk

### Achievement System
- Badge collection with unlock animations
- Progress bars for achievement goals
- Special seasonal challenges
- Milestone celebrations with visual effects

## User Flow Examples

### New User Onboarding
1. Welcome screen with wrestling-themed intro
2. Account creation with wrestling persona setup
3. League join/creation wizard
4. First prediction tutorial with sample event
5. Achievement unlocked notifications

### Making Predictions
1. Browse upcoming events on dashboard
2. Select event to predict
3. Review match card with wrestler info
4. Make selections using intuitive interface
5. Submit and share predictions with league
6. Wait for lock period with countdown timer

### Event Night Experience
1. Join live event tracking
2. Watch real-time scoring updates
3. Celebrate correct predictions with animations
4. Track league standings changes
5. Discuss results in league chat

## Technical Implementation Notes
- All interactions use local storage for persistence
- Mock real-time updates with setInterval for demo
- Pre-populate with realistic wrestling event data
- Responsive design for mobile prediction making
- Smooth animations using Anime.js for engagement