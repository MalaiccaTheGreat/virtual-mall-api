import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface OrderDetails {
  orderNumber: string;
  email: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    image_path?: string;
    selectedSize?: string;
    selectedColor?: string;
  }>;
  total: number;
}

export const CheckoutSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state as OrderDetails | undefined;

  useEffect(() => {
    if (!orderDetails) {
      navigate('/');
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return null;
  }

  // Set focus on the main heading when the component mounts
  useEffect(() => {
    if (orderDetails) {
      const heading = document.querySelector('h1');
      if (heading) {
        heading.setAttribute('tabIndex', '-1');
        heading.focus();
      }
    }
  }, [orderDetails]);

  return (
    <div className="bg-white">
      <div 
        className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
        role="main"
        aria-labelledby="order-confirmation-heading"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <CheckCircleIcon 
              className="mx-auto h-16 w-16 text-green-600" 
              aria-hidden="true"
            />
            <h1 
              id="order-confirmation-heading"
              className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl focus:outline-none"
              tabIndex={-1}
            >
              Thank you for your order!
            </h1>
            <div 
              className="mt-4 text-lg text-gray-500"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <p>
                Your order <strong>#{orderDetails.orderNumber}</strong> has been placed and is being processed.
              </p>
              <p className="mt-2 text-sm">
                We've sent a confirmation email to <span className="font-medium">{orderDetails.email}</span>.
              </p>
            </div>
          </div>

          <section 
            className="mt-12 border-t border-gray-200 pt-10"
            aria-labelledby="order-details-heading"
          >
            <h2 id="order-details-heading" className="text-lg font-medium text-gray-900 mb-6">
              Order details
            </h2>
            
            <ul className="space-y-6" role="list" aria-label="Ordered items">
              {orderDetails.items.map((item) => (
                <li 
                  key={`${item.id}-${item.selectedSize}`} 
                  className="flex items-center"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={item.image_path || '/placeholder-product.jpg'}
                      alt=""
                      className="w-20 h-20 rounded-md object-cover"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      <span className="sr-only">Product: </span>
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      <span className="sr-only">Quantity: </span>
                      <span aria-hidden="true">Qty: </span>
                      {item.quantity}
                      {item.selectedSize && (
                        <>
                          <span className="sr-only">, Size: </span>
                          <span aria-hidden="true"> • Size: </span>
                          {item.selectedSize}
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    <span className="sr-only">Price: </span>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-gray-200 pt-6">
              <dl className="space-y-3">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <dt>Subtotal</dt>
                  <dd aria-label={`Subtotal: $${(orderDetails.total - 5).toFixed(2)}`}>
                    ${(orderDetails.total - 5).toFixed(2)}
                  </dd>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <dt>Shipping</dt>
                  <dd>$5.00</dd>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 pt-4 border-t border-gray-200">
                  <dt>Total</dt>
                  <dd className="font-bold" aria-label={`Total: $${orderDetails.total.toFixed(2)}`}>
                    ${orderDetails.total.toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <div className="mt-10 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue Shopping
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Print order confirmation"
            >
              Print receipt
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Need help? <a href="/contact" className="font-medium text-blue-600 hover:text-blue-500">Contact us</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
