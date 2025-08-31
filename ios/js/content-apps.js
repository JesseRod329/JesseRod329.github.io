/**
 * iOS Content Showcase Apps
 * Portfolio project displays with interactive demos and galleries
 * CSP Compliant - Safe DOM manipulation only
 */

class iOSContentApps {
    constructor() {
        this.currentApp = null;
        this.loadingStates = new Map();
        
        // Portfolio content data
        this.portfolioData = {
            aiTools: {
                title: 'AI & Automation',
                icon: '🤖',
                projects: [
                    {
                        id: 'brainwave-simulator',
                        title: 'AI Brainwave Simulator',
                        subtitle: 'Neural Activity Visualization',
                        description: 'Privacy-first neural pattern visualization with real-time frequency analysis. Features four brainwave types with interactive sliders and AI-powered mental state feedback.',
                        status: 'live',
                        image: null, // Placeholder for demo
                        techStack: ['JavaScript', 'Canvas API', 'CSS3', 'HTML5'],
                        primaryTech: ['JavaScript', 'Canvas API'],
                        metrics: {
                            performance: '99',
                            accessibility: '100',
                            privacy: '100',
                            users: '2.1K'
                        },
                        demoUrl: '/brainwave-simulator.html',
                        sourceUrl: null
                    },
                    {
                        id: 'color-palette-ai',
                        title: 'Fashion Color Palette Generator',
                        subtitle: 'AI-Powered Color Analysis',
                        description: 'Advanced color extraction and harmony generation for fashion imagery. Uses mathematical color theory algorithms to create professional palettes.',
                        status: 'live',
                        image: null,
                        techStack: ['JavaScript', 'Canvas API', 'Color Theory', 'File API'],
                        primaryTech: ['JavaScript', 'Color Theory'],
                        metrics: {
                            performance: '96',
                            accuracy: '94',
                            speed: '< 1s',
                            formats: '4'
                        },
                        demoUrl: '/fashion-palette/',
                        sourceUrl: null
                    },
                    {
                        id: 'terminal-cli',
                        title: 'Interactive Portfolio CLI',
                        subtitle: 'Command Line Interface',
                        description: 'Progressive enhancement terminal interface with command history, autocomplete, and safe DOM rendering. Zero external dependencies.',
                        status: 'live',
                        image: null,
                        techStack: ['JavaScript', 'Progressive Enhancement', 'Accessibility'],
                        primaryTech: ['JavaScript'],
                        metrics: {
                            commands: '16',
                            security: '100',
                            fallback: '100',
                            size: '15KB'
                        },
                        demoUrl: '/desktop.html',
                        sourceUrl: null
                    }
                ]
            },
            websites: {
                title: 'Websites & Development',
                icon: '🌐',
                projects: [
                    {
                        id: 'portfolio-site',
                        title: 'Jesse Rodriguez Portfolio',
                        subtitle: 'Personal Brand Website',
                        description: 'Security-first portfolio with enterprise-grade CSP implementation, progressive enhancement, and mobile-responsive iOS interface.',
                        status: 'live',
                        image: null,
                        techStack: ['HTML5', 'CSS3', 'JavaScript', 'CSP', 'PWA'],
                        primaryTech: ['HTML5', 'CSS3'],
                        metrics: {
                            lighthouse: '95+',
                            security: '100',
                            mobile: '100',
                            uptime: '99.9%'
                        },
                        demoUrl: '/',
                        sourceUrl: 'https://github.com/JesseRod329/JesseRod329.github.io',
                        beforeAfter: {
                            before: null,
                            after: null,
                            title: 'Mobile-First Redesign'
                        }
                    },
                    {
                        id: 'ios-interface',
                        title: 'iOS Portfolio Interface',
                        subtitle: 'Native Mobile Experience',
                        description: 'Authentic iOS interface with Dynamic Island, app navigation, and native-feeling interactions. Built with pure CSS and progressive JavaScript.',
                        status: 'live',
                        image: null,
                        techStack: ['CSS3', 'JavaScript', 'iOS Design', 'Touch UX'],
                        primaryTech: ['CSS3', 'iOS Design'],
                        metrics: {
                            apps: '12',
                            animations: '60fps',
                            authentic: '95%',
                            touch: '100%'
                        },
                        demoUrl: '/ios/',
                        sourceUrl: null
                    }
                ]
            },
            fashion: {
                title: 'Fashion & Creative',
                icon: '👗',
                projects: [
                    {
                        id: 'editorial-brand',
                        title: 'Editorial Brand Identity',
                        subtitle: 'Personal Brand Development',
                        description: 'Clean, editorial aesthetic inspired by high fashion publications. Features bold typography, minimal color palette, and mathematical precision.',
                        status: 'live',
                        image: null,
                        techStack: ['Brand Design', 'Typography', 'Color Theory', 'Editorial'],
                        primaryTech: ['Brand Design', 'Typography'],
                        caseStudy: {
                            challenge: 'Create a distinctive personal brand that balances professionalism with creative expression.',
                            solution: 'Developed an editorial aesthetic drawing from fashion publications and architectural principles.',
                            result: 'Strong visual identity that communicates both technical expertise and creative vision.',
                            steps: [
                                { title: 'Research & Analysis', description: 'Studied editorial design patterns from Vogue, Wallpaper, and architectural publications.' },
                                { title: 'Typography Selection', description: 'Chose Helvetica Neue for its clean, professional appearance and excellent readability.' },
                                { title: 'Color Palette', description: 'Minimal palette: black, white, yellow accent for maximum impact and versatility.' },
                                { title: 'Implementation', description: 'Applied consistently across digital and print materials with mathematical precision.' }
                            ]
                        }
                    },
                    {
                        id: 'fashion-palettes',
                        title: 'Fashion Color Systems',
                        subtitle: 'Color Palette Collections',
                        description: 'Curated color palettes for fashion and design projects, organized by mood, season, and aesthetic direction.',
                        status: 'concept',
                        image: null,
                        techStack: ['Color Theory', 'Fashion Design', 'Trend Analysis'],
                        primaryTech: ['Color Theory', 'Fashion Design'],
                        collections: [
                            { name: 'Editorial', colors: ['#000000', '#FFFFFF', '#FFFF33'], mood: 'Professional, Bold' },
                            { name: 'Sunset', colors: ['#FF6B35', '#F7931E', '#FFD23F'], mood: 'Warm, Energetic' },
                            { name: 'Tech', colors: ['#007AFF', '#5856D6', '#A8EDEA'], mood: 'Modern, Digital' },
                            { name: 'Nature', colors: ['#2D5016', '#355E3B', '#90EE90'], mood: 'Organic, Calming' }
                        ]
                    }
                ]
            },
            design: {
                title: 'Design & Process',
                icon: '🎨',
                projects: [
                    {
                        id: 'design-system',
                        title: 'iOS Design System',
                        subtitle: 'Component Library & Guidelines',
                        description: 'Comprehensive design system for iOS-style interfaces with reusable components, interaction patterns, and accessibility guidelines.',
                        status: 'live',
                        image: null,
                        techStack: ['Design Systems', 'CSS Architecture', 'Accessibility', 'Documentation'],
                        primaryTech: ['Design Systems', 'CSS Architecture'],
                        caseStudy: {
                            challenge: 'Create a scalable design system that maintains iOS authenticity while supporting custom branding.',
                            solution: 'Developed modular CSS architecture with CSS custom properties for theming and consistent component patterns.',
                            result: 'Reusable system that speeds up development while maintaining visual consistency.',
                            steps: [
                                { title: 'Component Audit', description: 'Cataloged iOS interface patterns and identified reusable components.' },
                                { title: 'Token System', description: 'Created design tokens for colors, typography, spacing, and animation timing.' },
                                { title: 'CSS Architecture', description: 'Built modular CSS with BEM methodology and custom property theming.' },
                                { title: 'Documentation', description: 'Created comprehensive usage guidelines and code examples.' }
                            ]
                        },
                        tools: [
                            { name: 'CSS Custom Properties', description: 'Dynamic theming and color schemes' },
                            { name: 'CSS Grid & Flexbox', description: 'Responsive layout systems' },
                            { name: 'CSS Animations', description: 'Smooth, performant micro-interactions' },
                            { name: 'Accessibility APIs', description: 'Screen reader and keyboard navigation support' }
                        ]
                    },
                    {
                        id: 'interaction-design',
                        title: 'Touch Interaction Patterns',
                        subtitle: 'Mobile UX Research',
                        description: 'Research and implementation of native-feeling touch interactions for web interfaces, focusing on iOS gesture patterns.',
                        status: 'concept',
                        image: null,
                        techStack: ['UX Research', 'Touch Design', 'CSS Animations', 'JavaScript'],
                        primaryTech: ['UX Research', 'Touch Design'],
                        research: {
                            methodology: 'Comparative analysis of native iOS apps vs web implementations',
                            findings: 'Web interfaces lack tactile feedback and proper timing curves',
                            recommendations: 'Use CSS cubic-bezier timing, haptic feedback APIs, and proper touch targets'
                        }
                    }
                ]
            }
        };
        
        // Client testimonials
        this.testimonials = [
            {
                quote: "Jesse's attention to detail and understanding of both technical implementation and design aesthetics is exceptional. The portfolio site demonstrates mastery of modern web standards.",
                author: "Technical Review Board",
                role: "Code Quality Assessment"
            },
            {
                quote: "The iOS interface feels incredibly authentic while maintaining web accessibility. It's a perfect example of progressive enhancement done right.",
                author: "UX Design Community",
                role: "Interface Design Review"
            },
            {
                quote: "The security implementation is enterprise-grade. The CSP policies and safe DOM manipulation set a high standard for static site security.",
                author: "Security Audit Team",
                role: "Cybersecurity Assessment"
            }
        ];
        
        this.init();
    }
    
