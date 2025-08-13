import { useNavigate } from 'react-router-dom';
import { TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect } from 'react';
import { CartItemSkeleton } from '../components/common/Skeleton';

export const CartPage = () => {
  const navigate = useNavigate();
  const { 
    items, 
    itemCount, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    isLoading 
  } = useCart();
  
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Update initial load state after first render
  useEffect(() => {
    if (!isLoading) {
      setIsInitialLoad(false);
    }
  }, [isLoading]);

  const handleUpdateQuantity = async (itemId: string | number, newQuantity: number) => {
    try {
      setIsUpdating(prev => ({ ...prev, [itemId]: true }));
      setError(null);
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setError('Failed to update quantity. Please try again.');
    } finally {
      setIsUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleRemoveItem = async (itemId: string | number) => {
    try {
      setIsUpdating(prev => ({ ...prev, [itemId]: true }));
      setError(null);
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setError('Failed to remove item. Please try again.');
    } finally {
      setIsUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        setIsClearing(true);
        setError(null);
        await clearCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
        setError('Failed to clear cart. Please try again.');
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Handle quantity change with keyboard
  const handleQuantityKeyDown = (
    e: React.KeyboardEvent<HTMLSelectElement>,
    itemId: string | number,
    currentQty: number
  ) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newQty = Math.min(currentQty + 1, 8);
      handleUpdateQuantity(itemId, newQty);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newQty = Math.max(currentQty - 1, 1);
      handleUpdateQuantity(itemId, newQty);
    }
  };

  // Show skeleton loaders on initial load
  if (isLoading && isInitialLoad) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
              <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                {[1, 2, 3].map((i) => (
                  <CartItemSkeleton key={i} />
                ))}
              </ul>
            </section>
            
            {/* Order summary skeleton */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
            >
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="h-12 bg-gray-200 rounded-md w-full"></div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Your cart is empty
            </h1>
            <p className="mt-4 text-gray-500">
              Looks like you haven't added anything to your cart yet.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <section 
            aria-labelledby="cart-heading" 
            className="lg:col-span-7"
            aria-live="polite"
            aria-atomic="false"
          >
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul 
              className="border-t border-b border-gray-200 divide-y divide-gray-200"
              role="list"
              aria-label="Cart items"
            >
              {items.map((item) => (
                <li key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image_path || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-24 h-24 rounded-md object-cover object-center sm:w-32 sm:h-32"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-sm">
                            <a 
                              href={`/products/${item.id}`}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {item.name}
                            </a>
                          </h3>
                        </div>
                        
                        {item.selectedSize && (
                          <p className="mt-1 text-sm text-gray-500">
                            Size: {item.selectedSize}
                          </p>
                        )}
                        
                        {item.selectedColor && (
                          <p className="mt-1 text-sm text-gray-500">
                            Color: {item.selectedColor}
                          </p>
                        )}
                        
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <label htmlFor={`quantity-${item.id}`} className="sr-only">
                          Quantity, {item.name}
                        </label>
                        <select
                          id={`quantity-${item.id}`}
                          name={`quantity-${item.id}`}
                          className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                          onKeyDown={(e) => handleQuantityKeyDown(e, item.id, item.quantity)}
                          disabled={isUpdating[item.id]}
                          aria-label={`Quantity for ${item.name}`}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>

                        <div className="absolute top-0 right-0">
                          <button
                            type="button"
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdating[item.id]}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <span className="sr-only">Remove</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 flex text-sm text-gray-700 space-x-2">
                      {isUpdating[item.id] ? (
                        <>
                          <ArrowPathIcon className="h-5 w-5 text-gray-500 animate-spin" aria-hidden="true" />
                          <span>Updating...</span>
                        </>
                      ) : null}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                {isClearing ? 'Clearing...' : 'Clear cart'}
              </button>
            </div>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">
                  ${totalPrice.toFixed(2)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Shipping estimate</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">
                  {totalPrice > 0 ? '$5.00' : '$0.00'}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
                  ${(totalPrice > 0 ? totalPrice + 5 : 0).toFixed(2)}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                Checkout
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
