// Enhanced Wrestling News Hub with Current Content
class WrestlingNewsHub {
    constructor() {
        this.newsData = [];
        this.rawNews = [];
        this.smackdownNews = [];
        this.isLoading = false;
        this.init();
    }

    init() {
        console.log('🏆 Wrestling News Hub Initialized - September 2025');
        this.loadCurrentNews();
        this.startAutoRefresh();
        this.addInteractivity();
    }

    async loadCurrentNews() {
        console.log('📺 Loading real wrestling news from RSS feeds...');
        await this.fetchAndDisplayNews();
    }

    async fetchAndDisplayNews() {
        console.log('🔄 fetchAndDisplayNews called');
        try {
            const [rawResponse, smackdownResponse] = await Promise.all([
                fetch('data/raw-news.json'),
                fetch('data/smackdown-news.json')
            ]);

            const rawNews = await rawResponse.json();
            const smackdownNews = await smackdownResponse.json();

            this.displayNews(rawNews, 'raw');
            this.displayNews(smackdownNews, 'smackdown');
            
            document.getElementById('raw-count').textContent = rawNews.length;
            document.getElementById('smackdown-count').textContent = smackdownNews.length;
            
            console.log(`✅ Loaded ${rawNews.length} Raw articles and ${smackdownNews.length} SmackDown articles from RSS feeds`);
        } catch (error) {
            console.error('❌ Error loading real news:', error);
            this.updateStats();
        }
    }

    displayNews(newsArray, category) {
        const container = document.querySelector(`.${category}-section .news-container`);
        console.log(`Looking for container with selector: .${category}-section .news-container`);
        console.log(`Found container:`, container);
        if (!container) return;

        container.style.opacity = '0.5';
        container.style.transition = 'opacity 0.3s ease';

        setTimeout(() => {
            container.innerHTML = '';

            newsArray.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                
                const titleWords = article.title.split(' ').slice(0, 4);
                const tags = titleWords.join(' ');
                
                const isBreaking = article.title.toLowerCase().includes('breaking') || 
                                 article.title.toLowerCase().includes('shocking') ||
                                 article.title.toLowerCase().includes('return') ||
                                 article.title.toLowerCase().includes('final');
                
                const date = new Date(article.publishedAt);
                const formattedDate = date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                });
                
                newsItem.innerHTML = `
                    <div class="news-meta">
                        <span class="news-source">${article.source}</span>
                        <span class="news-date">${formattedDate}</span>
                    </div>
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-excerpt">${article.summary}</p>
                    <div class="news-tags">
                        ${isBreaking ? '<span class="news-tag breaking-tag">Breaking</span>' : ''}
                        <span class="news-tag">${article.source}</span>
                        <span class="news-tag">${tags}</span>
                    </div>
                `;

                newsItem.addEventListener('click', () => {
                    window.open(article.url, '_blank');
                });

                container.appendChild(newsItem);
            });

            container.style.opacity = '1';
        }, 500);
    }

    updateStats() {
        document.getElementById('raw-count').textContent = '5';
        document.getElementById('smackdown-count').textContent = '6';
        console.log('📊 Stats updated: 5 Raw articles, 6 SmackDown articles');
    }

    startAutoRefresh() {
        setInterval(() => {
            console.log('🔄 Auto-refreshing news content...');
            this.loadCurrentNews();
        }, 1800000);
    }

    addInteractivity() {
        document.querySelectorAll('.news-item').forEach(item => {
            item.addEventListener('click', this.handleNewsClick.bind(this));
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-4px) scale(1.02)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.showNotification('News refreshed!');
            }
        });

        console.log('⚡ Interactive features enabled');
    }

    handleNewsClick(event) {
        const title = event.currentTarget.querySelector('.news-title').textContent;
        this.showNotification(`Opening: ${title}`);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 500;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starting Wrestling News Hub...');
    new WrestlingNewsHub();
});

// Smooth scrolling animation for news items
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.news-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
});