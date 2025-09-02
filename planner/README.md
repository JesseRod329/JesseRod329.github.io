# Circular Daily Planner

A beautiful, intuitive daily planner with a circular time-based interface. Organize your day with visual task placement and export your planner as wallpapers or lockscreens.

## Features

### 🎨 Design
- **Circular Time Wheel**: 24-hour visual interface with hour markers
- **Theme Support**: Automatic light/dark mode based on system preference
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Clean Interface**: Minimalist design focused on usability

### ⏰ Task Management
- **Time-Based Scheduling**: Add tasks with specific times
- **Priority Levels**: Urgent, High, Medium, Low priority indicators
- **Visual Placement**: Tasks appear on the circular wheel at their scheduled time
- **Real-Time Updates**: Current time indicator shows progress through the day

### 📱 Export Options
- **Desktop Wallpapers**: Multiple resolutions (1920x1080, 4K, ultra-wide)
- **Phone Lockscreens**: 25+ phone models with correct aspect ratios
- **High Resolution**: 2x scaling for crisp, professional output
- **Theme-Aware**: Exports respect your current light/dark theme

### ♿ Accessibility
- **WCAG AA Compliant**: Full accessibility compliance
- **Keyboard Navigation**: Complete keyboard-only operation
- **Screen Reader Support**: ARIA labels and live regions
- **High Contrast**: Enhanced focus indicators and contrast support
- **Reduced Motion**: Respects user motion preferences

### 🔒 Privacy & Security
- **Client-Side Only**: All processing happens in your browser
- **No Data Collection**: Tasks stored locally, never transmitted
- **CSP Compliant**: Strict Content Security Policy
- **Progressive Enhancement**: Works without JavaScript

## Usage

1. **Add Personal Info**: Enter your name and planning date
2. **Create Tasks**: Add tasks with time, description, and priority
3. **Generate Planner**: Click "Generate Planner" to create your circular view
4. **Export**: Download as wallpaper or lockscreen for your devices

## Technical Details

### Performance
- **Bundle Size**: 88.8KB total (CSS + JS)
- **Lighthouse Score**: Optimized for >95 performance
- **First Contentful Paint**: <1.5s with resource preloading
- **GPU Acceleration**: Hardware-accelerated animations

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: HTML5 Canvas, CSS Grid, ES6+ JavaScript

### SEO & Social
- **Open Graph**: Rich social media previews
- **Twitter Cards**: Optimized Twitter sharing
- **Schema.org**: Structured data for search engines
- **Sitemap**: Included in main site sitemap

## Development

### Build Process
```bash
# Generate minified production files
node build.js

# Create Open Graph image
node generate-og-image.js
```

### File Structure
```
planner/
├── index.html              # Main application
├── css/
│   ├── themes.css          # Light/dark theme system
│   └── planner.css         # Main styles
├── js/
│   ├── form-handler.js     # Form interactions
│   ├── planner.js          # Core planner logic
│   └── canvas-export.js    # Export functionality
├── dist/                   # Production files
├── assets/                 # Images and resources
└── README.md              # This file
```

## License

Part of the Jesse Rodriguez portfolio. All rights reserved.

## Links

- **Live Demo**: [jesserodriguez.me/planner](https://jesserodriguez.me/planner)
- **Portfolio**: [jesserodriguez.me](https://jesserodriguez.me)
- **Source**: Available in portfolio repository
