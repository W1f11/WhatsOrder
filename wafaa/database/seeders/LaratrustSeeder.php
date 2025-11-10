<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use App\Models\User;
use Laratrust\Models\Role;
use Laratrust\Models\Permission;

class LaratrustSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       
        //Création des permissions
        $permissions = [
            'manager-users', // Gérer les utilisateurs
            'create-menu', 'read-menu', 'update-menu', 'delete-menu', //Gestion du menu
            'view-orders', 'update-order-status', //Gestion des commandes
            'view-reservations', 'update-reservation-status',  //Gestion des reservations
            'view-menu', 'place-order', 'make-reservation'   // Les action d'un client

        ];

        foreach ($permissions as $permission){
            Permission::firstOrCreate(['name' => $permission]);
        }
        // créer role admin
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'display_name' => 'admin',
        ]);

        // créer role Manager
        $managerRole = Role::firstOrCreate([
            'name' => 'manager',
            'display_name' => 'manager',
        ]);

        // créer role client
        $clientRole = Role::firstOrCreate([
            'name' => 'client',
            'display_name' => 'client',
        ]);


        // Attribution les permissions aux rôles
    // Admin a toute les permissions (éviter les doublons avec syncWithoutDetaching)
    $adminRole->permissions()->syncWithoutDetaching(Permission::pluck('id')->toArray());

        // Manager : menu + commandes + réservations
        $managerPermissions = Permission::whereIn('name', [
            'create-menu','read-menu','update-menu','delete-menu',
            'view-orders','update-order-status',
            'view-reservations','update-reservation-status'
        ])->get();
    $managerRole->permissions()->syncWithoutDetaching($managerPermissions->pluck('id')->toArray());

        // Client : voir le menu, passer la commande, faire une réservation

        $clientPermissions = Permission::whereIn('name', [
            'view-menu','place-order','make-reservation',
        ])->get();
    $clientRole->permissions()->syncWithoutDetaching($clientPermissions->pluck('id')->toArray());


        // Création des utilisateurs de test
        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
        ]);
        $admin->addRole($adminRole);

        $manager = User::factory()->create([
            'name' => 'Manager',
            'email' => 'manager@gmail.com',
        ]);

        $manager->addRole($managerRole);

        $client = User::factory()->create([
            'name' => 'Client',
            'email' => 'client@gmail.com',
        ]);
        $client->addRole($clientRole);
    }
}