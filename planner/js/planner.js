/**
 * Circular Daily Planner Generator
 * Creates beautiful, theme-aware circular planner from form data
 * CSP Compliant - No unsafe-inline, progressive enhancement
 */

class CircularPlannerGenerator {
  constructor() {
    this.formHandler = null;
    this.plannerContainer = null;
    this.previewSection = null;
    this.currentPlannerData = null;
    this.isGenerating = false;
    
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
    this.plannerContainer = document.getElementById('planner-preview');
    this.previewSection = document.getElementById('planner-preview');
    
    if (!this.plannerContainer) {
      console.warn('Planner container not found');
      return;
    }

    this.setupEventListeners();
    this.initializePlanner();
  }

  setupEventListeners() {
    // Listen for form data changes from form handler
    document.addEventListener('plannerFormDataChanged', (event) => {
      this.updatePreview(event.detail);
    });

    // Listen for generate button clicks
    const generateBtn = document.getElementById('generate-planner-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generatePlanner());
    }

    // Listen for export button clicks
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportPlanner());
    }
  }

  initializePlanner() {
    // Show initial empty state
    this.showEmptyState();
  }

  showEmptyState() {
    this.plannerContainer.innerHTML = `
      <div class="planner-empty-state">
        <div class="empty-state-icon">📅</div>
        <h3>Ready to Plan Your Day</h3>
        <p>Fill out the form above to generate your personalized circular daily planner.</p>
        <div class="empty-state-features">
          <div class="feature-item">
            <span class="feature-icon">🎨</span>
            <span>Theme-aware design</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">⏰</span>
            <span>Time-based organization</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📱</span>
            <span>Mobile responsive</span>
          </div>
        </div>
      </div>
    `;
  }

  updatePreview(formData) {
    const tasks = (formData?.tasks || []).filter(t => t && t.time && t.description);
    if (tasks.length < 1) {
      this.showEmptyState();
      return;
    }
    // Persist latest data from the form-handler so we don't try to
    // re-read tasks from the DOM (which doesn't contain inputs).
    this.currentPlannerData = { ...formData, tasks };
    // Create a simple preview (one task is sufficient)
    this.createPreview(this.currentPlannerData);
  }

  createPreview(formData) {
    const tasks = formData.tasks.filter(task => task.time && task.description);
    
    if (tasks.length === 0) {
      this.showEmptyState();
      return;
    }

    this.plannerContainer.innerHTML = `
      <div class="planner-preview">
        <div class="preview-header">
          <h3>Preview</h3>
          <p>${tasks.length} task${tasks.length !== 1 ? 's' : ''} ready</p>
        </div>
        <div class="preview-tasks">
          ${tasks.slice(0, 3).map(task => `
            <div class="preview-task">
              <span class="preview-time">${task.time}</span>
              <span class="preview-description">${this.escapeHtml(task.description)}</span>
              <span class="preview-priority priority-${task.priority}">${task.priority}</span>
            </div>
          `).join('')}
          ${tasks.length > 3 ? `<div class="preview-more">+${tasks.length - 3} more tasks</div>` : ''}
        </div>
        <div class="preview-actions">
          <button class="btn btn-primary" id="generate-planner-btn">
            Generate Full Planner
          </button>
        </div>
      </div>
    `;

    // Re-attach event listener
    const generateBtn = document.getElementById('generate-planner-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generatePlanner());
    }
  }

  async generatePlanner() {
    if (this.isGenerating) return;
    
    this.isGenerating = true;
    this.setFormState('generating');

    try {
      // Use the latest data provided by form-handler (source of truth)
      const formData = this.currentPlannerData || { tasks: [] };
      
      const validTasks = (formData.tasks || []).filter(t => t && t.time && t.description);
      if (validTasks.length < 1) {
        this.showNotification('Please add at least one task to generate your planner', 'error');
        return;
      }

      // Generate aesthetic view on all screen sizes
      await this.renderAestheticPlanner({ ...formData, tasks: validTasks });
      
      this.currentPlannerData = formData;
      this.showNotification('Planner generated successfully!', 'success');
      
    } catch (error) {
      console.error('Error generating planner:', error);
      this.showNotification('Error generating planner. Please try again.', 'error');
    } finally {
      this.isGenerating = false;
      this.setFormState('complete');
    }
  }

  // Aesthetic glossy circle layout (mobile-first)
  async renderAestheticPlanner(formData) {
    const tasks = (formData.tasks || []).filter(t => t.time && t.description);
    const container = this.plannerContainer;
    if (!container) return;

    const getTimeBand = (time) => {
      const [h, m] = (time || '0:00').split(':').map(Number);
      if (h >= 5 && h < 12) return 'morning';
      if (h >= 12 && h < 17) return 'afternoon';
      return 'evening';
    };

    const getPriorityClass = (p) => {
      const s = (p || 'medium').toLowerCase();
      if (s === 'high' || s === 'urgent') return 'priority-high';
      if (s === 'low') return 'priority-low';
      return 'priority-medium';
    };

    const yearStr = (formData.personalInfo?.date ? new Date(formData.personalInfo.date).getFullYear() : new Date().getFullYear());

    const taskCircle = (task, index) => {
      const band = getTimeBand(task.time);
      const priorityClass = getPriorityClass(task.priority);
      const priorityText = (task.priority || 'medium').toUpperCase();
      const bandLabel = band.charAt(0).toUpperCase() + band.slice(1);
      const timeLabel = `${bandLabel} • ${task.time}`;
      return `
        <div class="task-circle ${band}" data-task-index="${index}">
          <div class="priority-badge ${priorityClass}">${priorityText}</div>
          <div class="completion-checkbox" aria-label="Toggle completion"></div>
          <svg class="progress-ring" viewBox="0 0 320 320" aria-hidden="true">
            <circle class="progress-ring-circle" cx="160" cy="160" r="155"></circle>
          </svg>
          <div class="time-label">${this.escapeHtml(timeLabel)}</div>
          <h3 class="task-title">${this.escapeHtml(task.description)}</h3>
          ${task.notes ? `<p class="task-description">${this.escapeHtml(task.notes)}</p>` : ''}
        </div>
      `;
    };

    const row1 = [];
    if (tasks[0]) row1.push(taskCircle(tasks[0], 0));
    row1.push(`
      <div class="center-hub">
        <div class="hub-title">Today</div>
        <div class="hub-date">${yearStr}</div>
      </div>
    `);
    if (tasks[1]) row1.push(taskCircle(tasks[1], 1));

    const row2 = tasks.slice(2).map((t, i) => taskCircle(t, i + 2)).join('');

    container.innerHTML = `
      <div class="planner-aesthetic">
        <div class="background-elements">
          <div class="floating-circle fc1"></div>
          <div class="floating-circle fc2"></div>
          <div class="floating-circle fc3"></div>
        </div>
        <div class="container">
          <header class="header">
            <h1 class="date">${this.escapeHtml(this.formatDate(formData.personalInfo?.date))}</h1>
            <p class="subtitle">Your Daily Journey Awaits</p>
          </header>
          <div class="planner-actions" style="display:flex;justify-content:center;gap:12px;margin-bottom:16px;">
            <button class="btn btn-secondary" id="edit-planner-btn" aria-label="Edit planner" style="padding:10px 16px;border-radius:12px;border:1px solid var(--border-light);background:var(--surface-card);color:var(--text-primary);">✏️ Edit</button>
            <button class="btn btn-primary" id="export-planner-btn" aria-label="Export planner" style="padding:10px 16px;border-radius:12px;background: var(--interactive-primary); color:#fff;">📤 Export</button>
          </div>
          <div class="planner-grid">${row1.join('')}</div>
          ${row2 ? `<div class="planner-grid" style="margin-top:0;">${row2}</div>` : ''}
          ${(formData.notes?.notes || formData.notes?.reminders) ? `
            <div class="notes-section">
              <h3 class="notes-title">Daily Reminders</h3>
              ${formData.notes?.notes ? `<div class=\"note-item\">${this.escapeHtml(formData.notes.notes)}</div>` : ''}
              ${formData.notes?.reminders ? `<div class=\"note-item\">${this.escapeHtml(formData.notes.reminders)}</div>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `;

    // Toggle completion
    container.querySelectorAll('.task-circle').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('completed');
        const cb = el.querySelector('.completion-checkbox');
        if (cb) cb.classList.toggle('completed');
      });
    });

    this.currentPlannerData = formData;
    this.setupPlannerInteractions();
  }

  async renderCircularPlanner(formData) {
    const tasks = formData.tasks.filter(task => task.time && task.description);
    
    this.plannerContainer.innerHTML = `
      <div class="circular-planner">
        <div class="planner-header">
          <h2>${formData.personalInfo.name || 'Daily Planner'}</h2>
          <p class="planner-date">${this.formatDate(formData.personalInfo.date)}</p>
        </div>
        
        <div class="planner-content">
          <div class="time-wheel-container">
            <div class="time-wheel" id="time-wheel">
              <div class="wheel-center">
                <div class="center-date">${this.formatDateShort(formData.personalInfo.date)}</div>
                <div class="center-time" id="current-time">${this.getCurrentTime()}</div>
                <div class="center-name">${formData.personalInfo.name || 'You'}</div>
              </div>
            </div>
          </div>
          
          <div class="tasks-panel">
            <div class="tasks-header">
              <h3>Today's Tasks</h3>
              <div class="task-stats">
                <span class="stat-item">
                  <span class="stat-number">${tasks.length}</span>
                  <span class="stat-label">Total</span>
                </span>
                <span class="stat-item">
                  <span class="stat-number">${tasks.filter(t => t.priority === 'high').length}</span>
                  <span class="stat-label">High Priority</span>
                </span>
              </div>
            </div>
            <div class="tasks-list" id="tasks-list">
              ${this.renderTaskList(tasks)}
            </div>
          </div>
        </div>
        
        ${formData.notes.notes || formData.notes.reminders ? `
          <div class="notes-section">
            <h3>Notes & Reminders</h3>
            <div class="notes-content">
              ${formData.notes.notes ? `
                <div class="notes-item">
                  <h4>Notes</h4>
                  <p>${this.escapeHtml(formData.notes.notes)}</p>
                </div>
              ` : ''}
              ${formData.notes.reminders ? `
                <div class="notes-item">
                  <h4>Reminders</h4>
                  <p>${this.escapeHtml(formData.notes.reminders)}</p>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
        
        <div class="planner-actions">
          <button class="btn btn-secondary" id="edit-planner-btn">
            <span class="btn-icon">✏️</span>
            Edit Planner
          </button>
          <button class="btn btn-primary" id="export-planner-btn">
            <span class="btn-icon">📤</span>
            Export Planner
          </button>
        </div>
      </div>
    `;

    // Render the circular time wheel
    await this.renderTimeWheel(tasks);
    
    // Setup interactive elements
    this.setupPlannerInteractions();
    
    // Start time updates
    this.startTimeUpdates();
  }

  async renderTimeWheel(tasks) {
    const timeWheel = document.getElementById('time-wheel');
    if (!timeWheel) return;

    // Clear existing content
    timeWheel.innerHTML = '';

    // Create hour markers
    for (let hour = 0; hour < 24; hour++) {
      const angle = (hour * 15) - 90; // 15 degrees per hour, start at top (-90)
      const isMajor = hour % 6 === 0; // Major markers every 6 hours
      
      // Create hour marker
      const marker = document.createElement('div');
      marker.className = `hour-marker ${isMajor ? 'major' : 'minor'}`;
      marker.style.transform = `rotate(${angle}deg)`;
      
      // Create hour label
      const label = document.createElement('div');
      label.className = 'hour-label';
      label.textContent = this.formatHour(hour);
      
      // Position label
      const radius = 42; // Percentage from center
      const labelAngle = (angle * Math.PI) / 180;
      const x = 50 + radius * Math.cos(labelAngle);
      const y = 50 + radius * Math.sin(labelAngle);
      
      label.style.left = `${x}%`;
      label.style.top = `${y}%`;
      
      timeWheel.appendChild(marker);
      timeWheel.appendChild(label);
    }

    // Create task markers
    tasks.forEach((task, index) => {
      if (task.time) {
        const [hours, minutes] = task.time.split(':').map(Number);
        const taskAngle = (hours + minutes / 60) * 15 - 90;
        const timeOfDay = this.getTimeOfDay(hours);
        
        // Create task marker
        const taskMarker = document.createElement('div');
        taskMarker.className = `task-marker task-marker-${timeOfDay} priority-${task.priority}`;
        taskMarker.dataset.taskIndex = index;
        taskMarker.title = `${task.time} - ${task.description}`;
        
        // Position task marker
        const radius = 35; // Percentage from center
        const markerAngle = (taskAngle * Math.PI) / 180;
        const x = 50 + radius * Math.cos(markerAngle);
        const y = 50 + radius * Math.sin(markerAngle);
        
        taskMarker.style.left = `${x - 1.5}%`;
        taskMarker.style.top = `${y - 1.5}%`;
        
        timeWheel.appendChild(taskMarker);
      }
    });

    // Add current time indicator
    this.updateCurrentTimeIndicator();
  }

  renderTaskList(tasks) {
    if (tasks.length === 0) {
      return `
        <div class="no-tasks">
          <p>No tasks scheduled for today.</p>
        </div>
      `;
    }

    // Sort tasks by time
    const sortedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

    return sortedTasks.map((task, index) => `
      <div class="task-item" data-task-index="${index}">
        <div class="task-time">${task.time}</div>
        <div class="task-content">
          <div class="task-description">${this.escapeHtml(task.description)}</div>
          <div class="task-priority priority-${task.priority}">
            ${task.priority}
          </div>
        </div>
        <div class="task-actions">
          <button class="task-btn complete" data-task-index="${index}" aria-label="Mark as complete">
            <span class="btn-icon">✓</span>
          </button>
        </div>
      </div>
    `).join('');
  }

  setupPlannerInteractions() {
    // Task completion buttons
    const completeButtons = document.querySelectorAll('.task-btn.complete');
    completeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const taskIndex = parseInt(e.currentTarget.dataset.taskIndex);
        this.toggleTaskCompletion(taskIndex);
      });
    });

    // Edit planner button
    const editBtn = document.getElementById('edit-planner-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => this.editPlanner());
    }

    // Export planner button
    const exportBtn = document.getElementById('export-planner-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportPlanner());
    }
  }

  toggleTaskCompletion(taskIndex) {
    const taskItem = document.querySelector(`[data-task-index="${taskIndex}"]`);
    const completeBtn = taskItem?.querySelector('.task-btn.complete');
    
    if (!taskItem || !completeBtn) return;

    const isCompleted = taskItem.classList.contains('completed');
    
    if (isCompleted) {
      taskItem.classList.remove('completed');
      completeBtn.innerHTML = '<span class="btn-icon">✓</span>';
      completeBtn.setAttribute('aria-label', 'Mark as complete');
    } else {
      taskItem.classList.add('completed');
      completeBtn.innerHTML = '<span class="btn-icon">↩️</span>';
      completeBtn.setAttribute('aria-label', 'Mark as incomplete');
    }

    // Update task marker on wheel
    const taskMarker = document.querySelector(`.task-marker[data-task-index="${taskIndex}"]`);
    if (taskMarker) {
      taskMarker.classList.toggle('completed', !isCompleted);
    }

    // Show feedback
    this.showNotification(
      isCompleted ? 'Task marked as incomplete' : 'Task completed! 🎉',
      'success'
    );
  }

  editPlanner() {
    // Scroll to form section
    const formSection = document.querySelector('.planner-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    this.showNotification('Edit your planner in the form above', 'info');
  }

  exportPlanner() {
    if (!this.currentPlannerData) {
      this.showNotification('No planner data to export', 'error');
      return;
    }

    // Dispatch event to canvas export system
    const event = new CustomEvent('exportPlanner', {
      detail: this.currentPlannerData
    });
    document.dispatchEvent(event);
  }

  startTimeUpdates() {
    // Update current time every minute
    setInterval(() => {
      this.updateCurrentTimeIndicator();
    }, 60000);
  }

  updateCurrentTimeIndicator() {
    const currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
      currentTimeElement.textContent = this.getCurrentTime();
    }
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  getTimeOfDay(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    return 'evening';
  }

  formatHour(hour) {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  }

  formatDate(dateString) {
    if (!dateString) return new Date().toLocaleDateString();
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateShort(dateString) {
    if (!dateString) return new Date().toLocaleDateString();
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  getFormData() {
    // Get form data from form handler
    const form = document.getElementById('planner-form');
    if (!form) return { tasks: [] };

    const formData = new FormData(form);
    const data = {
      personalInfo: {
        name: formData.get('planner-name') || '',
        date: formData.get('planner-date') || new Date().toISOString().split('T')[0]
      },
      tasks: this.getTasksFromForm(),
      notes: {
        notes: formData.get('notes') || '',
        reminders: formData.get('reminders') || ''
      }
    };

    return data;
  }

  getTasksFromForm() {
    const tasks = [];
    const taskElements = document.querySelectorAll('.task-item');
    
    taskElements.forEach((taskElement, index) => {
      const timeInput = taskElement.querySelector('input[name^="task_time"]');
      const descInput = taskElement.querySelector('input[name^="task_description"]');
      const prioritySelect = taskElement.querySelector('select[name^="task_priority"]');
      
      if (timeInput && descInput && prioritySelect) {
        tasks.push({
          time: timeInput.value,
          description: descInput.value,
          priority: prioritySelect.value,
          completed: false
        });
      }
    });
    
    return tasks;
  }

  setFormState(state) {
    const form = document.getElementById('planner-form');
    if (form) {
      form.setAttribute('data-state', state);
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Remove notification after delay
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

// Initialize planner generator when script loads
let plannerGenerator;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    plannerGenerator = new CircularPlannerGenerator();
    window.plannerGenerator = plannerGenerator;
  });
} else {
  plannerGenerator = new CircularPlannerGenerator();
  window.plannerGenerator = plannerGenerator;
}