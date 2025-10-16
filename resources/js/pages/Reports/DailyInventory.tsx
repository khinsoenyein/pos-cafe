import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Shop, Unit } from '@/types';
import { Head } from '@inertiajs/react';

import { Select, SelectContent, SelectGroup, SelectLabel, SelectValue, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDownIcon, CircleX } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { formatDate, formatDateYmd } from '@/lib/utils';

type Row = {
    id: number;
    name: string;
    opening: number;
    in: number;
    sale: number;
    out: number;
    close: number;
    unit: Unit;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Report', href: '' },
    { title: 'Daily Inventory Report', href: '/reports/daily-inventory' },
];

export default function DailyInventory() {
    const [date, setDate] = useState<Date>(new Date());
    const [shops, setShops] = useState<Shop[] | null>(null);
    const [shopId, setShopId] = useState<number | null>(null);

    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);

    async function fetchReport(d: string) {
        setLoading(true);
        try {
            const res = await fetch(`/reports/daily-inventory?date=${d}&shop_id=${shopId}`, {
                headers: { 'Accept': 'application/json' },
            });
            const data = await res.json();
            setRows(data.rows ?? []);
            setShops(data.shops ?? []);
            setShopId(data.shop_id);
            console.log('shopId:'+data.shop_id);
        } catch (e) {
            console.error(e);
            setRows([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReport(formatDateYmd(date));
    }, [date]);

    function exportCsv() {
        const header = ['Item', 'Open', 'In', 'Sale', 'Close'];
        const csv = [
            header.join(','),
            ...rows.map(r => [escapeCsv(r.name), r.opening, r.in, r.sale, r.close].join(',')),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-inventory-${date}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function escapeCsv(v: any) {
        if (v == null) return '';
        const s = String(v);
        return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ingredients" />
            <div className="flex flex-col gap-4 p-4 overflow-x-auto">
                {/* Table */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h1 className="text-xl font-bold">Daily Report</h1>
                    <div className="flex items-center gap-2">
                        <Select onValueChange={(val) => setShopId(Number(val))} value={shopId?.toString()}>
                            <SelectTrigger className="border rounded p-2 w-full max-w-sm dark:bg-transparent">
                                <SelectValue placeholder="Select Shop" />
                            </SelectTrigger>
                            <SelectContent>
                                {shops?.map((shop) => (
                                    <SelectItem key={shop.id} value={String(shop.id)}>
                                        {shop.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    id="date"
                                    className="w-30 justify-between font-normal"
                                >
                                    {date ? date.toLocaleDateString() : "Select date"}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                        date && setDate(date)
                                        setOpen(false)
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                        <Button onClick={() => fetchReport(formatDateYmd(date))} className="px-3 py-2 bg-primary text-white rounded">Refresh</Button>
                        <Button onClick={exportCsv} className="px-3 py-2 bg-gray-700 text-white rounded">Export CSV</Button>
                    </div>
                </div>

                {loading ? (
                    <div>Loading…</div>
                ) : (
                    <div className="overflow-x-auto bg-white rounded shadow">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-3 py-2 text-left">Item</th>
                                    <th className="px-3 py-2 text-right">Open</th>
                                    <th className="px-3 py-2 text-right">In</th>
                                    <th className="px-3 py-2 text-right">Sale</th>
                                    <th className="px-3 py-2 text-right">Out</th>
                                    <th className="px-3 py-2 text-right">Close</th>
                                    <th className="px-3 py-2 text-left">Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(row => (
                                    <tr key={row.id} className="border-t">
                                        <td className="px-3 py-2">{row.name}</td>
                                        <td className="px-3 py-2 text-right">{Number(row.opening).toLocaleString()}</td>
                                        <td className="px-3 py-2 text-right">{Number(row.in).toLocaleString()}</td>
                                        <td className="px-3 py-2 text-right">{Number(row.sale).toLocaleString()}</td>
                                        <td className="px-3 py-2 text-right">{Number(row.out).toLocaleString()}</td>
                                        <td className="px-3 py-2 text-right">{Number(row.close).toLocaleString()}</td>
                                        <td className="px-3 py-2">{row.unit.symbol}</td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-gray-500">No data for this date.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
