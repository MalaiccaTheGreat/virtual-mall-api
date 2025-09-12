import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/20/solid';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  loading?: boolean;
}

export const ProductCard = ({ product, loading = false }: ProductCardProps) => {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    // Simulate API call
    setTimeout(() => {
      addToCart(product);
      setIsAdding(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="relative pb-[100%] bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
        </div>
      </div>
    );
  }

  // Handle Enter key press for the card
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.currentTarget.getAttribute('aria-disabled')) {
      e.preventDefault();
      window.location.href = `/products/${product.id}`;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="article"
      aria-labelledby={`product-${product.id}-title`}
    >
      <Link 
        to={`/products/${product.id}`} 
        className="block focus:outline-none"
        aria-labelledby={`product-${product.id}-title product-${product.id}-price`}>
        <div className="relative pb-[100%] overflow-hidden">
          <img
            src={product.image_path || '/placeholder-product.jpg'}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            width={300}
            height={300}
          />
        </div>
        <div className="p-4">
          <h3 id={`product-${product.id}-title`} className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
          <p id={`product-${product.id}-price`} className="sr-only">
            Price: ${product.price?.toFixed(2) || '0.00'}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              ${product.price?.toFixed(2) || '0.00'}
            </span>
            <span className="text-sm text-gray-500">
              {product.category}
            </span>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || isInCart(product.id)}
              className={`w-full flex items-center justify-center rounded-md border border-transparent ${
                isInCart(product.id)
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isAdding ? 'opacity-70' : ''
              }`}
              aria-live="polite"
              aria-busy={isAdding}
              aria-label={isInCart(product.id) 
                ? 'Added to cart' 
                : `Add ${product.name} to cart`
              }
            >
              {isAdding ? (
                'Adding...'
              ) : isInCart(product.id) ? (
                <>
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};
