<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            [
                'name' => 'Admin', 
                'email' => 'admin@jaktgi.com',
                'password' => Hash::make('admin123'), 
                'admin' => true
            ],
            [
                'name' => 'User', 
                'email' => 'user@jaktgi.com',
                'password' => Hash::make('user123'), 
                'admin' => false
            ],
        ];

        foreach ($datas as $data) {
            User::create($data);
        }
    }
}
