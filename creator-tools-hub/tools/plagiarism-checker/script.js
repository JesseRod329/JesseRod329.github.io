const contentTextarea = document.getElementById('content');
const checkBtn = document.getElementById('checkBtn');
const result = document.getElementById('result');
const matches = document.getElementById('matches');

const commonPhrases = [
    'the quick brown fox',
    'lorem ipsum dolor',
    'to be or not to be',
    'in the beginning'
];

function checkPlagiarism() {
    const content = contentTextarea.value.trim().toLowerCase();
    if (!content) {
        alert('Please enter content to check');
        return;
    }
    
    // Simulate plagiarism check
    const words = content.split(/\s+/);
    let matchCount = 0;
    const foundMatches = [];
    
    commonPhrases.forEach(phrase => {
        if (content.includes(phrase)) {
            matchCount++;
            foundMatches.push(phrase);
        }
    });
    
    // Calculate similarity (simulated)
    const similarity = Math.min(100, matchCount * 10 + Math.random() * 20);
    const originality = 100 - similarity;
    
    if (originality >= 80) {
        result.innerHTML = `
            <div class="result-card high">
                <div class="result-value">${originality.toFixed(1)}%</div>
                <div class="result-label">Original</div>
                <div class="result-desc">Your content appears to be original!</div>
            </div>
        `;
    } else if (originality >= 60) {
        result.innerHTML = `
            <div class="result-card medium">
                <div class="result-value">${originality.toFixed(1)}%</div>
                <div class="result-label">Mostly Original</div>
                <div class="result-desc">Some similarities detected. Review suggested.</div>
            </div>
        `;
    } else {
        result.innerHTML = `
            <div class="result-card low">
                <div class="result-value">${originality.toFixed(1)}%</div>
                <div class="result-label">Similarity Detected</div>
                <div class="result-desc">Significant similarities found. Rewrite recommended.</div>
            </div>
        `;
    }
    
    if (foundMatches.length > 0) {
        matches.innerHTML = `
            <h3>Potential Matches Found:</h3>
            ${foundMatches.map(m => `<div class="match-item">${m}</div>`).join('')}
        `;
    } else {
        matches.innerHTML = '<div class="no-matches">No common phrases detected</div>';
    }
}

checkBtn.addEventListener('click', checkPlagiarism);

