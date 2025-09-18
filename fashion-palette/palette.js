import ColorThief from 'https://unpkg.com/colorthief@2.4.0/dist/color-thief.mjs';

class PaletteGenerator {
    constructor() {
        this.colorThief = new ColorThief();
        this.imageUpload = document.getElementById('imageUpload');
        this.uploadSection = document.getElementById('upload-section');
        this.imageDisplay = document.getElementById('imageDisplay');
        this.generatePaletteBtn = document.getElementById('generatePaletteBtn');
        this.paletteGrid = document.getElementById('paletteGrid');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.message = document.getElementById('message');
        this.paletteTypeSelector = document.getElementById('paletteTypeSelector');
        this.paletteInfo = document.getElementById('paletteInfo');
        this.uploadedImage = null;
        this.currentPaletteType = 'dominant';
        this.dominantColor = null;

        this.addEventListeners();
    }

    addEventListeners() {
        this.imageUpload.addEventListener('change', this.handleImageUpload.bind(this));
        this.generatePaletteBtn.addEventListener('click', this.extractPalette.bind(this));
        
        // Palette type selection
        const paletteTypeBtns = document.querySelectorAll('.palette-type-btn');
        paletteTypeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handlePaletteTypeChange(e.target.dataset.type);
            });
        });

        // Drag and drop functionality
        this.uploadSection.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadSection.classList.add('drag-over');
        });

        this.uploadSection.addEventListener('dragleave', () => {
            this.uploadSection.classList.remove('drag-over');
        });

        this.uploadSection.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadSection.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.imageUpload.files = files;
                this.handleImageUpload();
            }
        });
    }

    handleImageUpload() {
        const file = this.imageUpload.files[0];
        if (file) {
            this.message.textContent = '';
            this.paletteGrid.innerHTML = '';
            const reader = new FileReader();

            reader.onload = (e) => {
                this.uploadedImage = new Image();
                this.uploadedImage.onload = () => {
                    this.imageDisplay.innerHTML = '';
                    this.imageDisplay.appendChild(this.uploadedImage);
                    this.generatePaletteBtn.style.display = 'block'; // Show generate button after image upload
                };
                this.uploadedImage.onerror = () => {
                    this.message.textContent = 'Error loading image.';
                    this.generatePaletteBtn.style.display = 'none';
                };
                this.uploadedImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    async extractPalette() {
        if (!this.uploadedImage) {
            this.message.textContent = 'Please upload an image first.';
            return;
        }

        this.loadingSpinner.style.display = 'block';
        this.message.textContent = 'Extracting palette...';
        this.paletteGrid.innerHTML = '';

        try {
            // Use a smaller image for ColorThief to prevent CORS issues and improve performance
            // For a real application, consider a backend proxy or proper CORS setup
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = this.uploadedImage;

            const MAX_SIZE = 300; // Max width/height for processing
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const resizedImage = new Image();
            resizedImage.src = canvas.toDataURL();

            resizedImage.onload = async () => {
                const colorPalette = await this.colorThief.getPalette(resizedImage, 8); // Get 8 colors
                this.dominantColor = colorPalette[0]; // Store dominant color for palette generation
                this.displayPalette(colorPalette);
                this.paletteTypeSelector.style.display = 'block';
                this.message.textContent = 'Palette generated! Choose a different style below.';
            };

        } catch (error) {
            console.error('Error extracting palette:', error);
            this.message.textContent = 'Error: Could not extract palette. Please try another image.';
        } finally {
            this.loadingSpinner.style.display = 'none';
        }
    }

    /**
     * Handle palette type change
     */
    handlePaletteTypeChange(type) {
        if (!this.dominantColor) return;
        
        this.currentPaletteType = type;
        
        // Update active button
        document.querySelectorAll('.palette-type-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        // Generate new palette based on type
        let newPalette;
        const paletteInfo = {
            dominant: 'Dominant colors extracted from your image',
            complementary: 'Complementary colors - opposite on the color wheel for high contrast',
            triadic: 'Triadic colors - three evenly spaced colors for vibrant combinations',
            analogous: 'Analogous colors - adjacent hues for harmonious, soothing palettes',
            monochromatic: 'Monochromatic variations - different shades and tints of the same hue'
        };
        
        switch (type) {
            case 'complementary':
                newPalette = this.generateComplementaryPalette(this.dominantColor);
                break;
            case 'triadic':
                newPalette = this.generateTriadicPalette(this.dominantColor);
                break;
            case 'analogous':
                newPalette = this.generateAnalogousPalette(this.dominantColor);
                break;
            case 'monochromatic':
                newPalette = this.generateMonochromaticPalette(this.dominantColor);
                break;
            default:
                // For dominant, we need to regenerate from ColorThief
                this.extractPalette();
                return;
        }
        
        this.displayPalette(newPalette, paletteInfo[type]);
    }

    displayPalette(colorPalette, info = null) {
        this.paletteGrid.innerHTML = '';
        colorPalette.forEach(color => {
            const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            const hex = this.rgbToHex(color[0], color[1], color[2]);

            const colorSwatch = document.createElement('div');
            colorSwatch.classList.add('color-swatch');
            colorSwatch.style.backgroundColor = rgb;
            colorSwatch.title = `Click to copy: ${hex}`;
            colorSwatch.innerHTML = `<span>${hex}</span>`;

            colorSwatch.addEventListener('click', () => this.copyToClipboard(hex));
            this.paletteGrid.appendChild(colorSwatch);
        });

        // Update palette info
        if (info) {
            this.paletteInfo.textContent = info;
        }

        // Auto-scroll to palette section on mobile
        setTimeout(() => {
            const paletteSection = document.querySelector('.palette-section');
            if (paletteSection && window.innerWidth <= 768) {
                paletteSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 100);
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.message.textContent = `${text} copied to clipboard!`;
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.message.textContent = 'Failed to copy color.';
        });
    }

    /**
     * Convert RGB to HSL for color theory calculations
     */
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
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

    /**
     * Convert HSL to RGB
     */
    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    /**
     * Generate complementary color palette
     */
    generateComplementaryPalette(dominantColor) {
        const [r, g, b] = dominantColor;
        const [h, s, l] = this.rgbToHsl(r, g, b);
        const complementaryH = (h + 180) % 360;
        
        const palette = [dominantColor];
        
        // Generate variations
        for (let i = 1; i <= 7; i++) {
            const variationH = (complementaryH + (i * 30)) % 360;
            const variationS = Math.max(20, s - (i * 10));
            const variationL = Math.max(20, Math.min(80, l + (i * 5)));
            const [vr, vg, vb] = this.hslToRgb(variationH, variationS, variationL);
            palette.push([vr, vg, vb]);
        }
        
        return palette;
    }

    /**
     * Generate triadic color palette
     */
    generateTriadicPalette(dominantColor) {
        const [r, g, b] = dominantColor;
        const [h, s, l] = this.rgbToHsl(r, g, b);
        
        const palette = [dominantColor];
        
        // Triadic colors (120 degrees apart)
        const triadic1H = (h + 120) % 360;
        const triadic2H = (h + 240) % 360;
        
        // Generate variations for each triadic color
        [triadic1H, triadic2H].forEach(triadicH => {
            for (let i = 0; i < 3; i++) {
                const variationH = (triadicH + (i * 20)) % 360;
                const variationS = Math.max(30, s - (i * 15));
                const variationL = Math.max(25, Math.min(75, l + (i * 8)));
                const [vr, vg, vb] = this.hslToRgb(variationH, variationS, variationL);
                palette.push([vr, vg, vb]);
            }
        });
        
        return palette.slice(0, 8);
    }

    /**
     * Generate analogous color palette
     */
    generateAnalogousPalette(dominantColor) {
        const [r, g, b] = dominantColor;
        const [h, s, l] = this.rgbToHsl(r, g, b);
        
        const palette = [dominantColor];
        
        // Analogous colors (30 degrees apart)
        for (let i = 1; i <= 7; i++) {
            const analogousH = (h + (i * 30)) % 360;
            const variationS = Math.max(20, s - (i * 5));
            const variationL = Math.max(20, Math.min(80, l + (i * 3)));
            const [vr, vg, vb] = this.hslToRgb(analogousH, variationS, variationL);
            palette.push([vr, vg, vb]);
        }
        
        return palette;
    }

    /**
     * Generate monochromatic color palette
     */
    generateMonochromaticPalette(dominantColor) {
        const [r, g, b] = dominantColor;
        const [h, s, l] = this.rgbToHsl(r, g, b);
        
        const palette = [dominantColor];
        
        // Generate variations with different lightness and saturation
        const variations = [
            [h, Math.max(10, s - 20), Math.max(10, l - 30)], // Darker, less saturated
            [h, Math.max(20, s - 10), Math.max(20, l - 20)], // Dark
            [h, s, Math.max(30, l - 10)], // Slightly darker
            [h, s, Math.min(90, l + 10)], // Slightly lighter
            [h, Math.min(100, s + 10), Math.min(90, l + 20)], // Lighter, more saturated
            [h, Math.min(100, s + 20), Math.min(95, l + 30)], // Very light, very saturated
            [h, Math.max(5, s - 30), Math.min(95, l + 40)] // Very light, less saturated
        ];
        
        variations.forEach(([variationH, variationS, variationL]) => {
            const [vr, vg, vb] = this.hslToRgb(variationH, variationS, variationL);
            palette.push([vr, vg, vb]);
        });
        
        return palette;
    }
}

new PaletteGenerator();