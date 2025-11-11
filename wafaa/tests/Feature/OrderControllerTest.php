<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_create_order()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/orders', [
            'total_price' => 50,
            'status' => 'pending',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', ['status' => 'pending']);
    }

    /** @test */
    public function admin_can_update_order_status()
    {
        $admin = User::factory()->create();
        $admin->attachRole('admin');

        $order = Order::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($admin)->patch("/orders/{$order->id}/status", [
            'status' => 'completed',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', ['status' => 'completed']);
    }
}
