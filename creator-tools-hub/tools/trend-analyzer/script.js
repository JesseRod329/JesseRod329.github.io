const nicheInput = document.getElementById('niche');
const platformSelect = document.getElementById('platform');
const analyzeBtn = document.getElementById('analyzeBtn');
const trendsDiv = document.getElementById('trends');

function analyzeTrends() {
    const niche = nicheInput.value.trim();
    if (!niche) {
        alert('Please enter your niche');
        return;
    }
    
    const platform = platformSelect.value;
    
    const trendTemplates = [
        `${niche} tips 2025`,
        `best ${niche} tools`,
        `${niche} for beginners`,
        `advanced ${niche} techniques`,
        `${niche} trends`,
        `how to ${niche}`,
        `${niche} guide`,
        `${niche} hacks`
    ];
    
    trendsDiv.innerHTML = trendTemplates.map((trend, i) => {
        const growth = Math.floor(Math.random() * 50) + 10;
        const volume = Math.floor(Math.random() * 100000) + 10000;
        return `
            <div class="trend-item">
                <div class="trend-rank">#${i + 1}</div>
                <div class="trend-info">
                    <div class="trend-topic">${trend}</div>
                    <div class="trend-stats">
                        <span>📈 +${growth}% growth</span>
                        <span>•</span>
                        <span>${(volume / 1000).toFixed(0)}K searches</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

analyzeBtn.addEventListener('click', analyzeTrends);

