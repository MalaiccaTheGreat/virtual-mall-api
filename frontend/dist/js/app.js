document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav ul');
  const user = JSON.parse(localStorage.getItem('user'));

  if (nav) {
    // Dynamic Navigation
    if (user) {
      // User is logged in
      nav.innerHTML = `
                <li><a href="/index.html">Home</a></li>
                <li><a href="/pages/products.html">Products</a></li>
                <li><a href="/pages/profile.html">Profile</a></li>
                <li><a href="/pages/cart.html">Cart (<span id="cart-count">0</span>)</a></li>
                <li><a href="#" id="logout-button">Logout</a></li>
            `;

      const logoutButton = document.getElementById('logout-button');
      if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('user');
          window.location.href = '/index.html';
        });
      }
    } else {
      // User is a guest
      nav.innerHTML = `
                <li><a href="/index.html">Home</a></li>
                <li><a href="/pages/products.html">Products</a></li>
                <li><a href="/pages/cart.html">Cart (<span id="cart-count">0</span>)</a></li>
                <li><a href="/pages/login.html">Login</a></li>
                <li><a href="/pages/signup.html" class="cta-button">Create Account</a></li>
            `;
      displayGuestWarning();
    }
  }

  updateCartCount();
});

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }
}

function displayGuestWarning() {
  if (!sessionStorage.getItem('guestWarningShown')) {
    const warningModal = document.createElement('div');
    warningModal.id = 'guest-warning-modal';
    warningModal.className = 'modal';
    warningModal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Welcome, Guest!</h2>
                <p>Please note that your shopping cart will not be saved if you close your browser. For a persistent cart, please create an account.</p>
                <button id="modal-close-btn">I Understand</button>
            </div>
        `;
    document.body.appendChild(warningModal);

    const closeModal = () => {
      warningModal.remove();
      sessionStorage.setItem('guestWarningShown', 'true');
    };

    warningModal
      .querySelector('.close-button')
      .addEventListener('click', closeModal);
    warningModal
      .querySelector('#modal-close-btn')
      .addEventListener('click', closeModal);
  }
}
