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
    $this->command->info('Admin role created (or existing) with id: ' . $adminRole->id);

        // Manager : menu + commandes + réservations
        $managerPermissions = Permission::whereIn('name', [
            'create-menu','read-menu','update-menu','delete-menu',
            'view-orders','update-order-status',
            'view-reservations','update-reservation-status'
        ])->get();
    $managerRole->permissions()->syncWithoutDetaching($managerPermissions->pluck('id')->toArray());
    $this->command->info('Manager role created (or existing) with id: ' . $managerRole->id);

        // Client : voir le menu, passer la commande, faire une réservation

        $clientPermissions = Permission::whereIn('name', [
            'view-menu','place-order','make-reservation',
        ])->get();
    $clientRole->permissions()->syncWithoutDetaching($clientPermissions->pluck('id')->toArray());
    $this->command->info('Client role created (or existing) with id: ' . $clientRole->id);


        // Création des utilisateurs de test (évite les doublons avec firstOrCreate)
        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'email_verified_at' => now(),
                'password' => bcrypt('wafaaessalhi'),
            ]
        );
        // Attach role idempotently and log (avoid duplicate pivot entries)
        $admin->syncRolesWithoutDetaching([$adminRole->id]);
        $this->command->info('Assigned admin role to user: ' . $admin->email);

        $manager = User::firstOrCreate(
            ['email' => 'manager@gmail.com'],
            [
                'name' => 'Manager',
                'email_verified_at' => now(),
                'password' => bcrypt('wafaaessalhi'),
            ]
        );
        // Attach role idempotently and log (avoid duplicate pivot entries)
        $manager->syncRolesWithoutDetaching([$managerRole->id]);
        $this->command->info('Assigned manager role to user: ' . $manager->email);

        $client = User::firstOrCreate(
            ['email' => 'client@gmail.com'],
            [
                'name' => 'Client',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
            ]
        );
        // Attach role idempotently and log (avoid duplicate pivot entries)
        $client->syncRolesWithoutDetaching([$clientRole->id]);
        $this->command->info('Assigned client role to user: ' . $client->email);
    }
}