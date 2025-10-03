<?php

namespace App\Http\Controllers;

use App\Helpers\CodeGenerator;
use App\Models\Ingredient;
use App\Models\Inventory;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Shop;
use App\Models\Supplier;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

    public function store(Request $request)
    {
        // dd($request->all());
        // Validation
        $validated = $request->validate([
            'purchase_date' => 'required',
            'supplier_id' => 'required|exists:suppliers,id',
            'shop_id' => 'required|exists:shops,id',
            'total' => 'required|numeric|min:0',
            'other_cost' => 'required|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',
            'items'   => 'required|array|min:1',
            'items.*.ingredient_id' => 'required|exists:ingredients,id',
            'items.*.unit_id' => 'required|exists:units,id',
            'items.*.qty'        => 'required|integer|min:1',
            'items.*.price'      => 'required|numeric|min:0',
            'items.*.total'      => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $shop = Shop::findOrFail($validated['shop_id']);

            $voucher_number = CodeGenerator::generateID(Purchase::class, $validated['shop_id'], 'shop_id', 'voucher_number', 'P'.$shop->code, 4);

            // Create
            $purchase = Purchase::create([
                'supplier_id' => $validated['supplier_id'],
                'shop_id' => $shop->id,
                'voucher_number' => $voucher_number,
                'purchase_date' => date("Y-m-d"),
                'total'   => $request->input('total', 0),
                'other_code'   => $request->input('other_cost', 0),
                'grand_total'   => $request->input('grand_total', 0),
                'created_user' => Auth::user()->id
            ]);

            foreach ($validated['items'] as $item) {
                // Attach sale items
                PurchaseItem::create([
                    'shop_id' => $shop->id,
                    'purchase_id'    => $purchase->id,
                    'ingredient_id' => $item['ingredient_id'],
                    'unit_id' => $item['unit_id'],
                    'qty'        => $item['qty'],
                    'price'      => $item['price'],
                    'total'        => $item['total'],
                    'created_user' => Auth::user()->id
                ]);

                $ingredient = Ingredient::find($item['ingredient_id']);

                $base_qty = Unit::convert((float) $item['qty'], (int) $item['unit_id'], (int) $ingredient->unit_id);
                
                Inventory::create([
                    'shop_id' => $shop->id,
                    'ingredient_id' => $item['ingredient_id'],
                    'unit_id' => $ingredient->unit_id,
                    'change' => $base_qty,
                    'reference' => $voucher_number,
                    'reason' => 'Purchases',
                    'remark' => '',
                    'created_user' => Auth::user()->id
                ]);
            }

            DB::commit();
            return redirect()->route('purchases.create')->with('success', 'Sale recorded successfully!');
        } catch (\Throwable $e) {
            DB::rollback();
            // Optionally, log error
            dd($e->getMessage());
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }
}
