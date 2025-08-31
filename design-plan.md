# Furry Tails - Modern Veterinary Website Design Plan

## 1. Modern 3D Floating UI with Futuristic Elements

### Design System Overview

The design system will build upon the existing color palette while enhancing it with more blues and greens as requested. The current design already has a futuristic aesthetic with glass morphism effects, which we'll expand upon.

### Updated Color Palette

```css
:root {
  /* Primary blues and greens */
  --primary-blue: #22d3ee;        /* Current accent */
  --primary-blue-dark: #0891b2;
  --primary-green: #34d399;       /* New addition */
  --primary-green-dark: #059669;
  
  /* Existing colors (adjusted) */
  --bg: #0b0f17;
  --card: #0f172a;
  --card2: #0b1220;
  --glass: rgba(255,255,255,.06);
  --border: rgba(255,255,255,.14);
  --text: #e5e7eb;
  --muted: #94a3b8;
  --accent: #22d3ee;              /* Blue accent */
  --accent2: #34d399;             /* Green accent (changed from purple) */
  --shadow: 0 10px 30px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.04);
  
  /* New additions for depth effects */
  --depth-1: rgba(34, 211, 238, 0.1);
  --depth-2: rgba(52, 211, 153, 0.1);
  --glow-blue: 0 0 20px rgba(34, 211, 238, 0.5);
  --glow-green: 0 0 20px rgba(52, 211, 153, 0.5);
}
```

### Modular Design System with Floating Cards

#### Enhanced Card Component

```css
.card {
  grid-column: span 4;
  background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 18px;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateZ(0);
  box-shadow: var(--shadow);
}

.card:hover {
  transform: translateZ(20px) translateY(-8px);
  box-shadow: 
    0 20px 40px rgba(0,0,0,.6),
    0 0 30px rgba(34,211,238,.4),
    inset 0 0 15px rgba(52,211,153,.3);
  border: 1px solid rgba(34,211,238,.6);
}

.card.floating {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateZ(0) translateY(0); }
  50% { transform: translateZ(10px) translateY(-15px); }
}
```

### Depth Effects with CSS Transforms and Shadows

#### Enhanced 3D Effects

```css
/* 3D Container for enhanced depth */
.depth-container {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.depth-element {
  transform: translateZ(0);
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.depth-element:hover {
  transform: translateZ(30px);
}

/* Multi-layered shadows for depth */
.depth-shadow-1 {
  box-shadow: 
    0 5px 15px rgba(0,0,0,0.3),
    0 0 10px rgba(34,211,238,0.2);
}

.depth-shadow-2 {
  box-shadow: 
    0 10px 25px rgba(0,0,0,0.4),
    0 0 20px rgba(34,211,238,0.3),
    inset 0 0 10px rgba(52,211,153,0.1);
}

.depth-shadow-3 {
  box-shadow: 
    0 15px 35px rgba(0,0,0,0.5),
    0 0 30px rgba(34,211,238,0.4),
    inset 0 0 15px rgba(52,211,153,0.2);
}
```

### Responsive Layouts

#### Grid System Enhancement

```css
/* Enhanced responsive grid */
.responsive-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(12, 1fr);
}

/* Card spans for different sizes */
.card.span-1 { grid-column: span 1; }
.card.span-2 { grid-column: span 2; }
.card.span-3 { grid-column: span 3; }
.card.span-4 { grid-column: span 4; }
.card.span-6 { grid-column: span 6; }
.card.span-8 { grid-column: span 8; }
.card.span-12 { grid-column: span 12; }

/* Responsive breakpoints */
@media (max-width: 1200px) {
  .responsive-grid {
    gap: 20px;
  }
  
  .card.span-4 { grid-column: span 6; }
  .card.span-8 { grid-column: span 12; }
}

@media (max-width: 768px) {
  .responsive-grid {
    gap: 16px;
  }
  
  .card.span-1,
  .card.span-2,
  .card.span-3,
  .card.span-4,
  .card.span-6,
  .card.span-8,
  .card.span-12 {
    grid-column: span 12;
  }
}

@media (max-width: 480px) {
  .responsive-grid {
    gap: 12px;
  }
}
```

