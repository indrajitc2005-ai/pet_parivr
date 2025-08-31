// New Sections Interactive Functionality

// Tab System for Nutrition Guide
class NutritionTabs {
  constructor() {
    this.init();
  }
  
  init() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Show corresponding panel
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }
}

// Tips Carousel System
class TipsCarousel {
  constructor() {
    this.currentTip = 0;
    this.tips = document.querySelectorAll('.tip-card');
    this.dots = document.querySelectorAll('.dot');
    this.prevBtn = document.querySelector('.carousel-btn.prev');
    this.nextBtn = document.querySelector('.carousel-btn.next');
    this.autoPlayInterval = null;
    
    this.init();
  }
  
  init() {
    if (this.tips.length === 0) return;
    
    // Bind event listeners
    this.prevBtn?.addEventListener('click', () => this.prevTip());
    this.nextBtn?.addEventListener('click', () => this.nextTip());
    
    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToTip(index));
    });
    
    // Auto-play
    this.startAutoPlay();
    
    // Pause on hover
    const carousel = document.querySelector('.tips-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
      carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    }
  }
  
  showTip(index) {
    // Hide all tips
    this.tips.forEach(tip => tip.classList.remove('active'));
    this.dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current tip
    if (this.tips[index]) {
      this.tips[index].classList.add('active');
    }
    if (this.dots[index]) {
      this.dots[index].classList.add('active');
    }
    
    this.currentTip = index;
  }
  
  nextTip() {
    const nextIndex = (this.currentTip + 1) % this.tips.length;
    this.showTip(nextIndex);
  }
  
  prevTip() {
    const prevIndex = (this.currentTip - 1 + this.tips.length) % this.tips.length;
    this.showTip(prevIndex);
  }
  
  goToTip(index) {
    this.showTip(index);
  }
  
  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextTip();
    }, 5000); // Change tip every 5 seconds
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Enhanced Ring Product Showcase
class EnhancedRing {
  constructor() {
    this.ring = document.getElementById('ring');
    this.panels = document.querySelectorAll('.panel');
    this.currentCenter = 0;
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    if (!this.ring || this.panels.length === 0) return;
    
    // Set initial positions
    this.updatePanelPositions();
    
    // Add click handlers to panels
    this.panels.forEach((panel, index) => {
      panel.addEventListener('click', () => {
        if (!this.isAnimating) {
          this.centerPanel(index);
        }
      });
    });
    
    // Auto-rotate every 4 seconds
    setInterval(() => {
      if (!this.isAnimating) {
        this.nextPanel();
      }
    }, 4000);
  }
  
  updatePanelPositions() {
    const positions = [
      { left: '50%', top: '50%', z: 0, scale: 1, zIndex: 6 }, // center
      { left: '75%', top: '25%', z: -100, scale: 0.8, zIndex: 5 }, // top-right
      { left: '75%', top: '75%', z: -200, scale: 0.6, zIndex: 4 }, // bottom-right
      { left: '50%', top: '90%', z: -300, scale: 0.4, zIndex: 3 }, // bottom
      { left: '25%', top: '75%', z: -200, scale: 0.6, zIndex: 4 }, // bottom-left
      { left: '25%', top: '25%', z: -100, scale: 0.8, zIndex: 5 }  // top-left
    ];
    
    this.panels.forEach((panel, index) => {
      const posIndex = (index - this.currentCenter + this.panels.length) % this.panels.length;
      const pos = positions[posIndex];
      
      panel.style.left = pos.left;
      panel.style.top = pos.top;
      panel.style.transform = `translate(-50%, -50%) translateZ(${pos.z}px) scale(${pos.scale})`;
      panel.style.zIndex = pos.zIndex;
      
      // Add CSS custom properties for animation
      panel.style.setProperty('--panel-z', pos.z + 'px');
      panel.style.setProperty('--panel-scale', pos.scale);
    });
  }
  
