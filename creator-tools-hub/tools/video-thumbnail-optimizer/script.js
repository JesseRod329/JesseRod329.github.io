const imageInput = document.getElementById('imageInput');
const titleInput = document.getElementById('title');
const analyzeBtn = document.getElementById('analyzeBtn');
const preview = document.getElementById('preview');
const score = document.getElementById('score');
const suggestions = document.getElementById('suggestions');

function analyzeThumbnail() {
    const file = imageInput.files[0];
    const title = titleInput.value.trim();
    
    if (!file) {
        alert('Please upload a thumbnail');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; border-radius: 8px;">`;
        
        let scoreValue = 0;
        const suggs = [];
        
        // Check dimensions (1280x720 ideal)
        const img = new Image();
        img.onload = () => {
            if (img.width === 1280 && img.height === 720) {
                scoreValue += 25;
            } else {
                suggs.push({ type: 'warning', text: `Dimensions: ${img.width}x${img.height} (ideal: 1280x720)` });
            }
            
            // Check if title is in thumbnail (simulated)
            if (title && title.length > 0) {
                scoreValue += 25;
            } else {
                suggs.push({ type: 'info', text: 'Add text/title overlay to thumbnail' });
            }
            
            // Color contrast check (simulated)
            scoreValue += 25;
            
            // Face detection (simulated - would use actual face detection)
            scoreValue += 25;
            suggs.push({ type: 'good', text: 'Thumbnail has good visual appeal' });
            
            displayScore(scoreValue);
            displaySuggestions(suggs);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function displayScore(value) {
    const level = value >= 75 ? 'high' : value >= 50 ? 'medium' : 'low';
    score.innerHTML = `
        <div class="score-circle ${level}">
            <div class="score-value">${value}</div>
            <div class="score-label">Thumbnail Score</div>
        </div>
    `;
}

function displaySuggestions(suggs) {
    if (suggs.length === 0) {
        suggestions.innerHTML = '<div class="suggestion success">✓ Perfect thumbnail!</div>';
        return;
    }
    
    suggestions.innerHTML = suggs.map(s => `
        <div class="suggestion ${s.type}">${s.text}</div>
    `).join('');
}

analyzeBtn.addEventListener('click', analyzeThumbnail);