## 2. Animated Pet Scene with Scrolling Animations

### Playful Scene Design

#### Scene Container

```css
.pet-scene-container {
  position: relative;
  height: 500px;
  width: 100%;
  overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(135deg, 
    rgba(34,211,238,0.1) 0%, 
    rgba(52,211,153,0.1) 100%);
  border: 1px solid var(--border);
  margin: 30px 0;
  box-shadow: var(--shadow);
}

.pet-scene {
  position: relative;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 10% 20%, rgba(34,211,238,0.1) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(52,211,153,0.1) 0%, transparent 20%);
}

/* Pet characters */
.pet-character {
  position: absolute;
  width: 80px;
  height: 80px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: all 0.5s ease;
}

.cat-character {
  background-image: url('../assets/cat-sprite.png');
  bottom: 20%;
  left: 10%;
  animation: catIdle 3s infinite alternate;
}

.dog-character {
  background-image: url('../assets/dog-sprite.png');
  bottom: 20%;
  right: 10%;
  animation: dogIdle 4s infinite alternate;
}

/* Toys */
.toy {
  position: absolute;
  width: 40px;
  height: 40px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0;
  transition: all 0.5s ease;
}

.ball-toy {
  background-image: url('../assets/ball.png');
  top: 40%;
  left: 30%;
}

.bone-toy {
  background-image: url('../assets/bone.png');
  top: 50%;
  right: 30%;
}
```

### Scroll-Triggered Animations

#### Animation Implementation

```css
/* Scroll-triggered animations */
.scroll-animate {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.scroll-animate.animate {
  opacity: 1;
  transform: translateY(0);
}

/* Parallax effects */
.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transform: translateZ(-1px) scale(1.1);
}

/* Sprite animations */
.cat-sprite {
  width: 80px;
  height: 80px;
  background-image: url('../assets/cat-sprite-sheet.png');
  animation: catSpriteWalk 1s steps(4) infinite;
}

.dog-sprite {
  width: 80px;
  height: 80px;
  background-image: url('../assets/dog-sprite-sheet.png');
  animation: dogSpriteRun 0.8s steps(6) infinite;
}

@keyframes catSpriteWalk {
  from { background-position: 0 0; }
  to { background-position: -320px 0; }
}

@keyframes dogSpriteRun {
  from { background-position: 0 0; }
  to { background-position: -480px 0; }
}

/* Interaction animations */
.cat-character.interact {
  animation: catPlay 1s ease;
}

.dog-character.interact {
  animation: dogPlay 1s ease;
}

@keyframes catPlay {
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px) rotate(10deg); }
  100% { transform: translateY(0); }
}

@keyframes dogPlay {
  0% { transform: translateY(0); }
  50% { transform: translateY(-15px) rotate(-10deg); }
  100% { transform: translateY(0); }
}
```

### JavaScript for Scroll Animations

```javascript
// Scroll-triggered animations
document.addEventListener('DOMContentLoaded', function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, {
    threshold: 0.1
  });
  
  document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
  });
  
  // Parallax effect
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.parallax-bg');
    if (parallax) {
      parallax.style.transform = `translateZ(-1px) scale(1.1) translateY(${scrolled * 0.5}px)`;
    }
  });
});
```

## 3. Interactive Sections with Hover Effects

### Revolving Card Animations

#### 3D Product Carousel

```css
/* Revolving product view enhancement */
.ring-wrap {
  perspective: 1200px;
  width: 100%;
  height: 450px;
  position: relative;
  margin: 30px 0;
}

.ring {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: rotateRing 25s infinite linear paused;
}

.ring:hover {
  animation-play-state: running;
}

.ring.auto-rotate {
  animation-play-state: running;
}

.panel {
  position: absolute;
  width: 240px;
  height: 320px;
  background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 15px;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
}

.panel:hover {
  transform: translateZ(30px) !important;
  box-shadow: 
    0 20px 40px rgba(0,0,0,.6),
    0 0 30px rgba(34,211,238,.5),
    inset 0 0 15px rgba(52,211,153,.3);
  border: 1px solid rgba(34,211,238,.7);
}

.thumb {
  width: 200px;
  height: 200px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  margin-bottom: 15px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.thumb:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(34,211,238,.4);
}

.meta {
  color: var(--text);
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.price {
  color: var(--accent);
  font-weight: 700;
  font-size: 1.2rem;
}
```