  centerPanel(index) {
    if (index === this.currentCenter) return;
    
    this.isAnimating = true;
    this.currentCenter = index;
    
    // Update positions with smooth transition
    this.updatePanelPositions();
    
    // Reset animation flag after transition
    setTimeout(() => {
      this.isAnimating = false;
    }, 600);
  }
  
  nextPanel() {
    const nextIndex = (this.currentCenter + 1) % this.panels.length;
    this.centerPanel(nextIndex);
  }
}

// Service Cards Animation
class ServiceCards {
  constructor() {
    this.init();
  }
  
  init() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
      // Staggered entrance animation
      card.style.animationDelay = `${index * 0.2}s`;
      
      // Add hover sound effect (optional)
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02) rotateY(5deg)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
      });
    });
  }
}

// Emergency Cards Interactive
class EmergencyCards {
  constructor() {
    this.init();
  }
  
  init() {
    const emergencyCards = document.querySelectorAll('.emergency-card');
    
    emergencyCards.forEach(card => {
      const emergencyBtn = card.querySelector('.btn');
      
      if (emergencyBtn) {
        emergencyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          
          if (card.classList.contains('urgent')) {
            // Simulate emergency call
            this.showEmergencyModal();
          } else {
            // Show booking modal or redirect
            alert('Redirecting to booking system...');
          }
        });
      }
    });
  }
  
  showEmergencyModal() {
    // Create emergency modal
    const modal = document.createElement('div');
    modal.className = 'emergency-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="emergency-header">
          <span class="emergency-icon">���</span>
          <h2>Emergency Veterinary Services</h2>
        </div>
        <div class="emergency-contacts">
          <div class="contact-item">
            <strong>24/7 Emergency Hotline:</strong>
            <a href="tel:+1-800-PET-HELP">📞 1-800-PET-HELP</a>
          </div>
          <div class="contact-item">
            <strong>Nearest Emergency Clinic:</strong>
            <span>📍 Pet Emergency Center - 123 Main St</span>
          </div>
          <div class="contact-item">
            <strong>Poison Control:</strong>
            <a href="tel:+1-888-426-4435">☠️ 1-888-426-4435</a>
          </div>
        </div>
        <button class="btn close-modal">Close</button>
      </div>
    `;
    
    // Style the modal
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
}

// Community Cards Interactive
class CommunityCards {
  constructor() {
    this.init();
  }
  
  init() {
    const communityCards = document.querySelectorAll('.community-card');
    
    communityCards.forEach((card, index) => {
      // Add entrance animation delay
      card.style.animationDelay = `${index * 0.3}s`;
      
      // Add interactive hover effects
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) rotateY(5deg) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
      });
      
      // Add click handlers for buttons
      const btn = card.querySelector('.btn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Add click animation
          btn.style.transform = 'scale(0.95)';
          setTimeout(() => {
            btn.style.transform = 'scale(1)';
          }, 150);
          
          // Simulate different actions based on card type
          const cardTitle = card.querySelector('h3').textContent;
          this.handleCommunityAction(cardTitle);
        });
      }
    });
  }
  
  handleCommunityAction(cardTitle) {
    switch (cardTitle) {
      case 'Photo Contests':
        alert('📸 Opening photo contest submission form...');
        break;
      case 'Pet Forums':
        alert('💬 Redirecting to community forums...');
        break;
      case 'Local Events':
        alert('📅 Loading local pet events...');
        break;
      default:
        alert('🎉 Feature coming soon!');
    }
  }
}

// Initialize all new section functionality
document.addEventListener('DOMContentLoaded', () => {
  // Wait for other scripts to load
  setTimeout(() => {
    new NutritionTabs();
    new TipsCarousel();
    new EnhancedRing();
    new ServiceCards();
    new EmergencyCards();
    new CommunityCards();
  }, 100);
});

// Export classes for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NutritionTabs,
    TipsCarousel,
    EnhancedRing,
    ServiceCards,
    EmergencyCards,
    CommunityCards
  };
}