// Game constants
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.15;
const THRUST = 0.35;
const TERMINAL_VELOCITY = 8;
const BASE_SPEED = 2;

// Responsive canvas dimensions
let canvasWidth = CANVAS_WIDTH;
let canvasHeight = CANVAS_HEIGHT;
let scaleX = 1;
let scaleY = 1;

// Detect mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

// Game state
let canvas, ctx;
let plane = { x: 200, y: CANVAS_HEIGHT / 2, vx: 0, vy: 0, rotation: 0 };
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let score = 0;
let coins = 0;
let distance = 0;
let scrollSpeed = BASE_SPEED;
let gameTime = 0;

// Touch state
let touchActive = false;
let touchStartY = 0;

// Game objects
let obstacles = [];
let coinsList = [];
let windCurrents = [];
let particles = [];

// Difficulty progression
let stage = 0;
let obstacleSpawnTimer = 0;
let coinSpawnTimer = 0;
let windSpawnTimer = 0;

// Notebook background
const LINE_SPACING = 40;
const MARGIN_X = 50;

// Input handling
const keys = {};

function init() {
    canvas = document.getElementById('gameCanvas');
    resizeCanvas();
    
    ctx = canvas.getContext('2d');
    
    // Smooth sketch-style rendering
    ctx.imageSmoothingEnabled = false;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    
    // Mobile control button
    const upBtn = document.getElementById('upBtn');
    if (upBtn) {
        upBtn.addEventListener('touchstart', handleTouchStart, { passive: false });
        upBtn.addEventListener('touchend', handleTouchEnd, { passive: false });
        upBtn.addEventListener('mousedown', handleTouchStart);
        upBtn.addEventListener('mouseup', handleTouchEnd);
    }
    
    // Touch events for canvas
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Click/tap to start
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('touchend', handleCanvasTap, { passive: false });
    
    // Start screen
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameState === 'start') {
            startGame();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        setTimeout(resizeCanvas, 100);
    });
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            resizeCanvas();
            // Force a repaint
            requestAnimationFrame(() => {
                render();
            });
        }, 200);
    });
    
    // Handle visual viewport changes (mobile browser UI)
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            setTimeout(resizeCanvas, 50);
        });
        window.visualViewport.addEventListener('scroll', () => {
            setTimeout(resizeCanvas, 50);
        });
    }
    
    // Prevent iOS bounce scrolling
    document.addEventListener('touchmove', (e) => {
        if (e.target === canvas || e.target.closest('.game-container')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Initial resize
    resizeCanvas();
    
    updateUI();
    gameLoop();
}

function resizeCanvas() {
    const container = document.querySelector('.game-container');
    
    // Use actual viewport dimensions for mobile
    if (isMobile) {
        // Get actual viewport dimensions accounting for browser UI
        canvasWidth = window.innerWidth || document.documentElement.clientWidth;
        canvasHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Account for safe areas on iOS
        const safeAreaTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)') || '0');
        const safeAreaBottom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)') || '0');
        
        // Use dynamic viewport height if available
        if (window.visualViewport) {
            canvasHeight = window.visualViewport.height;
        } else {
            // Fallback: use actual innerHeight
            canvasHeight = window.innerHeight;
        }
        
        // Ensure we don't exceed viewport
        canvasWidth = Math.min(canvasWidth, screen.width);
        canvasHeight = Math.min(canvasHeight, screen.height);
    } else {
        const containerRect = container.getBoundingClientRect();
        canvasWidth = Math.min(CANVAS_WIDTH, containerRect.width);
        canvasHeight = Math.min(CANVAS_HEIGHT, containerRect.height);
    }
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    scaleX = canvasWidth / CANVAS_WIDTH;
    scaleY = canvasHeight / CANVAS_HEIGHT;
    
    // Update plane starting position
    if (gameState === 'start') {
        plane.x = 200 * scaleX;
        plane.y = canvasHeight / 2;
    }
}

function handleCanvasClick(e) {
    if (gameState === 'start') {
        e.preventDefault();
        startGame();
    }
}

