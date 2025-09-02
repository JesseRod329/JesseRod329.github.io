#!/usr/bin/env node

/**
 * Production Build Script for Circular Daily Planner
 * Minifies CSS and JavaScript, optimizes for performance
 */

const fs = require('fs');
const path = require('path');

// Simple minification functions
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
    .replace(/{\s+/g, '{') // Remove spaces after opening braces
    .replace(/;\s+/g, ';') // Remove spaces after semicolons
    .replace(/,\s+/g, ',') // Remove spaces after commas
    .replace(/:\s+/g, ':') // Remove spaces after colons
    .trim();
}

function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
    .replace(/{\s+/g, '{') // Remove spaces after opening braces
    .replace(/;\s+/g, ';') // Remove spaces after semicolons
    .replace(/,\s+/g, ',') // Remove spaces after commas
    .replace(/:\s+/g, ':') // Remove spaces after colons
    .trim();
}

// Build function
function build() {
  console.log('🚀 Building planner for production...');
  
  // Create dist directory
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Minify CSS files
  const cssFiles = ['css/themes.css', 'css/planner.css'];
  let combinedCSS = '';
  
  cssFiles.forEach(file => {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    combinedCSS += content + '\n';
  });
  
  const minifiedCSS = minifyCSS(combinedCSS);
  fs.writeFileSync(path.join(distDir, 'planner.min.css'), minifiedCSS);
  console.log('✅ CSS minified and combined');
  
  // Minify JS files
  const jsFiles = ['js/form-handler.js', 'js/planner.js', 'js/canvas-export.js'];
  let combinedJS = '';
  
  jsFiles.forEach(file => {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
    combinedJS += content + '\n';
  });
  
  const minifiedJS = minifyJS(combinedJS);
  fs.writeFileSync(path.join(distDir, 'planner.min.js'), minifiedJS);
  console.log('✅ JavaScript minified and combined');
  
  // Copy HTML with optimized references
  const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const optimizedHTML = htmlContent
    .replace(/<link rel="stylesheet" href="css\/themes\.css">/g, '')
    .replace(/<link rel="stylesheet" href="css\/planner\.css">/g, '<link rel="stylesheet" href="dist/planner.min.css">')
    .replace(/<script src="js\/form-handler\.js" defer><\/script>/g, '')
    .replace(/<script src="js\/planner\.js" defer><\/script>/g, '')
    .replace(/<script src="js\/canvas-export\.js" defer><\/script>/g, '<script src="dist/planner.min.js" defer></script>');
  
  fs.writeFileSync(path.join(distDir, 'index.html'), optimizedHTML);
  console.log('✅ HTML optimized');
  
  // Calculate bundle sizes
  const cssSize = fs.statSync(path.join(distDir, 'planner.min.css')).size;
  const jsSize = fs.statSync(path.join(distDir, 'planner.min.js')).size;
  const totalSize = cssSize + jsSize;
  
  console.log(`📊 Bundle sizes:`);
  console.log(`   CSS: ${(cssSize / 1024).toFixed(1)}KB`);
  console.log(`   JS: ${(jsSize / 1024).toFixed(1)}KB`);
  console.log(`   Total: ${(totalSize / 1024).toFixed(1)}KB`);
  
  if (totalSize < 150 * 1024) {
    console.log('✅ Bundle size target met (< 150KB)');
  } else {
    console.log('⚠️  Bundle size exceeds target (150KB)');
  }
  
  console.log('🎉 Build complete!');
}

// Run build
build();
