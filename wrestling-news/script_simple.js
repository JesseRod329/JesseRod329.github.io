// Wrestling News Hub - Simplified JavaScript
class WrestlingNewsHub {
    constructor() {
        this.newsData = [];
        this.filteredData = [];
        this.currentFilter = 'all';
        this.isLoading = false;
        
        this.init();
    }

    init() {
        console.log('Initializing Wrestling News Hub...');
        this.bindEvents();
        this.loadNews();
    }

    bindEvents() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadNews());
        }

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e.target.dataset.filter));
        });

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
    }

    async loadNews() {
        if (this.isLoading) {
            console.log('Already loading, skipping...');
            return;
        }
        
        console.log('Starting to load news...');
        this.isLoading = true;
        this.showLoading();

        try {
            // Use mock data for now to ensure it works
            const newsData = this.getMockWrestlingNews();
            console.log('News data loaded:', newsData.length, 'items');
            
            this.newsData = newsData;
            this.filteredData = [...newsData];
            
            console.log('Rendering news...');
            this.renderNews();
        } catch (error) {
            console.error('Error loading news:', error);
            this.showError('Failed to load wrestling news. Please try again.');
        } finally {
            this.isLoading = false;
            console.log('Loading completed');
        }
    }

    getMockWrestlingNews() {
        return [
            {
                id: 1,
                title: "Roman Reigns Retains Universal Championship at WrestleMania 40",
                excerpt: "The Tribal Chief successfully defended his title against Cody Rhodes in a thrilling main event that had fans on the edge of their seats.",
                source: "WWE",
                date: "2024-04-08",
                tags: ["WWE", "WrestleMania", "Championship", "Roman Reigns"],
                category: "wwe",
                url: "#",
                isBreaking: true
            },
            {
                id: 2,
                title: "AEW Dynamite Draws Record Viewership for Championship Match",
                excerpt: "The latest episode of AEW Dynamite featuring a world championship bout drew the highest ratings in company history.",
                source: "AEW",
                date: "2024-04-07",
                tags: ["AEW", "Dynamite", "Championship", "Ratings"],
                category: "aew",
                url: "#",
                isBreaking: false
            },
            {
                id: 3,
                title: "CM Punk Returns to WWE After 10 Years",
                excerpt: "In a shocking turn of events, CM Punk made his surprise return to WWE during the latest episode of Raw.",
                source: "WWE",
                date: "2024-04-06",
                tags: ["WWE", "CM Punk", "Return", "Raw"],
                category: "wwe",
                url: "#",
                isBreaking: true
            },
            {
                id: 4,
                title: "Kenny Omega Announces New Championship Tournament",
                excerpt: "The Cleaner revealed plans for an international championship tournament featuring wrestlers from around the world.",
                source: "AEW",
                date: "2024-04-05",
                tags: ["AEW", "Kenny Omega", "Tournament", "International"],
                category: "aew",
                url: "#",
                isBreaking: false
            },
            {
                id: 5,
                title: "Independent Wrestling Scene Sees Major Growth",
                excerpt: "Local wrestling promotions across the country are reporting record attendance and increased fan engagement.",
                source: "Indie",
                date: "2024-04-04",
                tags: ["Independent", "Growth", "Attendance", "Local"],
                category: "indies",
                url: "#",
                isBreaking: false
            },
            {
                id: 6,
                title: "WWE NXT Announces New Signings",
                excerpt: "The developmental brand revealed several new talents joining the roster from the independent circuit.",
                source: "WWE",
                date: "2024-04-03",
                tags: ["WWE", "NXT", "Signings", "Talent"],
                category: "wwe",
                url: "#",
                isBreaking: false
            },
            {
                id: 7,
                title: "AEW Collision Features Stunning Debut",
                excerpt: "A mysterious new wrestler made their debut on AEW Collision, leaving fans speculating about their identity.",
                source: "AEW",
                date: "2024-04-02",
                tags: ["AEW", "Collision", "Debut", "Mystery"],
                category: "aew",
                url: "#",
                isBreaking: true
            },
            {
                id: 8,
                title: "Wrestling Hall of Fame Announces 2024 Inductees",
                excerpt: "The prestigious hall of fame revealed this year's inductees, including several legendary performers.",
                source: "General",
                date: "2024-04-01",
                tags: ["Hall of Fame", "Inductees", "Legends", "Honor"],
                category: "general",
                url: "#",
                isBreaking: false
            },
            {
                id: 9,
                title: "Reddit Community Discusses Latest WWE Raw",
                excerpt: "Fans on r/SquaredCircle are buzzing about the latest episode of Monday Night Raw and its implications for upcoming storylines.",
                source: "Reddit",
                date: "2024-04-01",
                tags: ["Reddit", "Community", "Discussion", "Raw"],
                category: "community",
                url: "#",
                isBreaking: false
            },
            {
                id: 10,
                title: "Wikipedia Updates WrestleMania 40 Event Page",
                excerpt: "The comprehensive Wikipedia page for WrestleMania 40 has been updated with latest match results and attendance figures.",
                source: "Wikipedia",
                date: "2024-03-31",
                tags: ["Wikipedia", "WrestleMania", "Updates", "Information"],
                category: "general",
                url: "#",
                isBreaking: false
            }
        ];
    }

    handleFilter(filter) {
        console.log('Filtering by:', filter);
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Filter data
        if (filter === 'all') {
            this.filteredData = [...this.newsData];
        } else if (filter === 'breaking') {
            this.filteredData = this.newsData.filter(article => article.isBreaking);
        } else {
            this.filteredData = this.newsData.filter(article => article.category === filter);
        }

        console.log('Filtered data:', this.filteredData.length, 'items');
        this.renderNews();
    }

    handleNavigation(e) {
        e.preventDefault();
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');

        // Handle navigation logic
        const target = e.target.getAttribute('href').substring(1);
        if (target === 'home') {
            this.handleFilter('all');
        } else if (['wwe', 'aew', 'indies', 'community', 'general'].includes(target)) {
            this.handleFilter(target);
        }
    }

    renderNews() {
        console.log('Rendering news with', this.filteredData.length, 'items');
        const newsGrid = document.getElementById('newsGrid');
        
        if (!newsGrid) {
            console.error('News grid element not found!');
            return;
        }
        
        if (this.filteredData.length === 0) {
            console.log('No filtered data, showing no news message');
            newsGrid.innerHTML = `
                <div class="glass-card error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>No News Found</h3>
                    <p>No articles match your current filter. Try selecting a different category.</p>
                </div>
            `;
            return;
        }

        console.log('Creating news cards...');
        newsGrid.innerHTML = this.filteredData.map(article => this.createNewsCard(article)).join('');
        
        // Add click handlers to news cards
        document.querySelectorAll('.news-card').forEach(card => {
            card.addEventListener('click', () => {
                console.log('Opening article:', card.dataset.articleId);
            });
        });
        
        console.log('News rendering completed');
    }

    createNewsCard(article) {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        };

        const getSourceIcon = (source) => {
            if (source === 'Reddit') return 'fab fa-reddit';
            if (source === 'Wikipedia') return 'fab fa-wikipedia-w';
            if (source === 'Cagematch.net') return 'fas fa-database';
            if (source.includes('WWE')) return 'fas fa-trophy';
            if (source.includes('AEW')) return 'fas fa-star';
            return 'fas fa-rss';
        };

        return `
            <article class="news-card" data-article-id="${article.id}">
                <div class="news-meta">
                    <span class="news-source">
                        <i class="${getSourceIcon(article.source)}"></i>
                        ${article.source}
                    </span>
                    <span class="news-date">${formatDate(article.date)}</span>
                </div>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-excerpt">${article.excerpt}</p>
                <div class="news-tags">
                    ${article.tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
                    ${article.isBreaking ? '<span class="news-tag" style="background: rgba(255, 107, 107, 0.3); color: #ff6b6b;">BREAKING</span>' : ''}
                </div>
                <a href="${article.url}" class="news-link" onclick="event.stopPropagation()" target="_blank" rel="noopener">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </article>
        `;
    }

    showLoading() {
        const newsGrid = document.getElementById('newsGrid');
        if (newsGrid) {
            newsGrid.innerHTML = `
                <div class="loading glass-card">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading wrestling news...</p>
                </div>
            `;
        }
    }

    showError(message) {
        const newsGrid = document.getElementById('newsGrid');
        if (newsGrid) {
            newsGrid.innerHTML = `
                <div class="glass-card error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading News</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()" style="margin-top: 16px; padding: 8px 16px; background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.3); color: white; border-radius: 8px; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            `;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    new WrestlingNewsHub();
});

// Add some additional utility functions
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            const refreshBtn = document.getElementById('refreshBtn');
            if (refreshBtn) {
                refreshBtn.click();
            }
        }
    });
});
