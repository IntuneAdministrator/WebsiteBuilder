(function(){
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  const path = location.pathname.split('/').pop() || 'index.html';

  const navLink = (href, label) => `<a href="${href}" ${path === href ? 'class="active"' : ''}>${label}</a>`;

  if (header) {
    header.innerHTML = `
      <nav class="nav">
        <div class="container nav__inner">
          <a class="brand" href="index.html" aria-label="Home">
            <img src="assets/logo.svg" alt="Store logo">
            <span>Modern Store</span>
          </a>
          <div class="nav__links">
            ${navLink('index.html','Home')}
            ${navLink('about.html','About')}
            ${navLink('products.html','Products')}
            ${navLink('pricing.html','Deals')}
            ${navLink('contact.html','Contact')}
          </div>
          <div class="nav__actions">
            <button class="btn btn--ghost cart-btn" id="open-cart" aria-label="Open cart">
              <img src="assets/icons/cart.svg" alt="Cart" width="18" height="18">
              <span class="cart-count" id="cart-count">0</span>
            </button>
          </div>
        </div>
      </nav>`;
  }

  if (footer) {
    footer.innerHTML = `
      <footer class="footer">
        <div class="container footer__inner">
          <div class="footer__grid">
            <div class="footer__brand">
              <div class="brand"><img src="assets/logo.svg" alt="Store logo"><span>Modern Store</span></div>
              <small>Quality products delivered to your door.</small>
              <div style="margin-top:8px; display:grid; gap:6px;">
                <div><i class="fa-solid fa-phone"></i> <a href="tel:+15551234567">+1 (555) 123-4567</a></div>
                <div><i class="fa-regular fa-envelope"></i> <a href="mailto:support@modernstore.example">support@modernstore.example</a></div>
                <div><i class="fa-solid fa-location-dot"></i> 123 Commerce St, Suite 100, San Francisco, CA</div>
              </div>
            </div>
            <div class="footer__links">
              <div>
                <h4>Shop</h4>
                <a href="products.html">All Products</a>
                <a href="pricing.html">Deals</a>
              </div>
              <div>
                <h4>Company</h4>
                <a href="about.html">About</a>
                <a href="contact.html">Contact</a>
              </div>
              <div>
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Shipping</a>
              </div>
              <div>
                <h4>Follow</h4>
                <div class="socials">
                  <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>
                  <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                  <a href="#" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                  <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
                </div>
              </div>
            </div>
          </div>
          <small>© <span id="year"></span> Modern Store. All rights reserved.</small>
        </div>
      </footer>`;
    const year = footer.querySelector('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  // Ensure cart modal exists on every page
  if (!document.getElementById('cart-modal')) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'cart-modal';
    modal.setAttribute('aria-hidden','true');
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.innerHTML = `
      <div class="modal__dialog" role="document">
        <button class="modal__close" data-modal-close aria-label="Close">×</button>
        <div class="modal__content">
          <h2>Your Cart</h2>
          <div id="cart-items"></div>
          <div style="display:flex; justify-content: space-between; align-items:center; margin-top:12px;">
            <strong>Total: <span id="cart-total">$0</span></strong>
            <button class="btn btn--accent" id="checkout-btn">Checkout</button>
          </div>
        </div>
      </div>
      <div class="modal__backdrop" data-modal-close></div>`;
    document.body.appendChild(modal);
  }
})();


