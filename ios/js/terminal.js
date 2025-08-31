/**
 * iOS Terminal App
 * Full-featured terminal with portfolio commands
 * CSP Compliant - Safe text rendering only
 */

class iOSTerminal {
    constructor() {
        this.history = [];
        this.historyIndex = -1;
        this.currentInput = '';
        this.outputLines = [];
        
        // Current directory simulation
        this.currentDir = '/Users/jesse';
        this.username = 'jesse';
        this.hostname = 'iPhone';
        
        // File system simulation
        this.filesystem = {
            '/Users/jesse': {
                type: 'directory',
                children: ['projects', 'resume.pdf', 'skills.txt', 'about.md']
            },
            '/Users/jesse/projects': {
                type: 'directory', 
                children: ['portfolio.git', 'fashion-palette', 'brainwave-simulator']
            },
            '/Users/jesse/resume.pdf': {
                type: 'file',
                content: 'PDF resume document - Use "resume" command to view'
            },
            '/Users/jesse/skills.txt': {
                type: 'file',
                content: 'Technical skills list - Use "skills" command to view'
            },
            '/Users/jesse/about.md': {
                type: 'file',
                content: 'Personal bio - Use "whoami" command to view'
            }
        };
        
        // Command registry with safe text rendering
        this.commands = {
            help: this.cmdHelp.bind(this),
            whoami: this.cmdWhoami.bind(this),
            projects: this.cmdProjects.bind(this),
            skills: this.cmdSkills.bind(this),
            resume: this.cmdResume.bind(this),
            contact: this.cmdContact.bind(this),
            clear: this.cmdClear.bind(this),
            ls: this.cmdLs.bind(this),
            pwd: this.cmdPwd.bind(this),
            cat: this.cmdCat.bind(this),
            git: this.cmdGit.bind(this),
            cd: this.cmdCd.bind(this),
            echo: this.cmdEcho.bind(this),
            date: this.cmdDate.bind(this),
            uptime: this.cmdUptime.bind(this),
            exit: this.cmdExit.bind(this),
            open: this.cmdOpen.bind(this)
        };
        
        this.init();
    }
    
    init() {
        // This will be called when the terminal app is launched
        this.setupTerminal();
    }
    
    setupTerminal() {
        this.addWelcomeMessage();
    }
    
    addWelcomeMessage() {
        const welcomeLines = [
            `Welcome to ${this.hostname} Terminal`,
            `Last login: ${new Date().toLocaleString()}`,
            '',
            'Jesse Rodriguez - Portfolio Terminal',
            'Type "help" for available commands.',
            ''
        ];
        
        welcomeLines.forEach(line => {
            this.addOutput(line, 'info');
        });
    }
    
    addOutput(text, type = 'result') {
        // Safe text rendering - no innerHTML
        this.outputLines.push({
            text: String(text),
            type: type,
            timestamp: Date.now()
        });
        
        // Limit output history to prevent memory issues
        if (this.outputLines.length > 1000) {
            this.outputLines = this.outputLines.slice(-500);
        }
    }
    
    processCommand(input) {
        const trimmedInput = String(input).trim();
        
        if (!trimmedInput) return;
        
        // Add to history
        this.history.push(trimmedInput);
        this.historyIndex = this.history.length;
        
        // Show command echo
        this.addOutput(`${this.getPrompt()}${trimmedInput}`, 'command');
        
        // Parse command and arguments
        const parts = trimmedInput.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Execute command
        if (this.commands[command]) {
            try {
                this.commands[command](args);
            } catch (error) {
                this.addOutput(`Error executing command: ${error.message}`, 'error');
            }
        } else {
            this.addOutput(`Command not found: ${command}. Type "help" for available commands.`, 'error');
        }
    }
    
    getPrompt() {
        const shortDir = this.currentDir.replace('/Users/jesse', '~');
        return `${this.username}@${this.hostname}:${shortDir}$ `;
    }
    
    // Command implementations
    cmdHelp() {
        const helpText = [
            'Available commands:',
            '',
            '  help      - Show this help message',
            '  whoami    - Display personal information',
            '  projects  - List portfolio projects',
            '  skills    - Show technical skills',
            '  resume    - View resume information',
            '  contact   - Display contact information',
            '  clear     - Clear terminal screen',
            '  ls        - List directory contents',
            '  pwd       - Print working directory',
            '  cat       - Display file contents',
            '  cd        - Change directory',
            '  git       - Git repository commands',
            '  echo      - Display text',
            '  date      - Show current date and time',
            '  uptime    - Show system uptime', 
            '  open      - Launch other iOS apps',
            '  exit      - Exit terminal',
            '',
            'Use arrow keys for command history, tab for hints.',
            ''
        ];
        
        helpText.forEach(line => this.addOutput(line, 'info'));
    }
    
