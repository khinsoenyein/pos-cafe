<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return Inertia::render('Products', [
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100|unique:products,sku',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'remark' => 'nullable|string',
        ]);

        // dd($validated);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        Product::create([
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'description' => $validated['description'] ?? '',
            'image' => $validated['image'] ?? '',
            'remark' => $validated['remark'] ?? '',
            'created_user' => Auth::user()->id
        ]);

        return redirect()->route('products.index')->with('success', 'Product added!');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100|unique:products,sku,' . $id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'remark' => 'nullable|string',
        ]);

        $product = Product::findOrFail($id);

        // Check for new image
        if ($request->hasFile('image')) {
            // Delete old image from storage if exists
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            // Save new image
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'name' => $validated['name'],
            'sku' => $validated['sku'],
            'description' => $validated['description'] ?? '',
            'image' => $validated['image'] ?? '',
            'remark' => $validated['remark'] ?? '',
            'modified_user' => Auth::user()->id
        ]);

        return redirect()->route('products.index')->with('success', 'Product added!');
    }
}
