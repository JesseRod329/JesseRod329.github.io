/** Main application logic and navigation */
class App {
    constructor() {
        this.currentView = 'channels';
        const hostname = window.location.hostname;
        const isWebDomain = (hostname.includes('.me') || hostname.includes('.com') || hostname.includes('.io') || hostname.includes('.net')) && 
                           hostname !== 'localhost' && 
                           !hostname.match(/^\d+\.\d+\.\d+\.\d+$/);
        
        // Determine default API URL
        let defaultApiUrl = null;
        
        // If we're on a web domain (like jesserodriguez.me), prefer a hosted backend URL
        if (isWebDomain && window.IPTV_REMOTE_API_BASE) {
            // Strip trailing slash if present
            defaultApiUrl = window.IPTV_REMOTE_API_BASE.replace(/\/$/, '');
            console.log('Using hosted backend API URL from IPTV_REMOTE_API_BASE:', defaultApiUrl);
        } else {
            // Fallback to local / LAN detection
            defaultApiUrl = this.detectApiUrl();
        }
        
        // Auto-detect API URL based on current hostname, but allow override from localStorage
        let storedApiUrl = localStorage.getItem('apiBaseUrl');
        
        // If we're on a web domain and the stored URL still points to localhost, ignore it
        if (isWebDomain && storedApiUrl && (storedApiUrl.includes('localhost') || storedApiUrl.includes('127.0.0.1') || storedApiUrl.includes('0.0.0.0'))) {
            console.log('Ignoring stored localhost API URL on web domain:', storedApiUrl);
            storedApiUrl = null;
            localStorage.removeItem('apiBaseUrl'); // Force clear
        }
        
        this.apiBaseUrl = storedApiUrl || defaultApiUrl || 'http://localhost:5001/api';
        
        // Force update localStorage if we are on web and using the Railway URL
        if (isWebDomain && defaultApiUrl && this.apiBaseUrl === defaultApiUrl) {
            localStorage.setItem('apiBaseUrl', defaultApiUrl);
        }
        
        if (isWebDomain && !localStorage.getItem('apiBaseUrl') && !window.IPTV_REMOTE_API_BASE) {
            // Show web access instructions when on a web domain and no hosted backend URL is configured
            this.showWebAccessInstructions();
        }
        
        this.init();
    }
    
    showWebAccessInstructions() {
        // Create a modal with instructions for web access
        const instructions = `
            <div style="padding: 20px; max-width: 600px; margin: 50px auto; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color);">
                <h2 style="margin-top: 0; color: var(--text-primary);">🌐 Web Access Setup Required</h2>
                <p style="color: var(--text-secondary); line-height: 1.6;">
                    The IPTV backend server is running on your local machine and is not accessible from the web.
                </p>
                <p style="color: var(--text-secondary); line-height: 1.6;">
                    <strong>To access from jesserodriguez.me, you have two options:</strong>
                </p>
                <div style="margin: 20px 0;">
                    <h3 style="color: var(--primary-color); font-size: 16px; margin-bottom: 10px;">Option 1: Use a Tunnel Service (Quick)</h3>
                    <ol style="color: var(--text-secondary); line-height: 1.8; padding-left: 20px;">
                        <li>Install <a href="https://ngrok.com" target="_blank" style="color: var(--info-color);">ngrok</a> or similar tunnel service</li>
                        <li>Run: <code style="background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px;">ngrok http 5001</code></li>
                        <li>Copy the ngrok URL (e.g., https://abc123.ngrok.io)</li>
                        <li>Enter it in Settings as: <code style="background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px;">https://abc123.ngrok.io/api</code></li>
                    </ol>
                </div>
                <div style="margin: 20px 0;">
                    <h3 style="color: var(--primary-color); font-size: 16px; margin-bottom: 10px;">Option 2: Host Backend on a Server</h3>
                    <p style="color: var(--text-secondary); line-height: 1.6;">
                        Deploy the backend to a cloud server (Heroku, Railway, DigitalOcean, etc.) and update the API URL in Settings.
                    </p>
                </div>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-color);">
                    <button onclick="window.app.showSettings(); document.getElementById('web-instructions')?.remove();" class="btn-primary" style="width: 100%;">
                        Open Settings to Configure API URL
                    </button>
                </div>
            </div>
        `;
        
        const container = document.getElementById('app-container') || document.body;
        const instructionsDiv = document.createElement('div');
        instructionsDiv.id = 'web-instructions';
        instructionsDiv.innerHTML = instructions;
        instructionsDiv.style.position = 'fixed';
        instructionsDiv.style.top = '0';
        instructionsDiv.style.left = '0';
        instructionsDiv.style.width = '100%';
        instructionsDiv.style.height = '100%';
        instructionsDiv.style.background = 'var(--bg-overlay)';
        instructionsDiv.style.zIndex = '10000';
        instructionsDiv.style.display = 'flex';
        instructionsDiv.style.alignItems = 'center';
        instructionsDiv.style.justifyContent = 'center';
        instructionsDiv.style.padding = '20px';
        instructionsDiv.style.overflow = 'auto';
        
        container.appendChild(instructionsDiv);
    }
    
