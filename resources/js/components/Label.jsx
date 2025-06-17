import React from 'react';

export default function Label({ htmlFor, children, className = '', ...props }) {
    const baseClass = 'block text-sm font-medium text-gray-700';
    
    return (
        <label
            htmlFor={htmlFor}
            className={`${baseClass} ${className}`}
            {...props}
        >
            {children}
        </label>
    );
}
