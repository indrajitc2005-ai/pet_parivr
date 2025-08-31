// Horizontal Ring - Plates Around Invisible Pole with Card Flip

class HorizontalRing {
  constructor() {
    this.ring = document.getElementById('ring');
    this.panels = document.querySelectorAll('.panel');
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    if (!this.ring || this.panels.length === 0) return;
    
    // Update HTML structure for horizontal ring
    this.updateRingStructure();
    
    // Add click handlers for flipping
    this.panels.forEach((panel, index) => {
      // Set rotation variable for hover effects
      panel.style.setProperty('--panel-rotation', `${index * 60}deg`);
      
      // Click to flip
      panel.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!panel.classList.contains('flipped')) {
          this.flipPanel(panel);
        }
      });
      
      // Close button functionality
      const closeBtn = panel.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.unflipPanel(panel);
        });
      }
    });
    
    // Pause rotation on hover
    this.ring.addEventListener('mouseenter', () => {
      this.ring.style.animationPlayState = 'paused';
    });
    
    this.ring.addEventListener('mouseleave', () => {
      this.ring.style.animationPlayState = 'running';
    });
  }
  
  updateRingStructure() {
    // Update existing panels to new structure
    this.panels.forEach((panel, index) => {
      const existingThumb = panel.querySelector('.thumb');
      const existingMeta = panel.querySelector('.meta');
      
      if (existingThumb && existingMeta && !panel.querySelector('.panel-front')) {
        // Get existing data
        const thumbBg = existingThumb.style.backgroundImage;
        const metaText = existingMeta.textContent;
        
        // Create new structure
        panel.innerHTML = `
          <div class="panel-front">
            <div class="thumb" style="background-image:${thumbBg}"></div>
            <div class="meta">${metaText}</div>
            <div class="price">$${(Math.random() * 40 + 10).toFixed(2)}</div>
            <div class="flip-hint">Click to flip</div>
          </div>
          <div class="panel-back">
            <div class="close-btn">×</div>
            <h3>${metaText}</h3>
            <div class="product-details">
              <div class="detail-item">
                <span class="detail-icon">✨</span>
                <span>Premium quality</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">🚚</span>
                <span>Fast delivery</span>
              </div>
              <div class="detail-item">
                <span class="detail-icon">💯</span>
                <span>Satisfaction guaranteed</span>
              </div>
            </div>
            <div class="product-description">
              High-quality pet product designed for maximum enjoyment and safety. Perfect for pets of all sizes and ages.
            </div>
            <div class="product-features">
              <span class="feature-tag">Quality</span>
              <span class="feature-tag">Safe</span>
              <span class="feature-tag">Fun</span>
            </div>
            <div class="action-buttons">
              <button class="btn-small">Add to Cart</button>
              <button class="btn-small primary">Buy Now</button>
            </div>
          </div>
        `;
        
        // Add product data attribute
        panel.setAttribute('data-product', metaText.toLowerCase().replace(/\s+/g, '-'));
      }
    });
  }
  
  flipPanel(panel) {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    // Pause ring rotation
    this.ring.style.animationPlayState = 'paused';
    
    // Add flipped class
    panel.classList.add('flipped');
    
    // Scale up the panel
    panel.style.transform = panel.style.transform.replace(/scale\([^)]*\)/, '') + ' scale(1.2)';
    panel.style.zIndex = '100';
    
    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false;
    }, 800);
  }
  
  unflipPanel(panel) {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    // Remove flipped class
    panel.classList.remove('flipped');
    
    // Reset scale
    panel.style.transform = panel.style.transform.replace(/scale\([^)]*\)/, '');
    panel.style.zIndex = '';
    
    // Resume ring rotation
    setTimeout(() => {
      this.ring.style.animationPlayState = 'running';
      this.isAnimating = false;
    }, 800);
  }
  
  // Add button functionality
  addButtonHandlers() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-small')) {
        e.preventDefault();
        
        const panel = e.target.closest('.panel');
        const productName = panel.querySelector('h3').textContent;
        
        if (e.target.textContent === 'Add to Cart') {
          this.addToCart(productName);
        } else if (e.target.textContent === 'Buy Now') {
          this.buyNow(productName);
        }
      }
    });
  }
  
  addToCart(productName) {
    // Simulate add to cart
    this.showNotification(`${productName} added to cart! 🛒`);
  }
  
  buyNow(productName) {
    // Simulate buy now
    this.showNotification(`Redirecting to checkout for ${productName}... 💳`);
  }
  
  showNotification(message) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'product-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      color: #051019;
      padding: 15px 20px;
      border-radius: 12px;
      font-weight: 600;
      z-index: 10000;
      animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(notificationStyles);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const horizontalRing = new HorizontalRing();
    horizontalRing.addButtonHandlers();
    
    // Make globally accessible
    window.horizontalRing = horizontalRing;
  }, 100);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HorizontalRing };
}