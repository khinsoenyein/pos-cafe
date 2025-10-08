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

        $products = [
            ['name' => 'Espresso', 'sku' => 'COF001', 'unit_id' => $cup, 'description' => 'Strong black coffee shot', 'remark' => null, 'image' => 'products/Espresso.png'],
            ['name' => 'Americano', 'sku' => 'COF002', 'unit_id' => $cup, 'description' => 'Espresso with hot water', 'remark' => null, 'image' => 'products/Americano.png'],
            ['name' => 'Cappuccino', 'sku' => 'COF003', 'unit_id' => $cup, 'description' => 'Espresso, steamed milk & foam', 'remark' => null, 'image' => 'products/Cappuccino.png'],
            ['name' => 'Latte', 'sku' => 'COF004', 'unit_id' => $cup, 'description' => 'Espresso with steamed milk', 'remark' => null, 'image' => 'products/Latte.png'],
            ['name' => 'Mocha', 'sku' => 'COF005', 'unit_id' => $cup, 'description' => 'Espresso with chocolate and milk', 'remark' => null, 'image' => 'products/Mocha.png'],
            ['name' => 'Flat White', 'sku' => 'COF006', 'unit_id' => $cup, 'description' => 'Espresso with thin milk foam', 'remark' => null, 'image' => 'products/Flat_White.png'],
            ['name' => 'Macchiato', 'sku' => 'COF007', 'unit_id' => $cup, 'description' => 'Espresso with small amount of foam', 'remark' => null, 'image' => 'products/Macchiato.png'],
            ['name' => 'Iced Coffee', 'sku' => 'COF008', 'unit_id' => $cup, 'description' => 'Chilled coffee over ice', 'remark' => null, 'image' => 'products/Iced_Coffee.png'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
