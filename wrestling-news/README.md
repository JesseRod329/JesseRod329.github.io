# Wrestling News Hub

A beautiful, modern wrestling news website featuring a clean glassmorphic UI design. Stay updated with the latest news from WWE, AEW, and the wrestling world.

## Features

- 🎨 **Glassmorphic Design** - Modern frosted glass UI with beautiful animations
- 📱 **Responsive Layout** - Works perfectly on desktop, tablet, and mobile devices
- 🔍 **Smart Filtering** - Filter news by WWE, AEW, Indies, or Breaking news
- ⚡ **Fast Loading** - Optimized performance with smooth animations
- 🎯 **Clean Interface** - Simple, intuitive design focused on content

## Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Glassmorphic styling with backdrop filters and animations
- **Vanilla JavaScript** - No frameworks, pure JS for maximum performance
- **Font Awesome** - Icons for enhanced visual appeal
- **Google Fonts** - Inter font family for modern typography

## Design Features

### Glassmorphism Effects
- Semi-transparent backgrounds with backdrop blur
- Subtle borders and shadows for depth
- Smooth hover animations and transitions
- Gradient orbs for dynamic background effects

### Responsive Design
- Mobile-first approach
- Flexible grid layout that adapts to screen size
- Touch-friendly interface elements
- Optimized typography scaling

### User Experience
- Intuitive navigation with active states
- Smooth scrolling and transitions
- Loading states and error handling
- Keyboard navigation support (Ctrl/Cmd + R to refresh)

## File Structure

```
wrestling-news/
├── index.html          # Main HTML structure
├── styles.css          # Glassmorphic CSS styling
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## Getting Started

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Enjoy** the wrestling news with beautiful glass UI!

No build process or dependencies required - it's a pure HTML/CSS/JS website.

## Data Sources

The site integrates with multiple real data sources to provide comprehensive wrestling news:

### ✅ **Active Data Sources**
- **Reddit r/SquaredCircle** - Community discussions and news via RSS feed
- **Wrestling News RSS Feeds** - Multiple sources including:
  - Wrestling Inc. RSS Feed
  - Cageside Seats RSS Feed  
  - Wrestling News RSS Feed
  - Fightful RSS Feed
- **Wikipedia API** - Event information and wrestler biographies
- **Cagematch.net** - Wrestling database integration (simulated)

### 🔧 **Technical Implementation**
- **CORS Proxy** - Uses `api.allorigins.win` to bypass CORS restrictions
- **RSS Parsing** - Native JavaScript DOMParser for XML parsing
- **API Integration** - Direct Wikipedia API calls for structured data
- **Fallback System** - Graceful degradation to mock data if sources fail

### 📊 **Data Processing**
- **Smart Categorization** - Automatic WWE/AEW/Indies classification
- **Tag Generation** - Dynamic tags based on content analysis
- **Breaking News Detection** - Identifies urgent news items
- **Source Attribution** - Clear indication of data origin

## Customization

### Colors
The color scheme can be easily customized by modifying the CSS variables in `styles.css`:

```css
/* Main gradient background */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Accent colors */
--primary-color: #ff6b6b;
--secondary-color: #4ecdc4;
--tertiary-color: #f093fb;
```

### Content
To add real data sources, modify the `fetchWrestlingNews()` function in `script.js` to integrate with actual RSS feeds or APIs.

### Styling
The glassmorphic effects can be adjusted by modifying the backdrop-filter and background properties in the `.glass-card` class.

## Browser Support

- ✅ Chrome 76+
- ✅ Firefox 78+
- ✅ Safari 13+
- ✅ Edge 79+

*Note: Glassmorphic effects require backdrop-filter support*

## Performance

- **Lightweight** - No external dependencies
- **Fast Loading** - Optimized CSS and JavaScript
- **Smooth Animations** - Hardware-accelerated transitions
- **Mobile Optimized** - Touch-friendly interactions

## Future Enhancements

- [ ] Real-time RSS feed integration
- [ ] Search functionality
- [ ] Article bookmarking
- [ ] Dark/light theme toggle
- [ ] Push notifications for breaking news
- [ ] Social media sharing
- [ ] Comments system
- [ ] User preferences

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the wrestling news hub!

---

**Made with ❤️ for wrestling fans everywhere!**
