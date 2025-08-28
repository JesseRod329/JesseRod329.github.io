/**
 * Fashion Color Palette Generator - Privacy-First Color Analysis
 * Strict CSP Compliant - No eval, no innerHTML, no external dependencies
 * All processing happens client-side with immediate data disposal
 */

class ColorPaletteGenerator {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const uploadZone = document.getElementById('uploadZone');
        
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files[0]) this.processFile(files[0]);
        });
    }
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) this.processFile(file);
    }
    
    processFile(file) {
        document.getElementById('processing').classList.remove('hidden');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.showImagePreview(e.target.result);
                this.analyzeImage(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    showImagePreview(src) {
        const preview = document.getElementById('imagePreview');
        const img = document.getElementById('previewImg');
        img.src = src;
        preview.classList.remove('hidden');
    }
    
    analyzeImage(img) {
        // Resize for processing
        const maxSize = 300;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        this.canvas.width = img.width * ratio;
        this.canvas.height = img.height * ratio;
        
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        const dominantColors = this.extractColors(imageData);
        this.generatePalettes(dominantColors);
        
        document.getElementById('processing').classList.add('hidden');
        
        // Privacy-first cleanup - immediately dispose of image data
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = 0;
        this.canvas.height = 0;
        img.src = '';
    }
    
    extractColors(imageData, numColors = 5) {
        const data = imageData.data;
        const colorCounts = {};
        
        // Sample every 40th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
            // Quantize colors to reduce noise
            const r = Math.round(data[i] / 10) * 10;
            const g = Math.round(data[i + 1] / 10) * 10;
            const b = Math.round(data[i + 2] / 10) * 10;
            
            // Filter out very dark or very light colors
            const brightness = (r + g + b) / 3;
            if (brightness < 20 || brightness > 235) continue;
            
            const key = `${r},${g},${b}`;
            colorCounts[key] = (colorCounts[key] || 0) + 1;
        }
        
        return Object.entries(colorCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, numColors)
            .map(([color]) => {
                const [r, g, b] = color.split(',').map(Number);
                return { r, g, b, hex: this.rgbToHex(r, g, b) };
            });
    }
    
    generatePalettes(dominantColors) {
        if (!dominantColors.length) return;
        
        const baseColor = dominantColors[0];
        const complementary = this.generateComplementary(baseColor);
        const analogous = this.generateAnalogous(baseColor);
        const triadic = this.generateTriadic(baseColor);
        
        const palettes = [
            {
                name: "Dominant Colors",
                description: "Main colors from your image",
                colors: dominantColors.slice(0, 4),
                tip: "Perfect for creating a cohesive look based on your favorite piece"
            },
            {
                name: "Complementary",
                description: "High contrast, bold combinations",
                colors: [baseColor, complementary],
                tip: "Great for statement pieces and eye-catching contrasts"
            },
            {
                name: "Analogous",
                description: "Harmonious, subtle combinations",
                colors: [baseColor, ...analogous],
                tip: "Ideal for professional settings and elegant, toned looks"
            },
            {
                name: "Triadic",
                description: "Vibrant, balanced combinations",
                colors: [baseColor, ...triadic],
                tip: "Perfect for creative, artistic outfits with balanced energy"
            }
        ];
        
        this.displayPalettes(palettes);
    }
    
    displayPalettes(palettes) {
        const container = document.getElementById('palettesContainer');
        // Safely clear container without innerHTML
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        palettes.forEach(palette => {
            const section = document.createElement('div');
            section.className = 'palette-section';
            
            // Create title safely
            const title = document.createElement('h3');
            title.className = 'palette-title';
            title.textContent = palette.name;
            section.appendChild(title);
            
            // Create description safely
            const description = document.createElement('p');
            description.className = 'palette-description';
            description.textContent = palette.description;
            section.appendChild(description);
            
            // Create color swatches container
            const swatchesContainer = document.createElement('div');
            swatchesContainer.className = 'color-swatches';
            
            palette.colors.forEach(color => {
                const swatch = document.createElement('div');
                swatch.className = 'color-swatch';
                swatch.dataset.color = color.hex;
                
                const circle = document.createElement('div');
                circle.className = 'color-circle';
                circle.style.backgroundColor = color.hex;
                swatch.appendChild(circle);
                
                const hexLabel = document.createElement('span');
                hexLabel.className = 'color-hex';
                hexLabel.textContent = color.hex;
                swatch.appendChild(hexLabel);
                
                swatchesContainer.appendChild(swatch);
            });
            
            section.appendChild(swatchesContainer);
            
            // Create fashion tip safely
            const tip = document.createElement('div');
            tip.className = 'fashion-tip';
            const tipStrong = document.createElement('strong');
            tipStrong.textContent = 'Fashion Tip: ';
            tip.appendChild(tipStrong);
            tip.appendChild(document.createTextNode(palette.tip));
            section.appendChild(tip);
            
            // Add click handlers for color copying
            section.querySelectorAll('.color-swatch').forEach(swatch => {
                swatch.addEventListener('click', () => {
                    const hex = swatch.dataset.color;
                    this.copyColor(hex, swatch);
                });
            });
            
            container.appendChild(section);
        });
    }
    
    copyColor(hex, element) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(hex).then(() => {
                const hexSpan = element.querySelector('.color-hex');
                const originalText = hexSpan.textContent;
                hexSpan.textContent = 'Copied!';
                hexSpan.style.color = '#059669';
                setTimeout(() => {
                    hexSpan.textContent = originalText;
                    hexSpan.style.color = '#6b7280';
                }, 1000);
            }).catch(err => {
                console.warn('Clipboard write failed:', err);
            });
        }
    }
    
    // Color utility functions
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    }
    
    hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        if (s === 0) {
            return [l * 255, l * 255, l * 255];
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            return [
                Math.round(hue2rgb(p, q, h + 1/3) * 255),
                Math.round(hue2rgb(p, q, h) * 255),
                Math.round(hue2rgb(p, q, h - 1/3) * 255)
            ];
        }
    }
    
    generateComplementary(baseColor) {
        const [h, s, l] = this.rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
        const complementaryH = (h + 180) % 360;
        const [r, g, b] = this.hslToRgb(complementaryH, s, l);
        return { r, g, b, hex: this.rgbToHex(r, g, b) };
    }
    
    generateAnalogous(baseColor) {
        const [h, s, l] = this.rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
        return [
            { h: (h + 30) % 360, s, l },
            { h: (h - 30 + 360) % 360, s, l }
        ].map(({ h, s, l }) => {
            const [r, g, b] = this.hslToRgb(h, s, l);
            return { r, g, b, hex: this.rgbToHex(r, g, b) };
        });
    }
    
    generateTriadic(baseColor) {
        const [h, s, l] = this.rgbToHsl(baseColor.r, baseColor.g, baseColor.b);
        return [
            { h: (h + 120) % 360, s, l },
            { h: (h + 240) % 360, s, l }
        ].map(({ h, s, l }) => {
            const [r, g, b] = this.hslToRgb(h, s, l);
            return { r, g, b, hex: this.rgbToHex(r, g, b) };
        });
    }
}

// Initialize the app with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Fashion Palette Generator v2.1 - Initializing...');
        new ColorPaletteGenerator();
        console.log('Fashion Palette Generator - Initialized successfully');
    } catch (error) {
        console.error('Fashion Palette Generator Error:', error);
        // Safely clear body and show error message
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        
        const errorContainer = document.createElement('div');
        errorContainer.style.cssText = 'padding: 40px; text-align: center; font-family: Arial, sans-serif;';
        
        const title = document.createElement('h1');
        title.textContent = 'Fashion Palette Generator';
        errorContainer.appendChild(title);
        
        const errorMsg = document.createElement('p');
        errorMsg.style.cssText = 'color: red; margin: 20px 0;';
        errorMsg.textContent = `Error loading application: ${error.message}`;
        errorContainer.appendChild(errorMsg);
        
        const backLink = document.createElement('p');
        const link = document.createElement('a');
        link.href = '/';
        link.style.color = 'blue';
        link.textContent = '← Back to Portfolio';
        backLink.appendChild(link);
        errorContainer.appendChild(backLink);
        
        document.body.appendChild(errorContainer);
    }
});

// Immediate debug output
console.log('Fashion Palette Generator Script Loaded - v2.1');
