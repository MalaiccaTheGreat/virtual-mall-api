import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function CurrencySwitcher() {
    const { props } = usePage();
    const [currency, setCurrency] = useState(props.currency || 'USD');

    useEffect(() => {
        // You would typically make a request to the backend to set the currency in the session
        // For now, we will just store it in local storage
        localStorage.setItem('currency', currency);
        // And reload the page to reflect the change
        window.location.reload();
    }, [currency]);

    const toggleCurrency = () => {
        setCurrency(prev => prev === 'USD' ? 'ZMW' : 'USD');
    };

    return (
        <button onClick={toggleCurrency} className="text-gray-500 hover:text-gray-700">
            Switch to {currency === 'USD' ? 'ZMW' : 'USD'}
        </button>
    );
}
