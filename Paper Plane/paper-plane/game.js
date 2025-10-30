// Game constants
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.15;
const THRUST = 0.35;
const TERMINAL_VELOCITY = 8;
const BASE_SPEED = 2;

// Plane types configuration
const PLANE_TYPES = {
    basic: { 
        name: 'Basic', 
        speedMultiplier: 1.0, 
        gravityResistance: 1.0, 
        thrustPower: 1.0, 
        unlockDistance: 0 
    },
    speedy: { 
        name: 'Speedy', 
        speedMultiplier: 1.3, 
        gravityResistance: 0.9, 
        thrustPower: 1.1, 
        unlockDistance: 200 
    },
    glider: { 
        name: 'Glider', 
        speedMultiplier: 1.1, 
        gravityResistance: 0.7, 
        thrustPower: 0.9, 
        unlockDistance: 500 
    },
    racer: { 
        name: 'Racer', 
        speedMultiplier: 1.5, 
        gravityResistance: 0.8, 
        thrustPower: 1.3, 
        unlockDistance: 1000 
    }
};

// Powerup types
const POWERUP_TYPES = {
    speedBoost: { name: 'Speed Boost', duration: 300, icon: '⚡' },
    shield: { name: 'Shield', duration: 600, icon: '🛡️' },
    magnet: { name: 'Magnet', duration: 450, icon: '🧲' },
    slowMotion: { name: 'Slow Motion', duration: 400, icon: '🐌' }
};

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
let maxDistance = 0;
let currentPlane = 'basic';
let unlockedPlanes = ['basic'];
let activePowerups = {};
let colorIntensity = 0;

// Touch state
let touchActive = false;
let touchStartY = 0;

// Game objects
let obstacles = [];
let coinsList = [];
let windCurrents = [];
let particles = [];
let powerupsList = [];
let powerupSpawnTimer = 0;

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
    
    // Initialize plane system
    initializePlaneSystem();
    
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
        // Don't start if clicking on plane selection
        if (e.target.closest('#planeSelection')) {
            return;
        }
        e.preventDefault();
        startGame();
    }
}

