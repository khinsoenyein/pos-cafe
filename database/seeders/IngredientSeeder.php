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
        $gram  = Unit::where('symbol', 'g')->first()->id;
        $ml    = Unit::where('symbol', 'ml')->first()->id;
        $piece = Unit::where('symbol', 'pc')->first()->id;

        $ingredients = [
            ['name' => 'Coffee Beans',   'unit_id' => $gram,  'description' => 'Used for espresso and brewed coffee'],
            ['name' => 'Sugar',          'unit_id' => $gram,  'description' => 'Granulated sugar'],
            ['name' => 'Milk',           'unit_id' => $ml,    'description' => 'Fresh milk'],
            ['name' => 'Condensed Milk', 'unit_id' => $ml,    'description' => 'Sweetened condensed milk'],
            ['name' => 'Tea Leaves',     'unit_id' => $gram,  'description' => 'Black tea or green tea'],
            ['name' => 'Chocolate Syrup','unit_id' => $ml,    'description' => 'Used for mocha drinks'],
            ['name' => 'Whipped Cream',  'unit_id' => $ml,    'description' => 'Topping'],
            ['name' => 'Lemon',          'unit_id' => $piece, 'description' => 'For lemon tea'],
            ['name' => 'Ice Cubes',      'unit_id' => $piece, 'description' => 'Approx per cube'],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::create($ingredient);
        }
    }
}
