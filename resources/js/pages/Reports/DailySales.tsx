"use client";
import React, { useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns"; // optional — or use toLocaleString
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";

// If you don't want date-fns, use new Date(...).toLocaleDateString()

export default function DailySales() {
  const { summary, topProducts, filters } = usePage().props as any;

  // build chart data for a library (e.g., recharts) — if you have recharts installed
  const chartData = useMemo(() => {
    return summary.map((s: any) => ({
      date: s.date,
      gross_sales: Number(s.gross_sales),
      sales_count: Number(s.sales_count),
      items_sold: Number(s.items_sold),
    }));
  }, [summary]);

  const breadcrumbs: BreadcrumbItem[] = [
      { title: 'Report', href: '' },
      { title: 'Daily Sales Report', href: '/reports/daily-sales' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Daily Sales Report" />
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <form className="flex gap-2" method="get" action={route('reports.daily_sales')}>
              <Input type="date" name="from" defaultValue={filters.from} />
              <Input type="date" name="to" defaultValue={filters.to} />
              <select name="shop_id" defaultValue={filters.shop_id ?? ""} className="rounded border px-2">
                <option value="">All shops</option>
                {/* inject your shops list into Inertia props if needed */}
              </select>
              <Button type="submit">Filter</Button>
              <a href={route('reports.daily_sales_export', { from: filters.from, to: filters.to, shop_id: filters.shop_id })} className="ml-2">
                <Button variant="outline">Export CSV</Button>
              </a>
            </form>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Total Days</div>
              <div className="text-2xl font-semibold">{summary.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Total Sales</div>
              <div className="text-2xl font-semibold">
                {summary.reduce((s: number, r: any) => s + Number(r.gross_sales), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">Total Items</div>
              <div className="text-2xl font-semibold">
                {summary.reduce((s: number, r: any) => s + Number(r.items_sold), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <h3 className="text-lg font-medium mb-2">Daily Breakdown</h3>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-right">Sales Count</th>
                    <th className="p-2 text-right">Items Sold</th>
                    <th className="p-2 text-right">Gross Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((r: any, i: number) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{r.date}</td>
                      <td className="p-2 text-right">{r.sales_count}</td>
                      <td className="p-2 text-right">{r.items_sold}</td>
                      <td className="p-2 text-right">{Number(r.gross_sales).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-lg font-medium mb-2">Top Products</h3>
            <ol className="list-decimal pl-5">
              {topProducts.map((p: any) => (
                <li key={p.product_id} className="flex justify-between">
                  <div>{p.name}</div>
                  <div>{Number(p.qty_sold).toLocaleString()}</div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
