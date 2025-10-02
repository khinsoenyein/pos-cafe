<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\Shop;
use App\Models\Supplier;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index()
    {
        return Inertia::render('Purchases/Create', [
            'suppliers' => Supplier::select('id', 'name')->get(),
            'ingredients' => Ingredient::select('id', 'name')->get(),
            'units' => Unit::select('id', 'name')->get(),
            'shops' => Shop::select('id', 'name')->get(),
        ]);
    }
    
    public function create()
    {
        return Inertia::render('Purchases/Create', [
            'suppliers' => Supplier::select('id', 'name')->get(),
            'ingredients' => Ingredient::select('id', 'name')->get(),
            'units' => Unit::select('id', 'name')->get(),
            'shops' => Shop::select('id', 'name')->get(),
        ]);
    }
}
