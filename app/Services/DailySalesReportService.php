<?php
namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DailySalesReportService
{
    /**
     * Get daily sales summary for a shop (or all shops if shopId null)
     *
     * @param int|null $shopId
     * @param Carbon $from
     * @param Carbon $to
     * @return \Illuminate\Support\Collection
     */
    public static function getDailySummary(?int $shopId, Carbon $from, Carbon $to)
    {
        $query = DB::table('sales as s')
            ->leftJoin('sale_items as si', 'si.sale_id', '=', 's.id')
            ->selectRaw('DATE(s.created_at) as date')
            ->selectRaw('COUNT(DISTINCT s.id) as sales_count')
            ->selectRaw('COALESCE(SUM(si.qty),0) as items_sold')
            ->selectRaw('COALESCE(SUM(si.qty * si.price),0) as gross_sales');

        if ($shopId) {
            $query->where('s.shop_id', $shopId);
        }

        $query->whereBetween('s.created_at', [$from->startOfDay(), $to->endOfDay()])
              ->groupByRaw('DATE(s.created_at)')
              ->orderByRaw('DATE(s.created_at) ASC');

        return $query->get();
    }

    /**
     * Top selling products in range
     */
    public static function topProducts(?int $shopId, Carbon $from, Carbon $to, $limit = 10)
    {
        $q = DB::table('sale_items as si')
            ->join('sales as s', 's.id', '=', 'si.sale_id')
            ->join('products as p', 'p.id', '=', 'si.product_id')
            ->selectRaw('si.product_id, p.name, SUM(si.qty) as qty_sold, SUM(si.qty * si.price) as revenue')
            ->whereBetween('s.created_at', [$from->startOfDay(), $to->endOfDay()])
            ->groupBy('si.product_id', 'p.name')
            ->orderByDesc('qty_sold')
            ->limit($limit);

        if ($shopId) $q->where('s.shop_id', $shopId);

        return $q->get();
    }
}
