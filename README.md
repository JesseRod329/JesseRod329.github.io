# Jesse Rodriguez Portfolio

**Live Site:** [https://jesserodriguez.me](https://jesserodriguez.me)  
**Circular Daily Planner:** [https://jesserodriguez.me/planner](https://jesserodriguez.me/planner)

**Description:**  
A comprehensive portfolio website featuring a main portfolio showcase and an innovative circular daily planner application. The portfolio demonstrates the intersection of AI, design, and fashion with dynamic mathematical circle animations and enterprise-level security implementation. The planner offers a unique time-based interface for daily productivity with export capabilities for wallpapers and lockscreens.

---

## 🌟 Featured Applications

### Main Portfolio
- **Dynamic rotating circles animation** - Mathematical visual element with 3 orbiting circles
- **Editorial design aesthetic** - Clean, bold typography with modern spacing
- **Enterprise security implementation** - Full CSP, clickjacking protection, and security headers
- **Responsive design** - Optimized for all screen sizes using clamp() and modern CSS
- **Service showcase** - AI/Automation, Websites, Logos/Design, Resumes/Careers, Fashion
- **Professional contact integration** - Direct mailto link to jesse@jesserodriguez.me
- **Zero external dependencies** - Fully self-contained with no third-party scripts
- **Lightning fast performance** - Optimized static HTML/CSS only

### 🎯 Circular Daily Planner
- **Beautiful circular interface** - 24-hour visual time wheel with aesthetic glossy design
- **Smart task management** - Time-based scheduling with priority indicators
- **Theme-aware design** - Automatic light/dark mode based on system preference
- **Export capabilities** - Desktop wallpapers and phone lockscreens (25+ device models)
- **Accessibility compliant** - WCAG AA standards with keyboard navigation and screen reader support
- **Mobile optimized** - Touch-friendly interface with responsive design
- **High-resolution exports** - 2x scaling for crisp, professional output
- **Progressive enhancement** - Works without JavaScript, enhanced with JS

---

## Technical Implementation

### Portfolio Animation System
```css
/* Three rotating circles with different speeds and orbits */
Circle 1: 12s rotation, 45px orbit (inner)
Circle 2: 18s reverse rotation, 70px orbit (middle) 
Circle 3: 24s rotation, 95px orbit (outer)
```

### Planner Technical Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Canvas API**: HTML5 Canvas for high-resolution image exports
- **Theme System**: CSS Custom Properties with `prefers-color-scheme`
- **Build System**: Node.js with clean-css and terser for minification
- **Performance**: Lazy loading with `requestIdleCallback`
- **Bundle Size**: 88.8KB total (CSS: 33.9KB, JS: 54.9KB)

### Security Headers Implemented
```html
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: [Full enterprise policy]
```

### Planner Export Specifications
- **Desktop Wallpapers**: 1920x1080, 3840x2160, 3440x1440
- **Phone Models**: 25+ devices (iPhone 15 Pro, Samsung S24, Google Pixel 8, etc.)
- **Export Format**: High-resolution PNG with 2x scaling
- **Theme Integration**: Exports respect current light/dark theme

---

## Installation / Setup

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

---

## Deployment on GitHub Pages

✅ **Already Deployed!** Both applications are live:
- **Portfolio**: [jesserodriguez.me](https://jesserodriguez.me)
- **Planner**: [jesserodriguez.me/planner](https://jesserodriguez.me/planner)

**Setup Process:**
1. Custom domain configured via `CNAME` file
2. Branch protection enabled for main branch
3. Pull request workflow for all changes
4. HTTPS automatically enabled by GitHub Pages
5. Automatic builds and deployments on push to main

**Planner Deployment Features:**
- Production-ready minified assets
- Open Graph meta tags for social sharing
- Sitemap integration for SEO
- Mobile-optimized PWA features
- Cross-browser compatibility testing

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

### Portfolio Performance
- **Size:** 6.6KB total (highly optimized)
- **Load Time:** <100ms (static HTML/CSS only)
- **CDN:** Fastly global delivery network
- **Mobile Optimized:** Responsive typography and touch-friendly interfaces

### Planner Performance
- **Bundle Size:** 88.8KB total (CSS: 33.9KB, JS: 54.9KB)
- **First Contentful Paint:** <1.5s target
- **Lighthouse Performance:** >95 target
- **Accessibility Score:** >95 target
- **Lazy Loading:** Canvas operations use `requestIdleCallback`
- **Mobile Optimized:** Touch-friendly with responsive design
- **Cross-Browser:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

---

## 📚 Documentation

### Planner Documentation
- **[User Guide](PLANNER_README.md)** - Complete user instructions and features
- **[Testing Guide](PLANNER_TESTING.md)** - Comprehensive testing checklist
- **[Deployment Guide](PLANNER_DEPLOY.md)** - Production deployment instructions

### Key Features Documentation
- **Circular Interface**: 24-hour visual time wheel with aesthetic design
- **Export System**: Desktop wallpapers and phone lockscreens (25+ models)
- **Theme System**: Automatic light/dark mode with CSS custom properties
- **Accessibility**: WCAG AA compliance with keyboard navigation
- **Mobile Optimization**: Touch-friendly responsive design
- **Performance**: Optimized bundle size with lazy loading

---

## License

This project is licensed under the MIT License.

---

## Contact

**Jesse Rodriguez**  
📧 [jesse@jesserodriguez.me](mailto:jesse@jesserodriguez.me)  
🌐 [jesserodriguez.me](https://jesserodriguez.me)  
📱 [Circular Daily Planner](https://jesserodriguez.me/planner)

*Connecting ideas, technology, and design.*