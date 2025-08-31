// Helpers
const $ = (s, el=document)=> el.querySelector(s);
const $$ = (s, el=document)=> Array.from(el.querySelectorAll(s));

// Set active link + year
(function() {
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a=>{
    if(a.getAttribute('href')===path) a.classList.add('active');
  });
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();

// Mobile menu functionality
(function() {
  const mobileMenuBtn = $('.mobile-menu-btn');
  const mobileMenu = $('.mobile-menu');
  const mobileMenuClose = $('.mobile-menu-close');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('active');
    });
  }
  
  if (mobileMenuClose && mobileMenu) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  }
  
  // Close mobile menu when clicking outside
  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove('active');
      }
    });
  }
})();

// Loader animation (homepage only)
(function(){
  const loader = $('#loader'); if(!loader) return;
  const bar = $('#progbar');
  let p = 0;
  const id = setInterval(()=>{
    p += Math.random()*12+5;
    if(p>100) p=100;
    bar.style.width = p+'%';
    if(p===100){ clearInterval(id); setTimeout(()=> loader.style.display='none', 150); }
  }, 180);
})();

// Zipper compare (where present)
(function(){
  $$('.zipper').forEach(zip=>{
    const range = $('input[type=range]', zip);
    const update = v => zip.style.setProperty('--split', v+'%');
    if(range){ range.addEventListener('input', e=> update(e.target.value)); update(range.value || 50); }
    const handle = $('.handle', zip);
    let dragging=false;
    const pct = x=>{ const r= zip.getBoundingClientRect(); return Math.min(100, Math.max(0, ((x - r.left)/r.width)*100)); };
    handle && handle.addEventListener('pointerdown', e=>{ dragging=true; e.target.setPointerCapture(e.pointerId); });
    window.addEventListener('pointermove', e=>{ if(!dragging) return; const v=pct(e.clientX); if(range){range.value=v} update(v); });
    window.addEventListener('pointerup', ()=> dragging=false);
  });
})();

// Sample products (fallback if no products.json)
const fallbackProducts = [
  {"id":1,"name":"Anti-tick Shampoo","price":399,"img":"https://picsum.photos/400/240?random=21","category":"pharmacy"},
  {"id":2,"name":"Omega-3 Supplement","price":549,"img":"https://picsum.photos/400/240?random=22","category":"pharmacy"},
  {"id":3,"name":"Pain Relief Tabs","price":299,"img":"https://picsum.photos/400/240?random=23","category":"pharmacy"},
  {"id":4,"name":"Nail Trimmer","price":249,"img":"https://picsum.photos/400/240?random=24","category":"grooming"},
  {"id":5,"name":"Fur Brush","price":199,"img":"https://picsum.photos/400/240?random=25","category":"grooming"},
  {"id":6,"name":"Bow Collar","price":149,"img":"https://picsum.photos/400/240?random=26","category":"grooming"},
  {"id":7,"name":"Chew Bone","price":129,"img":"https://picsum.photos/400/240?random=27","category":"toys"},
  {"id":8,"name":"Tennis Ball 3-pack","price":169,"img":"https://picsum.photos/400/240?random=28","category":"toys"},
  {"id":9,"name":"Feather Wand","price":139,"img":"https://picsum.photos/400/240?random=29","category":"toys"}
];

async function loadProducts(){
  try {
    const res = await fetch('products.json', {cache:'no-store'});
    if(!res.ok) throw new Error('no file');
    return await res.json();
  } catch(e) {
    return fallbackProducts;
  }
}

function productCard(p){
  const el = document.createElement('article');
  el.className='product shadow';
  el.innerHTML = `
    <div class="thumb" style="background-image:url('${p.img}')"></div>
    <div class="pbody">
      <h4>${p.name}</h4>
      <div class="price">₹${p.price}</div>
      <div style="display:flex; gap:8px; margin-top:8px">
        <button class="btn" onclick="alert('Added to cart: ${p.name}')">Add</button>
        <button class="btn ghost" onclick="alert('Quick view: ${p.name}')">View</button>
      </div>
    </div>`;
  return el;
}

// Homepage latest
(async function renderLatest(){
  const row = $('#latestRow'); if(!row) return;
  const items = await loadProducts();
  items.slice(0,8).forEach(p=> row.appendChild(productCard(p)));
})();

