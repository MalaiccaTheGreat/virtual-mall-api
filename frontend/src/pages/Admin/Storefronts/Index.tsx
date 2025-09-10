import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import { PlusIcon } from '@heroicons/react/24/outline';

type Storefront = {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  products_count: number;
};

type Props = {
  storefronts: {
    data: Storefront[];
    links: any[];
  };
};

export default function StorefrontsIndex({ storefronts }: Props) {
  const { auth } = usePage<PageProps>().props;

  return (
    <AdminLayout>
      <Head title="Storefronts" />
      
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Storefronts</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the storefronts in your account including their name and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href={route('admin.storefronts.create')}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Storefront
          </Link>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Products
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {storefronts.data.map((storefront) => (
                    <tr key={storefront.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {storefront.logo_url ? (
                              <img className="h-10 w-10 rounded-full" src={storefront.logo_url} alt="" />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                                <span className="text-sm font-medium text-indigo-700">
                                  {storefront.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{storefront.name}</div>
                            <div className="text-gray-500">/{storefront.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            storefront.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {storefront.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {storefront.products_count}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <time dateTime={storefront.created_at}>
                          {new Date(storefront.created_at).toLocaleDateString()}
                        </time>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={route('admin.storefronts.edit', storefront.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit<span className="sr-only">, {storefront.name}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              {storefronts.links.length > 3 && (
                <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
                  <nav className="flex items-center justify-between" aria-label="Pagination">
                    <div className="hidden sm:block">
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to{' '}
                        <span className="font-medium">10</span> of{' '}
                        <span className="font-medium">20</span> results
                      </p>
                    </div>
                    <div className="flex flex-1 justify-between sm:justify-end">
                      <Link
                        href={storefronts.links[0].url || '#'}
                        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                          !storefronts.links[0].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                        disabled={!storefronts.links[0].url}
                      >
                        Previous
                      </Link>
                      <Link
                        href={storefronts.links[storefronts.links.length - 1].url || '#'}
                        className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                          !storefronts.links[storefronts.links.length - 1].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                        disabled={!storefronts.links[storefronts.links.length - 1].url}
                      >
                        Next
                      </Link>
                    </div>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
