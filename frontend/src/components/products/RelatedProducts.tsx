import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Spinner } from '../common/Spinner';

interface RelatedProductsProps {
  productId: string | number;
  category: string;
  limit?: number;
}

export const RelatedProducts = ({ productId, category, limit = 4 }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/products?category=${encodeURIComponent(category)}&limit=${limit + 1}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch related products');
        }
        
        const data = await response.json();
        // Filter out the current product from related products
        const filtered = data.data
          .filter((product: Product) => product.id.toString() !== productId.toString())
          .slice(0, limit);
        
        setRelatedProducts(filtered);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('Failed to load related products');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, category, limit]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (error || relatedProducts.length === 0) {
    return null; // Don't show anything if there's an error or no related products
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
