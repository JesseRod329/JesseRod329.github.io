// Game Canvas Setup
(function() {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('heroOverlay');
  const startButton = document.getElementById('startButton');
  
  let animationId = null;
  let isRunning = false;
  let stars = [];
  let ship = null;
  let bullets = [];
  let keys = {};
  let score = 0;
  let lastShot = 0;
  
  // Canvas sizing
  function resizeCanvas() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    // Reinitialize stars on resize if game is running
    if (isRunning) {
      initStars();
      if (ship) {
        ship.x = canvas.width / (2 * dpr);
        ship.y = canvas.height / (2 * dpr);
      }
    }
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      resizeCanvas();
    });
  } else {
    resizeCanvas();
  }
  window.addEventListener('resize', resizeCanvas);
  
  // Star class for side-scrolling
  class Star {
    constructor() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      this.x = rect.width + Math.random() * 100;
      this.y = Math.random() * rect.height;
      this.speed = 1 + Math.random() * 3;
      this.size = 1 + Math.random() * 2;
      this.opacity = 0.5 + Math.random() * 0.5;
    }
    
    update() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      this.x -= this.speed;
      if (this.x < -10) {
        this.x = rect.width + 10;
        this.y = Math.random() * rect.height;
      }
    }
    
    draw() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  // Ship class for side-scrolling
  class Ship {
    constructor() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      this.x = 80;
      this.y = rect.height / 2;
      this.size = 12;
      this.speed = 4;
      this.angle = 0;
    }
    
    update() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Handle keyboard input - only up/down movement for side-scroller
      if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        this.y -= this.speed;
      }
      if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        this.y += this.speed;
      }
      
      // Keep ship within vertical bounds
      this.y = Math.max(this.size, Math.min(rect.height - this.size, this.y));
    }
    
    draw() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      
      // Ship body (triangle pointing right)
      ctx.strokeStyle = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.size, 0);
      ctx.lineTo(-this.size * 0.6, -this.size * 0.8);
      ctx.lineTo(-this.size * 0.6, this.size * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Ship exhaust
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.arc(-this.size * 0.8, -this.size * 0.4, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-this.size * 0.8, this.size * 0.4, 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }
  
  // Bullet class
  class Bullet {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed = 8;
      this.size = 3;
      this.active = true;
    }
    
    update() {
      this.x += this.speed;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (this.x > rect.width + 10) {
        this.active = false;
      }
    }
    
    draw() {
      if (!canvas || !ctx || !this.active) return;
      ctx.save();
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  // Initialize stars for side-scrolling
  function initStars() {
    if (!canvas) return;
    stars = [];
    const rect = canvas.getBoundingClientRect();
    const starCount = Math.min(200, Math.floor((rect.width * rect.height) / 8000));
    for (let i = 0; i < starCount; i++) {
      const star = new Star();
      star.x = Math.random() * rect.width;
      stars.push(star);
    }
  }
  
  // Initialize ship
  function initShip() {
    if (!canvas) return;
    ship = new Ship();
  }
  
  // Animation loop
  function animate() {
    if (!isRunning || !canvas || !ctx) return;
    
    // Clear canvas
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const clearWidth = rect.width * dpr;
    const clearHeight = rect.height * dpr;
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      ctx.fillStyle = 'rgba(17, 17, 17, 0.15)';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    }
    ctx.fillRect(0, 0, clearWidth, clearHeight);
    
    // Update and draw stars
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    
    // Update and draw bullets
    bullets = bullets.filter(bullet => {
      bullet.update();
      if (bullet.active) {
        bullet.draw();
        return true;
      }
      return false;
    });
    
    // Update and draw ship
    if (ship) {
      ship.update();
      ship.draw();
    }
    
    animationId = requestAnimationFrame(animate);
  }
  
  // Start game
  function startGame() {
    if (isRunning || !canvas || !ctx) return;
    
    // Ensure canvas is properly sized
    resizeCanvas();
    
    isRunning = true;
    if (overlay) {
      overlay.classList.add('hidden');
    }
    initStars();
    initShip();
    animate();
  }
  
  // Pause/resume on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else if (isRunning) {
      animate();
    }
  });
  
  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Shooting
    if (isRunning && ship && (e.key === ' ' || e.key === 'Spacebar')) {
      e.preventDefault();
      const now = Date.now();
      if (now - lastShot > 150) { // Rate limit shooting
        bullets.push(new Bullet(ship.x + ship.size, ship.y));
        lastShot = now;
      }
    }
    
    // Movement
    if (isRunning && ship && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
        e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S')) {
      e.preventDefault();
    }
  });
  
  document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
  
  // Start button click - only if elements exist
  if (startButton) {
    startButton.addEventListener('click', (e) => {
      e.preventDefault();
      startGame();
    });
    startButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startGame();
      }
    });
  }
  
  // Also allow clicking anywhere on overlay to start
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target === startButton) {
        startGame();
      }
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // Account for fixed header if needed
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
})();

