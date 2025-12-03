const platformSelect = document.getElementById('platform');
const timezoneSelect = document.getElementById('timezone');
const analyzeBtn = document.getElementById('analyzeBtn');
const timesDiv = document.getElementById('times');

const bestTimes = {
    instagram: ['9:00 AM', '1:00 PM', '5:00 PM', '7:00 PM'],
    twitter: ['8:00 AM', '12:00 PM', '5:00 PM', '9:00 PM'],
    facebook: ['9:00 AM', '1:00 PM', '3:00 PM', '7:00 PM'],
    linkedin: ['8:00 AM', '12:00 PM', '5:00 PM']
};

function analyzeTimes() {
    const platform = platformSelect.value;
    const timezone = timezoneSelect.value;
    const times = bestTimes[platform];
    
    timesDiv.innerHTML = times.map((time, i) => {
        const rank = i === 0 ? 'Best' : i === 1 ? 'Good' : 'Decent';
        const color = i === 0 ? 'high' : i === 1 ? 'medium' : 'low';
        return `
            <div class="time-card ${color}">
                <div class="time-rank">${rank}</div>
                <div class="time-value">${time} ${timezone}</div>
                <div class="time-desc">${i === 0 ? 'Peak engagement' : i === 1 ? 'High engagement' : 'Moderate engagement'}</div>
            </div>
        `;
    }).join('');
}

analyzeBtn.addEventListener('click', analyzeTimes);
analyzeTimes(); // Show on load

