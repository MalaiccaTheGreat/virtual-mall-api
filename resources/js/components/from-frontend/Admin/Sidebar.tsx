import { Link } from '@inertiajs/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'home' },
    { name: 'Storefronts', href: '/admin/storefronts', icon: 'store' },
    { name: 'Products', href: '/admin/products', icon: 'shopping-bag' },
    { name: 'Orders', href: '/admin/orders', icon: 'shopping-cart' },
    { name: 'Customers', href: '/admin/customers', icon: 'users' },
    { name: 'Analytics', href: '/admin/analytics', icon: 'chart-bar' },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
      </div>

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
      >
        <div className="flex h-full flex-col overflow-y-auto bg-white pb-4">
          <div className="flex h-16 flex-shrink-0 items-center px-6">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Virtual Mall Admin
            </Link>
            <button
              type="button"
              className="ml-auto rounded-md p-2.5 text-gray-700 lg:hidden"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                activeClassName="bg-gray-100 text-gray-900"
              >
                <span className="mr-3 flex h-6 w-6 items-center justify-center">
                  <i className={`fas fa-${item.icon} text-gray-400 group-hover:text-gray-500`} />
                </span>
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto px-4 py-4">
            <div className="rounded-lg bg-indigo-50 p-4">
              <p className="text-xs font-medium text-indigo-700">
                Need help?{' '}
                <a href="#" className="underline hover:text-indigo-900">
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
