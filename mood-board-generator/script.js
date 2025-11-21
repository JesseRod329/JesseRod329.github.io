// AI Mood Board Generator
// Color extraction and design inspiration tool

const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const resultsSection = document.getElementById('resultsSection');
const colorGrid = document.getElementById('colorGrid');
const colorCodes = document.getElementById('colorCodes');
const typographyGrid = document.getElementById('typographyGrid');
const uploadedImage = document.getElementById('uploadedImage');
const moodColors = document.getElementById('moodColors');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

// Typography pairings database
const typographyPairings = [
    { heading: 'Playfair Display', body: 'Source Sans Pro', style: 'Elegant & Editorial' },
    { heading: 'Montserrat', body: 'Open Sans', style: 'Modern & Clean' },
    { heading: 'Oswald', body: 'Lato', style: 'Bold & Professional' },
    { heading: 'Merriweather', body: 'Raleway', style: 'Classic & Readable' },
    { heading: 'Bebas Neue', body: 'Roboto', style: 'Strong & Contemporary' }
];

// Upload area interactions
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImage(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        processImage(file);
    }
});

// Process uploaded image
function processImage(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Extract colors
            const colors = extractColors(img);

            // Display results
            displayColorPalette(colors);
            displayTypography(colors);
            displayMoodBoard(e.target.result, colors);

            // Show results
            resultsSection.style.display = 'grid';
            uploadArea.style.display = 'none';
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// Extract dominant colors from image
function extractColors(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Resize for performance
    const size = 100;
    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(img, 0, 0, size, size);
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;

    // Color quantization - simplified k-means
    const colorMap = {};

    for (let i = 0; i < pixels.length; i += 4) {
        const r = Math.floor(pixels[i] / 32) * 32;
        const g = Math.floor(pixels[i + 1] / 32) * 32;
        const b = Math.floor(pixels[i + 2] / 32) * 32;
        const key = `${r},${g},${b}`;

        colorMap[key] = (colorMap[key] || 0) + 1;
    }

    // Get top 6 colors
    const sortedColors = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([color]) => {
            const [r, g, b] = color.split(',').map(Number);
            return { r, g, b };
        });

    return sortedColors;
}

// Display color palette
function displayColorPalette(colors) {
    colorGrid.innerHTML = '';
    colorCodes.innerHTML = '';

    colors.forEach((color, index) => {
        const hex = rgbToHex(color.r, color.g, color.b);

        // Color swatch
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = hex;
        swatch.dataset.color = hex;
        swatch.addEventListener('click', () => copyToClipboard(hex));
        colorGrid.appendChild(swatch);

        // Color code
        const code = document.createElement('div');
        code.className = 'color-code';
        code.textContent = hex;
        colorCodes.appendChild(code);
    });
}

// Display typography suggestions
function displayTypography(colors) {
    typographyGrid.innerHTML = '';

    // Pick 3 random pairings
    const selectedPairings = typographyPairings
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    selectedPairings.forEach((pairing, index) => {
        const sample = document.createElement('div');
        sample.className = 'font-sample';

        const accentColor = rgbToHex(colors[index % colors.length].r, colors[index % colors.length].g, colors[index % colors.length].b);

        sample.innerHTML = `
      <div class="font-name">${pairing.style}</div>
      <div class="font-preview" style="font-family: '${pairing.heading}', serif; color: ${accentColor};">
        ${pairing.heading}
      </div>
      <div class="font-usage" style="font-family: '${pairing.body}', sans-serif;">
        Paired with ${pairing.body} for body text
      </div>
    `;

        typographyGrid.appendChild(sample);
    });

    // Load Google Fonts
    const fontLink = document.createElement('link');
    fontLink.href = `https://fonts.googleapis.com/css2?family=${selectedPairings.map(p => p.heading + ':wght@700').join('&family=')}&family=${selectedPairings.map(p => p.body).join('&family=')}&display=swap`;
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
}

// Display mood board
function displayMoodBoard(imageSrc, colors) {
    uploadedImage.src = imageSrc;

    moodColors.innerHTML = '';
    colors.slice(0, 5).forEach(color => {
        const dot = document.createElement('div');
        dot.className = 'mood-color-dot';
        dot.style.backgroundColor = rgbToHex(color.r, color.g, color.b);
        moodColors.appendChild(dot);
    });
}

// Download palette as image
downloadBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Inter';
    ctx.fillText('Color Palette', 60, 80);

    // Colors
    const swatches = document.querySelectorAll('.color-swatch');
    const swatchSize = 150;
    const gap = 20;

    swatches.forEach((swatch, index) => {
        const x = 60 + (index % 6) * (swatchSize + gap);
        const y = 150;

        ctx.fillStyle = swatch.style.backgroundColor;
        ctx.fillRect(x, y, swatchSize, swatchSize);

        // Hex code
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px monospace';
        ctx.fillText(swatch.dataset.color, x, y + swatchSize + 30);
    });

    // Download
    const link = document.createElement('a');
    link.download = 'mood-board-palette.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Reset
resetBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    uploadArea.style.display = 'block';
    fileInput.value = '';
});

// Utilities
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const notification = document.createElement('div');
        notification.textContent = `Copied ${text}!`;
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-family: 'Space Mono', monospace;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.5);
    `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    });
}
