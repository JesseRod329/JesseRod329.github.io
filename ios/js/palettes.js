/**
 * iOS Color Palette App
 * Interactive color palettes with copying, harmony generation, and export
 * CSP Compliant - Safe DOM manipulation only
 */

class iOSColorPalettes {
    constructor() {
        this.currentPalettes = [];
        this.selectedExportFormat = 'css';
        this.harmonyColors = [];
        
        // Predefined color palettes matching brand aesthetic
        this.predefinedPalettes = {
            editorial: [
                {
                    name: 'Jesse Editorial',
                    description: 'Core brand colors for professional presentations',
                    colors: ['#000000', '#FFFFFF', '#FFFF33', '#111111', '#F5F5F5']
                },
                {
                    name: 'Fashion Forward',
                    description: 'Contemporary fashion and design palette',
                    colors: ['#E91E63', '#AD1457', '#F8BBD9', '#880E4F', '#FCE4EC']
                },
                {
                    name: 'Terminal Green',
                    description: 'Classic computing and terminal aesthetics',
                    colors: ['#000000', '#00FF00', '#003300', '#66FF66', '#1A1A1A']
                }
            ],
            sunset: [
                {
                    name: 'Golden Hour',
                    description: 'Warm sunset tones for creative projects',
                    colors: ['#FF6B35', '#F7931E', '#FFD23F', '#FF9F1C', '#FFBF69']
                },
                {
                    name: 'Coral Reef',
                    description: 'Vibrant coral and orange shades',
                    colors: ['#FF7F7F', '#FF6B6B', '#FFB347', '#FF8C69', '#FFA07A']
                },
                {
                    name: 'Desert Bloom',
                    description: 'Earthy desert colors with warm highlights',
                    colors: ['#D2691E', '#CD853F', '#DEB887', '#F4A460', '#FFDAB9']
                }
            ],
            tech: [
                {
                    name: 'iOS Blue',
                    description: 'Apple system blue variations',
                    colors: ['#007AFF', '#0051D0', '#4A90E2', '#5AC8FA', '#64D2FF']
                },
                {
                    name: 'Neural Network',
                    description: 'AI and machine learning inspired colors',
                    colors: ['#667EEA', '#764BA2', '#A8EDEA', '#6D83F2', '#9B59B6']
                },
                {
                    name: 'Matrix Code',
                    description: 'Cyberpunk and digital aesthetics',
                    colors: ['#00FF41', '#008F11', '#39FF14', '#228B22', '#00FF7F']
                }
            ],
            nature: [
                {
                    name: 'Forest Deep',
                    description: 'Rich forest greens and earth tones',
                    colors: ['#2D5016', '#355E3B', '#228B22', '#90EE90', '#F0FFF0']
                },
                {
                    name: 'Ocean Waves',
                    description: 'Calming blue and teal ocean colors',
                    colors: ['#006994', '#4682B4', '#87CEEB', '#B0E0E6', '#E0F6FF']
                },
                {
                    name: 'Autumn Leaves',
                    description: 'Warm autumn colors and earth tones',
                    colors: ['#8B4513', '#CD853F', '#DAA520', '#FF8C00', '#FFE4B5']
                }
            ]
        };
        
        this.init();
    }
    
    init() {
        // This will be called when the palettes app is launched
        this.setupPalettes();
    }
    
    setupPalettes() {
        // Initial setup - content will be populated by navigation system
    }
    
    // Color utility functions
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
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
    
    // Color harmony generators
    generateComplementary(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return [];
        
        const [h, s, l] = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const complementaryH = (h + 180) % 360;
        const [r, g, b] = this.hslToRgb(complementaryH, s, l);
        
        return [hex, this.rgbToHex(r, g, b)];
    }
    
    generateTriadic(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return [];
        
        const [h, s, l] = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const triadic1H = (h + 120) % 360;
        const triadic2H = (h + 240) % 360;
        
        const [r1, g1, b1] = this.hslToRgb(triadic1H, s, l);
        const [r2, g2, b2] = this.hslToRgb(triadic2H, s, l);
        
        return [hex, this.rgbToHex(r1, g1, b1), this.rgbToHex(r2, g2, b2)];
    }
    
    generateAnalogous(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return [];
        
        const [h, s, l] = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const analogous1H = (h + 30) % 360;
        const analogous2H = (h - 30 + 360) % 360;
        
        const [r1, g1, b1] = this.hslToRgb(analogous1H, s, l);
        const [r2, g2, b2] = this.hslToRgb(analogous2H, s, l);
        
        return [this.rgbToHex(r2, g2, b2), hex, this.rgbToHex(r1, g1, b1)];
    }
    
    generateMonochromatic(hex) {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return [];
        
        const [h, s, l] = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        const variations = [0.2, 0.4, 0.6, 0.8].map(lightness => {
            const [r, g, b] = this.hslToRgb(h, s, lightness * 100);
            return this.rgbToHex(r, g, b);
        });
        
        return [variations[0], variations[1], hex, variations[2], variations[3]];
    }
    
    // Accessibility contrast checker
    calculateContrast(color1, color2) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        if (!rgb1 || !rgb2) return 1;
        
