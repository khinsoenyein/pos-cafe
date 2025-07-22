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
            // For this example, attach all products to each shop with unique prices/stock
            foreach ($products as $product) {
                $shop->products()->attach($product->id, [
                    'price' => rand(200, 1000),               // random price from \$2 - \$10
                    'stock' => rand(10, 50),              // random stock per shop
                ]);
            }
        }
    }
}