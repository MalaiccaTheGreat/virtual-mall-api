import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Layout from '../components/Layout';

export default function Products({ products = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isListening, setIsListening] = useState(false);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    useEffect(() => {
        if (searchQuery) {
            Inertia.get('/products', { search: searchQuery }, { preserveState: true });
        }
    }, [searchQuery]);

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
                                <h1 className="text-4xl font-bold" style={{ color: '#002366' }}>
                                    Our Collection
                                </h1>
                                <p style={{ color: '#FFD700' }} className="text-xl">
                                    Discover Premium Fashion at Pulse & Threads
                                </p>
                            </div>
                        </div>
                        
                        <div className="max-w-2xl mx-auto relative">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full px-6 py-4 text-lg border-2 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
                                style={{ borderColor: '#FFD700' }}
                            />
                            <button
                                onClick={startListening}
                                disabled={isListening}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500 disabled:opacity-50"
                            >
                                {isListening ? (
                                    <svg className="w-6 h-6 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 3a7 7 0 100 14 7 7 0 000-14zM10 15a5 5 0 110-10 5 5 0 010 10z" />
                                    </svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 4a1 1 0 10-2 0v1.586l-1.293-1.293a1 1 0 00-1.414 1.414L8.586 11H7a1 1 0 100 2h6a1 1 0 100-2h-1.586l-1.293-1.293a1 1 0 10-1.414-1.414L11 9.586V8z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div 
                                    key={product.id} 
                                    className="group relative"
                                >
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
                                            <p className="mt-1 text-sm text-gray-500">{product.store ? product.store.name : ''}</p>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {localStorage.getItem('currency') === 'ZMW' ? `K${product.price_kwacha}` : `$${product.price}`}
                                        </p>
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
