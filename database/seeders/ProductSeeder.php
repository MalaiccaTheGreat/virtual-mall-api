<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            [
                'name' => 'Crochet Dress',
                'price' => 14.58,
                'image_path' => '/images/Crochet_Dress.jpg',
                'category' => 'women',
                'clothing_category' => 'full_outfit',
                'is_try_on_enabled' => true,
                'try_on_model_path' => '/models/crochet_dress.glb',
                'available_sizes' => ['S', 'M', 'L'],
                'color_variants' => ['White', 'Beige'],
            ],
            [
                'name' => 'Crochet Shirt Unisex',
                'price' => 14.58,
                'image_path' => '/images/Crochet_shirt_unisex.jpg',
                'category' => 'unisex',
                'clothing_category' => 'top',
                'is_try_on_enabled' => true,
                'try_on_model_path' => '/models/crochet_shirt.glb',
                'available_sizes' => ['S', 'M', 'L', 'XL'],
                'color_variants' => ['White', 'Black'],
            ],
            [
                'name' => 'Crocs Black',
                'price' => 8.33,
                'image_path' => '/images/Crocs_black.jpg',
                'category' => 'unisex',
                'clothing_category' => 'shoes',
                'is_try_on_enabled' => true,
                'try_on_model_path' => '/models/crocs.glb',
                'available_sizes' => ['6', '7', '8', '9', '10', '11'],
                'color_variants' => ['Black'],
            ],
            [
                'name' => 'Crocs Brown',
                'price' => 8.33,
                'image_path' => '/images/Crocs_Brown.jpg',
                'category' => 'unisex',
                'clothing_category' => 'shoes',
                'is_try_on_enabled' => true,
                'try_on__model_path' => '/models/crocs.glb',
                'available_sizes' => ['6', '7', '8', '9', '10', '11'],
                'color_variants' => ['Brown'],
            ],
            [
                'name' => 'Malak Tshirts White',
                'price' => 12.50,
                'image_path' => '/images/Malak_tshirts(white).jpg',
                'category' => 'men',
                'clothing_category' => 'top',
                'is_try_on_enabled' => true,
                'try_on_model_path' => '/models/tshirt.glb',
                'available_sizes' => ['S', 'M', 'L', 'XL'],
                'color_variants' => ['White'],
            ],
            [
                'name' => 'Malak Tshirts',
                'price' => 12.50,
                'image_path' => '/images/Malak_Tshirts.jpg',
                'category' => 'men',
                'clothing_category' => 'top',
                'is_try_on_enabled' => true,
                'try_on_model_path' => '/models/tshirt.glb',
                'available_sizes' => ['S', 'M', 'L', 'XL'],
                'color_variants' => ['Black', 'Gray'],
            ],
            [
                'name' => 'Mario Alborino Nike Shoes',
                'price' => 50.00,
                'image_path' => '/images/Mario_Alborino_Nike_Shoes.jpg',
                'category' => 'men',
                'clothing_category' => 'shoes',
                'is_try_on_enabled' => false,
                'try_on_model_path' => null,
                'available_sizes' => ['8', '9', '10', '11', '12'],
                'color_variants' => ['Red/Black'],
            ],
            [
                'name' => 'New Balance Shoes',
                'price' => 33.33,
                'image_path' => '/images/New_Balance_Shoes.jpg',
                'category' => 'unisex',
                'clothing_category' => 'shoes',
                'is_try_on_enabled' => true,
                'try_on_model_path' => '/models/new_balance.glb',
                'available_sizes' => ['8', '9', '10', '11'],
                'color_variants' => ['Gray/White'],
            ],
            [
                'name' => 'Sweat Pants',
                'price' => 10.42,
                'image_path' => '/images/Sweat_pants.jpg',
                'category' => 'unisex',
                'clothing_category' => 'bottom',
                'is_try_on_enabled' => true,
                'try_on_model_path' => '/models/sweat_pants.glb',
                'available_sizes' => ['S', 'M', 'L', 'XL'],
                'color_variants' => ['Gray', 'Black'],
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}