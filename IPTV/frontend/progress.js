/** Progress indicator manager */
class ProgressManager {
    constructor() {
        this.indicator = document.getElementById('progress-indicator');
        this.progressFill = null;
        this.progressText = null;
        this.init();
    }
    
    init() {
        if (this.indicator) {
            this.progressFill = this.indicator.querySelector('.progress-fill');
            this.progressText = this.indicator.querySelector('.progress-text');
        }
    }
    
    show(message = 'Loading...', progress = 0) {
        if (!this.indicator) return;
        
        if (this.progressText) {
            this.progressText.textContent = message;
        }
        if (this.progressFill) {
            this.progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
        this.indicator.style.display = 'block';
    }
    
    update(progress, message) {
        if (!this.indicator) return;
        
        if (message && this.progressText) {
            this.progressText.textContent = message;
        }
        if (this.progressFill) {
            this.progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
    }
    
    hide() {
        if (this.indicator) {
            this.indicator.style.display = 'none';
            if (this.progressFill) {
                this.progressFill.style.width = '0%';
            }
        }
    }
}

// Initialize progress manager
let progressManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        progressManager = new ProgressManager();
        window.progressManager = progressManager;
    });
} else {
    progressManager = new ProgressManager();
    window.progressManager = progressManager;
}



