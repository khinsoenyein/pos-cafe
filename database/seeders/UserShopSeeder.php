<?php

namespace Database\Seeders;

use App\Models\UserShop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shops = [
            ['user_id' => 1, 'shop_id' => '1'],
            ['user_id' => 1, 'shop_id' => '2'],
            ['user_id' => 1, 'shop_id' => '3'],
            ['user_id' => 1, 'shop_id' => '4'],
            ['user_id' => 2, 'shop_id' => '2'],
        ];

        foreach ($shops as $shop) {
            UserShop::create($shop);
        }
    }
}
