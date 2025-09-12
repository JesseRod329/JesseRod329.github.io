// Wrestling News Hub - Main JavaScript
class WrestlingNewsHub {
    constructor() {
        this.rawNews = [];
        this.smackdownNews = [];
        this.init();
    }

    init() {
        this.loadNewsData();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    // Load news data from JSON files
    async loadNewsData() {
        try {
            // Load Raw news
            const rawResponse = await fetch('data/raw-news.json');
            if (rawResponse.ok) {
                this.rawNews = await rawResponse.json();
                this.displayNews('raw', this.rawNews);
            }

            // Load SmackDown news
            const smackdownResponse = await fetch('data/smackdown-news.json');
            if (smackdownResponse.ok) {
                this.smackdownNews = await smackdownResponse.json();
                this.displayNews('smackdown', this.smackdownNews);
            }

            // If no data files exist, show sample data
            if (this.rawNews.length === 0 && this.smackdownNews.length === 0) {
                this.loadSampleData();
            }

        } catch (error) {
            console.error('Error loading news data:', error);
            this.loadSampleData();
        }
    }

    // Display news articles in the UI
    displayNews(section, newsData) {
        const container = document.getElementById(`${section}-news`);
        const countElement = document.getElementById(`${section}-count`);
        
        if (!container || !countElement) return;

        // Update count
        countElement.textContent = newsData.length;

        // Clear loading spinner
        container.innerHTML = '';

        if (newsData.length === 0) {
            container.innerHTML = `
                <div class="no-news">
                    <p>No news available at the moment.</p>
                    <p>Check back soon for updates!</p>
                </div>
            `;
            return;
        }

        // Create news articles
        newsData.forEach(article => {
            const articleElement = this.createArticleElement(article, section);
            container.appendChild(articleElement);
        });
    }

    // Create individual article element
    createArticleElement(article, section) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'news-article';
        
        const timeAgo = this.getTimeAgo(article.publishedAt);
        
        articleDiv.innerHTML = `
            <div class="article-title">${article.title}</div>
            <div class="article-summary">${article.summary}</div>
            <div class="article-meta">
                <span class="article-source">${article.source}</span>
                <span class="article-time">${timeAgo}</span>
            </div>
        `;

        // Add click handler to open external link
        articleDiv.addEventListener('click', () => {
            window.open(article.url, '_blank', 'noopener,noreferrer');
        });

        return articleDiv;
    }

    // Calculate time ago string
    getTimeAgo(dateString) {
        const now = new Date();
        const published = new Date(dateString);
        const diffInMinutes = Math.floor((now - published) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    }

    // Load sample data for demonstration
    loadSampleData() {
        this.rawNews = [
            {
                title: "Raw Results: New Champion Crowned in Epic Main Event",
                summary: "In a shocking turn of events, a new champion was crowned during Raw's main event, leaving fans on the edge of their seats.",
                source: "WWE.com",
                url: "https://wwe.com",
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                title: "Raw Superstar Makes Surprise Return",
                summary: "After months of speculation, a beloved Raw superstar made their triumphant return to the ring, much to the delight of the WWE Universe.",
                source: "PWInsider",
                url: "https://pwinsider.com",
                publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
            },
            {
                title: "Raw Tag Team Division Heats Up",
                summary: "The Raw tag team division continues to deliver exciting matches as new rivalries emerge and old ones intensify.",
                source: "Fightful",
                url: "https://fightful.com",
                publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
            }
        ];

        this.smackdownNews = [
            {
                title: "SmackDown Live Results: Championship Match Announced",
                summary: "A major championship match has been announced for the next SmackDown, promising to be one of the biggest matches of the year.",
                source: "WWE.com",
                url: "https://wwe.com",
                publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
            },
            {
                title: "SmackDown Superstar Signs New Contract",
                summary: "One of SmackDown's top stars has signed a new multi-year contract, ensuring their future with the blue brand.",
                source: "WrestlingInc",
                url: "https://wrestlinginc.com",
                publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
            },
            {
                title: "SmackDown Women's Division Showcases Talent",
                summary: "The SmackDown women's division continues to prove why it's one of the most competitive in all of professional wrestling.",
                source: "CagesideSeats",
                url: "https://cagesideseats.com",
                publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            }
        ];

        this.displayNews('raw', this.rawNews);
        this.displayNews('smackdown', this.smackdownNews);
    }

    // Setup event listeners
    setupEventListeners() {
        // Add any interactive features here
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' || e.key === 'R') {
                this.refreshNews();
            }
        });

        // Add refresh button functionality if needed
        this.addRefreshButton();
    }

    // Add refresh button
    addRefreshButton() {
        const header = document.querySelector('.header-content');
        const refreshButton = document.createElement('button');
        refreshButton.innerHTML = '🔄 Refresh';
        refreshButton.className = 'refresh-button';
        refreshButton.style.cssText = `
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 25px;
            padding: 10px 20px;
            color: white;
            cursor: pointer;
            margin-top: 15px;
            transition: all 0.3s ease;
        `;
        
        refreshButton.addEventListener('click', () => this.refreshNews());
        refreshButton.addEventListener('mouseenter', () => {
            refreshButton.style.background = 'rgba(255, 255, 255, 0.15)';
        });
        refreshButton.addEventListener('mouseleave', () => {
            refreshButton.style.background = 'var(--glass-bg)';
        });
        
        header.appendChild(refreshButton);
    }

    // Refresh news data
    async refreshNews() {
        const refreshButton = document.querySelector('.refresh-button');
        if (refreshButton) {
            refreshButton.innerHTML = '🔄 Refreshing...';
            refreshButton.disabled = true;
        }

        await this.loadNewsData();

        if (refreshButton) {
            refreshButton.innerHTML = '🔄 Refresh';
            refreshButton.disabled = false;
        }
    }

    // Auto-refresh every 30 minutes
    startAutoRefresh() {
        setInterval(() => {
            this.loadNewsData();
        }, 30 * 60 * 1000); // 30 minutes
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WrestlingNewsHub();
});

// Add some CSS for the refresh button
const style = document.createElement('style');
style.textContent = `
    .refresh-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    
    .no-news {
        text-align: center;
        padding: 2rem;
        opacity: 0.7;
    }
    
    .no-news p {
        margin-bottom: 0.5rem;
    }
`;
document.head.appendChild(style);
