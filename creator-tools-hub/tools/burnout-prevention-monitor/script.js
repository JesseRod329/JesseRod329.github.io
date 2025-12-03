const hoursWorkedInput = document.getElementById('hoursWorked');
const breaksTakenInput = document.getElementById('breaksTaken');
const stressLevelInput = document.getElementById('stressLevel');
const checkBtn = document.getElementById('checkBtn');
const riskAssessment = document.getElementById('riskAssessment');
const recommendations = document.getElementById('recommendations');

function checkBurnoutRisk() {
    const hours = parseFloat(hoursWorkedInput.value) || 0;
    const breaks = parseInt(breaksTakenInput.value) || 0;
    const stress = parseInt(stressLevelInput.value) || 5;
    
    let riskScore = 0;
    const recs = [];
    
    // Hours worked
    if (hours > 10) {
        riskScore += 40;
        recs.push({ type: 'warning', text: 'Working more than 10 hours increases burnout risk' });
    } else if (hours > 8) {
        riskScore += 20;
        recs.push({ type: 'info', text: 'Consider taking more breaks' });
    }
    
    // Breaks
    const recommendedBreaks = Math.floor(hours / 2);
    if (breaks < recommendedBreaks) {
        riskScore += 30;
        recs.push({ type: 'warning', text: `Take more breaks (recommended: ${recommendedBreaks} for ${hours} hours)` });
    }
    
    // Stress level
    if (stress >= 8) {
        riskScore += 30;
        recs.push({ type: 'warning', text: 'High stress level detected - consider rest' });
    } else if (stress >= 6) {
        riskScore += 15;
        recs.push({ type: 'info', text: 'Moderate stress - take a short break' });
    }
    
    const riskLevel = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';
    
    riskAssessment.innerHTML = `
        <div class="risk-card ${riskLevel}">
            <div class="risk-score">${riskScore}%</div>
            <div class="risk-label">Burnout Risk</div>
            <div class="risk-level">${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk</div>
        </div>
    `;
    
    if (recs.length === 0) {
        recommendations.innerHTML = '<div class="rec-item success">✓ Great work-life balance!</div>';
    } else {
        recommendations.innerHTML = recs.map(r => `
            <div class="rec-item ${r.type}">${r.text}</div>
        `).join('');
    }
}

checkBtn.addEventListener('click', checkBurnoutRisk);

