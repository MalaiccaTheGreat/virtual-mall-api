import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import ProductList from '../components/ProductList';

export default function Home({ products }) {
  return (
    <React.Fragment>
      <Head title="Home" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-6">Welcome to Virtual Mall</h1>
              <ProductList products={products} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
