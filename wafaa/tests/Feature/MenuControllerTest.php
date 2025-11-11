<?php

namespace Tests\Feature;


use Tests\TestCase;
use App\Models\User;
use App\Models\MenuItem;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MenuControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function manager_can_create_menu_item(): void
    {
         $manager = User::factory()->create();
        $manager->attachRole('manager'); // Laratrust

        $response = $this->actingAs($manager)->post('/menu', [
            'name' => 'Burger',
            'price' => 12,
            'description' => 'Délicieux burger maison'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('menu_items', ['name' => 'Burger']);
    }

     /** @test */
    public function guest_cannot_create_menu_item()
    {
        $response = $this->post('/menu', [
            'name' => 'Pasta',
            'price' => 9
        ]);

        $response->assertRedirect('/login');
    }
}
