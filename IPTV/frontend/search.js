/** Search functionality */
class SearchManager {
    constructor() {
        this.apiBaseUrl = localStorage.getItem('apiBaseUrl') || 'http://localhost:5001/api';
        this.searchTimeout = null;
        this.searchOptions = {
            name: true,
            category: false,
            country: false
        };
        
        this.init();
    }
    
    init() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
                this.toggleClearButton(e.target.value);
            });
            
            // Handle Enter key
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.applyFilters();
                }
            });
        }
        
        // Clear search button
        const clearSearchBtn = document.getElementById('clear-search-btn');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = '';
                    this.toggleClearButton('');
                    this.applyFilters();
                }
            });
        }
        
        // Search options checkboxes - ensure name search is always enabled by default
        const searchName = document.getElementById('search-name');
        const searchCategory = document.getElementById('search-category');
        const searchCountry = document.getElementById('search-country');
        
        // Ensure name search is always checked and enabled
        if (searchName) {
            searchName.checked = true;
            this.searchOptions.name = true;
            searchName.addEventListener('change', (e) => {
                this.searchOptions.name = e.target.checked;
                // If name is unchecked, re-check it (name search should always be available)
                if (!e.target.checked) {
                    e.target.checked = true;
                    this.searchOptions.name = true;
                }
                this.applyFilters();
            });
        }
        if (searchCategory) {
            searchCategory.addEventListener('change', (e) => {
                this.searchOptions.category = e.target.checked;
                this.applyFilters();
            });
        }
        if (searchCountry) {
            searchCountry.addEventListener('change', (e) => {
                this.searchOptions.country = e.target.checked;
                this.applyFilters();
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        // Country filter
        const countryFilter = document.getElementById('country-filter');
        if (countryFilter) {
            countryFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        // Network filter
        const networkFilter = document.getElementById('network-filter');
        if (networkFilter) {
            networkFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }
    
    toggleClearButton(value) {
        const clearBtn = document.getElementById('clear-search-btn');
        if (clearBtn) {
            clearBtn.style.display = value.trim() ? 'block' : 'none';
        }
    }
    
    handleSearch(query) {
        // Debounce search - reduced delay for faster response
        clearTimeout(this.searchTimeout);
        
        // If query is empty, apply immediately
        if (!query || query.trim() === '') {
            this.applyFilters();
            return;
        }
        
        this.searchTimeout = setTimeout(() => {
            this.applyFilters();
        }, 200); // Reduced from 300ms to 200ms for faster response
    }
    
    async applyFilters() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const countryFilter = document.getElementById('country-filter');
        const networkFilter = document.getElementById('network-filter');
        
        const filters = {};
        
        if (searchInput && searchInput.value.trim()) {
            filters.search = searchInput.value.trim();
            filters.searchOptions = this.searchOptions;
        }
        
        if (categoryFilter && categoryFilter.value) {
            filters.category = categoryFilter.value;
        }
        
        if (countryFilter && countryFilter.value) {
            filters.country = countryFilter.value;
            
            // Update quick filter button active state
            document.querySelectorAll('.quick-filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.country === countryFilter.value) {
                    btn.classList.add('active');
                }
            });
            
            // Update country quick nav active state
            document.querySelectorAll('.country-quick-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.country === countryFilter.value) {
                    btn.classList.add('active');
                }
            });
        } else {
            // No country filter - check if "All" button should be active
            document.querySelectorAll('.quick-filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (!btn.dataset.country || btn.dataset.country === '') {
                    btn.classList.add('active');
                }
            });
            document.querySelectorAll('.country-quick-btn-all').forEach(btn => {
                btn.classList.add('active');
            });
        }
        
        if (networkFilter && networkFilter.value) {
            filters.network = networkFilter.value;
            
            // Update quick network button active state
            document.querySelectorAll('.quick-network-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.network === networkFilter.value) {
                    btn.classList.add('active');
                }
            });
            
            // Update network quick nav active state
            document.querySelectorAll('.network-quick-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.network === networkFilter.value) {
                    btn.classList.add('active');
                }
            });
        } else {
            // No network filter - check if "All" button should be active
            document.querySelectorAll('.quick-network-btn').forEach(btn => {
                btn.classList.remove('active');
                if (!btn.dataset.network || btn.dataset.network === '') {
                    btn.classList.add('active');
                }
            });
        }
        
        // Load channels with filters
        if (window.playlistManager) {
            await window.playlistManager.loadChannels(filters);
        }
    }
    
    clearAllFilters() {
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const countryFilter = document.getElementById('country-filter');
        const networkFilter = document.getElementById('network-filter');
        
        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (countryFilter) countryFilter.value = '';
        
        // Clear quick filter buttons
        document.querySelectorAll('.quick-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Clear country quick nav buttons
        document.querySelectorAll('.country-quick-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.toggleClearButton('');
        this.applyFilters();
    }
    
    setApiBaseUrl(url) {
        this.apiBaseUrl = url;
    }
}

// Initialize search manager
let searchManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        searchManager = new SearchManager();
        window.searchManager = searchManager;
    });
} else {
    searchManager = new SearchManager();
    window.searchManager = searchManager;
}


