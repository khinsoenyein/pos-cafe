import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

type Product = {
    id: number;
    name: string;
    sku?: string;
    pivot: {
        price: number;
    };
};

type Shop = {
    id: number;
    name: string;
    products: Product[];
};

type PageProps = {
    shops: Shop[];
    errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Sales', href: '/sales' },
];

export default function Sales() {
    const { shops, errors } = usePage<PageProps>().props;

    // Chosen shop (default to first)
    const [shopId, setShopId] = useState(shops[0]?.id ?? 0);
    // Find current shop data
    const currentShop = shops.find(s => s.id == shopId);

    // Sale Items
    const [items, setItems] = useState<
        { product_id: number; qty: number; price: number }[]
    >([]);

    // Changing the shop resets selected items
    const handleShopChange = (id: number) => {
        setShopId(id);
        setItems([]);
    };

    // Add new item row (default to first product in current shop)
    const addItem = () => {
        const shopProducts = currentShop?.products || [];
        setItems([
            ...items,
            shopProducts.length > 0
                ? {
                    product_id: shopProducts[0].id,
                    qty: 1,
                    price: shopProducts[0].pivot.price,
                }
                : { product_id: 0, qty: 1, price: 0 },
        ]);
    };

    // Remove an item
    const removeItem = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    // Change item details
    const updateItem = (
        idx: number,
        field: "product_id" | "qty" | "price",
        value: string | number
    ) => {
        let newItems = [...items];
        if (field === "product_id") {
            const selectedProd = currentShop?.products.find((p) => p.id == value);
            newItems[idx] = {
                ...newItems[idx],
                product_id: Number(value),
                price: selectedProd ? selectedProd.pivot.price : 0,
            };
        } else {
            newItems[idx] = { ...newItems[idx], [field]: Number(value) };
        }
        setItems(newItems);
    };

    // Compute total per item and full total
    const subTotal = (item: { qty: number; price: number }) =>
        Number(item.qty) * Number(item.price);
    const grandTotal = items.reduce((t, item) => t + subTotal(item), 0);

    // Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add other fields (customer, etc.) as needed
        router.post(
            "/sales/store",
            {
                shop_id: shopId,
                items, // [{product_id, qty, price}]
                total: grandTotal,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // setForm({ name: '', sku: '', description: '', remark: '' });
                    // setOpen(false);
                    toast.success('Sales created successfully');
                }
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales" />
            <div className="flex flex-col gap-4 p-4 overflow-x-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Sales List</h1>
                </div>

                {/* Sales */}
                <div>
                    <form onSubmit={handleSubmit} className="overflow-x-auto">
                        {/* Shop Selector */}
                        <div>
                            <label className="block mb-1">Shop *</label>
                            <select
                                className="border rounded p-2 w-full"
                                value={shopId}
                                onChange={e => handleShopChange(Number(e.target.value))}
                            >
                                {shops.map(shop => (
                                    <option key={shop.id} value={shop.id}>
                                        {shop.name}
                                    </option>
                                ))}
                            </select>
                            {errors.shop_id && <p className="text-sm text-red-600 mt-1">{errors.shop_id}</p>}
                        </div>

                        {/* Sales Items Table */}
                        <div className="overflow-x-auto border border-sidebar-border/70 dark:border-sidebar-border rounded-xl mt-4">
                            <table className="min-w-full table-auto text-left text-sm">
                                <thead className="bg-gray-100 dark:bg-sidebar">
                                    <tr>
                                        <th className="px-4 py-2 border-r">Product</th>
                                        <th className="px-4 py-2 border-r">Price</th>
                                        <th className="px-4 py-2 border-r">Qty</th>
                                        <th className="px-4 py-2">Subtotal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-4 text-center">
                                                Click 'Add Item' to add.
                                            </td>
                                        </tr>
                                    ) : (items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2 border-r">
                                                <select
                                                    className="border rounded p-1"
                                                    value={item.product_id}
                                                    onChange={(e) =>
                                                        updateItem(idx, "product_id", e.target.value)
                                                    }
                                                >
                                                    {currentShop?.products.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {/* {errors.idx.product_id && <p className="text-sm text-red-600 mt-1">{errors.idx.product_id}</p>} */}
                                            </td>
                                            <td className="px-4 py-2 border-r">
                                                <input
                                                    type="number"
                                                    className="border rounded p-1 w-20"
                                                    value={item.price}
                                                    onChange={(e) =>
                                                        updateItem(idx, "price", e.target.value)
                                                    }
                                                // readOnly // Editable only if you want custom prices
                                                />
                                                {/* {errors.idx.price && <p className="text-sm text-red-600 mt-1">{errors.idx.price}</p>} */}
                                            </td>
                                            <td className="px-4 py-2 border-r">
                                                <input
                                                    type="number"
                                                    className="border rounded p-1 w-16"
                                                    min={1}
                                                    value={item.qty}
                                                    onChange={(e) =>
                                                        updateItem(idx, "qty", e.target.value)
                                                    }
                                                />
                                                {/* {errors.idx.qty && <p className="text-sm text-red-600 mt-1">{errors.idx.qty}</p>} */}
                                            </td>
                                            <td className="px-4 py-2 border-r">{subTotal(item).toFixed(2)}</td>
                                            <td className="px-4 py-2 border-r">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeItem(idx)}
                                                >
                                                    Remove
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                    )}
                                </tbody>
                            </table>
                            {errors.items && <p className="text-sm text-red-600 mt-1">{errors.items}</p>}
                        </div>

                        <Button type="button" onClick={addItem} className="mt-2" disabled={!currentShop?.products?.length}>
                            + Add Item
                        </Button>

                        {/* Total */}
                        <div className="text-right text-lg font-bold">
                            Total: <span>{grandTotal.toFixed(2)}</span>
                        </div>

                        {/* Submit */}
                        <div className="text-right">
                            <Button type="submit" variant="default" disabled={items.length === 0}>
                                Complete Sale
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
