<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OrderTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_an_order()
    {
        $order = Order::factory()->create([
            'total_price' => 25,
            'status' => 'pending'
        ]);

        $this->assertDatabaseHas('orders', ['status' => 'pending']);
    }
}
