const taskNameInput = document.getElementById('taskName');
const categorySelect = document.getElementById('category');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const timerDisplay = document.getElementById('timerDisplay');
const timeLogDiv = document.getElementById('timeLog');

let startTime = null;
let timerInterval = null;

function startTimer() {
    const taskName = taskNameInput.value.trim();
    if (!taskName) {
        alert('Please enter a task name');
        return;
    }
    
    startTime = Date.now();
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        timerDisplay.textContent = 
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
    }, 1000);
}

function stopTimer() {
    if (!startTime) return;
    
    clearInterval(timerInterval);
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / 3600000);
    const minutes = Math.floor((elapsed % 3600000) / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const duration = hours * 3600 + minutes * 60 + seconds;
    
    const taskName = taskNameInput.value.trim();
    const category = categorySelect.value;
    
    let timeLog = JSON.parse(localStorage.getItem('timeLog') || '[]');
    timeLog.push({
        id: Date.now(),
        taskName,
        category,
        duration,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('timeLog', JSON.stringify(timeLog));
    
    startTime = null;
    timerDisplay.textContent = '00:00:00';
    startBtn.style.display = 'block';
    stopBtn.style.display = 'none';
    taskNameInput.value = '';
    
    displayTimeLog();
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function displayTimeLog() {
    const timeLog = JSON.parse(localStorage.getItem('timeLog') || '[]');
    const sorted = timeLog.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sorted.length === 0) {
        timeLogDiv.innerHTML = '<p class="empty">No time logged yet</p>';
        return;
    }
    
    timeLogDiv.innerHTML = sorted.map(entry => `
        <div class="log-item">
            <div class="log-info">
                <div class="log-task">${entry.taskName}</div>
                <div class="log-meta">
                    <span class="category-badge ${entry.category}">${entry.category}</span>
                    <span>•</span>
                    <span>${new Date(entry.date).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="log-duration">${formatDuration(entry.duration)}</div>
            <button onclick="deleteLog(${entry.id})" class="delete-btn">×</button>
        </div>
    `).join('');
}

function deleteLog(id) {
    let timeLog = JSON.parse(localStorage.getItem('timeLog') || '[]');
    timeLog = timeLog.filter(l => l.id != id);
    localStorage.setItem('timeLog', JSON.stringify(timeLog));
    displayTimeLog();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
window.deleteLog = deleteLog;
displayTimeLog();

