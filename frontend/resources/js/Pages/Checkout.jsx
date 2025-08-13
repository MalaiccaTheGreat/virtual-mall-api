import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import Button from '../Components/Button';
import Input from '../Components/Input';
import Label from '../Components/Label';
import Cart from '../components/Cart';

export default function Checkout({ cartItems, total }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    payment_method: 'cash_on_delivery',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('checkout.store'));
  };

  return (
    <React.Fragment>
      <Head title="Checkout" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Summary */}
            <div className="col-span-2">
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
                <Cart cartItems={cartItems} total={total} />
              </div>
            </div>

            {/* Checkout Form */}
            <div>
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" value="Full Name" />
                      <Input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        handleChange={(e) => setData('name', e.target.value)}
                        error={errors.name}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" value="Email" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        handleChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" value="Phone" />
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full"
                        handleChange={(e) => setData('phone', e.target.value)}
                        error={errors.phone}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" value="Address" />
                      <Input
                        id="address"
                        type="text"
                        name="address"
                        value={data.address}
                        className="mt-1 block w-full"
                        handleChange={(e) => setData('address', e.target.value)}
                        error={errors.address}
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" value="City" />
                      <Input
                        id="city"
                        type="text"
                        name="city"
                        value={data.city}
                        className="mt-1 block w-full"
                        handleChange={(e) => setData('city', e.target.value)}
                        error={errors.city}
                      />
                    </div>

                    <div>
                      <Label htmlFor="country" value="Country" />
                      <Input
                        id="country"
                        type="text"
                        name="country"
                        value={data.country}
                        className="mt-1 block w-full"
                        handleChange={(e) => setData('country', e.target.value)}
                        error={errors.country}
                      />
                    </div>

                    <div>
                      <Label htmlFor="payment_method" value="Payment Method" />
                      <select
                        id="payment_method"
                        name="payment_method"
                        value={data.payment_method}
                        onChange={(e) => setData('payment_method', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >
                        <option value="cash_on_delivery">Cash on Delivery</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                      </select>
                    </div>

                    <Button className="w-full" processing={processing}>
                      Place Order
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
