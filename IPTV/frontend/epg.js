/** EPG (Electronic Program Guide) management */
class EPGManager {
    constructor() {
        this.apiBaseUrl = localStorage.getItem('apiBaseUrl') || 'http://localhost:5001/api';
        this.epgData = [];
        
        this.init();
    }
    
    init() {
        // Fetch EPG button
        const fetchBtn = document.getElementById('fetch-epg-btn');
        if (fetchBtn) {
            fetchBtn.addEventListener('click', () => this.fetchEPG());
        }
        
        // EPG channel filter
        const channelFilter = document.getElementById('epg-channel-filter');
        if (channelFilter) {
            channelFilter.addEventListener('change', () => {
                this.loadEPG();
            });
        }
    }
    
    async fetchEPG() {
        const btn = document.getElementById('fetch-epg-btn');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Fetching EPG...';
        
        if (window.progressManager) {
            window.progressManager.show('Fetching EPG from iptv-org/epg...', 10);
        }
        
        try {
            const response = await fetch(`${this.apiBaseUrl}/epg/fetch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            
            const data = await response.json();
            
            if (window.progressManager) {
                window.progressManager.update(50, 'Processing EPG data...');
            }
            
            if (data.success) {
                if (window.progressManager) {
                    window.progressManager.update(100, 'Complete!');
                    setTimeout(() => window.progressManager.hide(), 1000);
                }
                
                const message = `Successfully imported ${data.imported} EPG entries! ${data.matched_channels ? `Matched ${data.matched_channels} channels.` : ''}`;
                if (window.toastManager) {
                    window.toastManager.success(message);
                } else {
                    alert(message);
                }
                await this.loadEPG();
            } else {
                // Show detailed error information
                const errorDetails = data.details || '';
                const errorHint = data.hint || 'Make sure you have channels with tvg_id set and the EPG source URL is correct.';
                throw new Error(`${data.error || 'Failed to fetch EPG'}${errorDetails ? '\n' + errorDetails : ''}\n\n${errorHint}`);
            }
        } catch (error) {
            console.error('Error fetching EPG:', error);
            if (window.progressManager) {
                window.progressManager.hide();
            }
            
            const errorMsg = error.message || 'Failed to fetch EPG';
            
            // Show user-friendly error message
            if (window.toastManager) {
                window.toastManager.error(errorMsg, 5000); // Show for 5 seconds
            } else {
                alert(errorMsg);
            }
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }
    
    async loadEPG() {
        const container = document.getElementById('epg-container');
        if (!container) return;
        
        container.innerHTML = '<div class="loading">Loading EPG data...</div>';
        
        try {
            const channelFilter = document.getElementById('epg-channel-filter');
            const selectedChannelId = channelFilter ? channelFilter.value : null;
            
            if (selectedChannelId && selectedChannelId !== '') {
                // Load EPG for specific channel
                const response = await fetch(`${this.apiBaseUrl}/epg/${selectedChannelId}`);
                const data = await response.json();
                const epgData = data.epg || [];
                
                // Get channel name
                const channelResponse = await fetch(`${this.apiBaseUrl}/channels/${selectedChannelId}`);
                const channelData = await channelResponse.json();
                const channelName = channelData.channel ? channelData.channel.name : `Channel ${selectedChannelId}`;
                
                this.displayEPG([{ id: parseInt(selectedChannelId), name: channelName, epg: epgData }]);
            } else {
                // Load EPG for all channels (simplified - in production you'd want pagination)
                // For now, we'll show a message to select a channel
                container.innerHTML = '<div class="empty-state">Select a channel from the filter above to view EPG data, or fetch EPG data first.</div>';
            }
        } catch (error) {
            console.error('Error loading EPG:', error);
            container.innerHTML = '<div class="empty-state">Failed to load EPG data</div>';
        }
    }
    
    displayEPG(channelsWithEPG) {
        const container = document.getElementById('epg-container');
        if (!container) return;
        
        if (channelsWithEPG.length === 0 || channelsWithEPG.every(c => !c.epg || c.epg.length === 0)) {
            container.innerHTML = '<div class="empty-state">No EPG data available for selected channels</div>';
            return;
        }
        
        let html = '<div class="epg-timeline">';
        
        channelsWithEPG.forEach(channelData => {
            if (!channelData.epg || channelData.epg.length === 0) return;
            
            html += '<div class="epg-channel">';
            html += `<div class="epg-channel-header">${channelData.name || this.getChannelName(channelData.id)}</div>`;
            
            channelData.epg.forEach(programme => {
                const isCurrent = this.isCurrentProgramme(programme);
                const timeStr = this.formatProgrammeTime(programme);
                
                html += `
                    <div class="epg-programme ${isCurrent ? 'current' : ''}" data-programme-id="${programme.id}">
                        <div class="epg-programme-title">${this.escapeHtml(programme.title)}</div>
                        <div class="epg-programme-time">${timeStr}</div>
                        ${programme.description ? `<div class="epg-programme-desc">${this.escapeHtml(programme.description)}</div>` : ''}
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Add click handlers for programme details
        container.querySelectorAll('.epg-programme').forEach(programme => {
            programme.addEventListener('click', () => {
                const programmeId = programme.dataset.programmeId;
                const programmeData = this.findProgrammeById(programmeId);
                if (programmeData) {
                    this.showProgrammeDetails(programmeData);
                }
            });
        });
    }
    
    getChannelName(channelId) {
        // This is now passed in the channelData object
        return `Channel ${channelId}`;
    }
    
    isCurrentProgramme(programme) {
        const now = new Date();
        const start = new Date(programme.start_time);
        const end = new Date(programme.end_time);
        return start <= now && now <= end;
    }
    
    formatProgrammeTime(programme) {
        const start = new Date(programme.start_time);
        const end = new Date(programme.end_time);
        
        const startStr = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const endStr = end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        return `${startStr} - ${endStr}`;
    }
    
    findProgrammeById(programmeId) {
        for (const channelData of this.epgData) {
            const programme = channelData.epg?.find(p => p.id === parseInt(programmeId));
            if (programme) return programme;
        }
        return null;
    }
    
    showProgrammeDetails(programme) {
        const details = `
Title: ${programme.title}
Time: ${this.formatProgrammeTime(programme)}
${programme.description ? `Description: ${programme.description}` : ''}
${programme.category ? `Category: ${programme.category}` : ''}
        `.trim();
        
        alert(details);
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    async loadChannelsForFilter() {
        // Load channels for EPG filter dropdown
        try {
            const response = await fetch(`${this.apiBaseUrl}/channels`);
            const data = await response.json();
            
            const channelFilter = document.getElementById('epg-channel-filter');
            if (channelFilter) {
                channelFilter.innerHTML = '<option value="">All Channels</option>';
                data.channels.forEach(channel => {
                    const option = document.createElement('option');
                    option.value = channel.id;
                    option.textContent = channel.name;
                    channelFilter.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading channels for EPG filter:', error);
        }
    }
    
    setApiBaseUrl(url) {
        this.apiBaseUrl = url;
    }
}

// Initialize EPG manager
let epgManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        epgManager = new EPGManager();
        window.epgManager = epgManager;
        // Load channels for filter when EPG manager is ready
        epgManager.loadChannelsForFilter();
    });
} else {
    epgManager = new EPGManager();
    window.epgManager = epgManager;
    epgManager.loadChannelsForFilter();
}

