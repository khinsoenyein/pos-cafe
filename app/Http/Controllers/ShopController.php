<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShopController extends Controller
{
    public function index()
    {
        $shops = Shop::all();
        return Inertia::render('Shops', [
            'shops' => $shops
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:100|unique:shops,code',
            'location' => 'nullable|string',
            'remark' => 'nullable|string',
        ]);

        Shop::create([
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'location' => $validated['location'] ?? '',
            'remark' => $validated['remark'] ?? '',
            'created_user' => Auth::user()->id
        ]);

        return redirect()->route('shops.index')->with('success', 'Shop added!');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:100|unique:shops,code,' . $id,
            'location' => 'nullable|string',
            'remark' => 'nullable|string',
        ]);

        $shop = Shop::findOrFail($id);

        $shop->update([
            'name' => $validated['name'],
            'code' => strtoupper($validated['code']),
            'location' => $validated['location'] ?? '',
            'remark' => $validated['remark'] ?? '',
            'modified_user' => Auth::user()->id
        ]);

        return redirect()->route('shops.index')->with('success', 'Shop added!');
    }
}
