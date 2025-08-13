import React from 'react';
import { Link } from '@inertiajs/react';

export default function Button({ href, children, className = '', ...props }) {
    const baseClass = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500';
    
    if (href) {
        return (
            <Link href={href} className={`${baseClass} ${className}`} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button className={`${baseClass} ${className}`} {...props}>
            {children}
        </button>
    );
}
