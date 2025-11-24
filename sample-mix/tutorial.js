/**
 * Interactive Tutorial System
 */

class TutorialSystem {
  constructor(app) {
    this.app = app;
    this.currentStep = 0;
    this.steps = [
      {
        title: 'Welcome to Sample Mix!',
        content: 'This is a powerful audio chopper and MIDI pad player. Let\'s get started!',
        target: null,
        position: 'center'
      },
      {
        title: 'Upload Audio',
        content: 'Click or drag and drop an audio file here to get started. Supports MP3, WAV, OGG, and M4A.',
        target: '#uploadArea',
        position: 'bottom'
      },
      {
        title: 'Auto Chop',
        content: 'After uploading, click "Auto Chop" to automatically detect beats and create slices.',
        target: '#autoChopBtn',
        position: 'bottom'
      },
      {
        title: 'Waveform Editing',
        content: 'Click on the waveform to add slice markers. Drag markers to move them. Double-click to remove.',
        target: '#waveformCanvas',
        position: 'top'
      },
      {
        title: 'MIDI Pads',
        content: 'Slices are automatically assigned to pads. Click pads or use keyboard shortcuts (Q-P, A-L, Z-M, 1-0) to trigger them.',
        target: '#padsGrid',
        position: 'top'
      },
      {
        title: 'Pad Settings',
        content: 'Right-click any pad to open settings. Adjust volume, pitch, effects, and more!',
        target: '.pad',
        position: 'right'
      },
      {
        title: 'Keyboard Shortcuts',
        content: 'Press ? to see all keyboard shortcuts. Use Ctrl+Z/Y for undo/redo.',
        target: '#helpBtn',
        position: 'left'
      },
      {
        title: 'Export & Save',
        content: 'Save your project, export slices, or export the entire mixdown using the buttons at the bottom.',
        target: '#projectActions',
        position: 'top'
      }
    ];
  }

  start() {
    if (!this.shouldShowTutorial()) return;
    
    this.currentStep = 0;
    this.showStep(0);
  }

  shouldShowTutorial() {
    const settings = this.app?.settings || {};
    return settings.showTutorial !== false;
  }

  showStep(index) {
    if (index >= this.steps.length) {
      this.complete();
      return;
    }

    const step = this.steps[index];
    this.currentStep = index;

    // Remove existing tutorial overlay
    this.removeTutorial();

    // Create tutorial overlay
    const overlay = document.createElement('div');
    overlay.className = 'tutorial-overlay';
    overlay.id = 'tutorialOverlay';

    const card = document.createElement('div');
    card.className = 'tutorial-card';

    const title = document.createElement('h3');
    title.textContent = step.title;
    card.appendChild(title);

    const content = document.createElement('p');
    content.textContent = step.content;
    card.appendChild(content);

    const buttons = document.createElement('div');
    buttons.className = 'tutorial-buttons';

    if (index > 0) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'btn btn-secondary';
      prevBtn.textContent = 'Previous';
      prevBtn.onclick = () => this.showStep(index - 1);
      buttons.appendChild(prevBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-primary';
    nextBtn.textContent = index === this.steps.length - 1 ? 'Finish' : 'Next';
    nextBtn.onclick = () => this.showStep(index + 1);
    buttons.appendChild(nextBtn);

    const skipBtn = document.createElement('button');
    skipBtn.className = 'btn btn-secondary';
    skipBtn.textContent = 'Skip Tutorial';
    skipBtn.onclick = () => this.complete();
    buttons.appendChild(skipBtn);

    card.appendChild(buttons);
    overlay.appendChild(card);

    document.body.appendChild(overlay);

    // Position card relative to target
    if (step.target) {
      const target = document.querySelector(step.target);
      if (target) {
        const rect = target.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        
        let top = rect.top + rect.height + 20;
        let left = rect.left + rect.width / 2 - cardRect.width / 2;
        
        if (step.position === 'top') {
          top = rect.top - cardRect.height - 20;
        } else if (step.position === 'left') {
          left = rect.left - cardRect.width - 20;
          top = rect.top + rect.height / 2 - cardRect.height / 2;
        } else if (step.position === 'right') {
          left = rect.right + 20;
          top = rect.top + rect.height / 2 - cardRect.height / 2;
        }
        
        card.style.position = 'absolute';
        card.style.top = Math.max(20, top) + 'px';
        card.style.left = Math.max(20, Math.min(left, window.innerWidth - cardRect.width - 20)) + 'px';
        
        // Highlight target
        target.style.outline = '3px solid var(--apple-blue)';
        target.style.outlineOffset = '3px';
        target.classList.add('tutorial-target');
      }
    }

    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'tutorial-backdrop';
    overlay.appendChild(backdrop);
  }

  removeTutorial() {
    const overlay = document.getElementById('tutorialOverlay');
    if (overlay) {
      overlay.remove();
    }
    
    // Remove highlights
    document.querySelectorAll('.tutorial-target').forEach(el => {
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.classList.remove('tutorial-target');
    });
  }

  complete() {
    this.removeTutorial();
    if (this.app) {
      this.app.settings.showTutorial = false;
      this.app.saveSettings();
    }
  }
}





