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
import { formatNumber } from '@/lib/utils';
import { toast } from 'sonner';

import type { Shop, Ingredient, IngredientShop, ShopWithIngredients, IngredientWithPivot } from '@/types';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectValue, SelectItem, SelectTrigger } from '@/components/ui/select';

export type IngredientShopSetupPageProps = {
    shops: Shop[];                          // List of all shops
    availableIngredients: Ingredient[];                 // List of all ingredients (for the dropdown)
    currentShopWithIngredients: ShopWithIngredients | null; // The selected shop with its pivot ingredients
    errors: Record<string, string | string[]>; // For Inertia errors
};

const breadcrumbs = [
    { title: 'Master', href: '' },
    { title: 'Price by Shop', href: '/ingredient-shop' },
];

export default function IngredientShopSetup() {
    const { shops, availableIngredients, currentShopWithIngredients, errors } = usePage<IngredientShopSetupPageProps>().props;

    useEffect(() => {
        router.reload({ only: ['shops', 'availableIngredients', 'currentShopWithIngredients'] });
    }, []);

    const [shopId, setShopId] = useState<number | ''>(currentShopWithIngredients?.id || shops[0]?.id || '');
    const [ingredientId, setIngredientId] = useState<number | null>(null);
    const [editingIngredientName, setEditingIngredientName] = useState<String | null>(null);

    const [form, setForm] = useState({ stock: '' });

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editDialog, setEditDialog] = useState(false);
    const [editing, setEditing] = useState<IngredientWithPivot | null>(null);

    const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newShopId = Number(e.target.value);
        setShopId(newShopId);
        setIngredientId(null);
        setForm({ stock: '' });
        router.get(
            route('stock.index'),
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
        if (!ingredientId) {
            toast.error('Please select a ingredient first.');
            return;
        }
        if (form.stock === '') {
            toast.error('Please fill stock.');
            return;
        }

        setIsSubmitting(true);

        router.post(
            route('stock.store'),
            {
                shop_id: shopId,
                ingredient_id: ingredientId,
                stock: form.stock,
            },
            {
                onSuccess: () => {
                    toast.success('Ingredient added to shop!');
                    setOpen(false);
                    setForm({ stock: '' });
                    setIngredientId(null);
                    router.reload({ only: ['currentShopWithIngredients'] });
                },
                onError: (err) => {
                    console.error('Submission error:', err);
                    const errorMessage = Object.values(err).flat().join('\n') || 'Failed to save ingredient setup.';
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

        router.put(`/stock/${editing.id}`, {
            shop_id: shopId,
            ingredient_id: ingredientId,
            stock: form.stock,
        }, {
            onSuccess: () => {
                toast.success('Ingredient updated');
                setEditDialog(false);
                setEditing(null);
                setEditingIngredientName(null);
                setIngredientId(null);
                setForm({ stock: '' });
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const openEditDialog = (item: IngredientWithPivot) => {
        setIngredientId(item.pivot.ingredient_id)
        setEditing(item);
        setEditingIngredientName(item.name)
        setForm({
            stock: String(item.pivot.stock),
        });
        setEditDialog(true);
    };

    const toggleStatus = (ingredient: IngredientWithPivot) => {
        const shop_id = ingredient.pivot.shop_id;
        const ingredient_id = ingredient.pivot.ingredient_id;

        router.get(`/stock/status`, {
            shop_id: shop_id,
            ingredient_id: ingredient_id,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Status updated')
                router.reload({ only: ['currentShopWithIngredients'] });
            },
            onError: () => toast.success('Status Error'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ingredient Shop Setup" />

            <div className="p-4 space-y-4">
                <h1 className="text-2xl font-bold">Price by Shop</h1>
                <p className="text-gray-600">Setup ingredient stock by shop</p>

                <div className="flex gap-4 items-center">
                    {/* <Select onValueChange={handleShopChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a shop" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {shops.map((shop) => (
                                    <SelectItem value="{shop.id}">{shop.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select> */}
                    <select
                        className="border rounded p-2 w-full max-w-sm dark:bg-transparent"
                        value={shopId}
                        onChange={handleShopChange}
                    >
                        <option value="">Select Shop</option>
                        {shops.map((shop) => (
                            <option key={shop.id} value={shop.id}>{shop.name}</option>
                        ))}
                    </select>

                    <select
                        className="border rounded p-2 w-full max-w-sm dark:bg-transparent"
                        onChange={(e) => setIngredientId(Number(e.target.value))}
                        value={ingredientId ?? ''}
                        disabled={!shopId}
                    >
                        <option value="">Select Ingredient</option>
                        {availableIngredients.map((ingredient) => (
                            <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                        ))}
                    </select>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!shopId || !ingredientId}>Add</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Ingredient to Shop</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="text-sm">
                                    <div className="mb-2"><strong>Shop:</strong> {shops.find(s => s.id === shopId)?.name || '-'}</div>
                                    <div className="mb-2"><strong>Ingredient:</strong> {availableIngredients.find(p => p.id === ingredientId)?.name || '-'}</div>
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        placeholder="Price"
                                        required
                                        className="border rounded p-2 w-full"
                                    />
                                    {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock}</p>}
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
                                    <div className="mb-2"><strong>Ingredient:</strong> {editingIngredientName}</div>
                                    {errors.ingredient_id && <p className="text-sm text-red-600 mt-1">{errors.ingredient_id}</p>}
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        placeholder="Price"
                                        required
                                        className="border rounded p-2 w-full"
                                    />
                                    {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock}</p>}
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

                {/* Ingredient Shop Table */}
                <div className="overflow-x-auto border border-sidebar-border/70 dark:border-sidebar-border rounded-xl mt-2">
                    <table className="min-w-full table-auto text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-sidebar">
                            <tr>
                                <th className="px-4 py-2 border-r">Ingredient</th>
                                <th className="px-4 py-2 border-r">SKU</th>
                                <th className="px-4 py-2 border-r">Price</th>
                                {/* <th className="px-4 py-2 border-r">Stock</th> */}
                                <th className="px-4 py-2 border-r">Status</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentShopWithIngredients?.ingredients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 text-center">
                                        No ingredients found.
                                    </td>
                                </tr>
                            ) : (
                                currentShopWithIngredients?.ingredients.map((ingredient: IngredientWithPivot) => (
                                    <tr key={ingredient.id} className="border-t">
                                        <td className="px-4 py-2 border-r">{ingredient.name}</td>
                                        <td className="px-4 py-2 border-r text-right">{formatNumber(ingredient.pivot.stock * 1)}</td>
                                        {/* <td className="px-4 py-2 border-r text-right">{ingredient.pivot.stock}</td> */}
                                        <td className="px-4 py-2 border-r text-center">
                                            {/* <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${ingredient.pivot.isactive == true ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {ingredient.pivot.isactive == true ? 'Active' : 'Disable'}
                                            </span> */}
                                            <Button
                                                size="sm"
                                                className={`${ingredient.pivot.isactive == true ? 'bg-green-500' : 'bg-red-500'}`}
                                                onClick={() => toggleStatus(ingredient)}
                                            >
                                                {ingredient.pivot.isactive == true ? 'Active' : 'Disable'}
                                            </Button>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(ingredient)}>
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
