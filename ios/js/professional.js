/**
 * iOS Professional Interaction Apps
 * Resume, Contact, Analytics, and Social features
 * CSP Compliant - Safe DOM manipulation only
 */

class iOSProfessionalApps {
    constructor() {
        this.currentApp = null;
        this.formData = {};
        this.validationRules = {};
        
        // Resume data structure
        this.resumeData = {
            personal: {
                name: 'Jesse Rodriguez',
                title: 'AI, Design & Fashion Professional',
                email: 'jesse@jesserodriguez.me',
                website: 'jesserodriguez.me',
                location: 'Available Globally'
            },
            summary: 'Creative technologist bridging AI, design, and fashion with a focus on privacy-first development and editorial aesthetics. Specialized in building secure, accessible web experiences with enterprise-grade security implementations.',
            experience: [
                {
                    title: 'Full-Stack Developer & Designer',
                    company: 'Independent',
                    location: 'Remote',
                    period: '2022 - Present',
                    description: 'Developed portfolio showcasing intersection of AI, design, and fashion. Implemented enterprise-grade security with CSP policies, created iOS-authentic interfaces, and built privacy-first applications with zero external dependencies.'
                },
                {
                    title: 'Creative Technologist',
                    company: 'Various Clients',
                    location: 'Global',
                    period: '2020 - 2022',
                    description: 'Consulted on digital experiences combining technical excellence with editorial design principles. Specialized in performance optimization, accessibility implementation, and modern web standards.'
                }
            ],
            education: [
                {
                    degree: 'Self-Directed Learning',
                    institution: 'Continuous Education',
                    period: '2018 - Present',
                    description: 'Advanced studies in web technologies, AI/ML, design systems, color theory, and cybersecurity best practices.'
                }
            ],
            skills: [
                { name: 'JavaScript/TypeScript', level: 95, category: 'technical' },
                { name: 'CSS/HTML5', level: 98, category: 'technical' },
                { name: 'React/Vue.js', level: 90, category: 'technical' },
                { name: 'Node.js/Python', level: 85, category: 'technical' },
                { name: 'Design Systems', level: 92, category: 'design' },
                { name: 'UI/UX Design', level: 88, category: 'design' },
                { name: 'Typography', level: 95, category: 'design' },
                { name: 'Color Theory', level: 90, category: 'design' },
                { name: 'Cybersecurity', level: 87, category: 'security' },
                { name: 'Privacy Engineering', level: 93, category: 'security' }
            ]
        };
        
        // Mock analytics data
        this.analyticsData = {
            overview: {
                visitors: { value: 15429, change: '+12.5%', trend: 'positive' },
                pageViews: { value: 45612, change: '+8.3%', trend: 'positive' },
                avgSession: { value: '4m 32s', change: '+5.7%', trend: 'positive' },
                bounceRate: { value: '34.2%', change: '-2.1%', trend: 'positive' }
            },
            projects: [
                { name: 'Brainwave Simulator', views: 8456, engagement: 87 },
                { name: 'Color Palette Gen', views: 6234, engagement: 92 },
                { name: 'iOS Interface', views: 5123, engagement: 89 },
                { name: 'Portfolio CLI', views: 4567, engagement: 85 },
                { name: 'Fashion Tools', views: 3890, engagement: 91 },
                { name: 'Design System', views: 2345, engagement: 88 }
            ],
            timeline: [65, 78, 82, 75, 89, 94, 87, 92, 88, 96, 91, 85, 90, 93]
        };
        
        // Social/GitHub activity data
        this.socialData = {
            github: {
                profile: 'JesseRod329',
                repositories: 12,
                contributions: 847,
                recentActivity: [
                    {
                        type: 'commit',
                        repo: 'JesseRod329.github.io',
                        message: 'feat(ios): professional interaction apps',
                        date: '2 hours ago'
                    },
                    {
                        type: 'create',
                        repo: 'portfolio-showcase',
                        message: 'Created content showcase apps',
                        date: '1 day ago'
                    },
                    {
                        type: 'push',
                        repo: 'color-palette-generator',
                        message: 'Enhanced color harmony algorithms',
                        date: '3 days ago'
                    }
                ]
            },
            achievements: [
                { icon: '🏆', label: 'Top Contributor', color: '#FFD700' },
                { icon: '🔒', label: 'Security Expert', color: '#34C759' },
                { icon: '🎨', label: 'Design Master', color: '#FF3B30' },
                { icon: '⚡', label: 'Performance Pro', color: '#007AFF' },
                { icon: '♿', label: 'Accessibility Advocate', color: '#5856D6' },
                { icon: '🚀', label: 'Innovation Leader', color: '#FF9500' }
            ]
        };
        
        this.init();
    }
    
