const CACHE_NAME = 'reliable-legal-v1.2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/404.html',
    '/style.css',
    '/script.js',
    '/robots.txt',
    '/sitemap.xml'
];

const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll([...STATIC_ASSETS, ...EXTERNAL_ASSETS]);
            })
            .catch((error) => {
                console.error('Service Worker: Cache failed', error);
            })
    );
    
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== CACHE_NAME) {
                            console.log('Service Worker: Deleting old cache', cache);
                            return caches.delete(cache);
                        }
                    })
                );
            })
    );
    
    // Claim all clients
    self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip external API calls (except fonts and CDN)
    const url = new URL(event.request.url);
    if (url.origin !== location.origin && 
        !url.hostname.includes('fonts.googleapis.com') && 
        !url.hostname.includes('fonts.gstatic.com') &&
        !url.hostname.includes('cdn.jsdelivr.net')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Serve from cache
                    return cachedResponse;
                }
                
                // Network fallback with caching
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone response for caching
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch((error) => {
                        console.error('Service Worker: Fetch failed', error);
                        
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        throw error;
                    });
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'form-submission') {
        event.waitUntil(
            // Handle offline form submissions
            handleOfflineFormSubmission()
        );
    }
});

// Handle offline form submissions
async function handleOfflineFormSubmission() {
    try {
        const submissions = await getStoredSubmissions();
        
        for (const submission of submissions) {
            try {
                const response = await fetch(submission.url, submission.options);
                
                if (response.ok) {
                    // Remove successful submission from storage
                    await removeStoredSubmission(submission.id);
                    
                    // Notify user of successful submission
                    self.registration.showNotification('Form Submitted', {
                        body: 'Your consultation request has been sent successfully.',
                        icon: '/assets/icon-192x192.png',
                        badge: '/assets/icon-72x72.png',
                        tag: 'form-success'
                    });
                }
            } catch (error) {
                console.error('Failed to submit form:', error);
            }
        }
    } catch (error) {
        console.error('Error handling offline submissions:', error);
    }
}

// Helper functions for storing form submissions
async function getStoredSubmissions() {
    // Implementation would use IndexedDB for persistent storage
    return [];
}

async function removeStoredSubmission(id) {
    // Implementation would remove from IndexedDB
}

// Push notification handler
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update from Reliable Legal Solutions',
        icon: '/assets/icon-192x192.png',
        badge: '/assets/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'legal-update'
    };
    
    event.waitUntil(
        self.registration.showNotification('Reliable Legal Solutions', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});