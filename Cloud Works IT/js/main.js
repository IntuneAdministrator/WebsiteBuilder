// Utility: throttle
function throttle(fn, wait) {
	let inThrottle = false;
	let lastArgs = null;
	return function throttled(...args) {
		if (inThrottle) { lastArgs = args; return; }
		fn.apply(this, args);
		inThrottle = true;
		setTimeout(() => {
			inThrottle = false;
			if (lastArgs) { fn.apply(this, lastArgs); lastArgs = null; }
		}, wait);
	};
}

// Mobile menu toggle
(function initMenu() {
	const toggle = document.querySelector('[data-menu-toggle]');
	const nav = document.querySelector('[data-nav]');
	if (!toggle || !nav) return;
	toggle.addEventListener('click', () => {
		nav.classList.toggle('open');
	});
})();

// Smooth scroll for internal links
(function initSmoothScroll() {
	document.addEventListener('click', (e) => {
		const link = e.target.closest('a[href^="#"]');
		if (!link) return;
		const id = link.getAttribute('href').slice(1);
		const target = document.getElementById(id);
		if (!target) return;
		e.preventDefault();
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
})();

// Active nav highlight on scroll
(function initActiveNav() {
	const sections = Array.from(document.querySelectorAll('section[id]'));
	const links = Array.from(document.querySelectorAll('[data-nav] a[href^="#"]'));
	if (!sections.length || !links.length) return;
	const map = new Map();
	links.forEach(l => map.set(l.getAttribute('href').slice(1), l));
	const onScroll = throttle(() => {
		let currentId = sections[0].id;
		for (const sec of sections) {
			const rect = sec.getBoundingClientRect();
			if (rect.top <= 120) currentId = sec.id;
		}
		links.forEach(l => l.classList.remove('active'));
		const active = map.get(currentId);
		if (active) active.classList.add('active');
	}, 150);
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
})();

// Reveal on scroll animations
(function initReveal() {
	const items = document.querySelectorAll('.reveal');
	if (!items.length) return;
	const io = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				io.unobserve(entry.target);
			}
		}
	}, { threshold: 0.15 });
	items.forEach(el => io.observe(el));
})();

// Back to top button
(function initBackToTop() {
	const btn = document.querySelector('[data-back-to-top]');
	if (!btn) return;
	const toggle = () => {
		if (window.scrollY > 300) btn.classList.add('show');
		else btn.classList.remove('show');
	};
	window.addEventListener('scroll', throttle(toggle, 150), { passive: true });
	btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
	toggle();
})();

// Services filters and sorting
(function initServicesFilters() {
	const grid = document.querySelector('[data-services-grid]');
	if (!grid) return;
	const categorySelect = document.querySelector('[data-filter-category]');
	const sortSelect = document.querySelector('[data-sort]');
	const items = Array.from(grid.querySelectorAll('[data-service-item]'));
	function apply() {
		const cat = categorySelect ? categorySelect.value : 'all';
		const sort = sortSelect ? sortSelect.value : 'popular';
		let filtered = items.filter(it => cat === 'all' || it.dataset.category === cat);
		filtered.forEach(it => it.style.display = '');
		items.forEach(it => { if (!filtered.includes(it)) it.style.display = 'none'; });
		if (sort === 'popular') filtered.sort((a,b) => (+b.dataset.popularity) - (+a.dataset.popularity));
		if (sort === 'name') filtered.sort((a,b) => a.dataset.name.localeCompare(b.dataset.name));
		filtered.forEach((el, idx) => el.style.order = String(idx));
	}
	categorySelect && categorySelect.addEventListener('change', apply);
	sortSelect && sortSelect.addEventListener('change', apply);
	apply();
})();

// Lazy load images
(function initLazyImages() {
	const images = document.querySelectorAll('img[data-src]');
	if (!images.length) return;
	const load = (img) => { img.src = img.dataset.src; img.removeAttribute('data-src'); };
	if ('loading' in HTMLImageElement.prototype) { images.forEach(load); return; }
	const io = new IntersectionObserver((entries) => {
		entries.forEach(e => { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } });
	});
	images.forEach(img => io.observe(img));
})();
