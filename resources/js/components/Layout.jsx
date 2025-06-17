import React from 'react';
import { Link } from '@inertiajs/react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-800">Virtual Mall</span>
              </Link>
            </div>
            
            <div className="hidden sm:flex sm:items-center sm:ml-6">
              <Link href="/virtual-try-on" className="ml-4 px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
                Virtual Try-On
              </Link>
              <Link href="/cart" className="ml-4 px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
                Cart
              </Link>
              <Link href="/login" className="ml-4 px-3 py-2 text-sm text-gray-700 hover:text-gray-900">
                Login
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
