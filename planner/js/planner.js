/**
 * Circular Daily Planner
 * A simplified, aesthetic daily planner.
 */

class CircularPlanner {
  constructor() {
    this.taskInput = document.getElementById('task-input');
    this.timeInput = document.getElementById('task-time');
    this.addTaskBtn = document.getElementById('add-task-btn');
    this.taskList = document.getElementById('task-list');
    this.dateElement = document.querySelector('.header .date');
    this.exportBtn = document.getElementById('export-planner-btn');
    this.eraserBtn = document.getElementById('eraser-button');
    this.tasks = [];

    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.loadTasks();
    this.renderTasks();
    this.setDate();

    this.addTaskBtn.addEventListener('click', () => this.addTask());
    this.taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addTask();
      }
    });
    this.exportBtn.addEventListener('click', () => this.exportPlanner());
    this.eraserBtn.addEventListener('click', () => this.clearAllTasks());
  }

  clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks and start fresh?')) {
      this.tasks = [];
      this.saveTasks();
      this.renderTasks();
      this.eraserBtn.classList.add('erasing');
      setTimeout(() => this.eraserBtn.classList.remove('erasing'), 500);
    }
  }

  setDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.dateElement.textContent = today.toLocaleDateString('en-US', options);
  }

  addTask() {
    const taskDescription = this.taskInput.value.trim();
    const taskTime = this.timeInput.value;

    if (taskDescription === '') {
      this.showNotification('Please enter a task description.', 'error');
      return;
    }

    const task = {
      id: Date.now(),
      description: taskDescription,
      time: taskTime,
      completed: false,
    };

    this.tasks.push(task);
    this.saveTasks();
    this.renderTasks();
    this.taskInput.value = '';
    this.timeInput.value = '';
    this.showNotification('Task added successfully!', 'success');
  }

  renderTasks() {
    this.taskList.innerHTML = '';
    this.tasks.forEach((task, index) => {
      const taskElement = this.createTaskElement(task, index);
      this.taskList.appendChild(taskElement);
    });
  }

  createTaskElement(task, index) {
    const taskCircle = document.createElement('div');
    taskCircle.className = `task-circle ${this.getTimeBand(task.time)}`;
    if (task.completed) {
      taskCircle.classList.add('completed');
    }
    taskCircle.dataset.taskId = task.id;

    const timeLabel = document.createElement('div');
    timeLabel.className = 'time-label';
    timeLabel.textContent = `${this.getTimeBand(task.time).toUpperCase()} • ${task.time}`;

    const taskTitle = document.createElement('h3');
    taskTitle.className = 'task-title';
    taskTitle.textContent = this.escapeHtml(task.description);

    taskCircle.appendChild(timeLabel);
    taskCircle.appendChild(taskTitle);

    taskCircle.addEventListener('click', () => this.toggleTaskCompletion(task.id));

    return taskCircle;
  }

  toggleTaskCompletion(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
    }
  }

  getTimeBand(time) {
    if (!time) return 'evening';
    const [h] = time.split(':').map(Number);
    if (h >= 5 && h < 12) return 'morning';
    if (h >= 12 && h < 17) return 'afternoon';
    return 'evening';
  }

  saveTasks() {
    localStorage.setItem('plannerTasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const tasks = localStorage.getItem('plannerTasks');
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
  }

  exportPlanner() {
    const event = new CustomEvent('exportPlanner', {
        detail: { tasks: this.tasks, personalInfo: { date: new Date() } }
    });
    document.dispatchEvent(event);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

new CircularPlanner();