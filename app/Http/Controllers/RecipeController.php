<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\IngredientProduct;
use App\Models\IngredientShop;
use App\Models\Product;
use App\Models\Shop;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RecipeController extends Controller
{
    public function index(Request $request)
    {
        // $selectedShopId = $request->input('shop_id') ?? 1;
        // $selectedProductId = $request->input('product_id') ?? 1;
        // $currentIngredients = null;

        // $currentIngredients = Product::with(['ingredients' => function ($query) use ($selectedShopId) {
        //     $query->wherePivot('shop_id', $selectedShopId)
        //         ->withPivot('id', 'quantity', 'shop_id', 'isactive');
        // }])->find($selectedProductId);

        // $recipes = [
        //     'shop' => Shop::find($selectedShopId),
        //     'product' => Product::find($selectedProductId),
        //     'ingredients' => IngredientProduct::where('shop_id','=', $selectedShopId)
        //     ->where('product_id','=', $selectedProductId)->get()
        // ];

        $recipes = IngredientProduct::with(['shop', 'product', 'ingredient', 'unit'])->get();

        // $currentIngredients = IngredientProduct::with(['shop', 'product', 'ingredient'])
        //                     ->where('shop_id',$selectedShopId)
        //                     ->where('product_id',$selectedProductId)->get();

        return Inertia::render('Recipe', [
            'shops' => Shop::all(['id', 'name']),
            'products' => Product::all(['id', 'name']),
            'ingredients' => Ingredient::all(['id', 'name']),
            'units' => Unit::all(['id', 'name']),
            // 'availableIngredients' => $availableIngredients,
            'currentIngredients' => null,
            'recipes' => $recipes,
            'errors' => session('errors') ? session('errors')->getBag('default')->toArray() : [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'product_id' => 'required|exists:products,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'unit_id' => 'required|exists:units,id',
            'quantity' => 'required|numeric|min:0',
        ]);

        try {
            IngredientProduct::updateOrCreate(
                [
                    'shop_id' => $validated['shop_id'],
                    'product_id' => $validated['product_id'],
                    'ingredient_id' => $validated['ingredient_id'],
                ],
                [
                    'quantity' => $validated['quantity'],
                    'unit_id' => $validated['unit_id'],
                    'created_user' => Auth::user()->id
                ]
            );

            $message = 'Ingredient added to recipe successfully!';

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to save recipe: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'product_id' => 'required|exists:products,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'unit_id' => 'required|exists:units,id',
            'quantity' => 'required|numeric|min:0',
        ]);

        try {
            IngredientProduct::updateOrCreate(
                [
                    'shop_id' => $validated['shop_id'],
                    'product_id' => $validated['product_id'],
                    'ingredient_id' => $validated['ingredient_id'],
                ],
                [
                    'quantity' => $validated['quantity'],
                    'unit_id' => $validated['unit_id'],
                    'modified_user' => Auth::user()->id
                ]
            );

            $message = 'Ingredient added to recipe successfully!';

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to save recipe: ' . $e->getMessage()]);
        }
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'ingredient_id' => 'required|exists:ingredients,id',
        ]);

        $shop = Shop::findOrFail($validated['shop_id']);

        if ($shop->ingredients()->detach($validated['ingredient_id'])) {
            return redirect()->back()->with('success', 'Ingredient removed from shop successfully.');
        }

        return back()->withErrors(['error' => 'Failed to remove ingredient from shop.']);
    }

    public function status(Request $request)
    {
        $validated = $request->validate([
            'recipe_id' => 'required|exists:ingredient_product,id',
            'shop_id' => 'required|exists:shops,id',
            'product_id' => 'required|exists:products,id',
        ]);

        $recipe = IngredientProduct::findOrFail($validated['recipe_id']);

        try {
            $recipe->update([
                'isactive' => ($recipe->isactive == 1 ? 0 : 1),
                'modified_user' => Auth::id(),
            ]);

            return redirect()->back()->with('success', 'Status updated.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to save product setup: ' . $e->getMessage()]);
        }
    }

    public function getIngredient(Request $request)
    {
        $selectedShopId = $request->input('shop_id');
        $selectedProductId = $request->input('product_id');

        $currentIngredients = IngredientProduct::with(['shop', 'product', 'ingredient', 'unit'])
                            ->where('shop_id',$selectedShopId)
                            ->where('product_id',$selectedProductId)->get();

        return response()->json($currentIngredients);
    }
}
