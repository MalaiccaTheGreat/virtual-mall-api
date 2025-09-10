import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import { ProductForm } from '@/Components/Admin/ProductForm';

type Storefront = {
  id: number;
  name: string;
};

type Props = {
  storefronts: Storefront[];
  categories: string[];
};

export default function CreateProduct({ storefronts, categories }: Props) {
  return (
    <AdminLayout>
      <Head title="Create Product" />
      
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
            <p className="mt-2 text-sm text-gray-700">
              Fill in the details below to create a new product.
            </p>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ProductForm 
              storefronts={storefronts}
              categories={categories}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
