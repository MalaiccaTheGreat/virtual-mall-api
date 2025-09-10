import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import { StorefrontForm } from '@/Components/Admin/StorefrontForm';

type Storefront = {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string;
  secondary_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type Props = {
  storefront: Storefront;
};

export default function EditStorefront({ storefront }: Props) {
  const { auth } = usePage<PageProps>().props;

  return (
    <AdminLayout>
      <Head title={`Edit ${storefront.name}`} />
      
      <div className="max-w-4xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit Storefront: {storefront.name}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Update the details of this storefront.
            </p>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <StorefrontForm storefront={storefront} isEdit />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
