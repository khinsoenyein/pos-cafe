<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\IngredientProduct;
use App\Models\Shop;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shops = Shop::all();
        $products = Product::all();
        $ingredients = Ingredient::all();

        foreach ($shops as $shop) {
            foreach ($products as $product) {
                foreach ($ingredients as $ingredient) {
                    if ($ingredient->id > rand(1,5)){
                        IngredientProduct::updateOrCreate(
                [
                                'shop_id' => $shop->id,
                                'product_id' => $product->id,
                                'ingredient_id' => $ingredient->id,
                            ],
                            [
                                'quantity' => round(rand(2, max: 10)),
                                'created_user' => 1
                            ]
                        );
                    }
                }
            }
        }
    }
}
