// PrimeNest Realty - Global JS

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.site-nav ul');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Active nav link highlighting for single-page anchors
const links = document.querySelectorAll('.nav-link');
links.forEach(link => {
  if (location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname === '') {
    // Only apply scroll spy on homepage anchors
    if (link.getAttribute('href')?.includes('#')) {
      link.addEventListener('click', () => links.forEach(l => l.classList.remove('active')));
    }
  } else {
    // On subpages, mark the current page
    const href = link.getAttribute('href');
    if (href && location.pathname.endsWith(href)) link.classList.add('active');
  }
});

// Smooth scrolling for [data-scroll]
document.querySelectorAll('[data-scroll]').forEach(el => {
  el.addEventListener('click', e => {
    const href = el.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Reveal on scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Back to top
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 500;
    backToTop.classList.toggle('show', show);
    document.querySelector('.site-header')?.classList.toggle('scrolled', window.scrollY > 4);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Year in footer
document.getElementById('year')?.appendChild(document.createTextNode(String(new Date().getFullYear())));

// Image fallback for broken sources
function setImageFallback(img) {
  const placeholder = './assets/placeholder.svg';
  if (!img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = 'true';
    img.src = placeholder;
    img.srcset = '';
    img.alt = img.alt || 'Image unavailable';
  }
}
Array.from(document.querySelectorAll('img')).forEach(img => {
  img.addEventListener('error', () => setImageFallback(img), { once: true });
});

// Progressive load images that have data-src
function upgradeImage(img) {
  const src = img.getAttribute('data-src');
  if (!src) return;
  const test = new Image();
  test.onload = () => { img.src = src; img.removeAttribute('data-src'); };
  test.onerror = () => setImageFallback(img);
  test.src = src;
}

const dataSrcImages = Array.from(document.querySelectorAll('img[data-src]'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        upgradeImage(e.target);
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '200px' });
  dataSrcImages.forEach(img => io.observe(img));
} else {
  dataSrcImages.forEach(upgradeImage);
}

// Ensure images already in view upgrade immediately on load
window.addEventListener('load', () => {
  Array.from(document.querySelectorAll('img[data-src]')).forEach(img => {
    const rect = img.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      upgradeImage(img);
    }
  });
});

// Services: filter and sort
const servicesGrid = document.getElementById('servicesGrid');
if (servicesGrid) {
  const filterType = document.getElementById('filterType');
  const sortBy = document.getElementById('sortBy');
  const cards = Array.from(servicesGrid.querySelectorAll('.card'));

  function applyFilterSort() {
    const type = /** @type {HTMLSelectElement} */(filterType).value;
    const sort = /** @type {HTMLSelectElement} */(sortBy).value;

    cards.forEach(card => {
      const match = type === 'all' || card.getAttribute('data-type') === type;
      card.style.display = match ? '' : 'none';
    });

    const visible = cards.filter(c => c.style.display !== 'none');
    visible.sort((a, b) => {
      const ta = a.querySelector('h3')?.textContent?.trim().toLowerCase() || '';
      const tb = b.querySelector('h3')?.textContent?.trim().toLowerCase() || '';
      return (sort === 'az' ? ta.localeCompare(tb) : tb.localeCompare(ta));
    }).forEach(card => servicesGrid.appendChild(card));
  }

  filterType?.addEventListener('change', applyFilterSort);
  sortBy?.addEventListener('change', applyFilterSort);
}

// Contact form validation (client-side only)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = /** @type {HTMLInputElement} */(document.getElementById('name'));
    const email = /** @type {HTMLInputElement} */(document.getElementById('email'));
    const message = /** @type {HTMLTextAreaElement} */(document.getElementById('message'));
    let ok = true;

    function setError(input, text) {
      const small = input.parentElement?.querySelector('.error');
      if (small) small.textContent = text;
    }
    [name, email, message].forEach(i => setError(i, ''));

    if (!name.value.trim()) { setError(name, 'Please enter your name'); ok = false; }
    if (!email.validity.valid) { setError(email, 'Please enter a valid email'); ok = false; }
    if (!message.value.trim()) { setError(message, 'Please enter a message'); ok = false; }

    const status = document.querySelector('.form-status');
    if (ok) {
      if (status) status.textContent = 'Thanks! Your message has been received.';
      contactForm.reset();
    } else {
      if (status) status.textContent = '';
    }
  });
}


