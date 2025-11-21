/** Favorites management */
class FavoritesManager {
    constructor() {
        this.apiBaseUrl = localStorage.getItem('apiBaseUrl') || 'http://localhost:5001/api';
        this.favorites = [];
        
        this.init();
    }
    
    init() {
        // Load favorites when favorites view is shown
        // This is handled by app.js switchView
    }
    
    async loadFavorites() {
        const container = document.getElementById('favorites-container');
        if (!container) return;
        
        container.innerHTML = '<div class="loading">Loading favorites...</div>';
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/favorites`);
            const data = await response.json();
            
            this.favorites = data.channels || [];
            this.displayFavorites();
        } catch (error) {
            console.error('Error loading favorites:', error);
            container.innerHTML = '<div class="empty-state">Failed to load favorites</div>';
        }
    }
    
    displayFavorites() {
        const container = document.getElementById('favorites-container');
        if (!container) return;
        
        if (this.favorites.length === 0) {
            container.innerHTML = '<div class="empty-state">No favorites yet. Add channels to your favorites!</div>';
            return;
        }
        
        // Use the same channel card format as ChannelBrowser
        container.innerHTML = this.favorites.map(channel => this.createChannelCard(channel)).join('');
        
        // Add click handlers and swipe gestures
        container.querySelectorAll('.channel-card').forEach(card => {
            const channelId = parseInt(card.dataset.channelId);
            const channel = this.favorites.find(c => c.id === channelId);
            
            card.addEventListener('click', () => {
                if (channel && window.videoPlayer) {
                    window.videoPlayer.playChannel(channel);
                }
            });
            
            // Swipe to remove from favorites
            let touchStartX = 0;
            card.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            card.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const deltaX = touchEndX - touchStartX;
                
                if (Math.abs(deltaX) > 100 && deltaX < 0) {
                    // Swipe left to remove
                    this.removeFavorite(channelId, card);
                }
            }, { passive: true });
        });
    }
    
    async removeFavorite(channelId, cardElement) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/favorites/${channelId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Remove from list
                this.favorites = this.favorites.filter(c => c.id !== channelId);
                cardElement.style.transform = 'translateX(-100%)';
                cardElement.style.opacity = '0';
                setTimeout(() => {
                    this.displayFavorites();
                }, 300);
                
                if (window.toastManager) {
                    window.toastManager.success('Removed from favorites');
                }
                if (window.gestureManager) {
                    window.gestureManager.hapticFeedback();
                }
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
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
        const metaText = meta.length > 0 ? meta.join(' • ') : 'TV Channel';
        
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
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    async refresh() {
        await this.loadFavorites();
    }
    
    setApiBaseUrl(url) {
        this.apiBaseUrl = url;
    }
}

// Initialize favorites manager
let favoritesManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        favoritesManager = new FavoritesManager();
        window.favoritesManager = favoritesManager;
    });
} else {
    favoritesManager = new FavoritesManager();
    window.favoritesManager = favoritesManager;
}


