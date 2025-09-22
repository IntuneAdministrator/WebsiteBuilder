// Helper: select
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Sticky header shadow on scroll
const header = $('.site-header');
let lastScrollY = 0;
const onScroll = () => {
  const y = window.scrollY || document.documentElement.scrollTop;
  if (y > 8 && !header.classList.contains('header-shadow')) header.classList.add('header-shadow');
  if (y <= 8 && header.classList.contains('header-shadow')) header.classList.remove('header-shadow');
  lastScrollY = y;
};
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle
const navToggle = $('.nav-toggle');
const navMenu = $('#nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  // Close on link click (small screens)
  $$('.nav-link', navMenu).forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

// Active nav highlight by current page
const path = location.pathname.split('/').pop() || 'index.html';
$$('.site-nav .nav-link').forEach(a => {
  const href = a.getAttribute('href');
  if (href === path) a.classList.add('active'); else a.classList.remove('active');
});

// Intersection Observer for reveal animations
const revealEls = $$('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('visible'));
}

// Current year in footer
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Removed back-to-top control

// Image fallback: replace broken images with placeholder
function installImageFallback() {
  const placeholder = (w, h, seed='fallback') => `https://picsum.photos/seed/${seed}/${w||800}/${h||600}`;
  $$('img').forEach(img => {
    img.addEventListener('error', () => {
      const w = img.naturalWidth || 800;
      const h = img.naturalHeight || 600;
      img.src = placeholder(w, h, 'auto-calib');
    }, { once: true });
  });
}
installImageFallback();


