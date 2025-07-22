<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['name' => 'Coffee',   'sku' => 'CF001'],
            ['name' => 'Tea',      'sku' => 'TE001'],
            ['name' => 'Muffin',   'sku' => 'MU001'],
            ['name' => 'Bagel',    'sku' => 'BG001'],
            ['name' => 'Cookie',   'sku' => 'CK001'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