function handleCanvasTap(e) {
    if (gameState === 'start') {
        e.preventDefault();
        startGame();
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    touchActive = true;
    if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
    }
    if (gameState === 'playing') {
        plane.vy -= THRUST;
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    touchActive = false;
}

function handleTouchMove(e) {
    if (gameState === 'playing' && touchActive) {
        e.preventDefault();
        // Allow some movement for plane control
        if (e.touches && e.touches.length > 0) {
            const deltaY = e.touches[0].clientY - touchStartY;
            if (deltaY < -10) {
                // Swiping up
                plane.vy -= THRUST * 0.5;
            }
        }
    }
}

function handleKeyDown(e) {
    keys[e.code] = true;
    if (e.code === 'Space') {
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    keys[e.code] = false;
}

function startGame() {
    gameState = 'playing';
    document.getElementById('startScreen').style.display = 'none';
    resetGame();
}

function resetGame() {
    plane = { x: 200 * scaleX, y: canvasHeight / 2, vx: 0, vy: 0, rotation: 0 };
    score = 0;
    coins = 0;
    distance = 0;
    scrollSpeed = BASE_SPEED;
    gameTime = 0;
    stage = 0;
    obstacles = [];
    coinsList = [];
    windCurrents = [];
    particles = [];
    obstacleSpawnTimer = 0;
    coinSpawnTimer = 0;
    windSpawnTimer = 0;
    touchActive = false;
    updateUI();
}

function restartGame() {
    gameState = 'start';
    document.getElementById('startScreen').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('coins').textContent = coins;
    document.getElementById('distance').textContent = Math.floor(distance);
    document.getElementById('finalScore').textContent = score;
}

function updateDifficulty() {
    gameTime += 1/60; // Assuming 60 FPS
    distance += scrollSpeed / 60;
    
    // Increase speed every 100 meters
    stage = Math.floor(distance / 100);
    scrollSpeed = BASE_SPEED + stage * 0.15;
    
    // Update spawn rates based on stage
    const obstacleSpawnRate = Math.max(120 - stage * 5, 60);
    const coinSpawnRate = Math.max(180 - stage * 8, 90);
    const windSpawnRate = Math.max(240 - stage * 10, 120);
    
    return { obstacleSpawnRate, coinSpawnRate, windSpawnRate };
}

function updatePlane() {
    // Input handling - keyboard
    if (keys['ArrowUp'] || keys['KeyW']) {
        plane.vy -= THRUST;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        plane.vy += THRUST * 0.5;
    }
    if (keys['Space']) {
        plane.vy -= THRUST * 0.8;
    }
    
    // Touch/button input
    if (touchActive) {
        plane.vy -= THRUST * 0.7;
    }
    
    // Apply gravity
    plane.vy += GRAVITY;
    
    // Limit velocity
    plane.vy = Math.max(-TERMINAL_VELOCITY, Math.min(TERMINAL_VELOCITY, plane.vy));
    
    // Update position
    plane.y += plane.vy;
    
    // Boundary collision (using scaled dimensions)
    const boundaryPadding = 20 * scaleY;
    if (plane.y < boundaryPadding) {
        plane.y = boundaryPadding;
        plane.vy = 0;
    }
    if (plane.y > canvasHeight - boundaryPadding) {
        plane.y = canvasHeight - boundaryPadding;
        plane.vy = 0;
    }
    
    // Update rotation based on velocity
    plane.rotation = plane.vy * 0.1;
    
    // Wind current effects
    windCurrents.forEach(wind => {
        const windWidth = wind.width * scaleX;
        const windHeight = wind.height * scaleY;
        const windX = wind.x * scaleX;
        const windY = wind.y * scaleY;
        const planeSize = 25 * Math.min(scaleX, scaleY);
        
        if (plane.x + planeSize > windX && plane.x < windX + windWidth &&
            plane.y + planeSize > windY && plane.y < windY + windHeight) {
            plane.vy += wind.strength * 0.02;
        }
    });
}

function spawnObstacle() {
    const height = (80 + Math.random() * 120) * scaleY;
    const minY = 50 * scaleY;
    const maxY = canvasHeight - height - minY;
    const y = Math.random() * (maxY - minY) + minY;
    obstacles.push({
        x: canvasWidth,
        y: y,
        width: 40 * scaleX,
        height: height,
        type: Math.random() < 0.3 ? 'spike' : 'block'
    });
}

function spawnCoin() {
    const minY = 100 * scaleY;
    const maxY = canvasHeight - 100 * scaleY;
    coinsList.push({
        x: canvasWidth,
        y: minY + Math.random() * (maxY - minY),
        radius: 12 * Math.min(scaleX, scaleY),
        collected: false,
        rotation: 0,
        floatOffset: Math.random() * Math.PI * 2
    });
}

function spawnWindCurrent() {
    const height = (150 + Math.random() * 100) * scaleY;
    const minY = 25 * scaleY;
    const maxY = canvasHeight - height - minY;
    const y = Math.random() * (maxY - minY) + minY;
    windCurrents.push({
        x: canvasWidth,
        y: y,
        width: 200 * scaleX,
        height: height,
        strength: (Math.random() - 0.5) * 4, // Negative = up, Positive = down
        lifetime: 300 + Math.random() * 200
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= scrollSpeed * scaleX;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function updateCoins() {
    coinsList.forEach(coin => {
        coin.x -= scrollSpeed * scaleX;
        coin.rotation += 0.1;
        coin.floatOffset += 0.05;
        
        // Check collision with plane
        const dx = coin.x - plane.x;
        const dy = coin.y + Math.sin(coin.floatOffset) * 5 * scaleY - plane.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const collisionRadius = (coin.radius + 25 * Math.min(scaleX, scaleY));
        
        if (distance < collisionRadius && !coin.collected) {
            coin.collected = true;
            coins++;
            score += 10;
            createCoinParticles(coin.x, coin.y);
            updateUI();
        }
    });
    
    coinsList = coinsList.filter(coin => !coin.collected && coin.x + coin.radius > 0);
}

function updateWindCurrents() {
    windCurrents.forEach(wind => {
        wind.x -= scrollSpeed * scaleX;
        wind.lifetime--;
    });
    windCurrents = windCurrents.filter(wind => wind.lifetime > 0 && wind.x + wind.width > 0);
}

function updateParticles() {
    particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity
        particle.lifetime--;
    });
    particles = particles.filter(p => p.lifetime > 0);
}

function createCoinParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 2,
            lifetime: 30,
            color: '#FFD700'
        });
    }
}

