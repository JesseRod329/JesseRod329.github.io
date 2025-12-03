const age18_24 = document.getElementById('age18-24');
const age25_34 = document.getElementById('age25-34');
const age35_44 = document.getElementById('age35-44');
const age45Plus = document.getElementById('age45+');
const visualizeBtn = document.getElementById('visualizeBtn');
const chartsDiv = document.getElementById('charts');

function visualizeDemographics() {
    const data = [
        { label: '18-24', value: parseInt(age18_24.value) || 0, color: '#667eea' },
        { label: '25-34', value: parseInt(age25_34.value) || 0, color: '#764ba2' },
        { label: '35-44', value: parseInt(age35_44.value) || 0, color: '#f093fb' },
        { label: '45+', value: parseInt(age45Plus.value) || 0, color: '#4facfe' }
    ];
    
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) {
        alert('Please enter demographic data');
        return;
    }
    
    chartsDiv.innerHTML = data.map(d => {
        const percentage = total > 0 ? (d.value / total * 100).toFixed(1) : 0;
        return `
            <div class="chart-item">
                <div class="chart-label">${d.label} years</div>
                <div class="chart-bar-container">
                    <div class="chart-bar" style="width: ${percentage}%; background: ${d.color}"></div>
                    <div class="chart-value">${percentage}%</div>
                </div>
            </div>
        `;
    }).join('');
}

visualizeBtn.addEventListener('click', visualizeDemographics);
visualizeDemographics(); // Show on load

