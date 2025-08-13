import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Cart from '../components/Cart';

export default function CartPage({ cartItems, total }) {
  return (
    <React.Fragment>
      <Head title="Cart" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <Cart cartItems={cartItems} total={total} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
