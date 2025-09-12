# 🏆 Wrestling News Hub

A beautiful, glass-morphism styled wrestling news aggregator that displays Raw and SmackDown news in a split-screen layout. Built as a static site that can be deployed to GitHub Pages.

## ✨ Features

- **Glass UI Design**: Modern frosted glass effects with beautiful animations
- **Raw vs SmackDown Theme**: Red theme for Raw, blue theme for SmackDown
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **External Links**: Click any article to read the full story on the original site
- **Auto-refresh**: Automatically updates every 30 minutes
- **No Backend Required**: Pure HTML/CSS/JavaScript - perfect for GitHub Pages

## 🎨 Design Highlights

- **Split-screen layout** with Raw (red) on the left, SmackDown (blue) on the right
- **Glass morphism effects** with backdrop blur and transparency
- **Animated particles** in the background
- **Smooth hover effects** and transitions
- **Wrestling-inspired typography** using Orbitron and Roboto fonts

## 🚀 Getting Started

1. **Clone or download** this repository
2. **Open `index.html`** in your web browser
3. **Customize the news sources** by editing the JSON files in the `data/` folder
4. **Deploy to GitHub Pages** for live hosting

## 📁 Project Structure

```
wrestling-news/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # All styling and glass UI effects
├── js/
│   └── main.js            # JavaScript functionality
├── data/
│   ├── raw-news.json      # Raw news articles
│   └── smackdown-news.json # SmackDown news articles
└── README.md              # This file
```

## 🔧 Customization

### Adding News Sources

Edit the JSON files in the `data/` folder to add your own news articles:

```json
{
  "title": "Your Article Title",
  "summary": "Brief description of the article",
  "source": "News Source Name",
  "url": "https://example.com/article",
  "publishedAt": "2024-01-15T20:00:00Z"
}
```

### Styling

The CSS is organized with clear sections:
- `:root` - Color variables and design tokens
- `.background` - Background effects and particles
- `.news-section` - Main content areas
- `.glass-ui` - Glass morphism effects
- `@media` - Responsive design breakpoints

## 🌐 Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Your site will be live at `https://yourusername.github.io/repository-name`

### Other Static Hosts

This site works with any static hosting service:
- Netlify
- Vercel
- Surge.sh
- Firebase Hosting

## 🎯 Future Enhancements

- RSS feed integration for automatic news updates
- Search and filtering functionality
- Dark/light mode toggle
- Push notifications for breaking news
- Social media integration
- News categories and tags

## 🛠️ Technical Details

- **No Dependencies**: Pure vanilla HTML, CSS, and JavaScript
- **Mobile-First**: Responsive design that works on all devices
- **Performance**: Optimized for fast loading and smooth animations
- **Accessibility**: Semantic HTML and keyboard navigation support

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

---

**Made with ❤️ for wrestling fans everywhere!**
