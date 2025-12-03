const followersInput = document.getElementById('followers');
const engagementRateInput = document.getElementById('engagementRate');
const platformSelect = document.getElementById('platform');
const calculateBtn = document.getElementById('calculateBtn');
const rate = document.getElementById('rate');
const breakdown = document.getElementById('breakdown');

const platformMultipliers = {
    instagram: 0.01,
    youtube: 0.02,
    tiktok: 0.008,
    twitter: 0.005
};

function calculateRate() {
    const followers = parseInt(followersInput.value) || 0;
    const engagementRate = parseFloat(engagementRateInput.value) || 0;
    const platform = platformSelect.value;
    
    if (followers === 0) {
        alert('Please enter follower count');
        return;
    }
    
    const baseRate = followers * platformMultipliers[platform];
    const engagementBonus = engagementRate > 3 ? baseRate * 0.2 : engagementRate > 2 ? baseRate * 0.1 : 0;
    const totalRate = baseRate + engagementBonus;
    
    rate.textContent = '$' + Math.round(totalRate).toLocaleString();
    
    breakdown.innerHTML = `
        <div class="breakdown-item">
            <div class="breakdown-label">Base Rate</div>
            <div class="breakdown-value">$${Math.round(baseRate).toLocaleString()}</div>
        </div>
        ${engagementBonus > 0 ? `
        <div class="breakdown-item">
            <div class="breakdown-label">Engagement Bonus</div>
            <div class="breakdown-value">+$${Math.round(engagementBonus).toLocaleString()}</div>
        </div>
        ` : ''}
        <div class="breakdown-item total">
            <div class="breakdown-label">Total Rate</div>
            <div class="breakdown-value">$${Math.round(totalRate).toLocaleString()}</div>
        </div>
    `;
}

calculateBtn.addEventListener('click', calculateRate);

