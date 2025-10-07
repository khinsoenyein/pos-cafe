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
            ['name' => 'Main', 'code' => 'MNO'],
            ['name' => 'Shop 1', 'code' => 'SP1'],
            ['name' => 'Shop 2', 'code' => 'SP2'],
            ['name' => 'Shop 3', 'code' => 'SP3'],
        ];

        foreach ($shops as $shop) {
            Shop::create($shop);
        }
    }
}
