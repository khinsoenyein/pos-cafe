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
import { BreadcrumbItem, Ingredient, Shop, Supplier, Unit } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDownIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from "@/lib/utils"

type LineItem = {
    tempId: string; // local key for mapping
    ingredient_id: number | null;
    unit_id: number | null;
    quantity: string; // keep as string for input
    unit_price: string; // string for input like "1.50"
    line_total: number;
    remark?: string;
};

type Props = {
    suppliers: Supplier[];
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

const formatCurrency = (v: number) =>
    v % 1 === 0 ? v.toLocaleString() : v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ---- Component
export default function PurchaseCreate(props: Props) {
    const { suppliers, ingredients, units, shops = [], errors: serverErrors = {} } = props;

    // Header fields
    const [voucher, setVoucher] = useState("");
    const [open, setOpen] = React.useState(false);
    const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(undefined);
    const [supplierId, setSupplierId] = useState<number | null>(suppliers.length ? suppliers[0].id : null);
    const [shopId, setShopId] = useState<number | null>((shops[0]?.id ?? null));
    const [remark, setRemark] = useState('');
    const [otherCostLabel, setOtherCostLabel] = useState('Other Cost');
    const [otherCostAmount, setOtherCostAmount] = useState<string>('0');

    // Line items
    const [items, setItems] = useState<LineItem[]>([
        {
            tempId: cryptoRandomId(),
            ingredient_id: null,
            unit_id: null,
            quantity: '',
            unit_price: '',
            line_total: 0,
        },
    ]);

    const [submitting, setSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string[]>>(serverErrors || {});

    // compute line totals whenever items change
    useEffect(() => {
        setItems((prev) =>
            prev.map((it) => {
                const q = toNumber(it.quantity);
                const up = toNumber(it.unit_price);
                return { ...it, line_total: Number((q * up) || 0) };
            }),
        );
    }, [/* items values already trigger rerender, but we will trigger recalc on change by handlers */]);

    // computed totals
    const itemsTotal = useMemo(() => items.reduce((s, it) => s + (it.line_total || 0), 0), [items]);
    const otherCost = toNumber(otherCostAmount);
    const grandTotal = Number(itemsTotal + otherCost);

    // handlers
    function addItem() {
        setItems((s) => [
            ...s,
            {
                tempId: cryptoRandomId(),
                ingredient_id: null,
                unit_id: null,
                quantity: '',
                unit_price: '',
                line_total: 0,
            },
        ]);
    }
    function removeItem(tempId: string) {
        setItems((s) => s.filter((it) => it.tempId !== tempId));
    }
    function updateItem(tempId: string, patch: Partial<LineItem>) {
        setItems((s) =>
            s.map((it) => {
                if (it.tempId !== tempId) return it;
                const updated = { ...it, ...patch };
                const q = toNumber(updated.quantity);
                const up = toNumber(updated.unit_price);
                updated.line_total = Number((q * up) || 0);
                return updated;
            }),
        );
    }

    // submit
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        setSubmitting(true);
        setFormErrors({});

        const data = new FormData();
        data.append('voucher', voucher);
        // data.append('purchase_date', dayjs(purchaseDate).format('YYYY-MM-DD HH:mm:ss'));
        if (supplierId) data.append('supplier_id', String(supplierId));
        if (shopId) data.append('shop_id', String(shopId));
        data.append('remark', remark || '');
        data.append('other_cost_label', otherCostLabel || '');
        // appendNumber(data, 'other_cost_amount', otherCost);

        // append items as JSON string or individual fields depending on backend expectation
        // Here we send as JSON string array
        const cleanedItems = items
            .filter((it) => it.ingredient_id) // skip blank ingredient rows
            .map((it) => ({
                ingredient_id: it.ingredient_id,
                unit_id: it.unit_id,
                quantity: toNumber(it.quantity),
                unit_price: toNumber(it.unit_price),
                line_total: it.line_total,
                remark: it.remark ?? '',
            }));

        data.append('items', JSON.stringify(cleanedItems));

        // Using Inertia router.post; route name 'purchases.store' — adapt to your routes
        router.post(route('purchases.store'), data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Purchase saved');
                // optionally redirect or reset form
                // resetForm();
            },
            onError: (err) => {
                // Inertia returns validation errors as object
                // setFormErrors(err || {});
            },
            onFinish: () => setSubmitting(false),
        });
    };

    // small helper to find unit symbol
    const findUnitSymbol = (id: number | null | undefined) => units.find((u) => u.id === id)?.symbol ?? '';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Purchase', href: '/purchases/list' },
        { title: 'Create Purchase', href: '/purchases/create' },
    ];

    return (
        <div className="space-y-6 p-6 rounded-lg border shadow-sm bg-white dark:bg-slate-900">
      {/* Title */}
      <h2 className="text-xl font-semibold">New Purchase</h2>

      {/* Purchase Voucher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voucher">Voucher Number</Label>
          <Input id="voucher" placeholder="Enter voucher number" />
        </div>

        {/* Purchase Date with Popover + Calendar */}
        <div className="space-y-2">
          <Label>Purchase Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !purchaseDate && "text-muted-foreground"
                )}
              >
                {purchaseDate ? purchaseDate.toDateString() : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={purchaseDate}
                onSelect={setPurchaseDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Supplier */}
      <div className="space-y-2">
        <Label>Supplier</Label>
        <Select value={supplierId ? String(supplierId) : ''} onValueChange={(v) => setSupplierId(v ? Number(v) : null)}>
            <SelectTrigger className="border rounded p-2 w-full max-w-sm dark:bg-transparent"><SelectValue placeholder="Select supplier" /></SelectTrigger>
            <SelectContent>
                {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={String(supplier.id)}>
                    {supplier.name}
                </SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>

      {/* Ingredients Section */}
      <div className="space-y-4">
        <h3 className="font-medium">Ingredients</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Ingredient</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select ingredient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Coffee Beans</SelectItem>
                <SelectItem value="2">Milk</SelectItem>
                <SelectItem value="3">Sugar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Unit</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Kg</SelectItem>
                <SelectItem value="2">Litre</SelectItem>
                <SelectItem value="3">Pack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input type="number" placeholder="0" />
          </div>

          <div className="space-y-2">
            <Label>Other Cost</Label>
            <Input type="number" placeholder="0" />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit">Save Purchase</Button>
      </div>
    </div>
    );
}

// small util to generate unique id
function cryptoRandomId() {
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID();
    return String(Date.now()) + Math.random().toString(36).slice(2, 9);
}
