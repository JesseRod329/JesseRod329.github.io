/**
 * Circular Daily Planner - Main Application Logic
 * Handles time wheel rendering, task management, and real-time updates
 */

class CircularPlanner {
  constructor() {
    this.tasks = this.loadTasks();
    this.currentTime = new Date();
    this.timeWheel = null;
    this.taskList = null;
    this.currentTimeElement = null;
    this.currentDateElement = null;
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.timeWheel = document.getElementById('time-wheel');
    this.taskList = document.getElementById('task-list');
    this.currentTimeElement = document.getElementById('current-time');
    this.currentDateElement = document.getElementById('current-date');

    if (!this.timeWheel || !this.taskList) {
      console.error('Required elements not found');
      return;
    }

    this.renderTimeWheel();
    this.renderTasks();
    this.updateCurrentTime();
    this.startTimeUpdates();
  }

  renderTimeWheel() {
    this.timeWheel.innerHTML = '';
    
    // Create 24 hour markers
    for (let hour = 0; hour < 24; hour++) {
      const angle = (hour * 15) - 90; // 15 degrees per hour, start at top (-90)
      const isMajor = hour % 6 === 0; // Major markers every 6 hours
      
      // Create hour marker
      const marker = document.createElement('div');
      marker.className = `hour-marker ${isMajor ? 'major' : ''}`;
      marker.style.transform = `rotate(${angle}deg)`;
      
      // Create hour label
      const label = document.createElement('div');
      label.className = 'hour-label';
      label.textContent = this.formatHour(hour);
      
      // Position label
      const radius = 45; // Percentage from center
      const labelAngle = (angle * Math.PI) / 180;
      const x = 50 + radius * Math.cos(labelAngle);
      const y = 50 + radius * Math.sin(labelAngle);
      
      label.style.left = `${x}%`;
      label.style.top = `${y}%`;
      
      this.timeWheel.appendChild(marker);
      this.timeWheel.appendChild(label);
    }

    // Create time segments for tasks
    this.renderTimeSegments();
  }

  renderTimeSegments() {
    const currentHour = this.currentTime.getHours();
    const currentMinute = this.currentTime.getMinutes();
    const currentAngle = (currentHour + currentMinute / 60) * 15 - 90;

    // Clear existing segments
    const existingSegments = this.timeWheel.querySelectorAll('.time-segment');
    existingSegments.forEach(segment => segment.remove());

    // Create segments for each task
    this.tasks.forEach(task => {
      if (task.time) {
        const [hours, minutes] = task.time.split(':').map(Number);
        const taskAngle = (hours + minutes / 60) * 15 - 90;
        const isPast = hours < currentHour || (hours === currentHour && minutes < currentMinute);
        const isCurrent = hours === currentHour && Math.abs(minutes - currentMinute) <= 30;

        const segment = document.createElement('div');
        segment.className = `time-segment ${isPast ? 'past' : isCurrent ? 'current' : 'future'}`;
        
        // Position segment
        const radius = 35; // Percentage from center
        const segmentAngle = (taskAngle * Math.PI) / 180;
        const x = 50 + radius * Math.cos(segmentAngle);
        const y = 50 + radius * Math.sin(segmentAngle);
        
        segment.style.left = `${x - 2}%`;
        segment.style.top = `${y - 2}%`;
        segment.style.width = '4%';
        segment.style.height = '4%';
        segment.title = `${task.time} - ${task.text}`;
        
        this.timeWheel.appendChild(segment);
      }
    });
  }

  formatHour(hour) {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  }

  renderTasks() {
    this.taskList.innerHTML = '';
    
    if (this.tasks.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.innerHTML = `
        <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
          No tasks yet. Add your first task above!
        </p>
      `;
      this.taskList.appendChild(emptyState);
      return;
    }

    // Sort tasks by time
    const sortedTasks = [...this.tasks].sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });

    sortedTasks.forEach((task, index) => {
      const taskElement = this.createTaskElement(task, index);
      this.taskList.appendChild(taskElement);
    });
  }

  createTaskElement(task, index) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
    taskDiv.dataset.index = index;

    taskDiv.innerHTML = `
      <div class="task-time">${task.time || '--:--'}</div>
      <div class="task-text">${this.escapeHtml(task.text)}</div>
      <div class="task-actions">
        <button class="task-btn complete" onclick="planner.toggleTask(${index})">
          ${task.completed ? '↩️' : '✓'}
        </button>
        <button class="task-btn delete" onclick="planner.deleteTask(${index})">
          🗑️
        </button>
      </div>
    `;

    return taskDiv;
  }

  addTask(text, time) {
    if (!text.trim()) return;

    const task = {
      id: Date.now(),
      text: text.trim(),
      time: time || null,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.tasks.push(task);
    this.saveTasks();
    this.renderTasks();
    this.renderTimeSegments();
  }

  toggleTask(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks[index].completed = !this.tasks[index].completed;
      this.saveTasks();
      this.renderTasks();
    }
  }

  deleteTask(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks.splice(index, 1);
      this.saveTasks();
      this.renderTasks();
      this.renderTimeSegments();
    }
  }

  updateCurrentTime() {
    this.currentTime = new Date();
    
    if (this.currentTimeElement) {
      const timeString = this.currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      this.currentTimeElement.textContent = timeString;
    }

    if (this.currentDateElement) {
      const dateString = this.currentTime.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      this.currentDateElement.textContent = dateString;
    }

    // Update time segments
    this.renderTimeSegments();
  }

  startTimeUpdates() {
    // Update every minute
    setInterval(() => {
      this.updateCurrentTime();
    }, 60000);
  }

  loadTasks() {
    try {
      const saved = localStorage.getItem('circular-planner-tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  saveTasks() {
    try {
      localStorage.setItem('circular-planner-tasks', JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Export functionality
  exportTasks() {
    const exportData = {
      tasks: this.tasks,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planner-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Initialize planner when script loads
let planner;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    planner = new CircularPlanner();
  });
} else {
  planner = new CircularPlanner();
}
