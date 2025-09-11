/**
 * Main JavaScript module for portfolio interactions
 * Handles scroll animations, custom cursor, and micro-interactions
 */

import { ThreeBackground, GeometricBackground } from './three-utils.js';

class PortfolioApp {
  constructor() {
    this.customCursor = null;
    this.scrollProgress = null;
    this.threeBackground = null;
    this.intersectionObserver = null;
    
    this.init();
  }

  init() {
    this.createCustomCursor();
    this.createScrollProgress();
    this.setupIntersectionObserver();
    this.setupThreeBackground();
    this.setupEventListeners();
    this.animate();
  }

  createCustomCursor() {
    this.customCursor = document.createElement('div');
    this.customCursor.className = 'custom-cursor';
    document.body.appendChild(this.customCursor);
  }

  createScrollProgress() {
    this.scrollProgress = document.createElement('div');
    this.scrollProgress.className = 'scroll-progress';
    document.body.appendChild(this.scrollProgress);
  }

  setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with fade-in-up class
    document.querySelectorAll('.fade-in-up').forEach(el => {
      this.intersectionObserver.observe(el);
    });
  }

  setupThreeBackground() {
    const backgroundContainer = document.querySelector('.three-background');
    if (backgroundContainer) {
      this.threeBackground = new ThreeBackground(backgroundContainer, {
        particleCount: 500,
        particleSize: 2,
        color: '#ff3',
        backgroundColor: 'transparent'
      });
    }
  }

  setupEventListeners() {
    // Custom cursor movement
    document.addEventListener('mousemove', (e) => {
      if (this.customCursor) {
        this.customCursor.style.left = e.clientX + 'px';
        this.customCursor.style.top = e.clientY + 'px';
      }
    });

    // Custom cursor hover effects
    document.querySelectorAll('a, button, .card, .btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (this.customCursor) {
          this.customCursor.classList.add('hover');
        }
      });
      
      el.addEventListener('mouseleave', () => {
        if (this.customCursor) {
          this.customCursor.classList.remove('hover');
        }
      });
    });

    // Scroll progress
    window.addEventListener('scroll', () => {
      this.updateScrollProgress();
    });

    // Terminal interactions
    this.setupTerminalInteractions();

    // Mobile touch events
    this.setupMobileEvents();
  }

  setupTerminalInteractions() {
    const terminal = document.querySelector('.cli-terminal');
    if (!terminal) return;

    const input = terminal.querySelector('.cli-input');
    const output = terminal.querySelector('.cli-output');
    
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.processTerminalCommand(input.value, output);
          input.value = '';
        }
      });
    }
  }

  processTerminalCommand(command, output) {
    const commandLine = document.createElement('div');
    commandLine.className = 'cli-output-line command-echo';
    commandLine.textContent = `jesse@portfolio:~$ ${command}`;
    output.appendChild(commandLine);

    // Process command
    const response = this.getCommandResponse(command);
    const responseLine = document.createElement('div');
    responseLine.className = 'cli-output-line';
    responseLine.innerHTML = response;
    output.appendChild(responseLine);

    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
  }

  getCommandResponse(command) {
    const commands = {
      'help': 'Available commands: help, about, projects, resume, contact, clear',
      'about': 'Jesse Rodriguez - Ideas, Technology, Design. I move between AI, design, and fashion.',
      'projects': 'View my portfolio at /sandbox-portfolio/',
      'resume': 'Download resume: <a href="/assets/resume.pdf" target="_blank">resume.pdf</a>',
      'contact': 'Email: jesse@jesserodriguez.me',
      'clear': () => {
        const output = document.querySelector('.cli-output');
        if (output) output.innerHTML = '';
        return 'Terminal cleared.';
      }
    };

    const response = commands[command.toLowerCase()];
    return typeof response === 'function' ? response() : response || 'Command not found. Type "help" for available commands.';
  }

  setupMobileEvents() {
    // Disable custom cursor on mobile
    if (window.innerWidth <= 768) {
      if (this.customCursor) {
        this.customCursor.style.display = 'none';
      }
    }

    // Touch events for mobile interactions
    document.addEventListener('touchstart', (e) => {
      if (e.target.closest('.card, .btn')) {
        e.target.closest('.card, .btn').classList.add('active');
      }
    });

    document.addEventListener('touchend', (e) => {
      if (e.target.closest('.card, .btn')) {
        e.target.closest('.card, .btn').classList.remove('active');
      }
    });
  }

  updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    if (this.scrollProgress) {
      this.scrollProgress.style.width = scrollPercent + '%';
    }
  }

  animate() {
    // Add floating animation to elements
    document.querySelectorAll('.float').forEach((el, index) => {
      el.style.animationDelay = (index * 0.2) + 's';
    });

    // Add glow effects to interactive elements
    document.querySelectorAll('.glow-effect').forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.classList.add('animate-glow');
      });
      
      el.addEventListener('mouseleave', () => {
        el.classList.remove('animate-glow');
      });
    });
  }

  destroy() {
    if (this.threeBackground) {
      this.threeBackground.destroy();
    }
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    if (this.customCursor) {
      this.customCursor.remove();
    }
    
    if (this.scrollProgress) {
      this.scrollProgress.remove();
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Export for module usage
export default PortfolioApp;
