import React from 'react';
import { Link } from '@inertiajs/react';

export default function Cart({ cartItems, total }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Shopping Cart</h3>
      </div>
      <div className="border-t border-gray-200">
        {cartItems.length === 0 ? (
          <div className="px-4 py-5 sm:px-6">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <img
                    src={item.image_path}
                    alt={item.name}
                    className="h-16 w-16 rounded-md"
                  />
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <p className="text-base font-medium text-gray-900">Total</p>
                <p className="text-base font-medium text-gray-900">{formatCurrency(total)}</p>
              </div>
              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
