<?php

namespace Database\Seeders;

use App\Models\Shop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shops = [
            ['name' => 'Downtown Store', 'code' => 'DTS'],
            ['name' => 'Uptown Branch', 'code' => 'UTB'],
            ['name' => 'Mall K', 'code' => 'MLK'],
        ];

        foreach ($shops as $shop) {
            Shop::create($shop);
        }
    }
}
