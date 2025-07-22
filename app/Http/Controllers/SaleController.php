<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index()
    {
        $shops = Shop::with(['products' => function ($q) {
            $q->select('products.id', 'name', 'sku')
            ->where(['products.isdeleted' => '0', 'products.isactive' => '1'])->orderBy('name')
            ->withPivot('price');
        }])->where(['isdeleted' => '0', 'isactive' => '1'])->orderBy('name')->get();

        return Inertia::render('Sales/Create', [
            'shops' => $shops
        ]);
    }

    public function create()
    {
        $shops = Shop::with(['products' => function ($q) {
            $q->select('products.id', 'name', 'sku', 'image')
            ->wherePivot('isdeleted', false)
            ->wherePivot('isactive', true)
            ->orderBy('name')
            ->withPivot('price');
        }])->where(['isdeleted' => '0', 'isactive' => '1'])->orderBy('name')->get();

        return Inertia::render('Sales/Create', [
            'shops' => $shops
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        // Validation
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'items'   => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty'        => 'required|integer|min:1',
            'items.*.price'      => 'required|numeric|min:0',
            //'customer' => 'nullable|string', // if you want customer info
        ]);

        DB::beginTransaction();
        try {
            $shop = Shop::findOrFail($validated['shop_id']);
            
            // Create the Sale
            $sale = Sale::create([
                'shop_id' => $shop->id,
                'sale_date' => now(),
                'total'   => $request->input('total', 0),
                'created_user' => Auth::user()->id
                //'customer' => $request->input('customer'), // add if needed
            ]);

            foreach ($validated['items'] as $item) {
                // Attach sale items
                SaleItem::create([
                    'shop_id' => $shop->id,
                    'sale_id'    => $sale->id,
                    'product_id' => $item['product_id'],
                    'qty'        => $item['qty'],
                    'price'      => $item['price'],
                    'created_user' => Auth::user()->id
                ]);

                // Update inventory - decrement stock in product_shop
                $affected = DB::table('product_shop')
                    ->where('product_id', $item['product_id'])
                    ->where('shop_id', $shop->id)
                    ->where('stock', '>=', $item['qty'])  // prevent over-selling
                    ->decrement('stock', $item['qty']);

                // if ($affected === 0) {
                //     // Not enough stock
                //     throw new \Exception("Not enough stock for product ID {$item['product_id']} in shop {$shop->name}");
                // }
            }

            DB::commit();
            return redirect()->route('sales.create')->with('success', 'Sale recorded successfully!');
        } catch (\Throwable $e) {
            DB::rollback();
            // Optionally, log error
            dd($e->getMessage());
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }
}
