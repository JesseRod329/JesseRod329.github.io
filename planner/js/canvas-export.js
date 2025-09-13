/**
 * Canvas Export System
 * Handles exporting the planner to various image formats.
 * Listens for a custom 'exportPlanner' event.
 */

class CanvasExport {
  constructor() {
    this.exportCanvas = document.getElementById('export-canvas');
    if (!this.exportCanvas) {
      console.error('Export canvas not found!');
      return;
    }
    this.ctx = this.exportCanvas.getContext('2d');
    this.init();
  }

  init() {
    document.addEventListener('exportPlanner', (event) => {
      this.handleExport(event.detail);
    });
  }

  async handleExport(data) {
    if (!data) {
      console.error('No data provided for export.');
      return;
    }

    // For simplicity, we'll just export a PNG.
    // In a real app, you might have a modal to choose format, size, etc.
    this.generatePng(data);
  }

  async generatePng(data) {
    const { tasks, personalInfo } = data;
    const width = 1080;
    const height = 1920; // Portrait for phone wallpaper

    this.exportCanvas.width = width;
    this.exportCanvas.height = height;

    // Create a gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Draw title
    this.ctx.fillStyle = '#ffffff';
    this.ctx.textAlign = 'center';
    this.ctx.font = 'bold 60px Arial';
    this.ctx.fillText('Your Daily Planner', width / 2, 150);

    // Draw date
    const date = personalInfo.date ? new Date(personalInfo.date) : new Date();
    const dateString = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    this.ctx.font = '30px Arial';
    this.ctx.fillText(dateString, width / 2, 220);

    // Draw tasks
    this.ctx.font = '28px Arial';
    this.ctx.textAlign = 'left';
    let yPos = 350;

    tasks.forEach(task => {
      if (yPos < height - 100) {
        const time = task.time ? `[${task.time}] ` : '';
        const description = this.escapeHtml(task.description);
        this.ctx.fillText(`${time}${description}`, 100, yPos);
        yPos += 50;
      }
    });

    // Trigger download
    const dataUrl = this.exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'planner.png';
    link.click();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

new CanvasExport();
