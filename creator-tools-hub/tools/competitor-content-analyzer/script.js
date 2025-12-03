const competitorUrlInput = document.getElementById('competitorUrl');
const platformSelect = document.getElementById('platform');
const analyzeBtn = document.getElementById('analyzeBtn');
const analysisDiv = document.getElementById('analysis');

function analyzeCompetitor() {
    const url = competitorUrlInput.value.trim();
    if (!url) {
        alert('Please enter competitor URL or channel name');
        return;
    }
    
    const platform = platformSelect.value;
    
    // Simulated analysis
    const metrics = {
        avgViews: Math.floor(Math.random() * 50000) + 10000,
        avgLikes: Math.floor(Math.random() * 5000) + 1000,
        avgComments: Math.floor(Math.random() * 500) + 100,
        postingFrequency: '3-4 times per week',
        avgVideoLength: '8-12 minutes',
        topTopics: ['Tutorials', 'Reviews', 'Tips', 'Trends']
    };
    
    analysisDiv.innerHTML = `
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-label">Avg Views</div>
                <div class="metric-value">${metrics.avgViews.toLocaleString()}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Avg Likes</div>
                <div class="metric-value">${metrics.avgLikes.toLocaleString()}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Avg Comments</div>
                <div class="metric-value">${metrics.avgComments.toLocaleString()}</div>
            </div>
            <div class="metric-card">
                <div class="metric-label">Posting Frequency</div>
                <div class="metric-value">${metrics.postingFrequency}</div>
            </div>
        </div>
        <div class="insights">
            <h3>Content Strategy Insights</h3>
            <div class="insight-item">📹 Average content length: ${metrics.avgVideoLength}</div>
            <div class="insight-item">📝 Top content topics: ${metrics.topTopics.join(', ')}</div>
            <div class="insight-item">💡 Engagement rate: ${((metrics.avgLikes / metrics.avgViews) * 100).toFixed(2)}%</div>
        </div>
    `;
}

analyzeBtn.addEventListener('click', analyzeCompetitor);

