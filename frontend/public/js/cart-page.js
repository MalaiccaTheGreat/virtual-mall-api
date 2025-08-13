document.addEventListener('DOMContentLoaded', () => {
  const cartContainer = document.getElementById('cart-container');
  const cartTotal = document.getElementById('cart-total');
  const checkoutButton = document.getElementById('checkout-button');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  function renderCart() {
    cartContainer.innerHTML = '';
    if (cart.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty.</p>';
      checkoutButton.style.display = 'none';
      return;
    }

    let total = 0;
    cart.forEach((item) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item'; // You'll need to style this class
      itemElement.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
      cartContainer.appendChild(itemElement);
      total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
    checkoutButton.style.display = 'block';
  }

  checkoutButton.addEventListener('click', () => {
    // For now, this is a placeholder
    alert(
      'Checkout is not implemented yet. This would lead to a payment page.'
    );
  });

  renderCart();
});
