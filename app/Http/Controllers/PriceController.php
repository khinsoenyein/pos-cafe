<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductShop;
use App\Models\Shop;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PriceController extends Controller
{
    public function index(Request $request)
    {
        $selectedShopId = $request->input('shop_id') ?? 1;
        $currentShopWithProducts = null;

        $currentShopWithProducts = Shop::with(['products' => function ($query) {
            $query->select('products.id', 'products.name', 'products.sku')
                ->withPivot('id', 'price', 'isactive');
        }])->find($selectedShopId);

        $availableProducts = Product::whereDoesntHave('shops', function ($query) use ($selectedShopId) {
            $query->where('shop_id', $selectedShopId);
        })->get();

        return Inertia::render('Price', [
            'shops' => Shop::all(['id', 'name']),
            'availableProducts' => $availableProducts,
            'currentShopWithProducts' => $currentShopWithProducts,
            'errors' => session('errors') ? session('errors')->getBag('default')->toArray() : [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'product_id' => 'required|exists:products,id',
            'price' => 'required|numeric|min:0',
            'editing_product_id' => 'nullable|exists:products,id', // Used to identify if editing existing
        ]);

        $shop = Shop::findOrFail($validated['shop_id']);

        try {
            // Check if product is already attached to update, otherwise attach
            if ($shop->products()->where('product_id', $validated['product_id'])->exists()) {
                return back()->withErrors(['error' => 'Product already exists for the shop']);
            } else {
                $shop->products()->attach($validated['product_id'], [
                    'price' => $validated['price'],
                    'created_user' => Auth::user()->id
                ]);
                $message = 'Product added to shop successfully!';
            }

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to save product setup: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'product_id' => 'required|exists:products,id',
            'price' => 'required|numeric|min:0',
        ]);

        $shop = Shop::findOrFail($validated['shop_id']);

        try {
            if ($shop->products()->where('product_id', $validated['product_id'])->exists()) {
                $shop->products()->updateExistingPivot($validated['product_id'], [
                    'price' => $validated['price'],
                    'modified_user' => Auth::user()->id
                ]);
                $message = 'Product updated for shop successfully!';
            }

            return redirect()->back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to save product setup: ' . $e->getMessage()]);
        }
    }

    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'product_id' => 'required|exists:products,id',
        ]);

        $shop = Shop::findOrFail($validated['shop_id']);

        if ($shop->products()->detach($validated['product_id'])) {
            return redirect()->back()->with('success', 'Product removed from shop successfully.');
        }

        return back()->withErrors(['error' => 'Failed to remove product from shop.']);
    }

    public function status(Request $request)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'product_id' => 'required|exists:products,id',
        ]);

        $shop = Shop::findOrFail($validated['shop_id']);

        try {
            if ($shop->products()->where('product_id', $validated['product_id'])->exists()) {
                $productShop = $shop->products()
                    ->withPivot('isactive')
                    ->where('product_id', $validated['product_id'])
                    ->first();

                $isActive = $productShop->pivot->isactive;

                $shop->products()->updateExistingPivot($validated['product_id'], [
                    'isactive' => ($isActive == 1 ? 0 : 1),
                    'modified_user' => Auth::id(),
                ]);
            }

            return redirect()->back()->with('success', 'Status updated.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to save product setup: ' . $e->getMessage()]);
        }
    }
}
