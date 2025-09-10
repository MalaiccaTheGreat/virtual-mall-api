<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\Storefront;
use App\Models\PriceHistory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run()
    {
        // Get all storefronts
        $storefronts = Storefront::all();
        
        if ($storefronts->isEmpty()) {
            $this->command->warn('No storefronts found. Please run the StorefrontSeeder first.');
            return;
        }
        
        // Disable model events to prevent triggering unnecessary events during seeding
        Product::flushEventListeners();
        ProductVariation::flushEventListeners();

        // Start a database transaction
        DB::beginTransaction();

        try {
            foreach ($storefronts as $storefront) {
                $this->command->info("Seeding products for storefront: {$storefront->name}");
                
                switch (strtolower($storefront->name)) {
                    case 'fashion hub':
                        $this->createFashionProducts($storefront);
                        break;
                    case 'tech gadgets':
                        $this->createTechProducts($storefront);
                        break;
                    case 'home & living':
                        $this->createHomeProducts($storefront);
                        break;
                    default:
                        // For any other storefronts, create a basic set of products
                        $this->createBasicProducts($storefront);
                        break;
                }
            }

            // Commit the transaction
            DB::commit();
            $this->command->info('Products and variations seeded successfully!');
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();
            $this->command->error('Error seeding products: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Create fashion products for the Fashion Hub storefront.
     */
    protected function createFashionProducts(Storefront $storefront)
    {
        $products = [
            [
                'name' => 'Crochet Dress',
                'price_kwacha' => 350,
                'price_usd' => 14.58,
                'image_path' => '/images/Crochet_Dress.jpg',
                'category' => 'women',
                'is_virtual_try_on_enabled' => true,
                'virtual_try_on_settings' => json_encode(['model_path' => '/models/crochet_dress.glb']),
                'attributes' => json_encode([
                    'sizes' => ['S', 'M', 'L'],
                    'colors' => ['White', 'Beige']
                ]),
                'description' => 'Beautiful crochet dress perfect for summer days. Made with high-quality cotton yarn for maximum comfort.',
                'is_featured' => true,
                'is_active' => true,
                'seo_title' => 'Crochet Dress - Summer Fashion | ' . $storefront->name,
                'seo_description' => 'Discover our beautiful crochet dress collection. Perfect for summer days and special occasions.',
                'seo_keywords' => 'crochet dress, summer dress, women fashion, cotton dress',
                'slug' => 'crochet-dress',
            ],
            [
                'name' => 'Crochet Shirt Unisex',
                'price_kwacha' => 350,
                'price_usd' => 14.58,
                'image_path' => '/images/Crochet_shirt_unisex.jpg',
                'category' => 'unisex',
                'is_virtual_try_on_enabled' => true,
                'virtual_try_on_settings' => json_encode(['model_path' => '/models/crochet_shirt.glb']),
                'attributes' => json_encode([
                    'sizes' => ['S', 'M', 'L', 'XL'],
                    'colors' => ['White', 'Black']
                ]),
                'description' => 'Versatile crochet shirt that works for any gender. Perfect for layering or wearing on its own.',
                'is_featured' => true,
                'is_active' => true,
                'seo_title' => 'Unisex Crochet Shirt | ' . $storefront->name,
                'seo_description' => 'A versatile crochet shirt perfect for any wardrobe. Available in multiple sizes and colors.',
                'seo_keywords' => 'crochet shirt, unisex top, summer fashion, crochet top',
                'slug' => 'crochet-shirt-unisex',
            ],
            [
                'name' => 'Crocs Black',
                'price_kwacha' => 200,
                'price_usd' => 8.33,
                'sale_price_kwacha' => 180,
                'sale_price_usd' => 7.50,
                'image_path' => '/images/Crocs_black.jpg',
                'category' => 'unisex',
                'clothing_category' => 'shoes',
                'is_try_on_enabled' => true,
                'try_on_model_path' => '/models/crocs.glb',
                'available_sizes' => ['6', '7', '8', '9', '10', '11'],
                'color_variants' => ['Black'],
                'description' => 'Classic black Crocs for ultimate comfort. Perfect for casual outings and outdoor activities.',
                'is_featured' => false,
                'is_active' => true,
                'seo_title' => 'Black Crocs | Comfortable Footwear | ' . $storefront->name,
                'seo_description' => 'Classic black Crocs for men and women. Lightweight and comfortable for all-day wear.',
                'seo_keywords' => 'crocs, black crocs, comfortable shoes, unisex footwear',
                'slug' => 'crocs-black',
            ],
            [
                'name' => 'Crocs Brown',
                'price_kwacha' => 200,
                'price_usd' => 8.33,
                'image_path' => '/images/Crocs_Brown.jpg',
                'category' => 'unisex',
                'clothing_category' => 'shoes',
                'is_try_on_enabled' => true,
                'try_on_model_path' => '/models/crocs.glb',
                'available_sizes' => ['6', '7', '8', '9', '10', '11'],
                'color_variants' => ['Brown'],
                'description' => 'Warm brown Crocs for a natural look. Durable and comfortable for everyday wear.',
                'is_featured' => false,
                'is_active' => true,
                'seo_title' => 'Brown Crocs | Casual Comfort | ' . $storefront->name,
                'seo_description' => 'Brown Crocs in various sizes. Perfect for casual outings and outdoor activities.',
                'seo_keywords' => 'brown crocs, comfortable shoes, casual footwear, unisex crocs',
                'slug' => 'crocs-brown',
            ],
            [
                'name' => 'Malak Tshirts White',
                'price_kwacha' => 300,
                'price_usd' => 12.50,
                'image_path' => '/images/Malak_tshirts(white).jpg',
                'category' => 'men',
                'is_virtual_try_on_enabled' => true,
                'virtual_try_on_settings' => json_encode(['model_path' => '/models/tshirt.glb']),
                'attributes' => json_encode([
                    'sizes' => ['S', 'M', 'L', 'XL'],
                    'colors' => ['White']
                ]),
                'description' => 'Classic white t-shirt from Malak. Comfortable and versatile for everyday wear.',
                'is_featured' => false,
                'is_active' => true,
                'seo_title' => 'Malak White T-Shirt | ' . $storefront->name,
                'seo_description' => 'Classic white t-shirt for men. Perfect for casual wear and layering.',
                'seo_keywords' => 'malak, t-shirt, white, men, casual',
                'slug' => 'malak-tshirt-white',
            ],
            [
                'name' => 'Malak Tshirts',
                'price_kwacha' => 300,
                'price_usd' => 12.50,
                'image_path' => '/images/Malak_Tshirts.jpg',
                'category' => 'men',
                'is_virtual_try_on_enabled' => true,
                'virtual_try_on_settings' => json_encode(['model_path' => '/models/tshirt.glb']),
                'attributes' => json_encode([
                    'sizes' => ['S', 'M', 'L', 'XL'],
                    'colors' => ['Black', 'Gray']
                ]),
                'description' => 'Classic t-shirts from Malak in various colors. Comfortable and versatile for everyday wear.',
                'is_featured' => false,
                'is_active' => true,
                'seo_title' => 'Malak T-Shirts | ' . $storefront->name,
                'seo_description' => 'Classic t-shirts for men in various colors. Perfect for casual wear and layering.',
                'seo_keywords' => 'malak, t-shirts, men, casual, black, gray',
                'slug' => 'malak-tshirts',
            ],
            [
                'name' => 'Mario Alborino Nike Shoes',
                'price_kwacha' => 1200,
                'price_usd' => 50.00,
                'image_path' => '/images/Mario_Alborino_Nike_Shoes.jpg',
                'category' => 'men',
                'is_virtual_try_on_enabled' => false,
                'attributes' => json_encode([
                    'sizes' => ['8', '9', '10', '11', '12'],
                    'colors' => ['Red/Black']
                ]),
                'description' => 'Stylish Nike shoes by Mario Alborino. High-performance athletic shoes for men.',
                'is_featured' => true,
                'is_active' => true,
                'seo_title' => 'Mario Alborino Nike Shoes | ' . $storefront->name,
                'seo_description' => 'High-performance Nike shoes for men. Stylish and comfortable for athletic activities.',
                'seo_keywords' => 'nike, shoes, mario alborino, athletic, men',
                'slug' => 'mario-alborino-nike-shoes',
            ],
            [
                'name' => 'New Balance Shoes',
                'price_kwacha' => 800,
                'price_usd' => 33.33,
                'image_path' => '/images/New_Balance_Shoes.jpg',
                'category' => 'unisex',
                'is_virtual_try_on_enabled' => true,
                'virtual_try_on_settings' => json_encode(['model_path' => '/models/new_balance.glb']),
                'attributes' => json_encode([
                    'sizes' => ['8', '9', '10', '11'],
                    'colors' => ['Gray/White']
                ]),
                'description' => 'Comfortable New Balance shoes for men and women. Perfect for running and casual wear.',
                'is_featured' => true,
                'is_active' => true,
                'seo_title' => 'New Balance Shoes | ' . $storefront->name,
                'seo_description' => 'Comfortable New Balance shoes for men and women. Perfect for running and casual wear.',
                'seo_keywords' => 'new balance, shoes, running, unisex, gray',
                'slug' => 'new-balance-shoes',
            ],
            [
                'name' => 'Sweat Pants',
                'price_kwacha' => 250,
                'price_usd' => 10.42,
                'sale_price_kwacha' => 215,
                'sale_price_usd' => 8.99,
                'image_path' => '/images/Sweat_pants.jpg',
                'category' => 'unisex',
                'is_virtual_try_on_enabled' => true,
                'virtual_try_on_settings' => json_encode(['model_path' => '/models/sweatpants.glb']),
                'attributes' => json_encode([
                    'sizes' => ['S', 'M', 'L', 'XL'],
                    'colors' => ['Black', 'Gray']
                ]),
                'description' => 'Comfortable sweatpants for lounging or workouts. Made with soft, breathable fabric.',
                'is_featured' => true,
                'is_active' => true,
                'seo_title' => 'Comfortable Sweatpants | ' . $storefront->name,
                'seo_description' => 'Soft and comfortable sweatpants for men and women. Perfect for lounging or workouts.',
                'seo_keywords' => 'sweatpants, lounge pants, workout pants, comfortable pants',
                'slug' => 'sweat-pants',
            ],
        ];

        foreach ($products as $productData) {
            $this->createProductWithVariations($storefront, $productData);
        }
    }

    /**
     * Create tech products for the Tech Gadgets storefront.
     */
    protected function createTechProducts(Storefront $storefront)
    {
        $products = [
            [
                'name' => 'Wireless Earbuds Pro',
                'price_kwacha' => 3119.76, // 129.99 * 24
                'price_usd' => 129.99,
                'sale_price_kwacha' => 2399.76, // 99.99 * 24
                'sale_price_usd' => 99.99,
                'image_path' => '/images/tech/earbuds_pro.jpg',
                'category' => 'audio',
                'description' => 'Premium wireless earbuds with active noise cancellation and 24-hour battery life.',
                'is_featured' => true,
                'is_active' => true,
                'seo_title' => 'Wireless Earbuds Pro | ' . $storefront->name,
                'seo_description' => 'Experience crystal clear sound with our premium wireless earbuds.',
                'seo_keywords' => 'wireless earbuds, bluetooth earbuds, noise cancellation, audio',
                'slug' => 'wireless-earbuds-pro',
                'variations' => [
                    [
                        'color' => 'Black',
                        'price_usd' => 129.99,
                        'price_kwacha' => 3119.76,
                        'sale_price_usd' => 99.99,
                        'sale_price_kwacha' => 2399.76,
                        'stock_quantity' => 50,
                        'sku' => 'WEBP-BLK',
                        'barcode' => '123456789012',
                        'is_default' => true,
                    ],
                    [
                        'color' => 'White',
                        'price_usd' => 129.99,
                        'price_kwacha' => 3119.76,
                        'sale_price_usd' => 99.99,
                        'sale_price_kwacha' => 2399.76,
                        'stock_quantity' => 30,
                        'sku' => 'WEBP-WHT',
                        'barcode' => '123456789029',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'name' => 'Smart Watch 5',
                'price_kwacha' => 5999.76, // 249.99 * 24
                'price_usd' => 249.99,
                'image_path' => '/images/tech/smart_watch_5.jpg',
                'category' => 'wearables',
                'description' => 'Advanced smartwatch with health monitoring and 7-day battery life.',
                'is_featured' => true,
                'is_active' => true,
                'seo_title' => 'Smart Watch 5 | ' . $storefront->name,
                'seo_description' => 'Stay connected and track your health with our advanced smartwatch.',
                'seo_keywords' => 'smartwatch, fitness tracker, health monitoring, wearables',
                'slug' => 'smart-watch-5',
                'variations' => [
                    [
                        'color' => 'Black',
                        'material' => 'Silicone',
                        'price_usd' => 249.99,
                        'price_kwacha' => 5999.76, // 249.99 * 24
                        'stock_quantity' => 25,
                        'sku' => 'SW5-BLK-SIL',
                        'barcode' => '123456789045',
                        'is_default' => true,
                    ],
                    [
                        'color' => 'Black',
                        'material' => 'Leather',
                        'price_usd' => 279.99,
                        'price_kwacha' => 6719.76, // 279.99 * 24
                        'stock_quantity' => 15,
                        'sku' => 'SW5-BLK-LTH',
                        'barcode' => '123456789052',
                        'is_default' => false,
                    ],
                ],
            ],
        ];

        foreach ($products as $productData) {
            $this->createProductWithVariations($storefront, $productData);
        }
    }

    /**
     * Create home products for the Home & Living storefront.
     */
    protected function createHomeProducts(Storefront $storefront)
    {
        $products = [
            [
                'name' => 'Ceramic Table Lamp',
                'price_kwacha' => 1103.76, // 45.99 * 24
                'price_usd' => 45.99,
                'sale_price_kwacha' => 959.76, // 39.99 * 24
                'sale_price_usd' => 39.99,
                'image_path' => '/images/home/ceramic_lamp.jpg',
                'category' => 'lighting',
                'description' => 'Elegant ceramic table lamp with fabric shade. Perfect for bedside or living room.',
                'is_featured' => true,
                'is_active' => true,
                'seo_title' => 'Ceramic Table Lamp | ' . $storefront->name,
                'seo_description' => 'Add a touch of elegance to your home with our ceramic table lamp.',
                'seo_keywords' => 'table lamp, ceramic lamp, home decor, lighting',
                'slug' => 'ceramic-table-lamp',
                'variations' => [
                    [
                        'color' => 'White',
                        'style' => 'Modern',
                        'price_usd' => 45.99,
                        'price_kwacha' => 1103.76,
                        'sale_price_usd' => 39.99,
                        'sale_price_kwacha' => 959.76,
                        'stock_quantity' => 20,
                        'sku' => 'CTL-WHT-MOD',
                        'barcode' => '123456789106',
                        'is_default' => true,
                    ],
                    [
                        'color' => 'Blue',
                        'style' => 'Modern',
                        'price_usd' => 45.99,
                        'price_kwacha' => 1103.76,
                        'sale_price_usd' => 39.99,
                        'sale_price_kwacha' => 959.76,
                        'stock_quantity' => 15,
                        'sku' => 'CTL-BLU-MOD',
                        'barcode' => '123456789113',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'name' => 'Throw Pillow Set',
                'price_kwacha' => 839.76, // 34.99 * 24
                'price_usd' => 34.99,
                'image_path' => '/images/home/throw_pillows.jpg',
                'category' => 'decor',
                'description' => 'Set of 2 decorative throw pillows with removable covers.',
                'is_featured' => true,
                'is_active' => true,
                'seo_title' => 'Throw Pillow Set | ' . $storefront->name,
                'seo_description' => 'Enhance your living space with our comfortable throw pillow set.',
                'seo_keywords' => 'throw pillows, home decor, cushion covers, living room',
                'slug' => 'throw-pillow-set',
                'variations' => [
                    [
                        'color' => 'Gray',
                        'material' => 'Linen',
                        'price_usd' => 34.99,
                        'price_kwacha' => 839.76,
                        'stock_quantity' => 30,
                        'sku' => 'TPS-GRY-LIN',
                        'barcode' => '123456789120',
                        'is_default' => true,
                    ],
                    [
                        'color' => 'Navy',
                        'material' => 'Cotton',
                        'price_usd' => 34.99,
                        'price_kwacha' => 839.76,
                        'stock_quantity' => 25,
                        'sku' => 'TPS-NAV-COT',
                        'barcode' => '123456789137',
                        'is_default' => false,
                    ],
                ],
            ],
        ];

        foreach ($products as $productData) {
            $this->createProductWithVariations($storefront, $productData);
        }
    }

    /**
     * Create a product with its variations.
     */
    protected function createProductWithVariations(Storefront $storefront, array $productData)
    {
        // Extract variations if they exist
        $variations = $productData['variations'] ?? [];
        $imagePath = $productData['image_path'] ?? null;
        
        // Define valid product fields that exist in the database
        $validFields = [
            'name', 'description', 'price_kwacha', 'price_usd', 'sale_price_kwacha', 'sale_price_usd',
            'category', 'is_featured', 'is_active', 'seo_title', 'seo_description', 'seo_keywords',
            'slug', 'storefront_id', 'is_virtual_try_on_enabled', 'virtual_try_on_settings', 'attributes'
        ];
        
        // Filter out any fields that don't exist in the database
        $productData = array_intersect_key($productData, array_flip($validFields));
        
        // Remove fields that shouldn't go directly into the product
        unset($productData['variations'], $productData['image_path']);
        
        // Set the storefront ID
        $productData['storefront_id'] = $storefront->id;
        
        // Create the product
        $product = Product::create($productData);
        
        // Add media if image path exists
        if ($imagePath) {
            try {
                // This assumes the image exists in the public directory
                $product->addMedia(public_path($imagePath))
                    ->preservingOriginal()
                    ->toMediaCollection('products');
            } catch (\Exception $e) {
                $this->command->warn("Failed to add media for product {$product->name}: " . $e->getMessage());
            }
        }
        
        // Create variations if they exist
        if (!empty($variations)) {
            foreach ($variations as $variationData) {
                // Map the variation data to match the database schema
                $variation = [
                    'product_id' => $product->id,
                    'color' => $variationData['color'] ?? null,
                    'size' => $variationData['size'] ?? null,
                    'material' => $variationData['material'] ?? null,
                    'style' => $variationData['style'] ?? null,
                    'price' => $variationData['price_usd'] ?? $product->price_usd,
                    'sale_price' => $variationData['sale_price_usd'] ?? $product->sale_price_usd,
                    'stock_quantity' => $variationData['stock_quantity'] ?? 0,
                    'sku' => $variationData['sku'] ?? null,
                    'barcode' => $variationData['barcode'] ?? null,
                    'is_default' => $variationData['is_default'] ?? false,
                ];
                
                // If image_url is provided, use it; otherwise, use the product's image_path
                if (isset($variationData['image_url'])) {
                    $variation['image_url'] = $variationData['image_url'];
                }
                
                $variation = ProductVariation::create($variation);
                
                // Log price history for the variation
                if (isset($variationData['price_usd'])) {
                    PriceHistory::logPriceChange(
                        $variation,
                        $variationData['price_usd'],
                        $variationData['sale_price_usd'] ?? null,
                        'Initial price',
                        $storefront->owner_id
                    );
                }
            }
        } else {
            // Log price history for the base product if no variations
            PriceHistory::logPriceChange(
                $product,
                $product->price_usd,
                $product->sale_price_usd ?? null,
                'Initial price',
                $storefront->owner_id
            );
        }
        
        return $product;
    }
    
    /**
     * Create basic products for any additional storefronts
     */
    protected function createBasicProducts(Storefront $storefront)
    {
        $products = [
            [
                'name' => 'Premium ' . $storefront->name . ' Product',
                'price_kwacha' => 2399.76, // 99.99 * 24
                'price_usd' => 99.99,
                'sale_price_kwacha' => 1919.76, // 79.99 * 24
                'sale_price_usd' => 79.99,
                'image_path' => '/images/default/product.jpg',
                'category' => 'general',
                'description' => 'A premium product from ' . $storefront->name . '. High quality and built to last.',
                'is_featured' => true,
                'is_active' => true,
                'seo_title' => 'Premium Product | ' . $storefront->name,
                'seo_description' => 'Discover our premium product offering from ' . $storefront->name,
                'seo_keywords' => 'premium, product, ' . strtolower($storefront->name),
                'slug' => 'premium-' . strtolower(str_replace(' ', '-', $storefront->name)) . '-product',
                'variations' => [
                    [
                        'color' => 'Black',
                        'price_usd' => 99.99,
                        'price_kwacha' => 2399.76,
                        'sale_price_usd' => 79.99,
                        'sale_price_kwacha' => 1919.76,
                        'stock_quantity' => 50,
                        'sku' => 'PP-' . strtoupper(substr($storefront->name, 0, 3)) . '-BLK',
                        'barcode' => '9' . str_pad($storefront->id, 4, '0', STR_PAD_LEFT) . '001',
                        'is_default' => true,
                    ],
                    [
                        'color' => 'White',
                        'price_usd' => 99.99,
                        'price_kwacha' => 2399.76,
                        'sale_price_usd' => 79.99,
                        'sale_price_kwacha' => 1919.76,
                        'stock_quantity' => 30,
                        'sku' => 'PP-' . strtoupper(substr($storefront->name, 0, 3)) . '-WHT',
                        'barcode' => '9' . str_pad($storefront->id, 4, '0', STR_PAD_LEFT) . '002',
                        'is_default' => false,
                    ],
                ],
            ],
            [
                'name' => 'Standard ' . $storefront->name . ' Product',
                'price_kwacha' => 1199.76, // 49.99 * 24
                'price_usd' => 49.99,
                'image_path' => '/images/default/product2.jpg',
                'category' => 'general',
                'description' => 'A standard product from ' . $storefront->name . '. Great value for money.',
                'is_featured' => false,
                'is_active' => true,
                'seo_title' => 'Standard Product | ' . $storefront->name,
                'seo_description' => 'Check out our standard product from ' . $storefront->name,
                'seo_keywords' => 'standard, product, ' . strtolower($storefront->name),
                'slug' => 'standard-' . strtolower(str_replace(' ', '-', $storefront->name)) . '-product',
            ],
        ];

        foreach ($products as $productData) {
            $this->createProductWithVariations($storefront, $productData);
        }
    }
}