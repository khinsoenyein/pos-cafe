<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $g  = Unit::where('symbol', 'g')->first()->id;
        $ml    = Unit::where('symbol', 'ml')->first()->id;
        $pc = Unit::where('symbol', 'pc')->first()->id;
        $bag = Unit::where('symbol', 'bag')->first()->id;
        $stick = Unit::where('symbol', 'stick')->first()->id;
        $s_stick = Unit::where('symbol', 's_stick')->first()->id;

        $ingredients = [
            ['name' => 'Milk',   'unit_id' => $ml,  'description' => ''],
            ['name' => 'Condensed Milk',   'unit_id' => $ml,  'description' => ''],
            ['name' => 'Flavor Milk',   'unit_id' => $ml,  'description' => ''],
            ['name' => 'Chocolate',   'unit_id' => $ml,  'description' => ''],
            ['name' => 'Coffee',   'unit_id' => $g,  'description' => ''],
            ['name' => 'Thai Tea Powder',   'unit_id' => $g,  'description' => ''],
            ['name' => 'Green Tea Powder',   'unit_id' => $g,  'description' => ''],
            ['name' => 'Lemon Powder',   'unit_id' => $g,  'description' => ''],
            ['name' => 'Passion',   'unit_id' => $ml,  'description' => ''],
            ['name' => 'Sugar',   'unit_id' => $g,  'description' => ''],
            ['name' => 'Sugar Stick',   'unit_id' => $s_stick,  'description' => ''],
            ['name' => 'Matcha',   'unit_id' => $g,  'description' => ''],
            ['name' => 'Yuzu',   'unit_id' => $ml,  'description' => ''],
            ['name' => 'Noodle',   'unit_id' => $pc,  'description' => ''],
            ['name' => 'Bread',   'unit_id' => $pc,  'description' => ''],
            ['name' => 'Water Bottle (Big)',   'unit_id' => $pc,  'description' => ''],
            ['name' => 'Water Bottle (Small)',   'unit_id' => $pc,  'description' => ''],
            ['name' => 'Cigarette',   'unit_id' => $stick,  'description' => ''],
            ['name' => 'Cookie',   'unit_id' => $pc,  'description' => ''],
            ['name' => 'Coffee Bean 1Kg',   'unit_id' => $pc,  'description' => ''],
            ['name' => 'Coffee Powder 120g',   'unit_id' => $pc,  'description' => ''],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::create($ingredient);
        }
    }
}
