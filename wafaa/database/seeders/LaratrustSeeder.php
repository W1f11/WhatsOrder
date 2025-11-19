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


        // Création des utilisateurs de test (évite les doublons avec firstOrCreate)
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'email_verified_at' => now(),
                'password' => bcrypt('wafaaessalhi'),
            ]
        );
        $admin->syncRolesWithoutDetaching([$adminRole->id]);

        $manager = User::firstOrCreate(
            ['email' => 'manager@gmail.com'],
            [
                'name' => 'Manager',
                'email_verified_at' => now(),
                'password' => bcrypt('wafaaessalhi'),
            ]
        );
        $manager->syncRolesWithoutDetaching([$managerRole->id]);

        $client = User::firstOrCreate(
            ['email' => 'client@gmail.com'],
            [
                'name' => 'Client',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
            ]
        );
        $client->syncRolesWithoutDetaching([$clientRole->id]);
    }
}