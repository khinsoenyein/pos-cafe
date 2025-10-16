<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\Shop;
use App\Services\DailySalesReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function dailyInventory(Request $request)
    {
        // expect YYYY-MM-DD; default to today
        $date = $request->input('date', date('Y-m-d'));
        $shop_id = $request->input('shop_id', Shop::first()->id);

        // ensure date string is valid (basic)
        try {
            $dayStart = date('Y-m-d 00:00:00', strtotime($date));
            $dayEnd   = date('Y-m-d 23:59:59', strtotime($date));
        } catch (\Throwable $e) {
            abort(400, 'Invalid date');
        }

        // Use Eloquent with conditional aggregates
        $ingredients = Ingredient::query()
            ->select('id', 'name', 'unit_id')
            ->with('unit')
            // Opening = sum(change) for movements before the day
            ->withSum(['inventory as opening' => function ($q) use ($dayStart) {
                $q->where('date', '<', $dayStart);
            }], 'change')
            // Inbound = sum(change) for positive movements on the day
            ->withSum(['inventory as inbound' => function ($q) use ($dayStart) {
                $q->whereDate('date', $dayStart)
                  ->whereIn('reason', ['Purchase','Transfer In']);
            }], 'change')
            ->withSum(['inventory as sale' => function ($q) use ($dayStart) {
                $q->whereDate('date', $dayStart)
                  ->whereIn('reason', ['Sale']);
            }], 'change')
            ->withSum(['inventory as outbound' => function ($q) use ($dayStart) {
                $q->whereDate('date', $dayStart)
                  ->whereIn('reason', ['Transfer Out']);
            }], 'change')
            // Sale = sum of abs(negative change) on the day — use selectSub with CASE
            // ->selectSub(function ($query) use ($date) {
            //     $query->from('inventories')
            //         ->selectRaw("COALESCE(SUM(change), 0)")
            //         ->whereColumn('ingredient_id', 'ingredients.id')
            //         ->whereDate('created_at', $date);
            // }, 'sale')
            ->orderBy('name')
            ->get()
            ->map(function ($row) {
                // withSum returns null if no rows — coalesce to 0 for safety
                $opening = (float) ($row->opening ?? 0);
                $inbound = (float) ($row->inbound ?? 0);
                $sale    = (float) ($row->sale ?? 0);
                $outbound    = (float) ($row->outbound ?? 0);

                $row->close = $opening + $inbound - $outbound - $sale;

                // ensure numeric values are clean
                $row->opening = $opening;
                $row->in = $inbound;
                $row->sale = $sale;
                $row->out = $outbound;

                return $row;
            });

        // Return JSON for API or Inertia page
        if ($request->wantsJson()) {
            return response()->json([
                'date' => $date,
                'rows' => $ingredients,
                'shop_id' => $shop_id == null? Shop::first()->id : $shop_id,
                'shops' => Shop::all(),
            ]);
        }

        return Inertia('Reports/DailyInventory', [
            'date' => $date,
            'rows' => $ingredients,
        ]);

        // return response()->json([
        //     'date' => $date,
        //     'dayStart' => $dayStart,
        //     'dayEnd' => $dayEnd,
        //     'rows' => $ingredients,
        // ]);
    }
}
