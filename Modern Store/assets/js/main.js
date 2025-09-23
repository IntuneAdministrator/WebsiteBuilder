// Data (mock)
const PRODUCTS = [
  { id: 'p1', name: 'Wireless Headphones', category: 'electronics', brand: 'acme', price: 129, rating: 4.6, description: 'Noise cancelling with 30h battery.', image: 'assets/img/products/headphones.svg' },
  { id: 'p2', name: 'Smartwatch', category: 'electronics', brand: 'nimbus', price: 199, rating: 4.3, description: 'Fitness tracking and notifications.', image: 'assets/img/products/smartwatch.svg' },
  { id: 'p7', name: 'Portable Speaker', category: 'electronics', brand: 'acme', price: 79, rating: 4.4, description: 'Compact Bluetooth speaker with deep bass.', image: 'assets/img/products/speaker.svg' },
  { id: 'p6', name: 'Desk Lamp', category: 'home', brand: 'aurora', price: 45, rating: 4.7, description: 'Adjustable LED lighting desk lamp.', image: 'assets/img/products/lamp.svg' },
  { id: 'p8', name: 'Yoga Mat', category: 'home', brand: 'aurora', price: 35, rating: 4.5, description: 'Non-slip, daily practice.', image: 'assets/img/products/yogamat.svg' },
  { id: 'p5', name: 'Sunglasses', category: 'accessories', brand: 'acme', price: 59, rating: 4.1, description: 'Polarized UV protection.', image: 'assets/img/products/sunglasses.svg' },
  { id: 'p3', name: 'Ceramic Mug Set', category: 'home', brand: 'aurora', price: 29, rating: 4.8, description: 'Set of 4 with matte finish.', image: 'assets/img/products/mugs.svg' },
  { id: 'p4', name: 'Minimal Backpack', category: 'fashion', brand: 'nimbus', price: 89, rating: 4.5, description: 'Water-resistant daily carry.', image: 'assets/img/products/backpack.svg' }
];

const featuredIds = ['p1','p3','p4'];

const state = {
  cart: [],
  filters: { category: 'all', brand: 'all', maxPrice: 1000, minRating: 0, sort: 'popularity' }
};

function saveCart() {
  try { localStorage.setItem('cart', JSON.stringify(state.cart)); } catch {}
}
function loadCart() {
  try {
    const raw = localStorage.getItem('cart');
    if (raw) state.cart = JSON.parse(raw);
  } catch {}
}

