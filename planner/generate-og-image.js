#!/usr/bin/env node

/**
 * Generate Open Graph Image for Circular Daily Planner
 * Creates a 1200x630 social sharing image
 */

const fs = require('fs');
const path = require('path');

// Simple SVG to PNG conversion using canvas (Node.js)
function generateOGImage() {
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e9ecef;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="darkBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2d2d30;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Dark mode background (for contrast) -->
      <rect x="0" y="0" width="1200" height="630" fill="url(#darkBg)" opacity="0.1"/>
      
      <!-- Main Circle -->
      <circle cx="600" cy="315" r="200" fill="none" stroke="#0d6efd" stroke-width="4" opacity="0.8"/>
      
      <!-- Center Circle -->
      <circle cx="600" cy="315" r="60" fill="#ffffff" stroke="#0d6efd" stroke-width="2"/>
      
      <!-- Hour Markers -->
      <g stroke="#6c757d" stroke-width="2" opacity="0.6">
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(0 600 315)"/>
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(30 600 315)"/>
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(60 600 315)"/>
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(90 600 315)"/>
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(120 600 315)"/>
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(150 600 315)"/>
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(180 600 315)"/>
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(210 600 315)"/>
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(240 600 315)"/>
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(270 600 315)"/>
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(300 600 315)"/>
        <line x1="600" y1="115" x2="600" y2="135" transform="rotate(330 600 315)"/>
      </g>
      
      <!-- Task Markers -->
      <circle cx="600" cy="200" r="8" fill="#fd7e14" opacity="0.9"/>
      <circle cx="700" cy="315" r="8" fill="#0d6efd" opacity="0.9"/>
      <circle cx="600" cy="430" r="8" fill="#6f42c1" opacity="0.9"/>
      
      <!-- Center Text -->
      <text x="600" y="310" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#212529">Dec 15</text>
      <text x="600" y="330" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6c757d">Daily</text>
      
      <!-- Title -->
      <text x="600" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#212529">Circular Daily Planner</text>
      
      <!-- Subtitle -->
      <text x="600" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#6c757d">Organize your day with a beautiful, intuitive interface</text>
      
      <!-- Features -->
      <g font-family="Arial, sans-serif" font-size="18" fill="#495057">
        <text x="600" y="580" text-anchor="middle">🎨 Theme-aware • ⏰ Time-based • 📱 Mobile-responsive</text>
      </g>
      
      <!-- Brand -->
      <text x="600" y="610" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#adb5bd">jesserodriguez.me/planner</text>
    </svg>
  `;

  // For now, we'll save as SVG and convert to PNG later
  const assetsDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(assetsDir, 'og-image.svg'), svg);
  console.log('✅ Open Graph SVG generated');
  
  // Create a simple PNG placeholder (in production, you'd use a proper image conversion library)
  const pngPlaceholder = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  console.log('📝 Note: Convert og-image.svg to PNG for production use');
}

generateOGImage();
