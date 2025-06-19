const CACHE_NAME = 'math-ai-v1.2.0';
const STATIC_CACHE = 'math-ai-static-v1.2.0';
const DYNAMIC_CACHE = 'math-ai-dynamic-v1.2.0';

// Recursos críticos para cachear inmediatamente
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/lead-magnet-flujo-calor.html',
    '/style.css',
    '/lead-magnet.css',
    '/script.js',
    '/lead-magnet.js',
    '/form-validator.js',
    '/advanced-animations.js',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
    // Iconos y logos
    'https://res.cloudinary.com/dfuya0vrl/image/upload/v1746402411/logo_sxdfzb.png',
    // Fuentes críticas
    'https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQQfzhzCSBU8k27ZCXtBMlJ8J1-oKNQY5nQCKSLKs.woff2',
    'https://fonts.gstatic.com/s/worksans/v19/QGY_z_wNahGAdqQ43RhVcIgYT2Xz5u32K0nWBiAJrqfJ.woff2'
];

// Recursos que se cachean dinámicamente cuando se solicitan
const DYNAMIC_ASSETS_PATTERNS = [
    /^https:\/\/fonts\.googleapis\.com\//,
    /^https:\/\/fonts\.gstatic\.com\//,
    /^https:\/\/res\.cloudinary\.com\//,
    /^https:\/\/www\.googletagmanager\.com\//,
    /^https:\/\/app\.cal\.com\//
];

// Recursos que nunca se deben cachear
const NEVER_CACHE_PATTERNS = [
    /^https:\/\/www\.google-analytics\.com\//,
    /^https:\/\/analytics\.google\.com\//,
    /\/lead-magnet\.js$/,  // Contiene lógica de formularios que puede cambiar
    /\/flujo-calor-contenido\.html$/  // Página privada, no cachear
];

// === INSTALL EVENT ===
self.addEventListener('install', (event) => {
    console.log('SW: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('SW: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('SW: Static assets cached successfully');
                return self.skipWaiting(); // Activar inmediatamente
            })
            .catch(error => {
                console.error('SW: Error caching static assets:', error);
            })
    );
});

// === ACTIVATE EVENT ===
self.addEventListener('activate', (event) => {
    console.log('SW: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // Eliminar cachés antiguos
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName.startsWith('math-ai-')) {
                            console.log('SW: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('SW: Claiming clients');
                return self.clients.claim(); // Tomar control inmediatamente
            })
    );
});

// === FETCH EVENT ===
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Solo interceptar requests GET
    if (request.method !== 'GET') {
        return;
    }
    
    // No cachear recursos prohibidos
    if (NEVER_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
        return;
    }
    
    // Estrategia: Cache First para recursos estáticos
    if (isStaticAsset(request.url)) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Estrategia: Network First para recursos dinámicos
    if (isDynamicAsset(request.url)) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Estrategia: Stale While Revalidate para páginas HTML
    if (request.destination === 'document') {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }
    
    // Por defecto: Network First
    event.respondWith(networkFirst(request));
});

// === ESTRATEGIAS DE CACHE ===

// Cache First: Ideal para recursos estáticos que rara vez cambian
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        // Cachear respuesta exitosa
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('SW: Cache First failed:', error);
        // Intentar obtener desde caché como último recurso
        return caches.match(request) || new Response('Offline', { status: 503 });
    }
}

// Network First: Prioriza contenido fresco, fallback a caché
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cachear respuesta exitosa en caché dinámico
        if (networkResponse.ok && isDynamicAsset(request.url)) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('SW: Network First failed, trying cache:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Página offline para documentos HTML
        if (request.destination === 'document') {
            return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Sin conexión - Math AI</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #0a0f1f; color: white; }
                        .offline { max-width: 400px; margin: 0 auto; }
                        h1 { color: #FF6B00; }
                    </style>
                </head>
                <body>
                    <div class="offline">
                        <h1>📡 Sin conexión</h1>
                        <p>No hay conexión a internet. Por favor, verifica tu conexión e intenta de nuevo.</p>
                        <button onclick="location.reload()">🔄 Reintentar</button>
                    </div>
                </body>
                </html>
            `, {
                status: 200,
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        return new Response('Sin conexión', { status: 503 });
    }
}

// Stale While Revalidate: Sirve desde caché, actualiza en segundo plano
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Fetch en segundo plano
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cachedResponse);
    
    // Devolver caché inmediatamente si existe, sino esperar red
    return cachedResponse || fetchPromise;
}

// === UTILIDADES ===

function isStaticAsset(url) {
    return STATIC_ASSETS.includes(url) || 
           url.includes('.css') || 
           url.includes('.js') || 
           url.includes('.woff') || 
           url.includes('.woff2') ||
           url.includes('logo_sxdfzb.png');
}

function isDynamicAsset(url) {
    return DYNAMIC_ASSETS_PATTERNS.some(pattern => pattern.test(url));
}

// === LIMPIEZA DE CACHÉ ===
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName.startsWith('math-ai-')) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        );
    }
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// === BACKGROUND SYNC ===
self.addEventListener('sync', (event) => {
    if (event.tag === 'form-submission') {
        // Aquí se pueden manejar envíos de formularios offline
        console.log('SW: Background sync for form submission');
    }
});

// === PUSH NOTIFICATIONS (Preparado para futuro) ===
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: 'https://res.cloudinary.com/dfuya0vrl/image/upload/v1746402411/logo_sxdfzb.png',
            badge: 'https://res.cloudinary.com/dfuya0vrl/image/upload/v1746402411/logo_sxdfzb.png',
            data: data.url
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

console.log('SW: Service Worker Math AI v1.2.0 loaded successfully'); 