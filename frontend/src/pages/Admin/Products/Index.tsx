import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/Components/Badge';

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  sale_price: number | null;
  is_featured: boolean;
  is_active: boolean;
  category: string;
  storefront: {
    id: number;
    name: string;
  } | null;
  default_variation: {
    stock_quantity: number;
  } | null;
  created_at: string;
};

type Props = {
  products: {
    data: Product[];
    links: any[];
  };
  filters: {
    search?: string;
    storefront_id?: string;
    category?: string;
  };
  storefronts: Array<{ id: number; name: string }>;
  categories: string[];
};

export default function ProductsIndex({ products, filters, storefronts, categories }: Props) {
  const { auth } = usePage<PageProps>().props;

  return (
    <AdminLayout>
      <Head title="Products" />
      
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all products in your marketplace including their price, category, and status.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href={route('admin.products.create')}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Product
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="search"
                  id="search"
                  defaultValue={filters.search}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Search products..."
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="storefront_id" className="block text-sm font-medium text-gray-700">
                Storefront
              </label>
              <select
                id="storefront_id"
                name="storefront_id"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue={filters.storefront_id || ''}
              >
                <option value="">All Storefronts</option>
                {storefronts.map((storefront) => (
                  <option key={storefront.id} value={storefront.id}>
                    {storefront.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                defaultValue={filters.category || ''}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-6 flex justify-end space-x-3">
              <Link
                href={route('admin.products.index')}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Reset
              </Link>
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Product
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Storefront
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.data.map((product) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-gray-500">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {product.category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.storefront?.name || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          {product.sale_price ? (
                            <>
                              <span className="text-gray-900 font-medium">${product.sale_price.toFixed(2)}</span>
                              <span className="ml-2 text-gray-400 line-through">${product.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-gray-900 font-medium">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {product.is_featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={route('admin.products.edit', product.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <Link
                            href={route('admin.products.destroy', product.id)}
                            method="delete"
                            as="button"
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                            confirm="Are you sure you want to delete this product?"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              {products.links.length > 3 && (
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
                        href={products.links[0].url || '#'}
                        className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                          !products.links[0].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                        disabled={!products.links[0].url}
                      >
                        Previous
                      </Link>
                      <Link
                        href={products.links[products.links.length - 1].url || '#'}
                        className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                          !products.links[products.links.length - 1].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                        disabled={!products.links[products.links.length - 1].url}
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