    detectApiUrl() {
        // Detect a sensible default API URL for local / LAN usage.
        // Web domains (like jesserodriguez.me) are handled separately in the constructor.
        const hostname = window.location.hostname;
        const port = '5001';
        
        console.log('Detected hostname:', hostname);
        
        // If hostname is an IP address, use it directly (local network / iPhone on WiFi)
        if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
            const detectedUrl = `http://${hostname}:${port}/api`;
            console.log('Using detected API URL:', detectedUrl);
            return detectedUrl;
        }
        
        // Default to localhost for local development
        const defaultUrl = `http://localhost:${port}/api`;
        console.log('Using default API URL:', defaultUrl);
        return defaultUrl;
    }
    
    async checkAuthentication() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/check`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            
            if (!data.password_required) {
                // Password protection is disabled, show app
                this.showApp();
                return;
            }
            
            if (data.authenticated) {
                // Already authenticated, show app
                this.showApp();
                return;
            }
            
            // Need to login, show login modal
            this.showLoginModal();
        } catch (error) {
            console.error('Auth check failed:', error);
            // If API is not available, show app anyway (for offline development)
            this.showApp();
        }
    }
    
    showLoginModal() {
        const loginModal = document.getElementById('login-modal');
        const appContainer = document.getElementById('app-container');
        if (loginModal) {
            loginModal.style.display = 'flex';
            loginModal.classList.add('active');
        }
        if (appContainer) {
            appContainer.style.display = 'none';
        }
        
        // Setup login form
        const loginForm = document.getElementById('login-form');
        const passwordInput = document.getElementById('password-input');
        const errorDiv = document.getElementById('login-error');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const password = passwordInput?.value || '';
                
                if (!password) {
                    this.showLoginError('Please enter a password');
                    return;
                }
                
                try {
                    const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({ password })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success && data.authenticated) {
                        // Login successful, hide modal and show app
                        if (loginModal) {
                            loginModal.style.display = 'none';
                            loginModal.classList.remove('active');
                        }
                        this.showApp();
                        if (window.toastManager) {
                            window.toastManager.success('Login successful');
                        }
                    } else {
                        this.showLoginError(data.error || 'Invalid password');
                        if (passwordInput) passwordInput.value = '';
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    this.showLoginError('Failed to connect to server. Please check your API URL in settings.');
                }
            });
        }
        
        // Focus password input
        if (passwordInput) {
            setTimeout(() => passwordInput.focus(), 100);
        }
    }
    
    showLoginError(message) {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }
    
    showApp() {
        const loginModal = document.getElementById('login-modal');
        const appContainer = document.getElementById('app-container');
        if (loginModal) {
            loginModal.style.display = 'none';
        }
        if (appContainer) {
            appContainer.style.display = 'block';
        }
    }
    
    async logout() {
        try {
            await fetch(`${this.apiBaseUrl}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            this.showLoginModal();
            if (window.toastManager) {
                window.toastManager.info('Logged out');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    async init() {
        // Check authentication first
        await this.checkAuthentication();
        
        // Mobile menu button
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        
        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.toggle('active');
                }
            });
        }
        
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            });
        }
        
        // Quick country filter buttons
        document.querySelectorAll('.quick-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const country = e.currentTarget.dataset.country || '';
                
                // Update active state
                document.querySelectorAll('.quick-filter-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
                
                // Apply country filter
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
        
        // Quick network filter buttons
        document.querySelectorAll('.quick-network-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const network = e.currentTarget.dataset.network || '';
                
                // Update active state
                document.querySelectorAll('.quick-network-btn').forEach(b => {
                    b.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
                
                // Apply network filter
                const networkFilter = document.getElementById('network-filter');
                if (networkFilter) {
                    networkFilter.value = network;
                }
                
                // Disable grouping when filtering by network
                if (network) {
                    localStorage.setItem('groupByNetwork', 'false');
                    const groupBtn = document.getElementById('group-by-network-btn');
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
        
        // Mobile bottom navigation
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
                // Close sidebar on mobile after navigation
                if (sidebar) {
                    sidebar.classList.remove('active');
                    if (sidebarOverlay) {
                        sidebarOverlay.classList.remove('active');
                    }
                }
                // Update bottom nav active state
                document.querySelectorAll('.bottom-nav-item').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
            });
        });
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                this.switchView(view);
                // Close sidebar on mobile after navigation
                if (sidebar) {
                    sidebar.classList.remove('active');
                    if (sidebarOverlay) {
                        sidebarOverlay.classList.remove('active');
                    }
                }
            });
        });
        
        // View controls
        const gridViewBtn = document.getElementById('grid-view-btn');
        const listViewBtn = document.getElementById('list-view-btn');
        const groupByCountryBtn = document.getElementById('group-by-country-btn');
        
        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', () => this.setViewMode('grid'));
        }
        if (listViewBtn) {
            listViewBtn.addEventListener('click', () => this.setViewMode('list'));
        }
        if (groupByCountryBtn) {
            groupByCountryBtn.addEventListener('click', () => this.toggleGroupByCountry());
            // Set initial state
            const groupByCountry = localStorage.getItem('groupByCountry') === 'true';
            if (groupByCountry) {
                groupByCountryBtn.classList.add('active');
            }
        }
        
        const groupByNetworkBtn = document.getElementById('group-by-network-btn');
        if (groupByNetworkBtn) {
            groupByNetworkBtn.addEventListener('click', () => this.toggleGroupByNetwork());
            // Set initial state
            const groupByNetwork = localStorage.getItem('groupByNetwork') === 'true';
            if (groupByNetwork) {
                groupByNetworkBtn.classList.add('active');
            }
        }
        
        // Sort select
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const sortBy = e.target.value;
                localStorage.setItem('channelSort', sortBy);
                if (window.playlistManager) {
                    const filters = window.playlistManager.currentFilters || {};
                    window.playlistManager.loadChannels(filters);
                }
            });
            // Load saved sort preference
            const savedSort = localStorage.getItem('channelSort') || 'name';
            sortSelect.value = savedSort;
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Settings
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettings());
        }
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Modal close handlers
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Settings form
        const apiUrlInput = document.getElementById('api-url-input');
        if (apiUrlInput) {
            apiUrlInput.value = this.apiBaseUrl;
            // Use both 'input' and 'change' events for better mobile support
            apiUrlInput.addEventListener('input', (e) => {
                this.setApiBaseUrl(e.target.value);
            });
            apiUrlInput.addEventListener('change', (e) => {
                this.setApiBaseUrl(e.target.value);
            });
            // Also handle blur for when user finishes editing
            apiUrlInput.addEventListener('blur', (e) => {
                this.setApiBaseUrl(e.target.value);
            });
        }
        
        // Auto-detect IP / API button
        const autoDetectBtn = document.getElementById('auto-detect-api-btn');
        if (autoDetectBtn) {
            autoDetectBtn.addEventListener('click', () => {
                const hostname = window.location.hostname;
                const port = '5001';
                let detectedUrl;

                const isWebDomain = (hostname.includes('.me') || hostname.includes('.com') || hostname.includes('.io') || hostname.includes('.net')) && 
                                   hostname !== 'localhost' && 
                                   !hostname.match(/^\d+\.\d+\.\d+\.\d+$/);

                // On web domains, prefer the hosted backend URL if available
                if (isWebDomain && window.IPTV_REMOTE_API_BASE) {
                    detectedUrl = window.IPTV_REMOTE_API_BASE.replace(/\/$/, '');
                } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
                    detectedUrl = `http://${hostname}:${port}/api`;
                } else {
                    // Fallback: try to get from current URL or suggest common IP
                    detectedUrl = `http://192.168.1.152:${port}/api`;
                }
                
                if (apiUrlInput) {
                    apiUrlInput.value = detectedUrl;
                    this.setApiBaseUrl(detectedUrl);
                }
                
                if (window.toastManager) {
                    window.toastManager.success(`API URL set to: ${detectedUrl}`);
                }
            });
        }
        
        // Update IP display in settings
        this.updateIpDisplay();
        
        // API connection test button
        const testApiBtn = document.getElementById('test-api-btn');
        if (testApiBtn) {
            testApiBtn.addEventListener('click', () => this.testApiConnection());
        }
        
        const defaultPlaylistInput = document.getElementById('default-playlist-input');
        if (defaultPlaylistInput) {
            defaultPlaylistInput.value = localStorage.getItem('defaultPlaylistUrl') || 'https://iptv-org.github.io/iptv/index.m3u';
            defaultPlaylistInput.addEventListener('change', (e) => {
                localStorage.setItem('defaultPlaylistUrl', e.target.value);
            });
        }
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Initialize connection status monitoring
        this.initConnectionStatus();
        
        // Sync quick filter buttons with current filter state
        this.syncQuickFilterButtons();
        
        // Log API URL for debugging
        console.log('API Base URL:', this.apiBaseUrl);
        
        // Initialize default view
        this.switchView('channels');
    }
    
    syncQuickFilterButtons() {
        const countryFilter = document.getElementById('country-filter');
        if (countryFilter && countryFilter.value) {
            const country = countryFilter.value;
            // Update quick filter buttons
            document.querySelectorAll('.quick-filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.country === country) {
                    btn.classList.add('active');
                }
            });
            // Update country quick nav
            document.querySelectorAll('.country-quick-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.country === country) {
                    btn.classList.add('active');
                }
            });
        } else {
            // No filter - activate "All" button
            document.querySelectorAll('.quick-filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (!btn.dataset.country || btn.dataset.country === '') {
                    btn.classList.add('active');
                }
            });
        }
    }
    
    initConnectionStatus() {
        const statusIndicator = document.querySelector('.status-indicator');
        if (!statusIndicator) return;
        
        const checkConnection = async () => {
            try {
                const startTime = performance.now();
                const response = await fetch(`${this.apiBaseUrl}/health`, { 
                    method: 'HEAD',
                    cache: 'no-cache'
                });
                const endTime = performance.now();
                const latency = endTime - startTime;
                
                if (response.ok) {
                    statusIndicator.className = 'status-indicator';
                    if (latency > 1000) {
                        statusIndicator.classList.add('slow');
                        statusIndicator.title = 'Slow connection';
                    } else {
                        statusIndicator.classList.add('online');
                        statusIndicator.title = 'Connected';
                    }
                } else {
                    statusIndicator.className = 'status-indicator offline';
                    statusIndicator.title = 'Connection error';
                }
            } catch (error) {
                statusIndicator.className = 'status-indicator offline';
                statusIndicator.title = 'Offline';
            }
        };
        
        // Check immediately
        checkConnection();
        
        // Check every 30 seconds
        setInterval(checkConnection, 30000);
        
        // Check on visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                checkConnection();
            }
        });
        
        // Check on online/offline events
        window.addEventListener('online', checkConnection);
        window.addEventListener('offline', () => {
            if (statusIndicator) {
                statusIndicator.className = 'status-indicator offline';
                statusIndicator.title = 'No internet connection';
            }
        });
    }
    
    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });
        
        // Update mobile bottom nav
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.view === viewName) {
                item.classList.add('active');
            }
        });
        
        // Update view sections
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }
        
        this.currentView = viewName;
        
        // Load view-specific data
        if (viewName === 'favorites' && window.favoritesManager) {
            window.favoritesManager.loadFavorites();
        } else if (viewName === 'recent' && window.recentManager) {
            window.recentManager.loadRecent();
        } else if (viewName === 'epg' && window.epgManager) {
            window.epgManager.loadEPG();
        } else if (viewName === 'playlists' && window.playlistManager) {
            window.playlistManager.loadCustomPlaylists();
        } else if (viewName === 'local' && window.localManager) {
            // Auto-load local channels if zip code is set
            if (window.localManager.zipCode) {
                window.localManager.loadLocalChannels();
            }
        } else if (viewName === 'multiview' && window.multiviewManager) {
            // Ensure multiview grid is rendered
            window.multiviewManager.renderSlots();
        }
    }
    
    setViewMode(mode) {
        const container = document.getElementById('channels-container');
        const gridBtn = document.getElementById('grid-view-btn');
        const listBtn = document.getElementById('list-view-btn');
        
        if (mode === 'grid') {
            container.classList.remove('list-view');
            // Update country channels if in country view
            container.querySelectorAll('.country-channels').forEach(div => {
                div.classList.remove('list-view');
            });
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        } else {
            container.classList.add('list-view');
            // Update country channels if in country view
            container.querySelectorAll('.country-channels').forEach(div => {
                div.classList.add('list-view');
            });
            gridBtn.classList.remove('active');
            listBtn.classList.add('active');
        }
    }
    
    toggleGroupByCountry() {
        const groupByCountryBtn = document.getElementById('group-by-country-btn');
        const groupByCountry = localStorage.getItem('groupByCountry') !== 'true';
        
        localStorage.setItem('groupByCountry', groupByCountry.toString());
        
        // Disable network grouping when enabling country grouping
        if (groupByCountry) {
            localStorage.setItem('groupByNetwork', 'false');
            const groupByNetworkBtn = document.getElementById('group-by-network-btn');
            if (groupByNetworkBtn) {
                groupByNetworkBtn.classList.remove('active');
            }
        }
        
        if (groupByCountry) {
            groupByCountryBtn.classList.add('active');
        } else {
            groupByCountryBtn.classList.remove('active');
        }
        
        // Reload channels with current filters
        if (window.playlistManager) {
            const filters = window.playlistManager.currentFilters || {};
            // Reset pagination when toggling grouping
            window.playlistManager.currentPage = 0;
            window.playlistManager.loadChannels(filters, false);
        }
    }
    
    toggleGroupByNetwork() {
        const groupByNetworkBtn = document.getElementById('group-by-network-btn');
        const groupByNetwork = localStorage.getItem('groupByNetwork') !== 'true';
        
        localStorage.setItem('groupByNetwork', groupByNetwork.toString());
        
        // Disable country grouping when enabling network grouping
        if (groupByNetwork) {
            localStorage.setItem('groupByCountry', 'false');
            const groupByCountryBtn = document.getElementById('group-by-country-btn');
            if (groupByCountryBtn) {
                groupByCountryBtn.classList.remove('active');
            }
        }
        
        if (groupByNetwork) {
            groupByNetworkBtn.classList.add('active');
        } else {
            groupByNetworkBtn.classList.remove('active');
        }
        
        // Reload channels with current filters
        if (window.playlistManager) {
            const filters = window.playlistManager.currentFilters || {};
            // Reset pagination when toggling grouping
            window.playlistManager.currentPage = 0;
            window.playlistManager.loadChannels(filters, false);
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    showSettings() {
        const modal = document.getElementById('settings-modal');
        modal.classList.add('active');
        this.updateIpDisplay();
    }
    
    updateIpDisplay() {
        const hostname = window.location.hostname;
        const port = '5001';
        
        const currentIpDisplay = document.getElementById('current-ip-display');
        const suggestedUrlDisplay = document.getElementById('suggested-url-display');
        
        if (currentIpDisplay) {
            if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
                currentIpDisplay.textContent = hostname;
                currentIpDisplay.style.color = 'var(--success-color)';
            } else {
                currentIpDisplay.textContent = '192.168.1.152 (default)';
                currentIpDisplay.style.color = 'var(--warning-color)';
            }
        }
        
        if (suggestedUrlDisplay) {
            let suggestedUrl;
            if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
                suggestedUrl = `http://${hostname}:${port}/api`;
            } else {
                suggestedUrl = `http://192.168.1.152:${port}/api`;
            }
            suggestedUrlDisplay.textContent = suggestedUrl;
            suggestedUrlDisplay.style.color = 'var(--info-color)';
        }
    }
    
    setApiBaseUrl(url) {
        this.apiBaseUrl = url;
        localStorage.setItem('apiBaseUrl', url);
        
        // Update all managers
        if (window.videoPlayer) window.videoPlayer.setApiBaseUrl(url);
        if (window.playlistManager) {
            window.playlistManager.setApiBaseUrl(url);
            // Reload channels with new API URL
            window.playlistManager.loadChannels();
        }
        if (window.favoritesManager) {
            window.favoritesManager.setApiBaseUrl(url);
            // Reload favorites if on favorites view
            if (this.currentView === 'favorites') {
                window.favoritesManager.loadFavorites();
            }
        }
        if (window.epgManager) {
            window.epgManager.setApiBaseUrl(url);
            // Reload EPG channels if on EPG view
            if (this.currentView === 'epg') {
                window.epgManager.loadChannelsForFilter();
            }
        }
        if (window.recentManager) {
            window.recentManager.setApiBaseUrl(url);
            if (this.currentView === 'recent') {
                window.recentManager.loadRecent();
            }
        }
        if (window.searchManager) window.searchManager.setApiBaseUrl(url);
    }
    
    async testApiConnection() {
        const resultDiv = document.getElementById('api-test-result');
        const testBtn = document.getElementById('test-api-btn');
        const apiUrl = document.getElementById('api-url-input').value.trim();
        
        if (!apiUrl) {
            resultDiv.innerHTML = '<span style="color: red;">Please enter an API URL</span>';
            return;
        }
        
        // Remove trailing slash if present
        const cleanApiUrl = apiUrl.replace(/\/$/, '');
        
        testBtn.disabled = true;
        testBtn.textContent = 'Testing...';
        resultDiv.innerHTML = '<span style="color: blue;">Testing connection...</span>';
        
        try {
            const response = await fetch(`${cleanApiUrl}/health`);
            if (response.ok) {
                const data = await response.json();
                resultDiv.innerHTML = '<span style="color: green;">✓ Connection successful! API is reachable. Reloading channels...</span>';
                // Update the API URL if test succeeds
                this.setApiBaseUrl(cleanApiUrl);
                // Small delay to show success message
                setTimeout(() => {
                    resultDiv.innerHTML = '<span style="color: green;">✓ Connection successful!</span>';
                }, 2000);
            } else {
                resultDiv.innerHTML = `<span style="color: red;">✗ Connection failed: HTTP ${response.status}</span>`;
            }
        } catch (error) {
            let errorMsg = error.message;
            const hostname = window.location.hostname;
            const isWebDomain = (hostname.includes('.me') || hostname.includes('.com') || hostname.includes('.io') || hostname.includes('.net')) && 
                               hostname !== 'localhost' && 
                               !hostname.match(/^\d+\.\d+\.\d+\.\d+$/);
            
            if (isWebDomain && cleanApiUrl.includes(hostname)) {
                errorMsg = 'Backend not accessible from web. Use ngrok tunnel or host backend on a server.';
            }
            
            resultDiv.innerHTML = `
                <span style="color: red;">✗ Connection failed: ${errorMsg}</span>
                ${isWebDomain ? '<div style="margin-top: 10px; padding: 10px; background: rgba(255,165,0,0.1); border-radius: 4px; font-size: 12px; color: orange;">
                    <strong>Web Access Note:</strong> The backend runs on your local machine. To access from jesserodriguez.me:<br>
                    1. Use <a href="https://ngrok.com" target="_blank" style="color: var(--info-color);">ngrok</a>: <code>ngrok http 5001</code><br>
                    2. Or deploy backend to a cloud server (Heroku, Railway, etc.)
                </div>' : ''}
            `;
            console.error('API connection test failed:', error);
        } finally {
            testBtn.disabled = false;
            testBtn.textContent = 'Test Connection';
        }
    }
}

