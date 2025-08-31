/**
 * Advanced AR/VR E-commerce Integration
 * Features: Virtual try-on, 3D product visualization, AR pet fitting, VR store experience
 */

class ARVRCommerce {
  constructor() {
    this.arSupported = false;
    this.vrSupported = false;
    this.camera = null;
    this.arSession = null;
    this.vrSession = null;
    this.products3D = new Map();
    this.init();
  }

  async init() {
    await this.checkARVRSupport();
    this.setupARCommerce();
    this.setupVRStore();
    this.setup3DProductViewer();
    this.setupVirtualTryOn();
    this.setupARPetFitting();
  }

  async checkARVRSupport() {
    // Check WebXR support
    if ('xr' in navigator) {
      try {
        this.arSupported = await navigator.xr.isSessionSupported('immersive-ar');
        this.vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
      } catch (e) {
        console.log('WebXR not fully supported');
      }
    }

    // Fallback to WebRTC for camera access
    if (!this.arSupported && navigator.mediaDevices) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.camera = stream;
        this.arSupported = true; // Fallback AR support
        stream.getTracks().forEach(track => track.stop()); // Stop for now
      } catch (e) {
        console.log('Camera access denied');
      }
    }
  }

  setupARCommerce() {
    const arSection = document.createElement('section');
    arSection.className = 'ar-commerce-section';
    arSection.style.marginTop = '40px';
    arSection.innerHTML = `
      <div class="ar-header">
        <h2>🥽 AR Shopping Experience</h2>
        <p style="color:var(--muted); margin-top:4px">Try products in your space before buying</p>
      </div>
      
      <div class="ar-features">
        <div class="ar-feature-card">
          <div class="ar-icon">📱</div>
          <h3>Virtual Pet Fitting</h3>
          <p>See how collars, clothes, and accessories look on your pet using AR</p>
          <button class="btn ar-btn" onclick="this.startPetFitting()" ${!this.arSupported ? 'disabled' : ''}>
            ${this.arSupported ? 'Try AR Fitting' : 'AR Not Available'}
          </button>
        </div>

        <div class="ar-feature-card">
          <div class="ar-icon">🏠</div>
          <h3>Home Placement</h3>
          <p>Visualize pet furniture, beds, and toys in your actual space</p>
          <button class="btn ar-btn" onclick="this.startHomePlacement()" ${!this.arSupported ? 'disabled' : ''}>
            ${this.arSupported ? 'Place in AR' : 'AR Not Available'}
          </button>
        </div>

        <div class="ar-feature-card">
          <div class="ar-icon">🎮</div>
          <h3>Interactive 3D Models</h3>
          <p>Examine products in detail with 360° 3D visualization</p>
          <button class="btn ar-btn" onclick="this.open3DViewer()">View 3D Models</button>
        </div>
      </div>

      <div class="ar-product-showcase" id="arProductShowcase">
        <h3>🛍️ AR-Ready Products</h3>
        <div class="ar-products-grid" id="arProductsGrid"></div>
      </div>
    `;

    const main = document.querySelector('main.container');
    if (main) {
      main.appendChild(arSection);
    }

    this.loadARProducts();
  }

  setupVRStore() {
    const vrSection = document.createElement('section');
    vrSection.className = 'vr-store-section';
    vrSection.style.marginTop = '40px';
    vrSection.innerHTML = `
      <div class="vr-header">
        <h2>🌐 Virtual Reality Pet Store</h2>
        <p style="color:var(--muted); margin-top:4px">Immersive shopping experience in virtual space</p>
      </div>

      <div class="vr-preview">
        <div class="vr-preview-image">
          <div class="vr-preview-content">
            <h3>Step into our Virtual Pet Store</h3>
            <p>Browse products in a fully immersive 3D environment</p>
            <div class="vr-features-list">
              <div class="vr-feature">✨ Realistic product interactions</div>
              <div class="vr-feature">🐕 Virtual pet companions</div>
              <div class="vr-feature">🛒 Gesture-based shopping</div>
              <div class="vr-feature">👥 Social shopping with friends</div>
            </div>
            <button class="btn vr-btn" onclick="this.enterVRStore()" ${!this.vrSupported ? 'disabled' : ''}>
              ${this.vrSupported ? '🥽 Enter VR Store' : 'VR Not Available'}
            </button>
          </div>
        </div>
      </div>

      <div class="vr-alternatives">
        <h4>Don't have VR? Try these alternatives:</h4>
        <div class="alternative-options">
          <button class="btn ghost" onclick="this.open360Tour()">🔄 360° Store Tour</button>
          <button class="btn ghost" onclick="this.openDesktopVR()">💻 Desktop VR Mode</button>
          <button class="btn ghost" onclick="this.openMobileVR()">📱 Mobile VR</button>
        </div>
      </div>
    `;

    const main = document.querySelector('main.container');
    if (main) {
      main.appendChild(vrSection);
    }
  }

  setup3DProductViewer() {
    const viewer3D = document.createElement('div');
    viewer3D.className = '3d-product-viewer';
    viewer3D.id = '3dProductViewer';
    viewer3D.innerHTML = `
      <div class="viewer-header">
        <h3>🎯 3D Product Viewer</h3>
        <button class="close-viewer" onclick="this.close3DViewer()">&times;</button>
      </div>
      <div class="viewer-content">
        <div class="3d-canvas-container">
          <canvas id="product3DCanvas" width="600" height="400"></canvas>
          <div class="3d-controls">
            <button class="control-btn" onclick="this.rotate3DModel('left')">↺</button>
            <button class="control-btn" onclick="this.rotate3DModel('right')">↻</button>
            <button class="control-btn" onclick="this.zoom3DModel('in')">🔍+</button>
            <button class="control-btn" onclick="this.zoom3DModel('out')">🔍-</button>
            <button class="control-btn" onclick="this.reset3DView()">🔄</button>
          </div>
        </div>
        <div class="product-info-3d">
          <h4 id="product3DName">Product Name</h4>
          <p id="product3DDescription">Product description...</p>
          <div class="product-3d-features">
            <h5>Interactive Features:</h5>
            <ul id="product3DFeatures"></ul>
          </div>
          <div class="product-3d-actions">
            <button class="btn" onclick="this.addToCartFrom3D()">🛒 Add to Cart</button>
            <button class="btn ghost" onclick="this.shareProduct3D()">📤 Share</button>
            <button class="btn ghost" onclick="this.tryInAR()">🥽 Try in AR</button>
          </div>
        </div>
      </div>
    `;

    viewer3D.style.display = 'none';
    document.body.appendChild(viewer3D);
  }

  setupVirtualTryOn() {
    const tryOnModal = document.createElement('div');
    tryOnModal.className = 'virtual-tryon-modal';
    tryOnModal.id = 'virtualTryOnModal';
    tryOnModal.innerHTML = `
      <div class="tryon-content">
        <div class="tryon-header">
          <h3>👔 Virtual Try-On</h3>
          <button class="close-tryon" onclick="this.closeTryOn()">&times;</button>
        </div>
        <div class="tryon-main">
          <div class="camera-view">
            <video id="tryOnVideo" autoplay muted></video>
            <canvas id="tryOnCanvas"></canvas>
            <div class="tryon-overlay">
              <div class="fitting-guide">
                <p>Position your pet in the camera view</p>
                <div class="guide-outline"></div>
              </div>
            </div>
          </div>
          <div class="tryon-controls">
            <div class="product-selector">
              <h4>Select Product to Try:</h4>
              <div class="tryon-products" id="tryOnProducts"></div>
            </div>
            <div class="fitting-options">
              <h4>Fitting Options:</h4>
              <div class="size-selector">
                <label>Size:</label>
                <select id="productSize">
                  <option value="xs">Extra Small</option>
                  <option value="s">Small</option>
                  <option value="m" selected>Medium</option>
                  <option value="l">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>
              <div class="color-selector">
                <label>Color:</label>
                <div class="color-options">
                  <div class="color-option" data-color="red" style="background: red;"></div>
                  <div class="color-option" data-color="blue" style="background: blue;"></div>
                  <div class="color-option" data-color="green" style="background: green;"></div>
                  <div class="color-option" data-color="black" style="background: black;"></div>
                </div>
              </div>
            </div>
            <div class="tryon-actions">
              <button class="btn" onclick="this.capturePhoto()">📸 Capture Photo</button>
              <button class="btn ghost" onclick="this.sharePhoto()">📤 Share</button>
              <button class="btn" onclick="this.addToCartFromTryOn()">🛒 Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;

    tryOnModal.style.display = 'none';
    document.body.appendChild(tryOnModal);
  }

  setupARPetFitting() {
    // Advanced AR pet fitting with pose detection
    this.petPoseDetector = {
      detectPetPose: async (imageData) => {
        // Simulate pet pose detection
        return {
          keypoints: [
            { name: 'nose', x: 300, y: 200, confidence: 0.9 },
            { name: 'neck', x: 300, y: 250, confidence: 0.8 },
            { name: 'chest', x: 300, y: 300, confidence: 0.85 }
          ],
          boundingBox: { x: 250, y: 150, width: 100, height: 200 }
        };
      },
      
      fitAccessory: (pose, accessory) => {
        // Calculate accessory placement based on pet pose
        const neckPoint = pose.keypoints.find(kp => kp.name === 'neck');
        if (neckPoint && accessory.type === 'collar') {
          return {
            x: neckPoint.x - accessory.width / 2,
            y: neckPoint.y - accessory.height / 2,
            rotation: 0,
            scale: this.calculateScale(pose.boundingBox, accessory)
          };
        }
        return null;
      }
    };
  }

  async loadARProducts() {
    const arProducts = [
      {
        id: 'ar-collar-1',
        name: 'Smart LED Collar',
        price: 599,
        image: 'https://picsum.photos/300/300?random=101',
        arModel: 'collar-3d.glb',
        category: 'collar',
        arReady: true
      },
      {
        id: 'ar-bed-1',
        name: 'Luxury Pet Bed',
        price: 1299,
        image: 'https://picsum.photos/300/300?random=102',
        arModel: 'bed-3d.glb',
        category: 'furniture',
        arReady: true
      },
      {
        id: 'ar-toy-1',
        name: 'Interactive Ball',
        price: 399,
        image: 'https://picsum.photos/300/300?random=103',
        arModel: 'ball-3d.glb',
        category: 'toy',
        arReady: true
      }
    ];

    const grid = document.getElementById('arProductsGrid');
    if (!grid) return;

    arProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'ar-product-card';
      productCard.innerHTML = `
        <div class="ar-product-image">
          <img src="${product.image}" alt="${product.name}">
          <div class="ar-badge">AR Ready</div>
        </div>
        <div class="ar-product-info">
          <h4>${product.name}</h4>
          <div class="price">₹${product.price}</div>
          <div class="ar-actions">
            <button class="btn ar-view-btn" onclick="this.viewInAR('${product.id}')">
              🥽 View in AR
            </button>
            <button class="btn ghost" onclick="this.view3D('${product.id}')">
              🎯 View 3D
            </button>
          </div>
        </div>
      `;
      grid.appendChild(productCard);
    });
  }

  // AR Methods
  async startPetFitting() {
    if (!this.arSupported) {
      this.showNotification('AR not supported on this device', 'error');
      return;
    }

    try {
      const modal = document.getElementById('virtualTryOnModal');
      modal.style.display = 'flex';

      const video = document.getElementById('tryOnVideo');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      video.srcObject = stream;

      this.startPoseDetection();
    } catch (error) {
      this.showNotification('Could not access camera', 'error');
    }
  }

  async startHomePlacement() {
    if (!this.arSupported) {
      this.showNotification('AR not supported on this device', 'error');
      return;
    }

    // Create AR placement interface
    const arInterface = document.createElement('div');
    arInterface.className = 'ar-placement-interface';
    arInterface.innerHTML = `
      <div class="ar-placement-header">
        <h3>🏠 AR Home Placement</h3>
        <button class="close-ar" onclick="this.closeARPlacement()">&times;</button>
      </div>
      <div class="ar-camera-view">
        <video id="arVideo" autoplay muted></video>
        <canvas id="arCanvas"></canvas>
        <div class="ar-instructions">
          <p>Point camera at floor to place furniture</p>
          <div class="ar-crosshair"></div>
        </div>
      </div>
      <div class="ar-product-selector">
        <div class="ar-product-options">
          <button class="ar-product-btn active" data-product="bed">🛏️ Pet Bed</button>
          <button class="ar-product-btn" data-product="house">🏠 Pet House</button>
          <button class="ar-product-btn" data-product="toy">🎾 Toy</button>
        </div>
        <div class="ar-controls">
          <button class="btn" onclick="this.placeProduct()">📍 Place Product</button>
          <button class="btn ghost" onclick="this.resetAR()">🔄 Reset</button>
        </div>
      </div>
    `;

    document.body.appendChild(arInterface);
    this.initializeARCamera();
  }

  async initializeARCamera() {
    try {
      const video = document.getElementById('arVideo');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      video.srcObject = stream;
      
      this.startARTracking();
    } catch (error) {
      this.showNotification('Could not access camera for AR', 'error');
    }
  }

  startARTracking() {
    const video = document.getElementById('arVideo');
    const canvas = document.getElementById('arCanvas');
    const ctx = canvas.getContext('2d');

    const trackFrame = () => {
      if (video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame
        ctx.drawImage(video, 0, 0);
        
        // Add AR overlays
        this.drawAROverlays(ctx);
      }
      
      requestAnimationFrame(trackFrame);
    };

    video.addEventListener('loadedmetadata', trackFrame);
  }

  drawAROverlays(ctx) {
    // Draw virtual furniture placement indicators
    ctx.strokeStyle = '#78dbff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Draw placement grid
    const gridSize = 50;
    for (let x = 0; x < ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  }

  // VR Methods
  async enterVRStore() {
    if (!this.vrSupported) {
      this.showNotification('VR not supported on this device', 'error');
      return;
    }

    try {
      this.vrSession = await navigator.xr.requestSession('immersive-vr');
      this.setupVRScene();
    } catch (error) {
      this.showNotification('Could not start VR session', 'error');
    }
  }

  setupVRScene() {
    // Create VR store environment
    const vrStore = {
      environment: 'modern_pet_store',
      lighting: 'natural',
      products: this.getVRProducts(),
      interactions: this.setupVRInteractions()
    };

    this.renderVRStore(vrStore);
  }

  getVRProducts() {
    return [
      {
        position: { x: -2, y: 0, z: -3 },
        model: 'pet_bed_vr.glb',
        info: { name: 'Luxury Pet Bed', price: 1299 }
      },
      {
        position: { x: 0, y: 1, z: -3 },
        model: 'collar_vr.glb',
        info: { name: 'Smart Collar', price: 599 }
      },
      {
        position: { x: 2, y: 0, z: -3 },
        model: 'toy_ball_vr.glb',
        info: { name: 'Interactive Ball', price: 399 }
      }
    ];
  }

  // 3D Viewer Methods
  open3DViewer(productId = null) {
    const viewer = document.getElementById('3dProductViewer');
    viewer.style.display = 'flex';
    
    if (productId) {
      this.load3DProduct(productId);
    } else {
      this.showProductSelector();
    }
  }

  load3DProduct(productId) {
    const canvas = document.getElementById('product3DCanvas');
    const ctx = canvas.getContext('2d');
    
    // Simulate 3D product rendering
    this.render3DProduct(ctx, productId);
  }

  render3DProduct(ctx, productId) {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw 3D-like product representation
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    // Create gradient for 3D effect
    const gradient = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 150);
    gradient.addColorStop(0, '#78dbff');
    gradient.addColorStop(0.5, '#ff77c6');
    gradient.addColorStop(1, '#a78bfa');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add product details
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('3D Product Model', centerX, centerY + 150);
    ctx.fillText('Rotate • Zoom • Interact', centerX, centerY + 170);
  }

  // Utility Methods
  calculateScale(boundingBox, accessory) {
    const petSize = Math.max(boundingBox.width, boundingBox.height);
    const baseScale = petSize / 200; // Normalize to base size
    return Math.max(0.5, Math.min(2.0, baseScale));
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Cleanup methods
  closeARPlacement() {
    const arInterface = document.querySelector('.ar-placement-interface');
    if (arInterface) {
      arInterface.remove();
    }
  }

  closeTryOn() {
    const modal = document.getElementById('virtualTryOnModal');
    modal.style.display = 'none';
    
    const video = document.getElementById('tryOnVideo');
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
  }

  close3DViewer() {
    const viewer = document.getElementById('3dProductViewer');
    viewer.style.display = 'none';
  }
}

// Initialize AR/VR Commerce system
document.addEventListener('DOMContentLoaded', () => {
  window.arvrCommerce = new ARVRCommerce();
});