        const getLuminance = (r, g, b) => {
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };
        
        const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        
        return (brightest + 0.05) / (darkest + 0.05);
    }
    
    getContrastLevel(ratio) {
        if (ratio >= 7) return 'AAA';
        if (ratio >= 4.5) return 'AA';
        return 'FAIL';
    }
    
    // Copy color to clipboard
    async copyColor(hex, element) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(hex);
                this.showCopyFeedback(element, 'Copied!');
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = hex;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    this.showCopyFeedback(element, 'Copied!');
                } catch (err) {
                    this.showCopyFeedback(element, 'Failed');
                }
                
                document.body.removeChild(textArea);
            }
        } catch (err) {
            this.showCopyFeedback(element, 'Failed');
        }
    }
    
    showCopyFeedback(element, message) {
        // Remove any existing feedback
        const existingFeedback = element.querySelector('.ios-copy-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Create new feedback element
        const feedback = document.createElement('div');
        feedback.className = 'ios-copy-feedback';
        feedback.textContent = message;
        element.appendChild(feedback);
        
        // Remove feedback after animation
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 1000);
    }
    
    // Export functions
    exportToCss(palettes) {
        let css = '/* Color Palette CSS Variables */\n:root {\n';
        
        palettes.forEach((palette, paletteIndex) => {
            css += `  /* ${palette.name} */\n`;
            palette.colors.forEach((color, colorIndex) => {
                const varName = `--${palette.name.toLowerCase().replace(/\s+/g, '-')}-${colorIndex + 1}`;
                css += `  ${varName}: ${color};\n`;
            });
            css += '\n';
        });
        
        css += '}\n\n/* Example usage:\n';
        css += ' * .my-element {\n';
        css += ' *   background: var(--jesse-editorial-1);\n';
        css += ' *   color: var(--jesse-editorial-2);\n';
        css += ' * }\n';
        css += ' */';
        
        return css;
    }
    
    exportToJson(palettes) {
        const jsonData = {
            palettes: palettes.map(palette => ({
                name: palette.name,
                description: palette.description,
                colors: palette.colors
            })),
            generated: new Date().toISOString(),
            version: '1.0'
        };
        
        return JSON.stringify(jsonData, null, 2);
    }
    
    exportToText(palettes) {
        let text = 'Color Palettes\n';
        text += '==============\n\n';
        
        palettes.forEach(palette => {
            text += `${palette.name}\n`;
            text += `${'-'.repeat(palette.name.length)}\n`;
            text += `${palette.description}\n\n`;
            
            palette.colors.forEach((color, index) => {
                text += `${index + 1}. ${color}\n`;
            });
            text += '\n';
        });
        
        text += `Generated: ${new Date().toLocaleString()}\n`;
        return text;
    }
    
    exportToSwift(palettes) {
        let swift = '// iOS Color Palette\n';
        swift += 'import UIKit\n\n';
        swift += 'extension UIColor {\n';
        
        palettes.forEach(palette => {
            swift += `    // ${palette.name}: ${palette.description}\n`;
            palette.colors.forEach((color, index) => {
                const rgb = this.hexToRgb(color);
                if (rgb) {
                    const varName = `${palette.name.toLowerCase().replace(/\s+/g, '')}${index + 1}`;
                    swift += `    static let ${varName} = UIColor(red: ${(rgb.r/255).toFixed(3)}, green: ${(rgb.g/255).toFixed(3)}, blue: ${(rgb.b/255).toFixed(3)}, alpha: 1.0)\n`;
                }
            });
            swift += '\n';
        });
        
        swift += '}\n';
        return swift;
    }
    
    // Download exported data
    downloadFile(content, filename, contentType = 'text/plain') {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
    
    // Modal management
    showExportModal(palettes) {
        this.currentPalettes = palettes;
        const modal = document.querySelector('.ios-export-modal');
        if (modal) {
            modal.classList.add('visible');
        }
    }
    
    hideExportModal() {
        const modal = document.querySelector('.ios-export-modal');
        if (modal) {
            modal.classList.remove('visible');
        }
    }
    
    handleExport() {
        const format = this.selectedExportFormat;
        const timestamp = new Date().toISOString().slice(0, 10);
        
        let content, filename, contentType;
        
        switch (format) {
            case 'css':
                content = this.exportToCss(this.currentPalettes);
                filename = `color-palettes-${timestamp}.css`;
                contentType = 'text/css';
                break;
            case 'json':
                content = this.exportToJson(this.currentPalettes);
                filename = `color-palettes-${timestamp}.json`;
                contentType = 'application/json';
                break;
            case 'text':
                content = this.exportToText(this.currentPalettes);
                filename = `color-palettes-${timestamp}.txt`;
                contentType = 'text/plain';
                break;
            case 'swift':
                content = this.exportToSwift(this.currentPalettes);
                filename = `ColorPalettes-${timestamp}.swift`;
                contentType = 'text/plain';
                break;
            default:
                return;
        }
        
        this.downloadFile(content, filename, contentType);
        this.hideExportModal();
    }
}

// Export for use in navigation system
window.iOSColorPalettes = iOSColorPalettes;