// Channel Browser Component
class ChannelBrowser {
    constructor() {
        this.container = document.getElementById('channels-container');
        this.viewMode = 'grid';
    }
    
    displayChannels(channels) {
        if (!this.container) return;
        
        if (channels.length === 0) {
            this.container.innerHTML = '<div class="empty-state">No channels found</div>';
            return;
        }
        
        this.container.innerHTML = channels.map(channel => this.createChannelCard(channel)).join('');
        
        this.attachChannelHandlers(channels);
    }
    
    showSkeleton(count = 12) {
        if (!this.container) return;
        
        const skeletonHTML = Array(count).fill(0).map(() => `
            <div class="skeleton-channel-card">
                <div class="skeleton skeleton-channel-logo"></div>
                <div class="skeleton-channel-info">
                    <div class="skeleton skeleton-channel-name"></div>
                    <div class="skeleton skeleton-channel-meta"></div>
                </div>
            </div>
        `).join('');
        
        this.container.innerHTML = skeletonHTML;
    }
    
    displayChannelsByCountry(channels) {
        if (!this.container) return;
        
        if (channels.length === 0) {
            this.container.innerHTML = '<div class="empty-state">No channels found</div>';
            return;
        }
        
        // Check if list view is active
        const isListView = this.container.classList.contains('list-view');
        
        // Group channels by country
        const channelsByCountry = {};
        
        channels.forEach(channel => {
            const country = channel.country || 'Unknown';
            if (!channelsByCountry[country]) {
                channelsByCountry[country] = [];
            }
            channelsByCountry[country].push(channel);
        });
        
        // Sort countries alphabetically
        const sortedCountries = Object.keys(channelsByCountry).sort();
        
        // Build HTML with collapsible country sections
        let html = '';
        sortedCountries.forEach(country => {
            const countryChannels = channelsByCountry[country];
            const countryId = country.toLowerCase().replace(/\s+/g, '-');
            const listViewClass = isListView ? 'list-view' : '';
            const flag = window.countryFlags ? window.countryFlags.getFlag(country) : '🌍';
            html += `
                <div class="country-group" data-country="${country}">
                    <div class="country-header" data-country-id="${countryId}">
                        <span class="country-flag">${flag}</span>
                        <span class="country-name">${this.escapeHtml(country)}</span>
                        <span class="country-count">${countryChannels.length}</span>
                        <span class="country-toggle">▼</span>
                    </div>
                    <div class="country-channels ${listViewClass}" id="country-${countryId}">
                        ${countryChannels.map(channel => this.createChannelCard(channel)).join('')}
                    </div>
                </div>
            `;
        });
        
        this.container.innerHTML = html;
        
        // Attach handlers
        this.attachChannelHandlers(channels);
        this.attachCountryGroupHandlers();
    }
    
