/**
 * Canvas Export for Circular Daily Planner
 * Generates visual exports of the planner using HTML5 Canvas
 */

class CanvasExporter {
  constructor(planner) {
    this.planner = planner;
    this.canvas = null;
    this.ctx = null;
    
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
    this.canvas = document.getElementById('export-canvas');
    if (!this.canvas) {
      console.error('Export canvas not found');
      return;
    }
    this.ctx = this.canvas.getContext('2d');
  }

  exportAsImage() {
    if (!this.canvas || !this.ctx) {
      throw new Error('Canvas not available');
    }

    // Set canvas size
    const size = 800;
    this.canvas.width = size;
    this.canvas.height = size;

    // Clear canvas
    this.ctx.clearRect(0, 0, size, size);

    // Get current theme colors
    const colors = this.getThemeColors();

    // Draw background
    this.ctx.fillStyle = colors.background;
    this.ctx.fillRect(0, 0, size, size);

    // Draw time wheel
    this.drawTimeWheel(size, colors);

    // Draw tasks
    this.drawTasks(size, colors);

    // Draw center info
    this.drawCenterInfo(size, colors);

    // Draw title
    this.drawTitle(size, colors);

    // Convert to blob and download
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `planner-${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve();
        } else {
          reject(new Error('Failed to create image blob'));
        }
      }, 'image/png');
    });
  }

  getThemeColors() {
    const computedStyle = getComputedStyle(document.body);
    
    return {
      background: computedStyle.getPropertyValue('--bg-primary').trim() || '#ffffff',
      surface: computedStyle.getPropertyValue('--surface-card').trim() || '#ffffff',
      textPrimary: computedStyle.getPropertyValue('--text-primary').trim() || '#212529',
      textSecondary: computedStyle.getPropertyValue('--text-secondary').trim() || '#6c757d',
      accent: computedStyle.getPropertyValue('--interactive-primary').trim() || '#0d6efd',
      border: computedStyle.getPropertyValue('--border-light').trim() || '#e9ecef'
    };
  }

  drawTimeWheel(size, colors) {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;

    // Draw wheel background
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = colors.surface;
    this.ctx.fill();
    this.ctx.strokeStyle = colors.border;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw hour markers
    this.ctx.strokeStyle = colors.textSecondary;
    this.ctx.lineWidth = 2;
    
    for (let hour = 0; hour < 24; hour++) {
      const angle = (hour * 15) - 90; // 15 degrees per hour, start at top
      const isMajor = hour % 6 === 0;
      
      const startRadius = radius - (isMajor ? 30 : 20);
      const endRadius = radius - 10;
      
      const startX = centerX + startRadius * Math.cos((angle * Math.PI) / 180);
      const startY = centerY + startRadius * Math.sin((angle * Math.PI) / 180);
      const endX = centerX + endRadius * Math.cos((angle * Math.PI) / 180);
      const endY = centerY + endRadius * Math.sin((angle * Math.PI) / 180);
      
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
      
      // Draw hour labels
      if (isMajor) {
        const labelRadius = radius - 50;
        const labelX = centerX + labelRadius * Math.cos((angle * Math.PI) / 180);
        const labelY = centerY + labelRadius * Math.sin((angle * Math.PI) / 180);
        
        this.ctx.fillStyle = colors.textSecondary;
        this.ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.formatHour(hour), labelX, labelY);
      }
    }
  }

  drawTasks(size, colors) {
    if (!this.planner || !this.planner.tasks) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.35;
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    this.planner.tasks.forEach(task => {
      if (task.time) {
        const [hours, minutes] = task.time.split(':').map(Number);
        const angle = (hours + minutes / 60) * 15 - 90;
        const isPast = hours < currentHour || (hours === currentHour && minutes < currentMinute);
        const isCurrent = hours === currentHour && Math.abs(minutes - currentMinute) <= 30;

        const taskRadius = radius - 40;
        const x = centerX + taskRadius * Math.cos((angle * Math.PI) / 180);
        const y = centerY + taskRadius * Math.sin((angle * Math.PI) / 180);

        // Draw task dot
        this.ctx.beginPath();
        this.ctx.arc(x, y, 8, 0, 2 * Math.PI);
        
        if (isPast) {
          this.ctx.fillStyle = colors.border;
        } else if (isCurrent) {
          this.ctx.fillStyle = colors.accent;
        } else {
          this.ctx.fillStyle = colors.textSecondary;
        }
        
        this.ctx.fill();
      }
    });
  }

  drawCenterInfo(size, colors) {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 60;

    // Draw center circle
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = colors.surface;
    this.ctx.fill();
    this.ctx.strokeStyle = colors.border;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw current time
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    this.ctx.fillStyle = colors.accent;
    this.ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(timeString, centerX, centerY - 10);

    // Draw current date
    const dateString = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    this.ctx.fillStyle = colors.textSecondary;
    this.ctx.font = '12px -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
    this.ctx.fillText(dateString, centerX, centerY + 15);
  }

  drawTitle(size, colors) {
    this.ctx.fillStyle = colors.textPrimary;
    this.ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText('Circular Daily Planner', size / 2, 40);

    // Draw subtitle
    this.ctx.fillStyle = colors.textSecondary;
    this.ctx.font = '16px -apple-system, BlinkMacSystemFont, system-ui, sans-serif';
    this.ctx.fillText(`Generated on ${new Date().toLocaleDateString()}`, size / 2, 80);
  }

  formatHour(hour) {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  }
}

// Initialize canvas exporter when script loads
let canvasExporter;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for planner to be initialized
    const checkPlanner = () => {
      if (typeof planner !== 'undefined') {
        canvasExporter = new CanvasExporter(planner);
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
      canvasExporter = new CanvasExporter(planner);
    } else {
      setTimeout(checkPlanner, 100);
    }
  };
  checkPlanner();
}
