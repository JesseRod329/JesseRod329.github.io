// Voice to Color
// Synesthetic experience mapping voice to colors

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const waveCanvas = document.getElementById('waveCanvas');
const colorBg = document.getElementById('colorBg');
const colorHex = document.getElementById('colorHex');
const colorName = document.getElementById('colorName');
const pitchValue = document.getElementById('pitchValue');
const volumeValue = document.getElementById('volumeValue');
const emotionValue = document.getElementById('emotionValue');
const historyGrid = document.getElementById('historyGrid');

let audioContext, analyser, microphone, animationFrame;
let colorHistory = [];

const ctx = waveCanvas.getContext('2d');

// Color names mapping
const colorNames = {
    0: 'Red', 30: 'Orange', 60: 'Yellow', 120: 'Green',
    180: 'Cyan', 240: 'Blue', 270: 'Purple', 300: 'Magenta'
};

function getColorName(hue) {
    const keys = Object.keys(colorNames).map(Number);
    const closest = keys.reduce((prev, curr) =>
        Math.abs(curr - hue) < Math.abs(prev - hue) ? curr : prev
    );
    return colorNames[closest];
}

// Start audio
async function startAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        microphone = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;

        microphone.connect(analyser);

        startBtn.disabled = true;
        stopBtn.disabled = false;

        analyze();
    } catch (error) {
        console.error('Microphone access denied:', error);
        alert('Please allow microphone access');
    }
}

// Stop audio
function stopAudio() {
    if (microphone) {
        microphone.disconnect();
        microphone = null;
    }

    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }

    startBtn.disabled = false;
    stopBtn.disabled = true;
}

// Analyze audio
function analyze() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(dataArray);
    analyser.getByteTimeDomainData(timeData);

    // Calculate volume
    const volume = dataArray.reduce((a, b) => a + b) / bufferLength;
    const normalizedVolume = Math.min(volume / 128, 1);

    // Calculate pitch (dominant frequency)
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxValue) {
            maxValue = dataArray[i];
            maxIndex = i;
        }
    }

    const pitch = (maxIndex / bufferLength) * (audioContext.sampleRate / 2);
    const normalizedPitch = Math.min(pitch / 1000, 1);

    // Calculate "emotion" (spectral centroid approximation)
    let weightedSum = 0;
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
        weightedSum += dataArray[i] * i;
        sum += dataArray[i];
    }
    const centroid = sum > 0 ? weightedSum / sum : 0;
    const normalizedCentroid = centroid / bufferLength;

    // Map to color
    const hue = Math.floor(normalizedPitch * 360);
    const saturation = Math.floor(normalizedVolume * 100);
    const lightness = Math.floor(50 + normalizedCentroid * 30);

    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const hexColor = hslToHex(hue, saturation, lightness);

    // Update UI
    colorBg.style.background = `linear-gradient(135deg, ${color}, hsl(${(hue + 60) % 360}, ${saturation}%, ${lightness}%))`;
    colorHex.textContent = hexColor;
    colorName.textContent = getColorName(hue);

    pitchValue.textContent = `${Math.round(pitch)} Hz`;
    volumeValue.textContent = `${Math.round(normalizedVolume * 100)}%`;

    // Emotion based on spectral characteristics
    const emotions = ['Calm', 'Neutral', 'Energetic', 'Intense'];
    const emotionIndex = Math.min(Math.floor(normalizedCentroid * 4), 3);
    emotionValue.textContent = emotions[emotionIndex];

    // Add to history
    if (volume > 20 && colorHistory[colorHistory.length - 1] !== hexColor) {
        addToHistory(hexColor);
    }

    // Draw waveform
    drawWaveform(timeData);

    animationFrame = requestAnimationFrame(analyze);
}

// Draw waveform
function drawWaveform(dataArray) {
    const width = waveCanvas.width = waveCanvas.offsetWidth * 2;
    const height = waveCanvas.height = 600;
    ctx.scale(2, 2);

    ctx.clearRect(0, 0, width / 2, height / 2);

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();

    const sliceWidth = (width / 2) / dataArray.length;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * (height / 4);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    ctx.stroke();
}

// Add color to history
function addToHistory(hex) {
    colorHistory.unshift(hex);
    if (colorHistory.length > 15) colorHistory.pop();

    historyGrid.innerHTML = colorHistory.map(color =>
        `<div class="history-color" style="background: ${color};" title="${color}"></div>`
    ).join('');
}

// HSL to Hex conversion
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Event listeners
startBtn.addEventListener('click', startAudio);
stopBtn.addEventListener('click', stopAudio);

// Resize canvas
function resizeCanvas() {
    const rect = waveCanvas.getBoundingClientRect();
    waveCanvas.width = rect.width;
    waveCanvas.height = rect.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
