/**
 * Service Worker for Furry Tails PWA
 * Handles caching, offline functionality, background sync, and push notifications
 */

const CACHE_NAME = 'furry-tails-v1.0.0';
const STATIC_CACHE = 'furry-tails-static-v1';
const DYNAMIC_CACHE = 'furry-tails-dynamic-v1';
const API_CACHE = 'furry-tails-api-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/layout.css',
  '/css/components.css',
  '/css/animations.css',
  '/css/advanced-features.css',
  '/js/app.js',
  '/js/chatbot.js',
  '/js/advanced-ai-health.js',
  '/js/ar-vr-commerce.js',
  '/js/telemedicine-platform.js',
  '/js/blockchain-health-records.js',
  '/js/pwa-system.js',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/pets',
  '/api/health-records',
  '/api/medications',
  '/api/appointments',
  '/api/prescriptions'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(API_CACHE).then((cache) => {
        // Pre-cache some API endpoints
        return Promise.all(
          API_ENDPOINTS.map(endpoint => {
            return fetch(endpoint)
              .then(response => {
                if (response.ok) {
                  return cache.put(endpoint, response);
                }
              })
              .catch(() => {
                // Ignore errors for pre-caching
                console.log(`Failed to pre-cache ${endpoint}`);
              });
          })
        );
      })
    ]).then(() => {
      console.log('Service Worker installed successfully');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    if (isStaticAsset(request)) {
      event.respondWith(cacheFirst(request));
    } else if (isAPIRequest(request)) {
      event.respondWith(networkFirstWithFallback(request));
    } else if (isImageRequest(request)) {
      event.respondWith(cacheFirstWithNetworkFallback(request));
    } else {
      event.respondWith(staleWhileRevalidate(request));
    }
  } else {
    // Handle POST, PUT, DELETE requests
    event.respondWith(handleMutatingRequest(request));
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case 'sync-health-data':
      event.waitUntil(syncHealthData());
      break;
    case 'sync-appointments':
      event.waitUntil(syncAppointments());
      break;
    case 'sync-prescriptions':
      event.waitUntil(syncPrescriptions());
      break;
    case 'sync-offline-actions':
      event.waitUntil(syncOfflineActions());
      break;
  }
});

// Periodic background sync (for browsers that support it)
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic sync triggered:', event.tag);
  
  switch (event.tag) {
    case 'health-reminders':
      event.waitUntil(sendHealthReminders());
      break;
    case 'medication-alerts':
      event.waitUntil(sendMedicationAlerts());
      break;
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  let notificationData = {
    title: 'Furry Tails',
    body: 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'default'
  };

  if (event.data) {
    try {
      notificationData = { ...notificationData, ...event.data.json() };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction || false,
      actions: notificationData.actions || [],
      data: notificationData.data || {}
    }).then(() => {
      // Notify main app about push message
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'PUSH_RECEIVED',
            data: notificationData
          });
        });
      });
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Check if app is already open
      for (const client of clients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if app is not open
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Message event - handle messages from main app
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_HEALTH_DATA':
      cacheHealthData(data);
      break;
    case 'QUEUE_OFFLINE_ACTION':
      queueOfflineAction(data);
      break;
  }
});

// Caching Strategies

function cacheFirst(request) {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        const responseClone = networkResponse.clone();
        caches.open(STATIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return networkResponse;
    });
  });
}

function networkFirstWithFallback(request) {
  return fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      caches.open(API_CACHE).then((cache) => {
        cache.put(request, responseClone);
      });
      return networkResponse;
    }
    throw new Error('Network response not ok');
  }).catch(() => {
    return caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Return offline fallback for API requests
      return new Response(JSON.stringify({
        error: 'Offline',
        message: 'This data is not available offline',
        cached: false
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });
}

function cacheFirstWithNetworkFallback(request) {
  return caches.match(request).then((cachedResponse) => {
    if (cachedResponse) {
      // Update cache in background
      fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, networkResponse);
          });
        }
      }).catch(() => {
        // Ignore network errors
      });
      
      return cachedResponse;
    }
    
    return fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        const responseClone = networkResponse.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return networkResponse;
    });
  });
}

function staleWhileRevalidate(request) {
  return caches.match(request).then((cachedResponse) => {
    const fetchPromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        const responseClone = networkResponse.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });
      }
      return networkResponse;
    });
    
    return cachedResponse || fetchPromise;
  });
}