    init() {
        // Initialize when called by navigation system
    }
    
    // Resume App
    createResumeApp(container) {
        this.currentApp = 'resume';
        this.clearContainer(container);
        
        // Personal header
        const header = this.createResumeHeader();
        container.appendChild(header);
        
        // Summary section
        const summary = this.createResumeSection('Professional Summary', [
            { content: this.resumeData.summary }
        ]);
        container.appendChild(summary);
        
        // Experience section
        const experience = this.createResumeSection('Experience', this.resumeData.experience);
        container.appendChild(experience);
        
        // Education section
        const education = this.createResumeSection('Education', this.resumeData.education);
        container.appendChild(education);
        
        // Skills visualization
        const skills = this.createSkillsSection();
        container.appendChild(skills);
        
        // Export controls
        const exportControls = this.createExportControls();
        container.appendChild(exportControls);
    }
    
    createResumeHeader() {
        const header = document.createElement('div');
        header.className = 'ios-resume-section';
        
        const headerContent = document.createElement('div');
        headerContent.className = 'ios-resume-header';
        
        const name = document.createElement('h1');
        name.className = 'ios-resume-name';
        name.textContent = this.resumeData.personal.name;
        
        const title = document.createElement('p');
        title.className = 'ios-resume-title';
        title.textContent = this.resumeData.personal.title;
        
        const contact = document.createElement('p');
        contact.className = 'ios-resume-contact';
        contact.textContent = `${this.resumeData.personal.email} • ${this.resumeData.personal.website}`;
        
        headerContent.appendChild(name);
        headerContent.appendChild(title);
        headerContent.appendChild(contact);
        
        header.appendChild(headerContent);
        
        return header;
    }
    
