# Fantasy Wrestling Booking - Design Style Guide

## Design Philosophy

**Visual Language**: Modern wrestling entertainment aesthetic that combines the intensity of live sports with the sophistication of fantasy gaming platforms. The design captures the raw energy and spectacle of professional wrestling while maintaining clean, user-friendly interfaces for strategic gameplay.

**Color Palette**: 
- Primary: Deep charcoal (#1a1a1a) and rich gold (#d4af37) for championship prestige
- Secondary: Electric blue (#0066cc) for interactive elements and energy
- Accent: Crimson red (#dc143c) for action buttons and highlights
- Neutral: Warm gray (#f5f5f5) for backgrounds and text areas
- Success: Championship gold (#ffd700) for winning predictions
- Warning: Arena orange (#ff6b35) for countdown timers

**Typography**:
- Display Font: "Bebas Neue" - Bold, condensed sans-serif that evokes wrestling promotion posters
- Heading Font: "Roboto Slab" - Strong, readable serif for section headers
- Body Font: "Inter" - Clean, modern sans-serif for optimal readability
- Accent Font: "Orbitron" - Futuristic font for scoring and technical elements

## Visual Effects & Styling

**Background Treatment**:
- Primary background: Subtle arena crowd texture with dark overlay
- Section dividers: Championship belt-inspired decorative elements
- Interactive areas: Slight gradient overlays with wrestling ring rope textures

**Animation Library Usage**:
- **Anime.js**: Smooth transitions for prediction cards, scoring animations, and leaderboard updates
- **Typed.js**: Dynamic text effects for wrestler introductions and event announcements
- **Splitting.js**: Letter-by-letter animations for dramatic title reveals
- **ECharts.js**: Interactive data visualizations for scoring breakdowns and statistics

**Interactive Elements**:
- Prediction cards with hover effects that lift like championship belts
- Smooth slide transitions between match predictions
- Pulsing countdown timers with arena spotlight effects
- Confetti animations for correct predictions using CSS and Anime.js

**Header Effects**:
- Dynamic background with subtle wrestling ring canvas texture
- Animated championship belt icons rotating on scroll
- Spotlight effects following mouse movement using shader-park
- Parallax scrolling with arena crowd silhouettes

**Image Treatment**:
- Wrestler profile images with circular frames and gold borders
- Event cards with dramatic vignetting and spotlight effects
- Championship belt icons with metallic gradients and shadows
- Hero images with cinematic color grading and contrast

**Scroll Motion**:
- Gentle fade-in animations for prediction cards (opacity 0.9 to 1.0)
- Subtle upward movement (16px) for content sections
- Staggered animations for leaderboard entries
- Parallax effects for background elements (limited to 8% movement)

**Hover Effects**:
- Prediction cards lift with expanded shadows and gold glow
- Wrestler images scale slightly with overlay information
- Buttons transform with metallic shine effects
- Navigation items underline with championship belt styling

## Component Styling

**Prediction Interface**:
- Card-based layout with wrestling poster aesthetic
- Gold accent borders for selected predictions
- Real-time validation with arena-style lighting
- Progress indicators styled like match round cards

**Scoring Dashboard**:
- Championship belt-inspired progress bars
- Animated point counters with crowd reaction sounds
- Color-coded accuracy using wrestling turnbuckle colors
- Visual feedback styled like arena scoreboards

**Leaderboard Design**:
- Tiered ranking system with championship hierarchy
- User avatars in wrestling-style profile frames
- Achievement badges designed like wrestling titles
- Streak indicators using arena spotlight metaphors

**Mobile Responsiveness**:
- Touch-friendly prediction buttons sized for mobile
- Swipe gestures for navigating between matches
- Optimized typography scaling for smaller screens
- Simplified animations that maintain performance

## Technical Implementation

**CSS Framework**: Tailwind CSS for rapid development and consistent spacing
**Animation Performance**: Hardware-accelerated transforms and opacity changes
**Loading States**: Skeleton screens styled like wrestling event posters
**Error Handling**: Wrestling-themed error messages with championship belt graphics
**Accessibility**: High contrast ratios and keyboard navigation support

## Brand Integration

**Wrestling Authenticity**: 
- Real wrestler imagery and authentic event data
- Championship belt designs and wrestling terminology
- Arena atmosphere recreated through visual effects
- Professional wrestling color schemes and styling

**Fantasy Gaming Elements**:
- Clean, modern interface design
- Intuitive user experience flow
- Gamification elements with wrestling themes
- Social features styled like wrestling factions