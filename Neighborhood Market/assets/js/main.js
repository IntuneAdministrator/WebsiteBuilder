(function () {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth scrolling is handled by CSS. Add active link highlighting per page.
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });

  // Back-to-top button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    const toggleBtn = () => {
      if (window.scrollY > 400) backToTop.removeAttribute('hidden');
      else backToTop.setAttribute('hidden', '');
    };
    window.addEventListener('scroll', toggleBtn, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    toggleBtn();
  }

  // Simple carousel
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('[data-carousel-track]');
    const slides = Array.from(track.children);
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    const dotsWrap = carousel.querySelector('[data-carousel-dots]');
    let index = 0;

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dotsWrap.querySelectorAll('button').forEach((btn, i) => btn.setAttribute('aria-current', String(i === index)));
    };

    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      btn.addEventListener('click', () => { index = i; update(); });
      dotsWrap.appendChild(btn);
    });

    prev.addEventListener('click', () => { index = (index - 1 + slides.length) % slides.length; update(); });
    next.addEventListener('click', () => { index = (index + 1) % slides.length; update(); });

    let timer = setInterval(() => { index = (index + 1) % slides.length; update(); }, 5000);
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => {
      timer = setInterval(() => { index = (index + 1) % slides.length; update(); }, 5000);
    });

    update();
  }

  // Products page: filters and sorting
  const productsGrid = document.querySelector('[data-products-grid]');
  if (productsGrid) {
    const items = Array.from(productsGrid.querySelectorAll('[data-product]'));
    const categorySelect = document.querySelector('[data-filter-category]');
    const sortSelect = document.querySelector('[data-sort]');

    function applyFilterSort() {
      const category = categorySelect ? categorySelect.value : 'all';
      const sort = sortSelect ? sortSelect.value : 'popularity';

      items.forEach((el) => {
        const cat = el.getAttribute('data-category');
        el.style.display = (category === 'all' || cat === category) ? '' : 'none';
      });

      const visible = items.filter((el) => el.style.display !== 'none');
      visible.sort((a, b) => {
        if (sort === 'price-asc') return Number(a.getAttribute('data-price')) - Number(b.getAttribute('data-price'));
        if (sort === 'price-desc') return Number(b.getAttribute('data-price')) - Number(a.getAttribute('data-price'));
        if (sort === 'new') return Number(b.getAttribute('data-new')) - Number(a.getAttribute('data-new'));
        return Number(b.getAttribute('data-popularity')) - Number(a.getAttribute('data-popularity'));
      });

      visible.forEach((el) => productsGrid.appendChild(el));
    }

    categorySelect && categorySelect.addEventListener('change', applyFilterSort);
    sortSelect && sortSelect.addEventListener('change', applyFilterSort);
    applyFilterSort();
  }

  // Add to cart (demo)
  document.querySelectorAll('.add-to-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');
      // Simple toast
      const toast = document.createElement('div');
      toast.textContent = `${name} added to cart ($${price})`;
      toast.style.position = 'fixed';
      toast.style.right = '1rem';
      toast.style.bottom = '1rem';
      toast.style.padding = '.6rem .8rem';
      toast.style.background = 'rgba(46,125,50,.95)';
      toast.style.color = '#fff';
      toast.style.borderRadius = '10px';
      toast.style.boxShadow = '0 10px 24px rgba(0,0,0,.35)';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 1600);
    });
  });
})();