function checkCollisions() {
    const planeSize = 15 * Math.min(scaleX, scaleY);
    const planeRect = {
        x: plane.x - planeSize,
        y: plane.y - planeSize * 0.67,
        width: planeSize * 2,
        height: planeSize * 1.33
    };
    
    for (let obstacle of obstacles) {
        if (planeRect.x < obstacle.x + obstacle.width &&
            planeRect.x + planeRect.width > obstacle.x &&
            planeRect.y < obstacle.y + obstacle.height &&
            planeRect.y + planeRect.height > obstacle.y) {
            gameOver();
            return;
        }
    }
}

function gameOver() {
    gameState = 'gameOver';
    document.getElementById('gameOver').style.display = 'block';
}

function drawNotebookBackground() {
    // Paper texture
    ctx.fillStyle = '#fefefe';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Sketchy margin line
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2 * Math.min(scaleX, scaleY);
    ctx.beginPath();
    ctx.moveTo(MARGIN_X * scaleX, 0);
    ctx.lineTo(MARGIN_X * scaleX, canvasHeight);
    ctx.stroke();
    
    // Notebook lines (hand-drawn style)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1 * Math.min(scaleX, scaleY);
    const scaledSpacing = LINE_SPACING * scaleY;
    for (let y = scaledSpacing; y < canvasHeight; y += scaledSpacing) {
        // Add slight wobble for hand-drawn effect
        ctx.beginPath();
        ctx.moveTo((MARGIN_X + 20) * scaleX, y);
        const stepSize = 20 * scaleX;
        for (let x = (MARGIN_X + 20) * scaleX; x < canvasWidth; x += stepSize) {
            const wobble = Math.sin((x / scaleX) * 0.1 + gameTime * 0.5) * 0.5 * scaleY;
            ctx.lineTo(x, y + wobble);
        }
        ctx.stroke();
    }
    
    // Distance markers
    const markerSpacing = 200 * scaleX;
    const currentMarker = Math.floor((canvasWidth - plane.x) / markerSpacing);
    for (let i = 0; i < 5; i++) {
        const x = plane.x + (currentMarker + i) * markerSpacing;
        if (x > 0 && x < canvasWidth) {
            ctx.strokeStyle = '#bbb';
            ctx.lineWidth = 1 * Math.min(scaleX, scaleY);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
            
            const meters = Math.floor(distance) + Math.floor((x - plane.x) / markerSpacing * 10);
            ctx.fillStyle = '#999';
            ctx.font = `${12 * Math.min(scaleX, scaleY)}px cursive`;
            ctx.fillText(meters + 'm', x + 5 * scaleX, 15 * scaleY);
        }
    }
}

function drawPlane() {
    ctx.save();
    ctx.translate(plane.x, plane.y);
    ctx.rotate(plane.rotation);
    
    const size = Math.min(scaleX, scaleY);
    
    // Hand-drawn paper plane
    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2 * size;
    
    const planeSize = 20 * size;
    const wingSize = 8 * size;
    
    // Main body
    ctx.beginPath();
    ctx.moveTo(-planeSize, 0);
    ctx.lineTo(0, -wingSize);
    ctx.lineTo(planeSize, 0);
    ctx.lineTo(0, wingSize);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Center fold line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -wingSize);
    ctx.stroke();
    
    // Sketchy details
    ctx.beginPath();
    ctx.moveTo(-15 * size, 2 * size);
    ctx.lineTo(-10 * size, 0);
    ctx.moveTo(15 * size, 2 * size);
    ctx.lineTo(10 * size, 0);
    ctx.stroke();
    
    ctx.restore();
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.save();
        const size = Math.min(scaleX, scaleY);
        
        if (obstacle.type === 'spike') {
            // Hand-drawn spike
            ctx.fillStyle = '#d32f2f';
            ctx.strokeStyle = '#b71c1c';
            ctx.lineWidth = 2 * size;
            ctx.beginPath();
            ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
            ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            // Hand-drawn block
            ctx.fillStyle = '#ff9800';
            ctx.strokeStyle = '#f57c00';
            ctx.lineWidth = 3 * size;
            
            // Sketchy rectangle
            const wobble = 2 * size;
            ctx.beginPath();
            ctx.moveTo(obstacle.x + wobble, obstacle.y);
            ctx.lineTo(obstacle.x + obstacle.width - wobble, obstacle.y + wobble);
            ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            ctx.lineTo(obstacle.x, obstacle.y + obstacle.height - wobble);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.restore();
    });
}

