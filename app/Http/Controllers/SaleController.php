<?php

namespace App\Http\Controllers;

use App\Helpers\CodeGenerator;
use App\Models\IngredientProduct;
use App\Models\IngredientShop;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Shop;
use App\Models\Unit;
use App\Models\UserShop;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index()
    {
        $eligibleShops = UserShop::where('user_id', Auth::user()->id)->select('shop_id')->get();

        $shops = Shop::with(['products' => function ($q) {
            $q->select('products.id', 'name', 'sku')
            ->where(['products.isdeleted' => '0', 'products.isactive' => '1'])->orderBy('name')
            ->withPivot('price');
        }])->where(['isdeleted' => '0', 'isactive' => '1'])
        ->whereIn('id', $eligibleShops)
        ->orderBy('name')->get();

        return Inertia::render('Sales/Create', [
            'shops' => $shops
        ]);
    }

    public function testing()
    {
        $eligibleShops = UserShop::where('user_id', Auth::user()->id)->select('shop_id')->get()->toArray();

        $shops = Shop::with(['products' => function ($q) {
            $q->select('products.id', 'name', 'sku')
            ->where(['products.isdeleted' => '0', 'products.isactive' => '1'])->orderBy('name')
            ->withPivot('price');
        }])->where(['isdeleted' => '0', 'isactive' => '1'])
        ->whereIn('id', $eligibleShops)
        ->orderBy('name')->get();

        return response()->json([
            'eligibleShops' => $eligibleShops,
            'shops' => $shops
        ]);
    }

    public function create()
    {
        $eligibleShops = UserShop::where('user_id', Auth::user()->id)->select('shop_id')->get();

        $shops = Shop::with(['products' => function ($q) {
            $q->select('products.id', 'name', 'sku', 'image')
            ->wherePivot('isdeleted', false)
            ->wherePivot('isactive', true)
            ->orderBy('name')
            ->withPivot('price');
        }])->where(['isdeleted' => '0', 'isactive' => '1'])
        ->whereIn('id', $eligibleShops)
        ->orderBy('name')->get();

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

            // $voucher_number = CodeGenerator::generateID(Sale::class, $validated['shop_id'], 'shop_id', 'voucher_number', 'S'.$shop->code, 4);

            $sr_no = CodeGenerator::serialNumberGenerator(
            Sale::class, 
            'S',
            'voucher_number', 
            4,
            'shop_id', 
            '=', 
            $validated['shop_id'],
            'sale_date',
            '=',
            date("Y-m-d"));

            $shop_code = $shop->code;
            $voucher_number = $shop_code.'_'.date("ymd").'_'.$sr_no;


            // return response()->json([
            //     'voucher_number' => $voucher_number
            // ]);
            // Create the Sale
            $sale = Sale::create([
                'shop_id' => $shop->id,
                'voucher_number' => $voucher_number,
                'sale_date' => date("Y-m-d"),
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

                $recipes = IngredientProduct::where('shop_id',$shop->id)
                                ->where('product_id', $item['product_id'])
                                ->where('isdeleted', false)
                                ->where('isactive', true)
                                ->with('ingredient')
                                ->get();

                foreach($recipes as $recipe){
                    if (! $recipe->ingredient) {
                        // ingredient missing — skip or throw depending on your policy
                        throw new \Exception("Ingredient (id {$recipe->ingredient_id}) not found for recipe.");
                    }

                    $ingredientUnitId = $recipe->ingredient->unit_id;//base_unit

                    // check unit exists on ingredient
                    if (is_null($ingredientUnitId)) {
                        throw new \Exception("Ingredient (id {$recipe->ingredient_id}) has no unit_id defined.");
                    }

                    // convert recipe quantity to base unit (ingredient unit)
                    $base_qty = Unit::convert((float) $recipe->quantity, (int) $recipe->unit_id, (int) $ingredientUnitId);
                    $qty = $base_qty * (float) $item['qty'];

                    Inventory::create([
                        'shop_id' => $recipe->shop_id,
                        'ingredient_id' => $recipe->ingredient_id,
                        'unit_id' => $ingredientUnitId,
                        'change' => $qty * -1,
                        'reference' => $voucher_number,
                        'reason' => 'Sales',
                        'remark' => '',
                        'created_user' => Auth::user()->id
                    ]);
                }
            }

            DB::commit();
            return response()->json([
                'success' => 'Sale created successfully',
                'voucher_number' => $sale->voucher_number,
            ]);
            // return redirect()->route('sales.create')->with('success', 'Sale recorded successfully!');
        } catch (\Throwable $e) {
            DB::rollback();
            // Optionally, log error
            dd($e->getMessage());
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }

    public function list(){
        return Inertia::render('Sales/SalesList', [
            'sales' => Sale::with(['shop','createdBy'])->get(),
        ]);
    }
}
