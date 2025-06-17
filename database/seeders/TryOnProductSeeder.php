
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class TryOnProductSeeder extends Seeder
{
    public function run(): void
    {
        $tryOnProducts = [
            [
                'name' => 'Classic Denim Jacket',
                'price' => 89.99,
                'description' => 'Timeless denim jacket perfect for layering',
                'category' => 'clothing',
                'clothing_category' => 'top',
                'image_path' => '/images/products/denim-jacket.jpg',
                'available_sizes' => ['XS', 'S', 'M', 'L', 'XL'],
                'color_variants' => ['Blue', 'Black', 'White'],
                'is_try_on_enabled' => true
            ],
            [
                'name' => 'High-Waist Skinny Jeans',
                'price' => 79.99,
                'description' => 'Comfortable high-waist skinny jeans',
                'category' => 'clothing',
                'clothing_category' => 'bottom',
                'image_path' => '/images/products/skinny-jeans.jpg',
                'available_sizes' => ['24', '26', '28', '30', '32'],
                'color_variants' => ['Dark Blue', 'Light Blue', 'Black'],
                'is_try_on_enabled' => true
            ],
            [
                'name' => 'Casual Sneakers',
                'price' => 129.99,
                'description' => 'Comfortable everyday sneakers',
                'category' => 'footwear',
                'clothing_category' => 'shoes',
                'image_path' => '/images/products/sneakers.jpg',
                'available_sizes' => ['7', '8', '9', '10', '11', '12'],
                'color_variants' => ['White', 'Black', 'Gray'],
                'is_try_on_enabled' => true
            ],
            [
                'name' => 'Complete Summer Outfit',
                'price' => 199.99,
                'description' => 'Complete summer outfit with top, bottom and accessories',
                'category' => 'clothing',
                'clothing_category' => 'full_outfit',
                'image_path' => '/images/products/summer-outfit.jpg',
                'available_sizes' => ['S', 'M', 'L'],
                'color_variants' => ['Floral', 'Solid', 'Striped'],
                'is_try_on_enabled' => true
            ]
        ];

        foreach ($tryOnProducts as $product) {
            Product::create($product);
        }
    }
}
