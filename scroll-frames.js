// Scroll-triggered Frame Animation System
class ScrollFrameAnimator {
  constructor() {
    this.currentFrame = 0;
    this.totalFrames = 4;
    this.scrollProgress = 0;
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    this.createBackgroundFrames();
    this.createScrollProgress();
    this.setupIntersectionObserver();
    this.bindScrollEvents();
    this.addFrameElements();
  }
  
  createBackgroundFrames() {
    // Create background frame layers
    for (let i = 1; i <= this.totalFrames; i++) {
      const frame = document.createElement('div');
      frame.className = `bg-frame bg-frame-${i}`;
      frame.id = `bg-frame-${i}`;
      
      // Add morphing shapes to each frame
      if (i <= 3) {
        for (let j = 0; j < 3; j++) {
          const shape = document.createElement('div');
          shape.className = 'morph-shape';
          frame.appendChild(shape);
        }
      }
      
      document.body.appendChild(frame);
    }
    
    // Activate first frame
    document.getElementById('bg-frame-1').classList.add('active');
  }
  
  createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.id = 'scroll-progress';
    document.body.appendChild(progressBar);
  }
  
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Animate frame elements
          if (element.classList.contains('frame-element')) {
            setTimeout(() => {
              element.classList.add('animate-in');
            }, 100);
          }
          
          // Animate content frames
          if (element.classList.contains('content-frame')) {
            element.classList.add('animate-in');
            this.triggerFloatingElements(element);
          }
          
          // Handle section-based frame switching
          if (element.classList.contains('frame-trigger')) {
            const frameNumber = parseInt(element.dataset.frame);
            this.switchBackgroundFrame(frameNumber);
          }
        }
      });
    }, options);
  }
  
  bindScrollEvents() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollProgress();
          this.handleParallaxEffects();
          ticking = false;
        });
        ticking = true;
      }
    });
  }
  
  updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
      progressBar.style.width = scrollPercent + '%';
    }
    
    this.scrollProgress = scrollPercent;
    
    // Auto-switch frames based on scroll progress
    const frameIndex = Math.floor((scrollPercent / 100) * this.totalFrames) + 1;
    if (frameIndex !== this.currentFrame && frameIndex <= this.totalFrames) {
      this.switchBackgroundFrame(frameIndex);
    }
  }
  
  switchBackgroundFrame(frameNumber) {
    if (frameNumber === this.currentFrame || this.isAnimating) return;
    
    this.isAnimating = true;
    
    // Deactivate current frame
    const currentBgFrame = document.getElementById(`bg-frame-${this.currentFrame}`);
    if (currentBgFrame) {
      currentBgFrame.classList.remove('active');
    }
    
    // Activate new frame with transition effect
    setTimeout(() => {
      const newBgFrame = document.getElementById(`bg-frame-${frameNumber}`);
      if (newBgFrame) {
        newBgFrame.classList.add('active');
        this.createFrameTransition();
      }
      
      this.currentFrame = frameNumber;
      
      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    }, 200);
  }
  
  createFrameTransition() {
    const transition = document.createElement('div');
    transition.className = 'frame-transition';
    document.body.appendChild(transition);
    
    // Trigger transition effect
    setTimeout(() => {
      transition.classList.add('active');
    }, 10);
    
    // Remove transition element
    setTimeout(() => {
      transition.classList.remove('active');
      setTimeout(() => {
        document.body.removeChild(transition);
      }, 500);
    }, 300);
  }
  
  handleParallaxEffects() {
    const scrollTop = window.pageYOffset;
    
    // Parallax effect for morphing shapes
    const shapes = document.querySelectorAll('.morph-shape');
    shapes.forEach((shape, index) => {
      const speed = 0.5 + (index * 0.2);
      const yPos = -(scrollTop * speed);
      shape.style.transform = `translateY(${yPos}px)`;
    });
    
    // Parallax effect for background patterns
    const bgFrames = document.querySelectorAll('.bg-frame');
    bgFrames.forEach((frame, index) => {
      const speed = 0.3 + (index * 0.1);
      const yPos = scrollTop * speed;
      frame.style.transform = `translateY(${yPos}px)`;
    });
  }
  
  triggerFloatingElements(container) {
    const floatingElements = container.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.animation = `floatIn 2s ease forwards`;
      }, index * 200);
    });
  }
  
  addFrameElements() {
    // Add frame elements to existing sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      // Add frame trigger
      section.classList.add('frame-trigger');
      section.dataset.frame = Math.min(index + 1, this.totalFrames);
      
      // Add content frame wrapper (but preserve existing functionality)
      if (!section.classList.contains('hero') && !section.classList.contains('pet-scene-container')) {
        section.classList.add('content-frame');
      }
      
      // Add frame elements to children (but preserve existing interactive elements)
      const children = section.children;
      Array.from(children).forEach((child, childIndex) => {
        // Don't add frame-element to interactive components
        if (!child.classList.contains('frame-element') && 
            !child.classList.contains('zipper') && 
            !child.classList.contains('ring-wrap') && 
            !child.classList.contains('products-row') &&
            !child.id.includes('ring') &&
            !child.id.includes('zipper')) {
          child.classList.add('frame-element');
        }
      });
      
      // Add floating elements (but not to sections with existing animations)
      if (!section.classList.contains('pet-scene-container') && 
          !section.querySelector('.ring-wrap') && 
          !section.querySelector('.zipper')) {
        this.addFloatingElementsToSection(section, index);
      }
      
      // Observe section
      this.observer.observe(section);
    });
    
    // Add frame elements to cards (preserve existing hover effects)
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      if (!card.classList.contains('frame-element')) {
        card.classList.add('frame-element');
        this.observer.observe(card);
      }
    });
    
    // Add frame elements to products (preserve existing animations)
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
      if (!product.classList.contains('frame-element')) {
        product.classList.add('frame-element');
        this.observer.observe(product);
      }
    });
  }
  
  addFloatingElementsToSection(section, index) {
    // Pet-themed floating elements
    const petElements = [
      { emoji: '🐾', name: 'paw' },
      { emoji: '🦴', name: 'bone' },
      { emoji: '🎾', name: 'ball' },
      { emoji: '💖', name: 'heart' },
      { emoji: '🏠', name: 'house' },
      { emoji: '🥎', name: 'toy' }
    ];
    
    const elementCount = Math.min(4, index + 2);
    
    for (let i = 0; i < elementCount; i++) {
      const petElement = petElements[i % petElements.length];
      
      // Create emoji floating element
      const floatingEl = document.createElement('div');
      floatingEl.className = `floating-element delay-${i + 1} pet-float-${petElement.name}`;
      floatingEl.innerHTML = petElement.emoji;
      floatingEl.style.cssText = `
        top: ${15 + (i * 20)}%;
        right: ${8 + (i * 12)}%;
        font-size: ${16 + (i * 4)}px;
        position: absolute;
        z-index: 1;
        text-shadow: 0 0 10px rgba(120, 219, 255, 0.6);
        animation: petElementFloat ${8 + i}s ease-in-out infinite;
        animation-delay: ${i * 0.5}s;
      `;
      
      // Create glowing background
      const glowEl = document.createElement('div');
      glowEl.className = `floating-element delay-${i + 1}`;
      glowEl.style.cssText = `
        top: ${20 + (i * 25)}%;
        right: ${10 + (i * 15)}%;
        width: ${25 + (i * 8)}px;
        height: ${25 + (i * 8)}px;
        background: radial-gradient(circle, rgba(120, 219, 255, 0.4), rgba(255, 119, 198, 0.3), transparent);
        border-radius: 50%;
        filter: blur(2px);
        animation: glowPulse ${6 + i}s ease-in-out infinite;
        animation-delay: ${i * 0.3}s;
      `;
      
      section.style.position = 'relative';
      section.appendChild(floatingEl);
      section.appendChild(glowEl);
    }
    
    // Add special pet-themed CSS animations
    this.addPetAnimationStyles();
  }
  
  addPetAnimationStyles() {
    if (document.getElementById('pet-animations-style')) return;
    
    const style = document.createElement('style');
    style.id = 'pet-animations-style';
    style.textContent = `
      @keyframes petElementFloat {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg) scale(1); 
          opacity: 0.8; 
        }
        25% { 
          transform: translateY(-15px) rotate(5deg) scale(1.1); 
          opacity: 1; 
        }
        50% { 
          transform: translateY(-25px) rotate(-3deg) scale(0.9); 
          opacity: 0.9; 
        }
        75% { 
          transform: translateY(-10px) rotate(8deg) scale(1.05); 
          opacity: 1; 
        }
      }
      
      @keyframes glowPulse {
        0%, 100% { 
          transform: scale(1); 
          opacity: 0.3; 
        }
        50% { 
          transform: scale(1.2); 
          opacity: 0.7; 
        }
      }
      
      .pet-float-paw { 
        filter: drop-shadow(0 0 8px rgba(120, 219, 255, 0.8)); 
      }
      .pet-float-bone { 
        filter: drop-shadow(0 0 8px rgba(255, 119, 198, 0.8)); 
      }
      .pet-float-ball { 
        filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.8)); 
      }
      .pet-float-heart { 
        filter: drop-shadow(0 0 10px rgba(255, 119, 198, 1)); 
        animation-duration: 4s !important;
      }
      .pet-float-house { 
        filter: drop-shadow(0 0 8px rgba(120, 219, 255, 0.6)); 
      }
      .pet-float-toy { 
        filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.7)); 
      }
    `;
    document.head.appendChild(style);
  }
  
  // Public methods for manual control
  nextFrame() {
    if (this.currentFrame < this.totalFrames) {
      this.switchBackgroundFrame(this.currentFrame + 1);
    }
  }
  
  prevFrame() {
    if (this.currentFrame > 1) {
      this.switchBackgroundFrame(this.currentFrame - 1);
    }
  }
  
  goToFrame(frameNumber) {
    if (frameNumber >= 1 && frameNumber <= this.totalFrames) {
      this.switchBackgroundFrame(frameNumber);
    }
  }
}

