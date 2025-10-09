<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\DailySalesReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function dailySales(Request $request)
    {
        $shopId = $request->input('shop_id') ? (int)$request->input('shop_id') : null;
        $from = $request->input('from') ? Carbon::parse($request->input('from')) : Carbon::now()->startOfMonth();
        $to   = $request->input('to')   ? Carbon::parse($request->input('to'))   : Carbon::now();

        $summary = DailySalesReportService::getDailySummary($shopId, $from, $to);
        $topProducts = DailySalesReportService::topProducts($shopId, $from, $to, 10);

        return Inertia::render('Reports/DailySales', [
            'summary' => $summary,
            'topProducts' => $topProducts,
            'filters' => [
                'shop_id' => $shopId,
                'from' => $from->toDateString(),
                'to' => $to->toDateString(),
            ],
        ]);
    }

    public function dailySalesExport(Request $request)
    {
        // reuse service and stream CSV back
        $shopId = $request->input('shop_id') ? (int)$request->input('shop_id') : null;
        $from = Carbon::parse($request->input('from'));
        $to = Carbon::parse($request->input('to'));

        $rows = DailySalesReportService::getDailySummary($shopId, $from, $to);

        $callback = function () use ($rows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['date', 'sales_count', 'items_sold', 'gross_sales']);
            foreach ($rows as $r) {
                fputcsv($handle, [$r->date, $r->sales_count, $r->items_sold, $r->gross_sales]);
            }
            fclose($handle);
        };

        $filename = 'daily_sales_' . $from->format('Ymd') . '_' . $to->format('Ymd') . '.csv';
        return response()->streamDownload($callback, $filename, ['Content-Type' => 'text/csv']);
    }
}
