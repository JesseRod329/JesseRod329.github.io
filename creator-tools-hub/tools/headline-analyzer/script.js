const headlineInput = document.getElementById('headline');
const analyzeBtn = document.getElementById('analyzeBtn');
const scoreValue = document.getElementById('scoreValue');
const analysis = document.getElementById('analysis');

const powerWords = ['ultimate', 'complete', 'best', 'top', 'essential', 'proven', 'secret', 'amazing', 'incredible', 'powerful'];
const emotionalWords = ['love', 'hate', 'fear', 'hope', 'dream', 'achieve', 'transform', 'discover'];
const numbers = /\d+/;

function analyzeHeadline() {
    const headline = headlineInput.value.trim();
    if (!headline) {
        alert('Please enter a headline');
        return;
    }
    
    let score = 0;
    const factors = [];
    const lower = headline.toLowerCase();
    
    // Length check (50-60 chars optimal)
    if (headline.length >= 50 && headline.length <= 60) {
        score += 20;
        factors.push({ type: 'good', text: 'Optimal length (50-60 characters)' });
    } else {
        factors.push({ type: 'warning', text: `Length: ${headline.length} chars (optimal: 50-60)` });
    }
    
    // Power words
    const hasPowerWord = powerWords.some(word => lower.includes(word));
    if (hasPowerWord) {
        score += 20;
        factors.push({ type: 'good', text: 'Contains power words' });
    }
    
    // Emotional words
    const hasEmotional = emotionalWords.some(word => lower.includes(word));
    if (hasEmotional) {
        score += 15;
        factors.push({ type: 'good', text: 'Contains emotional triggers' });
    }
    
    // Numbers
    if (numbers.test(headline)) {
        score += 15;
        factors.push({ type: 'good', text: 'Contains numbers (increases CTR)' });
    }
    
    // Question mark
    if (headline.includes('?')) {
        score += 10;
        factors.push({ type: 'good', text: 'Question format increases engagement' });
    }
    
    // First word
    const firstWord = headline.split(' ')[0];
    if (['how', 'why', 'what', 'when', 'where', 'the', 'a', 'an'].includes(firstWord.toLowerCase())) {
        score += 10;
        factors.push({ type: 'good', text: 'Strong opening word' });
    }
    
    score = Math.min(score, 100);
    scoreValue.textContent = score;
    scoreValue.parentElement.className = `score-circle ${score >= 70 ? 'good' : score >= 50 ? 'medium' : 'poor'}`;
    
    analysis.innerHTML = factors.map(f => `<div class="factor ${f.type}">${f.text}</div>`).join('');
}

analyzeBtn.addEventListener('click', analyzeHeadline);

