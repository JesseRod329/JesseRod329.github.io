/** Recently watched channels management */
class RecentManager {
    constructor() {
        this.apiBaseUrl = localStorage.getItem('apiBaseUrl') || 'http://localhost:5001/api';
        this.recentChannels = [];
        
        this.init();
    }
    
    init() {
        // Load recent channels when view is shown
        // This is handled by app.js switchView
    }
    
    async loadRecent() {
        const container = document.getElementById('recent-container');
        if (!container) return;
        
        container.innerHTML = '<div class="loading">Loading recently watched...</div>';
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/channels/recently-watched?limit=20`);
            const data = await response.json();
            
            this.recentChannels = data.channels || [];
            this.displayRecent();
        } catch (error) {
            console.error('Error loading recently watched:', error);
            container.innerHTML = '<div class="empty-state">Failed to load recently watched</div>';
        }
    }
    
    displayRecent() {
        const container = document.getElementById('recent-container');
        if (!container) return;
        
        if (this.recentChannels.length === 0) {
            container.innerHTML = '<div class="empty-state">No recently watched channels yet. Start watching to see your history!</div>';
            return;
        }
        
        // Use the same channel card format as ChannelBrowser
        container.innerHTML = this.recentChannels.map(channel => this.createChannelCard(channel)).join('');
        
        // Add click handlers
        container.querySelectorAll('.channel-card').forEach(card => {
            card.addEventListener('click', () => {
                const channelId = parseInt(card.dataset.channelId);
                const channel = this.recentChannels.find(c => c.id === channelId);
                if (channel && window.videoPlayer) {
                    window.videoPlayer.playChannel(channel);
                }
            });
        });
    }
    
    createChannelCard(channel) {
        const logo = channel.logo 
            ? `<img src="${channel.logo}" alt="${channel.name}" onerror="this.parentElement.innerHTML='<div class=\\'logo-placeholder\\'>📺</div>'">`
            : '<div class="logo-placeholder">📺</div>';
        
        const meta = [];
        if (channel.category && channel.category !== 'undefined' && channel.category.trim()) {
            meta.push(channel.category);
        }
        if (channel.country && channel.country !== 'undefined' && channel.country.trim()) {
            meta.push(channel.country);
        }
        if (channel.network && channel.network !== 'undefined' && channel.network.trim()) {
            meta.push(channel.network);
        }
        if (channel.last_played) {
            const date = new Date(channel.last_played);
            const timeAgo = this.getTimeAgo(date);
            meta.push(timeAgo);
        }
        const metaText = meta.length > 0 ? meta.join(' • ') : 'TV Channel';
        if (channel.last_played) {
            const date = new Date(channel.last_played);
            const timeAgo = this.getTimeAgo(date);
            meta.push(timeAgo);
        }
        
        return `
            <div class="channel-card" data-channel-id="${channel.id}">
                <div class="channel-logo">${logo}</div>
                <div class="channel-info">
                    <div class="channel-name">${this.escapeHtml(channel.name || 'Unknown Channel')}</div>
                    <div class="channel-meta">${this.escapeHtml(metaText)}</div>
                </div>
            </div>
        `;
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    setApiBaseUrl(url) {
        this.apiBaseUrl = url;
    }
}

// Initialize recent manager
let recentManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        recentManager = new RecentManager();
        window.recentManager = recentManager;
    });
} else {
    recentManager = new RecentManager();
    window.recentManager = recentManager;
}