    cmdWhoami() {
        const bio = [
            'Jesse Rodriguez',
            '',
            'AI, Design & Fashion Professional',
            '',
            'I move between AI, design, and fashion with one goal:',
            'to create work that feels timeless and useful.',
            '',
            'From building tools to designing visuals,',
            'my work connects culture with clarity.',
            '',
            'Specializing in:',
            '• Artificial Intelligence & Automation',
            '• Web Development & Design Systems', 
            '• Fashion Technology & Color Analysis',
            '• Security Implementation & Best Practices',
            '',
            'Location: Portfolio Universe',
            'Email: jesse@jesserodriguez.me',
            'Web: jesserodriguez.me',
            ''
        ];
        
        bio.forEach(line => this.addOutput(line, 'result'));
    }
    
    cmdProjects() {
        const projects = [
            'Portfolio Projects:',
            '',
            '📱 iOS Portfolio Interface',
            '   Native-style iPhone app with slide navigation',
            '   Technologies: HTML5, CSS3, JavaScript ES6+',
            '',
            '🧠 AI Brainwave Simulator', 
            '   Real-time neural activity visualization',
            '   Features: 4-frequency bands, live feedback',
            '',
            '🎨 Fashion Palette Generator',
            '   Privacy-first color extraction from images',
            '   Tech: Canvas API, color algorithms, no-storage',
            '',
            '💻 CLI Portfolio Terminal',
            '   Interactive command-line interface',
            '   Security: Strict CSP, safe DOM manipulation',
            '',
            '🔒 Security-First Architecture',
            '   Enterprise-grade static site security',
            '   Features: CSP, security headers, XSS protection',
            '',
            'Type "git log" to see recent development activity.',
            ''
        ];
        
        projects.forEach(line => this.addOutput(line, 'result'));
    }
    
    cmdSkills() {
        const skills = [
            'Technical Skills:',
            '',
            'Programming Languages:',
            '  JavaScript (ES6+)    ████████████████████ 95%',
            '  Python              ███████████████████░ 90%', 
            '  HTML5/CSS3          ████████████████████ 95%',
            '  SQL                 ██████████████░░░░░░ 75%',
            '',
            'Frameworks & Libraries:',
            '  React               ██████████████░░░░░░ 80%',
            '  Node.js             ███████████████░░░░░ 85%',
            '  Tailwind CSS        ████████████████████ 95%',
            '',
            'Tools & Technologies:',
            '  Git/GitHub          ████████████████████ 95%',
            '  Security (CSP/XSS)  ███████████████████░ 90%',
            '  Canvas API          ██████████████████░░ 85%',
            '  Color Algorithms    ███████████████░░░░░ 80%',
            '',
            'Design & Creative:',
            '  UI/UX Design        ███████████████████░ 90%',
            '  Fashion Color       ████████████████████ 95%',
            '  Typography          ██████████████████░░ 85%',
            '',
            'Current Focus: AI integration, security hardening, iOS design',
            ''
        ];
        
        skills.forEach(line => this.addOutput(line, 'result'));
    }
    
    cmdResume() {
        const resume = [
            'Resume Summary:',
            '',
            'Jesse Rodriguez',
            'AI, Design & Fashion Professional',
            '',
            'EXPERIENCE:',
            '',
            '• Portfolio Development (2024-Present)',
            '  Full-stack security-focused web applications',
            '  Technologies: JavaScript, Python, CSS3, Security',
            '',
            '• AI Tool Development',
            '  Neural visualization, color analysis algorithms',
            '  Privacy-first architecture, client-side processing',
            '',
            '• Fashion Technology',
            '  Color palette generation, style automation',
            '  Advanced color theory implementation',
            '',
            'KEY ACHIEVEMENTS:',
            '• 95% security score with enterprise-grade CSP',
            '• Zero-dependency client-side applications',
            '• Authentic iOS interface design implementation',
            '• Privacy-first data processing architectures',
            '',
            'EDUCATION & CERTIFICATIONS:',
            '• Computer Science & Design Fundamentals',
            '• Security Best Practices & Implementation',
            '• Color Theory & Fashion Technology',
            '',
            'Download full resume: /assets/resume.pdf',
            'Or type "resume download" to open PDF.',
            ''
        ];
        
        resume.forEach(line => this.addOutput(line, 'result'));
    }
    
