const contentTextarea = document.getElementById('content');
const analyzeBtn = document.getElementById('analyzeBtn');
const styleMetrics = document.getElementById('styleMetrics');
const toneAnalysis = document.getElementById('toneAnalysis');

const formalWords = ['therefore', 'furthermore', 'consequently', 'nevertheless', 'moreover'];
const casualWords = ['hey', 'yeah', 'gonna', 'wanna', 'cool', 'awesome'];
const emotionalWords = ['amazing', 'incredible', 'terrible', 'wonderful', 'horrible'];

function analyzeStyle() {
    const content = contentTextarea.value.trim();
    if (!content) {
        alert('Please enter content to analyze');
        return;
    }
    
    const words = content.split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const lower = content.toLowerCase();
    
    // Tone detection
    let tone = 'neutral';
    let toneScore = { formal: 0, casual: 0, emotional: 0 };
    
    formalWords.forEach(word => {
        if (lower.includes(word)) toneScore.formal++;
    });
    casualWords.forEach(word => {
        if (lower.includes(word)) toneScore.casual++;
    });
    emotionalWords.forEach(word => {
        if (lower.includes(word)) toneScore.emotional++;
    });
    
    if (toneScore.formal > toneScore.casual && toneScore.formal > toneScore.emotional) {
        tone = 'formal';
    } else if (toneScore.casual > toneScore.emotional) {
        tone = 'casual';
    } else if (toneScore.emotional > 0) {
        tone = 'emotional';
    }
    
    // Metrics
    const avgWordsPerSentence = words.length / sentences.length;
    const avgCharsPerWord = content.replace(/\s+/g, '').length / words.length;
    
    styleMetrics.innerHTML = `
        <div class="metric-card">
            <div class="metric-item">
                <div class="metric-label">Tone</div>
                <div class="metric-value tone-${tone}">${tone.charAt(0).toUpperCase() + tone.slice(1)}</div>
            </div>
            <div class="metric-item">
                <div class="metric-label">Avg Words/Sentence</div>
                <div class="metric-value">${avgWordsPerSentence.toFixed(1)}</div>
            </div>
            <div class="metric-item">
                <div class="metric-label">Avg Chars/Word</div>
                <div class="metric-value">${avgCharsPerWord.toFixed(1)}</div>
            </div>
        </div>
    `;
    
    toneAnalysis.innerHTML = `
        <h3>Style Recommendations:</h3>
        <div class="recommendations">
            ${tone === 'formal' ? '<div class="rec-item">✓ Formal tone detected - appropriate for professional content</div>' : ''}
            ${tone === 'casual' ? '<div class="rec-item">✓ Casual tone - great for social media and blogs</div>' : ''}
            ${avgWordsPerSentence > 20 ? '<div class="rec-item warning">Consider breaking up long sentences</div>' : ''}
            ${avgCharsPerWord > 5 ? '<div class="rec-item info">Use simpler words for better readability</div>' : ''}
        </div>
    `;
}

analyzeBtn.addEventListener('click', analyzeStyle);

