const contentTitle = document.getElementById('contentTitle');
const platform = document.getElementById('platform');
const contentType = document.getElementById('contentType');
const scheduleBtn = document.getElementById('scheduleBtn');
const scheduleOutput = document.getElementById('scheduleOutput');
const calendar = document.getElementById('calendar');

const optimalTimes = {
    instagram: { best: '9:00 AM - 11:00 AM', good: '1:00 PM - 3:00 PM', decent: '5:00 PM - 7:00 PM' },
    twitter: { best: '8:00 AM - 10:00 AM', good: '12:00 PM - 2:00 PM', decent: '5:00 PM - 7:00 PM' },
    youtube: { best: '2:00 PM - 4:00 PM', good: '6:00 PM - 9:00 PM', decent: '10:00 AM - 12:00 PM' },
    tiktok: { best: '6:00 PM - 10:00 PM', good: '12:00 PM - 2:00 PM', decent: '9:00 AM - 11:00 AM' }
};

function getOptimalTime() {
    const title = contentTitle.value.trim();
    if (!title) {
        alert('Please enter a content title');
        return;
    }
    
    const plat = platform.value;
    const times = optimalTimes[plat];
    
    scheduleOutput.innerHTML = `
        <div class="time-recommendation">
            <div class="time-slot best">
                <div class="time-label">Best Time</div>
                <div class="time-value">${times.best}</div>
            </div>
            <div class="time-slot good">
                <div class="time-label">Good Time</div>
                <div class="time-value">${times.good}</div>
            </div>
            <div class="time-slot decent">
                <div class="time-label">Decent Time</div>
                <div class="time-value">${times.decent}</div>
            </div>
        </div>
    `;
    
    generateCalendar();
}

function generateCalendar() {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date);
    }
    
    calendar.innerHTML = days.map(day => {
        const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = day.getDate();
        const isToday = day.toDateString() === today.toDateString();
        return `
            <div class="calendar-day ${isToday ? 'today' : ''}">
                <div class="day-name">${dayName}</div>
                <div class="day-number">${dayNum}</div>
                <div class="day-content"></div>
            </div>
        `;
    }).join('');
}

scheduleBtn.addEventListener('click', getOptimalTime);
generateCalendar();

