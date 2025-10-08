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
                'password' => Hash::make('Admin123!@#'), 
                'admin' => true
            ],
            [
                'name' => 'JAK-Info', 
                'email' => 'info@jaktgi.com',
                'password' => Hash::make('W5LqNK-K5C%h'), 
                'admin' => true
            ],
            [
                'name' => 'Theo', 
                'email' => 'theo@jaktgi.com',
                'password' => Hash::make('j9@L4[V65Cw('), 
                'admin' => true
            ],
            [
                'name' => 'JAK-Shop1', 
                'email' => 'jak.shop1@jaktgi.com',
                'password' => Hash::make('Ie6TXHpWFn!A'), 
                'admin' => false
            ],
            [
                'name' => 'JAK-Shop2', 
                'email' => 'jak.shop2@jaktgi.com',
                'password' => Hash::make('NW.$=F$boU.Z'), 
                'admin' => false
            ],
            [
                'name' => 'JAK-Shop3', 
                'email' => 'jak.shop3@jaktgi.com',
                'password' => Hash::make('qn8i_f8dxip['), 
                'admin' => false
            ],
        ];

        foreach ($datas as $data) {
            User::create($data);
        }
    }
}