    displayChannelsByNetwork(channels) {
        if (!this.container) return;
        
        if (channels.length === 0) {
            this.container.innerHTML = '<div class="empty-state">No channels found</div>';
            return;
        }
        
        // Check if list view is active
        const isListView = this.container.classList.contains('list-view');
        
        // Group channels by network
        const channelsByNetwork = {};
        
        channels.forEach(channel => {
            const network = channel.network || 'Unknown';
            if (!channelsByNetwork[network]) {
                channelsByNetwork[network] = [];
            }
            channelsByNetwork[network].push(channel);
        });
        
        // Sort networks alphabetically
        const sortedNetworks = Object.keys(channelsByNetwork).sort();
        
        // Build HTML with collapsible network sections
        let html = '';
        sortedNetworks.forEach(network => {
            const networkChannels = channelsByNetwork[network];
            const networkId = network.toLowerCase().replace(/\s+/g, '-');
            const listViewClass = isListView ? 'list-view' : '';
            html += `
                <div class="network-group" data-network="${network}">
                    <div class="network-header" data-network-id="${networkId}">
                        <span class="network-name">📺 ${this.escapeHtml(network)}</span>
                        <span class="network-count">${networkChannels.length}</span>
                        <span class="network-toggle">▼</span>
                    </div>
                    <div class="network-channels ${listViewClass}" id="network-${networkId}">
                        ${networkChannels.map(channel => this.createChannelCard(channel)).join('')}
                    </div>
                </div>
            `;
        });
        
        this.container.innerHTML = html;
        
        // Attach handlers
        this.attachChannelHandlers(channels);
        this.attachNetworkGroupHandlers();
    }
    