// Enhanced scroll animations for existing elements
class EnhancedScrollAnimations {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupAdvancedObserver();
    this.enhanceExistingAnimations();
  }
  
  setupAdvancedObserver() {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    };
    
    this.advancedObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        const ratio = entry.intersectionRatio;
        
        // Progressive animation based on intersection ratio
        if (ratio > 0) {
          const scale = 0.8 + (ratio * 0.2);
          const opacity = ratio;
          const blur = (1 - ratio) * 5;
          
          element.style.transform = `scale(${scale}) translateY(${(1 - ratio) * 30}px)`;
          element.style.opacity = opacity;
          element.style.filter = `blur(${blur}px)`;
        }
      });
    }, options);
  }
  
  enhanceExistingAnimations() {
    // Enhance hero section
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      this.advancedObserver.observe(hero);
    }
    
    // Enhance pet scene
    const petScene = document.querySelector('.pet-scene-container');
    if (petScene) {
      petScene.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      this.advancedObserver.observe(petScene);
    }
    
    // Enhance cards with staggered animation
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      card.style.transitionDelay = `${index * 0.1}s`;
      this.advancedObserver.observe(card);
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for preloader to finish
  setTimeout(() => {
    const frameAnimator = new ScrollFrameAnimator();
    const enhancedAnimations = new EnhancedScrollAnimations();
    
    // Make frame animator globally accessible
    window.frameAnimator = frameAnimator;
    
    // Add keyboard controls for frame switching (optional)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        frameAnimator.nextFrame();
      } else if (e.key === 'ArrowLeft') {
        frameAnimator.prevFrame();
      }
    });
    
  }, 2500); // Wait for preloader to complete
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ScrollFrameAnimator, EnhancedScrollAnimations };
}