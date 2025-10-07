<?php
namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\Ingredient;
use App\Models\Unit;
use App\Models\Sale;
use App\Models\Inventory;
use App\Models\Purchase;
use App\Models\Product;
use App\Models\IngredientProduct;
use App\Models\ProductWastage;

/**
 * InventoryReportService
 *
 * Provides inventory in/out movements for a given shop and date range.
 */
class InventoryReportService
{
    /**
     * Get inventory movements for shop between from..to (inclusive)
     *
     * Returns array of rows:
     * [
     *   date,
     *   type, // 'IN' | 'OUT'
     *   reference,
     *   product_id|null,
     *   product_name|null,
     *   ingredient_id,
     *   ingredient_name,
     *   unit_id,
     *   unit_symbol,
     *   qty, // quantity in ingredient base unit (positive)
     *   sale_price|null, // price per product if applicable
     *   cost|null, // unit cost or total cost (as available)
     *   reason,
     *   remark
     * ]
     */
    public static function getMovements(int $shopId, Carbon $from, Carbon $to, $paginate = null)
    {
        // 1) Purchases => inventory rows where reason = 'Purchase' (incoming)
        $purchaseRows = DB::table('inventories as inv')
            ->join('ingredients as ing', 'ing.id', '=', 'inv.ingredient_id')
            ->leftJoin('units as u', 'u.id', '=', 'inv.unit_id')
            ->leftJoin('purchases as p', 'p.id', '=', 'inv.reference') // if you store purchase id in reference
            ->selectRaw("
                inv.created_at as date,
                'IN' as type,
                COALESCE(inv.reference, '') as reference,
                NULL as product_id,
                NULL as product_name,
                inv.ingredient_id,
                ing.name as ingredient_name,
                inv.unit_id,
                COALESCE(u.symbol, '') as unit_symbol,
                ABS(inv.change) as qty, -- should be positive for IN
                NULL as sale_price,
                inv.unit_cost as cost,
                inv.total_cost as total_cost,
                COALESCE(inv.reason, 'Purchase') as reason,
                COALESCE(inv.remark,'') as remark
            ")
            ->where('inv.shop_id', $shopId)
            ->where('inv.reason', 'Purchase')
            ->whereBetween('inv.created_at', [$from, $to]);

        // 2) Sales consumption from recipes (OUT)
        // We'll build these movements by joining sale_items -> sale -> product -> ingredient_product -> ingredient
        // For each sale_item we compute recipe quantity * sale_item.qty in ingredient base unit.
        $saleRecipeRows = DB::table('sale_items as si')
            ->join('sales as s', 's.id', '=', 'si.sale_id')
            ->join('products as pdt', 'pdt.id', '=', 'si.product_id')
            ->join('ingredient_product as ip', 'ip.product_id', '=', 'si.product_id')
            ->join('ingredients as ing', 'ing.id', '=', 'ip.ingredient_id')
            ->leftJoin('units as u', 'u.id', '=', 'ing.unit_id')
            ->selectRaw("
                s.created_at as date,
                'OUT' as type,
                s.voucher as reference,
                si.product_id as product_id,
                pdt.name as product_name,
                ip.ingredient_id,
                ing.name as ingredient_name,
                ing.unit_id as unit_id,
                COALESCE(u.symbol,'') as unit_symbol,
                ABS( (ip.quantity * si.qty) ) as qty, -- this qty must be converted to ingredient base unit if ip.unit_id differs
                si.price as sale_price,
                NULL as cost,
                'Sales' as reason,
                NULL as remark
            ")
            ->where('s.shop_id', $shopId)
            ->whereBetween('s.created_at', [$from, $to])
            ->where('ip.isdeleted', false)
            ->where('ip.isactive', true);

        // NOTE: The SQL above uses ip.quantity * si.qty, but ip.quantity may be in ip.unit_id different from ingredient.unit_id.
        // We will convert quantity values in PHP after fetching rows using Unit::convert() to the ingredient base unit.

        // 3) Wastage rules (product_wastages) applied per sale
        // We'll compute wastage per sale in PHP (fetch product_wastages and compute per sale_item)
        // For simplicity, fetch sale_items + sale header and compute wastage rows in PHP below.

        // 4) Inventories other reasons (adjustments, manual) — include them too as IN/OUT depending on sign
        $otherInvRows = DB::table('inventories as inv')
            ->join('ingredients as ing', 'ing.id', '=', 'inv.ingredient_id')
            ->leftJoin('units as u', 'u.id', '=', 'inv.unit_id')
            ->selectRaw("
                inv.created_at as date,
                CASE WHEN inv.change > 0 THEN 'IN' ELSE 'OUT' END as type,
                COALESCE(inv.reference,'') as reference,
                NULL as product_id,
                NULL as product_name,
                inv.ingredient_id,
                ing.name as ingredient_name,
                inv.unit_id,
                COALESCE(u.symbol,'') as unit_symbol,
                ABS(inv.change) as qty,
                NULL as sale_price,
                inv.unit_cost as cost,
                COALESCE(inv.reason,'Adjustment') as reason,
                COALESCE(inv.remark,'') as remark
            ")
            ->where('inv.shop_id', $shopId)
            ->whereNotIn('inv.reason', ['Purchase']) // purchases already included
            ->whereBetween('inv.created_at', [$from, $to]);

        // Combine queries with unionAll
        $union = $purchaseRows->unionAll($saleRecipeRows)->unionAll($otherInvRows);

        // Execute raw query to get rows
        $rows = $union->orderBy('date', 'desc')->get();

        // Convert qtys to ingredient base unit in PHP if necessary:
        // We need ip.unit_id -> ip.quantity conversion if ip.unit_id != ingredient.unit_id
        // Also for inventories, inv.unit_id may differ from ingredient.unit_id — convert inv.change accordingly.
        // We'll use Unit::convert(amount, fromUnitId, toUnitId).
        // Because Unit::convert() is PHP function, we loop through results and convert.

        // collect unit cache
        $unitCache = [];
        $ingredientCache = Ingredient::select('id','unit_id','name')->get()->keyBy('id');

        $converted = [];
        foreach ($rows as $r) {
            $ingredientId = $r->ingredient_id;
            $ingredient = $ingredientCache[$ingredientId] ?? null;
            $targetUnitId = $ingredient ? $ingredient->unit_id : $r->unit_id;

            $fromUnitId = $r->unit_id ?? $targetUnitId;
            $qty = (float)$r->qty;

            // If fromUnitId differs from ingredient.unit_id, convert
            if ($fromUnitId && $targetUnitId && $fromUnitId != $targetUnitId) {
                // call Unit::convert (you must have this helper)
                try {
                    $qtyConverted = Unit::convert((float)$qty, (int)$fromUnitId, (int)$targetUnitId);
                } catch (\Throwable $e) {
                    // fallback: use qty raw
                    $qtyConverted = $qty;
                }
            } else {
                $qtyConverted = $qty;
            }

            $converted[] = (object)[
                'date' => $r->date,
                'type' => $r->type,
                'reference' => $r->reference,
                'product_id' => $r->product_id,
                'product_name' => $r->product_name,
                'ingredient_id' => $r->ingredient_id,
                'ingredient_name' => $r->ingredient_name,
                'unit_id' => $targetUnitId,
                'unit_symbol' => Unit::find($targetUnitId)?->symbol ?? $r->unit_symbol,
                'qty' => (float) $qtyConverted,
                'sale_price' => $r->sale_price,
                'cost' => $r->cost ?? $r->total_cost ?? null,
                'reason' => $r->reason,
                'remark' => $r->remark,
            ];
        }

        // 5) Wastage: calculate product wastage per sale and append as OUT rows
        $saleItems = DB::table('sale_items as si')
            ->join('sales as s', 's.id', '=', 'si.sale_id')
            ->select('si.*','s.voucher','s.created_at','s.shop_id')
            ->where('s.shop_id', $shopId)
            ->whereBetween('s.created_at', [$from, $to])
            ->get();

        // pre-load wastage rules by product
        $wastageRules = DB::table('product_wastages as pw')
            ->join('ingredients as ing', 'ing.id', '=', 'pw.ingredient_id')
            ->select('pw.*','ing.unit_id as ingredient_unit_id','ing.name as ingredient_name')
            ->where('pw.is_active', true)
            ->get()
            ->groupBy('product_id');

        foreach ($saleItems as $si) {
            $productId = $si->product_id;
            $rulesForProduct = $wastageRules[$productId] ?? null;
            if (! $rulesForProduct) continue;

            foreach ($rulesForProduct as $rule) {
                $soldQty = (float)$si->qty;
                // proportional approach
                $times = $soldQty / (float)$rule->per_qty;
                $totalWastageInRuleUnit = (float)$rule->wastage_qty * $times;
                if ($totalWastageInRuleUnit <= 0) continue;

                // convert from rule.unit_id to ingredient_unit_id
                $base_qty = Unit::convert($totalWastageInRuleUnit, (int)$rule->unit_id, (int)$rule->ingredient_unit_id);

                $converted[] = (object)[
                    'date' => $si->created_at,
                    'type' => 'OUT',
                    'reference' => $si->voucher ?? $si->sale_id,
                    'product_id' => $si->product_id,
                    'product_name' => DB::table('products')->where('id',$si->product_id)->value('name'),
                    'ingredient_id' => $rule->ingredient_id,
                    'ingredient_name' => $rule->ingredient_name,
                    'unit_id' => $rule->ingredient_unit_id,
                    'unit_symbol' => Unit::find($rule->ingredient_unit_id)?->symbol ?? '',
                    'qty' => (float)$base_qty,
                    'sale_price' => $si->price,
                    'cost' => null,
                    'reason' => 'Wastage',
                    'remark' => $rule->remark ?? null,
                ];
            }
        }

        // Sort converted by date desc
        usort($converted, function($a,$b){
            return strtotime($b->date) <=> strtotime($a->date);
        });

        // If paginate desired, slice here. Otherwise return all.
        if ($paginate && is_int($paginate)) {
            $page = request()->get('page', 1);
            $perPage = $paginate;
            $offset = ($page - 1) * $perPage;
            $paged = array_slice($converted, $offset, $perPage);
            // build LengthAwarePaginator if you want; for brevity return sliced and totals
            $total = count($converted);
            return [
                'data' => $paged,
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $page,
            ];
        }

        return $converted;
    }
}
