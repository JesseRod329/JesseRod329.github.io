/**
 * AI Art Laboratory - Award-Winning Interactive Gallery
 * Advanced interactions, animations, and cutting-edge features
 */

class AIArtLaboratory {
    constructor() {
        this.images = [];
        this.filteredImages = [];
        this.currentSort = 'random';
        this.isLoading = false;
        this.particles = [];
        this.cursorTrail = null;
        this.animationId = null;
        
        this.initializeElements();
        this.initializeAdvancedFeatures();
        this.bindEvents();
        this.loadImages();
        this.startAnimations();
    }

    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.collageContainer = document.getElementById('collage');
        this.loadingElement = document.getElementById('loading');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.filterBtn = document.getElementById('filterBtn');
        this.sortSelect = document.getElementById('sortSelect');
        this.imageModal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.closeModal = document.querySelector('.close');
        this.cursorTrail = document.querySelector('.cursor-trail');
        this.particlesContainer = document.querySelector('.particles-container');
    }

    /**
     * Initialize advanced features
     */
    initializeAdvancedFeatures() {
        this.createParticles();
        this.animateStats();
        this.setupCursorTrail();
        this.setupIntersectionObserver();
    }

    /**
     * Create floating particles - Optimized
     */
    createParticles() {
        const particleCount = 25; // Reduced for better performance
        for (let i = 0; i < particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 2 + 6) + 's';
        this.particlesContainer.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 8000);
    }

    /**
     * Setup cursor trail effect - Optimized
     */
    setupCursorTrail() {
        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;
        let isMoving = false;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;
        };

        const handleMouseStop = () => {
            isMoving = false;
        };

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseStop);

        const animateTrail = () => {
            if (isMoving) {
                trailX += (mouseX - trailX) * 0.15; // Increased for more responsive trail
                trailY += (mouseY - trailY) * 0.15;
                
                this.cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
                this.cursorTrail.classList.add('active');
            } else {
                this.cursorTrail.classList.remove('active');
            }
            
            this.animationId = requestAnimationFrame(animateTrail);
        };
        animateTrail();
    }

    /**
     * Animate statistics counters
     */
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element, target) => {
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 20);
        };

        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            animateCounter(stat, target);
        });
    }

    /**
     * Setup intersection observer for scroll animations
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        // Observe collage items when they're added
        const observeItems = () => {
            const items = document.querySelectorAll('.collage-item');
            items.forEach(item => observer.observe(item));
        };

        // Re-observe when new items are added
        const originalRender = this.renderCollage.bind(this);
        this.renderCollage = () => {
            originalRender();
            setTimeout(observeItems, 100);
        };
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.shuffleBtn.addEventListener('click', () => this.shuffleLayout());
        this.filterBtn.addEventListener('click', () => this.toggleFilter());
        this.sortSelect.addEventListener('change', (e) => this.sortImages(e.target.value));
        this.closeModal.addEventListener('click', () => this.closeImageModal());
        
        // Close modal when clicking outside
        this.imageModal.addEventListener('click', (e) => {
            if (e.target === this.imageModal) {
                this.closeImageModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.imageModal.style.display === 'block') {
                this.closeImageModal();
            }
        });

        // Advanced hover effects
        this.setupAdvancedHoverEffects();
    }

    /**
     * Setup advanced hover effects
     */
    setupAdvancedHoverEffects() {
        document.addEventListener('mouseover', (e) => {
            if (e.target.classList.contains('collage-item')) {
                this.addGlitchEffect(e.target);
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.classList.contains('collage-item')) {
                this.removeGlitchEffect(e.target);
            }
        });
    }

    addGlitchEffect(element) {
        element.classList.add('glitch');
        setTimeout(() => {
            element.classList.remove('glitch');
        }, 2000);
    }

    removeGlitchEffect(element) {
        element.classList.remove('glitch');
    }

    /**
     * Load images with advanced loading states
     */
    async loadImages() {
        this.showLoading(true);
        
        try {
            // Simulate loading delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.images = await this.createAdvancedPlaceholderImages();
            this.filteredImages = [...this.images];
            
            this.renderCollage();
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading images:', error);
            this.showError('Failed to load images. Please try again.');
            this.showLoading(false);
        }
    }

    /**
     * Create advanced placeholder images with AI art themes
     */
    async createAdvancedPlaceholderImages() {
        const placeholderImages = [];
        const aiThemes = [
            'Neural Networks', 'Digital Dreams', 'Algorithmic Art', 'Machine Learning',
            'Quantum Creativity', 'Synthetic Vision', 'Data Visualization', 'AI Portraits',
            'Generative Patterns', 'Computational Beauty', 'Artificial Imagination', 'Cyber Aesthetics'
        ];
        
        const styles = ['abstract', 'realistic', 'surreal', 'minimalist', 'futuristic', 'organic'];
        const colors = [
            ['#00f5ff', '#8338ec', '#ff006e'],
            ['#00ff88', '#00f5ff', '#8338ec'],
            ['#ff006e', '#ffbe0b', '#00f5ff'],
            ['#8338ec', '#ff006e', '#00ff88']
        ];
        
        for (let i = 1; i <= 12; i++) {
            const theme = aiThemes[i - 1];
            const style = styles[Math.floor(Math.random() * styles.length)];
            const colorScheme = colors[Math.floor(Math.random() * colors.length)];
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = 400;
            
            canvas.width = size;
            canvas.height = size;
            
            // Create advanced gradient background
            const gradient = ctx.createRadialGradient(
                size/2, size/2, 0,
                size/2, size/2, size/2
            );
            gradient.addColorStop(0, colorScheme[0]);
            gradient.addColorStop(0.5, colorScheme[1]);
            gradient.addColorStop(1, colorScheme[2]);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            // Add neural network pattern
            this.drawNeuralNetwork(ctx, size, colorScheme);
            
            // Add geometric AI elements
            this.drawAIElements(ctx, size, colorScheme);
            
            // Add theme text with advanced styling
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 24px Space Grotesk, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(theme, size / 2, size / 2);
            
            // Add style label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '14px JetBrains Mono, monospace';
            ctx.fillText(style.toUpperCase(), size / 2, size / 2 + 30);
            
            // Add holographic border
            ctx.strokeStyle = colorScheme[0];
            ctx.lineWidth = 3;
            ctx.strokeRect(5, 5, size - 10, size - 10);
            
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            placeholderImages.push({
                id: i,
                src: dataUrl,
                title: theme,
                description: `An AI-generated artwork exploring the intersection of ${style} aesthetics and artificial intelligence. This piece represents the ${theme.toLowerCase()} approach to machine creativity.`,
                style: style,
                colorScheme: colorScheme,
                dateCreated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                tags: this.generateAITags(style)
            });
        }
        
        return placeholderImages;
    }

    /**
     * Draw neural network pattern
     */
    drawNeuralNetwork(ctx, size, colors) {
        const nodes = 8;
        const nodePositions = [];
        
        // Generate node positions
        for (let i = 0; i < nodes; i++) {
            const angle = (i / nodes) * Math.PI * 2;
            const radius = size * 0.3;
            const x = size/2 + Math.cos(angle) * radius;
            const y = size/2 + Math.sin(angle) * radius;
            nodePositions.push({x, y});
        }
        
        // Draw connections
        ctx.strokeStyle = colors[1];
        ctx.lineWidth = 2;
        for (let i = 0; i < nodes; i++) {
            for (let j = i + 1; j < nodes; j++) {
                ctx.beginPath();
                ctx.moveTo(nodePositions[i].x, nodePositions[i].y);
                ctx.lineTo(nodePositions[j].x, nodePositions[j].y);
                ctx.stroke();
            }
        }
        
        // Draw nodes
        nodePositions.forEach((pos, i) => {
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
     * Draw AI-inspired geometric elements
     */
    drawAIElements(ctx, size, colors) {
        // Draw circuit-like patterns
        ctx.strokeStyle = colors[2];
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * size, Math.random() * size);
            ctx.lineTo(Math.random() * size, Math.random() * size);
            ctx.stroke();
        }
        
        // Draw data flow arrows
        ctx.fillStyle = colors[0];
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 10, y + 5);
            ctx.lineTo(x, y + 10);
            ctx.closePath();
            ctx.fill();
        }
    }

    /**
     * Generate AI-themed tags
     */
    generateAITags(style) {
        const baseTags = ['ai-generated', 'machine-learning', 'neural-network', 'algorithmic', 'computational'];
        const styleTags = {
            'abstract': ['geometric', 'non-representational', 'experimental'],
            'realistic': ['photorealistic', 'detailed', 'lifelike'],
            'surreal': ['dreamlike', 'fantastical', 'impossible'],
            'minimalist': ['clean', 'simple', 'essential'],
            'futuristic': ['cyberpunk', 'sci-fi', 'advanced'],
            'organic': ['natural', 'flowing', 'biological']
        };
        
        const tags = [...baseTags, ...(styleTags[style] || [])];
        const numTags = Math.floor(Math.random() * 3) + 2;
        return tags.sort(() => 0.5 - Math.random()).slice(0, numTags);
    }

    /**
     * Render the collage with advanced animations
     */
    renderCollage() {
        this.collageContainer.innerHTML = '';
        
        this.filteredImages.forEach((image, index) => {
            const collageItem = this.createAdvancedCollageItem(image, index);
            this.collageContainer.appendChild(collageItem);
        });
        
        // Add staggered animation
        this.animateCollageItems();
    }

    /**
     * Create advanced collage item with special effects
     */
    createAdvancedCollageItem(image, index) {
        const item = document.createElement('div');
        item.className = 'collage-item';
        item.style.animationDelay = `${index * 0.1}s`;
        
        // Add special effects based on image properties
        if (image.style === 'futuristic') {
            item.classList.add('holographic');
        }
        
        item.innerHTML = `
            <img src="${image.src}" alt="${image.title}" loading="lazy">
            <div class="collage-item-info">
                <div class="collage-item-title">${image.title}</div>
                <div class="collage-item-meta">${image.tags.join(' • ')}</div>
            </div>
        `;
        
        // Add click event with advanced modal
        item.addEventListener('click', () => this.openAdvancedModal(image));
        
        return item;
    }

    /**
     * Animate collage items with staggered effect
     */
    animateCollageItems() {
        const items = document.querySelectorAll('.collage-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('fade-in');
            }, index * 100);
        });
    }

    /**
     * Open advanced modal with enhanced features
     */
    openAdvancedModal(image) {
        this.modalImage.src = image.src;
        this.modalImage.alt = image.title;
        this.modalTitle.textContent = image.title;
        this.modalDescription.textContent = image.description;
        this.imageModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Add special effects to modal
        this.addModalEffects(image);
    }

    /**
     * Add special effects to modal based on image
     */
    addModalEffects(image) {
        const modalContent = document.querySelector('.modal-content');
        
        if (image.style === 'futuristic') {
            modalContent.classList.add('holographic');
        } else if (image.style === 'surreal') {
            modalContent.classList.add('glitch');
        }
    }

    /**
     * Close image modal
     */
    closeImageModal() {
        this.imageModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Remove special effects
        const modalContent = document.querySelector('.modal-content');
        modalContent.classList.remove('holographic', 'glitch');
    }

    /**
     * Advanced shuffle with particle effects
     */
    shuffleLayout() {
        this.collageContainer.classList.add('shuffle-animation');
        
        // Shuffle the filtered images array
        for (let i = this.filteredImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.filteredImages[i], this.filteredImages[j]] = [this.filteredImages[j], this.filteredImages[i]];
        }
        
        // Re-render after animation
        setTimeout(() => {
            this.renderCollage();
            this.collageContainer.classList.remove('shuffle-animation');
        }, 1000);
    }

    /**
     * Toggle advanced filter system
     */
    toggleFilter() {
        // Create advanced filter modal
        this.createFilterModal();
    }

    /**
     * Create advanced filter modal
     */
    createFilterModal() {
        const modal = document.createElement('div');
        modal.className = 'filter-modal';
        modal.innerHTML = `
            <div class="filter-content">
                <h3>Advanced Filters</h3>
                <div class="filter-options">
                    <div class="filter-group">
                        <label>Style:</label>
                        <select id="styleFilter">
                            <option value="all">All Styles</option>
                            <option value="abstract">Abstract</option>
                            <option value="realistic">Realistic</option>
                            <option value="surreal">Surreal</option>
                            <option value="minimalist">Minimalist</option>
                            <option value="futuristic">Futuristic</option>
                            <option value="organic">Organic</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Color Scheme:</label>
                        <div class="color-options">
                            <button class="color-btn" data-color="all">All</button>
                            <button class="color-btn" data-color="blue">Blue</button>
                            <button class="color-btn" data-color="purple">Purple</button>
                            <button class="color-btn" data-color="pink">Pink</button>
                        </div>
                    </div>
                </div>
                <div class="filter-actions">
                    <button class="btn btn-primary" onclick="this.closest('.filter-modal').remove()">Apply Filters</button>
                    <button class="btn btn-secondary" onclick="this.closest('.filter-modal').remove()">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Sort images with advanced options
     */
    sortImages(sortBy) {
        this.currentSort = sortBy;
        
        switch (sortBy) {
            case 'name':
                this.filteredImages.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'style':
                this.filteredImages.sort((a, b) => a.style.localeCompare(b.style));
                break;
            case 'random':
            default:
                this.shuffleLayout();
                return;
        }
        
        this.renderCollage();
    }

    /**
     * Show loading state with advanced animation
     */
    showLoading(show) {
        this.isLoading = show;
        this.loadingElement.classList.toggle('hidden', !show);
    }

    /**
     * Show error with advanced styling
     */
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff006e, #8338ec);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 8px 40px rgba(255, 0, 110, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    }

    /**
     * Start continuous animations - Optimized
     */
    startAnimations() {
        // Regenerate particles less frequently for better performance
        setInterval(() => {
            if (this.particlesContainer.children.length < 30) {
                this.createParticle();
            }
        }, 3000);
    }
}

/**
 * Initialize the laboratory when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    new AIArtLaboratory();
});

/**
 * Add CSS animations for error messages
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .filter-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }
    
    .filter-content {
        background: var(--surface);
        padding: 2rem;
        border-radius: 12px;
        border: 2px solid var(--primary);
        max-width: 500px;
        width: 90%;
    }
    
    .filter-group {
        margin-bottom: 1.5rem;
    }
    
    .filter-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--primary);
        font-weight: 600;
    }
    
    .color-options {
        display: flex;
        gap: 0.5rem;
    }
    
    .color-btn {
        padding: 0.5rem 1rem;
        border: 1px solid var(--border);
        background: var(--surface-elevated);
        color: var(--text-primary);
        border-radius: 6px;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .color-btn:hover {
        border-color: var(--primary);
        color: var(--primary);
    }
    
    .filter-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
    }
`;
document.head.appendChild(style);