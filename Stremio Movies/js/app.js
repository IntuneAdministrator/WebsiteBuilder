document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const backToTop = document.getElementById('backToTop');
  const themeToggle = document.getElementById('themeToggle');
  const modal = document.getElementById('trailerModal');
  const trailerFrame = document.getElementById('trailerFrame');
  const yearEl = document.getElementById('year');

  // Year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme: auto + toggle saved preference
  const getSystemPref = () => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || 'auto';
  setTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'auto';
      const next = current === 'light' ? 'dark' : current === 'dark' ? 'auto' : 'light';
      setTheme(next);
      localStorage.setItem('theme', next);
      updateThemeIcon(next);
    });
    updateThemeIcon(initialTheme);
  }

  function setTheme(mode){
    if (mode === 'auto') {
      root.setAttribute('data-theme', getSystemPref());
    } else {
      root.setAttribute('data-theme', mode);
    }
  }
  function updateThemeIcon(mode){
    const icon = themeToggle?.querySelector('i');
    const normalized = mode === 'auto' ? getSystemPref() : mode;
    if (icon){
      icon.className = 'fa-solid ' + (normalized === 'dark' ? 'fa-moon' : 'fa-sun');
    }
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const stored = localStorage.getItem('theme');
    if (!stored || stored === 'auto') setTheme('auto');
  });

  // Header solid on scroll
  const onScroll = () => {
    const solid = window.scrollY > 10;
    header?.classList.toggle('solid', solid);
    backToTop?.classList.toggle('show', window.scrollY > 400);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Back to top
  // Back to top removed

  // Carousel buttons
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const prev = document.querySelector('[data-carousel-prev]');
    const next = document.querySelector('[data-carousel-next]');
    const scrollBy = () => carousel.clientWidth * 0.9;
    prev?.addEventListener('click', () => carousel.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
    next?.addEventListener('click', () => carousel.scrollBy({ left: scrollBy(), behavior: 'smooth' }));
  });

  // On‑scroll animations
  const animateEls = Array.from(document.querySelectorAll('[data-animate]'));
  if (animateEls.length){
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting));
    }, { threshold: 0.15 });
    animateEls.forEach(el => io.observe(el));
  }

  // Trailer modal
  function openTrailer(url, title){
    if (!modal || !trailerFrame) return;
    modal.hidden = false;
    trailerFrame.src = url + (url.includes('?') ? '&' : '?') + 'autoplay=1';
    const label = document.getElementById('trailerTitle');
    if (label && title) label.textContent = title + ' — Trailer';
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    if (!modal || !trailerFrame) return;
    modal.hidden = true;
    trailerFrame.src = '';
    document.body.style.overflow = '';
  }
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.querySelector('[data-close-modal]')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal?.hidden) closeModal(); });

  // Bind trailer buttons (demo URLs)
  document.querySelectorAll('[data-open-trailer]').forEach(btn => {
    btn.addEventListener('click', () => {
      openTrailer('https://www.youtube.com/embed/dQw4w9WgXcQ', 'Featured');
    });
  });

  // Live chat widget
  const chatLauncher = document.getElementById('chatLauncher');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatForm = document.getElementById('chatForm');
  const chatMessages = document.getElementById('chatMessages');
  chatLauncher?.addEventListener('click', () => chatWindow?.classList.toggle('open'));
  chatClose?.addEventListener('click', () => chatWindow?.classList.remove('open'));
  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = chatForm.querySelector('input');
    const text = input?.value?.trim();
    if (!text) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg';
    bubble.textContent = text;
    chatMessages?.appendChild(bubble);
    input.value = '';
    chatMessages?.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
  });

  // Genres click demo -> navigate to catalog with filter param
  document.querySelectorAll('.genre').forEach(g => {
    g.addEventListener('click', () => {
      const genre = g.getAttribute('data-genre');
      location.href = `./pages/catalog.html?genre=${encodeURIComponent(genre||'')}`;
    });
  });
});


