import { useState, useEffect } from 'react';
import { useParams, useNavigate}from 'react-router-dom';
import { StarIcon, HeartIcon, ArrowLeftIcon, ShoppingCartIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { Product, ApiResponse } from '../types';
import { useCart } from '../contexts/CartContext';
import { ProductDetailSkeleton } from '../components/common/Skeleton';
import { ProductGallery } from '../components/products/ProductGallery';
import { RelatedProducts } from '../components/products/RelatedProducts';
import { ARVirtualTryOn } from '../components/ar/ARVirtualTryOn';
import { cn } from '../lib/utils';
import { ARTryOn } from '../components/ar/ARTryOn';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showARTryOn, setShowARTryOn] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'ar'>('gallery');
  const [showFullscreenAR, setShowFullscreenAR] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Validate selection if product has variants
    if ((product.sizes || []).length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }
    
    if ((product.colors || []).length > 0 && !selectedColor) {
      alert('Please select a color');
      return;
    }
    
    setIsAddingToCart(true);
    
    // Simulate API call
    setTimeout(() => {
      addToCart(
        product,
        quantity,
        selectedSize || undefined,
        selectedColor || undefined
      );
      setIsAddingToCart(false);
      
      // Show success message
      alert(`${product.name} has been added to your cart!`);
    }, 300);
  };
  
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };
  
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const productIsInCart = product ? isInCart(product.id) : false;

  // Check if product is eligible for AR try-on
  const isEligibleForARTryOn = product?.category?.toLowerCase().includes('clothing') || 
                              product?.tags?.includes('ar-enabled');

  // Check if product is in sunglasses category (you might need to adjust this based on your category structure)
  const isSunglasses = product?.category?.toLowerCase().includes('sunglasses') || 
                       product?.name?.toLowerCase().includes('sunglass');

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The requested product could not be found.'}</p>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const parseJsonSafely = <T,>(jsonString: string | undefined, defaultValue: T): T => {
    try {
      return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return defaultValue;
    }
  };

  const availableSizes = parseJsonSafely<string[]>(product.available_sizes, []);
  const colorVariants = parseJsonSafely<string[]>(product.color_variants, []);
  const productImages = product.image_path 
    ? [product.image_path]
    : ['/images/placeholder-product.jpg'];

  const features = [
    'High-quality material',
    'Eco-friendly production',
    'Designed for comfort',
    'Easy to maintain',
  ];

  // Fetch related products when product loads
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product?.category) return;
      
      try {
        setLoadingRelated(true);
        const response = await fetch(`/api/products/related/${product.category}`);
        if (response.ok) {
          const data: ApiResponse<Product[]> = await response.json();
          setRelatedProducts(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedProducts();
  }, [product?.category]);

  // AR Try-On Modal
  if (showARTryOn) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <ARVirtualTryOn 
          garmentModelUrl={product?.ar_model_url || '/models/default-tshirt.glb'}
          onClose={() => setShowARTryOn(false)}
          onError={(error) => {
            console.error('AR Error:', error);
            setShowARTryOn(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to products
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Gallery */}
          <div className="md:w-1/2 p-4">
            {isSunglasses && (
              <div className="mb-4 flex border-b border-gray-200">
                <button
                  type="button"
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === 'gallery'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('gallery')}
                >
                  Gallery
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 text-sm font-medium ${
                    activeTab === 'ar'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('ar')}
                >
                  Try It On (AR)
                </button>
              </div>
            )}
            {activeTab === 'gallery' ? (
              <ProductGallery images={productImages} alt={product.name} />
            ) : (
              <div className="relative rounded-lg overflow-hidden bg-gray-100" style={{ height: '500px' }}>
                <ARTryOn />
                <button
                  onClick={() => setShowFullscreenAR(true)}
                  className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 focus:outline-none"
                  aria-label="Expand AR view"
                >
                  <ArrowsPointingOutIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="ml-2 text-sm text-gray-500">
                <a href="#reviews" className="text-blue-600 hover:text-blue-800">
                  24 reviews
                </a>
              </p>
            </div>

            <p className="text-3xl font-bold text-gray-900 mb-6">
              ${product.price?.toFixed(2) || '0.00'}
            </p>

            <p className="text-gray-700 mb-6">{product.description}</p>

            {(product.sizes || []).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeSelect(size)}
                      className={`px-3 py-1 rounded-md border ${
                        selectedSize === size
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(product.colors || []).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors?.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color
                          ? 'border-blue-500 ring-2 ring-offset-1 ring-blue-300'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={color}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center mb-6">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  -
                </button>
                <span className="px-4 py-2 w-12 text-center">{quantity}</span>
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {isEligibleForARTryOn && (
                  <button
                    type="button"
                    onClick={() => setShowARTryOn(true)}
                    className="w-full flex items-center justify-center py-3 px-6 rounded-md font-medium bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <ArrowsPointingOutIcon className="h-5 w-5 mr-2" />
                    Try It On (AR)
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || productIsInCart}
                  className={`w-full flex items-center justify-center py-3 px-6 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    productIsInCart
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : isAddingToCart
                      ? 'bg-blue-400 text-white cursor-wait'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isAddingToCart ? (
                    'Adding...'
                  ) : productIsInCart ? (
                    <>
                      <ShoppingCartIcon className="h-5 w-5 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full flex items-center justify-center bg-white text-gray-700 py-3 px-6 rounded-md border border-gray-300 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <HeartIcon 
                    className={`h-5 w-5 mr-2 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                    aria-hidden="true" 
                  />
                  {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                </button>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900">Features</h3>
                <ul className="mt-4 space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900">Shipping & Returns</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <svg
                      className="h-5 w-5 text-gray-400 flex-shrink-0 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10 2a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8zm0 2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8a2 2 0 012-2zm-2 2v2h8V6H8zm2 4v2h2V8h2v2h-2v2h-2V8h-2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Free shipping on orders over $50</p>
                      <p className="text-sm text-gray-500">Get it by <span className="font-medium">Aug 15 - 20</span> if you order today</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg
                      className="h-5 w-5 text-gray-400 flex-shrink-0 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10 2a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8zm0 2a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8a2 2 0 012-2zm-2 2v2h8V6H8zm2 4v2h2V8h2v2h-2v2h-2V8h-2z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">30-Day Return Guarantee</p>
                      <p className="text-sm text-gray-500">Free returns within 30 days of purchase</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900">Details</h3>
                <div className="mt-4">
                  <dl className="space-y-2 text-sm">
                    <div className="flex">
                      <dt className="w-24 text-gray-500">Category</dt>
                      <dd className="text-gray-900">{product.category}</dd>
                    </div>
                    {product.material && (
                      <div className="flex">
                        <dt className="w-24 text-gray-500">Material</dt>
                        <dd className="text-gray-900">{product.material}</dd>
                      </div>
                    )}
                    {product.sku && (
                      <div className="flex">
                        <dt className="w-24 text-gray-500">SKU</dt>
                        <dd className="text-gray-900">{product.sku}</dd>
                      </div>
                    )}
                    <div className="flex">
                      <dt className="w-24 text-gray-500">Availability</dt>
                      <dd className="text-green-600">In Stock</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts 
        productId={product.id}
        category={product.category}
        limit={4}
      />

      {/* Fullscreen AR Modal */}
      {showFullscreenAR && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowFullscreenAR(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="w-full h-[80vh]">
                  <ARTryOn />
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowFullscreenAR(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
