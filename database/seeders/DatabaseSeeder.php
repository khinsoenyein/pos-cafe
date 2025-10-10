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
            UnitSeeder::class,
            ProductSeeder::class,
            IngredientSeeder::class,
            RecipeSeeder::class,
            PriceSeeder::class,
            SupplierSeeder::class,
            PaymentTypeSeeder::class,
            ExpenseCategorySeeder::class,
        ]);
    }
}
