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
use Date;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
            'shops' => Shop::where('isactive', true)->select('id', 'name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Purchases/Create', [
            'suppliers' => Supplier::select('id', 'name')->get(),
            'ingredients' => Ingredient::select('id', 'name')->get(),
            'units' => Unit::select('id', 'name')->get(),
            'shops' => Shop::where('isactive', true)->select('id', 'name')->get(),
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
                'purchase_date' => Carbon::parse($validated['purchase_date'])->format('Y-m-d'),
                'total'   => $validated['total'],
                'other_code'   => $validated['other_cost'],
                'grand_total'   => $validated['grand_total'],
                'created_user' => Auth::user()->id
            ]);

            foreach ($validated['items'] as $item) {
                $price = $item['price'];
                // Attach sale items
                PurchaseItem::create([
                    'shop_id' => $shop->id,
                    'purchase_id'    => $purchase->id,
                    'ingredient_id' => $item['ingredient_id'],
                    'unit_id' => $item['unit_id'],
                    'qty'        => $item['qty'],
                    'price'      => $price,
                    'total'        => $item['total'],
                    'created_user' => Auth::user()->id
                ]);

                $ingredient = Ingredient::find($item['ingredient_id']);

                $base_qty = Unit::convert((float) $item['qty'], (int) $item['unit_id'], (int) $ingredient->unit_id);
                $base_unit_cost = $price / $base_qty;
                $base_total_cost = $base_unit_cost * $base_qty;

                Inventory::create([
                    'shop_id' => $shop->id,
                    'ingredient_id' => $item['ingredient_id'],
                    'unit_id' => $ingredient->unit_id,
                    'date' => $purchase->purchase_date,
                    'change' => $base_qty,
                    'unit_cost' => $base_unit_cost,
                    'total_cost' => $base_total_cost,
                    'reference' => $voucher_number,
                    'reason' => 'Purchase',
                    'remark' => '',
                    'created_user' => Auth::user()->id
                ]);
            }

            DB::commit();
            return redirect()->route('purchases.create')->with('success', 'Sale recorded successfully!');
        } catch (\Throwable $e) {
            DB::rollback();
            // Optionally, log error
            // dd($e->getMessage());
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function list(){
        return Inertia::render('Purchases/List', [
            'purchases' => Purchase::with(['supplier','shop','items.ingredient','createdBy'])->get(),
        ]);
    }
}
