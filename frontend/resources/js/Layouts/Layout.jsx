
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import CurrencySwitcher from '@/components/CurrencySwitcher';

export default function Layout({ children, title }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="text-xl font-bold text-gray-800">
                                    Virtual Mall
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href="/"
                                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/products"
                                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
                                >
                                    Products
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <CurrencySwitcher />
                            {auth.user ? (
                                <div className="ml-4 flex items-center space-x-4">
                                    <span className="text-gray-700">Hello, {auth.user.name}</span>
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            ) : (
                                <div className="ml-4 flex items-center space-x-4">
                                    <Link href="/login" className="text-gray-500 hover:text-gray-700">
                                        Login
                                    </Link>
                                    <Link href="/register" className="text-gray-500 hover:text-gray-700">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-4">
                {children}
            </main>
        </div>
    );
}