### Zipper-Style Image Reveals

#### Enhanced Zipper Component

```css
/* Enhanced zipper compare */
.zipper {
  position: relative;
  height: 400px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--card);
  box-shadow: var(--shadow);
  margin: 30px 0;
}

.zipper .left, .zipper .right {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.zipper .left {
  background-image: url('https://picsum.photos/1200/800?random=11');
  clip-path: polygon(0 0, var(--split,50%) 0, var(--split,50%) 100%, 0 100%);
  transition: clip-path 0.1s linear;
}

.zipper .right {
  background-image: url('https://picsum.photos/1200/800?random=12');
}

.zipper .handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50px;
  left: calc(var(--split,50%) - 25px);
  background: linear-gradient(180deg, rgba(255,255,255,.1), rgba(255,255,255,.05));
  border-left: 2px solid var(--accent);
  border-right: 2px solid var(--accent);
  display: grid;
  place-items: center;
  cursor: ew-resize;
  transition: all 0.3s ease;
  z-index: 10;
}

.zipper .handle:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(34,211,238,.6);
}

.zipper .pull {
  width: 30px;
  height: 70px;
  border-radius: 10px;
  background: linear-gradient(180deg, var(--accent), var(--accent2));
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #041015;
  font-weight: bold;
}

.zipper input[type=range] {
  position: absolute;
  inset: 0;
  appearance: none;
  background: transparent;
  cursor: ew-resize;
  z-index: 20;
}

.zipper input[type=range]::-webkit-slider-thumb {
  appearance: none;
  width: 60px;
  height: 60px;
  background: transparent;
  cursor: ew-resize;
}

.zipper .label {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0,0,0,.6);
  padding: 10px 15px;
  border-radius: 12px;
  border: 1px solid var(--border);
  color: var(--text);
  font-weight: 600;
  backdrop-filter: blur(5px);
  animation: labelPulse 2s infinite;
}

@keyframes labelPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### Animated Hover Effects

#### Micro-interactions

```css
/* Enhanced button animations */
.btn {
  padding: 14px 20px;
  border-radius: 14px;
  border: 1px solid var(--border);
  cursor: pointer;
  font-weight: 700;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #051019;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: all 0.8s ease;
}

.btn:hover {
  box-shadow: 
    0 0 25px rgba(34,211,238,.8),
    inset 0 0 15px rgba(255,255,255,.4);
  transform: translateY(-5px);
}

.btn:hover::before {
  left: 100%;
}

.btn:active {
  transform: translateY(0) scale(0.98);
}

/* Ghost button enhancement */
.btn.ghost {
  background: var(--glass);
  color: var(--text);
  box-shadow: 0 0 10px rgba(255,255,255,.1);
}

.btn.ghost:hover {
  background: linear-gradient(135deg, rgba(34,211,238,.2), rgba(52,211,153,.2));
  box-shadow: 
    0 0 25px rgba(34,211,238,.6),
    inset 0 0 10px rgba(34,211,238,.3);
}

/* Tag enhancements */
.tag {
  display: inline-block;
  padding: 8px 14px;
  font-size: 0.9rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(34,211,238,.2), rgba(52,211,153,.2));
  border: 1px solid rgba(34,211,238,.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(5px);
}

.tag:hover {
  background: linear-gradient(135deg, rgba(34,211,238,.3), rgba(52,211,153,.3));
  box-shadow: 
    0 0 20px rgba(34,211,238,.6),
    inset 0 0 15px rgba(34,211,238,.4);
  transform: translateY(-3px) scale(1.05);
}

