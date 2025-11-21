/** Video player management with HTML5 and VLC integration */
class VideoPlayer {
    constructor() {
        this.videoElement = document.getElementById('video-player');
        this.currentChannel = null;
        this.apiBaseUrl = localStorage.getItem('apiBaseUrl') || 'http://localhost:5001/api';
        
        this.init();
    }
    
    init() {
        // iPhone/iOS specific settings
        this.videoElement.setAttribute('playsinline', 'true');
        this.videoElement.setAttribute('webkit-playsinline', 'true');
        this.videoElement.setAttribute('x5-playsinline', 'true');
        this.videoElement.playsInline = true;
        
        // Setup event listeners
        this.videoElement.addEventListener('error', (e) => this.handlePlayerError(e));
        this.videoElement.addEventListener('loadstart', () => this.onLoadStart());
        this.videoElement.addEventListener('canplay', () => this.onCanPlay());
        
        // VLC button
        const vlcBtn = document.getElementById('vlc-btn');
        vlcBtn.addEventListener('click', () => this.openInVLC());
        
        // Favorite button
        const favoriteBtn = document.getElementById('favorite-btn');
        favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        
        // Picture-in-Picture support
        this.initPictureInPicture();
        
        // Playback speed and volume controls
        this.initPlaybackControls();
    }
    
    initPictureInPicture() {
        // Check if PiP is supported
        if (this.videoElement.requestPictureInPicture) {
            // Add PiP button to player controls
            const playerInfo = document.querySelector('.player-info');
            if (playerInfo) {
                const pipBtn = document.createElement('button');
                pipBtn.id = 'pip-btn';
                pipBtn.className = 'btn-icon';
                pipBtn.title = 'Picture-in-Picture';
                pipBtn.textContent = '⊡';
                pipBtn.addEventListener('click', () => this.togglePictureInPicture());
                
                const playerActions = document.querySelector('.player-actions');
                if (playerActions) {
                    playerActions.insertBefore(pipBtn, playerActions.firstChild);
                }
            }
        }
    }
    
