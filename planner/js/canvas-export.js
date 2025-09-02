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
      const data = event.detail || this.getCurrentPlannerData();
      this.showExportModal(data);
    });

    // Handle export button clicks
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.showExportModal());
    }
  }

  // Provide a safer fallback when planner data isn't available from form inputs
  getCurrentPlannerData() {
    if (window.plannerGenerator && window.plannerGenerator.currentPlannerData) {
      return window.plannerGenerator.currentPlannerData;
    }
    // Fallback to minimal preview extraction
    const previewTasks = Array.from(document.querySelectorAll('.preview-task'));
    const tasks = previewTasks.map(el => ({
      time: el.querySelector('.preview-time')?.textContent || '',
      description: el.querySelector('.preview-description')?.textContent || '',
      priority: (el.querySelector('.preview-priority')?.textContent || 'medium').toLowerCase()
    })).filter(t => t.time && t.description);
    return {
      personalInfo: {
        name: document.getElementById('planner-name')?.value || 'You',
        date: document.getElementById('planner-date')?.value || new Date().toISOString().split('T')[0]
      },
      tasks,
      notes: {
        notes: document.getElementById('daily-notes')?.value || '',
        reminders: document.getElementById('reminders')?.value || ''
      }
    };
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
              <p class="export-option-description">Optimized for lockscreen wallpapers with safe areas and minimalist design</p>
              <div class="export-option-grid">
                ${Object.entries(this.phoneSpecs).map(([name, specs]) => `
                  <button class="export-option-btn" data-type="phone" data-name="${name}" data-width="${specs.width}" data-height="${specs.height}" data-scale="${specs.scale}">
                    <div class="export-option-name">${name}</div>
                    <div class="export-option-size">${specs.width} × ${specs.height}</div>
                    <div class="export-option-type">Lockscreen</div>
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
      
      // Set lockscreen export flag
      this.isLockscreenExport = option.type === 'phone';
      
      // Use requestIdleCallback for better performance
      const generateCanvas = () => {
        return new Promise((resolve) => {
          const createCanvas = () => {
            // Create high-resolution canvas
            const scale = option.scale || 2;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = option.width * scale;
            canvas.height = option.height * scale;
            
            // Scale context for high resolution
            ctx.scale(scale, scale);
            
            resolve({ canvas, ctx });
          };
          
          if (window.requestIdleCallback) {
            window.requestIdleCallback(createCanvas, { timeout: 1000 });
          } else {
            setTimeout(createCanvas, 0);
          }
        });
      };
      
      const { canvas, ctx } = await generateCanvas();
      
      // Render planner to canvas with progress updates
      await this.renderPlannerToCanvas(ctx, option.width, option.height, plannerData, option);
      
      // Generate filename
      const filename = this.generateFilename(plannerData, option);
      
      // Download file with better error handling
      canvas.toBlob((blob) => {
        if (!blob) {
          this.showNotification('Error generating image', 'error');
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.setAttribute('aria-label', `Download ${filename}`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Clean up URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
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
    // Check if this is a lockscreen export
    if (this.isLockscreenExport) {
      return this.renderLockscreenLayout(ctx, width, height, plannerData, themeColors, padding);
    }
    
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

  // Lockscreen-specific rendering methods
  async renderLockscreenLayout(ctx, width, height, plannerData, themeColors, padding) {
    // Calculate safe areas for different phone types
    const safeAreas = this.calculateSafeAreas(width, height);
    
    // Render subtle background texture
    this.renderLockscreenBackground(ctx, width, height, themeColors);
    
    // Render time/date area (preserved for system display)
    this.renderLockscreenTimeArea(ctx, width, height, plannerData, themeColors, safeAreas);
    
    // Render compact task cards
    this.renderLockscreenTasks(ctx, width, height, plannerData, themeColors, safeAreas);
    
    // Render user name (if provided)
    if (plannerData.personalInfo.name) {
      this.renderLockscreenUserName(ctx, width, height, plannerData, themeColors, safeAreas);
    }
    
    // Render subtle branding/date
    this.renderLockscreenBranding(ctx, width, height, plannerData, themeColors, safeAreas);
  }

  calculateSafeAreas(width, height) {
    // Safe areas for different phone types
    const isNotch = width >= 375 && height >= 812; // iPhone X and newer
    const isAndroid = width >= 384 && height >= 854; // Modern Android
    
    return {
      top: isNotch ? 60 : 40, // Status bar + notch area
      bottom: 100, // Home indicator area
      left: 20,
      right: 20,
      timeArea: {
        top: isNotch ? 120 : 80,
        height: 120,
        left: 20,
        right: 20
      },
      contentArea: {
        top: isNotch ? 260 : 220,
        bottom: 120,
        left: 20,
        right: 20
      }
    };
  }

  renderLockscreenBackground(ctx, width, height, themeColors) {
    // Create subtle gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    
    if (themeColors.background.includes('#ffffff') || themeColors.background.includes('255, 255, 255')) {
      // Light theme - subtle light gradient
      gradient.addColorStop(0, this.lightenColor(themeColors.background, 0.05));
      gradient.addColorStop(1, this.darkenColor(themeColors.background, 0.05));
    } else {
      // Dark theme - subtle dark gradient
      gradient.addColorStop(0, this.lightenColor(themeColors.background, 0.1));
      gradient.addColorStop(1, this.darkenColor(themeColors.background, 0.1));
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add subtle texture pattern
    this.renderSubtleTexture(ctx, width, height, themeColors);
  }

  renderSubtleTexture(ctx, width, height, themeColors) {
    // Create subtle dot pattern for texture
    const dotSize = 1;
    const spacing = 40;
    const opacity = themeColors.background.includes('#ffffff') ? 0.03 : 0.05;
    
    ctx.fillStyle = this.hexToRgba(themeColors.textPrimary, opacity);
    
    for (let x = 0; x < width; x += spacing) {
      for (let y = 0; y < height; y += spacing) {
        // Random offset for natural look
        const offsetX = (Math.sin(x * 0.01) * 10) % spacing;
        const offsetY = (Math.cos(y * 0.01) * 10) % spacing;
        
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, dotSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  renderLockscreenTimeArea(ctx, width, height, plannerData, themeColors, safeAreas) {
    // This area is intentionally left mostly empty to preserve space for system time/date
    // Only add subtle indicators that don't interfere with system UI
    
    const timeArea = safeAreas.timeArea;
    const centerX = width / 2;
    
    // Subtle date indicator (small, unobtrusive)
    ctx.fillStyle = this.hexToRgba(themeColors.textSecondary, 0.3);
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.formatDateShort(plannerData.personalInfo.date), centerX, timeArea.top + 20);
  }

  renderLockscreenTasks(ctx, width, height, plannerData, themeColors, safeAreas) {
    const tasks = plannerData.tasks.filter(task => task.time && task.description);
    if (tasks.length === 0) return;
    
    const contentArea = safeAreas.contentArea;
    const centerX = width / 2;
    const availableWidth = width - contentArea.left - contentArea.right;
    const cardWidth = Math.min(availableWidth - 20, 300);
    const cardSpacing = 12;
    
    // Sort tasks by time and take top 3-4 most important
    const sortedTasks = [...tasks].sort((a, b) => {
      // Prioritize by time and priority
      const timeA = a.time;
      const timeB = b.time;
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityA = priorityOrder[a.priority] || 2;
      const priorityB = priorityOrder[b.priority] || 2;
      
      if (priorityA !== priorityB) return priorityB - priorityA;
      return timeA.localeCompare(timeB);
    });
    
    const maxTasks = Math.min(sortedTasks.length, 4);
    const totalHeight = (maxTasks * 60) + ((maxTasks - 1) * cardSpacing);
    const startY = contentArea.top + (contentArea.bottom - contentArea.top - totalHeight) / 2;
    
    sortedTasks.slice(0, maxTasks).forEach((task, index) => {
      const cardY = startY + (index * (60 + cardSpacing));
      this.renderLockscreenTaskCard(ctx, centerX, cardY, cardWidth, task, themeColors);
    });
  }

  renderLockscreenTaskCard(ctx, centerX, y, width, task, themeColors) {
    const cardHeight = 50;
    const cardX = centerX - width / 2;
    
    // Card background with subtle shadow
    ctx.fillStyle = this.hexToRgba(themeColors.surface, 0.8);
    ctx.strokeStyle = this.hexToRgba(themeColors.border, 0.3);
    ctx.lineWidth = 1;
    
    // Rounded rectangle
    this.roundRect(ctx, cardX, y, width, cardHeight, 12);
    ctx.fill();
    ctx.stroke();
    
    // Priority indicator (left side)
    const priorityColor = this.getPriorityColor(task.priority, themeColors);
    ctx.fillStyle = priorityColor;
    ctx.beginPath();
    ctx.arc(cardX + 15, y + cardHeight / 2, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Time (left side, below priority)
    ctx.fillStyle = this.hexToRgba(themeColors.textSecondary, 0.8);
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(task.time, cardX + 25, y + 18);
    
    // Task description (center)
    ctx.fillStyle = this.hexToRgba(themeColors.textPrimary, 0.9);
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    
    const maxDescWidth = width - 80;
    const description = this.truncateText(ctx, task.description, maxDescWidth);
    ctx.fillText(description, cardX + 25, y + 35);
    
    // Time of day indicator (right side)
    const [hours] = task.time.split(':').map(Number);
    const timeOfDay = this.getTimeOfDay(hours);
    const timeColor = this.getTimeOfDayColor(timeOfDay, themeColors);
    
    ctx.fillStyle = this.hexToRgba(timeColor, 0.6);
    ctx.beginPath();
    ctx.arc(cardX + width - 15, y + cardHeight / 2, 3, 0, 2 * Math.PI);
    ctx.fill();
  }

  renderLockscreenUserName(ctx, width, height, plannerData, themeColors, safeAreas) {
    const centerX = width / 2;
    const userNameY = safeAreas.contentArea.bottom - 40;
    
    ctx.fillStyle = this.hexToRgba(themeColors.textPrimary, 0.6);
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Hello, ${plannerData.personalInfo.name}`, centerX, userNameY);
  }

  renderLockscreenBranding(ctx, width, height, plannerData, themeColors, safeAreas) {
    const centerX = width / 2;
    const brandingY = height - 30;
    
    ctx.fillStyle = this.hexToRgba(themeColors.textMuted, 0.4);
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Circular Daily Planner', centerX, brandingY);
  }

  // Utility methods for lockscreen rendering
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  truncateText(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) {
      return text;
    }
    
    let truncated = text;
    while (ctx.measureText(truncated + '...').width > maxWidth && truncated.length > 0) {
      truncated = truncated.slice(0, -1);
    }
    
    return truncated + '...';
  }

  hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  lightenColor(hex, amount) {
    const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + Math.round(255 * amount));
    const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + Math.round(255 * amount));
    const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  darkenColor(hex, amount) {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - Math.round(255 * amount));
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - Math.round(255 * amount));
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - Math.round(255 * amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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