/* Card hover enhancements */
.card {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover {
  transform: translateZ(20px) translateY(-10px);
  box-shadow: 
    0 25px 50px rgba(0,0,0,.7),
    0 0 35px rgba(34,211,238,.5),
    inset 0 0 20px rgba(52,211,153,.4);
  border: 1px solid rgba(34,211,238,.7);
}

.card .art {
  height: 180px;
  border-radius: 16px;
  background:
    radial-gradient(250px 150px at 70% 10%, rgba(34,211,238,.4), transparent 40%),
    radial-gradient(250px 150px at 30% 90%, rgba(52,211,153,.4), transparent 40%),
    linear-gradient(135deg, rgba(255,255,255,.1), rgba(255,255,255,.05));
  border: 1px solid var(--border);
  box-shadow: inset 0 0 60px rgba(0,0,0,.4);
  transition: all 0.4s ease;
}

.card .art:hover {
  box-shadow: 
    inset 0 0 40px rgba(34,211,238,.6),
    0 0 25px rgba(34,211,238,.4);
  transform: scale(1.02);
}
```

## 4. New Navbar Design

### Modern Navbar with Enhanced Features

```css
/* Enhanced navbar design */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(15px);
  background: linear-gradient(to bottom, rgba(10,12,20,.9), rgba(10,12,20,.7));
  border-bottom: 1px solid var(--border);
  box-shadow: 0 5px 20px rgba(0,0,0,.3);
  padding: 0 20px;
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  max-width: 1400px;
  margin: 0 auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
  font-size: 1.4rem;
  color: var(--text);
  text-decoration: none;
}

.logo {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  box-shadow: var(--shadow);
  font-size: 1.5rem;
  animation: logoGlow 3s infinite alternate;
}

@keyframes logoGlow {
  0% { box-shadow: var(--shadow); }
  100% { box-shadow: 0 0 25px rgba(34,211,238,.8), var(--shadow); }
}

/* Navigation links */
.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.nav-links a {
  opacity: 0.9;
  padding: 12px 16px;
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-weight: 600;
  position: relative;
  color: var(--text);
  text-decoration: none;
}

.nav-links a:hover,
.nav-links a.active {
  opacity: 1;
  background: linear-gradient(135deg, rgba(34,211,238,.2), rgba(52,211,153,.2));
  border: 1px solid rgba(34,211,238,.6);
  box-shadow: 0 0 20px rgba(34,211,238,.6);
  transform: translateY(-3px);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent2));
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 70%;
}

/* Search bar */
.nav-search {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,.08);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 8px 12px;
  width: 250px;
  transition: all 0.3s ease;
}

.nav-search:focus-within {
  background: rgba(255,255,255,.12);
  border-color: var(--accent);
  box-shadow: 0 0 15px rgba(34,211,238,.4);
  width: 300px;
}

.nav-search input {
  background: transparent;
  border: none;
  color: var(--text);
  padding: 6px;
  width: 100%;
  outline: none;
  font-size: 0.9rem;
}

.nav-search input::placeholder {
  color: var(--muted);
}

.nav-search button {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  transition: all 0.3s ease;
}

.nav-search button:hover {
  color: var(--accent);
  transform: scale(1.1);
}

/* Cart and profile */
.nav-icons {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-icon {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,.06);
  border: 1px solid var(--border);
  color: var(--text);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-icon:hover {
  background: linear-gradient(135deg, rgba(34,211,238,.2), rgba(52,211,153,.2));
  border-color: var(--accent);
  box-shadow: 0 0 15px rgba(34,211,238,.5);
  transform: translateY(-2px);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent);
  color: #051019;
  font-size: 0.7rem;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Dropdown menus */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: linear-gradient(180deg, rgba(15,23,42,.95), rgba(11,18,32,.95));
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 0;
  min-width: 200px;
  box-shadow: var(--shadow);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu a {
  display: block;
  padding: 10px 20px;
  color: var(--text);
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-menu a:hover {
  background: rgba(34,211,238,.15);
  color: var(--accent);
  padding-left: 25px;
}

/* Mobile responsive */
@media (max-width: 992px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
}

.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: rgba(255,255,255,.1);
  transform: rotate(90deg);
}

/* Mobile menu */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(11,15,23,.98), rgba(15,23,42,.98));
  z-index: 2000;
  display: flex;
  flex-direction: column;
  padding: 20px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s ease;
  transform: translateY(-20px);
}

