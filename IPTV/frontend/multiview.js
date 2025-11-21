/** Multi-View (Picture-in-Picture / Grid) Manager */
class MultiviewManager {
    constructor() {
        this.active = false;
        this.slots = 4;
        this.players = []; // Array of { element, hls, channel }
        this.activeSlot = 0; // Which slot is currently focused/audio active
        
        this.init();
    }
    
    init() {
        // Check if multiview view already exists in HTML
        const existingView = document.getElementById('multiview-view');
        if (!existingView) {
            // Create Multiview Container if it doesn't exist
            const main = document.querySelector('main.content-area');
            if (main) {
                const section = document.createElement('section');
                section.id = 'multiview-view';
                section.className = 'view-section';
                section.innerHTML = `
                    <div class="view-header">
                        <h2>Multi-View</h2>
                        <div class="view-controls">
                            <button id="clear-multiview-btn" class="btn-secondary">Clear All</button>
                        </div>
                    </div>
                    <div class="multiview-grid" id="multiview-grid">
                        <!-- Slots will be added here -->
                    </div>
                    <div class="multiview-instructions">
                        <p>Drag channels here or use "Open in Multi-View" context menu.</p>
                    </div>
                `;
                main.appendChild(section);
            }
        }
        
        // Add initial empty slots
        this.renderSlots();
        
        // Event listeners
        const clearBtn = document.getElementById('clear-multiview-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAll());
        }
    }
    
    renderSlots() {
        const grid = document.getElementById('multiview-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        for (let i = 0; i < this.slots; i++) {
            const slot = document.createElement('div');
            slot.className = 'multiview-slot';
            slot.dataset.index = i;
            
            // If we have a player for this slot, render it
            if (this.players[i] && this.players[i].channel) {
                slot.classList.add('active');
                slot.innerHTML = `
                    <div class="slot-header">
                        <span class="slot-title">${this.players[i].channel.name}</span>
                        <button class="slot-close" onclick="window.multiviewManager.removeSlot(${i})">×</button>
                    </div>
                    <div class="slot-video-container" id="slot-video-${i}"></div>
                    <div class="slot-controls">
                        <button class="slot-audio-btn" onclick="window.multiviewManager.toggleAudio(${i})">
                            ${this.activeSlot === i ? '🔊' : '🔇'}
                        </button>
                    </div>
                `;
            } else {
                slot.classList.add('empty');
                slot.innerHTML = `
                    <div class="slot-placeholder">
                        <span class="plus">+</span>
                        <span>Select a channel</span>
                    </div>
                `;
                slot.addEventListener('click', () => {
                    // Switch to channels view to select
                    if (window.app) window.app.switchView('channels');
                    if (window.toastManager) window.toastManager.info('Select a channel to add to this slot');
                    this.pendingSlot = i;
                });
            }
            
            grid.appendChild(slot);
            
            // Drag and Drop Handlers
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });
            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                const data = e.dataTransfer.getData('text/plain');
                if (data) {
                    try {
                        const channel = JSON.parse(data);
                        this.addChannel(channel, i);
                    } catch (err) {
                        console.error('Invalid drop data', err);
                    }
                }
            });
            
            // Re-attach video element if it exists
            if (this.players[i] && this.players[i].channel) {
                const container = document.getElementById(`slot-video-${i}`);
                if (container && this.players[i].element) {
                    container.appendChild(this.players[i].element);
                    // Ensure it's playing
                    this.players[i].element.play().catch(e => console.log('Autoplay prevented', e));
                }
            }
        }
    }
    
    async addChannel(channel, slotIndex = -1) {
        // If slotIndex is -1, find first empty slot
        if (slotIndex === -1) {
            slotIndex = this.players.findIndex(p => !p || !p.channel);
            if (slotIndex === -1) {
                // No empty slots, override the pending one or the first one
                slotIndex = this.pendingSlot !== undefined ? this.pendingSlot : 0;
            }
        }
        
        this.pendingSlot = undefined;
        
        // Cleanup existing player in this slot
        this.removeSlot(slotIndex, false);
        
        // Create new video element
        const video = document.createElement('video');
        video.className = 'multiview-video';
        video.muted = (slotIndex !== this.activeSlot); // Only one unmuted
        video.playsInline = true;
        video.controls = false; // Custom controls
        
        // HLS Setup
        let hls = null;
        if (Hls.isSupported() && channel.url.includes('.m3u8')) {
            hls = new Hls();
            hls.loadSource(channel.url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(e => console.log('Play error', e));
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = channel.url;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(e => console.log('Play error', e));
            });
        } else {
            video.src = channel.url;
            video.play().catch(e => console.log('Play error', e));
        }
        
        // Store player data
        this.players[slotIndex] = {
            element: video,
            hls: hls,
            channel: channel
        };
        
        // Switch to multiview if not active
        if (window.app) window.app.switchView('multiview');
        
        this.renderSlots();
    }
    
    removeSlot(index, render = true) {
        if (this.players[index]) {
            const p = this.players[index];
            if (p.hls) p.hls.destroy();
            if (p.element) {
                p.element.pause();
                p.element.removeAttribute('src');
                p.element.load();
            }
            this.players[index] = null;
        }
        if (render) this.renderSlots();
    }
    
    clearAll() {
        for (let i = 0; i < this.slots; i++) {
            this.removeSlot(i, false);
        }
        this.renderSlots();
    }
    
    toggleAudio(index) {
        this.activeSlot = index;
        this.players.forEach((p, i) => {
            if (p && p.element) {
                p.element.muted = (i !== index);
            }
        });
        this.renderSlots(); // Re-render to update icons
    }
}

// Initialize
let multiviewManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        multiviewManager = new MultiviewManager();
        window.multiviewManager = multiviewManager;
    });
} else {
    multiviewManager = new MultiviewManager();
    window.multiviewManager = multiviewManager;
}
