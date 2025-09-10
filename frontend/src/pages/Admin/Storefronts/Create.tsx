import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import { StorefrontForm } from '@/Components/Admin/StorefrontForm';

export default function CreateStorefront() {
  return (
    <AdminLayout>
      <Head title="Create Storefront" />
      
      <div className="max-w-4xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Create Storefront</h1>
            <p className="mt-2 text-sm text-gray-700">
              Add a new storefront to your marketplace.
            </p>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <StorefrontForm />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