.mobile-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.mobile-menu-close {
  background: transparent;
  border: none;
  color: var(--text);
  font-size: 1.8rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.mobile-menu-close:hover {
  background: rgba(255,255,255,.1);
  transform: rotate(90deg);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mobile-nav-links a {
  padding: 15px;
  border-radius: 12px;
  background: rgba(255,255,255,.06);
  border: 1px solid var(--border);
  color: var(--text);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.mobile-nav-links a:hover {
  background: linear-gradient(135deg, rgba(34,211,238,.2), rgba(52,211,153,.2));
  border-color: var(--accent);
  box-shadow: 0 0 15px rgba(34,211,238,.4);
}
```

## 5. Prescription Template with Blue/Green Scheme

### Professional Prescription Design

```css
/* Prescription template */
.prescription-template {
  max-width: 800px;
  margin: 30px auto;
  background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 30px;
  box-shadow: var(--shadow);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.prescription-header {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(34,211,238,.3);
  margin-bottom: 30px;
}

.prescription-header h1 {
  color: var(--accent);
  margin: 0 0 10px;
  font-size: 2rem;
  letter-spacing: 1px;
}

.prescription-header p {
  color: var(--muted);
  margin: 0;
  font-size: 1.1rem;
}

.prescription-section {
  margin-bottom: 25px;
}

.prescription-section h2 {
  color: var(--accent2);
  font-size: 1.4rem;
  margin: 0 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(52,211,153,.3);
}

.prescription-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.prescription-field {
  margin-bottom: 15px;
}

.prescription-field label {
  display: block;
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.prescription-field input,
.prescription-field textarea,
.prescription-field select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,.06);
  color: var(--text);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.prescription-field input:focus,
.prescription-field textarea:focus,
.prescription-field select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 10px rgba(34,211,238,.5);
  outline: none;
}

.prescription-medications {
  margin: 25px 0;
}

.prescription-medications table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255,255,255,.04);
  border-radius: 12px;
  overflow: hidden;
}

.prescription-medications th,
.prescription-medications td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.prescription-medications th {
  background: rgba(34,211,238,.1);
  color: var(--accent);
  font-weight: 600;
}

.prescription-medications tr:last-child td {
  border-bottom: none;
}

.prescription-medications tr:hover {
  background: rgba(52,211,153,.05);
}

.prescription-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prescription-signature {
  border-top: 1px solid var(--border);
  padding-top: 40px;
  margin-top: 30px;
  text-align: right;
}

.prescription-signature p {
  margin: 0 0 5px;
  color: var(--muted);
  font-size: 0.9rem;
}

.prescription-signature .signature-line {
  width: 200px;
  height: 1px;
  background: var(--border);
  margin-left: auto;
  margin-top: 40px;
}

.prescription-stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-15deg);
  opacity: 0.1;
  font-size: 5rem;
  font-weight: bold;
  color: var(--accent);
  pointer-events: none;
  z-index: -1;
}