function renderProducts(gridEl, products) {
  gridEl.innerHTML = products.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-card__media"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='assets/img/placeholder.svg';"></div>
      <div class="product-card__body">
        <h3 class="product-card__title">${p.name}</h3>
        <p class="muted">${p.description}</p>
        <div class="price-row">
          <strong>$${p.price}</strong>
          <span class="rating" aria-label="Rating ${p.rating} out of 5">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}</span>
        </div>
        <div class="card-actions" style="display:flex; gap:8px;">
          <button class="btn btn--accent" data-add="${p.id}"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
          <button class="btn btn--ghost" data-quick="${p.id}"><i class="fa-regular fa-eye"></i> Quick View</button>
        </div>
      </div>
    </article>`).join('');
}

function filterAndSort(products) {
  const { category, brand, maxPrice, minRating, sort } = state.filters;
  let res = products.filter(p => (category==='all'||p.category===category) && (brand==='all'||p.brand===brand) && p.price<=maxPrice && p.rating>=minRating);
  if (sort === 'price-asc') res.sort((a,b)=>a.price-b.price);
  else if (sort === 'price-desc') res.sort((a,b)=>b.price-a.price);
  else if (sort === 'newest') res = res.reverse();
  return res;
}

function setUpFeatured() {
  const grid = document.querySelector('.product-grid[data-grid="featured"]');
  if (!grid) return;
  const products = PRODUCTS.filter(p=>featuredIds.includes(p.id));
  renderProducts(grid, products);
}

function setUpCatalog() {
  const grid = document.querySelector('.product-grid[data-grid="catalog"]');
  if (!grid) return;
  const price = document.getElementById('filter-price');
  const priceValue = document.getElementById('price-value');
  const category = document.getElementById('filter-category');
  const brand = document.getElementById('filter-brand');
  const rating = document.getElementById('filter-rating');
  const sortBy = document.getElementById('sort-by');

  function update() {
    const products = filterAndSort(PRODUCTS);
    renderProducts(grid, products);
  }

  if (price) price.addEventListener('input', e=>{ state.filters.maxPrice = Number(e.target.value); if(priceValue) priceValue.textContent = `$${state.filters.maxPrice}`; update(); });
  if (category) category.addEventListener('change', e=>{ state.filters.category = e.target.value; update(); });
  if (brand) brand.addEventListener('change', e=>{ state.filters.brand = e.target.value; update(); });
  if (rating) rating.addEventListener('change', e=>{ state.filters.minRating = Number(e.target.value); update(); });
  if (sortBy) sortBy.addEventListener('change', e=>{ state.filters.sort = e.target.value; update(); });

  update();
}

function setUpCartAndQuickView() {
  const grids = document.querySelectorAll('.product-grid');
  const cartCount = document.getElementById('cart-count');
  const modal = document.getElementById('quick-view');
  const modalContent = modal ? modal.querySelector('.modal__content') : null;
  const cartModal = document.getElementById('cart-modal');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const openCart = document.getElementById('open-cart');

  loadCart();

  function updateCartCount() { if (cartCount) cartCount.textContent = String(state.cart.length); }
  function renderCart() {
    if (!cartItems || !cartTotal) return;
    cartItems.innerHTML = state.cart.map(p=>`
      <div class="row">
        <img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='assets/img/placeholder.svg';">
        <div>
          <div>${p.name}</div>
          <small>$${p.price}</small>
        </div>
        <button class="remove" data-remove="${p.id}"><i class="fa-regular fa-trash-can"></i></button>
      </div>`).join('');
    const total = state.cart.reduce((sum,p)=>sum+p.price,0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }

  document.addEventListener('click', (e)=>{
    const addBtn = e.target.closest('[data-add]');
    const quickBtn = e.target.closest('[data-quick]');
    const closeBtn = e.target.closest('[data-modal-close]');
    const checkoutClick = e.target.closest('#checkout-btn');
    if (addBtn) {
      const id = addBtn.getAttribute('data-add');
      const product = PRODUCTS.find(p=>p.id===id);
      if (product) { state.cart.push(product); saveCart(); updateCartCount(); }
    }
    if (quickBtn && modal && modalContent) {
      const id = quickBtn.getAttribute('data-quick');
      const p = PRODUCTS.find(x=>x.id===id);
      if (p) {
        modalContent.innerHTML = `
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='assets/img/placeholder.svg';"></div>
            <div>
              <h2>${p.name}</h2>
              <p>${p.description}</p>
              <p><strong>$${p.price}</strong></p>
              <button class="btn btn--accent" data-add="${p.id}"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
            </div>
          </div>`;
        modal.setAttribute('aria-hidden','false');
      }
    }
    if (closeBtn) cartModal && cartModal.setAttribute('aria-hidden','true');
    if (e.target.classList.contains('modal__backdrop')) cartModal && cartModal.setAttribute('aria-hidden','true');

    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      const id = removeBtn.getAttribute('data-remove');
      const idx = state.cart.findIndex(p=>p.id===id);
      if (idx > -1) { state.cart.splice(idx,1); saveCart(); updateCartCount(); renderCart(); }
    }

    if (checkoutClick) {
      saveCart();
      location.href = 'checkout.html';
    }
  });

  if (openCart && cartModal) {
    openCart.addEventListener('click', ()=>{ renderCart(); cartModal.setAttribute('aria-hidden','false'); });
    document.addEventListener('click', (e)=>{
      if (e.target.closest('#cart-modal [data-modal-close]') || e.target.classList.contains('modal__backdrop')) {
        cartModal.setAttribute('aria-hidden','true');
      }
    });
  }
}

function renderCheckout() {
  const summary = document.getElementById('checkout-summary');
  const totalEl = document.getElementById('checkout-total');
  const place = document.getElementById('place-order');
  if (!summary || !totalEl) return;
  loadCart();
  summary.innerHTML = state.cart.map(p=>`
    <div style="display:flex; align-items:center; gap:10px; padding:6px 0; border-bottom:1px solid var(--color-border);">
      <img src="${p.image}" alt="${p.name}" width="48" height="48" style="border-radius:8px; object-fit:cover;">
      <div style="flex:1 1 auto;">${p.name}</div>
      <strong>$${p.price}</strong>
    </div>`).join('') || '<p>Your cart is empty.</p>';
  const total = state.cart.reduce((sum,p)=>sum+p.price,0);
  totalEl.textContent = `$${total.toFixed(2)}`;
  if (place) {
    place.addEventListener('click', ()=>{
      alert('Thank you! Your order has been placed.');
      state.cart = [];
      saveCart();
      location.href = 'index.html';
    });
  }
}

function setUpBackToTop() {
  const btn = document.querySelector('.to-top');
  if (!btn) return;
  window.addEventListener('scroll', ()=>{
    if (window.scrollY > 400) btn.classList.add('show'); else btn.classList.remove('show');
  });
  btn.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function setUpContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.querySelector('.form-status');
  if (!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');
    if (!name || !email || !message) {
      if (status) status.textContent = 'Please fill the required fields.';
      return;
    }
    if (status) status.textContent = 'Thanks! We will get back to you soon.';
    form.reset();
  });
}

function setUpFeaturedOnHomeIfPresent() { setUpFeatured(); }

document.addEventListener('DOMContentLoaded', ()=>{
  setUpFeaturedOnHomeIfPresent();
  setUpCatalog();
  setUpCartAndQuickView();
  setUpBackToTop();
  setUpContactForm();
  renderCheckout();
});


