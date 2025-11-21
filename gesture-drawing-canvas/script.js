// Gesture Drawing Canvas
// Draw with hand gestures using TensorFlow.js

const webcam = document.getElementById('webcam');
const drawingCanvas = document.getElementById('drawingCanvas');
const ctx = drawingCanvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const brushSize = document.getElementById('brushSize');
const brushSizeValue = document.getElementById('brushSizeValue');
const colorBtns = document.querySelectorAll('.color-btn');
const status = document.getElementById('statusText');
const statusDot = document.querySelector('.status-dot');

let model;
let isDrawing = false;
let currentColor = '#f59e0b';
let currentBrushSize = 5;
let lastPoint = null;
let animationFrame;

// Setup canvas
function resizeCanvas() {
    const rect = drawingCanvas.getBoundingClientRect();
    drawingCanvas.width = rect.width;
    drawingCanvas.height = rect.height;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Start camera
async function startCamera() {
    try {
        status.textContent = 'Loading hand tracking model...';

        // Load handpose model
        model = await handpose.load();

        // Get webcam stream
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }
        });

        webcam.srcObject = stream;
        await webcam.play();

        status.textContent = 'Hand tracking active';
        statusDot.classList.add('active');
        startBtn.disabled = true;
        stopBtn.disabled = false;

        // Start detection loop
        detectHands();
    } catch (error) {
        console.error('Error starting camera:', error);
        status.textContent = 'Camera access denied';
    }
}

// Stop camera
function stopCamera() {
    if (webcam.srcObject) {
        webcam.srcObject.getTracks().forEach(track => track.stop());
        webcam.srcObject = null;
    }

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    status.textContent = 'Camera stopped';
    statusDot.classList.remove('active');
    startBtn.disabled = false;
    stopBtn.disabled = true;
    lastPoint = null;
}

// Detect hands
async function detectHands() {
    if (!model || !webcam.srcObject) return;

    const predictions = await model.estimateHands(webcam);

    if (predictions.length > 0) {
        const hand = predictions[0];
        processGesture(hand);
    } else {
        lastPoint = null;
    }

    animationFrame = requestAnimationFrame(detectHands);
}

// Process hand gesture
function processGesture(hand) {
    const landmarks = hand.landmarks;

    // Get finger tip positions
    const indexTip = landmarks[8];  // Index finger tip
    const middleTip = landmarks[12]; // Middle finger tip
    const thumbTip = landmarks[4];   // Thumb tip

    // Calculate distances
    const indexMiddleDistance = Math.hypot(
        indexTip[0] - middleTip[0],
        indexTip[1] - middleTip[1]
    );

    const thumbIndexDistance = Math.hypot(
        indexTip[0] - thumbTip[0],
        indexTip[1] - thumbTip[1]
    );

    // Map webcam coordinates to canvas
    const canvasX = (1 - indexTip[0] / webcam.videoWidth) * drawingCanvas.width;
    const canvasY = (indexTip[1] / webcam.videoHeight) * drawingCanvas.height;

    // Gesture detection
    if (thumbIndexDistance < 50) {
        // Fist - erase mode
        erase(canvasX, canvasY);
        status.textContent = 'Erasing...';
    } else if (indexMiddleDistance < 50) {
        // Peace sign - pause
        lastPoint = null;
        status.textContent = 'Paused (Peace sign detected)';
    } else {
        // Index finger pointing - draw
        draw(canvasX, canvasY);
        status.textContent = 'Drawing...';
    }
}

// Draw on canvas
function draw(x, y) {
    if (lastPoint) {
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentBrushSize;
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    lastPoint = { x, y };
}

// Erase on canvas
function erase(x, y) {
    ctx.clearRect(
        x - currentBrushSize * 2,
        y - currentBrushSize * 2,
        currentBrushSize * 4,
        currentBrushSize * 4
    );
    lastPoint = null;
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    lastPoint = null;
}

// Download drawing
function downloadDrawing() {
    const link = document.createElement('a');
    link.download = 'gesture-drawing.png';
    link.href = drawingCanvas.toDataURL();
    link.click();
}

// Color selection
colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentColor = btn.dataset.color;
    });
});

// Brush size
brushSize.addEventListener('input', (e) => {
    currentBrushSize = parseInt(e.target.value);
    brushSizeValue.textContent = `${currentBrushSize}px`;
});

// Event listeners
startBtn.addEventListener('click', startCamera);
stopBtn.addEventListener('click', stopCamera);
clearBtn.addEventListener('click', clearCanvas);
downloadBtn.addEventListener('click', downloadDrawing);

// Initialize
brushSizeValue.textContent = `${currentBrushSize}px`;
