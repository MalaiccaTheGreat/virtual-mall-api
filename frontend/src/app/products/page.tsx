'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, addToCart } from '@/lib/api';
import { Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        // Ensure data is an array before setting
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Fetched data is not an array:', data);
          setProducts([]); // Set to empty array on error
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]); // Set to empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add product to cart.');
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg h-fit">
            <h2 className="text-2xl font-bold mb-6 text-[#1B3C73]">
              Filter By
            </h2>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Category
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#FFD700]">
                    T-Shirts
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#FFD700]">
                    Hoodies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#FFD700]">
                    Jeans
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#FFD700]">
                    Jackets
                  </a>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Price Range
              </h3>
              <input type="range" min="0" max="100" className="w-full" />
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Customer Reviews
              </h3>
              <ul className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <li key={rating}>
                    <a
                      href="#"
                      className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < rating ? 'text-[#FFD700]' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2">& Up</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-[#1B3C73]">Results</h1>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Sort by:</span>
                <select className="border border-gray-300 rounded-md p-2">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Avg. Customer Review</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center p-10">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-shadow duration-300 hover:shadow-xl"
                  >
                    <Link
                      href={`/products/${product.id}`}
                      className="block relative h-52"
                    >
                      <Image
                        src={product.image_url || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="p-4 flex flex-col flex-grow">
                      <h2 className="text-md font-medium mb-2 flex-grow">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-gray-800 hover:text-[#1B3C73] hover:underline"
                        >
                          {product.name}
                        </Link>
                      </h2>
                      <div className="flex items-center my-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 4 ? 'text-[#FFD700]' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">
                          (123)
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-4">
                        ${product.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="w-full mt-auto bg-[#FFD700] text-[#1B3C73] font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors duration-300 shadow-sm hover:shadow-md"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
