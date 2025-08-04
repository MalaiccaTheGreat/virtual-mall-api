import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Layouts/Layout';

export default function Show({ store }) {
    return (
        <Layout>
            <Head title={store.name} />
            <div className="bg-white">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div className="pb-16 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                            <img src={store.logo} alt={store.name} className="h-24 w-24 rounded-full object-cover" />
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900" style={{ color: '#002366' }}>{store.name}</h1>
                                <p className="mt-2 text-lg text-gray-500">{store.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16">
                        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Products</h2>

                        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                            {store.products.map((product) => (
                                <div key={product.id} className="group relative">
                                    <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                                        <img
                                            src={product.image_url || '/assets/Logo.jpeg'}
                                            alt={product.name}
                                            className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-between">
                                        <div>
                                            <h3 className="text-sm text-gray-700">
                                                <Link href={route('products.show', product.id)}>
                                                    <span aria-hidden="true" className="absolute inset-0" />
                                                    {product.name}
                                                </Link>
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">{store.name}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900" style={{ color: '#FFD700' }}>
                                            {localStorage.getItem('currency') === 'ZMW' ? `K${product.price_kwacha}` : `$${product.price}`}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
