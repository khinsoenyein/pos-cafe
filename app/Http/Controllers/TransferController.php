<?php

namespace App\Http\Controllers;

use App\Helpers\CodeGenerator;
use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\Inventory;
use App\Models\Shop;
use App\Models\Transfer;
use App\Models\TransferItem;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function create()
    {
        return Inertia::render('Transfers/Create', [
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
            'transfer_date' => 'required',
            'from_shop_id' => 'required|exists:shops,id|different:to_shop_id',
            'to_shop_id' => 'required|exists:shops,id',
            'total_qty' => 'required|numeric|min:1',
            'other_cost' => 'required|numeric|min:0',
            'items'   => 'required|array|min:1',
            'items.*.ingredient_id' => 'required|exists:ingredients,id',
            'items.*.unit_id' => 'required|exists:units,id',
            'items.*.qty'        => 'required|integer|min:1',
        ], [
            'from_shop_id.different' => 'From shop and To shop must be different.',
        ]);

        DB::beginTransaction();
        try {
            // Convert formats
            $transferDate = Carbon::parse($validated['transfer_date']);
            $transfer_date = $transferDate->format('Y-m-d'); // For DB save
            $transferDateYmd = $transferDate->format('ymd'); // For voucher or code

            $voucher_number = CodeGenerator::serialNumberGenerator(
            Transfer::class,
            'TR-'.$transferDateYmd.'-',
            'voucher_number',
            4,
            'transfer_date',
            '=',
            $transfer_date);

            // Create
            $transfer = Transfer::create([
                'from_shop_id' => $validated['from_shop_id'],
                'to_shop_id' => $validated['to_shop_id'],
                'voucher_number' => $voucher_number,
                'transfer_date' => $transfer_date,
                'total_qty'   => $validated['total_qty'],
                'other_cost'   => $validated['other_cost'],
                'created_user' => Auth::user()->id
            ]);

            foreach ($validated['items'] as $item) {
                // Attach items
                TransferItem::create([
                    'transfer_id'    => $transfer->id,
                    'ingredient_id' => $item['ingredient_id'],
                    'unit_id' => $item['unit_id'],
                    'qty'        => $item['qty'],
                    'created_user' => Auth::user()->id
                ]);

                $ingredient = Ingredient::find($item['ingredient_id']);

                $base_qty = Unit::convert((float) $item['qty'], (int) $item['unit_id'], (int) $ingredient->unit_id);

                //from_shop
                Inventory::create([
                    'shop_id' => $validated['from_shop_id'],
                    'ingredient_id' => $item['ingredient_id'],
                    'unit_id' => $ingredient->unit_id,
                    'date' => $transfer->transfer_date,
                    'change' => $base_qty * -1,
                    'reference' => $voucher_number,
                    'reason' => 'Transfer',
                    'remark' => '',
                    'created_user' => Auth::user()->id
                ]);

                //to_shop
                Inventory::create([
                    'shop_id' => $validated['to_shop_id'],
                    'ingredient_id' => $item['ingredient_id'],
                    'unit_id' => $ingredient->unit_id,
                    'date' => $transfer->transfer_date,
                    'change' => $base_qty,
                    'reference' => $voucher_number,
                    'reason' => 'Transfer',
                    'remark' => '',
                    'created_user' => Auth::user()->id
                ]);
            }

            DB::commit();
            return redirect()->route('transfer.create')->with('success', 'Transfer recorded successfully!');
        } catch (\Throwable $e) {
            DB::rollback();
            // Optionally, log error
            dd($e->getMessage());
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function list(){
        // return Inertia::render('Purchases/List', [
        //     'purchases' => Purchase::with(['supplier','shop','items.ingredient','createdBy'])->get(),
        // ]);
    }
}
