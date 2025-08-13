document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const loader = document.getElementById('loader');
  const searchInput = document.getElementById('product-search');
  let allProducts = [];

  // Basic modal open/close behavior
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('try-on-btn')) {
      const modal = document.getElementById('try-on-modal');
      if (modal) modal.classList.remove('hidden');
    }
    if (e.target.classList.contains('close-btn')) {
      const modal = document.getElementById('try-on-modal');
      if (modal) modal.classList.add('hidden');
    }
  });

  // Fabric.js interactive try-on canvas
  const fabricCanvas = new fabric.Canvas('try-on-canvas');
  let userImgObj = null;
  let clothingImgObj = null;
  let uploadedImageSrc = null;
  let clothingSrc = '../assets/shirt-overlay.png'; // Default overlay, update as needed

  // Handle image upload
  const uploadInput = document.getElementById('upload-image');
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (event) {
        uploadedImageSrc = event.target.result;
        fabricCanvas.clear();
        // Add user image
        fabric.Image.fromURL(uploadedImageSrc, function (img) {
          img.set({ left: 0, top: 0, scaleX: fabricCanvas.width / img.width, scaleY: fabricCanvas.height / img.height, selectable: false });
          userImgObj = img;
          fabricCanvas.add(img);
          fabricCanvas.sendToBack(img);
        });
        // Add clothing overlay
        fabric.Image.fromURL(clothingSrc, function (img) {
          img.set({ left: 100, top: 180, scaleX: 0.6, scaleY: 0.6, selectable: true });
          img.setControlsVisibility({ mtr: true }); // Enable rotation control
          clothingImgObj = img;
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // Optional: Add button controls for rotation and resizing
  const rotateBtn = document.getElementById('rotate-btn');
  if (rotateBtn) {
    rotateBtn.addEventListener('click', () => {
      if (clothingImgObj) {
        clothingImgObj.rotate((clothingImgObj.angle || 0) + 15);
        fabricCanvas.requestRenderAll();
      }
    });
  }
  const resizeBtn = document.getElementById('resize-btn');
  if (resizeBtn) {
    resizeBtn.addEventListener('click', () => {
      if (clothingImgObj) {
        clothingImgObj.scaleX *= 1.1;
        clothingImgObj.scaleY *= 1.1;
        fabricCanvas.requestRenderAll();
      }
    });
  }

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
        <p>ZMW ${product.price.toFixed(2)}</p>
        <button class="add-to-cart-btn">Add to Cart</button>
        <button class="try-on-btn" data-product-id="${product.id}">👕 Try It On</button>
      `;
      productGrid.appendChild(productCard);
    });
  }

  // Handle Try On button click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('try-on-btn')) {
      document.getElementById('try-on-modal').classList.remove('hidden');
    }
  });

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
    } else if (e.target.classList.contains('try-on-btn')) {
      // Handle Try It On button click
      openTryOnModal(e.target.dataset.productId);
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

// --- Try-On Canvas Logic ---
// Example usage: set uploadedPhotoSrc and productImageName, then call renderTryOnCanvas
function renderTryOnCanvas(uploadedPhotoSrc, productImageName) {
  const canvas = document.getElementById('tryon-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Load user photo
  const userImg = new Image();
  userImg.src = uploadedPhotoSrc;
  userImg.onload = () => {
    ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);

    // Load product overlay after user image is drawn
    const clothingImg = new Image();
    clothingImg.src = `../assets/${productImageName}`;
    clothingImg.onload = () => {
      ctx.drawImage(clothingImg, 100, 200, 200, 250); // Positioning is adjustable
    };
  };
}

// Make sure Fabric.js is loaded in your HTML before this script runs

function renderTryOnWithFabric(uploadedPhotoSrc, productImageName) {
  // Remove any existing Fabric canvas instance
  if (window.fabricCanvas) {
    window.fabricCanvas.dispose();
  }
  const fabricCanvas = new fabric.Canvas('tryon-canvas');
  window.fabricCanvas = fabricCanvas; // Store globally to avoid duplicates

  // Add user photo as background
  fabric.Image.fromURL(uploadedPhotoSrc, (userImg) => {
    userImg.set({
      left: 0,
      top: 0,
      selectable: false,
      scaleX: fabricCanvas.width / userImg.width,
      scaleY: fabricCanvas.height / userImg.height,
    });
    fabricCanvas.setBackgroundImage(userImg, fabricCanvas.renderAll.bind(fabricCanvas));
  });

  // Add clothing overlay
  fabric.Image.fromURL(`../assets/${productImageName}`, (clothingImg) => {
    clothingImg.set({
      left: 100,
      top: 200,
      scaleX: 200 / clothingImg.width,
      scaleY: 250 / clothingImg.height,
      selectable: true, // Allow user to move/resize
    });
    fabricCanvas.add(clothingImg);
    fabricCanvas.setActiveObject(clothingImg);
  });
}

// --- Plain Canvas Overlay ---
const tryOnCanvas = document.getElementById('try-on-canvas');
if (tryOnCanvas) {
  const ctx = tryOnCanvas.getContext('2d');
  const uploadInput = document.getElementById('upload-image');
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const userImg = new Image();
        userImg.src = event.target.result;
        userImg.onload = () => {
          ctx.clearRect(0, 0, tryOnCanvas.width, tryOnCanvas.height);
          ctx.drawImage(userImg, 0, 0, tryOnCanvas.width, tryOnCanvas.height);

          const clothingImg = new Image();
          clothingImg.src = '../assets/clothing-overlay.png'; // dynamic path if needed
          clothingImg.onload = () => {
            ctx.drawImage(clothingImg, 100, 200, 200, 300); // adjust as needed
          };
        };
      };
      reader.readAsDataURL(e.target.files[0]);
    });
  }
}

// --- Fabric.js Interactive Overlay ---
// (Removed duplicate renderTryOnWithFabric function to prevent conflicts)

// --- Plain Canvas Download Button ---
const tryOnCanvasDownload = document.getElementById('try-on-canvas');
const downloadBtn = document.getElementById('download-look');
if (tryOnCanvasDownload && downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const dataURL = tryOnCanvasDownload.toDataURL();
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'my-tryon-look.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}