function handleCanvasTap(e) {
    if (gameState === 'start') {
        // Don't start if tapping on plane selection
        if (e.target.closest('#planeSelection')) {
            return;
        }
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
    powerupsList = [];
    obstacleSpawnTimer = 0;
    coinSpawnTimer = 0;
    windSpawnTimer = 0;
    powerupSpawnTimer = 0;
    activePowerups = {};
    colorIntensity = 0;
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
    const planeStats = PLANE_TYPES[currentPlane];
    const baseSpeed = BASE_SPEED * planeStats.speedMultiplier;
    
    distance += scrollSpeed / 60;
    
    // Increase speed every 100 meters
    stage = Math.floor(distance / 100);
    scrollSpeed = baseSpeed + stage * 0.15;
    
    // Apply speed boost powerup
    if (activePowerups.speedBoost) {
        scrollSpeed *= 1.5;
    }
    
    // Update color intensity based on distance
    if (distance < 200) {
        colorIntensity = 0; // Black & white
    } else if (distance < 500) {
        colorIntensity = (distance - 200) / 300 * 0.25; // 0-25% color (red)
    } else if (distance < 1000) {
        colorIntensity = 0.25 + (distance - 500) / 500 * 0.5; // 25-75% color (red + blue)
    } else {
        colorIntensity = Math.min(0.75 + (distance - 1000) / 1000 * 0.25, 1.0); // 75-100% color (full)
    }
    
    // Update spawn rates based on stage
    const obstacleSpawnRate = Math.max(120 - stage * 5, 60);
    const coinSpawnRate = Math.max(180 - stage * 8, 90);
    const windSpawnRate = Math.max(240 - stage * 10, 120);
    const powerupSpawnRate = Math.max(600 - stage * 20, 300);
    
    // Check for plane unlocks
    checkPlaneUnlocks();
    
    return { obstacleSpawnRate, coinSpawnRate, windSpawnRate, powerupSpawnRate };
}

function updatePlane() {
    const planeStats = PLANE_TYPES[currentPlane];
    const effectiveThrust = THRUST * planeStats.thrustPower;
    const effectiveGravity = GRAVITY * planeStats.gravityResistance;
    
    // Input handling - keyboard
    if (keys['ArrowUp'] || keys['KeyW']) {
        plane.vy -= effectiveThrust;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        plane.vy += effectiveThrust * 0.5;
    }
    if (keys['Space']) {
        plane.vy -= effectiveThrust * 0.8;
    }
    
    // Touch/button input
    if (touchActive) {
        plane.vy -= effectiveThrust * 0.7;
    }
    
    // Apply improved gravity with smoothing
    plane.vy += effectiveGravity;
    
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
    const slowMotionActive = activePowerups.slowMotion;
    const speedMultiplier = slowMotionActive ? 0.5 : 1.0;
    
    obstacles.forEach(obstacle => {
        obstacle.x -= scrollSpeed * scaleX * speedMultiplier;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function updateCoins() {
    const magnetActive = activePowerups.magnet;
    const slowMotionActive = activePowerups.slowMotion;
    const speedMultiplier = slowMotionActive ? 0.5 : 1.0;
    const magnetRange = magnetActive ? 150 * Math.min(scaleX, scaleY) : 0;
    
    coinsList.forEach(coin => {
        coin.x -= scrollSpeed * scaleX * speedMultiplier;
        coin.rotation += 0.1;
        coin.floatOffset += 0.05;
        
        // Magnet effect - attract coins
        if (magnetActive) {
            const dx = coin.x - plane.x;
            const dy = coin.y + Math.sin(coin.floatOffset) * 5 * scaleY - plane.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < magnetRange && dist > 10) {
                const pullStrength = 0.3;
                coin.x -= dx * pullStrength * 0.1;
                coin.y -= dy * pullStrength * 0.1;
            }
        }
        
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
    const slowMotionActive = activePowerups.slowMotion;
    const speedMultiplier = slowMotionActive ? 0.5 : 1.0;
    
    windCurrents.forEach(wind => {
        wind.x -= scrollSpeed * scaleX * speedMultiplier;
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
    // Shield protects from collisions
    if (activePowerups.shield) {
        return;
    }
    
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

function initializePlaneSystem() {
    // Load max distance from localStorage
    const savedMaxDistance = localStorage.getItem('maxDistance');
    if (savedMaxDistance) {
        maxDistance = parseFloat(savedMaxDistance) || 0;
    }
    
    // Load unlocked planes from localStorage
    const savedUnlockedPlanes = localStorage.getItem('unlockedPlanes');
    if (savedUnlockedPlanes) {
        try {
            unlockedPlanes = JSON.parse(savedUnlockedPlanes);
            // Ensure basic plane is always unlocked
            if (!unlockedPlanes.includes('basic')) {
                unlockedPlanes.push('basic');
            }
        } catch (e) {
            unlockedPlanes = ['basic'];
        }
    }
    
    // Check unlocks based on max distance
    checkPlaneUnlocks();
    
    // Load selected plane
    const savedPlane = localStorage.getItem('selectedPlane');
    if (savedPlane && unlockedPlanes.includes(savedPlane)) {
        currentPlane = savedPlane;
    }
    
    updatePlaneSelectionUI();
}

function checkPlaneUnlocks() {
    let newUnlocks = false;
    for (const [planeType, planeData] of Object.entries(PLANE_TYPES)) {
        if (maxDistance >= planeData.unlockDistance && !unlockedPlanes.includes(planeType)) {
            unlockedPlanes.push(planeType);
            newUnlocks = true;
        }
    }
    
    if (newUnlocks) {
        localStorage.setItem('unlockedPlanes', JSON.stringify(unlockedPlanes));
        updatePlaneSelectionUI();
    }
}

function selectPlane(planeType) {
    if (unlockedPlanes.includes(planeType)) {
        currentPlane = planeType;
        localStorage.setItem('selectedPlane', planeType);
        updatePlaneSelectionUI();
    }
}

function spawnPowerup() {
    const powerupTypes = Object.keys(POWERUP_TYPES);
    const randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
    const minY = 100 * scaleY;
    const maxY = canvasHeight - 100 * scaleY;
    powerupsList.push({
        x: canvasWidth,
        y: minY + Math.random() * (maxY - minY),
        radius: 15 * Math.min(scaleX, scaleY),
        type: randomType,
        collected: false,
        rotation: 0,
        floatOffset: Math.random() * Math.PI * 2
    });
}

function updatePowerups() {
    const slowMotionActive = activePowerups.slowMotion;
    const speedMultiplier = slowMotionActive ? 0.5 : 1.0;
    
    // Update active powerups timers
    for (const [powerupType, timer] of Object.entries(activePowerups)) {
        activePowerups[powerupType]--;
        if (activePowerups[powerupType] <= 0) {
            delete activePowerups[powerupType];
        }
    }
    
    // Update powerup positions and check collisions
    powerupsList.forEach(powerup => {
        powerup.x -= scrollSpeed * scaleX * speedMultiplier;
        powerup.rotation += 0.15;
        powerup.floatOffset += 0.05;
        
        // Check collision with plane
        const dx = powerup.x - plane.x;
        const dy = powerup.y + Math.sin(powerup.floatOffset) * 5 * scaleY - plane.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const collisionRadius = (powerup.radius + 25 * Math.min(scaleX, scaleY));
        
        if (dist < collisionRadius && !powerup.collected) {
            powerup.collected = true;
            const powerupData = POWERUP_TYPES[powerup.type];
            activePowerups[powerup.type] = powerupData.duration;
            
            createCoinParticles(powerup.x, powerup.y);
            updateUI();
        }
    });
    
    powerupsList = powerupsList.filter(p => !p.collected && p.x + p.radius > 0);
    
    // Update UI powerup indicators
    updatePowerupUI();
}

function getColorIntensity() {
    return colorIntensity;
}

function applyColorProgression(color, intensity) {
    if (intensity <= 0) {
        // Convert to grayscale
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        const gray = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
        return `#${gray.toString(16).padStart(2, '0')}${gray.toString(16).padStart(2, '0')}${gray.toString(16).padStart(2, '0')}`;
    }
    
    if (intensity >= 1) {
        return color;
    }
    
    // Interpolate between grayscale and color
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const gray = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
    
    const newR = Math.round(gray + (r - gray) * intensity);
    const newG = Math.round(gray + (g - gray) * intensity);
    const newB = Math.round(gray + (b - gray) * intensity);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

function updatePlaneSelectionUI() {
    const planeSelectionContainer = document.getElementById('planeSelection');
    if (!planeSelectionContainer) return;
    
    let html = '<div class="plane-selection-grid">';
    for (const [planeType, planeData] of Object.entries(PLANE_TYPES)) {
        const isUnlocked = unlockedPlanes.includes(planeType);
        const isSelected = currentPlane === planeType;
        const lockStatus = isUnlocked ? '' : ` (Unlock at ${planeData.unlockDistance}m)`;
        
        html += `<div class="plane-card ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}" 
                     onclick="${isUnlocked ? `selectPlane('${planeType}')` : ''}">
                    <div class="plane-name">${planeData.name}${lockStatus}</div>
                    <div class="plane-stats">
                        <div>Speed: ${(planeData.speedMultiplier * 100).toFixed(0)}%</div>
                        <div>Float: ${((1 - planeData.gravityResistance) * 100).toFixed(0)}%</div>
                        <div>Thrust: ${(planeData.thrustPower * 100).toFixed(0)}%</div>
                    </div>
                </div>`;
    }
    html += '</div>';
    planeSelectionContainer.innerHTML = html;
}

function updatePowerupUI() {
    const powerupContainer = document.getElementById('powerupStatus');
    if (!powerupContainer) return;
    
    const activeCount = Object.keys(activePowerups).length;
    if (activeCount === 0) {
        powerupContainer.innerHTML = '';
        return;
    }
    
    let html = '<div class="powerup-indicators">';
    for (const [powerupType, timer] of Object.entries(activePowerups)) {
        const powerupData = POWERUP_TYPES[powerupType];
        const percentage = (timer / powerupData.duration) * 100;
        html += `<div class="powerup-indicator" title="${powerupData.name}">
                    <span class="powerup-icon">${powerupData.icon}</span>
                    <div class="powerup-timer-bar">
                        <div class="powerup-timer-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>`;
    }
    html += '</div>';
    powerupContainer.innerHTML = html;
}

function gameOver() {
    gameState = 'gameOver';
    // Update max distance
    if (distance > maxDistance) {
        maxDistance = distance;
        localStorage.setItem('maxDistance', maxDistance.toString());
        checkPlaneUnlocks();
    }
    document.getElementById('gameOver').style.display = 'block';
    updatePlaneSelectionUI();
}

function drawNotebookBackground() {
    const intensity = getColorIntensity();
    
    // Paper texture
    ctx.fillStyle = '#fefefe';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Sketchy margin line
    ctx.strokeStyle = applyColorProgression('#ff6b6b', intensity);
    ctx.lineWidth = 2 * Math.min(scaleX, scaleY);
    ctx.beginPath();
    ctx.moveTo(MARGIN_X * scaleX, 0);
    ctx.lineTo(MARGIN_X * scaleX, canvasHeight);
    ctx.stroke();
    
    // Notebook lines (hand-drawn style)
    ctx.strokeStyle = applyColorProgression('#e0e0e0', intensity);
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
            ctx.strokeStyle = applyColorProgression('#bbb', intensity);
            ctx.lineWidth = 1 * Math.min(scaleX, scaleY);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
            
            const meters = Math.floor(distance) + Math.floor((x - plane.x) / markerSpacing * 10);
            ctx.fillStyle = applyColorProgression('#999', intensity);
            ctx.font = `${12 * Math.min(scaleX, scaleY)}px cursive`;
            ctx.fillText(meters + 'm', x + 5 * scaleX, 15 * scaleY);
        }
    }
}

function drawPlane() {
    const intensity = getColorIntensity();
    ctx.save();
    ctx.translate(plane.x, plane.y);
    ctx.rotate(plane.rotation);
    
    const size = Math.min(scaleX, scaleY);
    
    // Shield effect visual
    if (activePowerups.shield) {
        ctx.strokeStyle = applyColorProgression('#00ffff', intensity);
        ctx.lineWidth = 3 * size;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(0, 0, 30 * size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    // Hand-drawn paper plane
    ctx.strokeStyle = applyColorProgression('#333', intensity);
    ctx.fillStyle = applyColorProgression('#fff', intensity);
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
    const intensity = getColorIntensity();
    obstacles.forEach(obstacle => {
        ctx.save();
        const size = Math.min(scaleX, scaleY);
        
        if (obstacle.type === 'spike') {
            // Hand-drawn spike
            ctx.fillStyle = applyColorProgression('#d32f2f', intensity);
            ctx.strokeStyle = applyColorProgression('#b71c1c', intensity);
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
            ctx.fillStyle = applyColorProgression('#ff9800', intensity);
            ctx.strokeStyle = applyColorProgression('#f57c00', intensity);
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
    const intensity = getColorIntensity();
    coinsList.forEach(coin => {
        ctx.save();
        const floatOffset = Math.sin(coin.floatOffset) * 5 * scaleY;
        ctx.translate(coin.x, coin.y + floatOffset);
        ctx.rotate(coin.rotation);
        
        const size = Math.min(scaleX, scaleY);
        
        // Hand-drawn coin
        ctx.fillStyle = applyColorProgression('#FFD700', intensity);
        ctx.strokeStyle = applyColorProgression('#FFA500', intensity);
        ctx.lineWidth = 2 * size;
        
        ctx.beginPath();
        ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Dollar sign
        ctx.fillStyle = applyColorProgression('#FFA500', intensity);
        ctx.font = `bold ${14 * size}px cursive`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 0);
        
        ctx.restore();
    });
}

function drawWindCurrents() {
    const intensity = getColorIntensity();
    windCurrents.forEach(wind => {
        ctx.save();
        const size = Math.min(scaleX, scaleY);
        
        // Translucent wind effect
        const gradient = ctx.createLinearGradient(wind.x, wind.y, wind.x, wind.y + wind.height);
        if (wind.strength < 0) {
            // Upward wind
            const color1 = applyColorProgression('#87CEEB', intensity);
            const color2 = applyColorProgression('#000000', intensity);
            const r1 = parseInt(color1.slice(1, 3), 16);
            const g1 = parseInt(color1.slice(3, 5), 16);
            const b1 = parseInt(color1.slice(5, 7), 16);
            const r2 = parseInt(color2.slice(1, 3), 16);
            const g2 = parseInt(color2.slice(3, 5), 16);
            const b2 = parseInt(color2.slice(5, 7), 16);
            gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, 0.3)`);
            gradient.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, 0.0)`);
        } else {
            // Downward wind
            const color1 = applyColorProgression('#FFC0CB', intensity);
            const color2 = applyColorProgression('#000000', intensity);
            const r1 = parseInt(color1.slice(1, 3), 16);
            const g1 = parseInt(color1.slice(3, 5), 16);
            const b1 = parseInt(color1.slice(5, 7), 16);
            const r2 = parseInt(color2.slice(1, 3), 16);
            const g2 = parseInt(color2.slice(3, 5), 16);
            const b2 = parseInt(color2.slice(5, 7), 16);
            gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, 0.3)`);
            gradient.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, 0.0)`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(wind.x, wind.y, wind.width, wind.height);
        
        // Wind arrows
        const arrowColor = wind.strength < 0 
            ? applyColorProgression('#87CEEB', intensity)
            : applyColorProgression('#FFC0CB', intensity);
        ctx.strokeStyle = arrowColor;
        ctx.lineWidth = 2 * size;
        ctx.fillStyle = arrowColor;
        
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

function drawPowerups() {
    const intensity = getColorIntensity();
    powerupsList.forEach(powerup => {
        ctx.save();
        const floatOffset = Math.sin(powerup.floatOffset) * 5 * scaleY;
        ctx.translate(powerup.x, powerup.y + floatOffset);
        ctx.rotate(powerup.rotation);
        
        const size = Math.min(scaleX, scaleY);
        const powerupData = POWERUP_TYPES[powerup.type];
        
        // Powerup circle
        ctx.fillStyle = applyColorProgression('#9C27B0', intensity);
        ctx.strokeStyle = applyColorProgression('#7B1FA2', intensity);
        ctx.lineWidth = 2 * size;
        
        ctx.beginPath();
        ctx.arc(0, 0, powerup.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Powerup icon
        ctx.fillStyle = applyColorProgression('#FFFFFF', intensity);
        ctx.font = `bold ${16 * size}px cursive`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(powerupData.icon, 0, 0);
        
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
    
    // Draw powerups
    drawPowerups();
    
    // Draw plane
    drawPlane();
    
    // Draw particles
    drawParticles();
}

function gameLoop() {
    if (gameState === 'playing') {
        const { obstacleSpawnRate, coinSpawnRate, windSpawnRate, powerupSpawnRate } = updateDifficulty();
        
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
        
        // Spawn powerups
        powerupSpawnTimer++;
        if (powerupSpawnTimer >= powerupSpawnRate) {
            spawnPowerup();
            powerupSpawnTimer = 0;
        }
        
        updateObstacles();
        updateCoins();
        updateWindCurrents();
        updatePowerups();
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

