<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductShop;
use App\Models\Shop;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class InventoryController extends Controller
{
    public function index()
    {
        $inventories = Inventory::with('shop', 'product', 'createdBy')->orderBy('created_at', 'desc')->get();

        return Inertia::render('Inventories/Index', [
            'inventories' => $inventories,
            'products' => Product::select('id', 'name')->get(),
            'shops' => Shop::select('id', 'name')->get(),
            'productShops' => ProductShop::with('product')
                ->select('id', 'shop_id', 'product_id', 'price', 'stock', 'isactive', 'isdeleted')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'product_id' => 'required|exists:products,id',
            'change' => 'required|numeric',
            'reason' => 'nullable|string',
            'remark' => 'nullable|string',
        ]);

        // dd($validated);

        Inventory::create([
            'shop_id' => $validated['shop_id'],
            'product_id' => $validated['product_id'],
            'change' => $validated['change'],
            'reason' => $validated['reason'],
            'remark' => $validated['remark'] ?? '',
            'created_user' => Auth::user()->id
        ]);

        return redirect()->route('inventory.index')->with('success', 'Inventory added!');
    }

    public function balance()
    {
        $productShops = ProductShop::with('shop', 'product', 'createdBy')->orderBy('shop_id')->get();

        return Inertia::render('Inventories/Balance', [
            'productShops' => $productShops,
        ]);
    }
}
