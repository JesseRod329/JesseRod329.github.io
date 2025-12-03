const taskInput = document.getElementById('task');
const prioritySelect = document.getElementById('priority');
const dueDateInput = document.getElementById('dueDate');
const addBtn = document.getElementById('addBtn');
const tasksListDiv = document.getElementById('tasksList');
const tabs = document.querySelectorAll('.tab');

let currentFilter = 'all';

function addTask() {
    const task = taskInput.value.trim();
    if (!task) {
        alert('Please enter a task');
        return;
    }
    
    let tasks = JSON.parse(localStorage.getItem('creatorTasks') || '[]');
    tasks.push({
        id: Date.now(),
        task,
        priority: prioritySelect.value,
        dueDate: dueDateInput.value,
        completed: false,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('creatorTasks', JSON.stringify(tasks));
    taskInput.value = '';
    dueDateInput.value = '';
    displayTasks();
}

function displayTasks() {
    const tasks = JSON.parse(localStorage.getItem('creatorTasks') || '[]');
    let filtered = tasks;
    
    if (currentFilter === 'pending') {
        filtered = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = tasks.filter(t => t.completed);
    }
    
    const sorted = filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    if (sorted.length === 0) {
        tasksListDiv.innerHTML = '<p class="empty">No tasks found</p>';
        return;
    }
    
    tasksListDiv.innerHTML = sorted.map(t => `
        <div class="task-item ${t.completed ? 'completed' : ''} priority-${t.priority}">
            <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask(${t.id})">
            <div class="task-content">
                <div class="task-name">${t.task}</div>
                <div class="task-meta">
                    ${t.dueDate ? `<span>Due: ${new Date(t.dueDate).toLocaleDateString()}</span>` : ''}
                    <span class="priority-badge ${t.priority}">${t.priority}</span>
                </div>
            </div>
            <button onclick="deleteTask(${t.id})" class="delete-btn">×</button>
        </div>
    `).join('');
}

function toggleTask(id) {
    let tasks = JSON.parse(localStorage.getItem('creatorTasks') || '[]');
    tasks = tasks.map(t => t.id == id ? { ...t, completed: !t.completed } : t);
    localStorage.setItem('creatorTasks', JSON.stringify(tasks));
    displayTasks();
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('creatorTasks') || '[]');
    tasks = tasks.filter(t => t.id != id);
    localStorage.setItem('creatorTasks', JSON.stringify(tasks));
    displayTasks();
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        displayTasks();
    });
});

addBtn.addEventListener('click', addTask);
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
displayTasks();

