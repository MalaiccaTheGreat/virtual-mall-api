import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import VirtualTryOn from '../components/VirtualTryOn';

export default function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);

  const addToCart = () => {
    setLoading(true);
    fetch(`/api/products/${product.id}/add-to-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify({ quantity }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Product added to cart successfully!');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Failed to add product to cart');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Head title={product.name} />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={product.image_path}
                    alt={product.name}
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                  <p className="text-gray-500 mb-6">{product.description}</p>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Price</h2>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Features</h2>
                    <ul className="list-disc list-inside text-gray-600">
                      {product.features?.map((feature) => (
                        <li key={feature.id}>{feature.name}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Quantity</h2>
                    <div className="flex items-center">
                      <button
                        onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                        className="px-3 py-1 border rounded-md hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="mx-4 text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3 py-1 border rounded-md hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={addToCart}
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Adding to cart...' : 'Add to Cart'}
                  </Button>
                  <Button
                    onClick={() => setShowTryOn(true)}
                    className="w-full mt-4"
                  >
                    Virtual Try-On
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showTryOn} onClose={() => setShowTryOn(false)}>
        <VirtualTryOn product={product} />
      </Modal>
    </React.Fragment>
  );
}
