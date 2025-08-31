/**
 * Mobile Detection and Redirect Script
 * CSP Compliant - No eval, no unsafe-inline
 */

(function() {
    'use strict';
    
    function isMobileDevice() {
        // Check for mobile user agents
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const userAgent = navigator.userAgent;
        
        // Check screen size (mobile if width < 768px)
        const isSmallScreen = window.innerWidth < 768;
        
        // Check for touch capability
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        return mobileRegex.test(userAgent) || (isSmallScreen && isTouchDevice);
    }
    
    function redirectToMobile() {
        // Only redirect if we're not already on mobile or ios path
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/ios/') && !currentPath.includes('desktop.html')) {
            // Add a small delay to prevent jarring redirects
            setTimeout(() => {
                window.location.href = '/ios/';
            }, 100);
        }
    }
    
    function init() {
        // Check if this is a mobile device
        if (isMobileDevice()) {
            redirectToMobile();
        }
    }
    
    // Run detection when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
