# Testing Checklist

## Local Development Setup

### Start Local Server

```bash
# Navigate to project directory
cd /path/to/JesseRod329.github.io

# Start Python HTTP server
python -m http.server 8080

# Alternative with Python 2
python2 -m SimpleHTTPServer 8080

# Access locally
# http://localhost:8080
```

### Alternative Servers

```bash
# Node.js http-server (if installed)
npx http-server -p 8080

# PHP built-in server
php -S localhost:8080

# Live Server (VS Code extension)
# Right-click index.html -> "Open with Live Server"
```

## Core Functionality Testing

### 1. Homepage Testing (`/`)

#### Initial Load
- [ ] Page loads without errors
- [ ] Terminal interface displays with blinking cursor
- [ ] Static greeting message appears
- [ ] CSS animations working (rotating circles)
- [ ] No console errors

#### JavaScript Enabled
- [ ] Terminal accepts input
- [ ] `help` command shows available commands
- [ ] All commands respond correctly:
  - [ ] `about` - Shows bio information
  - [ ] `projects` - Lists services
  - [ ] `resume` - Shows experience + PDF link
  - [ ] `contact` - Shows contact info
  - [ ] `security` - Shows security score + docs link
  - [ ] `headers` - Lists security headers
  - [ ] `clear` - Clears terminal output
- [ ] Tab autocomplete works
- [ ] Command history (↑/↓ arrows) functions
- [ ] PDF link opens `/assets/resume.pdf`
- [ ] Security docs link opens `/security.html`

#### JavaScript Disabled
- [ ] Static terminal interface displays
- [ ] Noscript navigation menu appears
- [ ] All anchor links work:
  - [ ] `#about` - Scrolls to hero section
  - [ ] `#projects` - Scrolls to services grid
  - [ ] `#resume` - Scrolls to resume card
  - [ ] `#contact` - Scrolls to contact section
  - [ ] `#security` - Shows hidden security section
  - [ ] `#headers` - Shows hidden headers section

### 2. Classic Version Testing (`/classic.html`)

- [ ] Identical to original portfolio design
- [ ] All sections display correctly
- [ ] Responsive design works
- [ ] CSS animations function
- [ ] No terminal interface present
- [ ] Footer link to main version works

### 3. Security Documentation (`/security.html`)

- [ ] Page loads with terminal aesthetic
- [ ] Navigation links work
- [ ] All sections accessible
- [ ] Back to portfolio link functions
- [ ] Responsive design on mobile
- [ ] Code examples display correctly

## Accessibility Testing

### Keyboard Navigation

- [ ] Tab order is logical
- [ ] All interactive elements focusable
- [ ] Terminal input receives focus
- [ ] Links have visible focus indicators
- [ ] No keyboard traps

### Screen Reader Testing

#### Semantic Structure
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Landmarks (`<main>`, `<nav>`, `<section>`)
- [ ] List structures for navigation
- [ ] Form labels (terminal input)

#### ARIA Support
- [ ] Terminal has appropriate role
- [ ] Dynamic content announcements
- [ ] Link purposes clear
- [ ] State changes communicated

#### Testing Tools
```bash
# Install screen reader testing tools
# macOS: VoiceOver (built-in)
# Windows: NVDA (free)
# Linux: Orca (built-in)

# Web-based testing
# - WAVE Web Accessibility Evaluator
# - axe DevTools extension
```

### Visual Accessibility

- [ ] Color contrast meets WCAG AA standards
- [ ] Text remains readable at 200% zoom
- [ ] Focus indicators visible
- [ ] No flashing content (seizure risk)
- [ ] Terminal green text readable on black

## Performance Testing

### Lighthouse Audit

#### Setup
1. Open Chrome DevTools
2. Navigate to Lighthouse tab
3. Select categories:
   - [x] Performance
   - [x] Accessibility
   - [x] Best Practices
   - [x] SEO
   - [ ] PWA (not required)

#### Expected Scores
- **Performance**: 95+ (static site, minimal JS)
- **Accessibility**: 95+ (semantic HTML, keyboard nav)
- **Best Practices**: 90+ (HTTPS, modern APIs)
- **SEO**: 90+ (meta tags, semantic structure)

#### Test Both Pages
- [ ] `/` (homepage with CLI)
- [ ] `/classic.html` (original version)
- [ ] `/security.html` (documentation)

### Performance Metrics

#### Core Web Vitals
- [ ] **LCP** (Largest Contentful Paint): < 2.5s
- [ ] **FID** (First Input Delay): < 100ms
- [ ] **CLS** (Cumulative Layout Shift): < 0.1

