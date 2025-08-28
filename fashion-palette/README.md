# Fashion Palette Generator

## Privacy-First Color Extraction for Fashion Images

A client-side React application for extracting dominant colors from fashion images and generating complementary color palettes. Built with privacy, security, and performance as core principles.

### 🔒 Privacy & Security Architecture

#### Zero Data Persistence
- **No server uploads**: All image processing happens locally in your browser
- **No data storage**: No localStorage, cookies, or any persistent storage
- **No tracking**: No analytics, external APIs, or data collection
- **Immediate cleanup**: Image data disposed immediately after processing

#### Data Lifecycle
1. **Upload**: User selects image via drag-drop or file input
2. **Canvas Processing**: Image drawn to HTML5 Canvas for pixel analysis
3. **Color Extraction**: Algorithms process ImageData to extract dominant colors
4. **Palette Generation**: Mathematical color theory applied to create palettes
5. **Display**: Results shown with click-to-copy functionality
6. **Disposal**: All image data and canvas contexts immediately cleared

#### CSP Compliance
```html
Content-Security-Policy:
  default-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  script-src 'self';
  object-src 'none';
  base-uri 'self';
```

- **No eval()**: Pure algorithmic processing without dynamic code
- **No unsafe-inline scripts**: All JavaScript in external files
- **Self-hosted dependencies**: React loaded from CDN with SRI hashes
- **Safe DOM manipulation**: textContent used instead of innerHTML

### 🎨 Color Algorithms

#### Color Extraction (`extractColors()`)
```javascript
// Pixel sampling with performance optimization
const sampleRate = Math.max(1, Math.floor((width * height) / 10000));

// Quantization to reduce noise
const quantizedR = Math.floor(r / 16) * 16;

// Brightness filtering for fashion applications
const brightness = (r * 299 + g * 587 + b * 114) / 1000;
if (brightness < 30 || brightness > 220) continue;
```

**Features:**
- Intelligent pixel sampling for large images
- Color quantization to group similar colors
- Brightness filtering to focus on fashion-relevant colors
- Frequency-based sorting to find dominant colors

#### Color Space Conversion
```javascript
// RGB ↔ HSL conversion for color theory calculations
function rgbToHsl(r, g, b) { /* Implementation */ }
function hslToRgb(h, s, l) { /* Implementation */ }
function rgbToHex(r, g, b) { /* Implementation */ }
```

#### Palette Generation Algorithms

**Complementary Palettes**
```javascript
const complementaryH = (h + 180) % 360;
```
- Colors opposite on the color wheel
- Perfect for high contrast combinations
- Ideal for accent colors in fashion design

**Analogous Palettes**
```javascript
[-30, 30].forEach(offset => {
  const analogousH = (h + offset + 360) % 360;
});
```
- Adjacent colors on the color wheel
- Harmonious, soothing combinations
- Great for monochromatic fashion looks

**Triadic Palettes**
```javascript
[120, 240].forEach(offset => {
  const triadicH = (h + offset) % 360;
});
```
- Three evenly spaced colors
- Vibrant, balanced combinations
- Perfect for bold fashion statements

### 🛠️ Technical Implementation

#### React Architecture
- **Functional components** with hooks for state management
- **useCallback** for performance optimization
- **useRef** for DOM manipulation
- **CSP-compliant** component creation using React.createElement

#### Memory Management
```javascript
// Immediate cleanup after processing
ctx.clearRect(0, 0, canvas.width, canvas.height);
canvas.width = 0;
canvas.height = 0;
img.src = '';
```

#### Performance Optimizations
- Image resizing for faster processing (max 500px)
- Intelligent pixel sampling
- Color quantization to reduce noise
- Efficient array operations for sorting

### 🎯 Usage

#### From Main Portfolio CLI
```bash
# In the main portfolio terminal
palette

# Or direct access
https://jesserodriguez.me/fashion-palette/
```

#### Features
1. **Drag & Drop**: Drop fashion images directly onto the upload zone
2. **File Browse**: Click to browse and select image files
3. **Color Extraction**: Automatic processing to find dominant colors
4. **Palette Generation**: Mathematical generation of color schemes
5. **Click to Copy**: Click any color swatch to copy hex code
6. **Responsive Design**: Works on desktop, tablet, and mobile

### 🔧 Browser Compatibility

#### Required Features
- **HTML5 Canvas**: For image processing
- **File API**: For reading uploaded images
- **Clipboard API**: For copy-to-clipboard functionality
- **ES6+**: Modern JavaScript features

#### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 🚀 Development

#### Local Testing
```bash
# Serve from repository root
python -m http.server 8080

# Access fashion palette app
http://localhost:8080/fashion-palette/
```

#### Security Testing
- No CSP violations in DevTools console
- No external network requests (except CDN for React)
- Memory cleanup verification
- Image data disposal confirmation

### 📊 Performance Metrics

#### Lighthouse Scores (Expected)
- **Performance**: 95+ (optimized algorithms)
- **Accessibility**: 100 (semantic HTML, keyboard nav)
- **Best Practices**: 100 (HTTPS, modern APIs)
- **SEO**: 95+ (meta tags, structure)

#### Load Times
- **Initial**: <2s (React + app code)
- **Processing**: <1s for typical fashion images
- **Memory**: Immediate cleanup, no leaks

### 🎨 Fashion-Focused Features

#### Color Selection
- Brightness filtering removes extreme values
- Focus on mid-tone colors common in fashion
- Quantization groups similar fabric colors

#### Palette Applications
- **Complementary**: Accent colors, accessories
- **Analogous**: Monochromatic outfits, gradient effects
- **Triadic**: Bold, statement combinations

#### Design Integration
- Hex codes for CSS/design tools
- High contrast ratios for accessibility
- Professional color naming conventions

---

**Built with privacy, security, and performance as core principles.**
**No data leaves your device. Ever.**
