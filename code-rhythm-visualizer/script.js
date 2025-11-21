// Code Rhythm Visualizer
// Transform code into music and visual patterns

const codeInput = document.getElementById('codeInput');
const languageSelect = document.getElementById('languageSelect');
const visualizeBtn = document.getElementById('visualizeBtn');
const stopBtn = document.getElementById('stopBtn');
const visualCanvas = document.getElementById('visualCanvas');
const speedControl = document.getElementById('speedControl');
const volumeControl = document.getElementById('volumeControl');
const tokenCount = document.getElementById('tokenCount');
const bpmValue = document.getElementById('bpmValue');
const progressValue = document.getElementById('progressValue');

// Audio Context
let audioContext;
let isPlaying = false;
let currentAnimation;
let particles = [];

// Token to Note Mapping
const tokenToNote = {
    'keyword': 261.63,    // C4
    'operator': 293.66,   // D4
    'bracket': 329.63,    // E4
    'string': 349.23,     // F4
    'number': 392.00,     // G4
    'function': 440.00,   // A4
    'comment': 493.88,    // B4
    'identifier': 523.25  // C5
};

// Setup canvas
const ctx = visualCanvas.getContext('2d');
function resizeCanvas() {
    const rect = visualCanvas.getBoundingClientRect();
    visualCanvas.width = rect.width * 2;
    visualCanvas.height = rect.height * 2;
    ctx.scale(2, 2);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Tokenize code
function tokenizeCode(code, language) {
    const tokens = [];

    // Simple regex-based tokenization
    const patterns = {
        keyword: /\b(function|const|let|var|if|else|for|while|return|class|import|export|async|await|def|class|lambda|try|except)\b/g,
        string: /(["'`])(?:(?=(\\?))\2.)*?\1/g,
        number: /\b\d+\.?\d*\b/g,
        comment: /(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/g,
        operator: /[+\-*/%=<>!&|^~?:]/g,
        bracket: /[(){}\[\]]/g,
        function: /\b\w+(?=\s*\()/g
    };

    let position = 0;
    const codeLength = code.length;

    while (position < codeLength) {
        let matched = false;

        for (const [type, pattern] of Object.entries(patterns)) {
            pattern.lastIndex = position;
            const match = pattern.exec(code);

            if (match && match.index === position) {
                tokens.push({
                    type,
                    value: match[0],
                    position
                });
                position = pattern.lastIndex;
                matched = true;
                break;
            }
        }

        if (!matched) {
            position++;
        }
    }

    return tokens;
}

// Play note
function playNote(frequency, duration, volume) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);

    return { oscillator, gainNode };
}

// Create particle
function createParticle(x, y, color) {
    particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: Math.random() * 3 + 2,
        color,
        life: 1.0
    });
}

// Visualize code
async function visualizeCode() {
    const code = codeInput.value.trim();
    if (!code) return;

    const tokens = tokenizeCode(code, languageSelect.value);
    tokenCount.textContent = tokens.length;

    const speed = parseFloat(speedControl.value);
    const volume = parseFloat(volumeControl.value);
    const baseDuration = 200 / speed; // ms per token

    isPlaying = true;
    visualizeBtn.disabled = true;
    stopBtn.disabled = false;

    particles = [];
    let currentToken = 0;

    // Color map for token types
    const colorMap = {
        keyword: '#6366f1',
        operator: '#8b5cf6',
        bracket: '#14b8a6',
        string: '#f59e0b',
        number: '#f43f5e',
        function: '#06b6d4',
        comment: '#94a3b8',
        identifier: '#cbd5e1'
    };

    // Animation loop
    function animate() {
        if (!isPlaying) return;

        const rect = visualCanvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Clear canvas
        ctx.fillStyle = 'rgba(15, 15, 35, 0.2)';
        ctx.fillRect(0, 0, width, height);

        // Update and draw particles
        particles = particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;

            if (p.life <= 0) return false;

            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            return true;
        });

        ctx.globalAlpha = 1;

        // Draw waveform
        const centerY = height / 2;
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let x = 0; x < width; x += 5) {
            const y = centerY + Math.sin((x + Date.now() * 0.01) * 0.05) * 20;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        currentAnimation = requestAnimationFrame(animate);
    }

    animate();

    // Play tokens
    for (let i = 0; i < tokens.length && isPlaying; i++) {
        const token = tokens[i];
        const frequency = tokenToNote[token.type] || 440;
        const duration = baseDuration / 1000;

        // Play note
        playNote(frequency, duration, volume);

        // Create visual particle
        const x = (i / tokens.length) * visualCanvas.width / 2;
        const y = visualCanvas.height / 4;
        createParticle(x, y, colorMap[token.type] || '#ffffff');

        // Update progress
        const progress = Math.round((i / tokens.length) * 100);
        progressValue.textContent = `${progress}%`;

        // Wait before next token
        await new Promise(resolve => setTimeout(resolve, baseDuration));
    }

    if (isPlaying) {
        progressValue.textContent = '100%';
        setTimeout(stopVisualization, 1000);
    }
}

// Stop visualization
function stopVisualization() {
    isPlaying = false;
    visualizeBtn.disabled = false;
    stopBtn.disabled = true;

    if (currentAnimation) {
        cancelAnimationFrame(currentAnimation);
    }

    progressValue.textContent = '0%';
}

// Event listeners
visualizeBtn.addEventListener('click', visualizeCode);
stopBtn.addEventListener('click', stopVisualization);

speedControl.addEventListener('input', (e) => {
    const bpm = Math.round(120 * parseFloat(e.target.value));
    bpmValue.textContent = bpm;
});

// Initialize
bpmValue.textContent = '120';
