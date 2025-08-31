// iOS Portfolio Service Worker
// Provides offline functionality and caching for PWA features

const CACHE_NAME = 'ios-portfolio-v1.0.0';
const STATIC_CACHE_NAME = 'ios-portfolio-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'ios-portfolio-dynamic-v1.0.0';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/ios/',
  '/ios/index.html',
  '/ios/css/iphone.css',
  '/ios/css/terminal.css',
  '/ios/css/palettes.css',
  '/ios/css/content-apps.css',
  '/ios/css/professional.css',
  '/ios/js/navigation.js',
  '/ios/js/terminal.js',
  '/ios/js/palettes.js',
  '/ios/js/content-apps.js',
  '/ios/js/professional.js',
  '/ios/manifest.json',
  '/assets/resume.pdf'
];

// Network-first strategies for these paths
const NETWORK_FIRST_PATHS = [
  '/ios/analytics',
  '/ios/api'
];

// Cache-first strategies for these file types
const CACHE_FIRST_EXTENSIONS = [
  '.css',
  '.js',
  '.woff2',
  '.woff',
  '.ttf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE_NAME)
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName.startsWith('ios-portfolio-')) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle requests with appropriate caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (!url.origin.includes(self.location.origin)) {
    return;
  }
  
  // Determine caching strategy
  if (shouldUseNetworkFirst(url.pathname)) {
    event.respondWith(networkFirst(request));
  } else if (shouldUseCacheFirst(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Network-first strategy (for dynamic content)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page if available
    if (request.destination === 'document') {
      return caches.match('/ios/index.html');
    }
    
    throw error;
  }
}

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Both cache and network failed for:', request.url);
    throw error;
  }
}

// Stale-while-revalidate strategy (for frequently updated content)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Always try to fetch fresh content in the background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we might have cached content
    return null;
  });
  
  // Return cached content immediately if available, otherwise wait for network
  if (cachedResponse) {
    return cachedResponse;
  }
  
  return fetchPromise;
}

// Helper functions
function shouldUseNetworkFirst(pathname) {
  return NETWORK_FIRST_PATHS.some(path => pathname.startsWith(path));
}

function shouldUseCacheFirst(pathname) {
  return CACHE_FIRST_EXTENSIONS.some(ext => pathname.endsWith(ext));
}

// Background sync for analytics (if needed)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Placeholder for background analytics sync
  console.log('Service Worker: Background analytics sync');
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/ios/assets/icons/favicon-32x32.png',
      badge: '/ios/assets/icons/favicon-16x16.png',
      vibrate: [100, 50, 100],
      data: data.data
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/ios/')
  );
});

console.log('Service Worker: Script loaded');