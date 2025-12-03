const currentFollowersInput = document.getElementById('currentFollowers');
const growthRateInput = document.getElementById('growthRate');
const monthsInput = document.getElementById('months');
const projectBtn = document.getElementById('projectBtn');
const projectionDiv = document.getElementById('projection');

function projectGrowth() {
    const current = parseInt(currentFollowersInput.value) || 0;
    const rate = parseFloat(growthRateInput.value) || 0;
    const months = parseInt(monthsInput.value) || 12;
    
    if (current === 0) {
        alert('Please enter current follower count');
        return;
    }
    
    if (rate === 0) {
        alert('Please enter growth rate');
        return;
    }
    
    let projected = current;
    const projections = [{ month: 0, followers: current }];
    
    for (let i = 1; i <= months; i++) {
        projected = projected * (1 + rate / 100);
        projections.push({ month: i, followers: Math.round(projected) });
    }
    
    const finalFollowers = Math.round(projected);
    const totalGrowth = finalFollowers - current;
    const growthPercentage = ((totalGrowth / current) * 100).toFixed(1);
    
    projectionDiv.innerHTML = `
        <div class="summary-card">
            <div class="summary-item">
                <div class="summary-label">Current</div>
                <div class="summary-value">${current.toLocaleString()}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Projected (${months} months)</div>
                <div class="summary-value">${finalFollowers.toLocaleString()}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Growth</div>
                <div class="summary-value">+${growthPercentage}%</div>
            </div>
        </div>
        <div class="chart">
            ${projections.map((p, i) => `
                <div class="chart-bar" style="height: ${(p.followers / finalFollowers) * 200}px" title="Month ${p.month}: ${p.followers.toLocaleString()}"></div>
            `).join('')}
        </div>
    `;
}

projectBtn.addEventListener('click', projectGrowth);

