# Jesse Rodriguez Portfolio

**Live Site:** [https://jesserodriguez.me](https://jesserodriguez.me)

**Description:**  
A single-page, responsive HTML portfolio website showcasing the intersection of AI, design, and finance. Features dynamic mathematical circle animations and enterprise-level security implementation. Built with an editorial aesthetic inspired by Kanye × Virgil × Anna Wintour design philosophy.

---

## Features
- **Dynamic rotating circles animation** - Mathematical visual element with 3 orbiting circles
- **Editorial design aesthetic** - Clean, bold typography with modern spacing
- **Enterprise security implementation** - Full CSP, clickjacking protection, and security headers
- **Responsive design** - Optimized for all screen sizes using clamp() and modern CSS
- **Service showcase** - AI/Automation, Websites, Logos/Design, Resumes/Careers, Finance
- **Professional contact integration** - Direct mailto link to jesse@jesserodriguez.me
- **Zero external dependencies** - Fully self-contained with no third-party scripts
- **Lightning fast performance** - Optimized static HTML/CSS only

---

## Technical Implementation

### Animation System
```css
/* Three rotating circles with different speeds and orbits */
Circle 1: 12s rotation, 45px orbit (inner)
Circle 2: 18s reverse rotation, 70px orbit (middle) 
Circle 3: 24s rotation, 95px orbit (outer)
```

### Security Headers Implemented
```html
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: [Full enterprise policy]
```

---

## Installation / Setup
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

---

## Deployment on GitHub Pages

✅ **Already Deployed!** This site is live at [jesserodriguez.me](https://jesserodriguez.me)

**Setup Process:**
1. Custom domain configured via `CNAME` file
2. Branch protection enabled for main branch
3. Pull request workflow for all changes
4. HTTPS automatically enabled by GitHub Pages

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

- **Size:** 6.6KB total (highly optimized)
- **Load Time:** <100ms (static HTML/CSS only)
- **CDN:** Fastly global delivery network
- **Mobile Optimized:** Responsive typography and touch-friendly interfaces

---

## License

This project is licensed under the MIT License.

---

## Contact

**Jesse Rodriguez**  
📧 [jesse@jesserodriguez.me](mailto:jesse@jesserodriguez.me)  
🌐 [jesserodriguez.me](https://jesserodriguez.me)

*Connecting ideas, technology, and design.*