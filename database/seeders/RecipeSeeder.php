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
            'JAK Hot' => [
                'Coffee' => 10, // grams
                'Flavor Milk' => 30, //ml
                'Condensed Milk' => 15, //ml
                'Milk' => 100, //g
            ],
            'Latte' => [
                'Coffee' => 10, //g
                'Milk' => 130, //g
                'Sugar Stick' => 1, //s-stick
            ],
            'Latte (No Sugar)' => [
                'Coffee' => 10, //g
                'Milk' => 130, //g
            ],
            'Mocha' => [
                'Coffee' => 10, //g
                'Chocolate' => 10, //ml
                'Milk' => 100, //g
            ],
            'Cappuccino' => [
                'Coffee' => 10, // g
                'Milk' => 120, //g
                'Sugar Stick' => 1, //s-stick
            ],
            'Cappuccino (No Sugar)' => [
                'Coffee' => 10, // g
                'Milk' => 120, //g
            ],
            'Milk Chocolate' => [
                'Chocolate' => 15,
                'Condensed Milk' => 10,
                'Flavor Milk' => 30,
                'Milk' => 100,
            ],
            'Green Tea' => [
                'Green Tea Powder' => 20,
                'Condensed Milk' => 30,
                'Flavor Milk' => 30,
                'Milk' => 60,
            ],
            'Thai Tea' => [
                'Green Tea Powder' => 20,
                'Condensed Milk' => 30,
                'Flavor Milk' => 30,
                'Milk' => 60,
            ],
            'Americano' => [
                'Coffee' => 10, // g
            ],
            'JAK iced' => [
                'Coffee' => 15, // g
                'Flavor Milk' => 30, //ml
                'Condensed Milk' => 30, //ml
                'Milk' => 90, //ml
            ],
            'Latte iced' => [
                'Coffee' => 15, // g
                'Condensed Milk' => 15, //ml
                'Milk' => 150, //ml
            ],
            'Mocha iced' => [
                'Coffee' => 15, // g
                'Flavor Milk' => 30, //ml
                'Condensed Milk' => 15, //ml
                'Chocolate' => 15,
                'Milk' => 150, //ml
            ],
            'Cappuccino iced' => [
                'Coffee' => 15, // g
                'Condensed Milk' => 30, //ml
                'Milk' => 120, //g
            ],
            'Milk Chocolate iced' => [
                'Chocolate' => 20,
                'Condensed Milk' => 15, //ml
                'Flavor Milk' => 30, //ml
                'Milk' => 130, //ml
            ],
            'Lemon Presso' => [
                'Coffee' => 15, // g
                'Lemon Powder' => 20, // g
                'Sugar Stick' => 1, //ml
            ],
            'Thai Tea iced' => [
                'Thai Tea Powder' => 25,
                'Condensed Milk' => 45,
                'Flavor Milk' => 30,
                'Milk' => 60,
            ],
            'Green Tea iced' => [
                'Green Tea Powder' => 25,
                'Condensed Milk' => 45,
                'Flavor Milk' => 30,
                'Milk' => 60,
            ],
            'Americano iced' => [
                'Coffee' => 15,
            ],
            'Passion Presso' => [
                'Passion' => 30,
                'Coffee' => 15,
                'Sugar Stick' => 1, //ml
            ],
            'Matcha' => [
                'Matcha' => 30,
                'Condensed Milk' => 30,
                'Flavor Milk' => 30,
                'Milk' => 60,
            ],
            'Coffee Powder 120g' => ['Coffee Powder 120g' => 1,],
            'Coffee Bean 1Kg' => ['Coffee Bean 1Kg' => 1,],
            'Noodle' => ['Noodle' => 1,],
            'Bread' => ['Bread' => 1,],
            'Water Bottle (Big)' => ['Water Bottle (Big)' => 1,],
            'Water Bottle (Small)' => ['Water Bottle (Small)' => 1,],
            'Cigarette' => ['Cigarette' => 1,],
            'Cookie' => ['Cookie' => 1,],
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
