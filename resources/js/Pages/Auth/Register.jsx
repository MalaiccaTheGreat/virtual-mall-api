import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Button from '../..//Components/Button';
import Input from '../..//Components/Input';
import Label from '../..//Components/Label';

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const onRegister = (e) => {
    e.preventDefault();
    post(route('register'), {
      onFinish: () => {
        setData('password', '');
        setData('password_confirmation', '');
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
      <div>
        <Link href="/">
          <h1 className="text-4xl font-bold text-gray-900">Virtual Mall</h1>
        </Link>
      </div>

      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
        <form onSubmit={onRegister}>
          <div>
            <Label htmlFor="name" value="Name" />
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

          <div className="mt-4">
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

          <div className="mt-4">
            <Label htmlFor="password" value="Password" />
            <Input
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="mt-1 block w-full"
              handleChange={(e) => setData('password', e.target.value)}
              error={errors.password}
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="password_confirmation" value="Confirm Password" />
            <Input
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              className="mt-1 block w-full"
              handleChange={(e) => setData('password_confirmation', e.target.value)}
              error={errors.password_confirmation}
            />
          </div>

          <div className="flex items-center justify-end mt-4">
            <Link
              href={route('login')}
              className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Already registered?
            </Link>

            <Button className="ml-4" processing={processing}>
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
