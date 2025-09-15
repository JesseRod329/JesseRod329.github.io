# 📊 Google Trends Terminal Dashboard

A real-time Google Trends dashboard with a retro terminal aesthetic, built with React and styled-components.

![Dashboard Preview](https://trends.jesserodriguez.me/preview.png)

## 🚀 Live Demo

**[https://trends.jesserodriguez.me](https://trends.jesserodriguez.me)**

## ✨ Features

### 🖥️ Terminal Interface
- Authentic retro computing aesthetic
- Amber terminal color scheme
- Monospace fonts throughout
- ASCII-style borders and panels

### 📊 Real-time Data
- Live trending topics
- Stock ticker animation
- Regional interest breakdown
- Related search queries
- Auto-refreshing every 30 seconds

### 🎮 Interactive Controls
- **Click**: Select trends, open stock searches
- **Double-click**: Detailed trend analysis
- **Keyboard shortcuts**: Navigate with arrow keys, numbers 1-9
- **Search**: Press `/` to filter trends
- **Help**: Press `H` for keyboard shortcuts

### 🔍 Advanced Features
- Category filtering (TECH, FINANCE, POLITICS, etc.)
- Search functionality with live results
- Sparkline charts for 24-hour trends
- Sentiment analysis
- Geographic data visualization

## 🛠️ Technology Stack

- **Frontend**: React 19, Styled Components
- **Backend**: Node.js, Express, Google Trends API
- **Deployment**: GitHub Pages, Vercel
- **Icons**: Custom SVG components
- **Animation**: CSS keyframes, React transitions

## 🎯 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑/↓` | Navigate trends |
| `1-9` | Quick select trend |
| `ENTER` | Open trend details |
| `/` | Search & filter |
| `H` | Show help |
| `CTRL+R` | Refresh data |
| `ESC` | Close dialogs |

## 🏗️ Architecture

```
┌─────────────────┐    HTTP     ┌─────────────────┐    Node.js    ┌──────────────┐
│  React Frontend │ ──────────► │  Express Server │ ────────────► │ Google Trends│
│  (GitHub Pages) │             │  (Vercel)       │               │     API      │
└─────────────────┘             └─────────────────┘               └──────────────┘
```

## 🚀 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/JesseRod329/trends-dashboard.git
   cd trends-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   node server.js
   ```

4. **Start the React development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📦 Production Deployment

### Frontend (GitHub Pages)
```bash
npm run build
# Automatically deployed via GitHub Actions
```

### Backend (Vercel)
```bash
# Deploy server.js to Vercel
vercel --prod
```

## 🎨 Design Philosophy

This dashboard combines the nostalgic appeal of retro computing with modern web technologies. The terminal aesthetic isn't just visual - it's functional, providing an efficient, keyboard-driven interface for data exploration.

**Key Design Principles:**
- **Minimalist**: Clean, focused interface
- **Accessible**: Full keyboard navigation
- **Responsive**: Works on desktop and mobile
- **Fast**: Optimized for quick data access

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_API_BASE_URL=https://your-api-url.vercel.app
NODE_ENV=production
```

### Customization
- **Colors**: Edit `src/constants/terminal-theme.js`
- **Data Sources**: Modify `src/services/trendsService.js`
- **Mock Data**: Update `src/mocks/trends-data.js`

## 📊 Data Sources

- **Google Trends API**: Real trending search data
- **Enhanced Mock Data**: Fallback with realistic current trends
- **Stock Tickers**: Dynamic financial data simulation
- **Regional Interest**: Geographic search distribution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👨‍💻 About the Developer

**Jesse Rodriguez** - Full Stack Developer  
**Portfolio**: [jesserodriguez.me](https://jesserodriguez.me)  
**GitHub**: [@JesseRod329](https://github.com/JesseRod329)

---

*Built with ❤️ and lots of ☕ by Jesse Rodriguez*