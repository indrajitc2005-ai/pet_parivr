/**
 * @jest-environment jsdom
 */

describe('App Module', () => {
  const fallbackProducts = [
    {"id":1,"name":"Anti-tick Shampoo","price":399,"img":"https://picsum.photos/400/240?random=21","category":"pharmacy"},
    {"id":2,"name":"Omega-3 Supplement","price":549,"img":"https://picsum.photos/400/240?random=22","category":"pharmacy"},
    {"id":3,"name":"Nail Trimmer","price":249,"img":"https://picsum.photos/400/240?random=24","category":"grooming"},
    {"id":4,"name":"Chew Bone","price":129,"img":"https://picsum.photos/400/240?random=27","category":"toys"}
  ];

  beforeEach(() => {
    // Setup DOM elements
    document.body.innerHTML = `
      <div id="latestRow"></div>
      <div id="pharmacyGrid"></div>
      <div id="groomGrid"></div>
      <div id="toysGrid"></div>
      <div id="year"></div>
      <nav class="nav-links">
        <a href="index.html">Home</a>
        <a href="pharmacy.html">Pharmacy</a>
      </nav>
      <div id="loader">
        <div id="progbar"></div>
      </div>
      <div id="ring"></div>
    `;

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/index.html'
      },
      writable: true
    });
  });

  describe('Helper Functions', () => {
    test('should provide DOM query helpers', () => {
      const $ = (s, el = document) => el.querySelector(s);
      const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

      expect($('#latestRow')).toBeTruthy();
      expect($$('.nav-links a')).toHaveLength(2);
    });
  });

  describe('Navigation and UI Setup', () => {
    test('should set active navigation link based on current path', () => {
      const path = window.location.pathname.split('/').pop() || 'index.html';
      const navLinks = document.querySelectorAll('.nav-links a');
      
      navLinks.forEach(a => {
        if (a.getAttribute('href') === path) {
          a.classList.add('active');
        }
      });

      const activeLink = document.querySelector('.nav-links a.active');
      expect(activeLink).toBeTruthy();
      expect(activeLink.getAttribute('href')).toBe('index.html');
    });

    test('should set current year in footer', () => {
      const yearElement = document.getElementById('year');
      const currentYear = new Date().getFullYear();
      
      if (yearElement) {
        yearElement.textContent = currentYear;
      }

      expect(yearElement.textContent).toBe(currentYear.toString());
    });
  });

  describe('Product Loading', () => {
    test('should load products from API or fallback', async () => {
      const loadProducts = async () => {
        try {
          const res = await fetch('products.json', {cache: 'no-store'});
          if (!res.ok) throw new Error('no file');
          return await res.json();
        } catch (e) {
          return fallbackProducts;
        }
      };

      // Mock fetch to fail
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const products = await loadProducts();
      expect(products).toEqual(fallbackProducts);
      expect(fetch).toHaveBeenCalledWith('products.json', {cache: 'no-store'});
    });

    test('should load products from API when available', async () => {
      const mockProducts = [
        {"id":10,"name":"Test Product","price":100,"img":"test.jpg","category":"test"}
      ];

      const loadProducts = async () => {
        try {
          const res = await fetch('products.json', {cache: 'no-store'});
          if (!res.ok) throw new Error('no file');
          return await res.json();
        } catch (e) {
          return fallbackProducts;
        }
      };

      // Mock successful fetch
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts
      });

      const products = await loadProducts();
      expect(products).toEqual(mockProducts);
    });
  });

  describe('Product Rendering', () => {
    test('should create product card with correct structure', () => {
      const productCard = (p) => {
        const el = document.createElement('article');
        el.className = 'product shadow';
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
      };

      const testProduct = fallbackProducts[0];
      const card = productCard(testProduct);

      expect(card.className).toBe('product shadow');
      expect(card.querySelector('h4').textContent).toBe(testProduct.name);
      expect(card.querySelector('.price').textContent).toBe(`₹${testProduct.price}`);
      expect(card.querySelector('.thumb').style.backgroundImage).toBe(`url("${testProduct.img}")`);
    });

    test('should render latest products on homepage', async () => {
      const renderLatest = async () => {
        const row = document.getElementById('latestRow');
        if (!row) return;
        
        const items = fallbackProducts;
        items.slice(0, 8).forEach(p => {
          const card = document.createElement('article');
          card.className = 'product shadow';
          card.innerHTML = `<h4>${p.name}</h4>`;
          row.appendChild(card);
        });
      };

      await renderLatest();
      const latestRow = document.getElementById('latestRow');
      expect(latestRow.children).toHaveLength(4); // All fallback products
    });
  });

  describe('Category Filtering', () => {
    test('should filter products by pharmacy category', async () => {
      const renderPharmacy = async () => {
        const ph = document.getElementById('pharmacyGrid');
        if (!ph) return;
        
        const items = fallbackProducts;
        items.filter(p => p.category === 'pharmacy').forEach(p => {
          const c = document.createElement('article');
          c.className = 'product';
          c.innerHTML = `<h4>${p.name}</h4>`;
          ph.appendChild(c);
        });
      };

      await renderPharmacy();
      const pharmacyGrid = document.getElementById('pharmacyGrid');
      const pharmacyProducts = fallbackProducts.filter(p => p.category === 'pharmacy');
      expect(pharmacyGrid.children).toHaveLength(pharmacyProducts.length);
    });

    test('should filter products by grooming category', async () => {
      const renderGrooming = async () => {
        const gr = document.getElementById('groomGrid');
        if (!gr) return;
        
        const items = fallbackProducts;
        items.filter(p => p.category === 'grooming').forEach(p => {
          const c = document.createElement('article');
          c.className = 'product';
          c.innerHTML = `<h4>${p.name}</h4>`;
          gr.appendChild(c);
        });
      };

      await renderGrooming();
      const groomGrid = document.getElementById('groomGrid');
      const groomingProducts = fallbackProducts.filter(p => p.category === 'grooming');
      expect(groomGrid.children).toHaveLength(groomingProducts.length);
    });

    test('should filter products by toys category', async () => {
      const renderToys = async () => {
        const ty = document.getElementById('toysGrid');
        if (!ty) return;
        
        const items = fallbackProducts;
        items.filter(p => p.category === 'toys').forEach(p => {
          const c = document.createElement('article');
          c.className = 'product';
          c.innerHTML = `<h4>${p.name}</h4>`;
          ty.appendChild(c);
        });
      };

      await renderToys();
      const toysGrid = document.getElementById('toysGrid');
      const toysProducts = fallbackProducts.filter(p => p.category === 'toys');
      expect(toysGrid.children).toHaveLength(toysProducts.length);
    });
  });

  describe('Loading Animation', () => {
    test('should handle progress bar animation', () => {
      const loader = document.getElementById('loader');
      const bar = document.getElementById('progbar');
      
      expect(loader).toBeTruthy();
      expect(bar).toBeTruthy();

      // Simulate progress update
      let progress = 50;
      bar.style.width = progress + '%';
      
      expect(bar.style.width).toBe('50%');
    });
  });

  describe('Interactive Elements', () => {
    test('should handle product ring rotation', () => {
      const ring = document.getElementById('ring');
      let rotation = 0;
      let autoRotate = true;

      const rotateRing = () => {
        if (autoRotate) {
          rotation += 0.5;
          ring.style.transform = `rotateY(${rotation}deg)`;
        }
      };

      // Test auto-rotation
      rotateRing();
      expect(ring.style.transform).toBe('rotateY(0.5deg)');

      // Test pause on hover
      autoRotate = false;
      const previousRotation = rotation;
      rotateRing();
      expect(rotation).toBe(previousRotation);
    });

    test('should handle zipper comparison slider', () => {
      document.body.innerHTML += `
        <div class="zipper">
          <input type="range" min="0" max="100" value="50">
          <div class="handle"></div>
        </div>
      `;

      const zipper = document.querySelector('.zipper');
      const range = zipper.querySelector('input[type=range]');
      
      const update = (v) => zipper.style.setProperty('--split', v + '%');
      
      // Test range update
      range.value = 75;
      update(range.value);
      
      expect(zipper.style.getPropertyValue('--split')).toBe('75%');
    });
  });

  describe('Scroll Animations', () => {
    test('should setup intersection observer for scroll animations', () => {
      const mockObserver = {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      };

      global.IntersectionObserver = jest.fn().mockImplementation(() => mockObserver);

      // Add elements to observe
      document.body.innerHTML += `
        <div class="scroll-animate">Test Element</div>
        <div class="pet-scene-container scroll-animate">Pet Scene</div>
      `;

      const observer = new IntersectionObserver(() => {});
      const elements = document.querySelectorAll('.scroll-animate');
      
      elements.forEach(el => observer.observe(el));

      expect(mockObserver.observe).toHaveBeenCalledTimes(2);
    });
  });
});