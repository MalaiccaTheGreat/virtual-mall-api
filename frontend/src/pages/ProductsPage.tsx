import { ProductList } from '../components/products/ProductList';

export const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <ProductList />
      </main>
    </div>
  );
};

export default ProductsPage;
