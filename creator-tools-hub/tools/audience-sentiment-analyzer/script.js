const commentsTextarea = document.getElementById('comments');
const analyzeBtn = document.getElementById('analyzeBtn');
const positiveCount = document.getElementById('positiveCount');
const neutralCount = document.getElementById('neutralCount');
const negativeCount = document.getElementById('negativeCount');
const resultsDiv = document.getElementById('results');

const positiveWords = ['love', 'great', 'amazing', 'awesome', 'fantastic', 'excellent', 'perfect', 'wonderful', 'best', 'good', 'nice', 'happy', 'thanks', 'thank you', 'brilliant', 'outstanding', 'superb', 'incredible', 'fabulous', 'delighted'];
const negativeWords = ['hate', 'terrible', 'awful', 'bad', 'worst', 'horrible', 'disgusting', 'disappointed', 'angry', 'frustrated', 'annoyed', 'sucks', 'stupid', 'ridiculous', 'pathetic', 'useless', 'garbage', 'trash', 'dislike', 'disgusting'];

function analyzeSentiment() {
    const comments = commentsTextarea.value.trim().split('\n').filter(c => c.trim());
    if (comments.length === 0) {
        alert('Please enter comments to analyze');
        return;
    }
    
    let positive = 0, neutral = 0, negative = 0;
    const analyzed = [];
    
    comments.forEach(comment => {
        const sentiment = getSentiment(comment);
        analyzed.push({ comment, sentiment });
        if (sentiment === 'positive') positive++;
        else if (sentiment === 'negative') negative++;
        else neutral++;
    });
    
    positiveCount.textContent = positive;
    neutralCount.textContent = neutral;
    negativeCount.textContent = negative;
    
    resultsDiv.innerHTML = analyzed.map(item => {
        const icon = item.sentiment === 'positive' ? '😊' : item.sentiment === 'negative' ? '😞' : '😐';
        return `<div class="result-item ${item.sentiment}">${icon} ${item.comment}</div>`;
    }).join('');
}

function getSentiment(text) {
    const lower = text.toLowerCase();
    let positiveScore = 0, negativeScore = 0;
    
    positiveWords.forEach(word => {
        if (lower.includes(word)) positiveScore++;
    });
    
    negativeWords.forEach(word => {
        if (lower.includes(word)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
}

analyzeBtn.addEventListener('click', analyzeSentiment);

