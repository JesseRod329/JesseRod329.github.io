const investmentInput = document.getElementById('investment');
const revenueInput = document.getElementById('revenue');
const contentTypeSelect = document.getElementById('contentType');
const calculateBtn = document.getElementById('calculateBtn');
const roi = document.getElementById('roi');
const breakdown = document.getElementById('breakdown');

function calculateROI() {
    const investment = parseFloat(investmentInput.value) || 0;
    const revenue = parseFloat(revenueInput.value) || 0;
    
    if (investment === 0) {
        alert('Please enter investment amount');
        return;
    }
    
    if (revenue === 0) {
        alert('Please enter revenue generated');
        return;
    }
    
    const roiValue = ((revenue - investment) / investment) * 100;
    const profit = revenue - investment;
    
    roi.textContent = roiValue.toFixed(2) + '%';
    roi.parentElement.className = `result-card ${roiValue >= 100 ? 'high' : roiValue >= 0 ? 'medium' : 'low'}`;
    
    breakdown.innerHTML = `
        <div class="breakdown-item">
            <div class="breakdown-label">Investment</div>
            <div class="breakdown-value">$${investment.toFixed(2)}</div>
        </div>
        <div class="breakdown-item">
            <div class="breakdown-label">Revenue</div>
            <div class="breakdown-value">$${revenue.toFixed(2)}</div>
        </div>
        <div class="breakdown-item total">
            <div class="breakdown-label">Net Profit</div>
            <div class="breakdown-value">$${profit.toFixed(2)}</div>
        </div>
    `;
}

calculateBtn.addEventListener('click', calculateROI);