    async togglePictureInPicture() {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await this.videoElement.requestPictureInPicture();
            }
        } catch (error) {
            console.error('PiP error:', error);
            if (window.toastManager) {
                window.toastManager.error('Picture-in-Picture not available');
            }
        }
    }
    
    initPlaybackControls() {
        // Add playback speed control
        const playerInfo = document.querySelector('.player-info');
        if (playerInfo) {
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'player-extra-controls';
            controlsDiv.innerHTML = `
                <select id="playback-speed" class="playback-control-select" title="Playback Speed">
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1" selected>1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                </select>
                <input type="range" id="volume-slider" class="volume-slider" min="0" max="1" step="0.01" value="1" title="Volume">
            `;
            
            const playerActions = document.querySelector('.player-actions');
            if (playerActions) {
                playerActions.appendChild(controlsDiv);
            }
            
            // Playback speed handler
            const speedSelect = document.getElementById('playback-speed');
            if (speedSelect) {
                speedSelect.addEventListener('change', (e) => {
                    this.videoElement.playbackRate = parseFloat(e.target.value);
                });
            }
            
            // Volume slider handler
            const volumeSlider = document.getElementById('volume-slider');
            if (volumeSlider) {
                volumeSlider.addEventListener('input', (e) => {
                    this.videoElement.volume = parseFloat(e.target.value);
                });
                
                // Sync with video element volume
                this.videoElement.addEventListener('volumechange', () => {
                    volumeSlider.value = this.videoElement.volume;
                });
            }
        }
    }
    
    async playChannel(channel) {
        if (!channel || !channel.url) {
            console.error('Invalid channel data');
            return;
        }
        
        this.currentChannel = channel;
        
        // Update UI
        document.getElementById('current-channel-name').textContent = channel.name || 'Unknown Channel';
        
        // Enable buttons
        document.getElementById('vlc-btn').disabled = false;
        document.getElementById('favorite-btn').disabled = false;
        
        // Update favorite button state
        this.updateFavoriteButton(channel.is_favorite || false);
        
        // Set video source
        if (Hls.isSupported() && channel.url.includes('.m3u8')) {
            if (this.hls) {
                this.hls.destroy();
            }
            
            this.hls = new Hls();
            this.hls.loadSource(channel.url);
            this.hls.attachMedia(this.videoElement);
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                this.videoElement.play().catch(e => console.log('Auto-play prevented:', e));
            });
            
            this.hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log('fatal network error encountered, try to recover');
                            this.hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('fatal media error encountered, try to recover');
                            this.hls.recoverMediaError();
                            break;
                        default:
                            // cannot recover
                            this.hls.destroy();
                            break;
                    }
                }
            });
        } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            this.videoElement.src = channel.url;
            this.videoElement.addEventListener('loadedmetadata', () => {
                this.videoElement.play().catch(e => console.log('Auto-play prevented:', e));
            });
        } else {
            // Fallback for non-HLS streams or direct playback
            this.videoElement.src = channel.url;
            this.videoElement.load();
            this.videoElement.play().catch(e => console.log('Auto-play prevented:', e));
        }
        
        // Ensure playsinline is set for iPhone
        this.videoElement.setAttribute('playsinline', 'true');
        this.videoElement.setAttribute('webkit-playsinline', 'true');
        this.videoElement.playsInline = true;
        
        // Lock aspect ratio - prevent zooming
        this.videoElement.style.objectFit = 'contain';
        this.videoElement.style.width = '100%';
        this.videoElement.style.height = 'auto';
        this.videoElement.style.maxHeight = '100%';
        this.videoElement.style.aspectRatio = '16 / 9';
        
        // Load the video
        this.videoElement.load();
        
        // Try to play
        try {
            // For iOS, we need user interaction to play
            const playPromise = this.videoElement.play();
            if (playPromise !== undefined) {
                await playPromise;
            }
            
            // Record playback history
            await this.recordPlayback(channel.id);
        } catch (error) {
            console.error('Error playing video:', error);
            this.showError('Failed to play channel. Try opening in VLC instead.');
        }
    }
    
    async recordPlayback(channelId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/channels/${channelId}/play`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.warn('Failed to record playback history');
            }
        } catch (error) {
            console.warn('Error recording playback:', error);
        }
    }
    
    async openInVLC() {
        if (!this.currentChannel || !this.currentChannel.url) {
            const msg = 'No channel selected or channel URL missing';
            if (window.toastManager) {
                window.toastManager.error(msg);
            } else {
                alert(msg);
            }
            console.error('VLC open failed:', { channel: this.currentChannel });
            return;
        }
        
        const streamUrl = this.currentChannel.url;
        const btn = document.getElementById('vlc-btn');
        const originalText = btn ? btn.textContent : 'Open in VLC';
        
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Opening VLC...';
        }
        
        try {
            console.log('Attempting to open VLC with URL:', streamUrl);
            
            // Try backend method first (works best on Mac)
            const response = await fetch(`${this.apiBaseUrl}/vlc/open`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: streamUrl })
            });
            
            const data = await response.json();
            console.log('VLC API response:', data);
            
            if (data.success) {
                // Success! VLC should be opening
                if (btn) {
                    btn.textContent = 'Opening...';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }, 2000);
                }
                return;
            } else {
                // Backend method failed, try browser method
                throw new Error(data.error || data.message || 'Backend method failed');
            }
        } catch (error) {
            console.error('Backend method failed:', error);
            
            // Fallback: Try browser-based methods
            try {
                // Method 1: Try vlc:// protocol
                const vlcUrl = `vlc://${streamUrl}`;
                console.log('Trying vlc:// protocol:', vlcUrl);
                
                const link = document.createElement('a');
                link.href = vlcUrl;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                
                setTimeout(() => {
                    document.body.removeChild(link);
                    if (btn) {
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }
                }, 1000);
                
                // Show instructions after a delay
                setTimeout(() => {
                    this.showVLCOpenInstructions(streamUrl);
                }, 2000);
            } catch (browserError) {
                console.error('Browser method failed:', browserError);
                this.showVLCOpenInstructions(streamUrl);
                if (btn) {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            }
        }
    }
    
    showVLCOpenInstructions(url) {
        // Copy URL to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                const instructions = `To open in VLC:\n\n` +
                    `1. Open VLC Media Player\n` +
                    `2. Go to File > Open Network Stream (or press Cmd+O)\n` +
                    `3. Paste this URL:\n\n${url}\n\n` +
                    `(URL has been copied to your clipboard)`;
                alert(instructions);
            }).catch(() => {
                this.showVLCOpenInstructionsFallback(url);
            });
        } else {
            this.showVLCOpenInstructionsFallback(url);
        }
    }
    
    showVLCOpenInstructionsFallback(url) {
        const instructions = `To open in VLC:\n\n` +
            `1. Open VLC Media Player\n` +
            `2. Go to File > Open Network Stream (or press Cmd+O)\n` +
            `3. Paste this URL:\n\n${url}`;
        prompt(instructions, url);
    }
    
    async toggleFavorite() {
        if (!this.currentChannel) return;
        
        const channelId = this.currentChannel.id;
        const isFavorite = this.currentChannel.is_favorite || false;
        
        try {
            let url, method, body;
            
            if (isFavorite) {
                // DELETE: /api/favorites/<channel_id>
                url = `${this.apiBaseUrl}/favorites/${channelId}`;
                method = 'DELETE';
            } else {
                // POST: /api/favorites (with channel_id in body)
                url = `${this.apiBaseUrl}/favorites`;
                method = 'POST';
                body = JSON.stringify({ channel_id: channelId });
            }
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                ...(body ? { body } : {})
            });
            
            const data = await response.json();
            
            if (response.ok && (data.success !== false)) {
                this.currentChannel.is_favorite = !isFavorite;
                this.updateFavoriteButton(!isFavorite);
                
                // Show toast
                if (window.toastManager) {
                    window.toastManager.success(this.currentChannel.is_favorite ? 'Added to favorites' : 'Removed from favorites');
                }
                
                // Update favorites view if it's active
                if (window.favoritesManager) {
                    window.favoritesManager.refresh();
                }
            } else {
                const errorMsg = data.error || 'Failed to update favorite';
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            if (window.toastManager) {
                window.toastManager.error(`Failed to update favorite: ${error.message}`);
            } else {
                alert(`Failed to update favorite: ${error.message}`);
            }
        }
    }
    
    updateFavoriteButton(isFavorite) {
        const btn = document.getElementById('favorite-btn');
        btn.textContent = isFavorite ? '⭐' : '☆';
        btn.style.color = isFavorite ? '#ffc107' : '';
    }
    
    handlePlayerError(event) {
        console.error('Video player error:', event);
        const error = this.videoElement.error;
        
        if (error) {
            let errorMessage = 'Unknown error occurred';
            
            switch (error.code) {
                case error.MEDIA_ERR_ABORTED:
                    errorMessage = 'Video playback was aborted';
                    break;
                case error.MEDIA_ERR_NETWORK:
                    errorMessage = 'Network error. The stream may be unavailable.';
                    break;
                case error.MEDIA_ERR_DECODE:
                    errorMessage = 'Video decoding error. Try opening in VLC instead.';
                    break;
                case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorMessage = 'Video format not supported. Try opening in VLC instead.';
                    break;
            }
            
            this.showError(errorMessage);
        }
    }
    
    showError(message) {
        console.error(message);
        if (window.toastManager) {
            window.toastManager.error(message);
        } else {
            alert(message);
        }
    }
    
    onLoadStart() {
        // Show loading indicator if needed
        console.log('Video loading started');
    }
    
    onCanPlay() {
        // Video is ready to play
        console.log('Video can play');
    }
    
    async openInVLCForChannel(channel) {
        if (!channel || !channel.url) {
            console.error('Invalid channel data for VLC:', channel);
            alert('Channel URL is missing. Cannot open in VLC.');
            return;
        }
        
        // Temporarily set current channel for VLC opening
        const originalChannel = this.currentChannel;
        this.currentChannel = channel;
        
        try {
            await this.openInVLC();
        } catch (error) {
            console.error('Error opening VLC:', error);
            alert(`Failed to open VLC: ${error.message}`);
        } finally {
            this.currentChannel = originalChannel;
        }
    }
    
    stop() {
        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }
        this.videoElement.pause();
        this.videoElement.removeAttribute('src'); // Clear src properly
        this.videoElement.load(); // Reset player
        this.currentChannel = null;
        document.getElementById('current-channel-name').textContent = 'No channel selected';
        document.getElementById('vlc-btn').disabled = true;
        document.getElementById('favorite-btn').disabled = true;
    }
    
    setApiBaseUrl(url) {
        this.apiBaseUrl = url;
    }
}

// Initialize player when DOM is ready
let videoPlayer;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        videoPlayer = new VideoPlayer();
        window.videoPlayer = videoPlayer;
    });
} else {
    videoPlayer = new VideoPlayer();
    window.videoPlayer = videoPlayer;
}


