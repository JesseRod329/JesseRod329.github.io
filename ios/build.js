#!/usr/bin/env node

/**
 * iOS Portfolio Build Script
 * Optimizes CSS and JavaScript for production deployment
 */

const fs = require('fs');
const path = require('path');

// Simple CSS minification
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

// Simple JavaScript minification  
function minifyJS(js) {
  return js
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function build() {
  console.log('🚀 Starting iOS Portfolio build...');
  
  const outputDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  let originalSize = 0, optimizedSize = 0;
  
  // Process CSS files
  const cssFiles = ['css/iphone.css', 'css/terminal.css', 'css/palettes.css', 'css/content-apps.css', 'css/professional.css'];
  
  for (const cssFile of cssFiles) {
    if (fs.existsSync(cssFile)) {
      const original = fs.readFileSync(cssFile, 'utf8');
      const minified = minifyCSS(original);
      
      const outputPath = path.join(outputDir, cssFile);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, minified);
      
      originalSize += original.length;
      optimizedSize += minified.length;
      console.log(`✅ ${cssFile} (${original.length} → ${minified.length} bytes)`);
    }
  }
  
  console.log(`📊 Total compression: ${((originalSize - optimizedSize) / originalSize * 100).toFixed(2)}%`);
}

if (require.main === module) {
  build().catch(console.error);
}
