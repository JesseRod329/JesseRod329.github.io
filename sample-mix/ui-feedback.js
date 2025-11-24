/**
 * UI Feedback System - Toast notifications, progress indicators, and loading states
 */

class UIFeedback {
  constructor() {
    this.toastContainer = null;
    this.progressBars = new Map();
    this.init();
  }

  init() {
    // Create toast container
    this.toastContainer = document.createElement('div');
    this.toastContainer.className = 'toast-container';
    document.body.appendChild(this.toastContainer);
  }

  /**
   * Show a toast notification
   */
  toast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const icon = this.getToastIcon(type);
    if (icon) {
      const iconEl = document.createElement('span');
      iconEl.className = 'toast-icon';
      iconEl.innerHTML = icon;
      toast.insertBefore(iconEl, toast.firstChild);
    }

    this.toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);

    return toast;
  }

  getToastIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || '';
  }

  /**
   * Show success toast
   */
  success(message, duration) {
    return this.toast(message, 'success', duration);
  }

  /**
   * Show error toast
   */
  error(message, duration) {
    return this.toast(message, 'error', duration || 5000);
  }

  /**
   * Show warning toast
   */
  warning(message, duration) {
    return this.toast(message, 'warning', duration);
  }

  /**
   * Show info toast
   */
  info(message, duration) {
    return this.toast(message, 'info', duration);
  }

  /**
   * Create a progress bar
   */
  createProgressBar(id, label = '') {
    const container = document.createElement('div');
    container.className = 'progress-bar-container';
    container.id = `progress-${id}`;
    
    if (label) {
      const labelEl = document.createElement('div');
      labelEl.className = 'progress-label';
      labelEl.textContent = label;
      container.appendChild(labelEl);
    }
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-fill';
    progressBar.appendChild(progressFill);
    container.appendChild(progressBar);
    
    const percentEl = document.createElement('div');
    percentEl.className = 'progress-percent';
    percentEl.textContent = '0%';
    container.appendChild(percentEl);
    
    this.progressBars.set(id, {
      container,
      fill: progressFill,
      percent: percentEl
    });
    
    return container;
  }

  /**
   * Update progress bar
   */
  updateProgress(id, percent, text = '') {
    const progress = this.progressBars.get(id);
    if (!progress) return;
    
    percent = Math.max(0, Math.min(100, percent));
    progress.fill.style.width = `${percent}%`;
    progress.percent.textContent = `${Math.round(percent)}%`;
    
    if (text && progress.container.querySelector('.progress-label')) {
      progress.container.querySelector('.progress-label').textContent = text;
    }
  }

  /**
   * Remove progress bar
   */
  removeProgress(id) {
    const progress = this.progressBars.get(id);
    if (progress) {
      progress.container.remove();
      this.progressBars.delete(id);
    }
  }

  /**
   * Show loading overlay with progress
   */
  showLoading(text, showProgress = false) {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'loadingOverlay';
      overlay.className = 'loading-overlay';
      document.body.appendChild(overlay);
    }
    
    const loadingText = overlay.querySelector('#loadingText') || document.createElement('p');
    if (!loadingText.id) {
      loadingText.id = 'loadingText';
      overlay.appendChild(loadingText);
    }
    loadingText.textContent = text;
    
    if (showProgress && !overlay.querySelector('.progress-bar-container')) {
      const progressContainer = this.createProgressBar('loading', '');
      overlay.appendChild(progressContainer);
    }
    
    overlay.style.display = 'flex';
  }

  /**
   * Hide loading overlay
   */
  hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = 'none';
      const progress = overlay.querySelector('.progress-bar-container');
      if (progress) progress.remove();
    }
  }

  /**
   * Update loading progress
   */
  updateLoadingProgress(percent, text = '') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      this.updateProgress('loading', percent, text);
      const loadingText = overlay.querySelector('#loadingText');
      if (loadingText && text) {
        loadingText.textContent = text;
      }
    }
  }
}





