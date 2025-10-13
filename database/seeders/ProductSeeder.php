<?php

namespace Database\Seeders;

use App\Models\Product;
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

        $products = [
            // ['name' => 'Espresso', 'sku' => 'COF001', 'unit_id' => $cup, 'description' => 'Strong black coffee shot', 'remark' => null, 'image' => 'products/Espresso.png'],
            // ['name' => 'Americano', 'sku' => 'COF002', 'unit_id' => $cup, 'description' => 'Espresso with hot water', 'remark' => null, 'image' => 'products/Americano.png'],
            // ['name' => 'Cappuccino', 'sku' => 'COF003', 'unit_id' => $cup, 'description' => 'Espresso, steamed milk & foam', 'remark' => null, 'image' => 'products/Cappuccino.png'],
            // ['name' => 'Latte', 'sku' => 'COF004', 'unit_id' => $cup, 'description' => 'Espresso with steamed milk', 'remark' => null, 'image' => 'products/Latte.png'],
            // ['name' => 'Mocha', 'sku' => 'COF005', 'unit_id' => $cup, 'description' => 'Espresso with chocolate and milk', 'remark' => null, 'image' => 'products/Mocha.png'],
            // ['name' => 'Flat White', 'sku' => 'COF006', 'unit_id' => $cup, 'description' => 'Espresso with thin milk foam', 'remark' => null, 'image' => 'products/Flat_White.png'],
            // ['name' => 'Macchiato', 'sku' => 'COF007', 'unit_id' => $cup, 'description' => 'Espresso with small amount of foam', 'remark' => null, 'image' => 'products/Macchiato.png'],
            // ['name' => 'Iced Coffee', 'sku' => 'COF008', 'unit_id' => $cup, 'description' => 'Chilled coffee over ice', 'remark' => null, 'image' => 'products/Iced_Coffee.png'],
            ['name' => 'JAK Hot', 'sku' => 'JAK', 'unit_id' => $cup, 'description' => '5000', 'remark' => 'Hot Cup', 'image' => null],
            ['name' => 'Latte', 'sku' => 'LTE', 'unit_id' => $cup, 'description' => '5000', 'remark' => 'Hot Cup', 'image' => null],
            ['name' => 'Latte (No Sugar)', 'sku' => 'LTENS', 'unit_id' => $cup, 'description' => '5000', 'remark' => 'Hot Cup', 'image' => null],
            ['name' => 'Mocha', 'sku' => 'MHE', 'unit_id' => $cup, 'description' => '5000', 'remark' => 'Hot Cup', 'image' => null],
            ['name' => 'Cappuccino', 'sku' => 'CPC', 'unit_id' => $cup, 'description' => '5000', 'remark' => 'Hot Cup', 'image' => null],
            ['name' => 'Cappuccino (No Sugar)', 'sku' => 'CPCNS', 'unit_id' => $cup, 'description' => '5000', 'remark' => 'Hot Cup', 'image' => null],
            ['name' => 'Milk Chocolate', 'sku' => 'MKC', 'unit_id' => $cup, 'description' => '5000', 'remark' => 'Hot Cup', 'image' => null],
            ['name' => 'Green Tea', 'sku' => 'GN', 'unit_id' => $cup, 'description' => '6000', 'remark' => 'Hot Cup', 'image' => null],
            ['name' => 'Thai Tea', 'sku' => 'TT', 'unit_id' => $cup, 'description' => '6000', 'remark' => 'Hot Cup', 'image' => null],
            ['name' => 'Americano', 'sku' => 'ARN', 'unit_id' => $cup, 'description' => '5000', 'remark' => 'Hot Cup', 'image' => null],
            ['name' => 'JAK iced', 'sku' => 'JAKC', 'unit_id' => $cup, 'description' => '6000', 'remark' => 'Cold Cup', 'image' => null],
            ['name' => 'Latte iced', 'sku' => 'LEI', 'unit_id' => $cup, 'description' => '6000', 'remark' => 'Cold Cup', 'image' => null],
            ['name' => 'Mocha iced', 'sku' => 'MHA', 'unit_id' => $cup, 'description' => '6000', 'remark' => 'Cold Cup', 'image' => null],
            ['name' => 'Cappuccino iced', 'sku' => 'CPCI', 'unit_id' => $cup, 'description' => '6000', 'remark' => 'Cold Cup', 'image' => null],
            ['name' => 'Milk Chocolate iced', 'sku' => 'MKCI', 'unit_id' => $cup, 'description' => '6000', 'remark' => 'Cold Cup', 'image' => null],
            ['name' => 'Lemon Presso', 'sku' => 'LON', 'unit_id' => $cup, 'description' => '6000', 'remark' => 'Cold Cup', 'image' => null],
            ['name' => 'Thai Tea iced', 'sku' => 'TTI', 'unit_id' => $cup, 'description' => '7000', 'remark' => 'Cold Cup', 'image' => null],
            ['name' => 'Green Tea iced', 'sku' => 'GEN', 'unit_id' => $cup, 'description' => '7000', 'remark' => 'Cold Cup', 'image' => null],
            ['name' => 'Americano iced', 'sku' => 'ARI', 'unit_id' => $cup, 'description' => '6000', 'remark' => 'Cold Cup', 'image' => null],
            ['name' => 'Passion Presso', 'sku' => 'PSION', 'unit_id' => $cup, 'description' => '6000', 'remark' => 'Cold Cup', 'image' => null],
            ['name' => 'Matcha', 'sku' => 'MCHA', 'unit_id' => $cup, 'description' => '7000', 'remark' => 'Cold Cup', 'image' => null],
            ['name' => 'Coffee Powder 120g', 'sku' => 'CFEE', 'unit_id' => $piece, 'description' => '10000', 'remark' => 'Thing', 'image' => null],
            ['name' => 'Coffee Bean 1Kg', 'sku' => 'CBKG', 'unit_id' => $piece, 'description' => '65000', 'remark' => 'Thing', 'image' => null],
            ['name' => 'Noodle', 'sku' => 'NDIES', 'unit_id' => $piece, 'description' => '4000', 'remark' => 'Thing', 'image' => null],
            ['name' => 'Bread', 'sku' => 'BAD', 'unit_id' => $piece, 'description' => '1500', 'remark' => 'Thing', 'image' => null],
            ['name' => 'Water Bottle (Big)', 'sku' => 'WTB', 'unit_id' => $piece, 'description' => '1000', 'remark' => 'Thing', 'image' => null],
            ['name' => 'Water Bottle (Small)', 'sku' => 'WTS', 'unit_id' => $piece, 'description' => '500', 'remark' => 'Thing', 'image' => null],
            ['name' => 'Cigarette', 'sku' => 'CARETTE', 'unit_id' => $stick, 'description' => '500', 'remark' => 'Thing', 'image' => null],
            ['name' => 'Cookie', 'sku' => 'CKE', 'unit_id' => $piece, 'description' => '750', 'remark' => 'Thing', 'image' => null],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
