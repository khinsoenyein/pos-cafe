<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredients = [
            ['name' => 'Coffee Bean', 'description' => 'Coffee Bean', 'unit_id' => 1 ],
            ['name' => 'Milk', 'description' => 'Milk', 'unit_id' => 3],
            ['name' => 'Sugar', 'description' => 'Sugar', 'unit_id' => 1],
            ['name' => 'Ice cube', 'description' => 'Ice cube', 'unit_id' => 5],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::create($ingredient);
        }
    }
}
