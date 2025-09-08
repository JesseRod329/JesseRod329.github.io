# Jesse Rodriguez Portfolio

**Live Site:** [https://jesserodriguez.me](https://jesserodriguez.me)  
**React Portfolio:** [https://jesserodriguez.me/sandbox-portfolio](https://jesserodriguez.me/sandbox-portfolio)  
**iOS Mobile Experience:** [https://jesserodriguez.me/ios](https://jesserodriguez.me/ios)  
**Circular Daily Planner:** [https://jesserodriguez.me/planner](https://jesserodriguez.me/planner)  
**Fashion Palette Generator:** [https://jesserodriguez.me/fashion-palette](https://jesserodriguez.me/fashion-palette)  
**AI Brainwave Simulator:** [https://jesserodriguez.me/brainwave-simulator.html](https://jesserodriguez.me/brainwave-simulator.html)  
**Security Dashboard:** [https://jesserodriguez.me/security.html](https://jesserodriguez.me/security.html)  
**NYC's Public AI Future (Interactive Plan):** [https://jesserodriguez.me/nyc-public-ai.html](https://jesserodriguez.me/nyc-public-ai.html)

**Description:**  
A comprehensive multi-application portfolio showcasing the intersection of AI, design, and fashion. Features include a main portfolio with dynamic animations, an iOS-style mobile experience, a circular daily planner, a privacy-first fashion color palette generator, an AI brainwave simulator, and enterprise-level security implementations. All applications demonstrate cutting-edge web technologies with zero external dependencies and maximum performance.

---

## 🌟 Featured Applications

### ⚛️ React Portfolio
- **Modern React architecture** - Built with React 19, TypeScript, and Vite for optimal performance
- **Interactive project showcase** - Dynamic project cards with launch buttons and live demos
- **Three.js background effects** - Immersive 3D visual elements and smooth animations
- **Framer Motion animations** - Seamless page transitions and micro-interactions
- **Responsive design** - Optimized for all devices with Tailwind CSS
- **Project management** - Comprehensive project data with live links and tech stacks
- **Enhanced UX** - Info, Contact, and FAQ pages with interactive elements
- **Performance optimized** - Fast loading with modern build tools and lazy loading

### 🏠 Main Portfolio
- **Dynamic rotating circles animation** - Mathematical visual element with 3 orbiting circles
- **Editorial design aesthetic** - Clean, bold typography with modern spacing
- **Enterprise security implementation** - Full CSP, clickjacking protection, and security headers
- **Responsive design** - Optimized for all screen sizes using clamp() and modern CSS
- **Service showcase** - AI/Automation, Websites, Logos/Design, Resumes/Careers, Fashion
- **Professional contact integration** - Direct mailto link to jesse@jesserodriguez.me
- **Zero external dependencies** - Fully self-contained with no third-party scripts
- **Lightning fast performance** - Optimized static HTML/CSS only
- **Interactive CLI terminal** - Type commands like `help`, `projects`, `palette`, `planner`, `brainwave`, `security`, `nycai` to navigate and launch apps
### 🏙️ NYC's Public AI Future (Interactive Plan)
- **Single-page interactive dashboard** - Explore Vision, Plan, Impact, Roadmap, Governance
- **Phased rollout tabs** - Clickable phases dynamically update details and visuals
- **Budget visualization** - Chart.js bar chart with tooltips and click-to-focus interactivity
- **Vertical roadmap timeline** - Milestones across Pilot, Scale, and Long-Term
- **Governance & partnerships** - Oversight principles and ecosystem mapping
- **Accessible & responsive** - Tailwind CSS, mobile-first layout, keyboard-friendly
- **Privacy & performance** - Pure client-side app with lightweight CDN assets
- **Live demo** - [nyc-public-ai.html](https://jesserodriguez.me/nyc-public-ai.html)

### 📱 iOS Mobile Experience
- **Native iOS interface** - Authentic iPhone home screen design with app grid
- **PWA capabilities** - Installable web app with offline functionality
- **Service Worker** - Advanced caching strategies and background sync
- **App ecosystem** - Terminal, Resume, Contact, Planner, and more apps
- **Touch-optimized** - Gesture support and mobile-first interactions
- **Performance optimized** - 20.53% CSS compression, <100KB bundle target
- **Apple integration** - Touch icons, splash screens, and iOS meta tags

### 🎯 Circular Daily Planner
- **Beautiful circular interface** - 24-hour visual time wheel with aesthetic glossy design
- **Smart task management** - Time-based scheduling with priority indicators
- **Theme-aware design** - Automatic light/dark mode based on system preference
- **Export capabilities** - Desktop wallpapers and phone lockscreens (25+ device models)
- **Accessibility compliant** - WCAG AA standards with keyboard navigation and screen reader support
- **Mobile optimized** - Touch-friendly interface with responsive design
- **High-resolution exports** - 2x scaling for crisp, professional output
- **Progressive enhancement** - Works without JavaScript, enhanced with JS

### 🎨 Fashion Palette Generator
- **Privacy-first design** - All processing happens locally in your browser
- **AI color extraction** - Advanced algorithms to extract dominant colors from fashion images
- **Mathematical color theory** - Complementary, analogous, and triadic palette generation
- **Zero data persistence** - No uploads, storage, or tracking - complete privacy
- **React-powered** - Modern component architecture with performance optimizations
- **Click-to-copy** - Instant hex code copying for design tools
- **Fashion-focused** - Brightness filtering and quantization for fashion-relevant colors

### 🧠 AI Brainwave Simulator
- **Neural activity visualization** - Real-time brainwave pattern simulation
- **Privacy-first monitoring** - No data collection, all processing local
- **Scientific accuracy** - Based on actual EEG frequency bands (Alpha, Beta, Theta, Delta)
- **Interactive controls** - Adjustable frequency, amplitude, and visualization modes
- **Educational tool** - Learn about brainwave patterns and their meanings
- **Responsive design** - Works across all devices with touch support

### 🔒 Security Dashboard
- **Comprehensive security audit** - Complete security posture analysis
- **Real-time monitoring** - CSP compliance and security header verification
- **Privacy metrics** - Zero external dependencies and data collection tracking
- **Terminal interface** - Authentic command-line security assessment experience
- **Enterprise-grade** - Full security checklist with 100% compliance rating

---

## Technical Implementation

### React Portfolio Stack
- **Frontend Framework**: React 19 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth page transitions and micro-interactions
- **3D Graphics**: Three.js for immersive background effects and visual elements
- **Routing**: React Router DOM for client-side navigation
- **State Management**: React hooks and context for component state
- **Performance**: Lazy loading, code splitting, and optimized bundle sizes

### Portfolio Animation System
```css
/* Three rotating circles with different speeds and orbits */
Circle 1: 12s rotation, 45px orbit (inner)
Circle 2: 18s reverse rotation, 70px orbit (middle) 
Circle 3: 24s rotation, 95px orbit (outer)
```

### iOS Mobile Experience Stack
- **PWA Framework**: Service Worker with offline caching
- **Build System**: Node.js with CSS minification (20.53% compression)
- **Performance**: <100KB bundle target, lazy loading modules
- **Apple Integration**: Touch icons, splash screens, iOS meta tags
- **Caching Strategy**: Static cache, dynamic cache, stale-while-revalidate

### Planner Technical Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Canvas API**: HTML5 Canvas for high-resolution image exports
- **Theme System**: CSS Custom Properties with `prefers-color-scheme`
- **Build System**: Node.js with clean-css and terser for minification
- **Performance**: Lazy loading with `requestIdleCallback`
- **Bundle Size**: 88.8KB total (CSS: 33.9KB, JS: 54.9KB)

### Fashion Palette Generator Stack
- **Frontend**: React with functional components and hooks
- **Canvas Processing**: HTML5 Canvas for image analysis
- **Color Algorithms**: RGB/HSL conversion, quantization, frequency analysis
- **Privacy Architecture**: Zero data persistence, local processing only
- **Performance**: Intelligent pixel sampling, memory cleanup

### Brainwave Simulator Stack
- **Visualization**: HTML5 Canvas with real-time rendering
- **Scientific Accuracy**: EEG frequency bands (Alpha, Beta, Theta, Delta)
- **Interactive Controls**: Adjustable parameters with smooth animations
- **Privacy-First**: No data collection, all processing local

### Security Headers Implemented
```html
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: [Full enterprise policy]
```

### Export & Performance Specifications
- **Planner Exports**: Desktop wallpapers (1920x1080, 4K, ultra-wide) + 25+ phone models
- **Fashion Palette**: Click-to-copy hex codes, mathematical color theory
- **Brainwave Simulator**: Real-time neural visualization with scientific accuracy
- **iOS PWA**: Installable web app with offline functionality
- **Theme Integration**: All apps respect system light/dark preferences

---

## Installation / Setup

### React Portfolio Setup
1. **Navigate to sandbox-portfolio directory**
```bash
cd sandbox-portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
# Open http://localhost:5173
```

4. **Build for production**
```bash
npm run build
# Generates optimized assets in dist/
```

5. **Preview production build**
```bash
npm run preview
# Preview the production build locally
```

### Portfolio Setup
1. **Clone the repository**  
```bash
git clone https://github.com/JesseRod329/JesseRod329.github.io.git
cd JesseRod329.github.io
```

2. **Open `index.html`** in a browser to preview locally. No server required for static content.

3. **Customizations:**
   * Update service descriptions in the services grid
   * Modify circle animation speeds in CSS keyframes
   * Adjust typography and spacing variables
   * Update contact email address

### iOS Mobile Experience Setup
1. **Navigate to iOS directory**
```bash
cd ios
```

2. **Install dependencies** (for build process)
```bash
npm install
```

3. **Run development server**
```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

4. **Build for production**
```bash
node build.js
# Generates minified CSS in dist/
```

### Planner Development Setup
1. **Navigate to planner directory**
```bash
cd planner
```

2. **Install dependencies** (for build process)
```bash
npm install
```

3. **Run development server**
```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

4. **Build for production**
```bash
npm run build
# Generates minified assets in dist/
```

5. **Run tests**
```bash
npm test
# Comprehensive testing suite
```

### Fashion Palette Generator Setup
1. **Navigate to fashion-palette directory**
```bash
cd fashion-palette
```

2. **Run development server**
```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

3. **Features:**
   * Drag & drop fashion images
   * Automatic color extraction
   * Mathematical palette generation
   * Click-to-copy hex codes

### Brainwave Simulator Setup
1. **Open brainwave-simulator.html** directly in browser
2. **Features:**
   * Real-time neural visualization
   * Adjustable frequency controls
   * Scientific EEG accuracy
   * Privacy-first processing

---

## Deployment on GitHub Pages

✅ **Already Deployed!** All applications are live:
- **Main Portfolio**: [jesserodriguez.me](https://jesserodriguez.me)
- **React Portfolio**: [jesserodriguez.me/sandbox-portfolio](https://jesserodriguez.me/sandbox-portfolio)
- **iOS Mobile Experience**: [jesserodriguez.me/ios](https://jesserodriguez.me/ios)
- **Circular Daily Planner**: [jesserodriguez.me/planner](https://jesserodriguez.me/planner)
- **Fashion Palette Generator**: [jesserodriguez.me/fashion-palette](https://jesserodriguez.me/fashion-palette)
- **AI Brainwave Simulator**: [jesserodriguez.me/brainwave-simulator.html](https://jesserodriguez.me/brainwave-simulator.html)
- **Security Dashboard**: [jesserodriguez.me/security.html](https://jesserodriguez.me/security.html)

**Setup Process:**
1. Custom domain configured via `CNAME` file
2. Branch protection enabled for main branch
3. Pull request workflow for all changes
4. HTTPS automatically enabled by GitHub Pages
5. Automatic builds and deployments on push to main

**Deployment Features:**
- **Production-ready minified assets** for all applications
- **Open Graph meta tags** for social sharing across all apps
- **Sitemap integration** for comprehensive SEO
- **Mobile-optimized PWA features** for iOS experience
- **Cross-browser compatibility testing** for all applications
- **Security headers** implemented across all pages
- **Performance optimization** with lazy loading and caching

---

## Security Checklist

This site follows enterprise-level security best practices for static GitHub Pages deployment:

| #  | Check                                                                 | Status | Notes |
| -- | --------------------------------------------------------------------- | ------ | ----- |
| 1  | No sensitive data (API keys, passwords, private tokens) in HTML       | ✅     | Only public portfolio information |
| 2  | Proper content type served (`text/html`)                              | ✅     | Standard HTML5 doctype |
| 3  | Avoid `eval()` or dynamic string execution in JS                      | ✅     | No JavaScript used, pure CSS animations |
| 4  | User inputs sanitized/escaped                                         | ✅     | No user inputs or forms present |
| 5  | External links with `target="_blank"` use `rel="noopener noreferrer"` | ✅     | Only mailto link (doesn't require this) |
| 6  | No global JS variables storing secrets                                | ✅     | No JavaScript present |
| 7  | Only trusted third-party scripts                                      | ✅     | No external scripts |
| 8  | Subresource Integrity (SRI) for external scripts                      | ✅     | No external scripts to secure |
| 9  | All resources (CSS, JS, images, fonts) use HTTPS                      | ✅     | All resources inline, no external calls |
| 10 | No inline styles containing JS (`expression()`)                       | ✅     | Pure CSS, no expressions() |
| 11 | No sensitive files in repo (`.env`, private configs)                  | ✅     | Repository verified clean |
| 12 | Branch protection enabled for main branch                             | ✅     | Pull request workflow required |
| 13 | Site served via HTTPS                                                 | ✅     | GitHub Pages auto-enables HTTPS |
| 14 | Analytics/tracking scripts secure and minimal                         | ✅     | No tracking scripts present |
| 15 | Fonts loaded via HTTPS and properly licensed                          | ✅     | Using system fonts only |
| 16 | Optional CSP implemented                                              | ✅     | **IMPLEMENTED**: Strict CSP policy |
| 17 | Optional X-Frame-Options/meta tag to prevent clickjacking             | ✅     | **IMPLEMENTED**: `X-Frame-Options: DENY` |
| 18 | All inputs validated/sanitized                                        | ✅     | No forms present |
| 19 | Error messages generic; no internal info leaked                       | ✅     | No error handling needed |
| 20 | No open redirect vulnerabilities                                      | ✅     | Only mailto link present |
| 21 | JS libraries/frameworks up-to-date                                    | ✅     | No external dependencies |
| 22 | Optional penetration testing via browser tools or OWASP ZAP           | ⚠️     | **ACTION**: Run security scan for verification |

**Security Score: 21/22 (95.5%)** - Excellent rating with only optional security testing remaining.

---

## Design Philosophy

**Editorial Aesthetic:** Inspired by the intersection of high fashion editorial design (Anna Wintour), conceptual art direction (Virgil Abloh), and bold creative vision (Kanye West).

**Visual Elements:**
- **Typography:** Helvetica Neue with aggressive font weights and tight letter spacing
- **Layout:** Generous white space with strong vertical rhythm
- **Animation:** Mathematical precision meets creative expression
- **Color Palette:** Minimal - black, white, with yellow accent (#ff3)
- **Interaction:** Subtle hover states and staggered animations

---

## Performance

### React Portfolio Performance
- **Bundle Size**: Optimized with Vite build system and code splitting
- **Load Time**: <2s first contentful paint with lazy loading
- **Animations**: Smooth 60fps with Framer Motion and Three.js
- **Mobile Optimized**: Responsive design with touch-friendly interactions
- **Modern Stack**: React 19 with TypeScript for optimal performance
- **CDN Delivery**: Fastly global delivery network for static assets

### Portfolio Performance
- **Size:** 6.6KB total (highly optimized)
- **Load Time:** <100ms (static HTML/CSS only)
- **CDN:** Fastly global delivery network
- **Mobile Optimized:** Responsive typography and touch-friendly interfaces

### iOS Mobile Experience Performance
- **Bundle Size:** <100KB target (20.53% CSS compression achieved)
- **PWA Features:** Offline functionality with Service Worker
- **Apple Integration:** Touch icons, splash screens, iOS meta tags
- **Performance:** Lazy loading modules, optimized caching strategies

### Planner Performance
- **Bundle Size:** 88.8KB total (CSS: 33.9KB, JS: 54.9KB)
- **First Contentful Paint:** <1.5s target
- **Lighthouse Performance:** >95 target
- **Accessibility Score:** >95 target
- **Lazy Loading:** Canvas operations use `requestIdleCallback`
- **Mobile Optimized:** Touch-friendly with responsive design
- **Cross-Browser:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

### Fashion Palette Generator Performance
- **Processing Speed:** <1s for typical fashion images
- **Memory Management:** Immediate cleanup, no memory leaks
- **Privacy-First:** Zero data persistence, local processing only
- **Lighthouse Scores:** Performance 95+, Accessibility 100, Best Practices 100

### Brainwave Simulator Performance
- **Real-Time Rendering:** Smooth 60fps neural visualization
- **Scientific Accuracy:** EEG frequency bands with precise calculations
- **Interactive Controls:** Responsive parameter adjustments
- **Privacy-First:** No data collection, all processing local

### Security Dashboard Performance
- **Real-Time Monitoring:** Instant security posture analysis
- **Comprehensive Audit:** 100% compliance rating achieved
- **Terminal Interface:** Authentic command-line experience
- **Enterprise-Grade:** Full security checklist implementation

---

## 📚 Documentation

### Application Documentation
- **[Planner User Guide](PLANNER_README.md)** - Complete user instructions and features
- **[Planner Testing Guide](PLANNER_TESTING.md)** - Comprehensive testing checklist
- **[Planner Deployment Guide](PLANNER_DEPLOY.md)** - Production deployment instructions
- **[iOS PWA Optimization](ios/PWA_OPTIMIZATION_SUMMARY.md)** - iOS mobile experience details
- **[Fashion Palette README](fashion-palette/README.md)** - Privacy-first color extraction guide
- **[Security Audit Report](SECURITY_AUDIT_REPORT.md)** - Comprehensive security analysis

### Key Features Documentation
- **Circular Interface**: 24-hour visual time wheel with aesthetic design
- **Export System**: Desktop wallpapers and phone lockscreens (25+ models)
- **Theme System**: Automatic light/dark mode with CSS custom properties
- **Accessibility**: WCAG AA compliance with keyboard navigation
- **Mobile Optimization**: Touch-friendly responsive design
- **Performance**: Optimized bundle size with lazy loading
- **Privacy Architecture**: Zero data persistence across all applications
- **PWA Features**: Offline functionality and installable web apps
- **Security Implementation**: Enterprise-grade security headers and CSP

---

## License

This project is licensed under the MIT License.

---

## Contact

**Jesse Rodriguez**  
📧 [jesse@jesserodriguez.me](mailto:jesse@jesserodriguez.me)  
🌐 [jesserodriguez.me](https://jesserodriguez.me)  
⚛️ [React Portfolio](https://jesserodriguez.me/sandbox-portfolio)  
📱 [iOS Mobile Experience](https://jesserodriguez.me/ios)  
🎯 [Circular Daily Planner](https://jesserodriguez.me/planner)  
🎨 [Fashion Palette Generator](https://jesserodriguez.me/fashion-palette)  
🧠 [AI Brainwave Simulator](https://jesserodriguez.me/brainwave-simulator.html)  
🔒 [Security Dashboard](https://jesserodriguez.me/security.html)

*Connecting ideas, technology, and design.*