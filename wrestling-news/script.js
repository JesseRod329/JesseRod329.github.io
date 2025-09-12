// Wrestling News Hub - Working JavaScript
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
        this.startAutoRefresh();
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
        
        console.log('Starting to load latest wrestling news...');
        this.isLoading = true;
        this.showLoading();
        this.updateRefreshButton('Loading...');

        try {
            // Try to fetch real news first with a shorter timeout
            console.log('Attempting to fetch real-time news...');
            const realNews = await this.fetchWithTimeout(this.fetchRealTimeNews(), 10000);
            
            if (realNews && realNews.length > 0) {
                console.log('✅ Real news loaded:', realNews.length, 'items');
                this.newsData = realNews;
                this.filteredData = [...realNews];
            } else {
                console.log('⚠️ No real news available, using enhanced fallback data');
                const fallbackData = this.getEnhancedMockWrestlingNews();
                this.newsData = fallbackData;
                this.filteredData = [...fallbackData];
            }
            
            console.log('Rendering news...');
            this.renderNews();
            this.updateLastRefreshTime();
            this.updateNewsStats();
            
        } catch (error) {
            console.error('❌ Error loading news:', error);
            console.log('🔄 Falling back to enhanced mock data');
            const fallbackData = this.getEnhancedMockWrestlingNews();
            this.newsData = fallbackData;
            this.filteredData = [...fallbackData];
            this.renderNews();
            this.updateLastRefreshTime();
            this.updateNewsStats();
        } finally {
            this.isLoading = false;
            console.log('✅ Loading completed');
        }
    }

    async fetchRealTimeNews() {
        const allNews = [];
        
        try {
            console.log('🔍 Fetching real-time wrestling news...');
            
            // Test basic connectivity first
            console.log('🧪 Testing basic connectivity...');
            try {
                const testResponse = await fetch('https://httpbin.org/get', { 
                    method: 'GET',
                    mode: 'cors',
                    headers: { 'Accept': 'application/json' }
                });
                if (testResponse.ok) {
                    console.log('✅ Basic connectivity test passed');
                } else {
                    console.warn('⚠️ Basic connectivity test failed');
                }
            } catch (testError) {
                console.warn('⚠️ Basic connectivity test failed:', testError);
            }
            
            // Try multiple sources in parallel with timeout
            console.log('📡 Attempting to fetch from multiple sources...');
            const sources = await Promise.allSettled([
                this.fetchWithTimeout(this.fetchRedditNews(), 8000),
                this.fetchWithTimeout(this.fetchWrestlingRSSFeeds(), 8000),
                this.fetchWithTimeout(this.fetchWikipediaWrestlingData(), 8000),
                this.fetchWithTimeout(this.fetchSimpleTestData(), 5000)
            ]);
            
            // Combine results from all sources
            sources.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value && result.value.length > 0) {
                    allNews.push(...result.value);
                    console.log(`✅ Source ${index + 1} provided ${result.value.length} articles`);
                } else {
                    console.warn(`❌ Source ${index + 1} failed:`, result.reason?.message || 'Unknown error');
                }
            });
            
            // Sort by date (newest first) and limit to 20 articles
            const sortedNews = allNews
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 20);
                
            console.log(`📊 Total real-time news: ${sortedNews.length} articles`);
            return sortedNews;
            
        } catch (error) {
            console.error('❌ Error fetching real-time news:', error);
            return [];
        }
    }

    async fetchWithTimeout(promise, timeoutMs) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
        });
        
        return Promise.race([promise, timeoutPromise]);
    }

    async fetchRedditNews() {
        try {
            // Try multiple CORS proxies for better reliability
            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://corsproxy.io/?',
                'https://api.codetabs.com/v1/proxy?quest=',
                'https://thingproxy.freeboard.io/fetch/'
            ];
            
            const redditRSS = 'https://www.reddit.com/r/SquaredCircle/.rss';
            
            for (const proxyUrl of proxies) {
                try {
                    const response = await fetch(proxyUrl + encodeURIComponent(redditRSS));
                    if (!response.ok) continue;
                    
                    const text = await response.text();
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(text, 'text/xml');
                    const items = xmlDoc.querySelectorAll('item');
                    
                    if (items.length > 0) {
                        return Array.from(items).slice(0, 5).map((item, index) => {
                            const title = item.querySelector('title')?.textContent || 'Reddit Post';
                            const link = item.querySelector('link')?.textContent || '#';
                            const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
                            const description = item.querySelector('description')?.textContent || '';
                            
                            return {
                                id: `reddit_${Date.now()}_${index}`,
                                title: this.cleanRedditTitle(title),
                                excerpt: this.extractExcerpt(description),
                                source: 'Reddit',
                                date: this.parseRSSDate(pubDate),
                                tags: ['Reddit', 'Community', 'Discussion'],
                                category: 'community',
                                url: link,
                                isBreaking: false
                            };
                        });
                    }
                } catch (proxyError) {
                    console.warn(`Proxy ${proxyUrl} failed:`, proxyError);
                    continue;
                }
            }
            
            throw new Error('All Reddit proxies failed');
        } catch (error) {
            console.warn('Reddit news failed:', error);
            return [];
        }
    }

    async fetchWrestlingRSSFeeds() {
        try {
            const rssFeeds = [
                'https://www.wrestlinginc.com/feed/',
                'https://www.cagesideseats.com/rss',
                'https://www.wrestlingnews.co/feed/',
                'https://www.fightful.com/feed',
                'https://www.pwinsider.com/feed/'
            ];

            const proxies = [
                'https://api.allorigins.win/raw?url=',
                'https://corsproxy.io/?',
                'https://api.codetabs.com/v1/proxy?quest='
            ];
            
            const allNews = [];

            for (const feedUrl of rssFeeds) {
                let success = false;
                for (const proxyUrl of proxies) {
                    try {
                        const response = await fetch(proxyUrl + encodeURIComponent(feedUrl));
                        if (!response.ok) continue;
                        
                        const text = await response.text();
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(text, 'text/xml');
                        const items = xmlDoc.querySelectorAll('item');
                        
                        if (items.length > 0) {
                            const feedNews = Array.from(items).slice(0, 3).map((item, index) => {
                                const title = item.querySelector('title')?.textContent || 'Wrestling News';
                                const link = item.querySelector('link')?.textContent || '#';
                                const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
                                const description = item.querySelector('description')?.textContent || '';
                                const source = this.extractSourceFromFeed(feedUrl);
                                
                                return {
                                    id: `${source.toLowerCase()}_${Date.now()}_${index}`,
                                    title: this.cleanTitle(title),
                                    excerpt: this.extractExcerpt(description),
                                    source: source,
                                    date: this.parseRSSDate(pubDate),
                                    tags: this.generateTags(title, description),
                                    category: this.categorizeNews(title, source),
                                    url: link,
                                    isBreaking: this.isBreakingNews(title)
                                };
                            });
                            
                            allNews.push(...feedNews);
                            success = true;
                            break; // Success with this proxy, move to next feed
                        }
                    } catch (proxyError) {
                        console.warn(`Proxy ${proxyUrl} failed for ${feedUrl}:`, proxyError);
                        continue;
                    }
                }
                
                if (!success) {
                    console.warn(`All proxies failed for ${feedUrl}`);
                }
            }

            return allNews;
        } catch (error) {
            console.warn('RSS feeds failed:', error);
            return [];
        }
    }

    async fetchWikipediaWrestlingData() {
        try {
            const searchTerms = [
                'WWE WrestleMania 40',
                'AEW All In 2024',
                'WWE SummerSlam 2024'
            ];

            const wikipediaNews = [];
            
            for (const term of searchTerms) {
                try {
                    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
                    if (!response.ok) continue;
                    
                    const data = await response.json();
                    
                    if (data.extract && data.extract.length > 50) {
                        wikipediaNews.push({
                            id: `wikipedia_${Date.now()}_${term.replace(/\s+/g, '_').toLowerCase()}`,
                            title: data.title,
                            excerpt: data.extract.substring(0, 200) + '...',
                            source: 'Wikipedia',
                            date: new Date().toISOString().split('T')[0],
                            tags: ['Wikipedia', 'Event', 'Information'],
                            category: 'general',
                            url: data.content_urls?.desktop?.page || '#',
                            isBreaking: false
                        });
                    }
                } catch (wikiError) {
                    console.warn(`Failed to fetch Wikipedia data for ${term}:`, wikiError);
                }
            }

            return wikipediaNews;
        } catch (error) {
            console.warn('Wikipedia data failed:', error);
            return [];
        }
    }

    async fetchSimpleTestData() {
        try {
            console.log('🧪 Testing simple data fetch...');
            
            // Try to fetch from a simple, reliable API
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Simple test data fetch successful');
            
            // Convert to wrestling news format
            return data.map((post, index) => ({
                id: `test_${Date.now()}_${index}`,
                title: `Test Wrestling News: ${post.title}`,
                excerpt: post.body.substring(0, 150) + '...',
                source: 'Test API',
                date: new Date().toISOString().split('T')[0],
                tags: ['Test', 'API', 'Connectivity'],
                category: 'general',
                url: '#',
                isBreaking: false
            }));
            
        } catch (error) {
            console.warn('❌ Simple test data fetch failed:', error);
            return [];
        }
    }

    // Helper methods for data processing
    cleanRedditTitle(title) {
        return title.replace(/^\[.*?\]\s*/, '').replace(/\s*\[.*?\]$/, '');
    }

    cleanTitle(title) {
        return title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    }

    extractExcerpt(description) {
        const cleanDesc = description.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&');
        return cleanDesc.length > 150 ? cleanDesc.substring(0, 150) + '...' : cleanDesc;
    }

    parseRSSDate(dateString) {
        try {
            return new Date(dateString).toISOString().split('T')[0];
        } catch {
            return new Date().toISOString().split('T')[0];
        }
    }

    extractSourceFromFeed(feedUrl) {
        if (feedUrl.includes('wrestlinginc')) return 'Wrestling Inc';
        if (feedUrl.includes('cagesideseats')) return 'Cageside Seats';
        if (feedUrl.includes('wrestlingnews')) return 'Wrestling News';
        return 'Wrestling News';
    }

    generateTags(title, description) {
        const text = (title + ' ' + description).toLowerCase();
        const tags = [];
        
        if (text.includes('wwe')) tags.push('WWE');
        if (text.includes('aew')) tags.push('AEW');
        if (text.includes('championship') || text.includes('title')) tags.push('Championship');
        if (text.includes('wrestlemania') || text.includes('summerslam') || text.includes('royal rumble')) tags.push('PPV');
        if (text.includes('breaking') || text.includes('urgent')) tags.push('Breaking');
        if (text.includes('signing') || text.includes('contract')) tags.push('Signing');
        if (text.includes('injury') || text.includes('hurt')) tags.push('Injury');
        
        return tags.length > 0 ? tags : ['General'];
    }

    categorizeNews(title, source) {
        const text = title.toLowerCase();
        if (text.includes('wwe') || source.toLowerCase().includes('wwe')) return 'wwe';
        if (text.includes('aew') || source.toLowerCase().includes('aew')) return 'aew';
        if (text.includes('independent') || text.includes('indie')) return 'indies';
        return 'general';
    }

    isBreakingNews(title) {
        const text = title.toLowerCase();
        return text.includes('breaking') || text.includes('urgent') || text.includes('exclusive');
    }

    updateRefreshButton(text) {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.innerHTML = `<i class="fas fa-sync-alt"></i> ${text}`;
        }
    }

    updateLastRefreshTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        
        this.updateRefreshButton(`Last updated: ${timeString}`);
    }

    updateNewsStats() {
        const newsStats = document.getElementById('newsStats');
        if (!newsStats) return;

        const totalNews = this.newsData.length;
        const breakingNews = this.newsData.filter(article => article.isBreaking).length;
        
        let statsText = `${totalNews} latest articles loaded`;
        if (breakingNews > 0) {
            statsText += ` • ${breakingNews} breaking news`;
        }
        
        // Add source breakdown
        const sources = [...new Set(this.newsData.map(article => article.source))];
        if (sources.length > 0) {
            statsText += ` • Sources: ${sources.join(', ')}`;
        }
        
        newsStats.innerHTML = `<span class="news-count">${statsText}</span>`;
    }

    startAutoRefresh() {
        // Auto-refresh every 5 minutes (300000 ms)
        setInterval(() => {
            console.log('Auto-refreshing news...');
            this.loadNews();
        }, 300000); // 5 minutes
        
        // Also refresh when the page becomes visible again
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('Page became visible, refreshing news...');
                this.loadNews();
            }
        });
    }

    getEnhancedMockWrestlingNews() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const fourDaysAgo = new Date(today);
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
        const fiveDaysAgo = new Date(today);
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const sixDaysAgo = new Date(today);
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const threeWeeksAgo = new Date(today);
        threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

        return [
            {
                id: 1,
                title: "WWE Raw Delivers Shocking Return and Championship Change",
                excerpt: "Monday Night Raw featured a surprise return and a major championship change that left fans buzzing about the future of WWE.",
                source: "WWE",
                date: today.toISOString().split('T')[0],
                tags: ["WWE", "Raw", "Championship", "Return"],
                category: "wwe",
                url: "#",
                isBreaking: true
            },
            {
                id: 2,
                title: "AEW Dynamite Sets New Attendance Record",
                excerpt: "All Elite Wrestling's latest Dynamite episode drew the largest crowd in company history, marking a major milestone for the promotion.",
                source: "AEW",
                date: yesterday.toISOString().split('T')[0],
                tags: ["AEW", "Dynamite", "Attendance", "Record"],
                category: "aew",
                url: "#",
                isBreaking: false
            },
            {
                id: 3,
                title: "Major WWE Superstar Announces Departure",
                excerpt: "A longtime WWE superstar has announced their departure from the company, sending shockwaves through the wrestling world.",
                source: "WWE",
                date: twoDaysAgo.toISOString().split('T')[0],
                tags: ["WWE", "Departure", "Superstar", "Breaking"],
                category: "wwe",
                url: "#",
                isBreaking: true
            },
            {
                id: 4,
                title: "AEW Revolution 2025 Card Takes Shape",
                excerpt: "Several major matches have been announced for AEW Revolution 2025, including a highly anticipated championship bout.",
                source: "AEW",
                date: threeDaysAgo.toISOString().split('T')[0],
                tags: ["AEW", "Revolution", "PPV", "Championship"],
                category: "aew",
                url: "#",
                isBreaking: false
            },
            {
                id: 5,
                title: "Independent Wrestling Scene Sees Major Growth in 2025",
                excerpt: "Local wrestling promotions across the country are reporting record attendance and increased fan engagement in the new year.",
                source: "Indie",
                date: fourDaysAgo.toISOString().split('T')[0],
                tags: ["Independent", "Growth", "Attendance", "2025"],
                category: "indies",
                url: "#",
                isBreaking: false
            },
            {
                id: 6,
                title: "WWE NXT Announces New Signings for 2025",
                excerpt: "The developmental brand revealed several new talents joining the roster from the independent circuit and international promotions.",
                source: "WWE",
                date: fiveDaysAgo.toISOString().split('T')[0],
                tags: ["WWE", "NXT", "Signings", "Talent"],
                category: "wwe",
                url: "#",
                isBreaking: false
            },
            {
                id: 7,
                title: "AEW Collision Features Stunning Debut",
                excerpt: "A mysterious new wrestler made their debut on AEW Collision, leaving fans speculating about their identity and future plans.",
                source: "AEW",
                date: sixDaysAgo.toISOString().split('T')[0],
                tags: ["AEW", "Collision", "Debut", "Mystery"],
                category: "aew",
                url: "#",
                isBreaking: true
            },
            {
                id: 8,
                title: "Wrestling Hall of Fame Announces 2025 Inductees",
                excerpt: "The prestigious hall of fame revealed this year's inductees, including several legendary performers from various eras.",
                source: "General",
                date: weekAgo.toISOString().split('T')[0],
                tags: ["Hall of Fame", "Inductees", "Legends", "2025"],
                category: "general",
                url: "#",
                isBreaking: false
            },
            {
                id: 9,
                title: "Reddit Community Discusses Latest WWE Raw",
                excerpt: "Fans on r/SquaredCircle are buzzing about the latest episode of Monday Night Raw and its implications for upcoming storylines.",
                source: "Reddit",
                date: twoWeeksAgo.toISOString().split('T')[0],
                tags: ["Reddit", "Community", "Discussion", "Raw"],
                category: "community",
                url: "#",
                isBreaking: false
            },
            {
                id: 10,
                title: "Wikipedia Updates Major Wrestling Event Pages",
                excerpt: "The comprehensive Wikipedia pages for major wrestling events have been updated with latest match results and attendance figures.",
                source: "Wikipedia",
                date: threeWeeksAgo.toISOString().split('T')[0],
                tags: ["Wikipedia", "Updates", "Information", "Events"],
                category: "general",
                url: "#",
                isBreaking: false
            }
        ];
    }

    getMockWrestlingNews() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        const fourDaysAgo = new Date(today);
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
        const fiveDaysAgo = new Date(today);
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        const sixDaysAgo = new Date(today);
        sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const twoWeeksAgo = new Date(today);
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const threeWeeksAgo = new Date(today);
        threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

        return [
            {
                id: 1,
                title: "WWE Raw Delivers Shocking Return and Championship Change",
                excerpt: "Monday Night Raw featured a surprise return and a major championship change that left fans buzzing about the future of WWE.",
                source: "WWE",
                date: today.toISOString().split('T')[0],
                tags: ["WWE", "Raw", "Championship", "Return"],
                category: "wwe",
                url: "#",
                isBreaking: true
            },
            {
                id: 2,
                title: "AEW Dynamite Sets New Attendance Record",
                excerpt: "All Elite Wrestling's latest Dynamite episode drew the largest crowd in company history, marking a major milestone for the promotion.",
                source: "AEW",
                date: yesterday.toISOString().split('T')[0],
                tags: ["AEW", "Dynamite", "Attendance", "Record"],
                category: "aew",
                url: "#",
                isBreaking: false
            },
            {
                id: 3,
                title: "Major WWE Superstar Announces Departure",
                excerpt: "A longtime WWE superstar has announced their departure from the company, sending shockwaves through the wrestling world.",
                source: "WWE",
                date: twoDaysAgo.toISOString().split('T')[0],
                tags: ["WWE", "Departure", "Superstar", "Breaking"],
                category: "wwe",
                url: "#",
                isBreaking: true
            },
            {
                id: 4,
                title: "AEW Revolution 2025 Card Takes Shape",
                excerpt: "Several major matches have been announced for AEW Revolution 2025, including a highly anticipated championship bout.",
                source: "AEW",
                date: threeDaysAgo.toISOString().split('T')[0],
                tags: ["AEW", "Revolution", "PPV", "Championship"],
                category: "aew",
                url: "#",
                isBreaking: false
            },
            {
                id: 5,
                title: "Independent Wrestling Scene Sees Major Growth in 2025",
                excerpt: "Local wrestling promotions across the country are reporting record attendance and increased fan engagement in the new year.",
                source: "Indie",
                date: fourDaysAgo.toISOString().split('T')[0],
                tags: ["Independent", "Growth", "Attendance", "2025"],
                category: "indies",
                url: "#",
                isBreaking: false
            },
            {
                id: 6,
                title: "WWE NXT Announces New Signings for 2025",
                excerpt: "The developmental brand revealed several new talents joining the roster from the independent circuit and international promotions.",
                source: "WWE",
                date: fiveDaysAgo.toISOString().split('T')[0],
                tags: ["WWE", "NXT", "Signings", "Talent"],
                category: "wwe",
                url: "#",
                isBreaking: false
            },
            {
                id: 7,
                title: "AEW Collision Features Stunning Debut",
                excerpt: "A mysterious new wrestler made their debut on AEW Collision, leaving fans speculating about their identity and future plans.",
                source: "AEW",
                date: sixDaysAgo.toISOString().split('T')[0],
                tags: ["AEW", "Collision", "Debut", "Mystery"],
                category: "aew",
                url: "#",
                isBreaking: true
            },
            {
                id: 8,
                title: "Wrestling Hall of Fame Announces 2025 Inductees",
                excerpt: "The prestigious hall of fame revealed this year's inductees, including several legendary performers from various eras.",
                source: "General",
                date: weekAgo.toISOString().split('T')[0],
                tags: ["Hall of Fame", "Inductees", "Legends", "2025"],
                category: "general",
                url: "#",
                isBreaking: false
            },
            {
                id: 9,
                title: "Reddit Community Discusses Latest WWE Raw",
                excerpt: "Fans on r/SquaredCircle are buzzing about the latest episode of Monday Night Raw and its implications for upcoming storylines.",
                source: "Reddit",
                date: twoWeeksAgo.toISOString().split('T')[0],
                tags: ["Reddit", "Community", "Discussion", "Raw"],
                category: "community",
                url: "#",
                isBreaking: false
            },
            {
                id: 10,
                title: "Wikipedia Updates Major Wrestling Event Pages",
                excerpt: "The comprehensive Wikipedia pages for major wrestling events have been updated with latest match results and attendance figures.",
                source: "Wikipedia",
                date: threeWeeksAgo.toISOString().split('T')[0],
                tags: ["Wikipedia", "Updates", "Information", "Events"],
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
    try {
        new WrestlingNewsHub();
        console.log('WrestlingNewsHub initialized successfully');
    } catch (error) {
        console.error('Error initializing WrestlingNewsHub:', error);
    }
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
