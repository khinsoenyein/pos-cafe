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
            ['name' => 'Coffee Bean 30g', 'description' => 'Coffee Bean 30g'],
            ['name' => 'Milk 1 litre', 'description' => 'Milk 1 litre'],
            ['name' => 'Sugar 100g', 'description' => 'Sugar 100g'],
            ['name' => 'Ice 10 cubes', 'description' => 'Ice 10 cubes'],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::create($ingredient);
        }
    }
}
