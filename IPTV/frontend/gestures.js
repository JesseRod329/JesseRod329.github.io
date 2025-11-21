/** Touch gestures for mobile */
class GestureManager {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.minSwipeDistance = 50;
        this.init();
    }
    
    init() {
        // Video player gestures
        const videoPlayer = document.getElementById('video-player');
        if (videoPlayer) {
            videoPlayer.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
            videoPlayer.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        }
        
        // Channel card swipe gestures
        document.addEventListener('touchstart', (e) => {
            const channelCard = e.target.closest('.channel-card');
            if (channelCard) {
                this.handleCardTouchStart(e, channelCard);
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const channelCard = e.target.closest('.channel-card');
            if (channelCard) {
                this.handleCardTouchEnd(e, channelCard);
            }
        }, { passive: true });
        
        // Pull to refresh
        this.initPullToRefresh();
    }
    
    handleTouchStart(e) {
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }
    
    handleTouchEnd(e) {
        const touch = e.changedTouches[0];
        this.touchEndX = touch.clientX;
        this.touchEndY = touch.clientY;
        
        this.handleSwipe();
    }
    
    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Determine if horizontal or vertical swipe
        if (absDeltaX > absDeltaY && absDeltaX > this.minSwipeDistance) {
            // Horizontal swipe - change channel
            if (deltaX > 0) {
                this.swipeRight();
            } else {
                this.swipeLeft();
            }
        } else if (absDeltaY > absDeltaX && absDeltaY > this.minSwipeDistance) {
            // Vertical swipe - volume control
            if (deltaY > 0) {
                this.swipeDown();
            } else {
                this.swipeUp();
            }
        }
    }
    
    swipeLeft() {
        // Next channel
        if (window.keyboardManager) {
            window.keyboardManager.navigateChannels('ArrowRight');
            const container = document.getElementById('channels-container');
            const selected = container?.querySelector('.channel-card.selected');
            if (selected) {
                const channelId = parseInt(selected.dataset.channelId);
                if (channelId && window.playlistManager) {
                    const channel = window.playlistManager.channels.find(c => c.id === channelId);
                    if (channel && window.videoPlayer) {
                        window.videoPlayer.playChannel(channel);
                        this.hapticFeedback();
                    }
                }
            }
        }
    }
    
    swipeRight() {
        // Previous channel
        if (window.keyboardManager) {
            window.keyboardManager.navigateChannels('ArrowLeft');
            const container = document.getElementById('channels-container');
            const selected = container?.querySelector('.channel-card.selected');
            if (selected) {
                const channelId = parseInt(selected.dataset.channelId);
                if (channelId && window.playlistManager) {
                    const channel = window.playlistManager.channels.find(c => c.id === channelId);
                    if (channel && window.videoPlayer) {
                        window.videoPlayer.playChannel(channel);
                        this.hapticFeedback();
                    }
                }
            }
        }
    }
    
    swipeUp() {
        // Volume up
        const videoPlayer = document.getElementById('video-player');
        if (videoPlayer) {
            videoPlayer.volume = Math.min(1, videoPlayer.volume + 0.1);
            this.showVolumeIndicator(videoPlayer.volume);
            this.hapticFeedback('light');
        }
    }
    
    swipeDown() {
        // Volume down
        const videoPlayer = document.getElementById('video-player');
        if (videoPlayer) {
            videoPlayer.volume = Math.max(0, videoPlayer.volume - 0.1);
            this.showVolumeIndicator(videoPlayer.volume);
            this.hapticFeedback('light');
        }
    }
    
    showVolumeIndicator(volume) {
        // Remove existing indicator
        const existing = document.getElementById('volume-indicator');
        if (existing) existing.remove();
        
        // Create volume indicator
        const indicator = document.createElement('div');
        indicator.id = 'volume-indicator';
        indicator.className = 'volume-indicator';
        indicator.innerHTML = `
            <div class="volume-bar">
                <div class="volume-fill" style="width: ${volume * 100}%"></div>
            </div>
            <span class="volume-text">${Math.round(volume * 100)}%</span>
        `;
        document.body.appendChild(indicator);
        
        // Remove after animation
        setTimeout(() => {
            indicator.classList.add('hide');
            setTimeout(() => indicator.remove(), 300);
        }, 1500);
    }
    
    handleCardTouchStart(e, card) {
        card.dataset.touchStartX = e.touches[0].clientX;
        card.dataset.touchStartY = e.touches[0].clientY;
    }
    
    handleCardTouchEnd(e, card) {
        const startX = parseFloat(card.dataset.touchStartX || 0);
        const startY = parseFloat(card.dataset.touchStartY || 0);
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const absDeltaX = Math.abs(deltaX);
        
        // Swipe right to favorite/unfavorite
        if (absDeltaX > this.minSwipeDistance && deltaX > 0) {
            const channelId = parseInt(card.dataset.channelId);
            if (channelId && window.playlistManager) {
                const channel = window.playlistManager.channels.find(c => c.id === channelId);
                if (channel && window.videoPlayer) {
                    window.videoPlayer.toggleFavorite();
                    this.hapticFeedback();
                }
            }
        }
    }
    
    initPullToRefresh() {
        let touchStartY = 0;
        let isPulling = false;
        const container = document.getElementById('channels-container');
        if (!container) return;
        
        container.addEventListener('touchstart', (e) => {
            if (container.scrollTop === 0) {
                touchStartY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            
            const touchY = e.touches[0].clientY;
            const pullDistance = touchY - touchStartY;
            
            if (pullDistance > 0 && container.scrollTop === 0) {
                // Show pull indicator
                if (pullDistance > 50) {
                    container.dataset.pulling = 'true';
                }
            } else {
                isPulling = false;
                container.dataset.pulling = 'false';
            }
        }, { passive: true });
        
        container.addEventListener('touchend', () => {
            if (container.dataset.pulling === 'true') {
                // Refresh channels
                if (window.playlistManager) {
                    const filters = window.playlistManager.currentFilters || {};
                    window.playlistManager.loadChannels(filters);
                    this.hapticFeedback();
                }
            }
            isPulling = false;
            container.dataset.pulling = 'false';
        }, { passive: true });
    }
    
    hapticFeedback(intensity = 'medium') {
        // Haptic feedback for supported devices
        if ('vibrate' in navigator) {
            const patterns = {
                light: 10,
                medium: 20,
                heavy: 30
            };
            navigator.vibrate(patterns[intensity] || patterns.medium);
        }
    }
}

// Initialize gesture manager
let gestureManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        gestureManager = new GestureManager();
        window.gestureManager = gestureManager;
    });
} else {
    gestureManager = new GestureManager();
    window.gestureManager = gestureManager;
}



