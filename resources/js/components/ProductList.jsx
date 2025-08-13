import React from 'react';
import { Link } from '@inertiajs/react';

export default function ProductList({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow">
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-md overflow-hidden">
            <img
              src={product.image_path}
              alt={product.name}
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{product.description}</p>
            <div className="mt-2">
              <span className="text-lg font-medium text-gray-900">{formatCurrency(product.price)}</span>
            </div>
            <Link
              href={`/products/${product.id}`}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
