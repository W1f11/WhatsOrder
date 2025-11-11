<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Order;
use App\Models\User;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'restaurant_id' => User::factory(),
            'total_price' => $this->faker->randomFloat(2, 10, 100),
            'status' => 'pending',
            'note' => $this->faker->sentence(),
        ];
    }
}
