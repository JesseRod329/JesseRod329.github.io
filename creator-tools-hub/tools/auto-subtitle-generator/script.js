const transcriptInput = document.getElementById('transcript');
const languageSelect = document.getElementById('language');
const positionSelect = document.getElementById('position');
const maxCharsInput = document.getElementById('maxChars');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const subtitleOutput = document.getElementById('subtitleOutput');

function generateSubtitles() {
    const transcript = transcriptInput.value.trim();
    if (!transcript) {
        alert('Please enter a transcript');
        return;
    }
    
    const maxChars = parseInt(maxCharsInput.value);
    const words = transcript.split(/\s+/);
    const chunks = [];
    let currentChunk = '';
    
    words.forEach(word => {
        if ((currentChunk + ' ' + word).length <= maxChars) {
            currentChunk += (currentChunk ? ' ' : '') + word;
        } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = word;
        }
    });
    if (currentChunk) chunks.push(currentChunk);
    
    let srt = '';
    let startTime = 0;
    const durationPerChunk = 3000; // 3 seconds per chunk
    
    chunks.forEach((chunk, index) => {
        const start = formatTime(startTime);
        const end = formatTime(startTime + durationPerChunk);
        srt += `${index + 1}\n${start} --> ${end}\n${chunk}\n\n`;
        startTime += durationPerChunk;
    });
    
    subtitleOutput.textContent = srt;
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
}

function copySubtitles() {
    const text = subtitleOutput.textContent;
    if (!text) {
        alert('No subtitles to copy');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
    });
}

generateBtn.addEventListener('click', generateSubtitles);
copyBtn.addEventListener('click', copySubtitles);

