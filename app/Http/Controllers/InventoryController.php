<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\IngredientShop;
use App\Models\Inventory;
use App\Models\Shop;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InventoryController extends Controller
{
    public function index()
    {
        $inventories = Inventory::with('shop', 'ingredient', 'unit', 'purchase', 'sale', 'product', 'transfer', 'createdBy')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Inventories/Transaction', [
            'inventories' => $inventories,
            'ingredients' => Ingredient::select('id', 'name')->get(),
            'shops' => Shop::where('isactive', false)->select('id', 'name')->get(),
            'ingredientShops' => IngredientShop::with('ingredient')
                ->select('id', 'shop_id', 'ingredient_id', 'stock', 'isactive', 'isdeleted')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'change' => 'required|numeric',
            'reason' => 'nullable|string',
            'remark' => 'nullable|string',
        ]);

        // dd($validated);

        Inventory::create([
            'shop_id' => $validated['shop_id'],
            'ingredient_id' => $validated['ingredient_id'],
            'change' => $validated['change'],
            'reason' => $validated['reason'],
            'remark' => $validated['remark'] ?? '',
            'created_user' => Auth::user()->id
        ]);

        return redirect()->route('inventory.index')->with('success', 'Inventory added!');
    }

    public function balance()
    {
        $ingredientShops = IngredientShop::with('shop', 'ingredient', 'unit', 'createdBy')->orderBy('shop_id')->get();

        return Inertia::render('Inventories/Balance', [
            'ingredientShops' => $ingredientShops,
        ]);
    }
}
