<?php
namespace App\Services;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InventoryValuationService
{
    /**
     * Sum cumulative quantity up to $atDate (inclusive)
     */
    public static function getCumulativeQty(int $shopId, int $ingredientId, Carbon $atDate)
    {
        return (float) DB::table('inventories')
            ->where('shop_id', $shopId)
            ->where('ingredient_id', $ingredientId)
            ->where('created_at', '<=', $atDate)
            ->sum('change');
    }

    /**
     * Sum purchased qty and total cost between dates (inclusive)
     * Assumes purchase entries have reason = 'Purchase' and total_cost stored.
     */
    public static function getPurchasesSummed(int $shopId, int $ingredientId, Carbon $from, Carbon $to)
    {
        $row = DB::table('inventories')
            ->selectRaw('SUM(change) as qty, SUM(total_cost) as total_cost')
            ->where('shop_id', $shopId)
            ->where('ingredient_id', $ingredientId)
            ->where('reason', 'Purchase')
            ->whereBetween('created_at', [$from, $to])
            ->first();

        return [
            'qty' => (float)($row->qty ?? 0),
            'total_cost' => (float)($row->total_cost ?? 0),
        ];
    }

    /**
     * Average purchase cost per unit up to $atDate.
     * avg = sum(total_cost of purchases up to atDate) / sum(qty purchased up to atDate)
     * fallback to ingredient default cost if no purchases before date.
     */
    public static function getAverageCostAt(int $shopId, int $ingredientId, Carbon $atDate)
    {
        $row = DB::table('inventories')
            ->selectRaw('SUM(case when reason = "Purchase" then change else 0 end) as total_qty, SUM(case when reason = "Purchase" then total_cost else 0 end) as total_cost')
            ->where('shop_id', $shopId)
            ->where('ingredient_id', $ingredientId)
            ->where('created_at', '<=', $atDate)
            ->first();

        $qty = (float)($row->total_qty ?? 0);
        $cost = (float)($row->total_cost ?? 0);

        if ($qty > 0.0) {
            return $cost / $qty;
        }

        // fallback: try last purchase unit_cost (latest purchase row before date)
        $last = DB::table('inventories')
            ->where('shop_id', $shopId)
            ->where('ingredient_id', $ingredientId)
            ->whereNotNull('unit_cost')
            ->where('created_at', '<=', $atDate)
            ->orderBy('created_at', 'desc')
            ->first(['unit_cost']);
        if ($last && $last->unit_cost) return (float)$last->unit_cost;

        // final fallback: 0.0
        return 0.0;
    }

    /**
     * Valuation (value of stock) at $atDate = cumulativeQty * avgCostAt
     */
    public static function valuationAt(int $shopId, int $ingredientId, Carbon $atDate)
    {
        $qty = self::getCumulativeQty($shopId, $ingredientId, $atDate);
        $avgCost = self::getAverageCostAt($shopId, $ingredientId, $atDate);
        return $qty * $avgCost;
    }

    /**
     * Compute COGS for a shop in a period [from..to].
     * otherCostsSum optionally passed (or computed from expenses table)
     *
     * Returns array:
     *  [
     *    opening_valuation => float,
     *    purchases_cost => float,
     *    other_costs => float,
     *    closing_valuation => float,
     *    cogs => float
     *  ]
     */
    public static function computeCOGS(int $shopId, Carbon $from, Carbon $to, array $ingredientIds = null, float $otherCosts = null)
    {
        // if ingredientIds is null, compute across all ingredients present in inventories for the shop in range
        $ingredientIds = $ingredientIds ?? DB::table('inventories')
            ->where('shop_id', $shopId)
            ->whereBetween('created_at', [$from, $to])
            ->distinct()
            ->pluck('ingredient_id')
            ->toArray();

        $openingVal = 0.0;
        $purchasesVal = 0.0;
        $closingVal = 0.0;

        foreach ($ingredientIds as $ingredientId) {
            $opening = self::valuationAt($shopId, $ingredientId, $from->copy()->subSecond()); // just before period
            $closing = self::valuationAt($shopId, $ingredientId, $to);
            $purchases = self::getPurchasesSummed($shopId, $ingredientId, $from, $to);

            $openingVal += $opening;
            $closingVal += $closing;
            $purchasesVal += $purchases['total_cost'];
        }

        // otherCosts: if not provided, try to sum from expenses table
        if ($otherCosts === null) {
            $otherCosts = (float) DB::table('expenses')
                ->where('shop_id', $shopId)
                ->whereBetween('expense_date', [$from, $to])
                ->sum('amount');
        }

        $cogs = $openingVal + $purchasesVal + $otherCosts - $closingVal;

        return [
            'opening_valuation' => $openingVal,
            'purchases_cost' => $purchasesVal,
            'other_costs' => $otherCosts,
            'closing_valuation' => $closingVal,
            'cogs' => $cogs,
        ];
    }
}
