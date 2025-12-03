const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const platformSelect = document.getElementById('platform');
const categorySelect = document.getElementById('category');
const predictBtn = document.getElementById('predictBtn');
const scoreValue = document.getElementById('scoreValue');
const predictionDetails = document.getElementById('predictionDetails');

function predictPerformance() {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const platform = platformSelect.value;
    const category = categorySelect.value;
    
    if (!title) {
        alert('Please enter a title');
        return;
    }
    
    let score = 0;
    const factors = [];
    
    // Title length (optimal: 40-60 chars)
    if (title.length >= 40 && title.length <= 60) {
        score += 20;
        factors.push({ type: 'good', text: 'Title length is optimal (40-60 characters)' });
    } else {
        factors.push({ type: 'warning', text: `Title length: ${title.length} chars (optimal: 40-60)` });
    }
    
    // Description length
    if (description.length >= 100) {
        score += 15;
        factors.push({ type: 'good', text: 'Description is detailed enough' });
    } else {
        factors.push({ type: 'info', text: 'Consider adding more detail to description' });
    }
    
    // Platform-specific factors
    if (platform === 'youtube' && title.length >= 50) {
        score += 15;
    } else if (platform === 'tiktok' && title.length <= 50) {
        score += 15;
    } else if (platform === 'instagram' && description.length >= 150) {
        score += 15;
    }
    
    // Engagement keywords
    const engagementWords = ['how', 'why', 'best', 'top', 'ultimate', 'guide', 'tips', 'tricks'];
    const hasEngagementWord = engagementWords.some(word => title.toLowerCase().includes(word));
    if (hasEngagementWord) {
        score += 20;
        factors.push({ type: 'good', text: 'Title contains engagement keywords' });
    }
    
    // Question mark (increases engagement)
    if (title.includes('?')) {
        score += 10;
        factors.push({ type: 'good', text: 'Question format increases engagement' });
    }
    
    // Numbers in title
    if (/\d/.test(title)) {
        score += 10;
        factors.push({ type: 'good', text: 'Numbers in title improve click-through' });
    }
    
    // Category relevance
    score += 10;
    factors.push({ type: 'info', text: `Category: ${category}` });
    
    score = Math.min(score, 100);
    scoreValue.textContent = score;
    scoreValue.parentElement.className = `prediction-score ${score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low'}`;
    
    predictionDetails.innerHTML = factors.map(f => 
        `<div class="factor ${f.type}">${f.text}</div>`
    ).join('');
}

predictBtn.addEventListener('click', predictPerformance);

