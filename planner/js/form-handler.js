/**
 * Dynamic Form Handler for Circular Daily Planner
 * CSP Compliant - No unsafe-inline, progressive enhancement
 * Memory-only storage, graceful degradation when JS disabled
 */

class PlannerFormHandler {
  constructor() {
    this.form = null;
    this.taskContainer = null;
    this.taskCounter = 0;
    this.formData = {
      personalInfo: {},
      tasks: [],
      notes: {},
      state: 'idle'
    };
    
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
    this.form = document.getElementById('planner-form');
    this.taskContainer = document.getElementById('task-list-container');
    
    if (!this.form || !this.taskContainer) {
      console.warn('Planner form elements not found');
      return;
    }

    this.setupEventListeners();
    this.setupFormValidation();
    this.initializeForm();
    this.setDefaultDate();
  }

  setupEventListeners() {
    const addTaskBtn = document.getElementById('add-task-btn');
    if (addTaskBtn) {
      addTaskBtn.addEventListener('click', () => this.addTask());
      addTaskBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.addTask();
        }
      });
    }

    this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

    const clearBtn = document.getElementById('clear-form-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearForm());
      clearBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.clearForm();
        }
      });
    }

    this.form.addEventListener('input', (e) => this.handleFormInput(e));
    this.form.addEventListener('change', (e) => this.handleFormChange(e));
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

    // Add ARIA live region for screen reader announcements
    this.createLiveRegion();
  }

  setupFormValidation() {
    this.validationMessages = {
      valueMissing: 'This field is required',
      tooShort: 'Please enter at least {minLength} characters',
      tooLong: 'Please enter no more than {maxLength} characters',
      typeMismatch: 'Please enter a valid value',
      patternMismatch: 'Please match the requested format'
    };
  }

  initializeForm() {
    if (this.taskContainer.children.length === 0) {
      this.showEmptyState();
    }
    this.updateFormState('idle');
  }

  setDefaultDate() {
    const dateInput = document.getElementById('planner-date');
    if (dateInput && !dateInput.value) {
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }
  }

  addTask() {
    const taskData = this.getCurrentTaskInputs();
    
    if (!this.validateTaskInputs(taskData)) {
      return;
    }

    const taskId = `task-${++this.taskCounter}`;
    const taskElement = this.createTaskElement(taskId, taskData);
    
    this.taskContainer.appendChild(taskElement);
    this.animateTaskIn(taskElement);
    this.clearTaskInputs();
    
    this.formData.tasks.push({
      id: taskId,
      time: taskData.time,
      description: taskData.description,
      priority: taskData.priority
    });

    this.updatePreview();
    this.showNotification('Task added successfully!', 'success');
  }

  getCurrentTaskInputs() {
    return {
      time: document.getElementById('task-time').value,
      description: document.getElementById('task-description').value,
      priority: document.getElementById('task-priority').value
    };
  }

  validateTaskInputs(taskData) {
    let isValid = true;

    if (!taskData.time) {
      this.showFieldError('task-time', 'Please select a time');
      isValid = false;
    } else {
      this.clearFieldError('task-time');
    }

    if (!taskData.description || taskData.description.length < 3) {
      this.showFieldError('task-description', 'Please enter a task description (at least 3 characters)');
      isValid = false;
    } else {
      this.clearFieldError('task-description');
    }

    if (!taskData.priority) {
      this.showFieldError('task-priority', 'Please select a priority level');
      isValid = false;
    } else {
      this.clearFieldError('task-priority');
    }

    if (!isValid) {
      this.showNotification('Please fix the errors above', 'error');
    }

    return isValid;
  }

  createTaskElement(taskId, taskData) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.dataset.taskId = taskId;
    
    const priorityClass = `priority-${taskData.priority}`;
    const priorityIcon = this.getPriorityIcon(taskData.priority);
    
    taskDiv.innerHTML = `
      <div class="task-time">${taskData.time}</div>
      <div class="task-content">
        <div class="task-description">${this.escapeHtml(taskData.description)}</div>
        <div class="task-priority ${priorityClass}">
          <span class="priority-icon">${priorityIcon}</span>
          <span class="priority-text">${taskData.priority}</span>
        </div>
      </div>
      <div class="task-actions">
        <button type="button" class="btn btn-sm btn-edit" onclick="plannerFormHandler.editTask('${taskId}')" aria-label="Edit task">
          <span class="btn-icon">✏️</span>
        </button>
        <button type="button" class="btn btn-sm btn-delete" onclick="plannerFormHandler.removeTask('${taskId}')" aria-label="Remove task">
          <span class="btn-icon">🗑️</span>
        </button>
      </div>
    `;

    return taskDiv;
  }

  getPriorityIcon(priority) {
    const icons = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      urgent: '🔴'
    };
    return icons[priority] || '⚪';
  }

  animateTaskIn(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px)';
    
    requestAnimationFrame(() => {
      element.style.transition = 'all 0.3s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  animateTaskOut(element, callback) {
    element.style.transition = 'all 0.3s ease';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
      if (callback) callback();
    }, 300);
  }

  removeTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskElement) return;

    this.animateTaskOut(taskElement, () => {
      taskElement.remove();
      this.formData.tasks = this.formData.tasks.filter(task => task.id !== taskId);
      
      if (this.formData.tasks.length === 0) {
        this.showEmptyState();
      }
      
      this.updatePreview();
      this.showNotification('Task removed', 'info');
    });
  }

  editTask(taskId) {
    const task = this.formData.tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('task-time').value = task.time;
    document.getElementById('task-description').value = task.description;
    document.getElementById('task-priority').value = task.priority;

    this.removeTask(taskId);
    document.getElementById('task-description').focus();
    this.showNotification('Task loaded for editing', 'info');
  }

  clearTaskInputs() {
    document.getElementById('task-time').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-priority').value = '';
  }

  showEmptyState() {
    this.taskContainer.innerHTML = `
      <div class="task-list-empty">
        <div class="empty-state">
          <div class="empty-state-icon">📝</div>
          <h3 class="empty-state-title">No tasks yet</h3>
          <p class="empty-state-description">Add your first task above to get started</p>
        </div>
      </div>
    `;
  }

  handleFormInput(e) {
    const input = e.target;
    this.validateField(input);
    
    if (input.id === 'planner-name' || input.id === 'planner-date') {
      this.updatePreview();
    }
  }

  handleFormChange(e) {
    const input = e.target;
    this.updateFormData(input);
    this.updatePreview();
  }

  validateField(input) {
    const isValid = input.checkValidity();
    
    if (isValid) {
      this.clearFieldError(input.id);
    } else {
      const errorMessage = this.getValidationMessage(input);
      this.showFieldError(input.id, errorMessage);
    }
    
    return isValid;
  }

  getValidationMessage(input) {
    const validity = input.validity;
    
    if (validity.valueMissing) {
      return this.validationMessages.valueMissing;
    }
    
    if (validity.tooShort) {
      return this.validationMessages.tooShort.replace('{minLength}', input.minLength);
    }
    
    if (validity.tooLong) {
      return this.validationMessages.tooLong.replace('{maxLength}', input.maxLength);
    }
    
    if (validity.typeMismatch) {
      return this.validationMessages.typeMismatch;
    }
    
    return 'Please enter a valid value';
  }

  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    this.clearFieldError(fieldId);
    field.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.id = `${fieldId}-error`;
    errorDiv.innerHTML = `⚠️ ${message}`;

    field.parentNode.insertBefore(errorDiv, field.nextSibling);
  }

  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.remove('error');
    const errorDiv = document.getElementById(`${fieldId}-error`);
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  updateFormData(input) {
    const fieldName = input.name || input.id;
    
    if (fieldName === 'planner-name') {
      this.formData.personalInfo.name = input.value;
    } else if (fieldName === 'planner-date') {
      this.formData.personalInfo.date = input.value;
    } else if (fieldName === 'notes') {
      this.formData.notes.notes = input.value;
    } else if (fieldName === 'reminders') {
      this.formData.notes.reminders = input.value;
    }
  }

  updatePreview() {
    // Dispatch event to planner generator
    const event = new CustomEvent('plannerFormDataChanged', {
      detail: this.getFormData()
    });
    document.dispatchEvent(event);
  }

  getFormData() {
    return {
      personalInfo: this.formData.personalInfo,
      tasks: this.formData.tasks,
      notes: this.formData.notes,
      state: this.formData.state
    };
  }

  generateTaskPreview() {
    if (this.formData.tasks.length === 0) {
      return '<p class="preview-no-tasks">No tasks added yet</p>';
    }

    const sortedTasks = [...this.formData.tasks].sort((a, b) => a.time.localeCompare(b.time));
    
    return sortedTasks.map(task => `
      <div class="preview-task">
        <span class="preview-task-time">${task.time}</span>
        <span class="preview-task-description">${this.escapeHtml(task.description)}</span>
        <span class="preview-task-priority priority-${task.priority}">${this.getPriorityIcon(task.priority)}</span>
      </div>
    `).join('');
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      this.showNotification('Please fix the errors before submitting', 'error');
      return;
    }

    this.updateFormState('generating');
    this.showProgress();
    
    setTimeout(() => {
      this.generatePlanner();
    }, 2000);
  }

  validateForm() {
    let isValid = true;
    const requiredFields = this.form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (this.formData.tasks.length === 0) {
      this.showNotification('Please add at least one task', 'error');
      isValid = false;
    }

    return isValid;
  }

  showProgress() {
    const progressDiv = document.getElementById('form-progress');
    if (progressDiv) {
      progressDiv.style.display = 'block';
    }
  }

  hideProgress() {
    const progressDiv = document.getElementById('form-progress');
    if (progressDiv) {
      progressDiv.style.display = 'none';
    }
  }

  generatePlanner() {
    this.updateFormState('complete');
    this.hideProgress();
    
    const previewSection = document.getElementById('planner-preview');
    if (previewSection) {
      previewSection.style.display = 'block';
      previewSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    this.showNotification('Your planner has been generated!', 'success');
  }

  clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
      this.form.reset();
      this.taskContainer.innerHTML = '';
      this.showEmptyState();
      
      this.formData = {
        personalInfo: {},
        tasks: [],
        notes: {},
        state: 'idle'
      };
      
      this.taskCounter = 0;
      this.clearAllFieldErrors();
      
      const previewSection = document.getElementById('planner-preview');
      if (previewSection) {
        previewSection.style.display = 'none';
      }
      
      this.setDefaultDate();
      this.updateFormState('idle');
      this.showNotification('Form cleared', 'info');
    }
  }

  clearAllFieldErrors() {
    const errorElements = this.form.querySelectorAll('.form-error');
    errorElements.forEach(error => error.remove());
    
    const errorFields = this.form.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
  }

  updateFormState(state) {
    this.formData.state = state;
    this.form.dataset.state = state;
  }

  handleKeyboardShortcuts(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      this.form.dispatchEvent(new Event('submit'));
    }
    
    if (e.key === 'Escape') {
      this.clearForm();
    }
  }

  showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: '1000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      maxWidth: '300px',
      wordWrap: 'break-word'
    });

    const colors = {
      error: '#ef4444',
      success: '#10b981',
      info: '#3b82f6',
      warning: '#f59e0b'
    };
    notification.style.background = colors[type] || colors.info;

    document.body.appendChild(notification);

    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
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

  // Accessibility methods
  createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    this.liveRegion = liveRegion;
  }

  announceToScreenReader(message) {
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        this.liveRegion.textContent = '';
      }, 1000);
    }
  }

  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + Enter to generate planner
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      const generateBtn = document.getElementById('generate-planner-btn');
      if (generateBtn && !generateBtn.disabled) {
        this.handleFormSubmit(e);
      }
    }
    
    // Escape to clear form
    if (e.key === 'Escape' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      if (confirm('Are you sure you want to clear the form?')) {
        this.clearForm();
      }
    }
  }

  // Enhanced task creation with accessibility
  createTaskElement(taskId, taskData) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.dataset.taskId = taskId;
    taskElement.setAttribute('role', 'listitem');
    taskElement.setAttribute('aria-label', `Task: ${taskData.description} at ${taskData.time}, ${taskData.priority} priority`);

    taskElement.innerHTML = `
      <div class="task-time" aria-label="Time: ${taskData.time}">${taskData.time}</div>
      <div class="task-content">
        <div class="task-description" aria-label="Description: ${this.escapeHtml(taskData.description)}">${this.escapeHtml(taskData.description)}</div>
        <div class="task-priority priority-${taskData.priority}" aria-label="Priority: ${taskData.priority}">
          ${this.getPriorityIcon(taskData.priority)}
        </div>
      </div>
      <div class="task-actions" role="group" aria-label="Task actions">
        <button class="task-btn btn-edit" aria-label="Edit task: ${this.escapeHtml(taskData.description)}" title="Edit this task">
          <span class="btn-icon" aria-hidden="true">✏️</span>
        </button>
        <button class="task-btn btn-delete" aria-label="Delete task: ${this.escapeHtml(taskData.description)}" title="Delete this task">
          <span class="btn-icon" aria-hidden="true">🗑️</span>
        </button>
      </div>
    `;

    return taskElement;
  }

  getPriorityIcon(priority) {
    const icons = {
      urgent: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    };
    return icons[priority] || '⚪';
  }

  // Enhanced add task with screen reader announcement
  addTask() {
    const taskData = this.getCurrentTaskInputs();
    
    if (!this.validateTaskInputs(taskData)) {
      this.announceToScreenReader('Please fix the errors before adding the task');
      return;
    }

    const taskId = `task-${++this.taskCounter}`;
    const taskElement = this.createTaskElement(taskId, taskData);
    
    this.taskContainer.appendChild(taskElement);
    this.animateTaskIn(taskElement);
    this.clearTaskInputs();
    
    this.formData.tasks.push({
      id: taskId,
      time: taskData.time,
      description: taskData.description,
      priority: taskData.priority
    });

    this.updatePreview();
    this.showNotification('Task added successfully!', 'success');
    this.announceToScreenReader(`Task added: ${taskData.description} at ${taskData.time}`);
    
    // Focus on the new task for keyboard navigation
    const editBtn = taskElement.querySelector('.btn-edit');
    if (editBtn) {
      editBtn.focus();
    }
  }

  // Enhanced remove task with screen reader announcement
  removeTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskElement) return;

    const taskDescription = taskElement.querySelector('.task-description').textContent;
    
    this.animateTaskOut(taskElement, () => {
      taskElement.remove();
      this.formData.tasks = this.formData.tasks.filter(task => task.id !== taskId);
      
      if (this.formData.tasks.length === 0) {
        this.showEmptyState();
      }
      
      this.updatePreview();
      this.showNotification('Task removed', 'info');
      this.announceToScreenReader(`Task removed: ${taskDescription}`);
    });
  }
}

let plannerFormHandler;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    plannerFormHandler = new PlannerFormHandler();
  });
} else {
  plannerFormHandler = new PlannerFormHandler();
}