/**
 * Real News Loader - Overrides hardcoded data with real RSS feeds
 */

class RealNewsLoader {
    constructor() {
        this.init();
    }

    async init() {
        console.log('🔄 Loading real wrestling news from RSS feeds...');
        await this.loadRealNews();
        
        // Auto-refresh every 30 minutes
        setInterval(() => {
            this.loadRealNews();
        }, 1800000);
    }

    async loadRealNews() {
        try {
            // Fetch real news data
            const [rawResponse, smackdownResponse] = await Promise.all([
                fetch('data/raw-news.json'),
                fetch('data/smackdown-news.json')
            ]);

            const rawNews = await rawResponse.json();
            const smackdownNews = await smackdownResponse.json();

            // Display real news
            this.displayNews(rawNews, 'raw');
            this.displayNews(smackdownNews, 'smackdown');
            
            // Update stats
            document.getElementById('raw-count').textContent = rawNews.length;
            document.getElementById('smackdown-count').textContent = smackdownNews.length;
            
            console.log(`✅ Loaded ${rawNews.length} Raw articles and ${smackdownNews.length} SmackDown articles from RSS feeds`);
        } catch (error) {
            console.error('❌ Error loading real news:', error);
            console.log('📰 Falling back to hardcoded sample data');
        }
    }

    displayNews(newsArray, category) {
        const container = document.querySelector(`.${category}-section .news-container`);
        if (!container) return;

        container.innerHTML = '';

        newsArray.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            
            // Extract tags from title
            const titleWords = article.title.split(' ').slice(0, 4);
            const tags = titleWords.join(' ');
            
            // Check for breaking news
            const isBreaking = article.title.toLowerCase().includes('breaking') || 
                             article.title.toLowerCase().includes('shocking') ||
                             article.title.toLowerCase().includes('return') ||
                             article.title.toLowerCase().includes('final');
            
            // Format date
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

            // Add click handler to open article
            newsItem.addEventListener('click', () => {
                window.open(article.url, '_blank');
            });

            // Add hover effects
            newsItem.addEventListener('mouseenter', () => {
                newsItem.style.transform = 'translateY(-4px) scale(1.02)';
            });
            newsItem.addEventListener('mouseleave', () => {
                newsItem.style.transform = 'translateY(0) scale(1)';
            });

            container.appendChild(newsItem);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the original script to load, then override
    setTimeout(() => {
        new RealNewsLoader();
    }, 1000);
});
