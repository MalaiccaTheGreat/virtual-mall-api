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
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}