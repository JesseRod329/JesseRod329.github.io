// Micro-Habit Tracker
// Track daily habits with streaks and statistics

const habitInput = document.getElementById('habitInput');
const habitIcon = document.getElementById('habitIcon');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitsContainer = document.getElementById('habitsContainer');
const dateDisplay = document.getElementById('dateDisplay');
const totalStreak = document.getElementById('totalStreak');
const completedToday = document.getElementById('completedToday');
const totalHabits = document.getElementById('totalHabits');
const completionRate = document.getElementById('completionRate');
const activityChart = document.getElementById('activityChart');

let habits = [];
let completions = {};

// Load data from localStorage
function loadData() {
    const savedHabits = localStorage.getItem('microHabits');
    const savedCompletions = localStorage.getItem('microCompletions');

    if (savedHabits) habits = JSON.parse(savedHabits);
    if (savedCompletions) completions = JSON.parse(savedCompletions);
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('microHabits', JSON.stringify(habits));
    localStorage.setItem('microCompletions', JSON.stringify(completions));
}

// Get today's date key
function getTodayKey() {
    return new Date().toISOString().split('T')[0];
}

// Display current date
function displayDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
}

// Add new habit
function addHabit() {
    const name = habitInput.value.trim();
    if (!name) return;

    const habit = {
        id: Date.now(),
        name,
        icon: habitIcon.value,
        createdAt: new Date().toISOString()
    };

    habits.push(habit);
    habitInput.value = '';

    saveData();
    renderHabits();
    updateStats();
}

// Delete habit
function deleteHabit(id) {
    habits = habits.filter(h => h.id !== id);

    // Clean up completions
    Object.keys(completions).forEach(date => {
        completions[date] = completions[date].filter(hId => hId !== id);
    });

    saveData();
    renderHabits();
    updateStats();
}

// Toggle habit completion
function toggleHabit(id) {
    const today = getTodayKey();

    if (!completions[today]) {
        completions[today] = [];
    }

    const index = completions[today].indexOf(id);

    if (index > -1) {
        completions[today].splice(index, 1);
    } else {
        completions[today].push(id);
    }

    saveData();
    renderHabits();
    updateStats();
}

// Calculate streak for a habit
function calculateStreak(habitId) {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        if (completions[dateKey] && completions[dateKey].includes(habitId)) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

// Render habits
function renderHabits() {
    const today = getTodayKey();

    habitsContainer.innerHTML = habits.map(habit => {
        const isCompleted = completions[today] && completions[today].includes(habit.id);
        const streak = calculateStreak(habit.id);

        return `
      <div class="habit-card ${isCompleted ? 'completed' : ''}">
        <div class="habit-icon">${habit.icon}</div>
        <div class="habit-info">
          <div class="habit-name">${habit.name}</div>
          <div class="habit-streak ${streak > 0 ? 'active' : ''}">
            ${streak > 0 ? `🔥 ${streak} day streak` : 'No streak yet'}
          </div>
        </div>
        <button class="check-btn ${isCompleted ? 'checked' : ''}" onclick="toggleHabit(${habit.id})">
          ${isCompleted ? '✓' : ''}
        </button>
        <button class="delete-btn" onclick="deleteHabit(${habit.id})">×</button>
      </div>
    `;
    }).join('');
}

// Update statistics
function updateStats() {
    const today = getTodayKey();
    const todayCompletions = completions[today] || [];

    // Total streaks
    const streaks = habits.map(h => calculateStreak(h.id));
    const totalStreakValue = streaks.reduce((a, b) => a + b, 0);
    totalStreak.textContent = totalStreakValue;

    // Completed today
    completedToday.textContent = todayCompletions.length;

    // Total habits
    totalHabits.textContent = habits.length;

    // Completion rate
    const rate = habits.length > 0 ? Math.round((todayCompletions.length / habits.length) * 100) : 0;
    completionRate.textContent = `${rate}%`;

    // Update chart
    updateChart();
}

// Update activity chart
function updateChart() {
    const ctx = activityChart.getContext('2d');
    const width = activityChart.width = activityChart.offsetWidth * 2;
    const height = activityChart.height = 400;
    ctx.scale(2, 2);

    // Get last 7 days data
    const days = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        days.push(dayName);
        data.push(completions[dateKey] ? completions[dateKey].length : 0);
    }

    // Clear canvas
    ctx.clearRect(0, 0, width / 2, height / 2);

    // Draw bars
    const barWidth = (width / 2) / days.length - 20;
    const maxValue = Math.max(...data, 1);

    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * 120;
        const x = index * ((width / 2) / days.length) + 10;
        const y = 150 - barHeight;

        // Bar
        const gradient = ctx.createLinearGradient(0, y, 0, 150);
        gradient.addColorStop(0, '#14b8a6');
        gradient.addColorStop(1, '#6366f1');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);

        // Value
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Space Mono';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + barWidth / 2, y - 8);

        // Day label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Inter';
        ctx.fillText(days[index], x + barWidth / 2, 170);
    });
}

// Event listeners
addHabitBtn.addEventListener('click', addHabit);
habitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
});

// Initialize
loadData();
displayDate();
renderHabits();
updateStats();