function handleMutatingRequest(request) {
  return fetch(request).catch(() => {
    // Queue the request for later sync
    return queueOfflineAction({
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      body: request.body
    }).then(() => {
      return new Response(JSON.stringify({
        success: true,
        message: 'Request queued for sync when online',
        queued: true
      }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });
}

// Background Sync Functions

async function syncHealthData() {
  try {
    const healthData = await getStoredData('pendingHealthData');
    
    if (healthData.length > 0) {
      const response = await fetch('/api/sync/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(healthData)
      });
      
      if (response.ok) {
        await clearStoredData('pendingHealthData');
        notifyClients({ type: 'SYNC_COMPLETE', data: 'health' });
      }
    }
  } catch (error) {
    console.error('Health data sync failed:', error);
  }
}

async function syncAppointments() {
  try {
    const appointments = await getStoredData('pendingAppointments');
    
    if (appointments.length > 0) {
      const response = await fetch('/api/sync/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointments)
      });
      
      if (response.ok) {
        await clearStoredData('pendingAppointments');
        notifyClients({ type: 'SYNC_COMPLETE', data: 'appointments' });
      }
    }
  } catch (error) {
    console.error('Appointments sync failed:', error);
  }
}

async function syncPrescriptions() {
  try {
    const prescriptions = await getStoredData('pendingPrescriptions');
    
    if (prescriptions.length > 0) {
      const response = await fetch('/api/sync/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prescriptions)
      });
      
      if (response.ok) {
        await clearStoredData('pendingPrescriptions');
        notifyClients({ type: 'SYNC_COMPLETE', data: 'prescriptions' });
      }
    }
  } catch (error) {
    console.error('Prescriptions sync failed:', error);
  }
}

async function syncOfflineActions() {
  try {
    const actions = await getStoredData('offlineActions');
    
    for (const action of actions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        if (response.ok) {
          // Remove successful action from queue
          await removeStoredAction(action.id);
        }
      } catch (error) {
        console.error('Failed to sync action:', action, error);
      }
    }
  } catch (error) {
    console.error('Offline actions sync failed:', error);
  }
}

// Periodic Sync Functions

async function sendHealthReminders() {
  try {
    // Get pets that need health reminders
    const pets = await getStoredData('pets');
    const now = Date.now();
    
    for (const pet of pets) {
      // Check for overdue vaccinations
      if (pet.nextVaccination && pet.nextVaccination < now) {
        await self.registration.showNotification('Vaccination Reminder', {
          body: `${pet.name}'s vaccination is overdue. Please schedule an appointment.`,
          icon: '/icon-192x192.png',
          tag: `vaccination-${pet.id}`,
          requireInteraction: true,
          data: { url: '/consult.html', petId: pet.id }
        });
      }
      
      // Check for medication reminders
      if (pet.medications) {
        for (const medication of pet.medications) {
          if (shouldRemindMedication(medication, now)) {
            await self.registration.showNotification('Medication Reminder', {
              body: `Time to give ${pet.name} their ${medication.name}`,
              icon: '/icon-192x192.png',
              tag: `medication-${pet.id}-${medication.id}`,
              data: { url: '/', petId: pet.id }
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Health reminders failed:', error);
  }
}

async function sendMedicationAlerts() {
  try {
    const medications = await getStoredData('activeMedications');
    const now = Date.now();
    
    for (const medication of medications) {
      if (medication.nextDose && medication.nextDose <= now) {
        await self.registration.showNotification('Medication Alert', {
          body: `${medication.petName} needs ${medication.name} - ${medication.dosage}`,
          icon: '/icon-192x192.png',
          tag: `med-alert-${medication.id}`,
          requireInteraction: true,
          actions: [
            { action: 'given', title: 'Mark as Given' },
            { action: 'snooze', title: 'Remind Later' }
          ],
          data: { medicationId: medication.id }
        });
      }
    }
  } catch (error) {
    console.error('Medication alerts failed:', error);
  }
}

// Utility Functions

function isStaticAsset(request) {
  return STATIC_ASSETS.some(asset => request.url.includes(asset));
}

function isAPIRequest(request) {
  return request.url.includes('/api/');
}

function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(request.url);
}

async function getStoredData(key) {
  try {
    const cache = await caches.open(API_CACHE);
    const response = await cache.match(`/storage/${key}`);
    
    if (response) {
      return await response.json();
    }
    
    return [];
  } catch (error) {
    console.error('Failed to get stored data:', error);
    return [];
  }
}

async function clearStoredData(key) {
  try {
    const cache = await caches.open(API_CACHE);
    await cache.delete(`/storage/${key}`);
  } catch (error) {
    console.error('Failed to clear stored data:', error);
  }
}

async function cacheHealthData(data) {
  try {
    const cache = await caches.open(API_CACHE);
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put('/storage/pendingHealthData', response);
  } catch (error) {
    console.error('Failed to cache health data:', error);
  }
}

async function queueOfflineAction(action) {
  try {
    const actions = await getStoredData('offlineActions');
    const newAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    
    actions.push(newAction);
    
    const cache = await caches.open(API_CACHE);
    const response = new Response(JSON.stringify(actions), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put('/storage/offlineActions', response);
    
    // Register background sync
    await self.registration.sync.register('sync-offline-actions');
    
  } catch (error) {
    console.error('Failed to queue offline action:', error);
  }
}

async function removeStoredAction(actionId) {
  try {
    const actions = await getStoredData('offlineActions');
    const filteredActions = actions.filter(action => action.id !== actionId);
    
    const cache = await caches.open(API_CACHE);
    const response = new Response(JSON.stringify(filteredActions), {
      headers: { 'Content-Type': 'application/json' }
    });
    
    await cache.put('/storage/offlineActions', response);
  } catch (error) {
    console.error('Failed to remove stored action:', error);
  }
}

function shouldRemindMedication(medication, now) {
  if (!medication.schedule || !medication.lastGiven) {
    return false;
  }
  
  const timeSinceLastDose = now - medication.lastGiven;
  const intervalMs = medication.intervalHours * 60 * 60 * 1000;
  
  return timeSinceLastDose >= intervalMs;
}

function notifyClients(message) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(message);
    });
  });
}

console.log('Service Worker loaded successfully');