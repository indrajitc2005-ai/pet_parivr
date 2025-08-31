/**
 * Progressive Web App (PWA) System
 * Features: Service Worker, Offline functionality, Push notifications, App installation
 */

class PWASystem {
  constructor() {
    this.serviceWorker = null;
    this.pushSubscription = null;
    this.installPrompt = null;
    this.isOnline = navigator.onLine;
    this.offlineQueue = [];
    this.syncTasks = new Map();
    this.init();
  }

  async init() {
    this.setupServiceWorker();
    this.setupInstallPrompt();
    this.setupPushNotifications();
    this.setupOfflineHandling();
    this.setupBackgroundSync();
    this.setupPeriodicSync();
    this.createPWAInterface();
  }

  async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        this.serviceWorker = registration;
        
        console.log('Service Worker registered:', registration);
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
        
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event.data);
        });
        
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      this.installPrompt = null;
      this.hideInstallButton();
      this.showNotification('App installed successfully!', 'success');
    });
  }

  async setupPushNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted' && this.serviceWorker) {
        try {
          this.pushSubscription = await this.serviceWorker.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(this.getVapidPublicKey())
          });
          
          // Send subscription to server
          await this.sendSubscriptionToServer(this.pushSubscription);
          
        } catch (error) {
          console.error('Push subscription failed:', error);
        }
      }
    }
  }

  setupOfflineHandling() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processOfflineQueue();
      this.showNotification('Back online! Syncing data...', 'success');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showNotification('You are offline. Data will sync when connection is restored.', 'warning');
    });
  }

  setupBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      // Register background sync tasks
      this.registerSyncTask('sync-health-data', () => this.syncHealthData());
      this.registerSyncTask('sync-appointments', () => this.syncAppointments());
      this.registerSyncTask('sync-prescriptions', () => this.syncPrescriptions());
    }
  }

  setupPeriodicSync() {
    if ('serviceWorker' in navigator && 'periodicSync' in window.ServiceWorkerRegistration.prototype) {
      this.serviceWorker.periodicSync.register('health-reminders', {
        minInterval: 24 * 60 * 60 * 1000 // 24 hours
      });
    }
  }

  createPWAInterface() {
    const pwaSection = document.createElement('section');
    pwaSection.className = 'pwa-system';
    pwaSection.style.marginTop = '40px';
    pwaSection.innerHTML = `
      <div class="pwa-header">
        <h2>📱 Progressive Web App Features</h2>
        <p style="color:var(--muted); margin-top:4px">Enhanced mobile experience with offline capabilities</p>
      </div>

      <div class="pwa-features">
        <div class="pwa-feature-card">
          <div class="pwa-icon">📲</div>
          <h3>Install App</h3>
          <p>Install Furry Tails as a native app on your device</p>
          <button class="btn install-btn" id="installBtn" style="display: none;">
            📲 Install App
          </button>
          <div class="install-status" id="installStatus">
            App installation not available
          </div>
        </div>

        <div class="pwa-feature-card">
          <div class="pwa-icon">🔔</div>
          <h3>Push Notifications</h3>
          <p>Get reminders for medications, appointments, and health updates</p>
          <button class="btn" id="enableNotifications">
            🔔 Enable Notifications
          </button>
          <div class="notification-status" id="notificationStatus">
            Notifications disabled
          </div>
        </div>

        <div class="pwa-feature-card">
          <div class="pwa-icon">📴</div>
          <h3>Offline Mode</h3>
          <p>Access your pet's health data even without internet connection</p>
          <div class="offline-status" id="offlineStatus">
            <span class="status-indicator online"></span>
            <span>Online</span>
          </div>
          <button class="btn ghost" onclick="this.testOfflineMode()">
            🧪 Test Offline Mode
          </button>
        </div>

        <div class="pwa-feature-card">
          <div class="pwa-icon">🔄</div>
          <h3>Background Sync</h3>
          <p>Automatic data synchronization when connection is restored</p>
          <div class="sync-status" id="syncStatus">
            <div class="sync-queue">Queue: <span id="queueCount">0</span> items</div>
            <div class="last-sync">Last sync: <span id="lastSync">Never</span></div>
          </div>
          <button class="btn ghost" onclick="this.forcSync()">
            🔄 Force Sync
          </button>
        </div>
      </div>

      <div class="pwa-dashboard">
        <h3>📊 App Performance</h3>
        <div class="performance-metrics">
          <div class="metric-card">
            <h4>Cache Size</h4>
            <span class="metric-value" id="cacheSize">Calculating...</span>
          </div>
          <div class="metric-card">
            <h4>Offline Requests</h4>
            <span class="metric-value" id="offlineRequests">0</span>
          </div>
          <div class="metric-card">
            <h4>Background Syncs</h4>
            <span class="metric-value" id="backgroundSyncs">0</span>
          </div>
          <div class="metric-card">
            <h4>Push Messages</h4>
            <span class="metric-value" id="pushMessages">0</span>
          </div>
        </div>
      </div>

      <div class="pwa-settings">
        <h3>⚙️ PWA Settings</h3>
        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" id="autoSync" checked>
              <span>Auto-sync when online</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" id="backgroundNotifications" checked>
              <span>Background notifications</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" id="offlineMode" checked>
              <span>Enable offline mode</span>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <input type="checkbox" id="dataCompression" checked>
              <span>Compress cached data</span>
            </label>
          </div>
        </div>
      </div>
    `;

    const main = document.querySelector('main.container');
    if (main) {
      main.appendChild(pwaSection);
    }

    this.bindPWAEvents();
    this.updatePWAStatus();
  }

  bindPWAEvents() {
    const installBtn = document.getElementById('installBtn');
    const enableNotifications = document.getElementById('enableNotifications');

    if (installBtn) {
      installBtn.addEventListener('click', () => {
        this.installApp();
      });
    }

    if (enableNotifications) {
      enableNotifications.addEventListener('click', () => {
        this.enableNotifications();
      });
    }

    // Update online/offline status
    this.updateOnlineStatus();
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
  }

  showInstallButton() {
    const installBtn = document.getElementById('installBtn');
    const installStatus = document.getElementById('installStatus');
    
    if (installBtn && installStatus) {
      installBtn.style.display = 'block';
      installStatus.textContent = 'App can be installed';
      installStatus.style.color = 'var(--success)';
    }
  }

  hideInstallButton() {
    const installBtn = document.getElementById('installBtn');
    const installStatus = document.getElementById('installStatus');
    
    if (installBtn && installStatus) {
      installBtn.style.display = 'none';
      installStatus.textContent = 'App is installed';
      installStatus.style.color = 'var(--success)';
    }
  }

  async installApp() {
    if (this.installPrompt) {
      const result = await this.installPrompt.prompt();
      console.log('Install prompt result:', result);
      this.installPrompt = null;
    }
  }

  async enableNotifications() {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        this.updateNotificationStatus('Notifications enabled', 'var(--success)');
        
        // Show test notification
        this.showPushNotification('Notifications Enabled!', {
          body: 'You will now receive important updates about your pet\'s health.',
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png'
        });
        
        // Schedule health reminders
        this.scheduleHealthReminders();
        
      } else {
        this.updateNotificationStatus('Notifications denied', 'var(--error)');
      }
    } catch (error) {
      console.error('Notification setup failed:', error);
      this.updateNotificationStatus('Notification setup failed', 'var(--error)');
    }
  }

  updateNotificationStatus(message, color) {
    const status = document.getElementById('notificationStatus');
    if (status) {
      status.textContent = message;
      status.style.color = color;
    }
  }

  updateOnlineStatus() {
    const offlineStatus = document.getElementById('offlineStatus');
    if (offlineStatus) {
      const indicator = offlineStatus.querySelector('.status-indicator');
      const text = offlineStatus.querySelector('span:last-child');
      
      if (this.isOnline) {
        indicator.className = 'status-indicator online';
        text.textContent = 'Online';
      } else {
        indicator.className = 'status-indicator offline';
        text.textContent = 'Offline';
      }
    }
  }

  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;

    const queueCopy = [...this.offlineQueue];
    this.offlineQueue = [];

    for (const request of queueCopy) {
      try {
        await this.executeRequest(request);
        console.log('Offline request processed:', request);
      } catch (error) {
        console.error('Failed to process offline request:', error);
        // Re-queue failed requests
        this.offlineQueue.push(request);
      }
    }

    this.updateQueueCount();
  }

  addToOfflineQueue(request) {
    this.offlineQueue.push({
      ...request,
      timestamp: Date.now()
    });
    this.updateQueueCount();
  }

  updateQueueCount() {
    const queueCount = document.getElementById('queueCount');
    if (queueCount) {
      queueCount.textContent = this.offlineQueue.length;
    }
  }

  registerSyncTask(tag, handler) {
    this.syncTasks.set(tag, handler);
    
    if (this.serviceWorker) {
      this.serviceWorker.sync.register(tag);
    }
  }

  async executeRequest(request) {
    const response = await fetch(request.url, {
      method: request.method || 'GET',
      headers: request.headers || {},
      body: request.body || null
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response;
  }

  handleServiceWorkerMessage(data) {
    switch (data.type) {
      case 'SYNC_COMPLETE':
        this.updateLastSyncTime();
        this.showNotification('Data synchronized successfully', 'success');
        break;
      
      case 'CACHE_UPDATED':
        this.updateCacheSize();
        break;
      
      case 'PUSH_RECEIVED':
        this.incrementPushMessageCount();
        break;
      
      case 'OFFLINE_REQUEST':
        this.addToOfflineQueue(data.request);
        break;
    }
  }

  async updateCacheSize() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const cacheSize = document.getElementById('cacheSize');
      
      if (cacheSize) {
        const sizeInMB = (estimate.usage / (1024 * 1024)).toFixed(2);
        cacheSize.textContent = `${sizeInMB} MB`;
      }
    }
  }

  updateLastSyncTime() {
    const lastSync = document.getElementById('lastSync');
    if (lastSync) {
      lastSync.textContent = new Date().toLocaleTimeString();
    }
  }

  incrementPushMessageCount() {
    const pushMessages = document.getElementById('pushMessages');
    if (pushMessages) {
      const current = parseInt(pushMessages.textContent) || 0;
      pushMessages.textContent = current + 1;
    }
  }

  async scheduleHealthReminders() {
    // Schedule various health reminders
    const reminders = [
      {
        title: 'Medication Reminder',
        body: 'Time to give Buddy his medication',
        delay: 2 * 60 * 60 * 1000 // 2 hours
      },
      {
        title: 'Vaccination Due',
        body: 'Whiskers\' annual vaccination is due next week',
        delay: 24 * 60 * 60 * 1000 // 24 hours
      },
      {
        title: 'Health Checkup',
        body: 'Schedule your pet\'s quarterly health checkup',
        delay: 7 * 24 * 60 * 60 * 1000 // 7 days
      }
    ];

    reminders.forEach((reminder, index) => {
      setTimeout(() => {
        this.showPushNotification(reminder.title, {
          body: reminder.body,
          icon: '/icon-192x192.png',
          badge: '/badge-72x72.png',
          tag: `health-reminder-${index}`,
          requireInteraction: true
        });
      }, reminder.delay);
    });
  }

  showPushNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);
    }
  }

  async syncHealthData() {
    try {
      // Sync health records, medications, appointments
      const healthData = this.getLocalHealthData();
      
      if (healthData.length > 0) {
        const response = await fetch('/api/sync/health', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(healthData)
        });

        if (response.ok) {
          this.clearLocalHealthData();
          console.log('Health data synced successfully');
        }
      }
    } catch (error) {
      console.error('Health data sync failed:', error);
    }
  }

  async syncAppointments() {
    try {
      const appointments = this.getLocalAppointments();
      
      if (appointments.length > 0) {
        const response = await fetch('/api/sync/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(appointments)
        });

        if (response.ok) {
          this.clearLocalAppointments();
          console.log('Appointments synced successfully');
        }
      }
    } catch (error) {
      console.error('Appointments sync failed:', error);
    }
  }

  async syncPrescriptions() {
    try {
      const prescriptions = this.getLocalPrescriptions();
      
      if (prescriptions.length > 0) {
        const response = await fetch('/api/sync/prescriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(prescriptions)
        });

        if (response.ok) {
          this.clearLocalPrescriptions();
          console.log('Prescriptions synced successfully');
        }
      }
    } catch (error) {
      console.error('Prescriptions sync failed:', error);
    }
  }

  testOfflineMode() {
    // Simulate offline mode for testing
    this.isOnline = false;
    this.updateOnlineStatus();
    this.showNotification('Offline mode activated for testing', 'warning');
    
    // Restore online mode after 10 seconds
    setTimeout(() => {
      this.isOnline = true;
      this.updateOnlineStatus();
      this.showNotification('Online mode restored', 'success');
    }, 10000);
  }

  forcSync() {
    if (this.isOnline) {
      this.processOfflineQueue();
      this.syncHealthData();
      this.syncAppointments();
      this.syncPrescriptions();
      this.showNotification('Manual sync initiated', 'success');
    } else {
      this.showNotification('Cannot sync while offline', 'error');
    }
  }

  updatePWAStatus() {
    // Update various PWA status indicators
    this.updateCacheSize();
    this.updateQueueCount();
    
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.hideInstallButton();
    }
    
    // Check notification permission
    if (Notification.permission === 'granted') {
      this.updateNotificationStatus('Notifications enabled', 'var(--success)');
    } else if (Notification.permission === 'denied') {
      this.updateNotificationStatus('Notifications blocked', 'var(--error)');
    }
  }

  // Utility methods
  getLocalHealthData() {
    const data = localStorage.getItem('pendingHealthData');
    return data ? JSON.parse(data) : [];
  }

  clearLocalHealthData() {
    localStorage.removeItem('pendingHealthData');
  }

  getLocalAppointments() {
    const data = localStorage.getItem('pendingAppointments');
    return data ? JSON.parse(data) : [];
  }

  clearLocalAppointments() {
    localStorage.removeItem('pendingAppointments');
  }

  getLocalPrescriptions() {
    const data = localStorage.getItem('pendingPrescriptions');
    return data ? JSON.parse(data) : [];
  }

  clearLocalPrescriptions() {
    localStorage.removeItem('pendingPrescriptions');
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  getVapidPublicKey() {
    // In production, this would be your actual VAPID public key
    return 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f8HnKJuOmLsOBJXoRJNQRhHlbEi2Sab2FKVOy5w4GiEU-mEiIBY';
  }

  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }
    } catch (error) {
      console.error('Failed to send subscription:', error);
    }
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <h4>🔄 App Update Available</h4>
        <p>A new version of Furry Tails is available. Refresh to update.</p>
        <div class="update-actions">
          <button class="btn" onclick="window.location.reload()">Update Now</button>
          <button class="btn ghost" onclick="this.parentElement.parentElement.parentElement.remove()">Later</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `pwa-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

// Initialize PWA System
document.addEventListener('DOMContentLoaded', () => {
  window.pwaSystem = new PWASystem();
});