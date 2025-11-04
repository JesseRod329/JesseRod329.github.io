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
  let keys = {};
  
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
  
  // Star class
  class Star {
    constructor() {
      this.reset();
      this.z = Math.random() * 2000; // Start at random depth
    }
    
    reset() {
      this.x = (Math.random() - 0.5) * 2000;
      this.y = (Math.random() - 0.5) * 2000;
      this.z = 2000; // Start at max depth
    }
    
    update() {
      this.z -= 5; // Move toward camera
      if (this.z <= 0) {
        this.reset();
      }
    }
    
    draw() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const x = (this.x / this.z) * rect.width + rect.width / 2;
      const y = (this.y / this.z) * rect.height + rect.height / 2;
      
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        return;
      }
      
      const size = (1 - this.z / 2000) * 2;
      const opacity = 1 - this.z / 2000;
      
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  
  // Ship class (optional triangle ship)
  class Ship {
    constructor() {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.size = 8;
      this.speed = 3;
      this.angle = 0;
    }
    
    update() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Handle keyboard input
      if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        this.x -= this.speed;
      }
      if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        this.x += this.speed;
      }
      if (keys['ArrowUp'] || keys['w'] || keys['W']) {
        this.y -= this.speed;
      }
      if (keys['ArrowDown'] || keys['s'] || keys['S']) {
        this.y += this.speed;
      }
      
      // Keep ship within bounds
      this.x = Math.max(this.size, Math.min(rect.width - this.size, this.x));
      this.y = Math.max(this.size, Math.min(rect.height - this.size, this.y));
    }
    
    draw() {
      if (!canvas || !ctx) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      ctx.save();
      ctx.translate(this.x * dpr, this.y * dpr);
      ctx.rotate(this.angle);
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(0, -this.size * dpr);
      ctx.lineTo(-this.size * 0.7 * dpr, this.size * dpr);
      ctx.lineTo(this.size * 0.7 * dpr, this.size * dpr);
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
    }
  }
  
  // Initialize stars
  function initStars() {
    if (!canvas) return;
    stars = [];
    const rect = canvas.getBoundingClientRect();
    const starCount = Math.min(150, Math.floor((rect.width * rect.height) / 10000));
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
  }
  
  // Initialize ship
  function initShip() {
    if (!canvas) return;
    ship = new Ship();
    const rect = canvas.getBoundingClientRect();
    ship.x = rect.width / 2;
    ship.y = rect.height / 2;
  }
  
  // Animation loop
  function animate() {
    if (!isRunning || !canvas || !ctx) return;
    
    // Clear canvas with fade effect for trails
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const clearWidth = rect.width * dpr;
    const clearHeight = rect.height * dpr;
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      ctx.fillStyle = 'rgba(17, 17, 17, 0.1)';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    }
    ctx.fillRect(0, 0, clearWidth, clearHeight);
    
    // Update and draw stars
    stars.forEach(star => {
      star.update();
      star.draw();
    });
    
    // Update and draw ship if enabled
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
    if (isRunning && ship && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
        e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
        e.key === 'a' || e.key === 'A' || e.key === 'd' || e.key === 'D' ||
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

