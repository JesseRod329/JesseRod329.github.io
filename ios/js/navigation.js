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
            'analytics': {
                title: 'Analytics',
                icon: '📊',
                color: 'linear-gradient(135deg, #795548 0%, #5D4037 100%)'
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
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
        } else {
            this.setupNavigation();
        }
    }
    
    setupNavigation() {
        this.createAppContainer();
        this.setupEventListeners();
        this.createAppViews();
    }
    
    createAppContainer() {
        // Create app view container
        const device = document.querySelector('.ios-device');
        if (!device) return;
        
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
    }
    
    setupEventListeners() {
        // App tap handlers
        this.setupAppTapHandlers();
        
        // Home indicator gesture
        this.setupHomeGesture();
        
        // Prevent default touch behaviors on device
        const device = document.querySelector('.ios-device');
        if (device) {
            device.addEventListener('touchstart', (e) => {
                e.preventDefault();
            }, { passive: false });
        }
    }
    
    setupAppTapHandlers() {
        // Grid apps
        const gridApps = document.querySelectorAll('.ios-app');
        gridApps.forEach(app => {
            const appClass = Array.from(app.classList).find(cls => cls !== 'ios-app');
            if (appClass && this.apps[appClass]) {
                app.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.launchApp(appClass);
                });
                
                // Add touch feedback
                app.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.addTouchFeedback(app);
                });
                
                app.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.removeTouchFeedback(app);
                });
            }
        });
        
        // Dock apps
        const dockApps = document.querySelectorAll('.ios-dock-app');
        dockApps.forEach(app => {
            const appClass = Array.from(app.classList).find(cls => cls !== 'ios-dock-app');
            if (appClass && this.apps[appClass]) {
                app.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.launchApp(appClass);
                });
                
                // Add touch feedback
                app.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.addTouchFeedback(app);
                });
                
                app.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.removeTouchFeedback(app);
                });
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
        element.style.transform = 'scale(0.95)';
        element.style.opacity = '0.7';
    }
    
    removeTouchFeedback(element) {
        element.style.transform = '';
        element.style.opacity = '';
    }
    
    launchApp(appId) {
        if (this.isTransitioning) return;
        
        const appConfig = this.apps[appId];
        if (!appConfig) return;
        
        // Special handling for home app
        if (appId === 'home') {
            this.goHome();
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
        this.appContainer.innerHTML = '';
        
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
            align-items: flex-end;
            padding: 0 20px 12px 20px;
            position: relative;
        `;
        
        // Back button
        const backButton = document.createElement('button');
        backButton.className = 'ios-back-button';
        backButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: background-color 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
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
        
        // App title
        const title = document.createElement('h1');
        title.style.cssText = `
            color: white;
            font-size: 34px;
            font-weight: 700;
            margin: 0;
            position: absolute;
            left: 20px;
            bottom: 12px;
            right: 20px;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
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
                break;
            case 'websites':
                description.textContent = 'Digital spaces designed with purpose and modern web technologies.';
                break;
            case 'fashion':
                description.textContent = 'Fashion insights, color palettes, and style automation tools.';
                this.addAppLink(links, 'Fashion Palette Generator', '/fashion-palette/');
                break;
            case 'design':
                description.textContent = 'Creative design tools and visual identity systems.';
                break;
            case 'resume':
                description.textContent = 'Professional experience and career documentation.';
                this.addAppLink(links, 'View Resume (PDF)', '/assets/resume.pdf');
                break;
            case 'utilities':
                description.textContent = 'Development utilities and productivity enhancers.';
                break;
            case 'brainwave':
                description.textContent = 'AI-powered neural activity visualization and analysis.';
                this.addAppLink(links, 'Launch Brainwave Simulator', '/brainwave-simulator.html');
                break;
            case 'palettes':
                description.textContent = 'Color palette generation and fashion color analysis.';
                this.addAppLink(links, 'Color Palette Generator', '/fashion-palette/');
                break;
            case 'analytics':
                description.textContent = 'Data visualization and performance analytics tools.';
                break;
            case 'terminal':
                description.textContent = 'Command-line interface and developer tools.';
                this.addAppLink(links, 'Open Desktop Terminal', '/desktop.html');
                break;
            case 'contact':
                description.textContent = 'Get in touch for collaborations and projects.';
                this.addAppLink(links, 'Send Email', 'mailto:jesse@jesserodriguez.me');
                break;
            case 'social':
                description.textContent = 'Connect and share across social platforms.';
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
    
    addAppLink(container, text, url) {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = text;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.cssText = `
            display: inline-block;
            padding: 12px 24px;
            background: #007AFF;
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.2s ease;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
        `;
        
        link.addEventListener('mouseenter', () => {
            link.style.backgroundColor = '#0056CC';
            link.style.transform = 'scale(1.02)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.backgroundColor = '#007AFF';
            link.style.transform = 'scale(1)';
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
    
    createAppViews() {
        // All app views are created dynamically when launched
        // This method is here for future expansion
    }
}

// Initialize navigation when script loads
new iOSNavigation();