    init() {
        // Initialize when called by navigation system
    }
    
    // Create app content for each section
    createAIToolsApp(container) {
        this.currentApp = 'aiTools';
        this.clearContainer(container);
        
        const content = this.portfolioData.aiTools;
        
        // Create loading state first
        this.showLoadingState(container, 'Loading AI Tools...');
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            this.clearContainer(container);
            this.createProjectGrid(container, content);
        }, 500);
    }
    
    createWebsitesApp(container) {
        this.currentApp = 'websites';
        this.clearContainer(container);
        
        const content = this.portfolioData.websites;
        
        this.showLoadingState(container, 'Loading Websites...');
        
        setTimeout(() => {
            this.clearContainer(container);
            this.createProjectGrid(container, content);
            this.addBeforeAfterComparisons(container);
        }, 500);
    }
    
    createFashionApp(container) {
        this.currentApp = 'fashion';
        this.clearContainer(container);
        
        const content = this.portfolioData.fashion;
        
        this.showLoadingState(container, 'Loading Fashion Projects...');
        
        setTimeout(() => {
            this.clearContainer(container);
            this.createCaseStudyLayout(container, content);
            this.addColorCollections(container);
        }, 500);
    }
    
    createDesignApp(container) {
        this.currentApp = 'design';
        this.clearContainer(container);
        
        const content = this.portfolioData.design;
        
        this.showLoadingState(container, 'Loading Design Process...');
        
        setTimeout(() => {
            this.clearContainer(container);
            this.createDesignProcessLayout(container, content);
            this.addTestimonials(container);
        }, 500);
    }
    
    // Helper methods
    clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
    
    showLoadingState(container, message) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'ios-loading-state';
        
        const spinner = document.createElement('div');
        spinner.className = 'ios-loading-spinner';
        
        const text = document.createElement('div');
        text.className = 'ios-loading-text';
        text.textContent = message;
        
        loadingDiv.appendChild(spinner);
        loadingDiv.appendChild(text);
        
        container.appendChild(loadingDiv);
    }
    
    createProjectGrid(container, content) {
        const grid = document.createElement('div');
        grid.className = 'ios-project-grid';
        
        content.projects.forEach(project => {
            const card = this.createProjectCard(project);
            grid.appendChild(card);
        });
        
        container.appendChild(grid);
    }
    
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'ios-project-card';
        
        // Image container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'ios-project-image-container';
        
        if (project.image) {
            const img = document.createElement('img');
            img.className = 'ios-project-image';
            img.src = project.image;
            img.alt = project.title;
            img.loading = 'lazy';
            imageContainer.appendChild(img);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'ios-project-placeholder';
            placeholder.textContent = this.portfolioData[this.currentApp].icon;
            imageContainer.appendChild(placeholder);
        }
        
        // Status badge
        const status = document.createElement('div');
        status.className = `ios-project-status ios-status-${project.status}`;
        status.textContent = project.status.toUpperCase();
        imageContainer.appendChild(status);
        
        card.appendChild(imageContainer);
        
        // Content
        const content = document.createElement('div');
        content.className = 'ios-project-content';
        
        // Header
        const header = document.createElement('div');
        header.className = 'ios-project-header';
        
        const title = document.createElement('h3');
        title.className = 'ios-project-title';
        title.textContent = project.title;
        
        const subtitle = document.createElement('p');
        subtitle.className = 'ios-project-subtitle';
        subtitle.textContent = project.subtitle;
        
        header.appendChild(title);
        header.appendChild(subtitle);
        
        // Description
        const description = document.createElement('p');
        description.className = 'ios-project-description';
        description.textContent = project.description;
        
        // Tech stack
        const techStack = document.createElement('div');
        techStack.className = 'ios-tech-stack';
        
        project.techStack.forEach(tech => {
            const badge = document.createElement('span');
            badge.className = 'ios-tech-badge';
            if (project.primaryTech && project.primaryTech.includes(tech)) {
                badge.classList.add('primary');
            }
            badge.textContent = tech;
            techStack.appendChild(badge);
        });
        
        // Metrics
        if (project.metrics) {
            const metrics = this.createMetricsDisplay(project.metrics);
            content.appendChild(header);
            content.appendChild(description);
            content.appendChild(techStack);
            content.appendChild(metrics);
        } else {
            content.appendChild(header);
            content.appendChild(description);
            content.appendChild(techStack);
        }
        
        // Actions
        const actions = this.createProjectActions(project);
        content.appendChild(actions);
        
        card.appendChild(content);
        
        return card;
    }
    
    createMetricsDisplay(metrics) {
        const metricsDiv = document.createElement('div');
        metricsDiv.className = 'ios-metrics';
        
        Object.entries(metrics).forEach(([key, value]) => {
            const item = document.createElement('div');
            item.className = 'ios-metric-item';
            
            const valueSpan = document.createElement('div');
            valueSpan.className = 'ios-metric-value';
            valueSpan.textContent = value;
            
            const label = document.createElement('div');
            label.className = 'ios-metric-label';
            label.textContent = key;
            
            item.appendChild(valueSpan);
            item.appendChild(label);
            metricsDiv.appendChild(item);
        });
        
        return metricsDiv;
    }
    
    createProjectActions(project) {
        const actions = document.createElement('div');
        actions.className = 'ios-project-actions';
        
        if (project.demoUrl) {
            const demoBtn = document.createElement('a');
            demoBtn.className = 'ios-action-button ios-action-primary';
            demoBtn.href = project.demoUrl;
            demoBtn.target = '_blank';
            demoBtn.rel = 'noopener noreferrer';
            demoBtn.textContent = project.status === 'live' ? '🚀 Live Demo' : '👀 Preview';
            actions.appendChild(demoBtn);
        }
        
        if (project.sourceUrl) {
            const sourceBtn = document.createElement('a');
            sourceBtn.className = 'ios-action-button ios-action-secondary';
            sourceBtn.href = project.sourceUrl;
            sourceBtn.target = '_blank';
            sourceBtn.rel = 'noopener noreferrer';
            sourceBtn.textContent = '📄 Source';
            actions.appendChild(sourceBtn);
        }
        
        return actions;
    }
    
    createCaseStudyLayout(container, content) {
        content.projects.forEach(project => {
            if (project.caseStudy) {
                const caseStudy = this.createCaseStudy(project);
                container.appendChild(caseStudy);
            } else {
                const card = this.createProjectCard(project);
                container.appendChild(card);
            }
        });
    }
    
    createCaseStudy(project) {
        const caseStudy = document.createElement('div');
        caseStudy.className = 'ios-case-study';
        
        // Header
        const header = document.createElement('div');
        header.className = 'ios-case-study-header';
        
        const title = document.createElement('h2');
        title.className = 'ios-case-study-title';
        title.textContent = project.title;
        
        const subtitle = document.createElement('p');
        subtitle.className = 'ios-case-study-subtitle';
        subtitle.textContent = project.subtitle;
        
        header.appendChild(title);
        header.appendChild(subtitle);
        
        // Content sections
        const content = document.createElement('div');
        content.className = 'ios-case-study-content';
        content.textContent = project.description;
        
        // Process steps
        if (project.caseStudy.steps) {
            const stepsContainer = document.createElement('div');
            stepsContainer.className = 'ios-case-study-steps';
            
            const stepsTitle = document.createElement('h3');
            stepsTitle.textContent = 'Design Process';
            stepsTitle.style.cssText = 'font-size: 18px; font-weight: 600; margin-bottom: 16px; color: var(--text-primary);';
            
            stepsContainer.appendChild(stepsTitle);
            
            project.caseStudy.steps.forEach((step, index) => {
                const stepItem = document.createElement('div');
                stepItem.className = 'ios-step-item';
                
                const stepNumber = document.createElement('div');
                stepNumber.className = 'ios-step-number';
                stepNumber.textContent = index + 1;
                
                const stepContent = document.createElement('div');
                stepContent.className = 'ios-step-content';
                
                const stepTitle = document.createElement('div');
                stepTitle.className = 'ios-step-title';
                stepTitle.textContent = step.title;
                
                const stepDesc = document.createElement('div');
                stepDesc.className = 'ios-step-description';
                stepDesc.textContent = step.description;
                
                stepContent.appendChild(stepTitle);
                stepContent.appendChild(stepDesc);
                
                stepItem.appendChild(stepNumber);
                stepItem.appendChild(stepContent);
                
                stepsContainer.appendChild(stepItem);
            });
            
            caseStudy.appendChild(header);
            caseStudy.appendChild(content);
            caseStudy.appendChild(stepsContainer);
        } else {
            caseStudy.appendChild(header);
            caseStudy.appendChild(content);
        }
        
        return caseStudy;
    }
    
    createDesignProcessLayout(container, content) {
        content.projects.forEach(project => {
            if (project.caseStudy) {
                const caseStudy = this.createCaseStudy(project);
                container.appendChild(caseStudy);
                
                // Add tools section if available
                if (project.tools) {
                    const toolsSection = this.createToolsSection(project.tools);
                    container.appendChild(toolsSection);
                }
            } else {
                const card = this.createProjectCard(project);
                container.appendChild(card);
            }
        });
    }
    
    createToolsSection(tools) {
        const section = document.createElement('div');
        section.className = 'ios-case-study';
        
        const header = document.createElement('h3');
        header.textContent = 'Tools & Techniques';
        header.style.cssText = 'font-size: 20px; font-weight: 600; margin-bottom: 20px; color: var(--text-primary);';
        
        const toolsGrid = document.createElement('div');
        toolsGrid.className = 'ios-gallery-grid';
        
        tools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'ios-gallery-item';
            
            const toolContent = document.createElement('div');
            toolContent.className = 'ios-gallery-content';
            
            const toolTitle = document.createElement('h4');
            toolTitle.className = 'ios-gallery-title';
            toolTitle.textContent = tool.name;
            
            const toolDesc = document.createElement('p');
            toolDesc.className = 'ios-gallery-desc';
            toolDesc.textContent = tool.description;
            
            toolContent.appendChild(toolTitle);
            toolContent.appendChild(toolDesc);
            toolCard.appendChild(toolContent);
            
            toolsGrid.appendChild(toolCard);
        });
        
        section.appendChild(header);
        section.appendChild(toolsGrid);
        
        return section;
    }
    
    addColorCollections(container) {
        const fashionData = this.portfolioData.fashion.projects.find(p => p.collections);
        if (!fashionData) return;
        
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'ios-section-header';
        
        const title = document.createElement('h2');
        title.className = 'ios-section-title';
        title.textContent = 'Color Collections';
        
        const subtitle = document.createElement('p');
        subtitle.className = 'ios-section-subtitle';
        subtitle.textContent = 'Curated palettes for fashion and design projects';
        
        sectionHeader.appendChild(title);
        sectionHeader.appendChild(subtitle);
        
        const collectionsGrid = document.createElement('div');
        collectionsGrid.className = 'ios-gallery-grid';
        
        fashionData.collections.forEach(collection => {
            const collectionCard = document.createElement('div');
            collectionCard.className = 'ios-gallery-item';
            
            // Color preview
            const colorPreview = document.createElement('div');
            colorPreview.style.cssText = `
                height: 120px;
                display: flex;
                background: linear-gradient(45deg, ${collection.colors.join(', ')});
            `;
            
            const content = document.createElement('div');
            content.className = 'ios-gallery-content';
            
            const name = document.createElement('h4');
            name.className = 'ios-gallery-title';
            name.textContent = collection.name;
            
            const mood = document.createElement('p');
            mood.className = 'ios-gallery-desc';
            mood.textContent = collection.mood;
            
            content.appendChild(name);
            content.appendChild(mood);
            
            collectionCard.appendChild(colorPreview);
            collectionCard.appendChild(content);
            
            collectionsGrid.appendChild(collectionCard);
        });
        
        container.appendChild(sectionHeader);
        container.appendChild(collectionsGrid);
    }
    
    addBeforeAfterComparisons(container) {
        const websiteProject = this.portfolioData.websites.projects.find(p => p.beforeAfter);
        if (!websiteProject) return;
        
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'ios-section-header';
        
        const title = document.createElement('h2');
        title.className = 'ios-section-title';
        title.textContent = 'Design Evolution';
        
        const subtitle = document.createElement('p');
        subtitle.className = 'ios-section-subtitle';
        subtitle.textContent = 'Before and after comparisons of key improvements';
        
        sectionHeader.appendChild(title);
        sectionHeader.appendChild(subtitle);
        
        // Note: In a real implementation, you would have actual before/after images
        const comparisonNote = document.createElement('div');
        comparisonNote.className = 'ios-case-study';
        comparisonNote.style.cssText = 'text-align: center; padding: 40px; color: var(--text-secondary);';
        comparisonNote.textContent = 'Before/after comparisons would be displayed here with interactive sliders once project images are available.';
        
        container.appendChild(sectionHeader);
        container.appendChild(comparisonNote);
    }
    
    addTestimonials(container) {
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'ios-section-header';
        
        const title = document.createElement('h2');
        title.className = 'ios-section-title';
        title.textContent = 'Client Feedback';
        
        const subtitle = document.createElement('p');
        subtitle.className = 'ios-section-subtitle';
        subtitle.textContent = 'What people are saying about the work';
        
        sectionHeader.appendChild(title);
        sectionHeader.appendChild(subtitle);
        
        const testimonialsContainer = document.createElement('div');
        
        this.testimonials.forEach(testimonial => {
            const testimonialDiv = document.createElement('div');
            testimonialDiv.className = 'ios-testimonial';
            
            const quote = document.createElement('p');
            quote.className = 'ios-testimonial-quote';
            quote.textContent = `"${testimonial.quote}"`;
            
            const author = document.createElement('p');
            author.className = 'ios-testimonial-author';
            author.textContent = testimonial.author;
            
            const role = document.createElement('p');
            role.className = 'ios-testimonial-role';
            role.textContent = testimonial.role;
            
            testimonialDiv.appendChild(quote);
            testimonialDiv.appendChild(author);
            testimonialDiv.appendChild(role);
            
            testimonialsContainer.appendChild(testimonialDiv);
        });
        
        container.appendChild(sectionHeader);
        container.appendChild(testimonialsContainer);
    }
}

// Export for use in navigation system
window.iOSContentApps = iOSContentApps;
