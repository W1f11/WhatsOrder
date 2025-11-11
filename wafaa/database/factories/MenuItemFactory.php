<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\MenuItem;
use App\Models\User; // si restaurant_id est user_id

class MenuItemFactory extends Factory
{
    protected $model = MenuItem::class;

    public function definition()
    {
        return [
            'restaurant_id' => User::factory(), // ou un id fixe pour test
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->randomFloat(2, 5, 50),
            'category' => $this->faker->word(),
            'image_url' => $this->faker->imageUrl(),
            'is_available' => true,
        ];
    }
}
