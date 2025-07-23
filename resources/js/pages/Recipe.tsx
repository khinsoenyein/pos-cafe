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

import type { Shop, Ingredient, IngredientProduct, IngredientWithPivot, Product } from '@/types';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectValue, SelectItem, SelectTrigger } from '@/components/ui/select';

export type IngredientShopSetupPageProps = {
    shops: Shop[];
    products: Product[];
    availableIngredients: Ingredient[];                 // List of all ingredients (for the dropdown)
    currentIngredients: IngredientProduct | null; // The selected shop with its pivot ingredients
    errors: Record<string, string | string[]>; // For Inertia errors
};

const breadcrumbs = [
    { title: 'Master', href: '' },
    { title: 'Receipe by Shop', href: '/ingredient-shop' },
];

export default function IngredientShopSetup() {
    const { shops, products, availableIngredients, currentIngredients, errors } = usePage<IngredientShopSetupPageProps>().props;

    console.log(currentIngredients);

    useEffect(() => {
        router.reload({ only: ['shops', 'products', 'availableIngredients', 'currentIngredients'] });
    }, []);

    const [shopId, setShopId] = useState<number | ''>(currentIngredients?.shop.id || shops[0]?.id || '');
    const [productId, setProductId] = useState<number | ''>(currentIngredients?.product.id || products[0]?.id || '');
    const [ingredientId, setIngredientId] = useState<number | null>(null);
    const [editingIngredientName, setEditingIngredientName] = useState<String | null>(null);

    const [form, setForm] = useState({ quantity: '' });

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editDialog, setEditDialog] = useState(false);
    const [editing, setEditing] = useState<IngredientWithPivot | null>(null);

    const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newShopId = Number(e.target.value);
        setShopId(newShopId);
        setForm({ quantity: '' });
        router.get(
            route('recipe.index'),
            { shop_id: shopId, product_id: productId },
            { preserveScroll: true, preserveState: false }
        );
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProductId = Number(e.target.value);
        setProductId(newProductId);
        if (!shopId) {
            toast.error('Please select a shop.');
            return;
        }
        setForm({ quantity: '' });
        router.get(
            route('recipe.index'),
            { shop_id: shopId, product_id: productId },
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
        if (form.quantity === '') {
            toast.error('Please fill quantity.');
            return;
        }

        setIsSubmitting(true);

        router.post(
            route('recipe.store'),
            {
                shop_id: shopId,
                product_id: productId,
                ingredient_id: ingredientId,
                quantity: form.quantity,
            },
            {
                onSuccess: () => {
                    toast.success('Ingredient added to shop!');
                    setOpen(false);
                    setForm({ quantity: '' });
                    setIngredientId(null);
                    router.reload({ only: ['currentIngredients'] });
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

        router.put(`/recipe/${editing.id}`, {
            shop_id: shopId,
            product_id: productId,
            ingredient_id: ingredientId,
            quantity: form.quantity,
        }, {
            onSuccess: () => {
                toast.success('Ingredient updated');
                setEditDialog(false);
                setEditing(null);
                setEditingIngredientName(null);
                setIngredientId(null);
                setForm({ quantity: '' });
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const openEditDialog = (item: IngredientWithPivot) => {
        setIngredientId(item.pivot.ingredient_id)
        setEditing(item);
        setEditingIngredientName(item.name)
        setForm({
            quantity: String(item.pivot.quantity),
        });
        setEditDialog(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ingredient Shop Setup" />

            <div className="p-4 space-y-4">
                <h1 className="text-2xl font-bold">Recipe by Shop</h1>
                <p className="text-gray-600">Setup recipe by shop</p>

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
                        value={productId ?? ''}
                        onChange={handleProductChange}
                        disabled={!shopId}
                    >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                        ))}
                    </select>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button disabled={!shopId || !productId}>Add</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Ingredient to Shop</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="text-sm">
                                    <div className="mb-2"><strong>Shop:</strong> {shops.find(s => s.id === shopId)?.name || '-'}</div>
                                    <div className="mb-2"><strong>Product:</strong> {products.find(p => p.id === productId)?.name || '-'}</div>
                                </div>

                                <div>
                                    <select
                                        className="border rounded p-2 w-full max-w-sm dark:bg-transparent"
                                        onChange={(e) => setIngredientId(Number(e.target.value))}
                                        value={ingredientId ?? ''}
                                        disabled={!shopId || !productId}
                                    >
                                        <option value="">Select Product</option>
                                        {availableIngredients.map((ingredient) => (
                                            <option key={ingredient.id} value={ingredient.id}>{ingredient.name}</option>
                                        ))}
                                    </select>
                                    {errors.ingredient_id && <p className="text-sm text-red-600 mt-1">{errors.ingredient_id}</p>}
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                        placeholder="Quantity Required"
                                        required
                                        className="border rounded p-2 w-full"
                                    />
                                    {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>}
                                </div>

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
                                    <div className="mb-2"><strong>Product:</strong> {editingIngredientName}</div>
                                    {errors.ingredient_id && <p className="text-sm text-red-600 mt-1">{errors.ingredient_id}</p>}
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                        placeholder="Price"
                                        required
                                        className="border rounded p-2 w-full"
                                    />
                                    {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity}</p>}
                                </div>

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
                                <th className="px-4 py-2 border-r">Quantity</th>
                                <th className="px-4 py-2 border-r">Status</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentIngredients?.ingredients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 text-center">
                                        No ingredients found.
                                    </td>
                                </tr>
                            ) : (
                                currentIngredients?.ingredients.map((ingredient: IngredientWithPivot) => (
                                    <tr key={ingredient.id} className="border-t">
                                        <td className="px-4 py-2 border-r">{ingredient.name}</td>
                                        <td className="px-4 py-2 border-r text-right">{formatNumber(ingredient.pivot.quantity * 1)}</td>
                                        {/* <td className="px-4 py-2 border-r text-right">{ingredient.pivot.quantity}</td> */}
                                        <td className="px-4 py-2 border-r text-center">
                                            {/* <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${ingredient.pivot.isactive == true ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {ingredient.pivot.isactive == true ? 'Active' : 'Disable'}
                                            </span> */}
                                            <Button
                                                size="sm"
                                                className={`${ingredient.pivot.isactive == true ? 'bg-green-500' : 'bg-red-500'}`}
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
