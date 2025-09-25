<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ShopSeeder::class,
            UserShopSeeder::class,
            ProductSeeder::class,
            IngredientSeeder::class,
            PriceSeeder::class,
            RecipeSeeder::class,
        ]);
    }
}