// Category pages
(async function renderCategory(){
  const ph = $('#pharmacyGrid');
  const gr = $('#groomGrid');
  const ty = $('#toysGrid');
  if(!ph && !gr && !ty) return;
  const items = await loadProducts();
  if(ph) items.filter(p=>p.category==='pharmacy').forEach(p=>{
    const c = document.createElement('article'); c.className='product';
    c.innerHTML = `
      <div class="thumb" style="background-image:url('${p.img}')"></div>
      <div class="pbody">
        <h4>${p.name}</h4>
        <div class="price">₹${p.price}</div>
        <p>Prescription may be required</p>
        <div style="display:flex; gap:8px; margin-top:8px">
          <button class="btn" onclick="alert('Added to cart: ${p.name}')">Add</button>
          <button class="btn ghost" onclick="alert('Quick view: ${p.name}')">View</button>
        </div>
      </div>`;
    ph.appendChild(c);
  });
  if(gr) items.filter(p=>p.category==='grooming').forEach(p=>{
    const c = document.createElement('article'); c.className='product';
    c.innerHTML = `
      <div class="thumb" style="background-image:url('${p.img}')"></div>
      <div class="pbody">
        <h4>${p.name}</h4>
        <div class="price">₹${p.price}</div>
        <p>Accessories</p>
        <div style="display:flex; gap:8px; margin-top:8px">
          <button class="btn" onclick="alert('Added to cart: ${p.name}')">Add</button>
          <button class="btn ghost" onclick="alert('Quick view: ${p.name}')">View</button>
        </div>
      </div>`;
    gr.appendChild(c);
  });
  if(ty) items.filter(p=>p.category==='toys').forEach(p=>{
    const c = document.createElement('article'); c.className='product';
    c.innerHTML = `
      <div class="thumb" style="background-image:url('${p.img}')"></div>
      <div class="pbody">
        <h4>${p.name}</h4>
        <div class="price">₹${p.price}</div>
        <p>Toy</p>
        <div style="display:flex; gap:8px; margin-top:8px">
          <button class="btn" onclick="alert('Added to cart: ${p.name}')">Add</button>
          <button class="btn ghost" onclick="alert('Quick view: ${p.name}')">View</button>
        </div>
      </div>`;
    ty.appendChild(c);
  });
})();

// Revolving product view
document.addEventListener('DOMContentLoaded', function() {
  const ring = document.getElementById('ring');
  if (!ring) return;
  
  let rotation = 0;
  let autoRotate = true;
  let isDragging = false;
  let startX, startY;
  let currentX, currentY;
  
  // Auto-rotation
  function autoRotateRing() {
    if (autoRotate) {
      rotation += 0.5;
      ring.style.transform = `rotateY(${rotation}deg)`;
    }
    requestAnimationFrame(autoRotateRing);
  }
  
  // Start auto-rotation
  autoRotateRing();
  
  // Pause auto-rotation on hover
  ring.addEventListener('mouseenter', () => {
    autoRotate = false;
  });
  
  ring.addEventListener('mouseleave', () => {
    autoRotate = true;
  });
  
  // Manual rotation with mouse drag
  ring.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    currentX = rotation;
    ring.style.transition = 'none';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    rotation = currentX + dx * 0.5;
    ring.style.transform = `rotateY(${rotation}deg)`;
  });
  
  document.addEventListener('mouseup', () => {
    isDragging = false;
    ring.style.transition = 'transform 0.5s ease';
  });
});

// Scroll-triggered animations for pet scene
document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        // Add delay for toy animations
        if (entry.target.classList.contains('pet-scene-container')) {
          setTimeout(() => {
            const toys = document.querySelectorAll('.toy');
            toys.forEach(toy => {
              toy.style.opacity = '1';
              toy.style.animation = 'toyAppear 0.5s ease forwards, toyBounce 2s infinite';
            });
          }, 500);
        }
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Observe elements with scroll-animate class
  document.querySelectorAll('.scroll-animate').forEach(el => {
    observer.observe(el);
  });
  
  // Interactive pet elements
  const cat = document.querySelector('.cat-character');
  const dog = document.querySelector('.dog-character');
  const toys = document.querySelectorAll('.toy');
  
  if (cat) {
    cat.addEventListener('click', function() {
      this.classList.add('interact');
      setTimeout(() => {
        this.classList.remove('interact');
      }, 1000);
    });
  }
  
  if (dog) {
    dog.addEventListener('click', function() {
      this.classList.add('interact');
      setTimeout(() => {
        this.classList.remove('interact');
      }, 1000);
    });
  }
  
  if (toys.length > 0) {
    toys.forEach(toy => {
      toy.addEventListener('click', function() {
        this.style.animation = 'toyBounce 0.5s ease';
        setTimeout(() => {
          this.style.animation = 'toyBounce 2s infinite';
        }, 500);
      });
    });
  }
  
  // Parallax effect for pet scene background
  window.addEventListener('scroll', function() {
    const petScene = document.querySelector('.pet-scene');
    if (petScene) {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      petScene.style.backgroundPosition = `center ${rate}px`;
    }
  });
});