<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductShop;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Shop;
use App\Models\UserShop;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $eligibleShops = UserShop::where('user_id', Auth::user()->id)->select('shop_id')->get()->toArray();

        return Inertia::render('Dashboard', [
            'totalSalesToday' => SaleItem::whereIn('shop_id', $eligibleShops)->whereDate('created_at', $today)->sum(DB::raw('qty * price')),
            'totalSales' => SaleItem::whereIn('shop_id', $eligibleShops)->sum(DB::raw('qty * price')),
            'totalQty' => SaleItem::whereIn('shop_id', $eligibleShops)->sum(DB::raw('qty')),
            'sales' => Sale::with(['shop','items.product','createdBy'])->whereIn('shop_id', $eligibleShops)->orderBy('created_at', 'desc')->get(),
            'totalProfit' => '',
            'totalShops' => Shop::whereIn('id', $eligibleShops)->where('isactive', true)->count(),
            'totalProducts' => Product::where('isactive', true)->count(),
            // 'lowStockCount' => ProductShop::where('stock', '<', 10)->where('isdeleted', false)->count(),
            // 'salesByShop' => $this->getSalesByShop($today),
            // 'lowStockProducts' => $this->getLowStockProducts(),
        ]);
    }

    private function getSalesByShop($date)
    {
        return SaleItem::selectRaw('shops.name as shop, SUM(qty * price) as total')
            ->join('shops', 'shops.id', '=', 'sale_items.shop_id')
            ->whereDate('sale_items.created_at', $date)
            ->groupBy('shops.name')
            ->get();
    }

    private function getLowStockProducts()
    {
        return ProductShop::where('stock', '<', 10)
            ->where('isdeleted', false)
            ->with('product:id,name', 'shop:id,name')
            ->get()
            ->map(fn($ps) => [
                'name' => $ps->product->name,
                'stock' => $ps->stock,
                'shop' => $ps->shop->name,
            ]);
    }
}
