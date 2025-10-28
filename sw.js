// Soma Ko Landing Pages - Service Worker
// Version 1.0.0

const CACHE_NAME = 'soma-ko-landing-v1.0.0';
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/food.html',
    '/ride.html',
    '/pharmacy.html',
    '/rent.html',
    '/express.html',
    '/styles.css',
    '/script.js',
    '/assets/favicon.svg',
    '/assets/google-play-badge.svg',
    '/assets/app-store-badge.svg'
];

const RUNTIME_CACHE = 'soma-ko-runtime-v1.0.0';

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_CACHE_URLS);
            })
            .then(() => {
                console.log('Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Error caching static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }

    // Handle navigation requests
    if (request.mode === 'navigate') {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    return response || fetch(request)
                        .then(fetchResponse => {
                            return caches.open(RUNTIME_CACHE)
                                .then(cache => {
                                    cache.put(request, fetchResponse.clone());
                                    return fetchResponse;
                                });
                        });
                })
                .catch(() => {
                    // Return offline page if available
                    return caches.match('/offline.html');
                })
        );
        return;
    }

    // Handle static assets
    if (STATIC_CACHE_URLS.includes(url.pathname)) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    return response || fetch(request);
                })
        );
        return;
    }

    // Handle other requests with network first strategy
    event.respondWith(
        fetch(request)
            .then(response => {
                // Only cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(RUNTIME_CACHE)
                        .then(cache => {
                            cache.put(request, responseClone);
                        });
                }
                return response;
            })
            .catch(() => {
                // Return from cache if network fails
                return caches.match(request);
            })
    );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Background sync triggered');
        event.waitUntil(
            // Handle background sync logic here
            Promise.resolve()
        );
    }
});

// Push notification handling
self.addEventListener('push', event => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: '/assets/favicon.svg',
            badge: '/assets/favicon.svg',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Explore',
                    icon: '/assets/favicon.svg'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/assets/favicon.svg'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification('Soma Ko', options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Error handling
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker unhandled rejection:', event.reason);
});