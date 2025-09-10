import { PropsWithChildren, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Sidebar } from '@/Components/Admin/Sidebar';
import { Header } from '@/Components/Admin/Header';

export default function AdminLayout({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { auth } = usePage<PageProps>().props;

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-72">
        <Header onMenuClick={() => setSidebarOpen(true)} user={auth.user} />
        
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
