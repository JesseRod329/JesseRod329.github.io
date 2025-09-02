/**
 * Form Handler for Circular Daily Planner
 * Manages task input, form validation, and user interactions
 */

class FormHandler {
  constructor(planner) {
    this.planner = planner;
    this.taskInput = null;
    this.timeInput = null;
    this.addButton = null;
    this.themeToggle = null;
    this.exportButton = null;
    
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
    this.taskInput = document.getElementById('task-input');
    this.timeInput = document.getElementById('task-time');
    this.addButton = document.getElementById('add-task');
    this.themeToggle = document.getElementById('theme-toggle');
    this.exportButton = document.getElementById('export-btn');

    if (!this.taskInput || !this.timeInput || !this.addButton) {
      console.error('Required form elements not found');
      return;
    }

    this.setupEventListeners();
    this.setupThemeToggle();
    this.setupExportButton();
    this.setDefaultTime();
  }

  setupEventListeners() {
    // Add task button click
    this.addButton.addEventListener('click', () => {
      this.handleAddTask();
    });

    // Enter key in task input
    this.taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleAddTask();
      }
    });

    // Enter key in time input
    this.timeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleAddTask();
      }
    });

    // Auto-focus task input when page loads
    this.taskInput.focus();
  }

  setupThemeToggle() {
    if (!this.themeToggle) return;

    this.themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Update theme icon based on current theme
    this.updateThemeIcon();
  }

  setupExportButton() {
    if (!this.exportButton) return;

    this.exportButton.addEventListener('click', () => {
      this.handleExport();
    });
  }

  handleAddTask() {
    const taskText = this.taskInput.value.trim();
    const taskTime = this.timeInput.value;

    if (!taskText) {
      this.showError('Please enter a task description');
      this.taskInput.focus();
      return;
    }

    // Validate time format if provided
    if (taskTime && !this.isValidTime(taskTime)) {
      this.showError('Please enter a valid time (HH:MM format)');
      this.timeInput.focus();
      return;
    }

    // Add task to planner
    this.planner.addTask(taskText, taskTime);

    // Clear form
    this.taskInput.value = '';
    this.timeInput.value = '';
    this.taskInput.focus();

    // Show success feedback
    this.showSuccess('Task added successfully!');
  }

  isValidTime(timeString) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeString);
  }

  setDefaultTime() {
    // Set default time to next hour
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);
    const defaultTime = nextHour.toTimeString().slice(0, 5);
    this.timeInput.value = defaultTime;
  }

  toggleTheme() {
    const body = document.body;
    const currentTheme = this.getCurrentTheme();
    
    if (currentTheme === 'dark') {
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
      localStorage.setItem('planner-theme', 'light');
    } else {
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
      localStorage.setItem('planner-theme', 'dark');
    }

    this.updateThemeIcon();
  }

  getCurrentTheme() {
    // Check for manual override first
    if (document.body.classList.contains('theme-light')) return 'light';
    if (document.body.classList.contains('theme-dark')) return 'dark';
    
    // Check localStorage
    const saved = localStorage.getItem('planner-theme');
    if (saved) return saved;
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  updateThemeIcon() {
    if (!this.themeToggle) return;

    const themeIcon = this.themeToggle.querySelector('.theme-icon');
    if (!themeIcon) return;

    const currentTheme = this.getCurrentTheme();
    themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  }

  handleExport() {
    if (!this.planner || typeof this.planner.exportTasks !== 'function') {
      this.showError('Export functionality not available');
      return;
    }

    try {
      this.planner.exportTasks();
      this.showSuccess('Tasks exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      this.showError('Failed to export tasks');
    }
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
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

    // Set background color based on type
    switch (type) {
      case 'error':
        notification.style.background = '#ef4444';
        break;
      case 'success':
        notification.style.background = '#10b981';
        break;
      default:
        notification.style.background = 'var(--accent-color)';
    }

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize form handler when script loads
let formHandler;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for planner to be initialized
    const checkPlanner = () => {
      if (typeof planner !== 'undefined') {
        formHandler = new FormHandler(planner);
      } else {
        setTimeout(checkPlanner, 100);
      }
    };
    checkPlanner();
  });
} else {
  // If DOM is already ready, wait for planner
  const checkPlanner = () => {
    if (typeof planner !== 'undefined') {
      formHandler = new FormHandler(planner);
    } else {
      setTimeout(checkPlanner, 100);
    }
  };
  checkPlanner();
}
