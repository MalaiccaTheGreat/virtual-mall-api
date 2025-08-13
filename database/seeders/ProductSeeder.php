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
<<<<<<< HEAD
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
=======
                'price_kwacha' => 350,
                'price_usd' => 14.58, // Assuming 1 USD = 24 ZMW
                'image_path' => 'Crochet_Dress.jpg',
                'category' => 'Dresses'
            ],
            [
                'name' => 'Crochet Shirt Unisex',
                'price_kwacha' => 350,
                'price_usd' => 14.58,
                'image_path' => 'Crochet_shirt_unisex.jpg',
                'category' => 'Shirts'
            ],
            [
                'name' => 'Crocs Black',
                'price_kwacha' => 200,
                'price_usd' => 8.33,
                'image_path' => 'Crocs_black.jpg',
                'category' => 'Shoes'
            ],
            [
                'name' => 'Crocs Brown',
                'price_kwacha' => 200,
                'price_usd' => 8.33,
                'image_path' => 'Crocs_Brown.jpg',
                'category' => 'Shoes'
            ],
            [
                'name' => 'Malak Tshirts White',
                'price_kwacha' => 300,
                'price_usd' => 12.50,
                'image_path' => 'Malak_tshirts(white).jpg',
                'category' => 'T-shirts'
            ],
            [
                'name' => 'Malak Tshirts',
                'price_kwacha' => 300,
                'price_usd' => 12.50,
                'image_path' => 'Malak_Tshirts.jpg',
                'category' => 'T-shirts'
            ],
            [
                'name' => 'Mario Alborino Nike Shoes',
                'price_kwacha' => 1200,
                'price_usd' => 50.00,
                'image_path' => 'Mario_Alborino_Nike_Shoes.jpg',
                'category' => 'Shoes'
            ],
            [
                'name' => 'New Balance Shoes',
                'price_kwacha' => 800,
                'price_usd' => 33.33,
                'image_path' => 'New_Balance_Shoes.jpg',
                'category' => 'Shoes'
            ],
            [
                'name' => 'Sweat Pants',
                'price_kwacha' => 250,
                'price_usd' => 10.42,
                'image_path' => 'Sweat_pants.jpg',
                'category' => 'Pants'
>>>>>>> 45a42bb6b8f003179c57eadf18b2f7ae496b5430
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}