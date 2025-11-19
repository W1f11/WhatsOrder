<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Laratrust\Models\Role;

class AssignRolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure roles exist
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $managerRole = Role::firstOrCreate(['name' => 'manager']);
        $clientRole = Role::firstOrCreate(['name' => 'client']);

        // Map specific emails to roles
        $map = [
            'admin@gmail.com' => 'admin',
            'manager@gmail.com' => 'manager',
        ];

        foreach ($map as $email => $roleName) {
            $user = User::where('email', $email)->first();
            $role = Role::where('name', $roleName)->first();
            if ($user && $role) {
                $user->syncRoles([$role->id]);
            }
        }

        // All other users -> client
        $otherUsers = User::whereNotIn('email', array_keys($map))->get();
        foreach ($otherUsers as $u) {
            $u->syncRoles([$clientRole->id]);
        }
    }
}
