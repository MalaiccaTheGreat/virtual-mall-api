import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import AdminLayout from '@/Layouts/AdminLayout';
import { ProductForm } from '@/Components/Admin/ProductForm';

type Storefront = {
  id: number;
  name: string;
};

type Image = {
  id: number;
  url: string;
  is_primary: boolean;
};

type Variation = {
  id: number;
  color: string;
  size: string;
  material: string | null;
  style: string | null;
  price: number;
  sale_price: number | null;
  stock_quantity: number;
  sku: string;
  barcode: string | null;
  is_default: boolean;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  sale_price: number | null;
  sku: string;
  barcode: string | null;
  is_featured: boolean;
  is_active: boolean;
  storefront_id: number | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  created_at: string;
  updated_at: string;
  images: Image[];
  variations: Variation[];
};

type Props = {
  product: Product;
  storefronts: Storefront[];
  categories: string[];
};

export default function EditProduct({ product, storefronts, categories }: Props) {
  const { auth } = usePage<PageProps>().props;

  return (
    <AdminLayout>
      <Head title={`Edit ${product.name}`} />
      
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit Product: {product.name}
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Update the product details below.
            </p>
          </div>
        </div>
        
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <ProductForm 
              product={product}
              storefronts={storefronts}
              categories={categories}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