    createResumeSection(sectionTitle, items) {
        const section = document.createElement('div');
        section.className = 'ios-resume-section';
        
        const content = document.createElement('div');
        content.className = 'ios-resume-content';
        
        const title = document.createElement('h2');
        title.className = 'ios-resume-section-title';
        title.textContent = sectionTitle;
        content.appendChild(title);
        
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'ios-resume-item';
            
            if (item.title) {
                const itemTitle = document.createElement('h3');
                itemTitle.className = 'ios-resume-item-title';
                itemTitle.textContent = item.title;
                itemDiv.appendChild(itemTitle);
            }
            
            if (item.company || item.institution) {
                const subtitle = document.createElement('p');
                subtitle.className = 'ios-resume-item-subtitle';
                subtitle.textContent = item.company || item.institution;
                if (item.location) {
                    subtitle.textContent += ` • ${item.location}`;
                }
                itemDiv.appendChild(subtitle);
            }
            
            if (item.period) {
                const date = document.createElement('p');
                date.className = 'ios-resume-item-date';
                date.textContent = item.period;
                itemDiv.appendChild(date);
            }
            
            if (item.description || item.content) {
                const desc = document.createElement('p');
                desc.className = 'ios-resume-item-description';
                desc.textContent = item.description || item.content;
                itemDiv.appendChild(desc);
            }
            
            content.appendChild(itemDiv);
        });
        
        section.appendChild(content);
        return section;
    }
    
    createSkillsSection() {
        const section = document.createElement('div');
        section.className = 'ios-resume-section';
        
        const content = document.createElement('div');
        content.className = 'ios-resume-content';
        
        const title = document.createElement('h2');
        title.className = 'ios-resume-section-title';
        title.textContent = 'Skills & Expertise';
        content.appendChild(title);
        
        const skillsGrid = document.createElement('div');
        skillsGrid.className = 'ios-skills-grid';
        
        this.resumeData.skills.forEach(skill => {
            const skillItem = document.createElement('div');
            skillItem.className = 'ios-skill-item';
            
            const skillHeader = document.createElement('div');
            skillHeader.className = 'ios-skill-header';
            
            const skillName = document.createElement('span');
            skillName.className = 'ios-skill-name';
            skillName.textContent = skill.name;
            
            const skillLevel = document.createElement('span');
            skillLevel.className = 'ios-skill-level';
            skillLevel.textContent = `${skill.level}%`;
            
            skillHeader.appendChild(skillName);
            skillHeader.appendChild(skillLevel);
            
            const skillBar = document.createElement('div');
            skillBar.className = 'ios-skill-bar';
            
            const skillProgress = document.createElement('div');
            skillProgress.className = 'ios-skill-progress';
            skillProgress.style.width = '0%';
            
            skillBar.appendChild(skillProgress);
            
            skillItem.appendChild(skillHeader);
            skillItem.appendChild(skillBar);
            
            skillsGrid.appendChild(skillItem);
            
            // Animate skill bars after a delay
            setTimeout(() => {
                skillProgress.style.width = `${skill.level}%`;
            }, 300);
        });
        
        content.appendChild(skillsGrid);
        section.appendChild(content);
        
        return section;
    }
    
    createExportControls() {
        const controls = document.createElement('div');
        controls.className = 'ios-export-controls';
        
        const title = document.createElement('h3');
        title.className = 'ios-export-title';
        title.textContent = 'Export Resume';
        
        const buttons = document.createElement('div');
        buttons.className = 'ios-export-buttons';
        
        const formats = [
            { label: '📄 PDF', format: 'pdf' },
            { label: '💾 JSON', format: 'json' },
            { label: '📝 TXT', format: 'txt' },
            { label: '📧 Email', format: 'email' }
        ];
        
        formats.forEach(format => {
            const button = document.createElement('button');
            button.className = 'ios-export-button';
            button.textContent = format.label;
            button.addEventListener('click', () => this.exportResume(format.format));
            buttons.appendChild(button);
        });
        
        controls.appendChild(title);
        controls.appendChild(buttons);
        
        return controls;
    }
    
    exportResume(format) {
        switch (format) {
            case 'pdf':
                this.generatePDF();
                break;
            case 'json':
                this.downloadJSON();
                break;
            case 'txt':
                this.downloadText();
                break;
            case 'email':
                this.emailResume();
                break;
        }
        
        // Track download
        this.trackDownload(format);
    }
    
    generatePDF() {
        // For demo purposes, we'll create a simple text-based PDF
        const content = this.generateTextResume();
        const blob = new Blob([content], { type: 'text/plain' });
        this.downloadFile(blob, 'jesse-rodriguez-resume.txt');
    }
    
    downloadJSON() {
        const jsonData = JSON.stringify(this.resumeData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        this.downloadFile(blob, 'jesse-rodriguez-resume.json');
    }
    
    downloadText() {
        const textContent = this.generateTextResume();
        const blob = new Blob([textContent], { type: 'text/plain' });
        this.downloadFile(blob, 'jesse-rodriguez-resume.txt');
    }
    
    generateTextResume() {
        let content = `${this.resumeData.personal.name}\n`;
        content += `${this.resumeData.personal.title}\n`;
        content += `${this.resumeData.personal.email} • ${this.resumeData.personal.website}\n\n`;
        
        content += `PROFESSIONAL SUMMARY\n`;
        content += `${this.resumeData.summary}\n\n`;
        
        content += `EXPERIENCE\n`;
        this.resumeData.experience.forEach(exp => {
            content += `${exp.title} - ${exp.company} (${exp.period})\n`;
            content += `${exp.description}\n\n`;
        });
        
        content += `EDUCATION\n`;
        this.resumeData.education.forEach(edu => {
            content += `${edu.degree} - ${edu.institution} (${edu.period})\n`;
            content += `${edu.description}\n\n`;
        });
        
        content += `SKILLS\n`;
        this.resumeData.skills.forEach(skill => {
            content += `${skill.name}: ${skill.level}%\n`;
        });
        
        return content;
    }
    
    emailResume() {
        const subject = encodeURIComponent('Resume - Jesse Rodriguez');
        const body = encodeURIComponent('Please find my resume attached. I look forward to discussing opportunities with you.');
        window.open(`mailto:?subject=${subject}&body=${body}`);
    }
    
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    trackDownload(format) {
        // Track download for analytics (in real app, this would send to analytics service)
        console.log(`Resume downloaded in ${format} format`);
    }
    
    // Contact App
    createContactApp(container) {
        this.currentApp = 'contact';
        this.clearContainer(container);
        
        // Contact methods
        const methods = this.createContactMethods();
        container.appendChild(methods);
        
        // Contact form
        const form = this.createContactForm();
        container.appendChild(form);
    }
    
    createContactMethods() {
        const methods = document.createElement('div');
        methods.className = 'ios-contact-methods';
        
        const contactOptions = [
            {
                icon: '📧',
                label: 'Email',
                desc: 'Direct message',
                type: 'email'
            },
            {
                icon: '📅',
                label: 'Schedule',
                desc: 'Book a call',
                type: 'schedule'
            },
            {
                icon: '📋',
                label: 'Project Brief',
                desc: 'Detailed inquiry',
                type: 'project'
            }
        ];
        
        contactOptions.forEach(option => {
            const method = document.createElement('div');
            method.className = 'ios-contact-method';
            method.dataset.type = option.type;
            
            const icon = document.createElement('span');
            icon.className = 'ios-contact-icon';
            icon.textContent = option.icon;
            
            const label = document.createElement('div');
            label.className = 'ios-contact-label';
            label.textContent = option.label;
            
            const desc = document.createElement('div');
            desc.className = 'ios-contact-desc';
            desc.textContent = option.desc;
            
            method.appendChild(icon);
            method.appendChild(label);
            method.appendChild(desc);
            
            method.addEventListener('click', () => this.selectContactMethod(option.type));
            
            methods.appendChild(method);
        });
        
        return methods;
    }
    
    selectContactMethod(type) {
        const methods = document.querySelectorAll('.ios-contact-method');
        methods.forEach(method => {
            method.classList.remove('selected');
            if (method.dataset.type === type) {
                method.classList.add('selected');
            }
        });
        
        this.formData.contactType = type;
        this.updateFormFields(type);
    }
    
    createContactForm() {
        const form = document.createElement('form');
        form.className = 'ios-contact-form';
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Basic fields
        const nameGroup = this.createFormGroup('name', 'Full Name', 'text', true);
        const emailGroup = this.createFormGroup('email', 'Email Address', 'email', true);
        const subjectGroup = this.createFormGroup('subject', 'Subject', 'text', true);
        const messageGroup = this.createFormGroup('message', 'Message', 'textarea', true);
        
        // Submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'ios-submit-button';
        submitButton.textContent = 'Send Message';
        submitButton.disabled = true;
        
        form.appendChild(nameGroup);
        form.appendChild(emailGroup);
        form.appendChild(subjectGroup);
        form.appendChild(messageGroup);
        form.appendChild(submitButton);
        
        // Set up validation
        this.setupFormValidation(form);
        
        return form;
    }
    
    createFormGroup(name, label, type, required = false) {
        const group = document.createElement('div');
        group.className = 'ios-form-group';
        
        const labelEl = document.createElement('label');
        labelEl.className = 'ios-form-label';
        labelEl.textContent = label;
        labelEl.setAttribute('for', name);
        
        let input;
        if (type === 'textarea') {
            input = document.createElement('textarea');
            input.className = 'ios-form-textarea';
        } else if (type === 'select') {
            input = document.createElement('select');
            input.className = 'ios-form-select';
        } else {
            input = document.createElement('input');
            input.type = type;
            input.className = 'ios-form-input';
        }
        
        input.id = name;
        input.name = name;
        input.required = required;
        
        if (required) {
            labelEl.textContent += ' *';
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'ios-form-error';
        errorDiv.style.display = 'none';
        
        group.appendChild(labelEl);
        group.appendChild(input);
        group.appendChild(errorDiv);
        
        return group;
    }
    
    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
        
        // Real-time form validation
        form.addEventListener('input', () => {
            const isValid = this.validateForm(form);
            const submitButton = form.querySelector('.ios-submit-button');
            submitButton.disabled = !isValid;
        });
    }
    
    validateField(input) {
        const value = input.value.trim();
        const name = input.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (input.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        
        // Email validation
        if (name === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Name validation
        if (name === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        }
        
        // Subject validation
        if (name === 'subject' && value && value.length < 5) {
            isValid = false;
            errorMessage = 'Subject must be at least 5 characters';
        }
        
        // Message validation
        if (name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }
        
        this.showFieldValidation(input, isValid, errorMessage);
        
        return isValid;
    }
    
    showFieldValidation(input, isValid, errorMessage) {
        const errorDiv = input.parentNode.querySelector('.ios-form-error');
        
        input.classList.remove('ios-form-valid', 'ios-form-invalid');
        
        if (input.value.trim()) {
            if (isValid) {
                input.classList.add('ios-form-valid');
                errorDiv.style.display = 'none';
            } else {
                input.classList.add('ios-form-invalid');
                errorDiv.textContent = errorMessage;
                errorDiv.style.display = 'block';
            }
        }
    }
    
    clearError(input) {
        const errorDiv = input.parentNode.querySelector('.ios-form-error');
        errorDiv.style.display = 'none';
        input.classList.remove('ios-form-invalid');
    }
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    updateFormFields(contactType) {
        // Customize form based on contact type
        const subjectInput = document.querySelector('input[name="subject"]');
        const messageTextarea = document.querySelector('textarea[name="message"]');
        
        switch (contactType) {
            case 'email':
                subjectInput.placeholder = 'Quick question about...';
                messageTextarea.placeholder = 'Your message here...';
                break;
            case 'schedule':
                subjectInput.placeholder = 'Meeting request: ...';
                messageTextarea.placeholder = 'What would you like to discuss?';
                break;
            case 'project':
                subjectInput.placeholder = 'Project inquiry: ...';
                messageTextarea.placeholder = 'Tell me about your project, timeline, and requirements...';
                break;
        }
    }
    
    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Add contact type
        data.contactType = this.formData.contactType || 'email';
        
        // Simulate form submission
        this.submitContactForm(data);
    }
    
    submitContactForm(data) {
        // Show loading state
        const submitButton = document.querySelector('.ios-submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // For demo, we'll just show success and reset form
            submitButton.textContent = '✓ Sent!';
            submitButton.style.background = '#34C759';
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.background = '';
                submitButton.disabled = false;
                
                // Reset form
                document.querySelector('.ios-contact-form').reset();
                
                // Clear selections
                document.querySelectorAll('.ios-contact-method').forEach(method => {
                    method.classList.remove('selected');
                });
                
                // Clear validation states
                document.querySelectorAll('.ios-form-input, .ios-form-textarea').forEach(input => {
                    input.classList.remove('ios-form-valid', 'ios-form-invalid');
                });
                
                // Hide error messages
                document.querySelectorAll('.ios-form-error').forEach(error => {
                    error.style.display = 'none';
                });
                
            }, 2000);
        }, 1500);
        
        console.log('Contact form submitted:', data);
    }
    
    // Analytics App
    createAnalyticsApp(container) {
        this.currentApp = 'analytics';
        this.clearContainer(container);
        
        // Overview metrics
        const overview = this.createAnalyticsOverview();
        container.appendChild(overview);
        
        // Project performance chart
        const projectChart = this.createProjectChart();
        container.appendChild(projectChart);
        
        // Timeline chart
        const timelineChart = this.createTimelineChart();
        container.appendChild(timelineChart);
    }
    
    createAnalyticsOverview() {
        const grid = document.createElement('div');
        grid.className = 'ios-analytics-grid';
        
        Object.entries(this.analyticsData.overview).forEach(([key, data]) => {
            const card = document.createElement('div');
            card.className = 'ios-analytics-card';
            
            const header = document.createElement('div');
            header.className = 'ios-analytics-card-header';
            
            const title = document.createElement('h3');
            title.className = 'ios-analytics-card-title';
            title.textContent = this.formatMetricTitle(key);
            
            const icon = document.createElement('span');
            icon.className = 'ios-analytics-card-icon';
            icon.textContent = this.getMetricIcon(key);
            
            header.appendChild(title);
            header.appendChild(icon);
            
            const metric = document.createElement('div');
            metric.className = 'ios-analytics-metric';
            metric.textContent = data.value;
            
            const change = document.createElement('div');
            change.className = `ios-analytics-change ${data.trend}`;
            change.textContent = data.change;
            
            card.appendChild(header);
            card.appendChild(metric);
            card.appendChild(change);
            
            grid.appendChild(card);
        });
        
        return grid;
    }
    
    formatMetricTitle(key) {
        const titles = {
            visitors: 'Visitors',
            pageViews: 'Page Views',
            avgSession: 'Avg. Session',
            bounceRate: 'Bounce Rate'
        };
        return titles[key] || key;
    }
    
    getMetricIcon(key) {
        const icons = {
            visitors: '👥',
            pageViews: '📄',
            avgSession: '⏱️',
            bounceRate: '📊'
        };
        return icons[key] || '📈';
    }
    
    createProjectChart() {
        const container = document.createElement('div');
        container.className = 'ios-chart-container';
        
        const title = document.createElement('h3');
        title.className = 'ios-chart-title';
        title.textContent = 'Project Performance';
        
        const chart = document.createElement('div');
        chart.className = 'ios-chart';
        
        const maxViews = Math.max(...this.analyticsData.projects.map(p => p.views));
        
        this.analyticsData.projects.forEach(project => {
            const bar = document.createElement('div');
            bar.className = 'ios-chart-bar';
            bar.setAttribute('data-value', project.views);
            bar.title = `${project.name}: ${project.views} views`;
            
            const height = (project.views / maxViews) * 100;
            bar.style.height = `${height}%`;
            
            chart.appendChild(bar);
        });
        
        container.appendChild(title);
        container.appendChild(chart);
        
        return container;
    }
    
    createTimelineChart() {
        const container = document.createElement('div');
        container.className = 'ios-chart-container';
        
        const title = document.createElement('h3');
        title.className = 'ios-chart-title';
        title.textContent = 'Engagement Timeline (14 days)';
        
        const chart = document.createElement('div');
        chart.className = 'ios-chart';
        
        const maxValue = Math.max(...this.analyticsData.timeline);
        
        this.analyticsData.timeline.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'ios-chart-bar';
            bar.setAttribute('data-value', `${value}%`);
            bar.title = `Day ${index + 1}: ${value}% engagement`;
            
            const height = (value / maxValue) * 100;
            bar.style.height = `${height}%`;
            
            chart.appendChild(bar);
        });
        
        container.appendChild(title);
        container.appendChild(chart);
        
        return container;
    }
    
    // Social App
    createSocialApp(container) {
        this.currentApp = 'social';
        this.clearContainer(container);
        
        // GitHub section
        const github = this.createGitHubSection();
        container.appendChild(github);
        
        // Achievement badges
        const achievements = this.createAchievementsSection();
        container.appendChild(achievements);
        
        // Professional links
        const links = this.createProfessionalLinks();
        container.appendChild(links);
    }
    
    createGitHubSection() {
        const section = document.createElement('div');
        section.className = 'ios-social-section';
        
        const header = document.createElement('div');
        header.className = 'ios-social-header';
        
        const icon = document.createElement('div');
        icon.className = 'ios-social-icon github';
        icon.textContent = '⚡';
        
        const title = document.createElement('h3');
        title.className = 'ios-social-title';
        title.textContent = 'GitHub Activity';
        
        header.appendChild(icon);
        header.appendChild(title);
        
        const grid = document.createElement('div');
        grid.className = 'ios-social-grid';
        
        this.socialData.github.recentActivity.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'ios-social-item';
            
            const itemIcon = document.createElement('div');
            itemIcon.className = 'ios-social-item-icon';
            itemIcon.textContent = this.getActivityIcon(activity.type);
            
            const content = document.createElement('div');
            content.className = 'ios-social-item-content';
            
            const itemTitle = document.createElement('div');
            itemTitle.className = 'ios-social-item-title';
            itemTitle.textContent = activity.repo;
            
            const desc = document.createElement('div');
            desc.className = 'ios-social-item-desc';
            desc.textContent = activity.message;
            
            const date = document.createElement('div');
            date.className = 'ios-social-item-date';
            date.textContent = activity.date;
            
            content.appendChild(itemTitle);
            content.appendChild(desc);
            content.appendChild(date);
            
            item.appendChild(itemIcon);
            item.appendChild(content);
            
            grid.appendChild(item);
        });
        
        section.appendChild(header);
        section.appendChild(grid);
        
        return section;
    }
    
    getActivityIcon(type) {
        const icons = {
            commit: '📝',
            create: '✨',
            push: '⬆️',
            pull: '🔄',
            issue: '🐛'
        };
        return icons[type] || '📋';
    }
    
    createAchievementsSection() {
        const section = document.createElement('div');
        section.className = 'ios-social-section';
        
        const header = document.createElement('div');
        header.className = 'ios-social-header';
        
        const icon = document.createElement('div');
        icon.className = 'ios-social-icon';
        icon.style.background = '#FFD700';
        icon.textContent = '🏆';
        
        const title = document.createElement('h3');
        title.className = 'ios-social-title';
        title.textContent = 'Achievements';
        
        header.appendChild(icon);
        header.appendChild(title);
        
        const badgesGrid = document.createElement('div');
        badgesGrid.className = 'ios-badges-grid';
        
        this.socialData.achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'ios-badge';
            badge.style.borderLeft = `4px solid ${achievement.color}`;
            
            const badgeIcon = document.createElement('span');
            badgeIcon.className = 'ios-badge-icon';
            badgeIcon.textContent = achievement.icon;
            
            const label = document.createElement('span');
            label.className = 'ios-badge-label';
            label.textContent = achievement.label;
            
            badge.appendChild(badgeIcon);
            badge.appendChild(label);
            
            badgesGrid.appendChild(badge);
        });
        
        section.appendChild(header);
        section.appendChild(badgesGrid);
        
        return section;
    }
    
    createProfessionalLinks() {
        const section = document.createElement('div');
        section.className = 'ios-social-section';
        
        const header = document.createElement('div');
        header.className = 'ios-social-header';
        
        const icon = document.createElement('div');
        icon.className = 'ios-social-icon';
        icon.style.background = '#007AFF';
        icon.textContent = '🔗';
        
        const title = document.createElement('h3');
        title.className = 'ios-social-title';
        title.textContent = 'Professional Network';
        
        header.appendChild(icon);
        header.appendChild(title);
        
        const links = [
            { platform: 'GitHub', url: 'https://github.com/JesseRod329', icon: '👨‍💻' },
            { platform: 'Portfolio', url: 'https://jesserodriguez.me', icon: '🌐' },
            { platform: 'Email', url: 'mailto:jesse@jesserodriguez.me', icon: '📧' }
        ];
        
        const linksContainer = document.createElement('div');
        
        links.forEach(link => {
            const item = document.createElement('div');
            item.className = 'ios-social-item';
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => window.open(link.url, '_blank', 'noopener,noreferrer'));
            
            const itemIcon = document.createElement('div');
            itemIcon.className = 'ios-social-item-icon';
            itemIcon.textContent = link.icon;
            
            const content = document.createElement('div');
            content.className = 'ios-social-item-content';
            
            const itemTitle = document.createElement('div');
            itemTitle.className = 'ios-social-item-title';
            itemTitle.textContent = link.platform;
            
            const desc = document.createElement('div');
            desc.className = 'ios-social-item-desc';
            desc.textContent = link.url.replace(/^https?:\/\//, '');
            
            content.appendChild(itemTitle);
            content.appendChild(desc);
            
            item.appendChild(itemIcon);
            item.appendChild(content);
            
            linksContainer.appendChild(item);
        });
        
        section.appendChild(header);
        section.appendChild(linksContainer);
        
        return section;
    }
    
    // Helper methods
    clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
}

// Export for use in navigation system
window.iOSProfessionalApps = iOSProfessionalApps;
