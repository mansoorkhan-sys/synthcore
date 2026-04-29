/* script.js */
document.addEventListener('DOMContentLoaded', () => {

  // --- PRELOADER ---
  const preloader = document.getElementById('preloader');
  const fill = document.querySelector('.preloader-fill');
  let width = 0;
  
  const interval = setInterval(() => {
    width += Math.random() * 15;
    if (width > 100) width = 100;
    fill.style.width = width + '%';
    
    if (width === 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
          initScrollAnimations();
        }, 500);
      }, 300);
    }
  }, 100);

  // --- NAVBAR SCROLL ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // --- MOBILE MENU ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
      spans[0].style.transform = 'translateY(9px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) hamburger.click();
    });
  });

  // --- SCROLL ANIMATIONS (Intersection Observer) ---
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function initScrollAnimations() {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // --- ACTIVE NAV LINK UPDATER ---
  const sections = document.querySelectorAll('section');
  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  }

  // --- PRODUCTS DATA ---
  const products = [
    { id: 1, name: 'GeForce RTX 5090', category: 'gpu', price: 1599.99, img: 'assets/images/product_gpu.png', badge: 'New' },
    { id: 2, name: 'GeForce RTX 4080 Super', category: 'gpu', price: 999.99, img: 'assets/images/product_gpu.png' },
    { id: 3, name: 'Ryzen 9 7950X3D', category: 'cpu', price: 699.99, img: 'assets/images/product_cpu.png', badge: 'Best Seller' },
    { id: 4, name: 'Core i9-14900K', category: 'cpu', price: 589.99, img: 'assets/images/product_cpu.png' },
    { id: 5, name: 'SynthCore V1 Pro Mechanical', category: 'keyboard', price: 189.99, img: 'assets/images/product_keyboard.png' },
    { id: 6, name: 'SynthCore V2 TKL', category: 'keyboard', price: 149.99, img: 'assets/images/product_keyboard.png' },
    { id: 7, name: 'AeroLight Wireless Mouse', category: 'mouse', price: 129.99, img: 'assets/images/product_mouse.png', badge: 'Popular' },
    { id: 8, name: 'Precision X Wired', category: 'mouse', price: 79.99, img: 'assets/images/product_mouse.png' },
    { id: 9, name: 'Pulse Audio Surround Pro', category: 'headset', price: 199.99, img: 'assets/images/product_headset.png' }
  ];

  // --- RENDER PRODUCTS ---
  const productsGrid = document.getElementById('products-grid');
  
  function renderProducts(filter = 'all') {
    productsGrid.innerHTML = '';
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    filtered.forEach((p, index) => {
      const delay = index * 0.1;
      const card = document.createElement('div');
      card.className = 'product-card reveal';
      card.style.animationDelay = `${delay}s`;
      card.innerHTML = `
        <div class="product-img-wrapper">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <img src="${p.img}" alt="${p.name}" class="product-img"/>
        </div>
        <div class="product-info">
          <span class="product-cat">${p.category}</span>
          <h3 class="product-title">${p.name}</h3>
          <div class="product-footer">
            <span class="product-price">$${p.price.toFixed(2)}</span>
            <button class="add-to-cart-btn" data-id="${p.id}" aria-label="Add to cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
      
      // Observe new cards
      setTimeout(() => observer.observe(card), 100);
    });

    // Add cart event listeners
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'));
        addToCart(id);
      });
    });
  }

  // Initial render
  renderProducts();

  // --- CATEGORY FILTERS ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.getAttribute('data-filter'));
    });
  });

  // Handle category cards click
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      const filter = card.getAttribute('data-filter');
      document.querySelector('#shop').scrollIntoView({ behavior: 'smooth' });
      const targetBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
      if(targetBtn) targetBtn.click();
    });
  });

  // --- CART FUNCTIONALITY ---
  let cart = [];
  const cartBtn = document.getElementById('cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartClose = document.getElementById('cart-close');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.getElementById('cart-count');

  function openCart() {
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('active');
  }

  function closeCart() {
    cartOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
  }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    
    updateCart();
    showToast(`${product.name} added to cart`);
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
  }

  function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) removeFromCart(id);
      else updateCart();
    }
  }

  function updateCart() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountEl.textContent = totalItems;
    
    // Animate badge
    cartCountEl.style.transform = 'scale(1.5)';
    setTimeout(() => cartCountEl.style.transform = 'scale(1)', 200);

    // Update UI
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      cartTotalEl.textContent = '$0.00';
      return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
      total += item.price * item.qty;
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item-img"/>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          <div class="cart-item-actions">
            <div class="qty-ctrl">
              <button class="qty-btn minus" data-id="${item.id}">-</button>
              <span>${item.qty}</span>
              <button class="qty-btn plus" data-id="${item.id}">+</button>
            </div>
            <button class="remove-btn" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(el);
    });

    cartTotalEl.textContent = `$${total.toFixed(2)}`;

    // Add event listeners to new buttons
    document.querySelectorAll('.qty-btn.minus').forEach(btn => 
      btn.addEventListener('click', (e) => changeQty(parseInt(e.target.dataset.id), -1))
    );
    document.querySelectorAll('.qty-btn.plus').forEach(btn => 
      btn.addEventListener('click', (e) => changeQty(parseInt(e.target.dataset.id), 1))
    );
    document.querySelectorAll('.remove-btn').forEach(btn => 
      btn.addEventListener('click', (e) => removeFromCart(parseInt(e.target.dataset.id)))
    );
  }

  // --- TOAST NOTIFICATION ---
  const toast = document.getElementById('toast');
  let toastTimeout;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // --- CONTACT FORM ---
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    setTimeout(() => {
      formSuccess.style.display = 'block';
      contactForm.reset();
      btn.textContent = originalText;
      btn.disabled = false;
      setTimeout(() => formSuccess.style.display = 'none', 5000);
    }, 1500);
  });

  // --- CHATBOT ---
  const chatFab = document.getElementById('chatbot-fab');
  const chatWindow = document.getElementById('chatbot-window');
  const chatClose = document.getElementById('chatbot-close');
  const chatInput = document.getElementById('chatbot-input');
  const chatSend = document.getElementById('chatbot-send');
  const chatMessages = document.getElementById('chatbot-messages');

  chatFab.addEventListener('click', () => {
    chatWindow.classList.add('active');
    chatFab.style.transform = 'scale(0)';
  });

  chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    chatFab.style.transform = 'scale(1)';
  });

  function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function botReply(userMsg) {
    const lower = userMsg.toLowerCase();
    let reply = "I'm still learning! Contact our support team for complex queries.";
    
    if (lower.includes('gpu') || lower.includes('graphics')) {
      reply = "Our top pick right now is the RTX 4080 Super. It offers incredible 4K performance. Want me to add it to your cart?";
    } else if (lower.includes('budget') || lower.includes('cheap')) {
      reply = "For budget builds, I recommend pairing an Intel Core i5 or Ryzen 5 with an RTX 4060. Check out our 'Categories' section!";
    } else if (lower.includes('trending') || lower.includes('best')) {
      reply = "The Ryzen 9 7950X3D and our SynthCore V1 Pro Mechanical Keyboard are flying off the shelves right now! 🔥";
    } else if (lower.includes('hello') || lower.includes('hi')) {
      reply = "Hello! Ready to level up your setup?";
    }

    setTimeout(() => appendMessage(reply, 'bot'), 600);
  }

  function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;
    
    // Remove suggestions if they exist
    const suggestions = document.querySelector('.chat-suggestions');
    if (suggestions) suggestions.remove();

    appendMessage(text, 'user');
    chatInput.value = '';
    botReply(text);
  }

  chatSend.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-msg');
      chatInput.value = text;
      handleSend();
    });
  });

  // --- PARTICLES BACKGROUND ---
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particlesArray;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update() {
      if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
      if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000;
    for (let i = 0; i < numberOfParticles; i++) {
      let size = (Math.random() * 2) + 0.5;
      let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 0.4) - 0.2;
      let directionY = (Math.random() * 0.4) - 0.2;
      let isBlue = Math.random() > 0.5;
      let color = isBlue ? 'rgba(0, 240, 255, 0.3)' : 'rgba(138, 43, 226, 0.3)';
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
  }

  initParticles();
  animateParticles();

  window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    initParticles();
  });
});
