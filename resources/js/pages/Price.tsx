import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatNumber } from '@/lib/utils';
import { toast } from 'sonner';

import type { Shop, Product, ProductShop, ShopWithProducts, ProductWithPivot } from '@/types';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectValue, SelectItem, SelectTrigger } from '@/components/ui/select';
import { CircleCheck, CircleX } from 'lucide-react';

export type ProductShopSetupPageProps = {
    shops: Shop[];                          // List of all shops
    availableProducts: Product[];                 // List of all products (for the dropdown)
    currentShopWithProducts: ShopWithProducts | null; // The selected shop with its pivot products
    errors: Record<string, string | string[]>; // For Inertia errors
};

const breadcrumbs = [
    { title: 'Master', href: '' },
    { title: 'Price by Shop', href: '/product-shop' },
];

export default function ProductShopSetup() {
    const { shops, availableProducts, currentShopWithProducts, errors } = usePage<ProductShopSetupPageProps>().props;

    useEffect(() => {
        router.reload({ only: ['shops', 'availableProducts', 'currentShopWithProducts'] });
    }, []);

    const [shopId, setShopId] = useState<number | ''>(currentShopWithProducts?.id || shops[0]?.id || '');
    const [productId, setProductId] = useState<number | null>(null);
    const [editingProductName, setEditingProductName] = useState<String | null>(null);

    const [form, setForm] = useState({ price: '' });

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editDialog, setEditDialog] = useState(false);
    const [editing, setEditing] = useState<ProductWithPivot | null>(null);

    const handleShopChange = (shopId: string) => {
        const newShopId = Number(shopId);
        setShopId(newShopId);
        setProductId(null);
        setForm({ price: '' });
        router.get(
            route('price.index'),
            { shop_id: newShopId },
            { preserveScroll: true, preserveState: false }
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!shopId) {
            toast.error('Please select a shop first.');
            return;
        }
        if (!productId) {
            toast.error('Please select a product first.');
            return;
        }
        if (form.price === '') {
            toast.error('Please fill price.');
            return;
        }

        setIsSubmitting(true);

        router.post(
            route('price.store'),
            {
                shop_id: shopId,
                product_id: productId,
                price: form.price,
            },
            {
                onSuccess: () => {
                    toast.success('Product added to shop!');
                    setOpen(false);
                    setForm({ price: '' });
                    setProductId(null);
                    router.reload({ only: ['currentShopWithProducts'] });
                },
                onError: (err) => {
                    console.error('Submission error:', err);
                    const errorMessage = Object.values(err).flat().join('\n') || 'Failed to save product setup.';
                    toast.error(errorMessage);
                },
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        setIsSubmitting(true);

        router.put(`/price/${editing.id}`, {
            shop_id: shopId,
            product_id: productId,
            price: form.price,
        }, {
            onSuccess: () => {
                toast.success('Product updated');
                setEditDialog(false);
                setEditing(null);
                setEditingProductName(null);
                setProductId(null);
                setForm({ price: '' });
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const openEditDialog = (item: ProductWithPivot) => {
        setProductId(item.pivot.product_id)
        setEditing(item);
        setEditingProductName(item.name)
        setForm({
            price: String(item.pivot.price),
        });
        setEditDialog(true);
    };

    const toggleStatus = (product: ProductWithPivot) => {
        const shop_id = product.pivot.shop_id;
        const product_id = product.pivot.product_id;

        router.get(`/price/status`, {
            shop_id: shop_id,
            product_id: product_id,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['currentShopWithProducts'] });
                toast.success('Status updated')
            },
            onError: () => toast.warning('Status Error'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Shop Setup" />

            <div className="p-4 space-y-4">
                <h1 className="text-2xl font-bold">Price by Shop</h1>
                <p className="text-gray-600">Setup product price by shop</p>

                <div className="flex gap-4 items-center">
                    <Select onValueChange={handleShopChange} value={shopId?.toString()}>
                        <SelectTrigger className="border rounded p-2 w-full max-w-sm dark:bg-transparent">
                            <SelectValue placeholder="Select Shop" />
                        </SelectTrigger>
                        <SelectContent>
                            {shops.map((shop) => (
                            <SelectItem key={shop.id} value={String(shop.id)}>
                                {shop.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    
                    <Select onValueChange={(val) => setProductId(Number(val))} value={productId?.toString()}>
                        <SelectTrigger className="border rounded p-2 w-full max-w-sm dark:bg-transparent">
                            <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableProducts.map((product) => (
                            <SelectItem key={product.id} value={String(product.id)}>
                                {product.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!shopId || !productId}>Add</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Product to Shop</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="text-sm">
                                    <div className="mb-2"><strong>Shop:</strong> {shops.find(s => s.id === shopId)?.name || '-'}</div>
                                    <div className="mb-2"><strong>Product:</strong> {availableProducts.find(p => p.id === productId)?.name || '-'}</div>
                                </div>

                                <div>
                                    <Input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        placeholder="Price"
                                        required
                                        className="border rounded p-2 w-full"
                                    />
                                    {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                                </div>

                                {/* <div>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        placeholder="Stock"
                                        required
                                        className="border rounded p-2 w-full"
                                    />
                                    {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock}</p>}
                                </div> */}

                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Dialog */}
                    <Dialog open={editDialog} onOpenChange={setEditDialog}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Edit Price</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="text-sm">
                                    <div className="mb-2"><strong>Shop:</strong> {shops.find(s => s.id === shopId)?.name || '-'}</div>
                                    {errors.shop_id && <p className="text-sm text-red-600 mt-1">{errors.shop_id}</p>}
                                    <div className="mb-2"><strong>Product:</strong> {editingProductName}</div>
                                    {errors.product_id && <p className="text-sm text-red-600 mt-1">{errors.product_id}</p>}
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        placeholder="Price"
                                        required
                                        className="border rounded p-2 w-full"
                                    />
                                    {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                                </div>

                                {/* <div>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        placeholder="Stock"
                                        required
                                        className="border rounded p-2 w-full"
                                        readOnly
                                    />
                                    {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock}</p>}
                                </div> */}

                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Product Shop Table */}
                <div className="overflow-x-auto border border-sidebar-border/70 dark:border-sidebar-border rounded-xl mt-2">
                    <table className="min-w-full table-auto text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-sidebar">
                            <tr>
                                <th className="px-4 py-2 border-r">Product</th>
                                <th className="px-4 py-2 border-r">SKU</th>
                                <th className="px-4 py-2 border-r">Price</th>
                                {/* <th className="px-4 py-2 border-r">Stock</th> */}
                                <th className="px-4 py-2 border-r">Status</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentShopWithProducts?.products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 text-center">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                currentShopWithProducts?.products.map((product: ProductWithPivot) => (
                                    <tr key={product.id} className="border-t">
                                        <td className="px-4 py-2 border-r">{product.name}</td>
                                        <td className="px-4 py-2 border-r">{product.sku}</td>
                                        <td className="px-4 py-2 border-r text-right">{formatNumber(product.pivot.price * 1)}</td>
                                        {/* <td className="px-4 py-2 border-r text-right">{product.pivot.stock}</td> */}
                                        <td className="px-4 py-2 border-r text-center">
                                            {/* <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${product.pivot.isactive == true ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {product.pivot.isactive == true ? 'Active' : 'Disable'}
                                            </span> */}
                                            <Button
                                                variant="outline" className="text-muted-foreground px-1.5"
                                                onClick={() => toggleStatus(product)}
                                            >
                                                {product.pivot.isactive == true ? (
                                                    <CircleCheck className="fill-green-500 dark:fill-green-400" />
                                                ) : (
                                                    <CircleX className="fill-red-500 dark:fill-red-400" />
                                                )}
                                                {product.pivot.isactive == true ? 'Active' : 'Disable'}
                                            </Button>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
