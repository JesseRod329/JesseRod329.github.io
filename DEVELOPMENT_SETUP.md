# Development Setup - HTML5 + Tailwind CSS + Three.js

This project uses a modern tech stack for creating interactive, visually stunning web experiences.

## 🛠️ Tech Stack

- **HTML5**: Semantic structure and content
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Three.js**: 3D graphics and animations
- **JavaScript (ES6+)**: Modern JavaScript with modules
- **Vite**: Fast build tool and development server

## 📦 Dependencies Installed

### Core Dependencies
- `three`: ^0.160.0 - 3D graphics library
- `vite`: ^5.0.0 - Build tool and dev server

### Development Dependencies
- `tailwindcss`: ^3.4.0 - CSS framework
- `autoprefixer`: ^10.4.16 - CSS vendor prefixing
- `postcss`: ^8.4.32 - CSS processing
- `@types/three`: ^0.160.0 - TypeScript definitions

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Mode
```bash
npm run dev
```
This starts Vite dev server at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
/
├── src/
│   ├── css/
│   │   └── input.css          # Tailwind input with custom styles
│   ├── js/
│   │   ├── main.js            # Main application logic
│   │   └── three-utils.js     # Three.js utility classes
│   └── components/            # Reusable components
├── dist/
│   └── css/
│       └── output.css         # Compiled Tailwind CSS
├── dev-template.html          # Development template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind configuration
├── vite.config.js             # Vite configuration
└── postcss.config.js          # PostCSS configuration
```

## 🎨 Tailwind CSS Features

### Custom Configuration
- **Colors**: Accent (#ff3), Terminal green (#00ff00)
- **Fonts**: System fonts, Monaco monospace
- **Animations**: Fade-in, slide-up, glow, float effects
- **Responsive**: Mobile-first design approach

### Custom CSS Classes
- `.custom-cursor` - Interactive cursor
- `.glow-effect` - Glowing hover effects
- `.terminal-glow` - Terminal-style glow
- `.card-3d` - 3D transform effects
- `.fade-in-up` - Scroll-triggered animations

## 🎮 Three.js Features

### Available Classes
- `ThreeBackground` - Particle system backgrounds
- `GeometricBackground` - 3D geometric shapes

### Usage Example
```javascript
import { ThreeBackground } from './src/js/three-utils.js';

const background = new ThreeBackground(container, {
  particleCount: 1000,
  particleSize: 2,
  color: '#ff3',
  backgroundColor: 'transparent'
});
```

## 🎯 JavaScript Features

### Main App Class
- Custom cursor tracking
- Scroll progress bar
- Intersection Observer animations
- Terminal command processing
- Mobile touch events
- Three.js background management

### Interactive Elements
- Hover effects with custom cursor
- Scroll-triggered animations
- Terminal command system
- Mobile-optimized interactions

## 📱 Responsive Design

- **Mobile**: Touch-optimized, no custom cursor
- **Tablet**: Balanced layout with touch support
- **Desktop**: Full interactive experience

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build Tailwind CSS (watch mode)
npm run tailwind:build

# Build Tailwind CSS (production)
npm run tailwind:prod

# Build entire project
npm run build

# Preview production build
npm run preview
```

## 🎨 Customization

### Adding New Tailwind Classes
1. Edit `src/css/input.css`
2. Add custom CSS after Tailwind directives
3. Run `npm run tailwind:prod` to rebuild

### Adding Three.js Effects
1. Create new class in `src/js/three-utils.js`
2. Import and use in `src/js/main.js`
3. Add container element to HTML

### Adding JavaScript Interactions
1. Extend `PortfolioApp` class in `src/js/main.js`
2. Add event listeners in `setupEventListeners()`
3. Create corresponding HTML elements

## 🚀 Deployment

The project is configured for GitHub Pages deployment:
- All assets are built to `dist/` folder
- Vite handles asset optimization
- Tailwind CSS is minified for production

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Three.js Docs](https://threejs.org/docs)
- [Vite Docs](https://vitejs.dev/guide)
- [MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)

## 🐛 Troubleshooting

### Common Issues
1. **Three.js not loading**: Check import paths and module setup
2. **Tailwind styles not applying**: Run `npm run tailwind:prod`
3. **Custom cursor not working**: Check mobile detection logic
4. **Build errors**: Clear `node_modules` and reinstall

### Debug Mode
Open browser console to see:
- Three.js initialization
- Animation frame rates
- Event listener setup
- Error messages

---

**Happy coding! 🚀**
