document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const loader = document.getElementById('loader');
  const searchInput = document.getElementById('product-search');
  let allProducts = [];

  // Show loader and fetch products
  loader.style.display = 'block';
  productGrid.style.display = 'none';

  fetch('../data/products.json')
    .then((response) => response.json())
    .then((products) => {
      allProducts = products;
      displayProducts(allProducts);
      loader.style.display = 'none';
      productGrid.style.display = 'grid';
    })
    .catch((error) => {
      console.error('Error loading products:', error);
      loader.style.display = 'none';
      productGrid.innerHTML =
        '<p>Could not load products. Please try again later.</p>';
      productGrid.style.display = 'block';
    });

  function displayProducts(products) {
    productGrid.innerHTML = ''; // Clear existing products
    products.forEach((product) => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.dataset.productId = product.id;
      productCard.dataset.productName = product.name;
      productCard.dataset.productPrice = product.price;
      productCard.dataset.productImage = product.image;

      productCard.innerHTML = `
                <img src="../assets/${product.image}" alt="${product.name}" style="max-width: 100%; height: auto;">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn">Add to Cart</button>
            `;
      productGrid.appendChild(productCard);
    });
  }

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
  });

  productGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const card = e.target.closest('.product-card');
      const product = {
        id: card.dataset.productId,
        name: card.dataset.productName,
        price: parseFloat(card.dataset.productPrice),
        image: card.dataset.productImage,
        quantity: 1,
      };
      addToCart(product);

      // Visual feedback
      const button = e.target;
      button.textContent = 'Added!';
      setTimeout(() => {
        button.textContent = 'Add to Cart';
      }, 2000);
    }
  });
});

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProductIndex = cart.findIndex((item) => item.id === product.id);

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  }
}
