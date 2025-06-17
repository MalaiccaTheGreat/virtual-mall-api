import { Link, Head } from '@inertiajs/react';
import React from 'react';
import Layout from '../components/Layout';

export default function Welcome() {
    return (
        <Layout>
            <div className="min-h-screen bg-gray-100">
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-4xl font-bold text-center mb-8">
                        Welcome to Virtual Mall
                    </h1>
                    <div className="max-w-2xl mx-auto text-center">
                        <p className="text-xl text-gray-600 mb-8">
                            Shop with confidence in our virtual marketplace
                        </p>
                        <Link
                            href="/products"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}