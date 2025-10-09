<?php

namespace App\Http\Controllers;

use App\Helpers\CodeGenerator;
use App\Models\IngredientProduct;
use App\Models\IngredientShop;
use App\Models\Inventory;
use App\Models\PaymentType;
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
            'shops' => $shops,
            'payment_types' => PaymentType::orderBy('name')->select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());
        // Validation
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'payment_type_id' => 'required|exists:payment_types,id',
            'sub_total'      => 'required|numeric|min:1',
            'discount'      => 'required|numeric|min:0',
            'tax'      => 'required|numeric|min:0',
            'grand_total'      => 'required|numeric|min:1',
            'pay'      => 'required|numeric|min:1',
            'change'      => 'required|numeric|min:0',
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

            $voucher_number = CodeGenerator::serialNumberGenerator(
            Sale::class,
            'S'.$shop->code.'-'.date("ymd").'-',
            'voucher_number',
            4,
            'shop_id',
            '=',
            $validated['shop_id'],
            'sale_date',
            '=',
            date("Y-m-d"));

            // return response()->json([
            //     'voucher_number' => $voucher_number
            // ]);
            // Create the Sale
            $sale = Sale::create([
                'shop_id' => $shop->id,
                'voucher_number' => $voucher_number,
                'sale_date' => date("Y-m-d"),
                'sub_total'   => $request->input('sub_total', 0),
                'discount'   => $request->input('discount', 0),
                'tax'   => $request->input('tax', 0),
                'grand_total'   => $request->input('grand_total', 0),
                'pay'   => $request->input('pay', 0),
                'change'   => $request->input('change', 0),
                'payment_type_id' => $request->input('payment_type_id'),
                'created_user' => Auth::user()->id
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
                        'date' => $sale->sale_date,
                        'change' => $qty * -1,
                        'reference' => $voucher_number,
                        'reason' => 'Sale',
                        'product_id' => $item['product_id'],
                        'remark' => '',
                        'created_user' => Auth::user()->id
                    ]);
                }
            }

            DB::commit();
            return response()->json([
                'success' => 'Sale created successfully',
                // 'voucher_number' => $sale->voucher_number,
                'sale' => Sale::with(['shop','paymentType', 'items.product', 'createdBy'])->where('voucher_number', $sale->voucher_number)->first(),
                // 'items' => $sale->items
            ]);
            // return redirect()->route('sales.create')->with('success', 'Sale recorded successfully!');
        } catch (\Throwable $e) {
            DB::rollback();
            // Optionally, log error
            // dd($e->getMessage());
            // return back()->withErrors(['error' => $e->getMessage()])->withInput();
            return response()->json(['message' => 'Server error', 'detail' => $e->getMessage()], 500);
        }
    }

    public function list(){
        return Inertia::render('Sales/List', [
            'sales' => Sale::with(['shop','paymentType','items.product','createdBy'])->get(),
        ]);
    }
}
