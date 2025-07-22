<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shops = Shop::all();
        $products = Product::all();

        foreach ($shops as $shop) {
            foreach ($products as $product) {
                $pid = rand(1,4);
                if ($product->id > $pid) {
                    $shop->products()->attach($product->id, [
                        'price' => round(rand(2000, 20000), -3),
                        'created_user' => 1
                        // 'stock' => rand(10, 50),
                    ]);
                }
            }
        }
    }
}
