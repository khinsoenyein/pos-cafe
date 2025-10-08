<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
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
        $main = Shop::where('code', 'MNO')->first()->id;
        $shop1 = Shop::where('code', 'SP1')->first()->id;
        $shop2 = Shop::where('code', 'SP2')->first()->id;
        $shop3 = Shop::where('code', 'SP3')->first()->id;

        $user_admin = User::where('email', 'admin@jaktgi.com')->first()->id;
        $user_info = User::where('email', 'info@jaktgi.com')->first()->id;
        $user_theo = User::where('email', 'theo@jaktgi.com')->first()->id;
        $user_shop1 = User::where('email', 'jak.shop1@jaktgi.com')->first()->id;
        $user_shop2 = User::where('email', 'jak.shop2@jaktgi.com')->first()->id;
        $user_shop3 = User::where('email', 'jak.shop3@jaktgi.com')->first()->id;

        $shops = [
            ['user_id' => $user_admin, 'shop_id' => $main],
            ['user_id' => $user_admin, 'shop_id' => $shop1],
            ['user_id' => $user_admin, 'shop_id' => $shop2],
            ['user_id' => $user_admin, 'shop_id' => $shop3],
            
            ['user_id' => $user_info, 'shop_id' => $main],
            ['user_id' => $user_info, 'shop_id' => $shop1],
            ['user_id' => $user_info, 'shop_id' => $shop2],
            ['user_id' => $user_info, 'shop_id' => $shop3],
            
            ['user_id' => $user_theo, 'shop_id' => $main],
            ['user_id' => $user_theo, 'shop_id' => $shop1],
            ['user_id' => $user_theo, 'shop_id' => $shop2],
            ['user_id' => $user_theo, 'shop_id' => $shop3],
            
            ['user_id' => $user_shop1, 'shop_id' => $shop1],
            ['user_id' => $user_shop2, 'shop_id' => $shop2],
            ['user_id' => $user_shop3, 'shop_id' => $shop3],
        ];

        foreach ($shops as $shop) {
            UserShop::create($shop);
        }
    }
}
