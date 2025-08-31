document.addEventListener('DOMContentLoaded', function() {
  // Initialize smooth scrolling for pets carousel
  initPetsCarousel();
  
  // Add hover effects for quick access buttons
  initQuickAccessButtons();
  
  // Handle testimonial cards animations
  initTestimonials();
  
  // Initialize CTA banner interactions
  initCTABanners();
});

function initPetsCarousel() {
  const carousel = document.querySelector('.pets-carousel');
  if (!carousel) return;
  
  // Add navigation functionality for the carousel
  const scrollAmount = 300; // px to scroll on arrow click
  
  // Create pseudo-elements for click events
  const leftArrow = document.createElement('div');
  leftArrow.className = 'pets-carousel-left-arrow';
  leftArrow.style.cssText = 'position:absolute; left:10px; top:50%; transform:translateY(-50%); width:40px; height:40px; z-index:20; cursor:pointer;';
  
  const rightArrow = document.createElement('div');
  rightArrow.className = 'pets-carousel-right-arrow';
  rightArrow.style.cssText = 'position:absolute; right:10px; top:50%; transform:translateY(-50%); width:40px; height:40px; z-index:20; cursor:pointer;';
  
  carousel.appendChild(leftArrow);
  carousel.appendChild(rightArrow);
  
  // Scroll left on left arrow click
  leftArrow.addEventListener('click', () => {
    carousel.scrollBy({
      left: -scrollAmount,
      behavior: 'smooth'
    });
  });
  
  // Scroll right on right arrow click
  rightArrow.addEventListener('click', () => {
    carousel.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  });
  
  // Optional: Add auto-scroll functionality (slower and smoother)
  let scrollInterval = setInterval(() => {
    carousel.scrollLeft += 1;
    
    // Reset scroll position when reaching the end
    if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth)) {
      carousel.scrollLeft = 0;
    }
  }, 80);
  
  // Pause auto-scroll on hover
  carousel.addEventListener('mouseenter', () => {
    clearInterval(scrollInterval);
  });
  
  // Resume auto-scroll when mouse leaves
  carousel.addEventListener('mouseleave', () => {
    scrollInterval = setInterval(() => {
      carousel.scrollLeft += 1;
      if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth)) {
        carousel.scrollLeft = 0;
      }
    }, 80);
  });
}

function initQuickAccessButtons() {
  const buttons = document.querySelectorAll('.quick-btn');
  if (!buttons.length) return;
  
  buttons.forEach(button => {
    // Add subtle animation on hover
    button.addEventListener('mouseenter', function() {
      const icon = this.querySelector('.quick-icon');
      if (icon) {
        icon.style.transform = 'scale(1.2)';
        icon.style.transition = 'transform 0.3s ease';
      }
    });
    
    button.addEventListener('mouseleave', function() {
      const icon = this.querySelector('.quick-icon');
      if (icon) {
        icon.style.transform = 'scale(1)';
      }
    });
  });
}

function initTestimonials() {
  const cards = document.querySelectorAll('.testimonial-card');
  if (!cards.length) return;
  
  // Add staggered entrance animation
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.5s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 100);
    }, index * 150);
  });
}

function initCTABanners() {
  const banners = document.querySelectorAll('.cta-banner');
  if (!banners.length) return;
  
  banners.forEach(banner => {
    // Add subtle pulse animation to CTA buttons
    const buttons = banner.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
        this.style.boxShadow = '0 0 30px rgba(120, 219, 255, 0.8)';
        this.style.transition = 'all 0.3s ease';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
      });
    });
  });
}