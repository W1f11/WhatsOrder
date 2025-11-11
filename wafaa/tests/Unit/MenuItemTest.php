<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MenuItemTest extends TestCase
{

     use RefreshDatabase;
     
    /** @test */
    public function it_can_create_a_menu_item(): void
    {
        $menu = MenuItem::factory()->create([
            "name" => "Pizza Margharita",
            'price' => 10.5
        ]);

        $this->assertDatabaseHas('menu_items', ['name' => 'Pizza Margharita']);
    }
    /** @test */
    public function menu_item_belongs_to_a_restaurant(){
        $menu = MenuItem::factory()->create();
        $this->assertNotNull($menu->restaurant_id);
    }
}