    cmdContact() {
        const contact = [
            'Contact Information:',
            '',
            '📧 Email: jesse@jesserodriguez.me',
            '🌐 Portfolio: jesserodriguez.me',
            '📱 iOS App: jesserodriguez.me/ios/',
            '🧠 Brainwave: jesserodriguez.me/brainwave-simulator.html',
            '🎨 Palette: jesserodriguez.me/fashion-palette/',
            '',
            'Available for:',
            '• Full-stack development projects',
            '• AI/ML tool development',
            '• Security consulting & implementation',
            '• Fashion technology collaborations',
            '• Design system architecture',
            '',
            'Response time: Usually within 24 hours',
            'Preferred contact: Email',
            ''
        ];
        
        contact.forEach(line => this.addOutput(line, 'result'));
    }
    
    cmdClear() {
        this.outputLines = [];
        this.addWelcomeMessage();
    }
    
    cmdLs(args) {
        const showHidden = args.includes('-a') || args.includes('-la');
        const longFormat = args.includes('-l') || args.includes('-la');
        
        const currentPath = this.currentDir;
        const dirInfo = this.filesystem[currentPath];
        
        if (!dirInfo || dirInfo.type !== 'directory') {
            this.addOutput('ls: cannot access directory', 'error');
            return;
        }
        
        if (longFormat) {
            this.addOutput('total 8', 'result');
        }
        
        dirInfo.children.forEach(item => {
            const itemPath = `${currentPath}/${item}`;
            const itemInfo = this.filesystem[itemPath];
            
            if (longFormat) {
                const permissions = itemInfo && itemInfo.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--';
                const size = itemInfo && itemInfo.type === 'file' ? '1024' : '4096';
                const date = 'Aug 31 12:00';
                this.addOutput(`${permissions}  1 jesse  staff  ${size.padStart(8)} ${date} ${item}`, 'result');
            } else {
                this.addOutput(item, 'result');
            }
        });
        
        if (!longFormat && dirInfo.children.length === 0) {
            this.addOutput('', 'result');
        }
    }
    
    cmdPwd() {
        this.addOutput(this.currentDir, 'result');
    }
    
    cmdCat(args) {
        if (args.length === 0) {
            this.addOutput('cat: missing file operand', 'error');
            return;
        }
        
        const filename = args[0];
        const filepath = filename.startsWith('/') ? filename : `${this.currentDir}/${filename}`;
        const fileInfo = this.filesystem[filepath];
        
        if (!fileInfo) {
            this.addOutput(`cat: ${filename}: No such file or directory`, 'error');
            return;
        }
        
        if (fileInfo.type === 'directory') {
            this.addOutput(`cat: ${filename}: Is a directory`, 'error');
            return;
        }
        
        if (fileInfo.content) {
            this.addOutput(fileInfo.content, 'result');
        } else {
            this.addOutput(`cat: ${filename}: Permission denied`, 'error');
        }
    }
    
    cmdGit(args) {
        if (args.length === 0 || args[0] === 'help') {
            const gitHelp = [
                'git commands:',
                '  git log     - Show recent commits',
                '  git status  - Show repository status',
                '  git branch  - Show current branch',
                ''
            ];
            gitHelp.forEach(line => this.addOutput(line, 'info'));
            return;
        }
        
        switch (args[0]) {
            case 'log':
                this.gitLog();
                break;
            case 'status':
                this.gitStatus();
                break;
            case 'branch':
                this.gitBranch();
                break;
            default:
                this.addOutput(`git: '${args[0]}' is not a git command. See 'git help'.`, 'error');
        }
    }
    
    gitLog() {
        const commits = [
            'commit 94ff36c (HEAD -> feature/iphone-portfolio)',
            'Author: Jesse Rodriguez <jesse@jesserodriguez.me>',
            'Date:   Sat Aug 31 04:01:00 2024 -0700',
            '',
            '    feat(ios): app navigation with slide transitions',
            '',
            'commit bff9345',
            'Author: Jesse Rodriguez <jesse@jesserodriguez.me>',
            'Date:   Sat Aug 31 03:55:00 2024 -0700',
            '',
            '    feat(ios): iPhone screen shell with app grid',
            '',
            'commit 9d75d49',
            'Author: Jesse Rodriguez <jesse@jesserodriguez.me>',
            'Date:   Sat Aug 31 03:55:00 2024 -0700',
            '',
            '    chore: branch + desktop snapshot + ios structure',
            '',
            'commit 578dea4 (origin/main, main)',
            'Author: Jesse Rodriguez <jesse@jesserodriguez.me>',
            'Date:   Sat Aug 31 03:52:00 2024 -0700',
            '',
            '    fix: replace \'finance\' with \'fashion\' throughout codebase',
            ''
        ];
        
        commits.forEach(line => this.addOutput(line, 'result'));
    }
    
