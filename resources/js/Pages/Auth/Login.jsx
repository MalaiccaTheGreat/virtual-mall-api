import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Button from '../..//Components/Button';
import Input from '../..//Components/Input';
import Label from '../..//Components/Label';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const onLogin = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => setData('password', ''),
    });
  };

  const onTwoFactorSubmit = (e) => {
    e.preventDefault();
    post(route('login'), {
      data: {
        ...data,
        two_factor_code: twoFactorCode,
      },
      onFinish: () => setTwoFactorCode(''),
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
        <div className="mb-4 text-sm text-gray-600">
          {status && (
            <div className="mb-4 font-medium text-sm text-green-600">
              {status}
            </div>
          )}
        </div>

        <form onSubmit={onLogin}>
          <div>
            <Label htmlFor="email" value="Email" />
            <Input
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="mt-1 block w-full"
              autoComplete="username"
              isFocused={true}
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
              autoComplete="current-password"
              handleChange={(e) => setData('password', e.target.value)}
              error={errors.password}
            />
          </div>

          <div className="block mt-4">
            <label className="flex items-center">
              <input
                id="remember_me"
                type="checkbox"
                name="remember"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          <div className="flex items-center justify-end mt-4">
            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Forgot your password?
              </Link>
            )}

            <Button className="ml-4" processing={processing}>
              Log in
            </Button>
          </div>
        </form>

        {showTwoFactor && (
          <form onSubmit={onTwoFactorSubmit} className="mt-4">
            <div className="mb-4 text-sm text-gray-600">
              Please enter your two factor authentication code:
            </div>
            <div>
              <Input
                id="two_factor_code"
                type="text"
                name="two_factor_code"
                value={twoFactorCode}
                className="mt-1 block w-full"
                handleChange={(e) => setTwoFactorCode(e.target.value)}
                error={errors.two_factor_code}
              />
            </div>
            <div className="flex items-center justify-end mt-4">
              <Button className="ml-4" processing={processing}>
                Confirm
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
