const contentTextarea = document.getElementById('content');
const targetKeywordInput = document.getElementById('targetKeyword');
const analyzeBtn = document.getElementById('analyzeBtn');
const scoreValue = document.getElementById('scoreValue');
const suggestionsDiv = document.getElementById('suggestions');

function analyzeSEO() {
    const content = contentTextarea.value.trim();
    const keyword = targetKeywordInput.value.trim().toLowerCase();
    
    if (!content) {
        alert('Please enter content to analyze');
        return;
    }
    
    let score = 0;
    const suggestions = [];
    const words = content.toLowerCase().split(/\s+/);
    const wordCount = words.length;
    const charCount = content.length;
    
    // Keyword in title (first 60 chars)
    const first60 = content.substring(0, 60).toLowerCase();
    if (keyword && first60.includes(keyword)) {
        score += 15;
    } else if (keyword) {
        suggestions.push({ type: 'warning', text: 'Add target keyword in the first 60 characters' });
    }
    
    // Keyword density (1-2% ideal)
    if (keyword) {
        const keywordCount = (content.toLowerCase().match(new RegExp(keyword, 'g')) || []).length;
        const density = (keywordCount / wordCount) * 100;
        if (density >= 1 && density <= 2) {
            score += 20;
        } else if (density < 1) {
            suggestions.push({ type: 'info', text: `Increase keyword usage (current: ${density.toFixed(2)}%, target: 1-2%)` });
        } else {
            suggestions.push({ type: 'warning', text: `Reduce keyword usage (current: ${density.toFixed(2)}%, target: 1-2%)` });
        }
    }
    
    // Word count (300+ words ideal)
    if (wordCount >= 300) {
        score += 15;
    } else {
        suggestions.push({ type: 'info', text: `Increase content length (current: ${wordCount} words, target: 300+)` });
    }
    
    // Headings (H1, H2, H3)
    const h1Count = (content.match(/^#\s/gm) || []).length;
    const h2Count = (content.match(/^##\s/gm) || []).length;
    if (h1Count > 0) score += 10;
    if (h2Count >= 2) score += 10;
    if (h2Count < 2) {
        suggestions.push({ type: 'info', text: 'Add more subheadings (H2) to improve structure' });
    }
    
    // Internal/external links (simulated)
    const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    if (linkCount >= 2) {
        score += 10;
    } else {
        suggestions.push({ type: 'info', text: 'Add 2+ relevant links to improve SEO' });
    }
    
    // Readability (sentence length)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
    if (avgSentenceLength >= 10 && avgSentenceLength <= 20) {
        score += 10;
    } else {
        suggestions.push({ type: 'info', text: `Optimize sentence length (current avg: ${avgSentenceLength.toFixed(1)} words, target: 10-20)` });
    }
    
    // Meta description length (if provided)
    if (charCount >= 120 && charCount <= 160) {
        score += 10;
    }
    
    // Update score
    scoreValue.textContent = Math.min(score, 100);
    scoreValue.parentElement.className = `score-circle ${score >= 70 ? 'good' : score >= 50 ? 'medium' : 'poor'}`;
    
    // Display suggestions
    if (suggestions.length === 0) {
        suggestionsDiv.innerHTML = '<div class="suggestion success">✓ Great! Your content is well optimized.</div>';
    } else {
        suggestionsDiv.innerHTML = suggestions.map(s => 
            `<div class="suggestion ${s.type}">${s.text}</div>`
        ).join('');
    }
}

analyzeBtn.addEventListener('click', analyzeSEO);
contentTextarea.addEventListener('input', () => {
    if (contentTextarea.value.trim()) analyzeSEO();
});

