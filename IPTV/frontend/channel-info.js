/** Channel info modal */
class ChannelInfoModal {
    constructor() {
        this.modal = document.getElementById('channel-info-modal');
        this.init();
    }
    
    init() {
        // Close on overlay click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });
        }
    }
    
    async show(channel) {
        if (!this.modal) return;
        
        const title = document.getElementById('channel-info-title');
        const content = document.getElementById('channel-info-content');
        
        if (title) title.textContent = channel.name || 'Channel Information';
        if (content) content.innerHTML = '<div class="loading">Loading...</div>';
        
        this.modal.classList.add('active');
        
        // Load EPG data for this channel
        let epgData = [];
        try {
            const response = await fetch(`${window.app?.apiBaseUrl || 'http://localhost:5001/api'}/epg/${channel.id}`);
            const data = await response.json();
            epgData = data.epg || [];
        } catch (error) {
            console.error('Error loading EPG:', error);
        }
        
        // Build content
        const logo = channel.logo 
            ? `<img src="${channel.logo}" alt="${channel.name}" class="channel-info-logo" onerror="this.style.display='none'">`
            : '<div class="channel-info-logo-placeholder">📺</div>';
        
        let html = `
            <div class="channel-info-header">
                ${logo}
                <div class="channel-info-details">
                    <h3>${this.escapeHtml(channel.name)}</h3>
                    <div class="channel-info-meta">
                        ${channel.category ? `<span class="info-badge">${this.escapeHtml(channel.category)}</span>` : ''}
                        ${channel.country ? `<span class="info-badge">${this.escapeHtml(channel.country)}</span>` : ''}
                        ${channel.language ? `<span class="info-badge">${this.escapeHtml(channel.language)}</span>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="channel-info-actions">
                <button class="btn-primary" onclick="window.videoPlayer.playChannel(${JSON.stringify(channel).replace(/"/g, '&quot;')}); window.channelInfoModal.hide();">
                    ▶ Play Channel
                </button>
                <button class="btn-secondary" onclick="window.videoPlayer.openInVLCForChannel(${JSON.stringify(channel).replace(/"/g, '&quot;')});">
                    ▶ Open in VLC
                </button>
                <button class="btn-icon" onclick="window.videoPlayer.toggleFavorite();" id="channel-info-favorite-btn">
                    ${channel.is_favorite ? '⭐' : '☆'}
                </button>
            </div>
        `;
        
        if (epgData.length > 0) {
            html += `
                <div class="channel-info-epg">
                    <h4>Program Guide</h4>
                    <div class="epg-list">
                        ${epgData.slice(0, 10).map(programme => `
                            <div class="epg-item ${this.isCurrentProgramme(programme) ? 'current' : ''}">
                                <div class="epg-item-time">${this.formatTime(programme.start_time)} - ${this.formatTime(programme.end_time)}</div>
                                <div class="epg-item-title">${this.escapeHtml(programme.title)}</div>
                                ${programme.description ? `<div class="epg-item-desc">${this.escapeHtml(programme.description)}</div>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            html += `
                <div class="channel-info-epg">
                    <p class="empty-state">No EPG data available for this channel</p>
                </div>
            `;
        }
        
        if (content) {
            content.innerHTML = html;
        }
        
        // Update favorite button handler
        const favoriteBtn = document.getElementById('channel-info-favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                if (window.videoPlayer) {
                    window.videoPlayer.toggleFavorite();
                    // Update button
                    const isFavorite = !channel.is_favorite;
                    favoriteBtn.textContent = isFavorite ? '⭐' : '☆';
                    channel.is_favorite = isFavorite;
                }
            });
        }
    }
    
    hide() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
    }
    
    isCurrentProgramme(programme) {
        const now = new Date();
        const start = new Date(programme.start_time);
        const end = new Date(programme.end_time);
        return start <= now && now <= end;
    }
    
    formatTime(timeString) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize channel info modal
let channelInfoModal;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        channelInfoModal = new ChannelInfoModal();
        window.channelInfoModal = channelInfoModal;
    });
} else {
    channelInfoModal = new ChannelInfoModal();
    window.channelInfoModal = channelInfoModal;
}



