const contentTextarea = document.getElementById('content');
const analyzeBtn = document.getElementById('analyzeBtn');
const scoreValue = document.getElementById('scoreValue');
const enhancedContent = document.getElementById('enhancedContent');
const suggestions = document.getElementById('suggestions');

function analyzeReadability() {
    const content = contentTextarea.value.trim();
    if (!content) {
        alert('Please enter content to analyze');
        return;
    }
    
    const words = content.split(/\s+/);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = estimateSyllables(words);
    
    // Flesch Reading Ease approximation
    let score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    score = Math.max(0, Math.min(100, score));
    
    scoreValue.textContent = Math.round(score);
    scoreValue.parentElement.className = `score-circle ${score >= 60 ? 'good' : score >= 40 ? 'medium' : 'poor'}`;
    
    // Generate suggestions
    const suggs = [];
    if (avgWordsPerSentence > 20) {
        suggs.push({ type: 'warning', text: 'Break up long sentences (avg: ' + avgWordsPerSentence.toFixed(1) + ' words)' });
    }
    if (avgSyllablesPerWord > 1.5) {
        suggs.push({ type: 'info', text: 'Use simpler words to improve readability' });
    }
    if (words.length < 100) {
        suggs.push({ type: 'info', text: 'Add more content for better context' });
    }
    
    // Enhanced version
    let enhanced = content;
    if (avgWordsPerSentence > 20) {
        enhanced = enhanced.replace(/\. /g, '. ').replace(/, /g, ', ');
    }
    
    enhancedContent.innerHTML = `<div class="content-box"><pre>${enhanced}</pre></div>`;
    
    if (suggs.length === 0) {
        suggestions.innerHTML = '<div class="suggestion success">✓ Great readability!</div>';
    } else {
        suggestions.innerHTML = suggs.map(s => `<div class="suggestion ${s.type}">${s.text}</div>`).join('');
    }
}

function estimateSyllables(words) {
    let total = 0;
    words.forEach(word => {
        const clean = word.toLowerCase().replace(/[^a-z]/g, '');
        const matches = clean.match(/[aeiouy]+/g);
        total += matches ? matches.length : 1;
    });
    return total / words.length;
}

analyzeBtn.addEventListener('click', analyzeReadability);