/* Print styles */
@media print {
  .prescription-template {
    box-shadow: none;
    border: 1px solid #000;
  }
  
  .prescription-field input,
  .prescription-field textarea,
  .prescription-field select {
    border: 1px solid #000;
  }
  
  .prescription-medications th {
    background: #e6f7ff;
    color: #000;
  }
}
```

### Prescription Template HTML Structure

```html
<div class="prescription-template">
  <div class="prescription-header">
    <h1>RX</h1>
    <p>Furry Tails Veterinary Clinic</p>
    <p>123 Pet Care Avenue, Animal City</p>
    <p>Phone: (555) 123-4567 | Email: info@furrytails.com</p>
  </div>
  
  <div class="prescription-grid">
    <div class="prescription-section">
      <h2>Pet Information</h2>
      <div class="prescription-field">
        <label for="petName">Pet Name</label>
        <input type="text" id="petName" placeholder="Enter pet name">
      </div>
      <div class="prescription-field">
        <label for="petBreed">Breed</label>
        <input type="text" id="petBreed" placeholder="Enter breed">
      </div>
      <div class="prescription-field">
        <label for="petAge">Age</label>
        <input type="text" id="petAge" placeholder="Enter age">
      </div>
    </div>
    
    <div class="prescription-section">
      <h2>Owner Information</h2>
      <div class="prescription-field">
        <label for="ownerName">Owner Name</label>
        <input type="text" id="ownerName" placeholder="Enter owner name">
      </div>
      <div class="prescription-field">
        <label for="ownerPhone">Phone</label>
        <input type="text" id="ownerPhone" placeholder="Enter phone number">
      </div>
      <div class="prescription-field">
        <label for="ownerEmail">Email</label>
        <input type="email" id="ownerEmail" placeholder="Enter email">
      </div>
    </div>
  </div>
  
  <div class="prescription-section">
    <h2>Prescription Details</h2>
    <div class="prescription-field">
      <label for="prescriptionDate">Date</label>
      <input type="date" id="prescriptionDate">
    </div>
    <div class="prescription-field">
      <label for="prescriptionNotes">Notes</label>
      <textarea id="prescriptionNotes" rows="3" placeholder="Enter prescription notes"></textarea>
    </div>
  </div>
  
  <div class="prescription-medications">
    <h2>Medications</h2>
    <table>
      <thead>
        <tr>
          <th>Medication</th>
          <th>Dosage</th>
          <th>Frequency</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><input type="text" placeholder="Medication name"></td>
          <td><input type="text" placeholder="Dosage"></td>
          <td><input type="text" placeholder="Frequency"></td>
          <td><input type="text" placeholder="Duration"></td>
        </tr>
        <tr>
          <td><input type="text" placeholder="Medication name"></td>
          <td><input type="text" placeholder="Dosage"></td>
          <td><input type="text" placeholder="Frequency"></td>
          <td><input type="text" placeholder="Duration"></td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <div class="prescription-footer">
    <div class="prescription-field">
      <label for="vetName">Prescribing Veterinarian</label>
      <input type="text" id="vetName" placeholder="Enter veterinarian name">
    </div>
    <div class="prescription-field">
      <label for="vetLicense">License Number</label>
      <input type="text" id="vetLicense" placeholder="Enter license number">
    </div>
  </div>
  
  <div class="prescription-signature">
    <p>Signature:</p>
    <div class="signature-line"></div>
    <p>Date: ________________</p>
  </div>
  
  <div class="prescription-stamp">RX</div>
</div>
```

## 6. CSS Variables and Design System

### Complete Design System

```css
/* Complete design system with CSS variables */
:root {
  /* Primary blues and greens */
  --primary-blue: #22d3ee;
  --primary-blue-dark: #0891b2;
  --primary-blue-light: #67e8f9;
  --primary-green: #34d399;
  --primary-green-dark: #059669;
  --primary-green-light: #6ee7b7;
  
  /* Backgrounds */
  --bg: #0b0f17;
  --bg-secondary: #0f172a;
  --bg-tertiary: #0b1220;
  
  /* Glass effects */
  --glass: rgba(255,255,255,.06);
  --glass-hover: rgba(255,255,255,.1);
  --glass-active: rgba(255,255,255,.15);
  
  /* Borders */
  --border: rgba(255,255,255,.14);
  --border-hover: rgba(34,211,238,.5);
  --border-focus: rgba(52,211,153,.7);
  
  /* Text colors */
  --text: #e5e7eb;
  --text-muted: #94a3b8;
  --text-heading: #f8fafc;
  
  /* Accents */
  --accent: #22d3ee;              /* Primary blue */
  --accent2: #34d399;             /* Primary green */
  --accent-gradient: linear-gradient(135deg, var(--accent), var(--accent2));
  
  /* Shadows */
  --shadow: 0 10px 30px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.04);
  --shadow-hover: 0 15px 35px rgba(0,0,0,.5), 0 0 20px rgba(34,211,238,.3);
  --shadow-focus: 0 0 20px rgba(34,211,238,.7), inset 0 0 10px rgba(255,255,255,.3);
  
  /* Depth effects */
  --depth-1: rgba(34, 211, 238, 0.1);
  --depth-2: rgba(52, 211, 153, 0.1);
  --glow-blue: 0 0 20px rgba(34, 211, 238, 0.5);
  --glow-green: 0 0 20px rgba(52, 211, 153, 0.5);
  
  /* Transitions */
  --transition-fast: all 0.2s ease;
  --transition-normal: all 0.3s ease;
  --transition-slow: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-xxl: 24px;
  --radius-full: 9999px;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-xxl: 32px;
  
  /* Typography */
  --font-primary: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-heading: 'Orbitron', 'Segoe UI', system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Z-index */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

