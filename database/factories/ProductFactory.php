<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
<<<<<<< HEAD
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph,
            'price' => $this->faker->randomFloat(2, 10, 100),
            'image_path' => '/images/placeholder.jpg',
            'try_on_model_path' => '/models/placeholder.glb',
            'is_try_on_enabled' => $this->faker->boolean,
            'category' => $this->faker->randomElement(['men', 'women', 'kids']),
            'clothing_category' => $this->faker->randomElement(['top', 'bottom', 'shoes', 'accessories']),
            'available_sizes' => ['S', 'M', 'L', 'XL'],
            'color_variants' => ['Red', 'Green', 'Blue'],
=======
            //
>>>>>>> 45a42bb6b8f003179c57eadf18b2f7ae496b5430
        ];
    }
}
