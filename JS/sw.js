// Name of the cache
const CACHE_NAME = 'v1';

// Resources to cache
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/images/logo.png'
];

// Install event
self.addEventListener('install', event => {
    console.log('Service Worker: Installed');

    // Wait until the resources are cached
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', event => {
    console.log('Service Worker: Activated');

    // Clean up old caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event
self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetching');
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Make a clone of the response
                const resClone = response.clone();

                // Open the cache
                caches.open(CACHE_NAME)
                    .then(cache => {
                        // Add the response to the cache
                        cache.put(event.request, resClone);
                    });

                return response;
            }).catch(err => caches.match(event.request).then(response => response))
    );
});
