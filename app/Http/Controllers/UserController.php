<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        // $inventories = Inventory::with('shop', 'product', 'createdBy')->orderBy('created_at', 'desc')->get();

        // return Inertia::render('Inventories/Index', [
        //     'inventories' => $inventories,
        //     'products' => Product::select('id', 'name')->get(),
        //     'shops' => Shop::select('id', 'name')->get(),
        //     'productShops' => ProductShop::with('product')
        //         ->select('id', 'shop_id', 'product_id', 'price', 'stock', 'isactive', 'isdeleted')
        //         ->get(),
        // ]);
    }
}
