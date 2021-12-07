<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $hash = md5(strtolower('developertritek@gmail.com'));
        $user = User::create([
            'name' => 'Admin',
            'username' => 'superadmin',
            'avatar' => 'https://www.gravatar.com/avatar/'.$hash,
            'email' => 'developertritek@gmail.com',
            'password' => Hash::make('Tritek@2021'),
            'approved_at' =>Carbon::now()->format('Y-m-d H:i:s'),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        $user->markEmailAsVerified();

        $user->assignRole('super-admin');

        $user->profile()->create([
            'firstname' => 'Admin',
            'lastname' => 'Super',
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
    'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
    }
}