## 7. Animation Timings and Interaction Patterns

### Animation Specifications

```css
/* Animation timing functions */
:root {
  /* Standard easings */
  --ease-in-quad: cubic-bezier(0.55, 0.085, 0.68, 0.53);
  --ease-in-cubic: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  --ease-in-quart: cubic-bezier(0.895, 0.03, 0.685, 0.22);
  --ease-in-quint: cubic-bezier(0.755, 0.05, 0.855, 0.06);
  --ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035);
  --ease-in-circ: cubic-bezier(0.6, 0.04, 0.98, 0.335);
  
  --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-out-circ: cubic-bezier(0.075, 0.82, 0.165, 1);
  
  --ease-in-out-quad: cubic-bezier(0.455, 0.03, 0.515, 0.955);
  --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-in-out-quart: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-in-out-quint: cubic-bezier(0.86, 0, 0.07, 1);
  --ease-in-out-expo: cubic-bezier(1, 0, 0, 1);
  --ease-in-out-circ: cubic-bezier(0.785, 0.135, 0.15, 0.86);
  
  /* Custom easings for specific effects */
  --bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --overshoot: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Animation durations */
:root {
  --duration-fast: 0.2s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  --duration-slower: 0.8s;
  --duration-slowest: 1.2s;
}

/* Animation delays */
:root {
  --delay-fast: 0.1s;
  --delay-normal: 0.2s;
  --delay-slow: 0.3s;
  --delay-slower: 0.5s;
}

/* Specific animation classes */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Keyframes */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
  50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes ping {
  75%, 100% { transform: scale(1.5); opacity: 0; }
}

/* Interaction patterns */
.interactive-element {
  transition: var(--transition-slow);
  cursor: pointer;
  position: relative;
}

.interactive-element:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
}

.interactive-element:active {
  transform: translateY(0) scale(0.98);
  transition: var(--transition-fast);
}

/* Focus states for accessibility */
.interactive-element:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Loading states */
.loading-state {
  position: relative;
  pointer-events: none;
  opacity: 0.7;
}

.loading-state::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid transparent;
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

## Implementation Roadmap

### Phase 1: Core Design System
1. Update CSS variables with blue/green palette
2. Enhance modular card components with 3D effects
3. Implement responsive grid system
4. Create depth effects with CSS transforms and shadows

### Phase 2: Interactive Components
1. Develop animated pet scene with scroll-triggered animations
2. Implement revolving card animations for product displays
3. Create zipper-style image reveals
4. Add micro-interactions for all interactive elements

### Phase 3: Navigation & UI
1. Design new navbar with modern features
2. Implement mobile-responsive navigation
3. Create dropdown menus for product categories
4. Add animated state transitions

### Phase 4: Specialized Templates
1. Design prescription template with blue/green scheme
2. Ensure responsive layout for printing and digital viewing
3. Maintain RX format and required pet information fields

### Phase 5: Polish & Optimization
1. Fine-tune animation timings
2. Optimize performance for all interactive elements
3. Ensure cross-browser compatibility
4. Test responsive behavior on all device sizes

This comprehensive design plan provides detailed specifications for each component while maintaining consistency with the existing futuristic aesthetic of the Furry Tails website.