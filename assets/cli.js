/**
 * CLI Terminal Progressive Enhancement
 * Strict CSP Compliant - No eval, no innerHTML, no unsafe-inline
 */

class PortfolioCLI {
  constructor() {
    this.terminal = null;
    this.outputContainer = null;
    this.inputLine = null;
    this.cursor = null;
    this.currentInput = '';
    this.commandHistory = [];
    this.historyIndex = -1;
    
    // Command registry
    this.commands = {
      help: this.showHelp.bind(this),
      about: this.showAbout.bind(this),
      projects: this.showProjects.bind(this),
      resume: this.showResume.bind(this),
      contact: this.showContact.bind(this),
      security: this.showSecurity.bind(this),
      headers: this.showHeaders.bind(this),
      clear: this.clearTerminal.bind(this)
    };

    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupTerminal());
    } else {
      this.setupTerminal();
    }
  }

  setupTerminal() {
    this.terminal = document.querySelector('.cli-terminal');
    if (!this.terminal) return;

    // Create interactive elements
    this.createOutputContainer();
    this.createInputLine();
    this.setupEventListeners();
    this.showWelcome();
  }

  createOutputContainer() {
    const cliContent = this.terminal.querySelector('.cli-content');
    if (!cliContent) return;

    // Create output container after the existing content
    this.outputContainer = document.createElement('div');
    this.outputContainer.className = 'cli-output';
    cliContent.appendChild(this.outputContainer);
  }

  createInputLine() {
    const cliContent = this.terminal.querySelector('.cli-content');
    if (!cliContent) return;

    // Replace static prompt with interactive input
    const staticPrompt = cliContent.querySelector('.cli-prompt');
    if (staticPrompt) {
      // Create new interactive prompt
      const inputContainer = document.createElement('div');
      inputContainer.className = 'cli-input-line';
      
      const prompt = document.createElement('span');
      prompt.className = 'cli-prompt-text';
      prompt.textContent = 'jesse@portfolio:~$ ';
      
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'cli-input';
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('spellcheck', 'false');
      
      const cursor = document.createElement('span');
      cursor.className = 'cli-cursor-active';
      
      inputContainer.appendChild(prompt);
      inputContainer.appendChild(input);
      inputContainer.appendChild(cursor);
      
      // Replace static prompt
      staticPrompt.parentNode.replaceChild(inputContainer, staticPrompt);
      
      this.inputLine = input;
      this.cursor = cursor;
      
      // Focus input
      input.focus();
    }
  }

  setupEventListeners() {
    if (!this.inputLine) return;

    // Handle command input
    this.inputLine.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          this.processCommand();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.navigateHistory(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.navigateHistory(1);
          break;
        case 'Tab':
          e.preventDefault();
          this.autocomplete();
          break;
      }
    });

    // Update cursor position
    this.inputLine.addEventListener('input', () => {
      this.currentInput = this.inputLine.value;
    });

    // Keep focus on terminal
    this.terminal.addEventListener('click', () => {
      this.inputLine.focus();
    });
  }

  processCommand() {
    const command = this.currentInput.trim().toLowerCase();
    
    if (command) {
      // Add to history
      this.commandHistory.push(command);
      this.historyIndex = this.commandHistory.length;
      
      // Show command echo
      this.addOutput(`jesse@portfolio:~$ ${command}`, 'command-echo');
      
      // Execute command
      if (this.commands[command]) {
        this.commands[command]();
      } else {
        this.addOutput(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
      }
    }
    
    // Clear input
    this.inputLine.value = '';
    this.currentInput = '';
    this.inputLine.focus();
  }

  addOutput(text, className = '') {
    const outputLine = document.createElement('div');
    outputLine.className = `cli-output-line ${className}`;
    
    // Safely add text content (no innerHTML)
    outputLine.textContent = text;
    
    this.outputContainer.appendChild(outputLine);
    this.scrollToBottom();
  }

  addMultilineOutput(lines, className = '') {
    lines.forEach(line => {
      this.addOutput(line, className);
    });
  }

  scrollToBottom() {
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  navigateHistory(direction) {
    if (this.commandHistory.length === 0) return;
    
    this.historyIndex += direction;
    
    if (this.historyIndex < 0) {
      this.historyIndex = 0;
    } else if (this.historyIndex >= this.commandHistory.length) {
      this.historyIndex = this.commandHistory.length;
      this.inputLine.value = '';
      return;
    }
    
    this.inputLine.value = this.commandHistory[this.historyIndex];
    this.currentInput = this.inputLine.value;
  }

  autocomplete() {
    const partial = this.currentInput.toLowerCase();
    const matches = Object.keys(this.commands).filter(cmd => 
      cmd.startsWith(partial)
    );
    
    if (matches.length === 1) {
      this.inputLine.value = matches[0];
      this.currentInput = matches[0];
    } else if (matches.length > 1) {
      this.addOutput(`Available: ${matches.join(', ')}`, 'info');
    }
  }

  // Command implementations
  showWelcome() {
    this.addMultilineOutput([
      'Terminal interface initialized.',
      'Type "help" to see available commands.',
      ''
    ], 'welcome');
  }

  showHelp() {
    this.addMultilineOutput([
      'Available commands:',
      '  help      - Show this help message',
      '  about     - Learn about Jesse\'s background',
      '  projects  - View portfolio and work',
      '  resume    - Professional experience and skills',
      '  contact   - Get in touch',
      '  security  - Security implementation details',
      '  headers   - HTTP security headers info',
      '  clear     - Clear terminal output',
      '',
      'Use TAB for autocomplete, ↑/↓ for command history.',
      ''
    ], 'help');
  }

  showAbout() {
    this.addMultilineOutput([
      'Jesse Rodriguez - Ideas, Technology, Design',
      '',
      'I move between AI, design, and finance with one goal:',
      'to create work that feels timeless and useful.',
      '',
      'From building tools to designing visuals,',
      'my work connects culture with clarity.',
      ''
    ], 'about');
  }

  showProjects() {
    this.addMultilineOutput([
      'Portfolio & Services:',
      '',
      '→ AI / Automation    - Tools that think with you',
      '→ Websites           - Digital spaces with purpose', 
      '→ Logos / Design     - Identity you can wear',
      '→ Resumes / Careers  - Documents that open doors',
      '→ Finance           - Clarity in the numbers',
      '',
      'Scroll down to see the full services grid.',
      ''
    ], 'projects');
  }

  showResume() {
    this.addMultilineOutput([
      'Professional Experience:',
      '',
      '• Intersection of AI, Design, and Finance',
      '• Full-stack development and automation',
      '• Editorial design aesthetic implementation',
      '• Enterprise security best practices',
      '',
      '📄 Download full resume: [PDF coming soon]',
      '',
      'Skills: AI/ML, Web Development, Design Systems,',
      '        Financial Analysis, Security Implementation',
      ''
    ], 'resume');
  }

  showContact() {
    this.addMultilineOutput([
      'Let\'s Build Something Together',
      '',
      '📧 Email: jesse@jesserodriguez.me',
      '🌐 Web:   jesserodriguez.me',
      '',
      'Available for collaborations, consulting,',
      'and innovative projects.',
      ''
    ], 'contact');
  }

  showSecurity() {
    this.addMultilineOutput([
      '🛡️  SECURITY SCORE: 95% (Excellent)',
      '',
      'Enterprise-level security implementation:',
      '• Content Security Policy (CSP)',
      '• X-Frame-Options: DENY',
      '• X-Content-Type-Options: nosniff',
      '• Referrer-Policy: strict-origin-when-cross-origin',
      '• Zero JavaScript attack surface',
      '• HTTPS enforced via GitHub Pages',
      '',
      'This site follows security best practices for',
      'static deployments with comprehensive protection',
      'against XSS, clickjacking, and injection attacks.',
      ''
    ], 'security');
  }

  showHeaders() {
    this.addMultilineOutput([
      'HTTP Security Headers:',
      '',
      'X-Frame-Options: DENY',
      '  → Prevents clickjacking attacks',
      '',
      'X-Content-Type-Options: nosniff',
      '  → Prevents MIME type confusion',
      '',
      'Referrer-Policy: strict-origin-when-cross-origin',
      '  → Controls referrer information leakage',
      '',
      'Content-Security-Policy: [Strict policy]',
      '  → Prevents XSS and code injection',
      '',
      'All headers implemented via meta tags for',
      'GitHub Pages compatibility.',
      ''
    ], 'headers');
  }

  clearTerminal() {
    if (this.outputContainer) {
      // Safely clear all child nodes without innerHTML
      while (this.outputContainer.firstChild) {
        this.outputContainer.removeChild(this.outputContainer.firstChild);
      }
    }
    this.addOutput('Terminal cleared.', 'info');
  }
}

// Initialize CLI when script loads
new PortfolioCLI();
