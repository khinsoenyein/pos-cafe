<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RecipeController extends Controller
{
    public function index(Request $request)
    {
        $selectedShopId = $request->input('shop_id') ?? 1;
        $selectedProductId = $request->input('product_id') ?? 1;
        $currentIngredients = null;

        $currentIngredients = Product::with(['ingredients' => function ($query) use ($selectedShopId) {
            $query->wherePivot('shop_id', $selectedShopId)
                ->withPivot('id', 'quantity', 'isactive');
        }])->find($selectedProductId);

        $availableIngredients = Ingredient::get();

        return Inertia::render('Recipe', [
            'shops' => Shop::all(['id', 'name']),
            'products' => Product::all(['id', 'name']),
            'availableIngredients' => $availableIngredients,
            'currentIngredients' => $currentIngredients,
            'errors' => session('errors') ? session('errors')->getBag('default')->toArray() : [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'price' => 'required|numeric|min:0',
            'editing_ingredient_id' => 'nullable|exists:ingredients,id', // Used to identify if editing existing
        ]);

        $shop = Shop::findOrFail($validated['shop_id']);

        try {
            // Check if ingredient is already attached to update, otherwise attach
            if ($shop->ingredients()->where('ingredient_id', $validated['ingredient_id'])->exists()) {
                return back()->withErrors(['error' => 'Ingredient already exists for the shop']);
            } else {
                $shop->ingredients()->attach($validated['ingredient_id'], [
                    'price' => $validated['price'],
                    'created_user' => Auth::user()->id
                ]);
                $message = 'Ingredient added to shop successfully!';
            }

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to save ingredient setup: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'price' => 'required|numeric|min:0',
        ]);

        $shop = Shop::findOrFail($validated['shop_id']);

        try {
            if ($shop->ingredients()->where('ingredient_id', $validated['ingredient_id'])->exists()) {
                $shop->ingredients()->updateExistingPivot($validated['ingredient_id'], [
                    'price' => $validated['price'],
                    'modified_user' => Auth::user()->id
                ]);
                $message = 'Ingredient updated for shop successfully!';
            }

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to save ingredient setup: ' . $e->getMessage()]);
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
}
