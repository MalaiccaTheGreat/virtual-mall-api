import React from 'react';

export default function Input({ type = 'text', className = '', ...props }) {
    const baseClass = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm';
    
    return (
        <input
            type={type}
            className={`${baseClass} ${className}`}
            {...props}
        />
    );
}
