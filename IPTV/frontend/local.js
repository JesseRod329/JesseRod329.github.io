/** Local Channels Manager */
class LocalManager {
    constructor() {
        // Sync API URL from app if available
        let apiUrl = 'http://localhost:5001/api';
        if (window.app && window.app.apiBaseUrl) {
            apiUrl = window.app.apiBaseUrl;
        } else {
            apiUrl = localStorage.getItem('apiBaseUrl') || apiUrl;
        }
        this.apiBaseUrl = apiUrl;
        this.zipCode = localStorage.getItem('zipCode') || '';
        this.container = document.getElementById('local-container');
        
        this.init();
    }
    
    init() {
        // Fetch button
        const fetchBtn = document.getElementById('fetch-local-btn');
        if (fetchBtn) {
            fetchBtn.addEventListener('click', () => this.loadLocalChannels());
        }
        
        // Zip code input listener
        const zipInput = document.getElementById('zip-code-input');
        if (zipInput) {
            zipInput.value = this.zipCode;
            zipInput.addEventListener('change', (e) => {
                this.zipCode = e.target.value.trim();
                localStorage.setItem('zipCode', this.zipCode);
            });
        }
    }
    
    setApiBaseUrl(url) {
        this.apiBaseUrl = url;
        localStorage.setItem('apiBaseUrl', url);
    }
    
    async loadLocalChannels() {
        // Sync API URL from app if available
        if (window.app && window.app.apiBaseUrl) {
            this.apiBaseUrl = window.app.apiBaseUrl;
        } else {
            this.apiBaseUrl = localStorage.getItem('apiBaseUrl') || this.apiBaseUrl || 'http://localhost:5001/api';
        }
        
        if (!this.container) return;
        
        if (!this.zipCode) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <p>Please enter your Zip Code in Settings to see local channels.</p>
                    <button class="btn-secondary" onclick="window.app.showSettings()">Open Settings</button>
                </div>
            `;
            return;
        }
        
        this.container.innerHTML = '<div class="loading">Finding local channels for ' + this.zipCode + '...</div>';
        
        try {
            // Call backend to get local channels
            // We pass the zip code as a query parameter
            const response = await fetch(`${this.apiBaseUrl}/channels/local?zip=${encodeURIComponent(this.zipCode)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const channels = data.channels || [];
            
            if (channels.length === 0) {
                this.container.innerHTML = `
                    <div class="empty-state">
                        <p>No local channels found for Zip Code <strong>${this.zipCode}</strong>.</p>
                        <p>This usually means your playlist doesn't have channels tagged with this location.</p>
                        <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                            <button class="btn-primary" onclick="document.getElementById('fetch-playlist-btn').click()">Update Playlist</button>
                            <button class="btn-secondary" onclick="window.app.showSettings()">Check Settings</button>
                        </div>
                    </div>
                `;
                return;
            }
            
            // Use ChannelBrowser to display
            if (window.channelBrowser) {
                // Temporarily set container to local-container
                const originalContainer = window.channelBrowser.container;
                window.channelBrowser.container = this.container;
                window.channelBrowser.displayChannels(channels);
                // Restore
                window.channelBrowser.container = originalContainer;
            }
            
        } catch (error) {
            console.error('Error loading local channels:', error);
            this.container.innerHTML = `<div class="error-state">Error loading channels: ${error.message}</div>`;
        }
    }
}

// Initialize
let localManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        localManager = new LocalManager();
        window.localManager = localManager;
    });
} else {
    localManager = new LocalManager();
    window.localManager = localManager;
}

