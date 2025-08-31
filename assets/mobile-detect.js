/**
 * Mobile Detection and Redirect Script
 * CSP Compliant - No eval, no unsafe-inline
 */

(function() {
    'use strict';
    
    function isMobileDevice() {
        // Enhanced mobile detection for iPhone and other mobile devices
        const userAgent = navigator.userAgent;
        
        // iPhone/iPad specific detection
        const isIOS = /iPad|iPhone|iPod/.test(userAgent);
        
        // General mobile device detection
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
        const isMobileUA = mobileRegex.test(userAgent);
        
        // Screen size detection (mobile if width <= 768px)
        const isSmallScreen = window.innerWidth <= 768;
        
        // Touch capability detection
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Platform detection
        const isMobilePlatform = /Mobi|Android/i.test(userAgent);
        
        // Force redirect for common mobile patterns
        const isMobile = isIOS || isMobileUA || isMobilePlatform || (isSmallScreen && isTouchDevice);
        
        console.log('Mobile Detection:', {
            userAgent,
            isIOS,
            isMobileUA,
            isSmallScreen,
            isTouchDevice,
            isMobilePlatform,
            windowWidth: window.innerWidth,
            finalResult: isMobile
        });
        
        return isMobile;
    }
    
    function redirectToMobile() {
        // Only redirect if we're not already on mobile or ios path
        const currentPath = window.location.pathname;
        
        console.log('Redirect check:', {
            currentPath,
            includesIOS: currentPath.includes('/ios/'),
            includesDesktop: currentPath.includes('desktop.html'),
            shouldRedirect: !currentPath.includes('/ios/') && !currentPath.includes('desktop.html')
        });
        
        if (!currentPath.includes('/ios/') && !currentPath.includes('desktop.html')) {
            console.log('Redirecting to /ios/');
            // Immediate redirect for mobile devices
            window.location.replace('/ios/');
        }
    }
    
    function init() {
        // Check if this is a mobile device
        if (isMobileDevice()) {
            redirectToMobile();
        }
    }
    
    // Run detection immediately for fastest redirect
    init();
    
    // Also run when DOM is ready as backup
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
