import { Link, Head } from '@inertiajs/react';
import React from 'react';
import Layout from '../components/Layout';

export default function Welcome() {
    return (
        <Layout>
            <Head title="Welcome to Pulse & Threads Virtual Mall" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <img 
                            src="/assets/Logo.jpeg" 
                            alt="Pulse & Threads Logo" 
                            className="mx-auto h-24 w-24 rounded-full object-cover mb-6 shadow-lg"
                        />
                        <h1 className="text-5xl font-bold mb-4" style={{ color: '#1e3a8a' }}>
                            Welcome to Pulse & Threads
                        </h1>
                        <h2 className="text-3xl font-semibold mb-8" style={{ color: '#FFD700' }}>
                            Virtual Mall
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <p className="text-xl mb-6" style={{ color: '#1e3a8a' }}>
                                Experience the future of fashion with our innovative virtual mall platform. 
                                Try on clothes virtually, shop seamlessly, and discover your perfect style.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                <Link
                                    href="/products"
                                    className="px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                                    style={{ 
                                        backgroundColor: '#1e3a8a',
                                        color: 'white'
                                    }}
                                >
                                    Start Shopping
                                </Link>
                                <Link
                                    href="/virtual-try-on"
                                    className="px-8 py-4 text-lg font-semibold rounded-lg border-2 transition-all duration-300 hover:scale-105 shadow-lg"
                                    style={{ 
                                        backgroundColor: '#FFD700',
                                        borderColor: '#FFD700',
                                        color: '#1e3a8a'
                                    }}
                                >
                                    Try Virtual Fitting
                                </Link>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="bg-white rounded-lg p-6 shadow-lg border-t-4" style={{ borderTopColor: '#FFD700' }}>
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1e3a8a' }}>
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2" style={{ color: '#1e3a8a' }}>Virtual Try-On</h3>
                                <p className="text-gray-600">Experience clothes before you buy with our advanced AR technology</p>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-lg border-t-4" style={{ borderTopColor: '#FFD700' }}>
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1e3a8a' }}>
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2" style={{ color: '#1e3a8a' }}>AI Assistant</h3>
                                <p className="text-gray-600">Get personalized styling advice and product recommendations</p>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-lg border-t-4" style={{ borderTopColor: '#FFD700' }}>
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1e3a8a' }}>
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2" style={{ color: '#1e3a8a' }}>Secure Shopping</h3>
                                <p className="text-gray-600">Shop with confidence with our secure payment and delivery system</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}