#### Additional Metrics
- [ ] **TTFB** (Time to First Byte): < 600ms
- [ ] **FCP** (First Contentful Paint): < 1.8s
- [ ] **Speed Index**: < 3.4s

## Security Testing

### Content Security Policy (CSP)

#### DevTools Console Check
1. Open DevTools Console
2. Look for CSP violations
3. Expected: No violations

#### Common CSP Issues
- [ ] No inline script violations
- [ ] No unsafe-eval usage
- [ ] No blocked external resources
- [ ] All assets load from 'self'

#### Manual CSP Testing
```javascript
// Test in DevTools Console - these should fail:
eval('console.log("blocked")');           // Should be blocked
document.body.innerHTML = '<script>';     // Should be blocked
```

### Security Headers

#### Check Headers
```bash
# Test security headers
curl -I https://jesserodriguez.me

# Expected headers:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Referrer-Policy: strict-origin-when-cross-origin
```

#### Online Testing
- [ ] [Mozilla Observatory](https://observatory.mozilla.org/)
- [ ] [Security Headers](https://securityheaders.com/)
- [ ] [SSL Labs](https://www.ssllabs.com/ssltest/)

### Cross-Browser Testing

#### Modern Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet

#### Legacy Support
- [ ] IE 11 (graceful degradation)
- [ ] Firefox ESR

## Responsive Design Testing

### Viewport Testing

#### Desktop
- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (Common laptop)
- [ ] 1024x768 (Tablet landscape)

#### Tablet
- [ ] 768x1024 (iPad portrait)
- [ ] 1024x768 (iPad landscape)
- [ ] 820x1180 (iPad Air)

#### Mobile
- [ ] 375x667 (iPhone SE)
- [ ] 414x896 (iPhone 11)
- [ ] 360x640 (Android common)

### Feature Testing

- [ ] Terminal scales properly
- [ ] Text remains readable
- [ ] Touch targets adequate (44px minimum)
- [ ] Horizontal scrolling not required
- [ ] Navigation accessible on mobile

## Error Handling Testing

### Network Issues

- [ ] Offline behavior (static content caches)
- [ ] Slow connection graceful loading
- [ ] Asset loading failures

### JavaScript Errors

- [ ] Syntax errors don't break page
- [ ] Command failures handled gracefully
- [ ] Invalid input sanitized

### Edge Cases

- [ ] Long command output scrolling
- [ ] Rapid command execution
- [ ] Tab switching during animations
- [ ] Browser back/forward navigation

## Deployment Testing

### GitHub Pages Specific

- [ ] Custom domain resolves correctly
- [ ] HTTPS enforces properly
- [ ] All assets load via HTTPS
- [ ] 404 errors handled

### CDN Testing

- [ ] Fastly CDN headers present
- [ ] Geographic distribution working
- [ ] Cache headers appropriate

## Documentation Testing

### File Completeness

- [ ] `README.md` accurate
- [ ] `SECURITY_NOTES.md` current
- [ ] `TESTING.md` (this file) comprehensive
- [ ] Code comments present

### Link Validation

- [ ] All internal links work
- [ ] External links valid
- [ ] Email links formatted correctly
- [ ] PDF downloads function

## Automated Testing Setup

### GitHub Actions (Optional)

```yaml
# .github/workflows/test.yml
name: Test Portfolio
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
```

### Local Testing Scripts

```bash
#!/bin/bash
# test.sh - Run local testing suite

echo "Starting local server..."
python -m http.server 8080 &
SERVER_PID=$!

sleep 2

echo "Running tests..."
# Add automated tests here

echo "Cleaning up..."
kill $SERVER_PID
```

## Bug Reporting Template

### Issue Description
- **Browser**: Chrome 91.0.4472.124
- **OS**: macOS 11.4
- **Viewport**: 1920x1080
- **JavaScript**: Enabled/Disabled
- **Steps to Reproduce**:
  1. Navigate to localhost:8080
  2. Type 'help' command
  3. Expected: Command list appears
  4. Actual: Error in console

### Screenshots
- [ ] Desktop view
- [ ] Mobile view
- [ ] Console errors

### Console Output
```
Error: [Copy exact error message]
```

## Pre-Deployment Checklist

- [ ] All tests pass locally
- [ ] Lighthouse scores meet targets
- [ ] No CSP violations
- [ ] Accessibility requirements met
- [ ] Cross-browser compatibility verified
- [ ] Documentation updated
- [ ] Git history clean
- [ ] Security review complete

---

*Run this checklist before every deployment and after significant changes.*
