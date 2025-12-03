const imageInput = document.getElementById('imageInput');
const paletteSize = document.getElementById('paletteSize');
const extractBtn = document.getElementById('extractBtn');
const imagePreview = document.getElementById('imagePreview');
const palette = document.getElementById('palette');
const accessibility = document.getElementById('accessibility');

function extractPalette() {
    const file = imageInput.files[0];
    if (!file) {
        alert('Please upload an image');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            imagePreview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; border-radius: 8px;">`;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const colors = getDominantColors(imageData.data, parseInt(paletteSize.value));
            
            displayPalette(colors);
            checkAccessibility(colors);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function getDominantColors(data, count) {
    const colorMap = {};
    const step = 4;
    
    for (let i = 0; i < data.length; i += step * 10) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const key = `${Math.floor(r/10)*10},${Math.floor(g/10)*10},${Math.floor(b/10)*10}`;
        colorMap[key] = (colorMap[key] || 0) + 1;
    }
    
    const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, count).map(([rgb]) => {
        const [r, g, b] = rgb.split(',').map(Number);
        return `rgb(${r}, ${g}, ${b})`;
    });
}

function displayPalette(colors) {
    palette.innerHTML = colors.map((color, i) => `
        <div class="palette-item">
            <div class="color-box" style="background: ${color}"></div>
            <div class="color-code">${color}</div>
            <button onclick="copyColor('${color}')" class="copy-btn">Copy</button>
        </div>
    `).join('');
    
    window.paletteColors = colors;
}

function copyColor(color) {
    navigator.clipboard.writeText(color).then(() => {
        alert('Color copied!');
    });
}

function checkAccessibility(colors) {
    const results = colors.map(color => {
        const rgb = color.match(/\d+/g).map(Number);
        const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
        const contrast = brightness > 128 ? 'Dark text' : 'Light text';
        return { color, brightness, contrast };
    });
    
    accessibility.innerHTML = results.map(r => `
        <div class="accessibility-item">
            <div class="color-indicator" style="background: ${r.color}"></div>
            <div>
                <div>${r.contrast} on this color</div>
                <div class="brightness">Brightness: ${Math.round(r.brightness)}</div>
            </div>
        </div>
    `).join('');
}

extractBtn.addEventListener('click', extractPalette);
window.copyColor = copyColor;

