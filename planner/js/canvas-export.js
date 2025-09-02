/**
 * Canvas Export System for Circular Daily Planner
 * Supports desktop wallpaper and phone-specific lockscreen exports
 * Theme-aware rendering with high-resolution output
 */

class CanvasExport {
  constructor() {
    this.phoneSpecs = {
      'iPhone 15 Pro': { width: 393, height: 852, scale: 3 },
      'iPhone 15': { width: 393, height: 852, scale: 3 },
      'iPhone 14 Pro': { width: 393, height: 852, scale: 3 },
      'iPhone 14': { width: 390, height: 844, scale: 3 },
      'iPhone 13 Pro': { width: 390, height: 844, scale: 3 },
      'iPhone 13': { width: 390, height: 844, scale: 3 },
      'iPhone 12 Pro': { width: 390, height: 844, scale: 3 },
      'iPhone 12': { width: 390, height: 844, scale: 3 },
      'iPhone 11 Pro': { width: 375, height: 812, scale: 3 },
      'iPhone 11': { width: 414, height: 896, scale: 2 },
      'iPhone X': { width: 375, height: 812, scale: 3 },
      'Samsung S24 Ultra': { width: 384, height: 854, scale: 2 },
      'Samsung S24': { width: 384, height: 854, scale: 2 },
      'Samsung S23 Ultra': { width: 384, height: 854, scale: 2 },
      'Samsung S23': { width: 384, height: 854, scale: 2 },
      'Samsung S22 Ultra': { width: 384, height: 854, scale: 2 },
      'Samsung S22': { width: 384, height: 854, scale: 2 },
      'Google Pixel 8 Pro': { width: 412, height: 915, scale: 2 },
      'Google Pixel 8': { width: 412, height: 915, scale: 2 },
      'Google Pixel 7 Pro': { width: 412, height: 915, scale: 2 },
      'Google Pixel 7': { width: 412, height: 915, scale: 2 },
      'OnePlus 12': { width: 384, height: 854, scale: 2 },
      'OnePlus 11': { width: 384, height: 854, scale: 2 },
      'Xiaomi 14': { width: 384, height: 854, scale: 2 },
      'Huawei P60': { width: 384, height: 854, scale: 2 }
    };

    this.desktopSpecs = {
      'Desktop Wallpaper': { width: 1920, height: 1080 },
      'Ultra-wide': { width: 2560, height: 1080 },
      '4K': { width: 3840, height: 2160 },
      'MacBook Pro': { width: 2560, height: 1600 },
      'MacBook Air': { width: 2560, height: 1664 }
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for export requests from planner generator
    document.addEventListener('exportPlanner', (event) => {
      this.showExportModal(event.detail);
    });

    // Handle export button clicks
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.showExportModal());
    }
  }

  showExportModal(plannerData = null) {
    if (!plannerData) {
      plannerData = this.getCurrentPlannerData();
    }

    if (!plannerData || !plannerData.tasks || plannerData.tasks.length === 0) {
      this.showNotification('No planner data to export', 'error');
      return;
    }

    // Create modal
    const modal = this.createExportModal(plannerData);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
  }

  createExportModal(plannerData) {
    const modal = document.createElement('div');
    modal.className = 'export-modal';
    modal.innerHTML = `
      <div class="export-modal-content">
        <div class="export-modal-header">
          <h3>Export Planner</h3>
          <button class="export-modal-close" aria-label="Close export modal">×</button>
        </div>
        
        <div class="export-modal-body">
          <div class="export-options">
            <div class="export-option-group">
              <h4>Desktop Wallpaper</h4>
              <div class="export-option-grid">
                ${Object.entries(this.desktopSpecs).map(([name, specs]) => `
                  <button class="export-option-btn" data-type="desktop" data-name="${name}" data-width="${specs.width}" data-height="${specs.height}">
                    <div class="export-option-name">${name}</div>
                    <div class="export-option-size">${specs.width} × ${specs.height}</div>
                  </button>
                `).join('')}
              </div>
            </div>
            
            <div class="export-option-group">
              <h4>Phone Lockscreen</h4>
              <div class="export-option-grid">
                ${Object.entries(this.phoneSpecs).map(([name, specs]) => `
                  <button class="export-option-btn" data-type="phone" data-name="${name}" data-width="${specs.width}" data-height="${specs.height}" data-scale="${specs.scale}">
                    <div class="export-option-name">${name}</div>
                    <div class="export-option-size">${specs.width} × ${specs.height}</div>
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div class="export-preview">
            <h4>Preview</h4>
            <div class="export-preview-canvas" id="export-preview-canvas"></div>
          </div>
        </div>
        
        <div class="export-modal-footer">
          <button class="btn btn-secondary" id="export-cancel-btn">Cancel</button>
          <button class="btn btn-primary" id="export-generate-btn" disabled>
            <span class="btn-icon">📤</span>
            Generate Export
          </button>
        </div>
      </div>
    `;

    // Setup modal event listeners
    this.setupModalEventListeners(modal, plannerData);
    
    return modal;
  }

  setupModalEventListeners(modal, plannerData) {
    const closeBtn = modal.querySelector('.export-modal-close');
    const cancelBtn = modal.querySelector('#export-cancel-btn');
    const generateBtn = modal.querySelector('#export-generate-btn');
    const optionBtns = modal.querySelectorAll('.export-option-btn');

    let selectedOption = null;

    // Close modal
    const closeModal = () => {
      modal.classList.remove('show');
      setTimeout(() => {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Handle option selection
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove previous selection
        optionBtns.forEach(b => b.classList.remove('selected'));
        
        // Select current option
        btn.classList.add('selected');
        selectedOption = {
          type: btn.dataset.type,
          name: btn.dataset.name,
          width: parseInt(btn.dataset.width),
          height: parseInt(btn.dataset.height),
          scale: parseInt(btn.dataset.scale) || 2
        };

        generateBtn.disabled = false;
        this.updatePreview(modal, plannerData, selectedOption);
      });
    });

    // Handle export generation
    generateBtn.addEventListener('click', () => {
      if (selectedOption) {
        this.generateExport(plannerData, selectedOption);
        closeModal();
      }
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  updatePreview(modal, plannerData, option) {
    const previewCanvas = modal.querySelector('#export-preview-canvas');
    if (!previewCanvas) return;

    // Create preview canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set preview size (smaller for modal)
    const previewSize = 200;
    const aspectRatio = option.width / option.height;
    
    if (aspectRatio > 1) {
      canvas.width = previewSize;
      canvas.height = previewSize / aspectRatio;
    } else {
      canvas.width = previewSize * aspectRatio;
      canvas.height = previewSize;
    }

    // Render preview
    this.renderPlannerToCanvas(ctx, canvas.width, canvas.height, plannerData, option);
    
    // Update preview display
    previewCanvas.innerHTML = '';
    previewCanvas.appendChild(canvas);
  }

  async generateExport(plannerData, option) {
    try {
      this.showNotification('Generating export...', 'info');
      
      // Create high-resolution canvas
      const scale = option.scale || 2;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = option.width * scale;
      canvas.height = option.height * scale;
      
      // Scale context for high resolution
      ctx.scale(scale, scale);
      
      // Render planner to canvas
      await this.renderPlannerToCanvas(ctx, option.width, option.height, plannerData, option);
      
      // Generate filename
      const filename = this.generateFilename(plannerData, option);
      
      // Download file
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Export generated successfully!', 'success');
      }, 'image/png', 1.0);
      
    } catch (error) {
      console.error('Export error:', error);
      this.showNotification('Error generating export', 'error');
    }
  }

  async renderPlannerToCanvas(ctx, width, height, plannerData, option) {
    // Get theme colors
    const themeColors = this.getThemeColors();
    
    // Set background
    ctx.fillStyle = themeColors.background;
    ctx.fillRect(0, 0, width, height);
    
    // Calculate layout based on format
    const isPhone = option.type === 'phone';
    const padding = isPhone ? 40 : 80;
    const centerX = width / 2;
    const centerY = height / 2;
    
    if (isPhone) {
      await this.renderPhoneLayout(ctx, width, height, plannerData, themeColors, padding);
    } else {
      await this.renderDesktopLayout(ctx, width, height, plannerData, themeColors, padding);
    }
  }

  async renderPhoneLayout(ctx, width, height, plannerData, themeColors, padding) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Header
    ctx.fillStyle = themeColors.textPrimary;
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(plannerData.personalInfo.name || 'Daily Planner', centerX, 60);
    
    ctx.fillStyle = themeColors.textSecondary;
    ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(this.formatDate(plannerData.personalInfo.date), centerX, 85);
    
    // Time wheel
    const wheelRadius = Math.min(width, height) * 0.35;
    this.renderTimeWheel(ctx, centerX, centerY, wheelRadius, plannerData, themeColors);
    
    // Tasks list (compact)
    const tasksY = centerY + wheelRadius + 60;
    this.renderTasksList(ctx, width, tasksY, plannerData, themeColors, true);
    
    // Notes (if any)
    if (plannerData.notes.notes || plannerData.notes.reminders) {
      const notesY = height - 100;
      this.renderNotes(ctx, width, notesY, plannerData, themeColors, true);
    }
  }

  async renderDesktopLayout(ctx, width, height, plannerData, themeColors, padding) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Header
    ctx.fillStyle = themeColors.textPrimary;
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(plannerData.personalInfo.name || 'Daily Planner', centerX, 80);
    
    ctx.fillStyle = themeColors.textSecondary;
    ctx.font = '20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(this.formatDate(plannerData.personalInfo.date), centerX, 110);
    
    // Two-column layout
    const leftX = width * 0.25;
    const rightX = width * 0.75;
    
    // Time wheel (left)
    const wheelRadius = Math.min(width, height) * 0.25;
    this.renderTimeWheel(ctx, leftX, centerY, wheelRadius, plannerData, themeColors);
    
    // Tasks list (right)
    this.renderTasksList(ctx, rightX, centerY, plannerData, themeColors, false);
    
    // Notes (bottom)
    if (plannerData.notes.notes || plannerData.notes.reminders) {
      const notesY = height - 120;
      this.renderNotes(ctx, width, notesY, plannerData, themeColors, false);
    }
  }

  renderTimeWheel(ctx, centerX, centerY, radius, plannerData, themeColors) {
    // Wheel background
    ctx.strokeStyle = themeColors.border;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Center circle
    ctx.fillStyle = themeColors.surface;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = themeColors.border;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Center text
    ctx.fillStyle = themeColors.textPrimary;
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.formatDateShort(plannerData.personalInfo.date), centerX, centerY - 5);
    
    ctx.fillStyle = themeColors.textSecondary;
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(plannerData.personalInfo.name || 'You', centerX, centerY + 10);
    
    // Hour markers
    for (let hour = 0; hour < 24; hour++) {
      const angle = (hour * 15) - 90; // 15 degrees per hour, start at top
      const isMajor = hour % 6 === 0;
      
      const startRadius = radius * 0.85;
      const endRadius = radius * 0.95;
      
      const startX = centerX + startRadius * Math.cos(angle * Math.PI / 180);
      const startY = centerY + startRadius * Math.sin(angle * Math.PI / 180);
      const endX = centerX + endRadius * Math.cos(angle * Math.PI / 180);
      const endY = centerY + endRadius * Math.sin(angle * Math.PI / 180);
      
      ctx.strokeStyle = isMajor ? themeColors.textSecondary : themeColors.textMuted;
      ctx.lineWidth = isMajor ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Hour labels for major markers
      if (isMajor) {
        const labelRadius = radius * 1.1;
        const labelX = centerX + labelRadius * Math.cos(angle * Math.PI / 180);
        const labelY = centerY + labelRadius * Math.sin(angle * Math.PI / 180);
        
        ctx.fillStyle = themeColors.textSecondary;
        ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.formatHour(hour), labelX, labelY + 3);
      }
    }
    
    // Task markers
    plannerData.tasks.forEach((task, index) => {
      if (task.time) {
        const [hours, minutes] = task.time.split(':').map(Number);
        const taskAngle = (hours + minutes / 60) * 15 - 90;
        const timeOfDay = this.getTimeOfDay(hours);
        
        const markerRadius = radius * 0.7;
        const markerX = centerX + markerRadius * Math.cos(taskAngle * Math.PI / 180);
        const markerY = centerY + markerRadius * Math.sin(taskAngle * Math.PI / 180);
        
        // Task marker
        ctx.fillStyle = this.getTimeOfDayColor(timeOfDay, themeColors);
        ctx.beginPath();
        ctx.arc(markerX, markerY, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Priority indicator for high priority
        if (task.priority === 'high' || task.priority === 'urgent') {
          ctx.strokeStyle = themeColors.danger;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(markerX, markerY, 8, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    });
  }

  renderTasksList(ctx, x, y, plannerData, themeColors, isCompact) {
    const tasks = plannerData.tasks.filter(task => task.time && task.description);
    
    if (tasks.length === 0) return;
    
    // Sort tasks by time
    const sortedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time));
    
    ctx.fillStyle = themeColors.textPrimary;
    ctx.font = isCompact ? 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Today\'s Tasks', x, y);
    
    const startY = y + (isCompact ? 25 : 35);
    const lineHeight = isCompact ? 20 : 25;
    const maxTasks = isCompact ? 6 : 10;
    
    sortedTasks.slice(0, maxTasks).forEach((task, index) => {
      const taskY = startY + (index * lineHeight);
      
      // Time
      ctx.fillStyle = themeColors.textSecondary;
      ctx.font = isCompact ? '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(task.time, x, taskY);
      
      // Description
      ctx.fillStyle = themeColors.textPrimary;
      ctx.font = isCompact ? '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const descX = x + (isCompact ? 60 : 80);
      const maxWidth = isCompact ? 200 : 300;
      this.wrapText(ctx, task.description, descX, taskY, maxWidth, lineHeight);
      
      // Priority indicator
      const priorityColor = this.getPriorityColor(task.priority, themeColors);
      ctx.fillStyle = priorityColor;
      ctx.beginPath();
      ctx.arc(descX - 15, taskY - 5, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    if (tasks.length > maxTasks) {
      const moreY = startY + (maxTasks * lineHeight) + 10;
      ctx.fillStyle = themeColors.textMuted;
      ctx.font = isCompact ? '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`+${tasks.length - maxTasks} more tasks`, x, moreY);
    }
  }

  renderNotes(ctx, width, y, plannerData, themeColors, isCompact) {
    if (!plannerData.notes.notes && !plannerData.notes.reminders) return;
    
    const centerX = width / 2;
    
    ctx.fillStyle = themeColors.textPrimary;
    ctx.font = isCompact ? 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Notes & Reminders', centerX, y);
    
    let currentY = y + (isCompact ? 20 : 30);
    
    if (plannerData.notes.notes) {
      ctx.fillStyle = themeColors.textSecondary;
      ctx.font = isCompact ? '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      const maxWidth = isCompact ? width - 40 : width - 80;
      currentY = this.wrapText(ctx, plannerData.notes.notes, centerX, currentY, maxWidth, isCompact ? 15 : 18);
    }
    
    if (plannerData.notes.reminders) {
      currentY += isCompact ? 10 : 15;
      ctx.fillStyle = themeColors.textSecondary;
      ctx.font = isCompact ? '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      const maxWidth = isCompact ? width - 40 : width - 80;
      this.wrapText(ctx, plannerData.notes.reminders, centerX, currentY, maxWidth, isCompact ? 15 : 18);
    }
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  }

  getThemeColors() {
    const computedStyle = getComputedStyle(document.body);
    return {
      background: computedStyle.getPropertyValue('--bg-primary').trim() || '#ffffff',
      surface: computedStyle.getPropertyValue('--surface-card').trim() || '#ffffff',
      textPrimary: computedStyle.getPropertyValue('--text-primary').trim() || '#212529',
      textSecondary: computedStyle.getPropertyValue('--text-secondary').trim() || '#6c757d',
      textMuted: computedStyle.getPropertyValue('--text-muted').trim() || '#adb5bd',
      accent: computedStyle.getPropertyValue('--interactive-primary').trim() || '#0d6efd',
      border: computedStyle.getPropertyValue('--border-light').trim() || '#e9ecef',
      danger: computedStyle.getPropertyValue('--interactive-danger').trim() || '#dc3545',
      success: computedStyle.getPropertyValue('--interactive-success').trim() || '#198754',
      morning: computedStyle.getPropertyValue('--accent-morning').trim() || '#fd7e14',
      afternoon: computedStyle.getPropertyValue('--accent-afternoon').trim() || '#0d6efd',
      evening: computedStyle.getPropertyValue('--accent-evening').trim() || '#6f42c1'
    };
  }

  getTimeOfDayColor(timeOfDay, themeColors) {
    switch (timeOfDay) {
      case 'morning': return themeColors.morning;
      case 'afternoon': return themeColors.afternoon;
      case 'evening': return themeColors.evening;
      default: return themeColors.accent;
    }
  }

  getPriorityColor(priority, themeColors) {
    switch (priority) {
      case 'urgent': return themeColors.danger;
      case 'high': return themeColors.danger;
      case 'medium': return themeColors.accent;
      case 'low': return themeColors.textMuted;
      default: return themeColors.accent;
    }
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

  generateFilename(plannerData, option) {
    const name = plannerData.personalInfo.name || 'Planner';
    const date = plannerData.personalInfo.date || new Date().toISOString().split('T')[0];
    const model = option.name.replace(/\s+/g, '-').toLowerCase();
    const timestamp = new Date().toISOString().split('T')[0];
    
    return `${name}-${date}-${model}-${timestamp}.png`;
  }

  getCurrentPlannerData() {
    // Try to get data from planner generator
    if (window.plannerGenerator && window.plannerGenerator.currentPlannerData) {
      return window.plannerGenerator.currentPlannerData;
    }
    
    // Fallback to form data
    return this.getFormData();
  }

  getFormData() {
    const form = document.getElementById('planner-form');
    if (!form) return null;

    const formData = new FormData(form);
    const tasks = this.getTasksFromForm();
    
    return {
      personalInfo: {
        name: formData.get('planner-name') || '',
        date: formData.get('planner-date') || new Date().toISOString().split('T')[0]
      },
      tasks: tasks,
      notes: {
        notes: formData.get('notes') || '',
        reminders: formData.get('reminders') || ''
      }
    };
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
}

// Initialize canvas export when script loads
let canvasExport;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    canvasExport = new CanvasExport();
  });
} else {
  canvasExport = new CanvasExport();
}