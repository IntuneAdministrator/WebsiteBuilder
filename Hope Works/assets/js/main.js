// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => navLinks.classList.toggle('show'));
}

// Smooth scroll with active link highlight for on-page links
const headerHeight = 64;
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', evt => {
    const targetId = link.getAttribute('href');
    if (targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        evt.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  });
});

// Scroll spy (home page sections)
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
const spy = () => {
  let current = null;
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom >= 120) current = sec.id;
  });
  navItems.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', spy);
spy();

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-animate]');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Back to top button
const toTop = document.querySelector('.to-top');
if (toTop) {
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    toTop.classList.toggle('show', show);
  });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Program filters (programs.html)
const filterButtons = document.querySelectorAll('.filter-btn');
const programCards = document.querySelectorAll('[data-program]');
const applyFilter = (type) => {
  programCards.forEach(card => {
    const categories = (card.dataset.program || '').split(',');
    const match = type === 'all' || categories.includes(type);
    card.style.display = match ? '' : 'none';
  });
};
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});


