# Fantasy Wrestling Booking - Project Outline

## File Structure

```
/mnt/okcomputer/output/
├── index.html              # Main landing page with hero and features
├── predictions.html        # Interactive prediction interface
├── leaderboard.html        # Scoring and rankings display
├── main.js                # Core JavaScript functionality
├── resources/             # Local images and assets
│   ├── hero-wrestling.jpg  # Generated hero image
│   ├── wrestler-*.jpg     # Individual wrestler profile images
│   ├── event-*.jpg        # Event poster images
│   ├── belt-*.jpg         # Championship belt images
│   └── bg-texture.jpg     # Background texture
├── interaction.md         # Interaction design documentation
├── design.md             # Visual design style guide
└── outline.md            # This project outline
```

## Page Breakdown

### index.html - Main Landing Page
**Purpose**: Introduce users to fantasy wrestling booking and showcase key features

**Sections**:
1. **Navigation Bar**
   - Logo and branding
   - Main navigation (Predictions, Leaderboard, About)
   - User account/login area

2. **Hero Section**
   - Dramatic wrestling-themed background image
   - Animated title with typewriter effect
   - Compelling tagline about fantasy wrestling
   - Call-to-action button to start predicting

3. **How It Works**
   - Three-step process visualization
   - Interactive cards showing prediction flow
   - Scoring system explanation

4. **Featured Events**
   - Upcoming WWE/AEW events carousel
   - Event posters with countdown timers
   - Quick prediction preview

5. **Leaderboard Preview**
   - Top 10 users with avatars and scores
   - Weekly and monthly rankings
   - Achievement badges display

6. **Features Showcase**
   - League creation and management
   - Real-time scoring updates
   - Social features and challenges

### predictions.html - Interactive Booking Interface
**Purpose**: Allow users to make predictions on upcoming wrestling events

**Sections**:
1. **Event Selection**
   - Dropdown menu of upcoming events
   - Event details (date, venue, promotion)
   - Match card preview

2. **Prediction Interface**
   - Match-by-match prediction cards
   - Wrestler selection with images
   - Method of victory dropdowns
   - Bonus prediction toggles

3. **Live Scoring Tracker**
   - Real-time match results
   - Points awarded animation
   - Progress tracking

4. **Prediction Summary**
   - Review all selections before submission
   - Confidence meter
   - Submit and lock predictions

### leaderboard.html - Scoring and Rankings
**Purpose**: Display comprehensive scoring and competitive rankings

**Sections**:
1. **Global Rankings**
   - All-time top performers
   - Monthly and weekly leaders
   - Achievement statistics

2. **League Management**
   - Create/join private leagues
   - League-specific leaderboards
   - Member management

3. **Personal Statistics**
   - Individual performance metrics
   - Prediction accuracy rates
   - Streak tracking

4. **Achievements**
   - Badge collection display
   - Unlock requirements
   - Progress tracking

## Interactive Components

### Prediction Cards
- **Functionality**: Click to select winners and prediction methods
- **Visual**: Wrestler images with gold selection borders
- **Animation**: Smooth transitions and hover effects

### Scoring Dashboard
- **Functionality**: Real-time point updates and match tracking
- **Visual**: Championship belt-inspired progress indicators
- **Animation**: Particle effects for point gains

### League Hub
- **Functionality**: Social competition and chat features
- **Visual**: Member grid with performance metrics
- **Animation**: Live updates and notifications

### Achievement System
- **Functionality**: Unlock badges for various accomplishments
- **Visual**: Wrestling title belt designs
- **Animation**: Unlock celebrations with confetti

## Data Structure

### Events
```javascript
{
  id: "event-001",
  name: "WWE Crown Jewel",
  date: "2025-10-11",
  promotion: "WWE",
  venue: "RAC Arena, Perth",
  matches: [...],
  status: "upcoming"
}
```

### Matches
```javascript
{
  id: "match-001",
  eventId: "event-001",
  competitors: ["Cody Rhodes", "Seth Rollins"],
  title: "WWE Championship",
  type: "singles",
  result: null
}
```

### Predictions
```javascript
{
  userId: "user-001",
  eventId: "event-001",
  predictions: {
    "match-001": {
      winner: "Cody Rhodes",
      method: "pinfall",
      extras: {
        interference: false,
        titleChange: true
      }
    }
  },
  submittedAt: "2025-09-27T18:00:00Z",
  locked: true
}
```

### Scoring
```javascript
{
  userId: "user-001",
  eventId: "event-001",
  totalPoints: 45,
  breakdown: {
    correctWinner: 30,
    correctMethod: 10,
    correctExtras: 5
  },
  accuracy: 0.75
}
```

## Technical Features

### Real-time Updates
- WebSocket-style updates using setInterval for demo
- Live scoring during events
- Leaderboard position changes

### Data Persistence
- Local storage for user preferences
- Session storage for current predictions
- Mock database with realistic wrestling data

### Responsive Design
- Mobile-optimized prediction interface
- Touch-friendly interaction elements
- Adaptive layouts for different screen sizes

### Performance Optimization
- Lazy loading for wrestler images
- Efficient animation using transform/opacity
- Minimal JavaScript bundle size

## Content Requirements

### Images Needed
- Hero background: Wrestling arena atmosphere
- Wrestler profiles: 20+ top WWE/AEW wrestlers
- Championship belts: Major title designs
- Event posters: Upcoming PPV artwork
- UI elements: Icons, badges, backgrounds

### Text Content
- Event descriptions and match cards
- Scoring explanations and rules
- Achievement descriptions
- User interface copy and help text

### Audio Elements
- Crowd reaction sounds for correct predictions
- Notification sounds for updates
- Ambient arena atmosphere (optional)