    attachCountryGroupHandlers() {
        const countryHeaders = this.container.querySelectorAll('.country-header');
        countryHeaders.forEach(header => {
            const countryId = header.dataset.countryId;
            const channelsDiv = document.getElementById(`country-${countryId}`);
            const toggle = header.querySelector('.country-toggle');
            
            // All sections expanded by default
            if (channelsDiv) {
                channelsDiv.style.display = '';
                toggle.textContent = '▼';
                header.classList.remove('collapsed');
            }
            
            header.addEventListener('click', () => {
                if (channelsDiv) {
                    const isExpanded = channelsDiv.style.display !== 'none';
                    channelsDiv.style.display = isExpanded ? 'none' : '';
                    toggle.textContent = isExpanded ? '▶' : '▼';
                    header.classList.toggle('collapsed', isExpanded);
                }
            });
        });
    }
    
    attachChannelHandlers(channels) {
        // Add click handlers
        this.container.querySelectorAll('.channel-card').forEach(card => {
            const channelId = parseInt(card.dataset.channelId);
            const channel = channels.find(c => c.id === channelId);
            
            if (!channel) return;
            
            // Main card click - play in HTML5 player
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on VLC button or country header
                if (e.target.closest('.btn-vlc-small') || e.target.closest('.country-header')) return;
                
                if (window.videoPlayer) {
                    window.videoPlayer.playChannel(channel);
                }
            });
            
            // Hover/long-press preview
            let previewTimer;
            card.addEventListener('mouseenter', () => {
                previewTimer = setTimeout(() => {
                    this.showChannelPreview(channel, card);
                }, 800);
            });
            card.addEventListener('mouseleave', () => {
                clearTimeout(previewTimer);
                this.hideChannelPreview();
            });
            
            // Long-press for mobile preview
            let longPressTimer;
            card.addEventListener('touchstart', (e) => {
                longPressTimer = setTimeout(() => {
                    this.showChannelPreview(channel, card);
                    this.showContextMenu(e, channel, card);
                }, 500);
            });
            card.addEventListener('touchend', () => {
                clearTimeout(longPressTimer);
            });
            card.addEventListener('touchmove', () => {
                clearTimeout(longPressTimer);
            });
            
            // Right-click context menu
            card.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showContextMenu(e, channel, card);
            });
            
            // Favorite button click
            const favoriteBtn = card.querySelector('.btn-favorite-small');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await this.toggleChannelFavorite(channel, favoriteBtn);
                });
            }
            
            // VLC button click
            const vlcBtn = card.querySelector('.btn-vlc-small');
            if (vlcBtn) {
                vlcBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (window.videoPlayer) {
                        await window.videoPlayer.openInVLCForChannel(channel);
                    }
                });
            }

            // Drag start handler for Multiview
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify(channel));
                e.dataTransfer.effectAllowed = 'copy';
            });
        });
    }
    
    createChannelCard(channel) {
        const logo = channel.logo 
            ? `<img src="${channel.logo}" alt="${channel.name}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'logo-placeholder\\'>📺</div>'">`
            : '<div class="logo-placeholder">📺</div>';
        
        // Build meta info - filter out undefined/null/empty values
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
        
        // If no meta, show a default
        const metaText = meta.length > 0 ? meta.join(' • ') : 'TV Channel';
        
        const isFavorite = channel.is_favorite || false;
        const favoriteIcon = isFavorite ? '⭐' : '☆';
        
        return `
            <div class="channel-card" data-channel-id="${channel.id}" tabindex="0" draggable="true">
                <div class="channel-logo">${logo}</div>
                <div class="channel-info">
                    <div class="channel-name">${this.escapeHtml(channel.name || 'Unknown Channel')}</div>
                    <div class="channel-meta">${this.escapeHtml(metaText)}</div>
                    <div class="channel-actions">
                        <button class="btn-favorite-small" data-channel-id="${channel.id}" data-is-favorite="${isFavorite}" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">${favoriteIcon}</button>
                        <button class="btn-vlc-small" data-channel-id="${channel.id}" title="Open in VLC">▶ VLC</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    showChannelPreview(channel, card) {
        // Remove existing preview
        const existing = document.getElementById('channel-preview');
        if (existing) existing.remove();
        
        const preview = document.createElement('div');
        preview.id = 'channel-preview';
        preview.className = 'channel-preview';
        
        const rect = card.getBoundingClientRect();
        const logo = channel.logo 
            ? `<img src="${channel.logo}" alt="${channel.name}" onerror="this.style.display='none'">`
            : '<div class="logo-placeholder">📺</div>';
        
        preview.innerHTML = `
            <div class="preview-logo">${logo}</div>
            <div class="preview-info">
                <div class="preview-name">${this.escapeHtml(channel.name)}</div>
                <div class="preview-meta">
                    ${channel.category ? `<span>${this.escapeHtml(channel.category)}</span>` : ''}
                    ${channel.country ? `<span>${this.escapeHtml(channel.country)}</span>` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(preview);
        
        // Position preview
        const x = rect.right + 10;
        const y = rect.top;
        preview.style.left = `${x}px`;
        preview.style.top = `${y}px`;
        
        // Adjust if off-screen
        setTimeout(() => {
            const previewRect = preview.getBoundingClientRect();
            if (previewRect.right > window.innerWidth) {
                preview.style.left = `${rect.left - previewRect.width - 10}px`;
            }
            if (previewRect.bottom > window.innerHeight) {
                preview.style.top = `${window.innerHeight - previewRect.height - 10}px`;
            }
        }, 10);
    }
    
    hideChannelPreview() {
        const preview = document.getElementById('channel-preview');
        if (preview) {
            preview.classList.add('hide');
            setTimeout(() => preview.remove(), 200);
        }
    }
    
    showContextMenu(e, channel, card) {
        // Remove existing context menu
        const existing = document.getElementById('context-menu');
        if (existing) existing.remove();
        
        const menu = document.createElement('div');
        menu.id = 'context-menu';
        menu.className = 'context-menu';
        menu.innerHTML = `
            <button class="context-menu-item" onclick="window.videoPlayer.playChannel(${JSON.stringify(channel).replace(/"/g, '&quot;')}); document.getElementById('context-menu')?.remove();">
                ▶ Play
            </button>
            <button class="context-menu-item" onclick="window.videoPlayer.openInVLCForChannel(${JSON.stringify(channel).replace(/"/g, '&quot;')}); document.getElementById('context-menu')?.remove();">
                ▶ Open in VLC
            </button>
            <button class="context-menu-item" onclick="window.multiviewManager.addChannel(${JSON.stringify(channel).replace(/"/g, '&quot;')}); document.getElementById('context-menu')?.remove();">
                📑 Open in Multi-View
            </button>
            <button class="context-menu-item" onclick="window.videoPlayer.toggleFavorite(); document.getElementById('context-menu')?.remove();">
                ${channel.is_favorite ? '☆ Remove from Favorites' : '⭐ Add to Favorites'}
            </button>
            <button class="context-menu-item" onclick="window.channelInfoModal.show(${JSON.stringify(channel).replace(/"/g, '&quot;')}); document.getElementById('context-menu')?.remove();">
                ℹ Channel Info
            </button>
        `;
        
        document.body.appendChild(menu);
        
        // Position menu
        const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        
        // Close on click outside
        setTimeout(() => {
            document.addEventListener('click', function closeMenu() {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }, { once: true });
        }, 10);
    }
    
    async toggleChannelFavorite(channel, buttonElement) {
        const channelId = channel.id;
        const isFavorite = channel.is_favorite || false;
        const apiBaseUrl = window.app?.apiBaseUrl || localStorage.getItem('apiBaseUrl') || 'http://localhost:5001/api';
        
        try {
            let url, method, body;
            
            if (isFavorite) {
                // DELETE: /api/favorites/<channel_id>
                url = `${apiBaseUrl}/favorites/${channelId}`;
                method = 'DELETE';
            } else {
                // POST: /api/favorites (with channel_id in body)
                url = `${apiBaseUrl}/favorites`;
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
                // Success - update UI
                channel.is_favorite = !isFavorite;
                buttonElement.dataset.isFavorite = !isFavorite;
                buttonElement.textContent = channel.is_favorite ? '⭐' : '☆';
                buttonElement.title = channel.is_favorite ? 'Remove from favorites' : 'Add to favorites';
                
                // Haptic feedback
                if (window.gestureManager) {
                    window.gestureManager.hapticFeedback('light');
                }
                
                // Show toast
                if (window.toastManager) {
                    window.toastManager.success(channel.is_favorite ? 'Added to favorites' : 'Removed from favorites');
                }
                
                // Update favorites view if active
                if (window.favoritesManager && window.app?.currentView === 'favorites') {
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
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
let app;
let channelBrowser;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new App();
        channelBrowser = new ChannelBrowser();
        window.app = app;
        window.channelBrowser = channelBrowser;
    });
} else {
    app = new App();
    channelBrowser = new ChannelBrowser();
    window.app = app;
    window.channelBrowser = channelBrowser;
}


