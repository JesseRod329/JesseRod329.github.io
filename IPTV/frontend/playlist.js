/** Playlist management and channel loading */
class PlaylistManager {
    constructor() {
        // Try to get API URL from app first, then localStorage, then default
        let apiUrl = 'http://localhost:5001/api';
        if (window.app && window.app.apiBaseUrl) {
            apiUrl = window.app.apiBaseUrl;
        } else {
            apiUrl = localStorage.getItem('apiBaseUrl') || apiUrl;
        }
        this.apiBaseUrl = apiUrl;
        this.channels = [];
        this.categories = [];
        this.countries = [];
        this.networks = [];
        this.currentPage = 0;
        this.pageSize = 50;
        this.hasMore = true;
        this.isLoading = false;
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        
        this.init();
    }
    
    getCachedData(key) {
        try {
            const cached = localStorage.getItem(`cache_${key}`);
            if (!cached) return null;
            
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp > this.cacheExpiry) {
                localStorage.removeItem(`cache_${key}`);
                return null;
            }
            return data.value;
        } catch {
            return null;
        }
    }
    
    setCachedData(key, value) {
        try {
            localStorage.setItem(`cache_${key}`, JSON.stringify({
                value,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Cache storage failed:', e);
        }
    }
    
    init() {
        // Fetch playlist button
        const fetchBtn = document.getElementById('fetch-playlist-btn');
        fetchBtn.addEventListener('click', () => this.fetchIPTVOrgPlaylist());
        
        // Import playlist button
        const importBtn = document.getElementById('import-playlist-btn');
        importBtn.addEventListener('click', () => this.showImportModal());
        
        // Import submit
        const importSubmitBtn = document.getElementById('import-submit-btn');
        if (importSubmitBtn) {
            importSubmitBtn.addEventListener('click', () => this.importPlaylist());
        }
        
        // File input
        const fileInput = document.getElementById('playlist-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }
        
        // Load initial data
        this.loadCategories();
        this.loadCountries();
        this.loadNetworks();
        this.loadChannels();
        
        // Auto-import playlist on startup if not already imported
        this.autoImportOnStartup();
    }
    
    async autoImportOnStartup() {
        // Check if we should auto-import on startup
        const lastImportTime = localStorage.getItem('lastPlaylistImport');
        const shouldAutoImport = localStorage.getItem('autoImportOnStartup') !== 'false';
        
        // If auto-import is disabled, skip
        if (!shouldAutoImport) {
            console.log('Auto-import disabled in settings');
            return;
        }
        
        // Check if channels already exist in database (get a few to check)
        try {
            const response = await fetch(`${this.apiBaseUrl}/channels?limit=100`);
            const data = await response.json();
            
            // If we have less than 100 channels, consider importing
            // (iptv-org playlist has thousands of channels)
            if (!data.channels || data.channels.length < 100) {
                console.log(`Found only ${data.channels?.length || 0} channels, auto-importing iptv-org playlist...`);
                const defaultUrl = localStorage.getItem('defaultPlaylistUrl') || 'https://iptv-org.github.io/iptv/index.m3u';
                await this.fetchIPTVOrgPlaylistSilent(defaultUrl);
                localStorage.setItem('lastPlaylistImport', new Date().toISOString());
            } else {
                console.log(`Found ${data.channels.length}+ existing channels, skipping auto-import`);
            }
        } catch (error) {
            console.error('Error checking for existing channels:', error);
            // If check fails, try to import anyway (first time setup)
            const defaultUrl = localStorage.getItem('defaultPlaylistUrl') || 'https://iptv-org.github.io/iptv/index.m3u';
            await this.fetchIPTVOrgPlaylistSilent(defaultUrl);
            localStorage.setItem('lastPlaylistImport', new Date().toISOString());
        }
    }
    
    async fetchIPTVOrgPlaylistSilent(url) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/playlists/fetch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`Auto-imported ${data.imported} channels`);
                // Reload channels after import
                await this.loadChannels();
                await this.loadCategories();
                await this.loadCountries();
                await this.loadNetworks();
            } else {
                console.error('Auto-import failed:', data.error);
            }
        } catch (error) {
            console.error('Error during auto-import:', error);
        }
    }
    
    async fetchIPTVOrgPlaylist() {
        const btn = document.getElementById('fetch-playlist-btn');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Fetching...';
        
        if (window.progressManager) {
            window.progressManager.show('Fetching playlist...', 10);
        }
        
        try {
            const defaultUrl = localStorage.getItem('defaultPlaylistUrl') || 'https://iptv-org.github.io/iptv/index.m3u';
            
            const response = await fetch(`${this.apiBaseUrl}/playlists/fetch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: defaultUrl })
            });
            
            const data = await response.json();
            
            if (window.progressManager) {
                window.progressManager.update(50, 'Processing channels...');
            }
            
            if (data.success) {
                if (window.progressManager) {
                    window.progressManager.update(100, 'Complete!');
                    setTimeout(() => window.progressManager.hide(), 1000);
                }
                if (window.toastManager) {
                    window.toastManager.success(`Successfully imported ${data.imported} channels!`);
                } else {
                    alert(`Successfully imported ${data.imported} channels!`);
                }
                await this.loadChannels();
                await this.loadCategories();
                await this.loadCountries();
                await this.loadNetworks();
            } else {
                throw new Error(data.error || 'Failed to fetch playlist');
            }
        } catch (error) {
            console.error('Error fetching playlist:', error);
            if (window.progressManager) {
                window.progressManager.hide();
            }
            if (window.toastManager) {
                window.toastManager.error(`Error fetching playlist: ${error.message}`);
            } else {
                alert(`Error fetching playlist: ${error.message}`);
            }
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }
    
    showImportModal() {
        const modal = document.getElementById('import-modal');
        modal.classList.add('active');
    }
    
    async importPlaylist() {
        const urlInput = document.getElementById('playlist-url-input');
        const url = urlInput.value.trim();
        
        if (!url) {
            alert('Please enter a playlist URL');
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/playlists/fetch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });
            
            const data = await response.json();
            
            if (data.success) {
                if (window.toastManager) {
                    window.toastManager.success(`Successfully imported ${data.imported} channels!`);
                } else {
                    alert(`Successfully imported ${data.imported} channels!`);
                }
                this.closeImportModal();
                await this.loadChannels();
                await this.loadCategories();
                await this.loadCountries();
                await this.loadNetworks();
            } else {
                throw new Error(data.error || 'Failed to import playlist');
            }
        } catch (error) {
            console.error('Error importing playlist:', error);
            if (window.toastManager) {
                window.toastManager.error(`Error importing playlist: ${error.message}`);
            } else {
                alert(`Error importing playlist: ${error.message}`);
            }
        }
    }
    
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            
            // Parse M3U content
            const channels = this.parseM3U(content);
            
            if (channels.length === 0) {
                alert('No valid channels found in playlist file');
                return;
            }
            
            // Import channels via API
            try {
                // For file upload, we'll send each channel individually
                // In a production app, you might want a bulk import endpoint
                let imported = 0;
                for (const channel of channels) {
                    if (channel.url) {
                        // Create a temporary playlist URL or send channel data directly
                        // For now, we'll use the fetch endpoint with a data URL
                        // This is a simplified approach - you might want a dedicated endpoint
                        imported++;
                    }
                }
                
                // Since we don't have a direct channel import endpoint,
                // we'll create a data URL and use the fetch endpoint
                const m3uContent = this.generateM3U(channels);
                const dataUrl = `data:text/plain;base64,${btoa(m3uContent)}`;
                
                // Note: This won't work with data URLs in the backend
                // You'd need to implement a direct channel import endpoint
                alert(`Found ${channels.length} channels. Please use the URL import feature or implement a direct import endpoint.`);
            } catch (error) {
                console.error('Error importing file:', error);
                alert(`Error importing file: ${error.message}`);
            }
        };
        
        reader.readAsText(file);
    }
    
    parseM3U(content) {
        const channels = [];
        const lines = content.trim().split('\n');
        
        let i = 0;
        while (i < lines.length) {
            const line = lines[i].trim();
            
            if (line.startsWith('#EXTINF:')) {
                const channel = this.parseExtInf(line);
                i++;
                
                if (i < lines.length) {
                    const url = lines[i].trim();
                    if (url && !url.startsWith('#')) {
                        channel.url = url;
                        channels.push(channel);
                    }
                }
            }
            i++;
        }
        
        return channels;
    }
    
    parseExtInf(extinfLine) {
        const channel = {
            name: '',
            url: '',
            logo: null,
            category: null,
            country: null,
            language: null,
            tvg_id: null,
            tvg_name: null,
            group_title: null
        };
        
        // Extract tvg-id
        const tvgIdMatch = extinfLine.match(/tvg-id="([^"]*)"/);
        if (tvgIdMatch) channel.tvg_id = tvgIdMatch[1];
        
        // Extract tvg-name
        const tvgNameMatch = extinfLine.match(/tvg-name="([^"]*)"/);
        if (tvgNameMatch) channel.tvg_name = tvgNameMatch[1];
        
        // Extract logo
        const logoMatch = extinfLine.match(/tvg-logo="([^"]*)"/);
        if (logoMatch) channel.logo = logoMatch[1];
        
        // Extract group-title
        const groupMatch = extinfLine.match(/group-title="([^"]*)"/);
        if (groupMatch) {
            channel.group_title = groupMatch[1];
            const group = groupMatch[1];
            if (group.includes('|')) {
                const parts = group.split('|');
                if (parts.length >= 2) {
                    channel.category = parts[0].trim();
                    channel.country = parts[1].trim();
                }
            } else {
                channel.category = group;
            }
        }
        
        // Extract channel name
        const nameMatch = extinfLine.match(/,(.+)$/);
        if (nameMatch) {
            channel.name = nameMatch[1].trim();
        } else if (channel.tvg_name) {
            channel.name = channel.tvg_name;
        }
        
        return channel;
    }
    
    generateM3U(channels) {
        let m3u = '#EXTM3U\n';
        for (const channel of channels) {
            m3u += `#EXTINF:-1`;
            if (channel.tvg_id) m3u += ` tvg-id="${channel.tvg_id}"`;
            if (channel.tvg_name) m3u += ` tvg-name="${channel.tvg_name}"`;
            if (channel.logo) m3u += ` tvg-logo="${channel.logo}"`;
            if (channel.group_title) m3u += ` group-title="${channel.group_title}"`;
            m3u += `,${channel.name}\n`;
            m3u += `${channel.url}\n`;
        }
        return m3u;
    }
    
    async loadChannels(filters = {}, append = false) {
        // Prevent concurrent loads
        if (this.isLoading) return;
        this.isLoading = true;
        
        // Sync API URL from app if available
        if (window.app && window.app.apiBaseUrl) {
            this.apiBaseUrl = window.app.apiBaseUrl;
        } else {
            // Fallback: get from localStorage or detect
            this.apiBaseUrl = localStorage.getItem('apiBaseUrl') || this.apiBaseUrl || 'http://localhost:5001/api';
        }
        
        // Reset pagination if not appending
        if (!append) {
            this.currentPage = 0;
            this.channels = [];
        }
        
        // Show skeleton loading only on first load
        if (!append && window.channelBrowser) {
            window.channelBrowser.showSkeleton();
        }
        
        try {
            const params = new URLSearchParams();
            if (filters.category) params.append('category', filters.category);
            if (filters.country) params.append('country', filters.country);
            if (filters.search) params.append('search', filters.search);
            
            // Sorting
            const sortBy = localStorage.getItem('channelSort') || 'name';
            params.append('sort', sortBy);
            
            // Pagination
            const offset = this.currentPage * this.pageSize;
            params.append('limit', this.pageSize);
            params.append('offset', offset);
            
            const apiUrl = `${this.apiBaseUrl}/channels?${params}`;
            console.log('Loading channels from:', apiUrl);
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data || !data.channels) {
                throw new Error('Invalid response format from API');
            }
            
            const newChannels = data.channels || [];
            
            if (append) {
                this.channels = [...this.channels, ...newChannels];
            } else {
                this.channels = newChannels;
            }
            
            this.hasMore = newChannels.length === this.pageSize;
            this.currentPage++;
            
            // Store current filters for grouping
            this.currentFilters = filters;
            
            // Update channel display
            if (window.channelBrowser) {
                const groupByCountry = localStorage.getItem('groupByCountry') === 'true';
                const groupByNetwork = localStorage.getItem('groupByNetwork') === 'true';
                
                // Allow grouping even when filters are applied
                if (groupByNetwork) {
                    window.channelBrowser.displayChannelsByNetwork(this.channels);
                } else if (groupByCountry) {
                    window.channelBrowser.displayChannelsByCountry(this.channels);
                } else {
                    window.channelBrowser.displayChannels(this.channels);
                }
                
                // Setup infinite scroll observer
                this.setupInfiniteScroll();
            }
            
            // Sync quick filter buttons
            if (window.app) {
                window.app.syncQuickFilterButtons();
            }
            
            // Update keyboard manager with channels
            if (window.keyboardManager) {
                window.keyboardManager.setChannels(this.channels);
            }
        } catch (error) {
            console.error('Error loading channels:', error);
            const errorMsg = error.message || 'Failed to load channels';
            const currentApiUrl = this.apiBaseUrl || 'Not set';
            
            if (window.toastManager) {
                window.toastManager.error(`Failed to load channels: ${errorMsg}`);
            } else {
                this.showError(`Failed to load channels: ${errorMsg}. Check your API URL in settings.`);
            }
            
            // Show error state with helpful message
            if (window.channelBrowser && window.channelBrowser.container && !append) {
                const detectedHost = window.location.hostname;
                const suggestedUrl = detectedHost !== 'localhost' && detectedHost !== '127.0.0.1' 
                    ? `http://${detectedHost}:5001/api`
                    : 'http://192.168.1.152:5001/api';
                
                window.channelBrowser.container.innerHTML = `
                    <div class="empty-state">
                        <p style="font-size: 18px; margin-bottom: 15px; color: var(--text-primary); font-weight: bold;">⚠️ Failed to Load Channels</p>
                        <p style="font-size: 14px; color: var(--text-primary); margin-bottom: 10px;"><strong>Current API URL:</strong></p>
                        <p style="font-size: 12px; color: var(--warning-color); margin-bottom: 15px; word-break: break-all; background: rgba(255,160,10,0.1); padding: 10px; border-radius: 4px;">${currentApiUrl}</p>
                        <p style="font-size: 14px; color: var(--text-primary); margin-bottom: 10px;"><strong>Suggested URL:</strong></p>
                        <p style="font-size: 12px; color: var(--success-color); margin-bottom: 20px; word-break: break-all; background: rgba(70,211,105,0.1); padding: 10px; border-radius: 4px;">${suggestedUrl}</p>
                        <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 20px;">Go to Settings (⚙️) and update the API URL if it's incorrect.</p>
                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            <button class="btn-primary" onclick="window.playlistManager.loadChannels(window.playlistManager.currentFilters || {})">🔄 Retry</button>
                            <button class="btn-secondary" onclick="window.app.showSettings()">⚙️ Open Settings</button>
                        </div>
                    </div>
                `;
            }
        } finally {
            this.isLoading = false;
        }
    }
    
    setupInfiniteScroll() {
        const container = document.getElementById('channels-container');
        if (!container || !this.hasMore) return;
        
        // Remove existing observer
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        // Create sentinel element
        let sentinel = container.querySelector('.scroll-sentinel');
        if (!sentinel) {
            sentinel = document.createElement('div');
            sentinel.className = 'scroll-sentinel';
            container.appendChild(sentinel);
        }
        
        // Create intersection observer
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.hasMore && !this.isLoading) {
                    this.loadChannels(this.currentFilters || {}, true);
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        this.intersectionObserver.observe(sentinel);
    }
    
    async loadCategories() {
        // Check cache first
        const cached = this.getCachedData('categories');
        if (cached) {
            this.categories = cached;
            this.updateCategoryFilter();
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/categories`);
            const data = await response.json();
            
            this.categories = data.categories || [];
            this.setCachedData('categories', this.categories);
            this.updateCategoryFilter();
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }
    
    updateCategoryFilter() {
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>';
            this.categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categoryFilter.appendChild(option);
            });
        }
    }
    
    async loadCountries() {
        // Check cache first
        const cached = this.getCachedData('countries');
        if (cached) {
            this.countries = cached;
            this.updateCountryFilter();
            this.updateCountryQuickNav();
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/countries`);
            const data = await response.json();
            
            this.countries = data.countries || [];
            this.setCachedData('countries', this.countries);
            this.updateCountryFilter();
            this.updateCountryQuickNav();
        } catch (error) {
            console.error('Error loading countries:', error);
        }
    }
    
    async loadNetworks() {
        // Check cache first
        const cached = this.getCachedData('networks');
        if (cached) {
            this.networks = cached;
            this.updateNetworkFilter();
            this.updateNetworkQuickNav();
            return;
        }
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/networks`);
            const data = await response.json();
            
            this.networks = data.networks || [];
            this.setCachedData('networks', this.networks);
            this.updateNetworkFilter();
            this.updateNetworkQuickNav();
        } catch (error) {
            console.error('Error loading networks:', error);
        }
    }
    
    updateNetworkFilter() {
        const networkFilter = document.getElementById('network-filter');
        if (networkFilter) {
            networkFilter.innerHTML = '<option value="">📺 All Networks</option>';
            this.networks.forEach(network => {
                const option = document.createElement('option');
                option.value = network;
                option.textContent = network;
                networkFilter.appendChild(option);
            });
        }
    }
    
    updateNetworkQuickNav() {
        const quickNav = document.getElementById('network-quick-nav');
        if (!quickNav) return;
        
        if (this.networks.length === 0) {
            quickNav.innerHTML = '<div class="empty-state">No networks available</div>';
            return;
        }
        
        // Group networks by first letter
        const grouped = {};
        this.networks.forEach(network => {
            const firstLetter = network.charAt(0).toUpperCase();
            if (!grouped[firstLetter]) {
                grouped[firstLetter] = [];
            }
            grouped[firstLetter].push(network);
        });
        
        let html = '';
        Object.keys(grouped).sort().forEach(letter => {
            const networks = grouped[letter].sort();
            html += `
                <div class="network-letter-group">
                    <div class="network-letter-header">${letter}</div>
                    <div class="network-letter-networks">
                        ${networks.map(network => `
                            <button class="network-quick-btn" data-network="${this.escapeHtml(network)}" title="${this.escapeHtml(network)}">
                                ${this.escapeHtml(network)}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        quickNav.innerHTML = html;
        
        // Attach click handlers
        quickNav.querySelectorAll('.network-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const network = btn.dataset.network;
                const networkFilter = document.getElementById('network-filter');
                if (networkFilter) {
                    networkFilter.value = network || '';
                    this.applyFilters();
                }
            });
        });
    }
    
    updateCountryFilter() {
        const countryFilter = document.getElementById('country-filter');
        if (countryFilter) {
            countryFilter.innerHTML = '<option value="">🌍 All Countries</option>';
            this.countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                const flag = window.countryFlags ? window.countryFlags.getFlag(country) : '';
                option.textContent = flag ? `${flag} ${country}` : country;
                countryFilter.appendChild(option);
            });
        }
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    updateCountryQuickNav() {
        const quickNav = document.getElementById('country-quick-nav');
        if (!quickNav) return;
        
        if (this.countries.length === 0) {
            quickNav.innerHTML = '<div class="empty-state">No countries available</div>';
            return;
        }
        
        // Group countries by first letter for easier navigation
        const countriesByLetter = {};
        this.countries.forEach(country => {
            const firstLetter = country.charAt(0).toUpperCase();
            if (!countriesByLetter[firstLetter]) {
                countriesByLetter[firstLetter] = [];
            }
            countriesByLetter[firstLetter].push(country);
        });
        
        const sortedLetters = Object.keys(countriesByLetter).sort();
        
        // Add "All Countries" button at the top
        let html = '<div class="country-quick-nav-content">';
        html += `
            <div class="country-letter-group">
                <button class="country-quick-btn country-quick-btn-all" data-country="" title="Show all countries">
                    <span class="country-btn-flag">🌍</span>
                    <span class="country-btn-name">All Countries</span>
                </button>
            </div>
        `;
        
        sortedLetters.forEach(letter => {
            html += `<div class="country-letter-group">`;
            html += `<div class="country-letter-header">${letter}</div>`;
            html += `<div class="country-letter-countries">`;
            countriesByLetter[letter].forEach(country => {
                const flag = window.countryFlags ? window.countryFlags.getFlag(country) : '';
                html += `
                    <button class="country-quick-btn" data-country="${this.escapeHtml(country)}" title="${this.escapeHtml(country)}">
                        <span class="country-btn-flag">${flag}</span>
                        <span class="country-btn-name">${this.escapeHtml(country)}</span>
                    </button>
                `;
            });
            html += `</div></div>`;
        });
        html += '</div>';
        
        quickNav.innerHTML = html;
        
        // Attach click handlers
        quickNav.querySelectorAll('.country-quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const country = btn.dataset.country || '';
                
                // Update active state
                quickNav.querySelectorAll('.country-quick-btn').forEach(b => {
                    b.classList.remove('active');
                });
                btn.classList.add('active');
                
                // Update quick filter buttons
                document.querySelectorAll('.quick-filter-btn').forEach(b => {
                    b.classList.remove('active');
                    if (b.dataset.country === country) {
                        b.classList.add('active');
                    }
                });
                
                // Update country filter dropdown
                const countryFilter = document.getElementById('country-filter');
                if (countryFilter) {
                    countryFilter.value = country;
                }
                
                // Disable grouping when filtering by country
                if (country) {
                    localStorage.setItem('groupByCountry', 'false');
                    const groupBtn = document.getElementById('group-by-country-btn');
                    if (groupBtn) {
                        groupBtn.classList.remove('active');
                    }
                }
                
                // Apply filters
                if (window.searchManager) {
                    window.searchManager.applyFilters();
                }
            });
        });
    }
    
    closeImportModal() {
        const modal = document.getElementById('import-modal');
        modal.classList.remove('active');
        document.getElementById('playlist-url-input').value = '';
        document.getElementById('playlist-file-input').value = '';
    }
    
    showError(message) {
        console.error(message);
        alert(message);
    }
    
    async loadCustomPlaylists() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/playlists/custom`);
            const data = await response.json();
            
            const container = document.getElementById('playlists-container');
            if (!container) return;
            
            const playlists = data.playlists || [];
            
            if (playlists.length === 0) {
                container.innerHTML = '<div class="empty-state">No custom playlists yet.</div>';
                return;
            }
            
            container.innerHTML = playlists.map(playlist => `
                <div class="channel-card">
                    <div class="channel-info">
                        <div class="channel-name">${this.escapeHtml(playlist.name)}</div>
                        <div class="channel-meta">${playlist.channels.length} channels</div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading custom playlists:', error);
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    setApiBaseUrl(url) {
        this.apiBaseUrl = url;
        // Also update localStorage
        localStorage.setItem('apiBaseUrl', url);
    }
}

// Initialize playlist manager
let playlistManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        playlistManager = new PlaylistManager();
        window.playlistManager = playlistManager;
    });
} else {
    playlistManager = new PlaylistManager();
    window.playlistManager = playlistManager;
}

