
import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../components/Layout';

export default function Products({ products = [] }) {
    return (
        <Layout>
            <Head title="Products - Pulse & Threads Virtual Mall" />
            
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center space-x-4 mb-6">
                            <img 
                                src="/assets/Logo.jpeg" 
                                alt="Pulse & Threads Logo" 
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                                <h1 className="text-4xl font-bold" style={{ color: '#1e3a8a' }}>
                                    Our Collection
                                </h1>
                                <p style={{ color: '#FFD700' }} className="text-xl">
                                    Discover Premium Fashion at Pulse & Threads
                                </p>
                            </div>
                        </div>
                        
                        <div className="max-w-2xl mx-auto">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                className="w-full px-6 py-4 text-lg border-2 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
                                style={{ borderColor: '#FFD700' }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 transition-all duration-300 hover:scale-105"
                                    style={{ borderTopColor: '#FFD700' }}
                                >
                                    <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                                        <img 
                                            src={product.image_url || '/assets/Logo.jpeg'} 
                                            alt={product.name}
                                            className="w-full h-64 object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold" style={{ color: '#FFD700' }}>
                                                ${product.price}
                                            </span>
                                            <button 
                                                className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-yellow-400"
                                                style={{ backgroundColor: '#FFD700', color: '#1e3a8a' }}
                                            >
                                                Try On
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1e3a8a' }}>
                                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-semibold mb-2" style={{ color: '#1e3a8a' }}>
                                    Products Coming Soon
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    We're adding amazing fashion pieces to our collection. Check back soon!
                                </p>
                                <button 
                                    className="px-8 py-3 rounded-lg font-semibold transition-colors hover:bg-yellow-400"
                                    style={{ backgroundColor: '#FFD700', color: '#1e3a8a' }}
                                >
                                    Notify Me
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
