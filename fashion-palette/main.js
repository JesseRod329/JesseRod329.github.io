/**
 * Fashion Palette Generator - Privacy-First Color Extraction
 * 
 * Security Features:
 * - CSP compliant (no eval, no unsafe-inline scripts)
 * - Client-side only processing
 * - Immediate memory cleanup
 * - No external API calls
 * - No persistent storage
 */

'use strict';

// React components will be defined here
const { useState, useEffect, useCallback, useRef } = React;

/**
 * Color Utility Functions
 */

/**
 * Convert RGB values to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255) 
 * @param {number} b - Blue (0-255)
 * @returns {Array} [h, s, l] where h is 0-360, s and l are 0-100
 */
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
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

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Convert HSL values to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {Array} [r, g, b] where each value is 0-255
 */
function hslToRgb(h, s, l) {
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
        r = g = b = l; // achromatic
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
 * Convert RGB to hex string
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color code (e.g., "#ff5733")
 */
function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

/**
 * Extract dominant colors from image using quantization
 * @param {ImageData} imageData - Canvas ImageData object
 * @param {number} maxColors - Maximum number of colors to extract
 * @returns {Array} Array of color objects with hex, rgb, and count properties
 */
function extractColors(imageData, maxColors = 8) {
    const { data, width, height } = imageData;
    const colorMap = new Map();
    
    // Sample pixels (reduce for performance on large images)
    const sampleRate = Math.max(1, Math.floor((width * height) / 10000));
    
    for (let i = 0; i < data.length; i += 4 * sampleRate) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Skip transparent pixels
        if (a < 128) continue;
        
        // Skip very dark or very light colors for fashion applications
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 30 || brightness > 220) continue;
        
        // Quantize colors to reduce noise (group similar colors)
        const quantizedR = Math.floor(r / 16) * 16;
        const quantizedG = Math.floor(g / 16) * 16;
        const quantizedB = Math.floor(b / 16) * 16;
        
        const key = `${quantizedR},${quantizedG},${quantizedB}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }
    
    // Convert to array and sort by frequency
    const colors = Array.from(colorMap.entries())
        .map(([key, count]) => {
            const [r, g, b] = key.split(',').map(Number);
            return {
                hex: rgbToHex(r, g, b),
                rgb: [r, g, b],
                hsl: rgbToHsl(r, g, b),
                count
            };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, maxColors);
    
    return colors;
}

/**
 * Generate complementary color palette
 * @param {Array} baseColors - Array of base colors with hsl property
 * @returns {Array} Array of complementary colors
 */
function generateComplementary(baseColors) {
    return baseColors.map(color => {
        const [h, s, l] = color.hsl;
        const complementaryH = (h + 180) % 360;
        const [r, g, b] = hslToRgb(complementaryH, s, l);
        return {
            hex: rgbToHex(r, g, b),
            rgb: [r, g, b],
            hsl: [complementaryH, s, l],
            type: 'complementary'
        };
    });
}

/**
 * Generate analogous color palette
 * @param {Array} baseColors - Array of base colors with hsl property
 * @returns {Array} Array of analogous colors
 */
function generateAnalogous(baseColors) {
    const analogous = [];
    
    baseColors.forEach(color => {
        const [h, s, l] = color.hsl;
        
        // Generate analogous colors at ±30 degrees
        [-30, 30].forEach(offset => {
            const analogousH = (h + offset + 360) % 360;
            const [r, g, b] = hslToRgb(analogousH, s, l);
            analogous.push({
                hex: rgbToHex(r, g, b),
                rgb: [r, g, b],
                hsl: [analogousH, s, l],
                type: 'analogous'
            });
        });
    });
    
    return analogous;
}

/**
 * Generate triadic color palette
 * @param {Array} baseColors - Array of base colors with hsl property
 * @returns {Array} Array of triadic colors
 */
function generateTriadic(baseColors) {
    const triadic = [];
    
    baseColors.forEach(color => {
        const [h, s, l] = color.hsl;
        
        // Generate triadic colors at 120° and 240°
        [120, 240].forEach(offset => {
            const triadicH = (h + offset) % 360;
            const [r, g, b] = hslToRgb(triadicH, s, l);
            triadic.push({
                hex: rgbToHex(r, g, b),
                rgb: [r, g, b],
                hsl: [triadicH, s, l],
                type: 'triadic'
            });
        });
    });
    
    return triadic;
}

/**
 * React Components
 */

// Upload Zone Component
function UploadZone({ onImageUpload, isProcessing }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(file => file.type.startsWith('image/'));
        
        if (imageFile) {
            onImageUpload(imageFile);
        }
    }, [onImageUpload]);

    const handleFileSelect = useCallback((e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            onImageUpload(file);
        }
        // Clear input for repeated uploads
        e.target.value = '';
    }, [onImageUpload]);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const className = `upload-zone ${isDragOver ? 'drag-over' : ''} ${isProcessing ? 'processing' : ''}`;

    return React.createElement('div', {
        className,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        onClick: handleClick,
        role: 'button',
        tabIndex: 0,
        'aria-label': 'Upload fashion image for color extraction'
    }, [
        React.createElement('div', { key: 'icon', className: 'upload-icon' }, '🎨'),
        React.createElement('div', { key: 'text', className: 'upload-text' }, 
            isProcessing ? 'Processing image...' : 'Drop your fashion image here'
        ),
        React.createElement('div', { key: 'hint', className: 'upload-hint' }, 
            isProcessing ? 'Extracting colors and generating palettes' : 'or click to browse files'
        ),
        React.createElement('input', {
            key: 'input',
            ref: fileInputRef,
            type: 'file',
            accept: 'image/*',
            className: 'file-input',
            onChange: handleFileSelect,
            'aria-hidden': 'true'
        })
    ]);
}

// Color Swatch Component
function ColorSwatch({ color, onClick }) {
    const handleClick = useCallback(() => {
        onClick(color.hex);
    }, [color.hex, onClick]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(color.hex);
        }
    }, [color.hex, onClick]);

    return React.createElement('div', {
        className: 'color-swatch',
        style: { backgroundColor: color.hex },
        onClick: handleClick,
        onKeyPress: handleKeyPress,
        role: 'button',
        tabIndex: 0,
        'aria-label': `Copy color ${color.hex} to clipboard`
    }, [
        React.createElement('div', { 
            key: 'info', 
            className: 'color-info' 
        }, color.hex.toUpperCase())
    ]);
}

// Palette Display Component
function PaletteDisplay({ colors, title, description, onColorClick }) {
    if (!colors || colors.length === 0) return null;

    return React.createElement('div', { className: 'palette-type' }, [
        React.createElement('h3', { key: 'title' }, title),
        React.createElement('p', { key: 'desc', className: 'palette-description' }, description),
        React.createElement('div', { key: 'grid', className: 'palette-grid' },
            colors.map((color, index) => 
                React.createElement(ColorSwatch, {
                    key: `${color.hex}-${index}`,
                    color,
                    onClick: onColorClick
                })
            )
        )
    ]);
}

// Main App Component
function FashionPaletteApp() {
    const [extractedColors, setExtractedColors] = useState([]);
    const [generatedPalettes, setGeneratedPalettes] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState('');

    const canvasRef = useRef(null);

    // Process uploaded image
    const processImage = useCallback((file) => {
        setIsProcessing(true);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Create canvas for processing
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Resize for performance while maintaining quality
                const maxSize = 500;
                const scale = Math.min(maxSize / img.width, maxSize / img.height);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                
                // Draw and extract colors
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Extract colors
                const colors = extractColors(imageData, 6);
                setExtractedColors(colors);
                
                // Generate palettes
                if (colors.length > 0) {
                    setGeneratedPalettes({
                        complementary: generateComplementary(colors.slice(0, 3)),
                        analogous: generateAnalogous(colors.slice(0, 2)),
                        triadic: generateTriadic(colors.slice(0, 2))
                    });
                }
                
                // Immediate cleanup
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = 0;
                canvas.height = 0;
                img.src = '';
                
                setIsProcessing(false);
            };
            
            img.onerror = () => {
                console.error('Failed to load image');
                setIsProcessing(false);
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            console.error('Failed to read file');
            setIsProcessing(false);
        };
        
        reader.readAsDataURL(file);
    }, []);

    // Copy color to clipboard
    const copyToClipboard = useCallback(async (hex) => {
        try {
            await navigator.clipboard.writeText(hex);
            setCopyFeedback(`Copied ${hex}!`);
            setTimeout(() => setCopyFeedback(''), 2000);
        } catch (err) {
            console.error('Failed to copy color:', err);
            setCopyFeedback('Copy failed');
            setTimeout(() => setCopyFeedback(''), 2000);
        }
    }, []);

    return React.createElement('div', { className: 'app-container' }, [
        React.createElement('div', { key: 'header', className: 'app-header' }, [
            React.createElement('h1', { key: 'title' }, 'Fashion Palette Generator'),
            React.createElement('p', { key: 'subtitle' }, 'Extract colors from fashion images • Privacy-first • Client-side processing')
        ]),
        
        React.createElement('div', { key: 'content', className: 'app-content' }, [
            React.createElement(UploadZone, {
                key: 'upload',
                onImageUpload: processImage,
                isProcessing
            }),
            
            extractedColors.length > 0 && React.createElement('div', { key: 'extracted', className: 'palette-section' }, [
                React.createElement('h2', { key: 'title', className: 'palette-title' }, '🎨 Extracted Colors'),
                React.createElement('div', { key: 'grid', className: 'palette-grid' },
                    extractedColors.map((color, index) =>
                        React.createElement(ColorSwatch, {
                            key: `extracted-${color.hex}-${index}`,
                            color,
                            onClick: copyToClipboard
                        })
                    )
                )
            ]),
            
            Object.keys(generatedPalettes).length > 0 && React.createElement('div', { key: 'generated', className: 'generated-palettes' }, [
                React.createElement('h2', { key: 'title', className: 'palette-title' }, '✨ Generated Palettes'),
                
                React.createElement(PaletteDisplay, {
                    key: 'complementary',
                    colors: generatedPalettes.complementary,
                    title: 'Complementary',
                    description: 'Colors opposite on the color wheel - perfect for high contrast combinations',
                    onColorClick: copyToClipboard
                }),
                
                React.createElement(PaletteDisplay, {
                    key: 'analogous',
                    colors: generatedPalettes.analogous,
                    title: 'Analogous',
                    description: 'Adjacent colors on the color wheel - ideal for harmonious, soothing combinations',
                    onColorClick: copyToClipboard
                }),
                
                React.createElement(PaletteDisplay, {
                    key: 'triadic',
                    colors: generatedPalettes.triadic,
                    title: 'Triadic',
                    description: 'Three evenly spaced colors - creates vibrant, balanced palettes',
                    onColorClick: copyToClipboard
                })
            ])
        ]),
        
        copyFeedback && React.createElement('div', { 
            key: 'feedback', 
            className: 'copy-feedback' 
        }, copyFeedback)
    ]);
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    const root = document.getElementById('palette-root');
    if (root) {
        // Clear loading state
        root.innerHTML = '';
        
        // Mount React app
        const reactRoot = ReactDOM.createRoot(root);
        reactRoot.render(React.createElement(FashionPaletteApp));
    }
});