function drawCoins() {
    coinsList.forEach(coin => {
        ctx.save();
        const floatOffset = Math.sin(coin.floatOffset) * 5 * scaleY;
        ctx.translate(coin.x, coin.y + floatOffset);
        ctx.rotate(coin.rotation);
        
        const size = Math.min(scaleX, scaleY);
        
        // Hand-drawn coin
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2 * size;
        
        ctx.beginPath();
        ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Dollar sign
        ctx.fillStyle = '#FFA500';
        ctx.font = `bold ${14 * size}px cursive`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 0);
        
        ctx.restore();
    });
}

function drawWindCurrents() {
    windCurrents.forEach(wind => {
        ctx.save();
        const size = Math.min(scaleX, scaleY);
        
        // Translucent wind effect
        const gradient = ctx.createLinearGradient(wind.x, wind.y, wind.x, wind.y + wind.height);
        if (wind.strength < 0) {
            // Upward wind
            gradient.addColorStop(0, 'rgba(135, 206, 250, 0.3)');
            gradient.addColorStop(1, 'rgba(135, 206, 250, 0.0)');
        } else {
            // Downward wind
            gradient.addColorStop(0, 'rgba(255, 192, 203, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 192, 203, 0.0)');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(wind.x, wind.y, wind.width, wind.height);
        
        // Wind arrows
        ctx.strokeStyle = wind.strength < 0 ? '#87CEEB' : '#FFC0CB';
        ctx.lineWidth = 2 * size;
        ctx.fillStyle = ctx.strokeStyle;
        
        const arrowCount = Math.floor(wind.height / (30 * scaleY));
        for (let i = 0; i < arrowCount; i++) {
            const arrowY = wind.y + i * 30 * scaleY + 15 * scaleY;
            const arrowX = wind.x + wind.width / 2;
            const arrowSize = 8 * size;
            
            ctx.beginPath();
            if (wind.strength < 0) {
                // Up arrow
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX - arrowSize, arrowY + arrowSize);
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX + arrowSize, arrowY + arrowSize);
            } else {
                // Down arrow
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX - arrowSize, arrowY - arrowSize);
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX + arrowSize, arrowY - arrowSize);
            }
            ctx.stroke();
        }
        
        ctx.restore();
    });
}

function drawParticles() {
    const size = Math.min(scaleX, scaleY);
    particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.lifetime / 30;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3 * size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw background
    drawNotebookBackground();
    
    // Draw wind currents (behind other objects)
    drawWindCurrents();
    
    // Draw obstacles
    drawObstacles();
    
    // Draw coins
    drawCoins();
    
    // Draw plane
    drawPlane();
    
    // Draw particles
    drawParticles();
}

function gameLoop() {
    if (gameState === 'playing') {
        const { obstacleSpawnRate, coinSpawnRate, windSpawnRate } = updateDifficulty();
        
        updatePlane();
        
        // Spawn obstacles
        obstacleSpawnTimer++;
        if (obstacleSpawnTimer >= obstacleSpawnRate) {
            spawnObstacle();
            obstacleSpawnTimer = 0;
        }
        
        // Spawn coins
        coinSpawnTimer++;
        if (coinSpawnTimer >= coinSpawnRate) {
            spawnCoin();
            coinSpawnTimer = 0;
        }
        
        // Spawn wind currents (less frequent)
        windSpawnTimer++;
        if (windSpawnTimer >= windSpawnRate) {
            spawnWindCurrent();
            windSpawnTimer = 0;
        }
        
        updateObstacles();
        updateCoins();
        updateWindCurrents();
        updateParticles();
        checkCollisions();
        
        // Update score based on distance
        score = Math.floor(distance / 10) + coins * 10;
    }
    
    render();
    requestAnimationFrame(gameLoop);
}

// Initialize game when page loads
window.addEventListener('load', init);

