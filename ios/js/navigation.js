/**
 * iOS Navigation and App Management
 * CSP Compliant - No eval, no unsafe-inline, no external dependencies
 * Progressive enhancement with graceful fallback
 */

class iOSNavigation {
    constructor() {
        this.currentApp = null;
        this.navigationStack = [];
        this.isTransitioning = false;
        this.loadedModules = new Set();
        this.loadingModules = new Map();
        
        // App configurations
        this.apps = {
            'ai-tools': {
                title: 'AI Tools',
                icon: '🤖',
                color: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
            },
            'websites': {
                title: 'Websites',
                icon: '🌐',
                color: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
            },
            'fashion': {
                title: 'Fashion',
                icon: '👗',
                color: 'linear-gradient(135deg, #E91E63 0%, #AD1457 100%)'
            },
            'design': {
                title: 'Design',
                icon: '🎨',
                color: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)'
            },
            'resume': {
                title: 'Resume',
                icon: '📄',
                color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)'
            },
            'utilities': {
                title: 'Utilities',
                icon: '⚙️',
                color: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)'
            },
            'brainwave': {
                title: 'BrainWave',
                icon: '🧠',
                color: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)'
            },
            'palettes': {
                title: 'Palettes',
                icon: '🎭',
                color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)'
            },
            'planner': {
                title: 'Planner',
                icon: '📅',
                color: 'linear-gradient(135deg, #0d6efd 0%, #9775fa 100%)'
            },
            'analytics': {
                title: 'Analytics',
                icon: '📊',
                color: 'linear-gradient(135deg, #795548 0%, #5D4037 100%)'
            },
            'security': {
                title: 'Security',
                icon: '🔒',
                color: 'linear-gradient(135deg, #FF5722 0%, #D32F2F 100%)'
            },
            'accessibility': {
                title: 'Accessibility',
                icon: '♿',
                color: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
            },
            'home': {
                title: 'Home',
                icon: '🏠',
                color: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)'
            },
            'terminal': {
                title: 'Terminal',
                icon: '💻',
                color: 'linear-gradient(135deg, #000000 0%, #333333 100%)'
            },
            'contact': {
                title: 'Contact',
                icon: '📧',
                color: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)'
            },
            'social': {
                title: 'Social',
                icon: '🔗',
                color: 'linear-gradient(135deg, #FF3B30 0%, #FF2D92 100%)'
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('iOSNavigation: Initializing...');
        console.log('Document ready state:', document.readyState);
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            console.log('DOM still loading, waiting for DOMContentLoaded');
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOMContentLoaded fired, setting up navigation');
                this.setupNavigation();
            });
        } else {
            console.log('DOM already ready, setting up navigation immediately');
            this.setupNavigation();
        }
    }
    
    setupNavigation() {
        console.log('iOSNavigation: Setting up navigation...');
        this.createAppContainer();
        this.setupEventListeners();
        this.createAppViews();
        console.log('iOSNavigation: Setup complete');
    }
    
    createAppContainer() {
        // Create app view container
        const device = document.querySelector('.ios-device');
        console.log('iOSNavigation: Looking for .ios-device element:', device);
        if (!device) {
            console.error('iOSNavigation: .ios-device element not found!');
            return;
        }
        
        const appContainer = document.createElement('div');
        appContainer.className = 'ios-app-container';
        appContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--bg-color);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 200;
            overflow: hidden;
        `;
        
        device.appendChild(appContainer);
        this.appContainer = appContainer;
        console.log('iOSNavigation: App container created and added to device');
    }
    
    setupEventListeners() {
        // App tap handlers
        this.setupAppTapHandlers();
        
        // Home indicator gesture
        this.setupHomeGesture();
        
        // Note: Removed global preventDefault to allow scrolling within app views
    }
    
    setupAppTapHandlers() {
        // Grid apps
        const gridApps = document.querySelectorAll('.ios-app');
        console.log('Setting up app handlers for', gridApps.length, 'grid apps');
        
        gridApps.forEach(app => {
            const appClass = Array.from(app.classList).find(cls => cls !== 'ios-app');
            console.log('Processing app:', appClass, 'Config exists:', !!this.apps[appClass]);
            
            if (appClass && this.apps[appClass]) {
                // Ensure the app is clickable
                app.style.cursor = 'pointer';
                app.style.userSelect = 'none';
                app.style.webkitUserSelect = 'none';
                
                app.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('App clicked:', appClass);
                    this.launchApp(appClass);
                });
                
                // Simple touch handling for mobile
                app.addEventListener('touchstart', (e) => {
                    console.log('Touch start:', appClass);
                    this.addTouchFeedback(app);
                });
                
                app.addEventListener('touchend', (e) => {
                    console.log('Touch end:', appClass);
                    this.removeTouchFeedback(app);
                    // Launch app immediately on touch end
                    console.log('Launching app from touch:', appClass);
                    this.launchApp(appClass);
                });
                
                // Add mouse events for desktop
                app.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.addTouchFeedback(app);
                });
                
                app.addEventListener('mouseup', (e) => {
                    e.preventDefault();
                    this.removeTouchFeedback(app);
                });
                
                app.addEventListener('mouseleave', (e) => {
                    this.removeTouchFeedback(app);
                });
                
                console.log('Added handlers for app:', appClass);
            }
        });

        // If planner tile is missing on the screen markup, add it at the end
        const grid = document.querySelector('.ios-app-grid');
        if (grid && !grid.querySelector('.ios-app.planner')) {
            const plannerTile = document.createElement('div');
            plannerTile.className = 'ios-app planner';
            const icon = document.createElement('div');
            icon.className = 'ios-app-icon';
            icon.textContent = this.apps['planner'].icon;
            const label = document.createElement('div');
            label.className = 'ios-app-label';
            label.textContent = this.apps['planner'].title;
            plannerTile.appendChild(icon);
            plannerTile.appendChild(label);
            grid.appendChild(plannerTile);

            // Wire handlers for the new tile
            plannerTile.style.cursor = 'pointer';
            plannerTile.addEventListener('click', () => {
                window.location.href = '/planner/index.html';
            });
        }
        
        // Dock apps
        const dockApps = document.querySelectorAll('.ios-dock-app');
        console.log('Setting up dock handlers for', dockApps.length, 'dock apps');
        
        dockApps.forEach(app => {
            const appClass = Array.from(app.classList).find(cls => cls !== 'ios-dock-app');
            console.log('Processing dock app:', appClass, 'Config exists:', !!this.apps[appClass]);
            
            if (appClass && this.apps[appClass]) {
                // Ensure the dock app is clickable
                app.style.cursor = 'pointer';
                app.style.userSelect = 'none';
                app.style.webkitUserSelect = 'none';
                
                app.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Dock app clicked:', appClass);
                    this.launchApp(appClass);
                });
                
                // Simple touch handling for mobile
                app.addEventListener('touchstart', (e) => {
                    console.log('Dock touch start:', appClass);
                    this.addTouchFeedback(app);
                });
                
                app.addEventListener('touchend', (e) => {
                    console.log('Dock touch end:', appClass);
                    this.removeTouchFeedback(app);
                    // Launch app immediately on touch end
                    console.log('Launching dock app from touch:', appClass);
                    this.launchApp(appClass);
                });
                
                // Add mouse events for desktop
                app.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.addTouchFeedback(app);
                });
                
                app.addEventListener('mouseup', (e) => {
                    e.preventDefault();
                    this.removeTouchFeedback(app);
                });
                
                app.addEventListener('mouseleave', (e) => {
                    this.removeTouchFeedback(app);
                });
                
                console.log('Added dock handlers for app:', appClass);
            }
        });
    }
    
    setupHomeGesture() {
        const homeIndicator = document.querySelector('.ios-home-indicator');
        if (homeIndicator) {
            homeIndicator.addEventListener('click', () => {
                this.goHome();
            });
            
            // Add visual feedback for home gesture
            homeIndicator.style.cursor = 'pointer';
            homeIndicator.style.transition = 'opacity 0.2s ease';
            
            homeIndicator.addEventListener('mouseenter', () => {
                homeIndicator.style.opacity = '0.6';
            });
            
            homeIndicator.addEventListener('mouseleave', () => {
                homeIndicator.style.opacity = '0.3';
            });
        }
    }
    
    addTouchFeedback(element) {
        console.log('Adding touch feedback to element');
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0.6';
        element.style.transition = 'all 0.1s ease';
        element.style.filter = 'brightness(0.8)';
    }
    
    removeTouchFeedback(element) {
        console.log('Removing touch feedback from element');
        element.style.transform = '';
        element.style.opacity = '';
        element.style.filter = '';
        element.style.transition = 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    
    launchApp(appId) {
        console.log('launchApp called with:', appId);
        
        if (this.isTransitioning) {
            console.log('Transition in progress, ignoring launch');
            return;
        }
        
        const appConfig = this.apps[appId];
        if (!appConfig) {
            console.log('No app config found for:', appId);
            return;
        }
        
        console.log('Launching app:', appId, 'Config:', appConfig);
        
        // Special handling for home app
        if (appId === 'home') {
            console.log('Home app - calling goHome()');
            this.goHome();
            return;
        }
        
        // Special handling for planner app - redirect to planner page
        if (appId === 'planner') {
            console.log('Planner app - redirecting to planner page');
            window.location.href = '/planner/index.html';
            return;
        }
        
        this.isTransitioning = true;
        this.currentApp = appId;
        this.navigationStack.push(appId);
        
        // Update app container content
        this.updateAppView(appId, appConfig);
        
        // Slide in animation
        requestAnimationFrame(() => {
            this.appContainer.style.transform = 'translateX(0)';
            
            setTimeout(() => {
                this.isTransitioning = false;
            }, 300);
        });
    }
    
    updateAppView(appId, appConfig) {
        // Safely clear container
        while (this.appContainer.firstChild) {
            this.appContainer.removeChild(this.appContainer.firstChild);
        }
        
        // Create app view
        const appView = document.createElement('div');
        appView.className = 'ios-app-view';
        appView.style.cssText = `
            height: 100%;
            display: flex;
            flex-direction: column;
        `;
        
        // App header
        const header = this.createAppHeader(appConfig);
        appView.appendChild(header);
        
        // App content
        const content = this.createAppContent(appId, appConfig);
        appView.appendChild(content);
        
        this.appContainer.appendChild(appView);
    }
    
    createAppHeader(appConfig) {
        const header = document.createElement('div');
        header.className = 'ios-app-header';
        header.style.cssText = `
            height: 88px;
            background: ${appConfig.color};
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 12px 20px;
            position: relative;
        `;
        
        // Back button - positioned at top
        const backButton = document.createElement('button');
        backButton.className = 'ios-back-button';
        backButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 8px;
            transition: background-color 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            align-self: flex-start;
            margin-bottom: 8px;
        `;
        backButton.textContent = '← Back';
        
        backButton.addEventListener('click', () => {
            this.goBack();
        });
        
        backButton.addEventListener('mouseenter', () => {
            backButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        
        backButton.addEventListener('mouseleave', () => {
            backButton.style.backgroundColor = 'transparent';
        });
        
        // App title - positioned below back button
        const title = document.createElement('h1');
        title.style.cssText = `
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            align-self: flex-start;
        `;
        title.textContent = appConfig.title;
        
        header.appendChild(backButton);
        header.appendChild(title);
        
        return header;
    }
    
    createAppContent(appId, appConfig) {
        const content = document.createElement('div');
        content.className = 'ios-app-content';
        content.style.cssText = `
            flex: 1;
            padding: 20px;
            background: var(--bg-color);
            overflow-y: auto;
        `;
        
        // Create placeholder content based on app type
        const placeholder = this.createAppPlaceholder(appId, appConfig);
        content.appendChild(placeholder);
        
        return content;
    }
    
    createAppPlaceholder(appId, appConfig) {
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            text-align: center;
            padding: 40px 20px;
            color: var(--text-primary);
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
        `;
        
        // App icon
        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 80px;
            margin-bottom: 20px;
            opacity: 0.8;
        `;
        icon.textContent = appConfig.icon;
        
        // App description
        const description = document.createElement('p');
        description.style.cssText = `
            font-size: 18px;
            line-height: 1.4;
            margin-bottom: 30px;
            color: var(--text-secondary);
        `;
        
        // Links for specific apps
        const links = document.createElement('div');
        links.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-top: 30px;
        `;
        
        // Customize content by app
        switch (appId) {
            case 'ai-tools':
                description.textContent = 'Intelligent automation and AI-powered tools for productivity and creativity.';
                // Create full AI tools showcase
                this.createContentInterface(placeholder, 'ai-tools');
                break;
            case 'websites':
                description.textContent = 'Digital spaces designed with purpose and modern web technologies.';
                // Create full websites showcase
                this.createContentInterface(placeholder, 'websites');
                break;
            case 'fashion':
                description.textContent = 'Fashion insights, color palettes, and style automation tools.';
                this.addAppLink(links, 'Fashion Palette Generator', '/fashion-palette/');
                // Create full fashion showcase
                this.createContentInterface(placeholder, 'fashion');
                break;
            case 'design':
                description.textContent = 'Creative design tools and visual identity systems.';
                this.addAppLink(links, 'Color Palettes', '#', () => {
                    // Launch palettes app from design
                    setTimeout(() => {
                        this.goBack();
                        setTimeout(() => {
                            this.launchApp('palettes');
                        }, 300);
                    }, 100);
                });
                // Create full design showcase
                this.createContentInterface(placeholder, 'design');
                break;
            case 'resume':
                description.textContent = 'Professional experience and career documentation.';
                this.addAppLink(links, 'View Resume (PDF)', '/assets/resume.pdf');
                // Create full resume app
                this.createProfessionalInterface(placeholder, 'resume');
                break;
            case 'utilities':
                description.textContent = 'Development utilities and productivity enhancers.';
                break;
            case 'brainwave':
                description.textContent = 'AI-powered neural activity visualization and analysis. Tap the button below to launch the full Brainwave Simulator app.';
                // Create launch button for brainwave simulator
                this.addAppLink(links, '🚀 Launch Brainwave Simulator', '/brainwave-simulator.html');
                break;
            case 'palettes':
                description.textContent = 'Interactive color palettes with harmony generation and export tools. Tap the button below to launch the full Fashion Palette Generator.';
                // Create launch button for fashion palette generator
                this.addAppLink(links, '🎨 Launch Fashion Palette Generator', '/fashion-palette/');
                break;
            case 'analytics':
                description.textContent = 'Data visualization and performance analytics tools.';
                // Create full analytics app
                this.createProfessionalInterface(placeholder, 'analytics');
                break;
            case 'planner':
                description.textContent = 'Interactive planning and productivity tools. Tap the button below to launch the full Planner app.';
                // Create launch button for planner
                this.addAppLink(links, '📅 Launch Planner App', '/planner/index.html');
                break;
            case 'security':
                description.textContent = 'Security dashboard and privacy tools. Tap the button below to view the security page.';
                // Create launch button for security
                this.addAppLink(links, '🔒 View Security Dashboard', '/security.html');
                break;
            case 'accessibility':
                description.textContent = 'Accessibility features and inclusive design tools. Tap the button below to view accessibility information.';
                // Create launch button for accessibility
                this.addAppLink(links, '♿ View Accessibility Info', '/accessibility.html');
                break;
            case 'terminal':
                description.textContent = 'Command-line interface and developer tools.';
                this.addAppLink(links, 'Open Desktop Terminal', '/desktop.html');
                // Create full terminal interface
                this.createTerminalInterface(placeholder);
                break;
            case 'contact':
                description.textContent = 'Get in touch for collaborations and projects.';
                this.addAppLink(links, 'Send Email', 'mailto:jesse@jesserodriguez.me');
                // Create full contact app
                this.createProfessionalInterface(placeholder, 'contact');
                break;
            case 'social':
                description.textContent = 'Connect and share across social platforms.';
                // Create full social app
                this.createProfessionalInterface(placeholder, 'social');
                break;
            default:
                description.textContent = `Welcome to ${appConfig.title}. This app is currently in development.`;
        }
        
        placeholder.appendChild(icon);
        placeholder.appendChild(description);
        if (links.children.length > 0) {
            placeholder.appendChild(links);
        }
        
        return placeholder;
    }
    
    addAppLink(container, text, url, callback = null) {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = text;
        
        if (callback) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                callback();
            });
        } else {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        
        link.style.cssText = `
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
            color: white;
            text-decoration: none;
            border-radius: 16px;
            font-weight: 700;
            font-size: 16px;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0, 122, 255, 0.3);
            text-align: center;
            min-width: 200px;
        `;
        
        // Touch feedback and app launching for mobile
        link.addEventListener('touchstart', () => {
            link.style.transform = 'scale(0.95)';
            link.style.boxShadow = '0 2px 10px rgba(0, 122, 255, 0.4)';
        });
        
        link.addEventListener('touchend', (e) => {
            link.style.transform = 'scale(1)';
            link.style.boxShadow = '0 4px 20px rgba(0, 122, 255, 0.3)';
            
            // Launch app on touchend for mobile
            console.log('Launch button touched:', text, 'URL:', url);
            if (!callback) {
                console.log('Opening in new tab from touch:', url);
                // Force open in new tab
                window.open(url, '_blank');
            }
        });
        
        // Click events for desktop
        link.addEventListener('click', (e) => {
            console.log('Launch button clicked:', text, 'URL:', url);
            if (!callback) {
                console.log('Opening in new tab from click:', url);
                // Force open in new tab
                window.open(url, '_blank');
            }
        });
        
        // Hover effects for desktop
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px) scale(1.02)';
            link.style.boxShadow = '0 8px 30px rgba(0, 122, 255, 0.4)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
            link.style.boxShadow = '0 4px 20px rgba(0, 122, 255, 0.3)';
        });
        
        container.appendChild(link);
    }
    
    goBack() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.navigationStack.pop();
        
        // Slide out animation
        this.appContainer.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            this.currentApp = null;
            this.isTransitioning = false;
        }, 300);
    }
    
    goHome() {
        if (this.isTransitioning || !this.currentApp) return;
        
        this.isTransitioning = true;
        this.navigationStack = [];
        
        // Slide out animation
        this.appContainer.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            this.currentApp = null;
            this.isTransitioning = false;
        }, 300);
    }
    
    createTerminalInterface(container) {
        // Load terminal CSS if not already loaded
        if (!document.querySelector('link[href*="terminal.css"]')) {
            const terminalCSS = document.createElement('link');
            terminalCSS.rel = 'stylesheet';
            terminalCSS.href = '/ios/css/terminal.css';
            document.head.appendChild(terminalCSS);
        }
        
        // Load terminal script if not already loaded
        if (!window.iOSTerminal) {
            const terminalScript = document.createElement('script');
            terminalScript.src = '/ios/js/terminal.js';
            terminalScript.onload = () => {
                this.initializeTerminal(container);
            };
            terminalScript.onerror = () => {
                console.error('Failed to load terminal.js');
                // Fallback to basic terminal interface
                this.createBasicTerminalInterface(container);
            };
            document.head.appendChild(terminalScript);
        } else {
            this.initializeTerminal(container);
        }
    }
    
    initializeTerminal(container) {
        // Safely clear the placeholder content
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        
        // Create terminal interface
        const terminal = document.createElement('div');
        terminal.className = 'ios-terminal';
        terminal.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000000;
            color: #00ff00;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            display: flex;
            flex-direction: column;
        `;
        
        // Terminal output area
        const output = document.createElement('div');
        output.className = 'ios-terminal-output';
        output.style.cssText = `
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #000000;
            font-size: 13px;
            line-height: 1.3;
        `;
        
        // Terminal input area
        const inputContainer = document.createElement('div');
        inputContainer.className = 'ios-terminal-input-container';
        inputContainer.style.cssText = `
            padding: 15px 20px;
            background: #000000;
            border-top: 1px solid #333;
            display: flex;
            align-items: center;
        `;
        
        const prompt = document.createElement('span');
        prompt.className = 'ios-terminal-input-prompt';
        prompt.style.cssText = `
            color: #00ff00;
            font-weight: bold;
            white-space: nowrap;
            margin-right: 8px;
        `;
        
        const input = document.createElement('input');
        input.className = 'ios-terminal-input';
        input.type = 'text';
        input.placeholder = 'Type a command...';
        input.style.cssText = `
            background: transparent;
            border: none;
            color: #ffffff;
            font-family: 'SF Mono', Monaco, monospace;
            font-size: 13px;
            outline: none;
            flex: 1;
        `;
        
        // Create terminal instance
        const terminalInstance = new window.iOSTerminal();
        
        // Update prompt text
        const updatePrompt = () => {
            prompt.textContent = terminalInstance.getPrompt();
        };
        
        // Render output function
        const renderOutput = () => {
            // Safely clear output
            while (output.firstChild) {
                output.removeChild(output.firstChild);
            }
            terminalInstance.outputLines.forEach(line => {
                const lineElement = document.createElement('div');
                lineElement.className = 'ios-terminal-line';
                lineElement.textContent = line.text; // Safe text rendering
                
                // Apply styling based on type
                switch (line.type) {
                    case 'command':
                        lineElement.style.color = '#ffffff';
                        break;
                    case 'error':
                        lineElement.style.color = '#ff4444';
                        break;
                    case 'success':
                        lineElement.style.color = '#44ff44';
                        break;
                    case 'info':
                        lineElement.style.color = '#4488ff';
                        break;
                    case 'warning':
                        lineElement.style.color = '#ffaa44';
                        break;
                    default:
                        lineElement.style.color = '#cccccc';
                }
                
                output.appendChild(lineElement);
            });
            
            // Scroll to bottom
            output.scrollTop = output.scrollHeight;
        };
        
        // Handle input
        let historyIndex = -1;
        
        input.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    const command = input.value.trim();
                    if (command) {
                        terminalInstance.processCommand(command);
                        input.value = '';
                        updatePrompt();
                        renderOutput();
                        historyIndex = -1;
                    }
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    const prevCommand = terminalInstance.navigateHistory(-1);
                    if (prevCommand !== '') {
                        input.value = prevCommand;
                    }
                    break;
                    
                case 'ArrowDown':
                    e.preventDefault();
                    const nextCommand = terminalInstance.navigateHistory(1);
                    input.value = nextCommand;
                    break;
                    
                case 'Tab':
                    e.preventDefault();
                    const partial = input.value;
                    const suggestions = terminalInstance.getCommandSuggestions(partial);
                    if (suggestions.length === 1) {
                        input.value = suggestions[0];
                    } else if (suggestions.length > 1) {
                        terminalInstance.addOutput(`Available: ${suggestions.join(', ')}`, 'info');
                        renderOutput();
                    }
                    break;
            }
        });
        
        // Assemble terminal
        inputContainer.appendChild(prompt);
        inputContainer.appendChild(input);
        terminal.appendChild(output);
        terminal.appendChild(inputContainer);
        
        // Replace the app content with terminal
        const appContent = container.closest('.ios-app-content');
        if (appContent) {
            // Safely clear app content
            while (appContent.firstChild) {
                appContent.removeChild(appContent.firstChild);
            }
            appContent.appendChild(terminal);
            
            // Focus input and initial render
            updatePrompt();
            renderOutput();
            input.focus();
        }
    }
    
    createPalettesInterface(container) {
        // Load palettes CSS if not already loaded
        if (!document.querySelector('link[href*="palettes.css"]')) {
            const palettesCSS = document.createElement('link');
            palettesCSS.rel = 'stylesheet';
            palettesCSS.href = '/ios/css/palettes.css';
            document.head.appendChild(palettesCSS);
        }
        
        // Load palettes script if not already loaded
        if (!window.iOSColorPalettes) {
            const palettesScript = document.createElement('script');
            palettesScript.src = '/ios/js/palettes.js';
            palettesScript.onload = () => {
                this.initializePalettes(container);
            };
            palettesScript.onerror = () => {
                console.error('Failed to load palettes.js');
                // Fallback to basic palettes interface
                this.createBasicPalettesInterface(container);
            };
            document.head.appendChild(palettesScript);
        } else {
            this.initializePalettes(container);
        }
    }
    
    initializePalettes(container) {
        // Create palettes instance
        const palettesInstance = new window.iOSColorPalettes();
        
        // Clear the placeholder content and replace with palettes app
        const appContent = container.closest('.ios-app-content');
        if (appContent) {
            // Safely clear app content
            while (appContent.firstChild) {
                appContent.removeChild(appContent.firstChild);
            }
            
            // Create main palettes container
            const palettesContainer = document.createElement('div');
            palettesContainer.className = 'ios-palettes-content';
            palettesContainer.style.cssText = `
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: var(--bg-color);
            `;
            
            // Create sections
            this.createHarmonySection(palettesContainer, palettesInstance);
            this.createPredefinedPalettes(palettesContainer, palettesInstance);
            this.createAccessibilitySection(palettesContainer, palettesInstance);
            this.createExportModal(appContent, palettesInstance);
            
            appContent.appendChild(palettesContainer);
        }
    }
    
    createHarmonySection(container, palettesInstance) {
        const section = document.createElement('div');
        section.className = 'ios-palette-section';
        
        const title = document.createElement('h2');
        title.className = 'ios-section-title';
        title.textContent = 'Color Harmony Generator';
        
        const subtitle = document.createElement('p');
        subtitle.className = 'ios-section-subtitle';
        subtitle.textContent = 'Enter a base color to generate harmonious color schemes';
        
        const harmonyCard = document.createElement('div');
        harmonyCard.className = 'ios-harmony-section';
        
        // Controls
        const controls = document.createElement('div');
        controls.className = 'ios-harmony-controls';
        
        const input = document.createElement('input');
        input.className = 'ios-harmony-input';
        input.type = 'text';
        input.placeholder = '#007AFF';
        input.value = '#007AFF';
        
        const generateBtn = document.createElement('button');
        generateBtn.className = 'ios-harmony-button';
        generateBtn.textContent = 'Generate';
        
        controls.appendChild(input);
        controls.appendChild(generateBtn);
        
        // Harmony types
        const types = document.createElement('div');
        types.className = 'ios-harmony-types';
        
        const harmonyTypes = [
            { name: 'Complementary', key: 'complementary' },
            { name: 'Triadic', key: 'triadic' },
            { name: 'Analogous', key: 'analogous' },
            { name: 'Monochromatic', key: 'monochromatic' }
        ];
        
        let selectedType = 'complementary';
        
        harmonyTypes.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'ios-harmony-type';
            btn.textContent = type.name;
            if (type.key === selectedType) btn.classList.add('active');
            
            btn.addEventListener('click', () => {
                types.querySelectorAll('.ios-harmony-type').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedType = type.key;
                generateHarmony();
            });
            
            types.appendChild(btn);
        });
        
        // Result display
        const result = document.createElement('div');
        result.className = 'ios-harmony-result';
        
        const generateHarmony = () => {
            const baseColor = input.value.trim();
            if (!/^#[0-9A-F]{6}$/i.test(baseColor)) return;
            
            let colors = [];
            
            switch (selectedType) {
                case 'complementary':
                    colors = palettesInstance.generateComplementary(baseColor);
                    break;
                case 'triadic':
                    colors = palettesInstance.generateTriadic(baseColor);
                    break;
                case 'analogous':
                    colors = palettesInstance.generateAnalogous(baseColor);
                    break;
                case 'monochromatic':
                    colors = palettesInstance.generateMonochromatic(baseColor);
                    break;
            }
            
            // Safely clear result
            while (result.firstChild) {
                result.removeChild(result.firstChild);
            }
            colors.forEach(color => {
                const swatch = document.createElement('div');
                swatch.className = 'ios-color-swatch';
                swatch.style.backgroundColor = color;
                swatch.style.flex = '1';
                swatch.style.cursor = 'pointer';
                swatch.style.position = 'relative';
                
                const hex = document.createElement('div');
                hex.className = 'ios-color-hex';
                hex.textContent = color;
                swatch.appendChild(hex);
                
                swatch.addEventListener('click', () => {
                    palettesInstance.copyColor(color, swatch);
                });
                
                result.appendChild(swatch);
            });
        };
        
        generateBtn.addEventListener('click', generateHarmony);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') generateHarmony();
        });
        
        // Initial generation
        generateHarmony();
        
        harmonyCard.appendChild(controls);
        harmonyCard.appendChild(types);
        harmonyCard.appendChild(result);
        
        section.appendChild(title);
        section.appendChild(subtitle);
        section.appendChild(harmonyCard);
        
        container.appendChild(section);
    }
    
    createPredefinedPalettes(container, palettesInstance) {
        Object.entries(palettesInstance.predefinedPalettes).forEach(([category, palettes]) => {
            const section = document.createElement('div');
            section.className = 'ios-palette-section';
            
            const title = document.createElement('h2');
            title.className = 'ios-section-title';
            title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            
            const grid = document.createElement('div');
            grid.className = 'ios-palette-grid';
            
            palettes.forEach(palette => {
                const card = document.createElement('div');
                card.className = 'ios-palette-card';
                
                const header = document.createElement('div');
                header.className = 'ios-palette-header';
                
                const name = document.createElement('h3');
                name.className = 'ios-palette-name';
                name.textContent = palette.name;
                
                const desc = document.createElement('p');
                desc.className = 'ios-palette-description';
                desc.textContent = palette.description;
                
                header.appendChild(name);
                header.appendChild(desc);
                
                const colors = document.createElement('div');
                colors.className = 'ios-palette-colors';
                
                palette.colors.forEach(color => {
                    const swatch = document.createElement('div');
                    swatch.className = 'ios-color-swatch';
                    swatch.style.backgroundColor = color;
                    
                    const hex = document.createElement('div');
                    hex.className = 'ios-color-hex';
                    hex.textContent = color;
                    swatch.appendChild(hex);
                    
                    swatch.addEventListener('click', () => {
                        palettesInstance.copyColor(color, swatch);
                    });
                    
                    colors.appendChild(swatch);
                });
                
                const actions = document.createElement('div');
                actions.className = 'ios-palette-actions';
                
                const exportBtn = document.createElement('button');
                exportBtn.className = 'ios-export-button';
                exportBtn.textContent = 'Export';
                exportBtn.addEventListener('click', () => {
                    palettesInstance.showExportModal([palette]);
                });
                
                actions.appendChild(exportBtn);
                
                card.appendChild(header);
                card.appendChild(colors);
                card.appendChild(actions);
                
                grid.appendChild(card);
            });
            
            section.appendChild(title);
            section.appendChild(grid);
            container.appendChild(section);
        });
    }
    
    createAccessibilitySection(container, palettesInstance) {
        const section = document.createElement('div');
        section.className = 'ios-palette-section';
        
        const title = document.createElement('h2');
        title.className = 'ios-section-title';
        title.textContent = 'Accessibility Checker';
        
        const subtitle = document.createElement('p');
        subtitle.className = 'ios-section-subtitle';
        subtitle.textContent = 'Check color contrast ratios for accessibility compliance';
        
        const checker = document.createElement('div');
        checker.className = 'ios-accessibility-checker';
        
        // Common color pairs to check
        const colorPairs = [
            { fg: '#000000', bg: '#FFFFFF', name: 'Black on White' },
            { fg: '#FFFFFF', bg: '#000000', name: 'White on Black' },
            { fg: '#007AFF', bg: '#FFFFFF', name: 'iOS Blue on White' },
            { fg: '#FFFFFF', bg: '#007AFF', name: 'White on iOS Blue' },
            { fg: '#00FF00', bg: '#000000', name: 'Terminal Green on Black' }
        ];
        
        colorPairs.forEach(pair => {
            const pairDiv = document.createElement('div');
            pairDiv.className = 'ios-contrast-pair';
            
            const colors = document.createElement('div');
            colors.className = 'ios-contrast-colors';
            
            const fgSwatch = document.createElement('div');
            fgSwatch.className = 'ios-contrast-color';
            fgSwatch.style.backgroundColor = pair.fg;
            
            const bgSwatch = document.createElement('div');
            bgSwatch.className = 'ios-contrast-color';
            bgSwatch.style.backgroundColor = pair.bg;
            
            colors.appendChild(fgSwatch);
            colors.appendChild(bgSwatch);
            
            const info = document.createElement('div');
            info.className = 'ios-contrast-info';
            
            const ratio = palettesInstance.calculateContrast(pair.fg, pair.bg);
            const level = palettesInstance.getContrastLevel(ratio);
            
            const ratioSpan = document.createElement('div');
            ratioSpan.className = 'ios-contrast-ratio';
            ratioSpan.textContent = `${pair.name}: ${ratio.toFixed(2)}:1`;
            
            const levelSpan = document.createElement('span');
            levelSpan.className = `ios-contrast-level ios-contrast-${level.toLowerCase()}`;
            levelSpan.textContent = level;
            
            info.appendChild(ratioSpan);
            info.appendChild(levelSpan);
            
            pairDiv.appendChild(colors);
            pairDiv.appendChild(info);
            
            checker.appendChild(pairDiv);
        });
        
        section.appendChild(title);
        section.appendChild(subtitle);
        section.appendChild(checker);
        
        container.appendChild(section);
    }
    
    createExportModal(container, palettesInstance) {
        const modal = document.createElement('div');
        modal.className = 'ios-export-modal';
        
        const content = document.createElement('div');
        content.className = 'ios-export-content';
        
        const header = document.createElement('div');
        header.className = 'ios-export-header';
        
        const title = document.createElement('h3');
        title.className = 'ios-export-title';
        title.textContent = 'Export Palette';
        
        const subtitle = document.createElement('p');
        subtitle.className = 'ios-export-subtitle';
        subtitle.textContent = 'Choose your export format';
        
        header.appendChild(title);
        header.appendChild(subtitle);
        
        const formats = document.createElement('div');
        formats.className = 'ios-export-formats';
        
        const formatOptions = [
            { key: 'css', name: 'CSS Variables', desc: 'CSS custom properties for web development', icon: 'CSS' },
            { key: 'json', name: 'JSON', desc: 'Structured data for applications', icon: 'JSON' },
            { key: 'text', name: 'Text', desc: 'Plain text format for documentation', icon: 'TXT' },
            { key: 'swift', name: 'Swift', desc: 'iOS UIColor extensions for Swift', icon: 'SWIFT' }
        ];
        
        formatOptions.forEach(format => {
            const option = document.createElement('div');
            option.className = 'ios-format-option';
            if (format.key === 'css') option.classList.add('selected');
            
            const icon = document.createElement('div');
            icon.className = 'ios-format-icon';
            icon.textContent = format.icon;
            
            const info = document.createElement('div');
            info.className = 'ios-format-info';
            
            const name = document.createElement('div');
            name.className = 'ios-format-name';
            name.textContent = format.name;
            
            const desc = document.createElement('div');
            desc.className = 'ios-format-desc';
            desc.textContent = format.desc;
            
            info.appendChild(name);
            info.appendChild(desc);
            
            option.appendChild(icon);
            option.appendChild(info);
            
            option.addEventListener('click', () => {
                formats.querySelectorAll('.ios-format-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                palettesInstance.selectedExportFormat = format.key;
            });
            
            formats.appendChild(option);
        });
        
        const actions = document.createElement('div');
        actions.className = 'ios-export-actions';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'ios-export-action ios-export-cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => {
            palettesInstance.hideExportModal();
        });
        
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'ios-export-action ios-export-confirm';
        confirmBtn.textContent = 'Export';
        confirmBtn.addEventListener('click', () => {
            palettesInstance.handleExport();
        });
        
        actions.appendChild(cancelBtn);
        actions.appendChild(confirmBtn);
        
        content.appendChild(header);
        content.appendChild(formats);
        content.appendChild(actions);
        
        modal.appendChild(content);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                palettesInstance.hideExportModal();
            }
        });
        
        container.appendChild(modal);
    }
    
    createContentInterface(container, appType) {
        // Load content apps CSS if not already loaded
        if (!document.querySelector('link[href*="content-apps.css"]')) {
            const contentCSS = document.createElement('link');
            contentCSS.rel = 'stylesheet';
            contentCSS.href = '/ios/css/content-apps.css';
            document.head.appendChild(contentCSS);
        }
        
        // Load content apps script if not already loaded
        if (!window.iOSContentApps) {
            const contentScript = document.createElement('script');
            contentScript.src = '/ios/js/content-apps.js';
            contentScript.onload = () => {
                this.initializeContentApp(container, appType);
            };
            contentScript.onerror = () => {
                console.error('Failed to load content-apps.js');
                // Fallback to basic content interface
                this.createBasicContentInterface(container, appType);
            };
            document.head.appendChild(contentScript);
        } else {
            this.initializeContentApp(container, appType);
        }
    }
    
    initializeContentApp(container, appType) {
        // Create content apps instance
        const contentAppsInstance = new window.iOSContentApps();
        
        // Clear the placeholder content and replace with content app
        const appContent = container.closest('.ios-app-content');
        if (appContent) {
            // Create content container
            const contentContainer = document.createElement('div');
            contentContainer.className = 'ios-content-body';
            contentContainer.style.cssText = `
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: var(--bg-color);
                -webkit-overflow-scrolling: touch;
            `;
            
            // Initialize the appropriate content app
            switch (appType) {
                case 'ai-tools':
                    contentAppsInstance.createAIToolsApp(contentContainer);
                    break;
                case 'websites':
                    contentAppsInstance.createWebsitesApp(contentContainer);
                    break;
                case 'fashion':
                    contentAppsInstance.createFashionApp(contentContainer);
                    break;
                case 'design':
                    contentAppsInstance.createDesignApp(contentContainer);
                    break;
            }
            
            // Safely replace placeholder with content
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(contentContainer);
        }
    }
    
    createProfessionalInterface(container, appType) {
        // Load professional apps CSS if not already loaded
        if (!document.querySelector('link[href*="professional.css"]')) {
            const professionalCSS = document.createElement('link');
            professionalCSS.rel = 'stylesheet';
            professionalCSS.href = '/ios/css/professional.css';
            document.head.appendChild(professionalCSS);
        }
        
        // Load professional apps script if not already loaded
        if (!window.iOSProfessionalApps) {
            const professionalScript = document.createElement('script');
            professionalScript.src = '/ios/js/professional.js';
            professionalScript.onload = () => {
                this.initializeProfessionalApp(container, appType);
            };
            professionalScript.onerror = () => {
                console.error('Failed to load professional.js');
                // Fallback to basic professional interface
                this.createBasicProfessionalInterface(container, appType);
            };
            document.head.appendChild(professionalScript);
        } else {
            this.initializeProfessionalApp(container, appType);
        }
    }
    
    initializeProfessionalApp(container, appType) {
        // Create professional apps instance
        const professionalAppsInstance = new window.iOSProfessionalApps();
        
        // Clear the placeholder content and replace with professional app
        const appContent = container.closest('.ios-app-content');
        if (appContent) {
            // Create professional container
            const professionalContainer = document.createElement('div');
            professionalContainer.className = 'ios-professional-body';
            professionalContainer.style.cssText = `
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: var(--bg-color);
                -webkit-overflow-scrolling: touch;
            `;
            
            // Initialize the appropriate professional app
            switch (appType) {
                case 'resume':
                    professionalAppsInstance.createResumeApp(professionalContainer);
                    break;
                case 'contact':
                    professionalAppsInstance.createContactApp(professionalContainer);
                    break;
                case 'analytics':
                    professionalAppsInstance.createAnalyticsApp(professionalContainer);
                    break;
                case 'social':
                    professionalAppsInstance.createSocialApp(professionalContainer);
                    break;
            }
            
            // Safely replace placeholder with professional app
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(professionalContainer);
        }
    }
    
    createAppViews() {
        // All app views are created dynamically when launched
        // This method is here for future expansion
    }
    
    /**
     * Lazy load module with caching and error handling
     */
    async lazyLoadModule(moduleName, cssPath, jsPath) {
        const moduleKey = `${moduleName}-module`;
        
        // Return cached promise if already loading
        if (this.loadingModules.has(moduleKey)) {
            return this.loadingModules.get(moduleKey);
        }
        
        // Return immediately if already loaded
        if (this.loadedModules.has(moduleKey)) {
            return Promise.resolve();
        }
        
        // Create loading promise
        const loadingPromise = this.loadModuleFiles(cssPath, jsPath, moduleKey);
        this.loadingModules.set(moduleKey, loadingPromise);
        
        try {
            await loadingPromise;
            this.loadedModules.add(moduleKey);
            this.loadingModules.delete(moduleKey);
        } catch (error) {
            this.loadingModules.delete(moduleKey);
            throw error;
        }
    }
    
    /**
     * Load CSS and JS files for a module
     */
    async loadModuleFiles(cssPath, jsPath, moduleKey) {
        const promises = [];
        
        // Load CSS if provided and not already loaded
        if (cssPath && !document.querySelector(`link[href*="${cssPath}"]`)) {
            promises.push(new Promise((resolve, reject) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssPath;
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            }));
        }
        
        // Load JS if provided and not already loaded
        if (jsPath && !document.querySelector(`script[src*="${jsPath}"]`)) {
            promises.push(new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = jsPath;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            }));
        }
        
        await Promise.all(promises);
    }
    
    /**
     * Fallback methods for when external scripts fail to load
     */
    createBasicTerminalInterface(container) {
        const terminal = document.createElement('div');
        terminal.style.cssText = `
            background: #000;
            color: #00ff00;
            font-family: monospace;
            padding: 20px;
            height: 100%;
            display: flex;
            flex-direction: column;
        `;
        
        const output = document.createElement('div');
        output.innerHTML = `
            <div>Welcome to Terminal</div>
            <div>Type 'help' for available commands</div>
            <div>This is a basic terminal interface.</div>
        `;
        output.style.flex = '1';
        output.style.overflow = 'auto';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type a command...';
        input.style.cssText = `
            background: transparent;
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 10px;
            margin-top: 10px;
            font-family: monospace;
        `;
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                if (command) {
                    const line = document.createElement('div');
                    line.textContent = `$ ${command}`;
                    output.appendChild(line);
                    
                    if (command === 'help') {
                        const help = document.createElement('div');
                        help.innerHTML = `
                            <div>Available commands:</div>
                            <div>- help: Show this help</div>
                            <div>- clear: Clear screen</div>
                            <div>- about: Show about info</div>
                        `;
                        output.appendChild(help);
                    } else if (command === 'clear') {
                        output.innerHTML = '';
                    } else if (command === 'about') {
                        const about = document.createElement('div');
                        about.innerHTML = `
                            <div>iOS Terminal v1.0</div>
                            <div>Basic terminal interface</div>
                        `;
                        output.appendChild(about);
                    } else {
                        const error = document.createElement('div');
                        error.textContent = `Command not found: ${command}`;
                        error.style.color = '#ff4444';
                        output.appendChild(error);
                    }
                    
                    input.value = '';
                    output.scrollTop = output.scrollHeight;
                }
            }
        });
        
        terminal.appendChild(output);
        terminal.appendChild(input);
        
        // Replace the app content with terminal
        const appContent = container.closest('.ios-app-content');
        if (appContent) {
            while (appContent.firstChild) {
                appContent.removeChild(appContent.firstChild);
            }
            appContent.appendChild(terminal);
            input.focus();
        }
    }
    
    createBasicPalettesInterface(container) {
        const palettes = document.createElement('div');
        palettes.style.cssText = `
            padding: 20px;
            background: var(--bg-color);
            height: 100%;
            overflow-y: auto;
        `;
        
        const title = document.createElement('h2');
        title.textContent = 'Color Palettes';
        title.style.marginBottom = '20px';
        
        const description = document.createElement('p');
        description.textContent = 'Basic color palette interface. Full functionality requires external scripts.';
        description.style.marginBottom = '20px';
        description.style.color = 'var(--text-secondary)';
        
        const colors = document.createElement('div');
        colors.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
        `;
        
        const colorPalette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
        colorPalette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.style.cssText = `
                height: 60px;
                background: ${color};
                border-radius: 8px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            `;
            swatch.textContent = color;
            swatch.addEventListener('click', () => {
                navigator.clipboard.writeText(color);
                alert(`Copied ${color} to clipboard!`);
            });
            colors.appendChild(swatch);
        });
        
        palettes.appendChild(title);
        palettes.appendChild(description);
        palettes.appendChild(colors);
        
        // Replace the app content with palettes
        const appContent = container.closest('.ios-app-content');
        if (appContent) {
            while (appContent.firstChild) {
                appContent.removeChild(appContent.firstChild);
            }
            appContent.appendChild(palettes);
        }
    }
    
    createBasicContentInterface(container, appType) {
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 20px;
            background: var(--bg-color);
            height: 100%;
            overflow-y: auto;
        `;
        
        const title = document.createElement('h2');
        title.textContent = this.apps[appType]?.title || 'Content App';
        title.style.marginBottom = '20px';
        
        const description = document.createElement('p');
        description.textContent = this.apps[appType]?.description || 'This is a basic content interface.';
        description.style.marginBottom = '20px';
        description.style.color = 'var(--text-secondary)';
        
        const info = document.createElement('div');
        info.innerHTML = `
            <p>Full functionality requires external scripts to load properly.</p>
            <p>This is a fallback interface with basic content.</p>
        `;
        info.style.color = 'var(--text-secondary)';
        
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(info);
        
        // Replace the app content
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(content);
    }
    
    createBasicProfessionalInterface(container, appType) {
        const content = document.createElement('div');
        content.style.cssText = `
            padding: 20px;
            background: var(--bg-color);
            height: 100%;
            overflow-y: auto;
        `;
        
        const title = document.createElement('h2');
        title.textContent = this.apps[appType]?.title || 'Professional App';
        title.style.marginBottom = '20px';
        
        const description = document.createElement('p');
        description.textContent = this.apps[appType]?.description || 'This is a basic professional interface.';
        description.style.marginBottom = '20px';
        description.style.color = 'var(--text-secondary)';
        
        const info = document.createElement('div');
        info.innerHTML = `
            <p>Full functionality requires external scripts to load properly.</p>
            <p>This is a fallback interface with basic content.</p>
        `;
        info.style.color = 'var(--text-secondary)';
        
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(info);
        
        // Replace the app content
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(content);
    }
}

// Initialize navigation when script loads
new iOSNavigation();