    gitStatus() {
        const status = [
            'On branch feature/iphone-portfolio',
            'Your branch is ahead of \'origin/main\' by 3 commits.',
            '  (use "git push" to publish your local commits)',
            '',
            'Changes to be committed:',
            '  (use "git reset HEAD <file>..." to unstage)',
            '',
            '        new file:   ios/js/terminal.js',
            '        new file:   ios/css/terminal.css',
            '',
            'nothing else to commit, working tree clean',
            ''
        ];
        
        status.forEach(line => this.addOutput(line, 'success'));
    }
    
    gitBranch() {
        const branches = [
            '  main',
            '* feature/iphone-portfolio',
            ''
        ];
        
        branches.forEach(line => this.addOutput(line, 'success'));
    }
    
    cmdCd(args) {
        if (args.length === 0) {
            this.currentDir = '/Users/jesse';
            return;
        }
        
        let targetDir = args[0];
        
        if (targetDir === '..') {
            const parts = this.currentDir.split('/');
            if (parts.length > 2) {
                this.currentDir = parts.slice(0, -1).join('/');
            }
            return;
        }
        
        if (targetDir === '~') {
            this.currentDir = '/Users/jesse';
            return;
        }
        
        if (!targetDir.startsWith('/')) {
            targetDir = `${this.currentDir}/${targetDir}`;
        }
        
        const dirInfo = this.filesystem[targetDir];
        if (!dirInfo) {
            this.addOutput(`cd: ${args[0]}: No such file or directory`, 'error');
            return;
        }
        
        if (dirInfo.type !== 'directory') {
            this.addOutput(`cd: ${args[0]}: Not a directory`, 'error');
            return;
        }
        
        this.currentDir = targetDir;
    }
    
    cmdEcho(args) {
        this.addOutput(args.join(' '), 'result');
    }
    
    cmdDate() {
        this.addOutput(new Date().toString(), 'result');
    }
    
    cmdUptime() {
        const uptime = Math.floor(performance.now() / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        
        this.addOutput(`up ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, 'result');
    }
    
    cmdExit() {
        this.addOutput('Goodbye! Returning to home screen...', 'success');
        // This will be handled by the navigation system
        if (window.iosNavigation) {
            setTimeout(() => {
                window.iosNavigation.goHome();
            }, 1000);
        }
    }
    
    cmdOpen(args) {
        if (args.length === 0) {
            this.addOutput('Usage: open <app-name>', 'error');
            this.addOutput('Available apps: resume, brainwave, fashion, palettes, contact', 'info');
            return;
        }
        
        const appName = args[0].toLowerCase();
        const appMap = {
            'resume': 'resume',
            'brainwave': 'brainwave', 
            'fashion': 'fashion',
            'palette': 'palettes',
            'palettes': 'palettes',
            'contact': 'contact',
            'ai': 'ai-tools',
            'websites': 'websites',
            'design': 'design',
            'utilities': 'utilities',
            'analytics': 'analytics'
        };
        
        const targetApp = appMap[appName];
        if (!targetApp) {
            this.addOutput(`App '${appName}' not found. Use 'open' without arguments to see available apps.`, 'error');
            return;
        }
        
        this.addOutput(`Opening ${appName} app...`, 'success');
        
        // Integration with navigation system
        if (window.iosNavigation) {
            setTimeout(() => {
                window.iosNavigation.goBack(); // Go back to home first
                setTimeout(() => {
                    window.iosNavigation.launchApp(targetApp);
                }, 300);
            }, 500);
        }
    }
    
    getCommandSuggestions(partial) {
        return Object.keys(this.commands).filter(cmd => 
            cmd.startsWith(partial.toLowerCase())
        );
    }
    
    navigateHistory(direction) {
        if (this.history.length === 0) return '';
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.history.length) {
            this.historyIndex = this.history.length;
            return '';
        }
        
        return this.history[this.historyIndex] || '';
    }
}

// Export for use in navigation system
window.iOSTerminal = iOSTerminal;
