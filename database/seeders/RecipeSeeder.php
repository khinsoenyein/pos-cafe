<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\IngredientProduct;
use App\Models\Shop;
use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class RecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $shops = Shop::all();
        // $products = Product::all();
        // $ingredients = Ingredient::all();

        // foreach ($shops as $shop) {
        //     foreach ($products as $product) {
        //         foreach ($ingredients as $ingredient) {
        //             if ($ingredient->id > rand(1,5)){
        //                 IngredientProduct::updateOrCreate(
        //         [
        //                         'shop_id' => $shop->id,
        //                         'product_id' => $product->id,
        //                         'ingredient_id' => $ingredient->id,
        //                         'unit_id' => $ingredient->unit_id,
        //                     ],
        //                     [
        //                         'quantity' => round(rand(2, max: 10)),
        //                         'created_user' => 1
        //                     ]
        //                 );
        //             }
        //         }
        //     }
        // }

        $recipes = [
            'Espresso' => [
                'Coffee Beans' => 18, // grams
            ],
            'Americano' => [
                'Coffee Beans' => 18,
                // water omitted (not tracked as ingredient)
            ],
            'Cappuccino' => [
                'Coffee Beans' => 18,
                'Milk' => 120,       // ml (steamed milk + foam)
                // optionally sugar ...
            ],
            'Latte' => [
                'Coffee Beans' => 18,
                'Milk' => 200,
            ],
            'Mocha' => [
                'Coffee Beans' => 18,
                'Milk' => 150,
                'Chocolate Syrup' => 30, // ml
            ],
            'Flat White' => [
                'Coffee Beans' => 18,
                'Milk' => 150,
            ],
            'Macchiato' => [
                'Coffee Beans' => 18,
                'Milk' => 10,
            ],
            'Iced Coffee' => [
                'Coffee Beans' => 18,
                'Ice Cubes' => 3, // pieces
                'Milk' => 50,
            ],
        ];

        // get all shops
        $shops = Shop::all();

        // Preload ingredients by name for quick lookup
        $ingredientRows = Ingredient::all()->keyBy('name');

        // Timestamp for created_at / updated_at
        $now = Carbon::now();

        foreach ($shops as $shop) {
            foreach ($recipes as $productName => $ings) {
                $product = Product::where('name', $productName)->first();

                if (! $product) {
                    $this->command->warn("Product '{$productName}' not found — skipping.");
                    continue;
                }

                foreach ($ings as $ingredientName => $qty) {
                    if (! isset($ingredientRows[$ingredientName])) {
                        $this->command->warn("Ingredient '{$ingredientName}' not found — skipping for product {$productName}.");
                        continue;
                    }

                    $ingredient = $ingredientRows[$ingredientName];
                    $unitId = $ingredient->unit_id ?? null;

                    // Safety: ensure unit_id exists
                    if (! $unitId) {
                        $this->command->warn("Ingredient '{$ingredientName}' has no unit_id — skipping for product {$productName}.");
                        continue;
                    }

                    // Use updateOrInsert to avoid duplicate unique key violations
                    DB::table('ingredient_product')->updateOrInsert(
                        [
                            'shop_id' => $shop->id,
                            'product_id' => $product->id,
                            'ingredient_id' => $ingredient->id,
                        ],
                        [
                            'unit_id' => $unitId,
                            'quantity' => $qty,
                            'remark' => null,
                            'isactive' => true,
                            'isdeleted' => false,
                            'created_user' => 1, // change if you want dynamic user
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]
                    );

                    // $this->command->info("Recipe added: Shop {$shop->id} - Product '{$productName}' uses {$qty} (ingredient: {$ingredientName})");
                }
            }
        }

        // $this->command->info("Recipe seeding done.");
    }
}
