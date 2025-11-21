/** Keyboard shortcuts and navigation */
class KeyboardManager {
    constructor() {
        this.currentChannelIndex = -1;
        this.channels = [];
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Prevent default for shortcuts
        document.addEventListener('keydown', (e) => {
            // Don't interfere with input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                // Allow some shortcuts even in inputs
                if (e.key === 'Escape') {
                    e.target.blur();
                }
                return;
            }
            
            // Handle shortcuts
            switch(e.key) {
                case '/':
                    e.preventDefault();
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) {
                        searchInput.focus();
                    }
                    break;
                case 'Escape':
                    // Close modals
                    document.querySelectorAll('.modal.active').forEach(modal => {
                        modal.classList.remove('active');
                    });
                    // Close sidebar on mobile
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar) {
                        sidebar.classList.remove('active');
                        const overlay = document.getElementById('sidebar-overlay');
                        if (overlay) overlay.classList.remove('active');
                    }
                    break;
            }
        });
    }
    
    handleKeyPress(e) {
        // Don't handle shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Allow Escape and number keys for quick channel jump
            if (e.key === 'Escape') {
                e.target.blur();
                return;
            }
            if (e.key.match(/^[0-9]$/)) {
                // Allow typing numbers in search
                return;
            }
            return;
        }
        
        // Spacebar - play/pause
        if (e.key === ' ' && !e.target.closest('button')) {
            e.preventDefault();
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer) {
                if (videoPlayer.paused) {
                    videoPlayer.play();
                } else {
                    videoPlayer.pause();
                }
            }
            return;
        }
        
        // Arrow keys - navigate channels
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            this.navigateChannels(e.key);
            return;
        }
        
        // Number keys - quick channel jump
        if (e.key.match(/^[0-9]$/)) {
            this.quickChannelJump(e.key);
            return;
        }
        
        // F - toggle favorite
        if (e.key === 'f' || e.key === 'F') {
            e.preventDefault();
            if (window.videoPlayer && window.videoPlayer.currentChannel) {
                window.videoPlayer.toggleFavorite();
            }
            return;
        }
        
        // V - open in VLC
        if (e.key === 'v' || e.key === 'V') {
            e.preventDefault();
            if (window.videoPlayer && window.videoPlayer.currentChannel) {
                window.videoPlayer.openInVLC();
            }
            return;
        }
        
        // I - channel info
        if (e.key === 'i' || e.key === 'I') {
            e.preventDefault();
            if (window.videoPlayer && window.videoPlayer.currentChannel) {
                this.showChannelInfo(window.videoPlayer.currentChannel);
            }
            return;
        }
        
        // Number row shortcuts
        if (e.key === '1' && e.ctrlKey) {
            e.preventDefault();
            if (window.app) window.app.switchView('channels');
        } else if (e.key === '2' && e.ctrlKey) {
            e.preventDefault();
            if (window.app) window.app.switchView('favorites');
        } else if (e.key === '3' && e.ctrlKey) {
            e.preventDefault();
            if (window.app) window.app.switchView('epg');
        } else if (e.key === '4' && e.ctrlKey) {
            e.preventDefault();
            if (window.app) window.app.switchView('playlists');
        }
    }
    
    navigateChannels(direction) {
        const container = document.getElementById('channels-container');
        if (!container) return;
        
        const channelCards = Array.from(container.querySelectorAll('.channel-card'));
        if (channelCards.length === 0) return;
        
        // Get current focused or selected channel
        let currentIndex = this.currentChannelIndex;
        if (currentIndex < 0) {
            const focused = container.querySelector('.channel-card:focus, .channel-card.selected');
            if (focused) {
                currentIndex = channelCards.indexOf(focused);
            } else {
                currentIndex = 0;
            }
        }
        
        // Calculate new index based on direction
        let newIndex = currentIndex;
        const isGrid = !container.classList.contains('list-view');
        
        if (isGrid) {
            // Grid navigation
            const cols = Math.floor(container.offsetWidth / 220); // Approximate column count
            if (direction === 'ArrowRight') {
                newIndex = Math.min(currentIndex + 1, channelCards.length - 1);
            } else if (direction === 'ArrowLeft') {
                newIndex = Math.max(currentIndex - 1, 0);
            } else if (direction === 'ArrowDown') {
                newIndex = Math.min(currentIndex + cols, channelCards.length - 1);
            } else if (direction === 'ArrowUp') {
                newIndex = Math.max(currentIndex - cols, 0);
            }
        } else {
            // List navigation
            if (direction === 'ArrowDown') {
                newIndex = Math.min(currentIndex + 1, channelCards.length - 1);
            } else if (direction === 'ArrowUp') {
                newIndex = Math.max(currentIndex - 1, 0);
            }
        }
        
        // Update selection
        channelCards.forEach(card => card.classList.remove('selected'));
        if (channelCards[newIndex]) {
            channelCards[newIndex].classList.add('selected');
            channelCards[newIndex].focus();
            channelCards[newIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            this.currentChannelIndex = newIndex;
            
            // Play channel on Enter
            const channelId = parseInt(channelCards[newIndex].dataset.channelId);
            if (channelId && window.playlistManager) {
                const channel = window.playlistManager.channels.find(c => c.id === channelId);
                if (channel && window.videoPlayer) {
                    // Auto-play on selection (optional - can be made configurable)
                    // window.videoPlayer.playChannel(channel);
                }
            }
        }
    }
    
    quickChannelJump(number) {
        // Quick jump to channel by number (1-9)
        const num = parseInt(number);
        if (num < 1 || num > 9) return;
        
        const container = document.getElementById('channels-container');
        if (!container) return;
        
        const channelCards = Array.from(container.querySelectorAll('.channel-card'));
        if (channelCards.length === 0) return;
        
        // Jump to channel at position (num - 1) * 10
        const targetIndex = (num - 1) * 10;
        if (targetIndex < channelCards.length) {
            channelCards[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            channelCards[targetIndex].classList.add('selected');
            channelCards.forEach((card, idx) => {
                if (idx !== targetIndex) card.classList.remove('selected');
            });
            this.currentChannelIndex = targetIndex;
        }
    }
    
    showChannelInfo(channel) {
        if (window.channelInfoModal) {
            window.channelInfoModal.show(channel);
        } else {
            // Fallback
            const info = `Channel: ${channel.name}\nCategory: ${channel.category || 'N/A'}\nCountry: ${channel.country || 'N/A'}`;
            if (window.toastManager) {
                window.toastManager.info(info);
            } else {
                alert(info);
            }
        }
    }
    
    setChannels(channels) {
        this.channels = channels;
    }
}

// Initialize keyboard manager
let keyboardManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        keyboardManager = new KeyboardManager();
        window.keyboardManager = keyboardManager;
    });
} else {
    keyboardManager = new KeyboardManager();
    window.keyboardManager = keyboardManager;
}

