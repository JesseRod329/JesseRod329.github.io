// Game constants
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.15;
const THRUST = 0.35;
const TERMINAL_VELOCITY = 8;
const BASE_SPEED = 2;

// Game state
let canvas, ctx;
let plane = { x: 200, y: CANVAS_HEIGHT / 2, vx: 0, vy: 0, rotation: 0 };
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let score = 0;
let coins = 0;
let distance = 0;
let scrollSpeed = BASE_SPEED;
let gameTime = 0;

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
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx = canvas.getContext('2d');
    
    // Smooth sketch-style rendering
    ctx.imageSmoothingEnabled = false;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    // Event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    
    // Start screen
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameState === 'start') {
            startGame();
        }
    });
    
    updateUI();
    gameLoop();
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
    plane = { x: 200, y: CANVAS_HEIGHT / 2, vx: 0, vy: 0, rotation: 0 };
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
    // Input handling
    if (keys['ArrowUp'] || keys['KeyW']) {
        plane.vy -= THRUST;
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
        plane.vy += THRUST * 0.5;
    }
    if (keys['Space']) {
        plane.vy -= THRUST * 0.8;
    }
    
    // Apply gravity
    plane.vy += GRAVITY;
    
    // Limit velocity
    plane.vy = Math.max(-TERMINAL_VELOCITY, Math.min(TERMINAL_VELOCITY, plane.vy));
    
    // Update position
    plane.y += plane.vy;
    
    // Boundary collision
    if (plane.y < 20) {
        plane.y = 20;
        plane.vy = 0;
    }
    if (plane.y > CANVAS_HEIGHT - 20) {
        plane.y = CANVAS_HEIGHT - 20;
        plane.vy = 0;
    }
    
    // Update rotation based on velocity
    plane.rotation = plane.vy * 0.1;
    
    // Wind current effects
    windCurrents.forEach(wind => {
        if (plane.x + 50 > wind.x && plane.x < wind.x + wind.width &&
            plane.y + 20 > wind.y && plane.y < wind.y + wind.height) {
            plane.vy += wind.strength * 0.02;
        }
    });
}

function spawnObstacle() {
    const height = 80 + Math.random() * 120;
    const y = Math.random() * (CANVAS_HEIGHT - height - 100) + 50;
    obstacles.push({
        x: CANVAS_WIDTH,
        y: y,
        width: 40,
        height: height,
        type: Math.random() < 0.3 ? 'spike' : 'block'
    });
}

function spawnCoin() {
    coinsList.push({
        x: CANVAS_WIDTH,
        y: 100 + Math.random() * (CANVAS_HEIGHT - 200),
        radius: 12,
        collected: false,
        rotation: 0,
        floatOffset: Math.random() * Math.PI * 2
    });
}

function spawnWindCurrent() {
    const height = 150 + Math.random() * 100;
    const y = Math.random() * (CANVAS_HEIGHT - height - 50) + 25;
    windCurrents.push({
        x: CANVAS_WIDTH,
        y: y,
        width: 200,
        height: height,
        strength: (Math.random() - 0.5) * 4, // Negative = up, Positive = down
        lifetime: 300 + Math.random() * 200
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= scrollSpeed;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function updateCoins() {
    coinsList.forEach(coin => {
        coin.x -= scrollSpeed;
        coin.rotation += 0.1;
        coin.floatOffset += 0.05;
        
        // Check collision with plane
        const dx = coin.x - plane.x;
        const dy = coin.y + Math.sin(coin.floatOffset) * 5 - plane.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < coin.radius + 25 && !coin.collected) {
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
        wind.x -= scrollSpeed;
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
    const planeRect = {
        x: plane.x - 15,
        y: plane.y - 10,
        width: 30,
        height: 20
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
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Sketchy margin line
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(MARGIN_X, 0);
    ctx.lineTo(MARGIN_X, CANVAS_HEIGHT);
    ctx.stroke();
    
    // Notebook lines (hand-drawn style)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let y = LINE_SPACING; y < CANVAS_HEIGHT; y += LINE_SPACING) {
        // Add slight wobble for hand-drawn effect
        ctx.beginPath();
        ctx.moveTo(MARGIN_X + 20, y);
        for (let x = MARGIN_X + 20; x < CANVAS_WIDTH; x += 20) {
            const wobble = Math.sin(x * 0.1 + gameTime * 0.5) * 0.5;
            ctx.lineTo(x, y + wobble);
        }
        ctx.stroke();
    }
    
    // Distance markers
    const markerSpacing = 200;
    const currentMarker = Math.floor((CANVAS_WIDTH - plane.x) / markerSpacing);
    for (let i = 0; i < 5; i++) {
        const x = plane.x + (currentMarker + i) * markerSpacing;
        if (x > 0 && x < CANVAS_WIDTH) {
            ctx.strokeStyle = '#bbb';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, CANVAS_HEIGHT);
            ctx.stroke();
            
            const meters = Math.floor(distance) + Math.floor((x - plane.x) / markerSpacing * 10);
            ctx.fillStyle = '#999';
            ctx.font = '12px cursive';
            ctx.fillText(meters + 'm', x + 5, 15);
        }
    }
}

function drawPlane() {
    ctx.save();
    ctx.translate(plane.x, plane.y);
    ctx.rotate(plane.rotation);
    
    // Hand-drawn paper plane
    ctx.strokeStyle = '#333';
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 2;
    
    // Main body
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(0, -8);
    ctx.lineTo(20, 0);
    ctx.lineTo(0, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Center fold line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -8);
    ctx.stroke();
    
    // Sketchy details
    ctx.beginPath();
    ctx.moveTo(-15, 2);
    ctx.lineTo(-10, 0);
    ctx.moveTo(15, 2);
    ctx.lineTo(10, 0);
    ctx.stroke();
    
    ctx.restore();
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.save();
        
        if (obstacle.type === 'spike') {
            // Hand-drawn spike
            ctx.fillStyle = '#d32f2f';
            ctx.strokeStyle = '#b71c1c';
            ctx.lineWidth = 2;
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
            ctx.lineWidth = 3;
            
            // Sketchy rectangle
            const wobble = 2;
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
        ctx.translate(coin.x, coin.y + Math.sin(coin.floatOffset) * 5);
        ctx.rotate(coin.rotation);
        
        // Hand-drawn coin
        ctx.fillStyle = '#FFD700';
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Dollar sign
        ctx.fillStyle = '#FFA500';
        ctx.font = 'bold 14px cursive';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 0);
        
        ctx.restore();
    });
}

function drawWindCurrents() {
    windCurrents.forEach(wind => {
        ctx.save();
        
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
        ctx.lineWidth = 2;
        ctx.fillStyle = ctx.strokeStyle;
        
        const arrowCount = Math.floor(wind.height / 30);
        for (let i = 0; i < arrowCount; i++) {
            const arrowY = wind.y + i * 30 + 15;
            const arrowX = wind.x + wind.width / 2;
            
            ctx.beginPath();
            if (wind.strength < 0) {
                // Up arrow
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX - 5, arrowY + 8);
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX + 5, arrowY + 8);
            } else {
                // Down arrow
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX - 5, arrowY - 8);
                ctx.moveTo(arrowX, arrowY);
                ctx.lineTo(arrowX + 5, arrowY - 8);
            }
            ctx.stroke();
        }
        
        ctx.restore();
    });
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.lifetime / 30;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
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

