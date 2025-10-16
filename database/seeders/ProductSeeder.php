<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cup = Unit::where('symbol', 'cup')->first()->id;
        $piece = Unit::where('symbol', 'pc')->first()->id;
        $bag = Unit::where('symbol', 'bag')->first()->id;
        $stick = Unit::where('symbol', 'stick')->first()->id;

        $hot = ProductCategory::where('name', 'Hot Cup')->first()->id;
        $cold = ProductCategory::where('name', 'Cold Cup')->first()->id;
        $other = ProductCategory::where('name', 'Other')->first()->id;

        $products = [
            ['name' => 'JAK Hot', 'sku' => 'JAK', 'unit_id' => $cup, 'description' => '5000', 'product_category_id' => $hot, 'image' => null],
            ['name' => 'Latte', 'sku' => 'LTE', 'unit_id' => $cup, 'description' => '5000', 'product_category_id' => $hot, 'image' => null],
            ['name' => 'Latte (No Sugar)', 'sku' => 'LTENS', 'unit_id' => $cup, 'description' => '5000', 'product_category_id' => $hot, 'image' => null],
            ['name' => 'Mocha', 'sku' => 'MHE', 'unit_id' => $cup, 'description' => '5000', 'product_category_id' => $hot, 'image' => null],
            ['name' => 'Cappuccino', 'sku' => 'CPC', 'unit_id' => $cup, 'description' => '5000', 'product_category_id' => $hot, 'image' => null],
            ['name' => 'Cappuccino (No Sugar)', 'sku' => 'CPCNS', 'unit_id' => $cup, 'description' => '5000', 'product_category_id' => $hot, 'image' => null],
            ['name' => 'Milk Chocolate', 'sku' => 'MKC', 'unit_id' => $cup, 'description' => '5000', 'product_category_id' => $hot, 'image' => null],
            ['name' => 'Green Tea', 'sku' => 'GN', 'unit_id' => $cup, 'description' => '6000', 'product_category_id' => $hot, 'image' => null],
            ['name' => 'Thai Tea', 'sku' => 'TT', 'unit_id' => $cup, 'description' => '6000', 'product_category_id' => $hot, 'image' => null],
            ['name' => 'Americano', 'sku' => 'ARN', 'unit_id' => $cup, 'description' => '5000', 'product_category_id' => $hot, 'image' => null],
            ['name' => 'JAK iced', 'sku' => 'JAKC', 'unit_id' => $cup, 'description' => '6000', 'product_category_id' => $cold, 'image' => null],
            ['name' => 'Latte iced', 'sku' => 'LEI', 'unit_id' => $cup, 'description' => '6000', 'product_category_id' => $cold, 'image' => null],
            ['name' => 'Mocha iced', 'sku' => 'MHA', 'unit_id' => $cup, 'description' => '6000', 'product_category_id' => $cold, 'image' => null],
            ['name' => 'Cappuccino iced', 'sku' => 'CPCI', 'unit_id' => $cup, 'description' => '6000', 'product_category_id' => $cold, 'image' => null],
            ['name' => 'Milk Chocolate iced', 'sku' => 'MKCI', 'unit_id' => $cup, 'description' => '6000', 'product_category_id' => $cold, 'image' => null],
            ['name' => 'Lemon Presso', 'sku' => 'LON', 'unit_id' => $cup, 'description' => '6000', 'product_category_id' => $cold, 'image' => null],
            ['name' => 'Thai Tea iced', 'sku' => 'TTI', 'unit_id' => $cup, 'description' => '7000', 'product_category_id' => $cold, 'image' => null],
            ['name' => 'Green Tea iced', 'sku' => 'GEN', 'unit_id' => $cup, 'description' => '7000', 'product_category_id' => $cold, 'image' => null],
            ['name' => 'Americano iced', 'sku' => 'ARI', 'unit_id' => $cup, 'description' => '6000', 'product_category_id' => $cold, 'image' => null],
            ['name' => 'Passion Presso', 'sku' => 'PSION', 'unit_id' => $cup, 'description' => '6000', 'product_category_id' => $cold, 'image' => null],
            ['name' => 'Matcha', 'sku' => 'MCHA', 'unit_id' => $cup, 'description' => '7000', 'product_category_id' => $cold, 'image' => null],
            ['name' => 'Coffee Powder 120g', 'sku' => 'CFEE', 'unit_id' => $piece, 'description' => '10000', 'product_category_id' => $other, 'image' => null],
            ['name' => 'Coffee Bean 1Kg', 'sku' => 'CBKG', 'unit_id' => $piece, 'description' => '65000', 'product_category_id' => $other, 'image' => null],
            ['name' => 'Noodle', 'sku' => 'NDIES', 'unit_id' => $piece, 'description' => '4000', 'product_category_id' => $other, 'image' => null],
            ['name' => 'Bread', 'sku' => 'BAD', 'unit_id' => $piece, 'description' => '1500', 'product_category_id' => $other, 'image' => null],
            ['name' => 'Water Bottle (Big)', 'sku' => 'WTB', 'unit_id' => $piece, 'description' => '1000', 'product_category_id' => $other, 'image' => null],
            ['name' => 'Water Bottle (Small)', 'sku' => 'WTS', 'unit_id' => $piece, 'description' => '500', 'product_category_id' => $other, 'image' => null],
            ['name' => 'Cigarette', 'sku' => 'CARETTE', 'unit_id' => $stick, 'description' => '500', 'product_category_id' => $other, 'image' => null],
            ['name' => 'Cookie', 'sku' => 'CKE', 'unit_id' => $piece, 'description' => '750', 'product_category_id' => $other, 'image' => null],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
