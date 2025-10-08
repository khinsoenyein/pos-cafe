<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            // Base units
            ['name' => 'gram',        'symbol' => 'g',   'base_unit' => 'g',   'conversion_rate' => 1],
            ['name' => 'milliliter',  'symbol' => 'ml',  'base_unit' => 'ml',  'conversion_rate' => 1],
            ['name' => 'piece',       'symbol' => 'pc',  'base_unit' => 'pc',  'conversion_rate' => 1],

            // Derived units (converted back to base)
            ['name' => 'kilogram',    'symbol' => 'kg',  'base_unit' => 'g',   'conversion_rate' => 1000],
            ['name' => 'liter',       'symbol' => 'l',   'base_unit' => 'ml',  'conversion_rate' => 1000],
            ['name' => 'ounce',       'symbol' => 'oz',  'base_unit' => 'g',   'conversion_rate' => 28.35],
            ['name' => 'tablespoon',  'symbol' => 'tbsp','base_unit' => 'ml',  'conversion_rate' => 15],
            ['name' => 'teaspoon',    'symbol' => 'tsp', 'base_unit' => 'ml',  'conversion_rate' => 5],
            ['name' => 'cup',         'symbol' => 'cup', 'base_unit' => 'ml',  'conversion_rate' => 240],
        ];

        foreach ($datas as $data) {
            Unit::create($data);
        }
    }
}
