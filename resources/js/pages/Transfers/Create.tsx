// src/Pages/PurchaseCreate.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { BreadcrumbItem, Ingredient, PurchaseLineItem, Shop, Supplier, TransferLineItem, Unit } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDownIcon, CircleX } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { formatNumber } from '@/lib/utils';
import { datetime } from 'node_modules/zod/v4/core/regexes.cjs';
import ConfirmDialog from '@/components/ConfirmDialog';

type Props = {
    ingredients: Ingredient[];
    units: Unit[];
    shops?: Shop[];
    errors?: Record<string, string[]>;
};

const toNumber = (v: string | number | null | undefined) => {
    if (v === null || v === undefined || v === '') return 0;
    const n = Number(String(v).replace(/,/g, ''));
    return Number.isFinite(n) ? n : 0;
};

// ---- Component
export default function PurchaseCreate(props: Props) {
    const { ingredients, units, shops = [], errors = {} } = props;

    // Header fields
    const [voucher, setVoucher] = useState("");
    const [open, setOpen] = React.useState(false);
    const [transferDate, setTransferDate] = useState<Date>(new Date());
    const [fromShopId, setFromShopId] = useState<number | null>((shops[0]?.id ?? null));
    const [toShopId, setToShopId] = useState<number | null>((shops[0]?.id ?? null));
    const [remark, setRemark] = useState('');
    const [otherCostAmount, setOtherCostAmount] = useState<number>(0);

    // Line items
    const [items, setItems] = useState<TransferLineItem[]>([
        {
            tempId: cryptoRandomId(),
            ingredient_id: null,
            unit_id: null,
            quantity: 0,
        },
    ]);

    const [submitting, setSubmitting] = useState(false);
    // const [formErrors, setFormErrors] = useState<Record<string, string[]>>(serverErrors || {});

    // computed totals
    const qtyTotal = useMemo(() => items.reduce((s, it) => s + (it.quantity || 0), 0), [items]);
    const otherCost = toNumber(otherCostAmount);

    // handlers
    function addItem() {
        setItems((s) => [
            ...s,
            {
                tempId: cryptoRandomId(),
                ingredient_id: null,
                unit_id: null,
                quantity: 0,
            },
        ]);
    }
    function removeItem(tempId: string) {
        setItems((s) => s.filter((it) => it.tempId !== tempId));
    }

    function updateItem(tempId: string, patch: Partial<TransferLineItem>) {
        setItems((s) =>
            s.map((it) => {
                if (it.tempId !== tempId) return it;
                const updated = { ...it, ...patch };
                const q = toNumber(updated.quantity);
                return updated;
            }),
        );
    }

    // submit
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setSubmitting(true);
        // setFormErrors({});

        const cleanedItems = items
            .filter((it) => it.ingredient_id && it.unit_id) // skip blank ingredient rows
            .map((it) => ({
                ingredient_id: it.ingredient_id,
                unit_id: it.unit_id,
                qty: toNumber(it.quantity),
            }));

        router.post(route('transfer.store'), {
                transfer_date: transferDate,
                from_shop_id: fromShopId,
                to_shop_id: toShopId,
                total_qty: qtyTotal,
                other_cost: otherCostAmount,
                items: cleanedItems
            }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Transfer saved');
                resetForm();
            },
            onError: (err) => {
                // Inertia returns validation errors as object
                // setFormErrors(err || {});
            },
            onFinish: () => setSubmitting(false),
        });
    };

    const resetForm = () => {
        setTransferDate(new Date()) // reset to current date
        setFromShopId(null)
        setToShopId(null)

        setItems([])
        addItem()
        setOtherCostAmount(0)
        setRemark("")
    }

    // small helper to find unit symbol
    const findUnitSymbol = (id: number | null | undefined) => units.find((u) => u.id === id)?.symbol ?? '';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Transfer', href: '/transfer/list' },
        { title: 'Create Transfer', href: '/transfer/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Transfer" />

            <div className="p-4 space-y-4">
                {/* Header card */}
                <Card>
                    <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* <div>
                            <Label className="text-sm block mb-1">Voucher</Label>
                            <Input value={voucher} onChange={(e) => setVoucher(e.target.value)} className="w-full" />
                            {formErrors.voucher && <p className="text-red-500 text-sm mt-1">{formErrors.voucher.join(', ')}</p>}
                        </div> */}

                        <div>
                            <Label className="text-sm block mb-1">From Shop</Label>
                            <Select value={fromShopId ? String(fromShopId) : ''} onValueChange={(v) => setFromShopId(v ? Number(v) : null)}>
                                <SelectTrigger className="border rounded p-2 w-full max-w-sm dark:bg-transparent"><SelectValue placeholder="Select shop" /></SelectTrigger>
                                <SelectContent>
                                    {shops.map((shop) => (
                                    <SelectItem key={shop.id} value={String(shop.id)}>
                                        {shop.name}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.from_shop_id && <p className="text-sm text-red-600 italic mt-1">{errors.from_shop_id}</p>}
                        </div>

                        <div>
                            <Label className="text-sm block mb-1">To Shop</Label>
                            <Select value={toShopId ? String(toShopId) : ''} onValueChange={(v) => setToShopId(v ? Number(v) : null)}>
                                <SelectTrigger className="border rounded p-2 w-full max-w-sm dark:bg-transparent"><SelectValue placeholder="Select shop" /></SelectTrigger>
                                <SelectContent>
                                    {shops.map((shop) => (
                                    <SelectItem key={shop.id} value={String(shop.id)}>
                                        {shop.name}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.to_shop_id && <p className="text-sm text-red-600 italic mt-1">{errors.to_shop_id}</p>}
                        </div>

                        <div>
                            <Label className="text-sm block mb-1">Transfer Date</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date"
                                        className="w-full justify-between font-normal"
                                    >
                                        {transferDate ? transferDate.toLocaleDateString() : "Select date"}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={transferDate}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            date && setTransferDate(date)
                                            setOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.transfer_date && <p className="text-sm text-red-600 italic mt-1">{errors.transfer_date}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Items table */}
                <Card>
                    <CardContent>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-medium">Items</h3>
                            <div className="flex gap-2">
                                <Button onClick={addItem}>+ Add Item</Button>
                                <Button className="border bg-red-500 hover:bg-red-400" onClick={() => { setItems((s) => s.filter((it) => it.ingredient_id)); }}>Remove empty</Button>
                            </div>
                        </div>

                        <div className="overflow-auto">
                            <table className="min-w-full text-sm">
                                <thead className="text-left">
                                    <tr>
                                        <th className="px-2 py-1">Ingredient</th>
                                        <th className="px-2 py-1">Unit</th>
                                        <th className="px-2 py-1">Qty</th>
                                        <th className="px-2 py-1">Remark</th>
                                        <th className="px-2 py-1">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.map((it) => (
                                        <tr key={it.tempId} className="border-t">
                                            <td className="px-2 py-2 w-1/3">
                                                <Select value={it.ingredient_id ? String(it.ingredient_id) : ''} onValueChange={(v) => updateItem(it.tempId, { ingredient_id: v ? Number(v) : null })}>
                                                    <SelectTrigger className="border rounded p-2 w-full"><SelectValue placeholder="Select ingredient" /></SelectTrigger>
                                                    <SelectContent>
                                                        {ingredients.map((ingredient) => (
                                                            <SelectItem key={ingredient.id} value={String(ingredient.id)}>
                                                                {ingredient.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </td>

                                            <td className="px-2 py-2 w-1/5">
                                                <Select value={it.unit_id ? String(it.unit_id) : ''} onValueChange={(v) => updateItem(it.tempId, { unit_id: v ? Number(v) : null })}>
                                                    <SelectTrigger className="border rounded p-2 w-full"><SelectValue placeholder="Unit" /></SelectTrigger>
                                                    <SelectContent>
                                                        {units.map((unit) => (
                                                            <SelectItem key={unit.id} value={String(unit.id)}>
                                                                {unit.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </td>

                                            <td className="px-2 py-2 w-1/5">
                                                <Input type="number" value={it.quantity} onChange={(e) => updateItem(it.tempId, { quantity: parseFloat(e.target.value) })} className="w-full" />
                                            </td>

                                            <td className="px-2 py-2 w-1/5">
                                                <Input name="remark" type="text" value={it.remark} onChange={(e) => updateItem(it.tempId, { remark: String(e) })} className="w-full" placeholder="Remark" />
                                            </td>

                                            <td className="px-2 py-2 w-1/3">
                                                <div className="flex gap-2">
                                                    <Button className="border border-red-500 hover:bg-red-200" variant="ghost" onClick={() => removeItem(it.tempId)}>
                                                        <CircleX className="text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="mt-4 flex justify-end gap-6">
                            <div className="text-right">
                                <div className="text-sm text-muted-foreground">Total Qty</div>
                                {/* <div className="font-medium">{formatNumber(itemsTotal)}</div> */}
                                <Input value={formatNumber(qtyTotal)} className="w-30 text-right" disabled />
                            </div>

                            <div className="text-right">
                                <div className="text-sm text-muted-foreground">Other Cost</div>
                                <Input type="number" value={otherCostAmount} onChange={(e) => setOtherCostAmount(parseInt(e.target.value))} className="w-30 text-right" />
                            </div>
                        </div>

                        {errors.items && <p className="text-sm text-red-600 italic mt-1">{errors.items}</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="text-sm block mb-1">Remark</label>
                            <Textarea value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Remark" />
                        </div>

                        {/* <div>
                            <label className="text-sm block mb-1">Other cost label</label>
                            <Input value={otherCostLabel} onChange={(e) => setOtherCostLabel(e.target.value)} />
                        </div> */}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                    {/* <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Saving...' : 'Save Purchase'}</Button> */}
                    <ConfirmDialog
                        title="Save transfer?"
                        description="Are you sure you want to save this purchase?"
                        confirmLabel="Save"
                        cancelLabel="Cancel"
                        trigger={<Button className="bg-green-600 hover:bg-green-500" disabled={submitting}>{submitting ? 'Saving...' : 'Save Transfer'}</Button>}
                        onConfirm={async () => {
                            // call your submit handler here (can be async)
                            await handleSubmit(); // your existing submit function
                        }}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

// small util to generate unique id
function cryptoRandomId() {
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID();
    return String(Date.now()) + Math.random().toString(36).slice(2, 9);
}
