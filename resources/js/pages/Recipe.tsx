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
import { Input } from '@/components/ui/input';
import { useRecipeFetcher } from '@/hooks/fetch-recipe';
import { CircleCheck, CircleX } from 'lucide-react';

export type IngredientShopSetupPageProps = {
    shops: Shop[];
    products: Product[];
    ingredients: Ingredient[];
    // availableIngredients: Ingredient[];
    // recipes: IngredientProduct[] | null; 
    errors: Record<string, string | string[]>;
};

const breadcrumbs = [
    { title: 'Master', href: '' },
    { title: 'Receipe by Shop', href: '/ingredient-shop' },
];

export default function IngredientShopSetup() {
    const { shops, products, ingredients, errors } = usePage<IngredientShopSetupPageProps>().props;

    const {
        ingredientProduct,
        fetchRecipe,
        loading,
        error,
    } = useRecipeFetcher()

    const [shopId, setShopId] = useState<number | null>(shops[0]?.id || null);
    const [productId, setProductId] = useState<number | null>(products[0]?.id || null);
    const [ingredientId, setIngredientId] = useState<number | null>(null);
    const [editingIngredientName, setEditingIngredientName] = useState<String | null>(null);

    // const [currentIngredients, setCurrentIngredients] = useState<IngredientProduct[]>([]);

    const [form, setForm] = useState({ quantity: '' });

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editDialog, setEditDialog] = useState(false);
    const [editing, setEditing] = useState<IngredientProduct | null>(null);


    useEffect(() => {
        if (shopId && productId) {            
            fetchRecipe(shopId, productId)
        }
    }, [shopId, productId]);

    const ingredientIds = ingredientProduct?.map(item => item.ingredient_id);

    const filteredIngredients = ingredients.filter(ingredient =>
        !ingredientIds?.includes(ingredient.id)
    );

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

        if (!ingredientId) {
            toast.error('Please select a ingredient first.');
            return;
        }
        if (form.quantity == '') {
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
                    
                    fetchRecipe(shopId!, productId!)
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
        
        if (!shopId) {
            toast.error('Please select a shop first.');
            return;
        }
        if (!productId) {
            toast.error('Please select a product first.');
            return;
        }

        if (!ingredientId) {
            toast.error('Please select a ingredient first.');
            return;
        }
        if (form.quantity == '') {
            toast.error('Please fill quantity.');
            return;
        }

        router.put(`/recipe/${editing.id}`, {
            shop_id: shopId,
            product_id: productId,
            ingredient_id: ingredientId,
            quantity: form.quantity,
        }, {
            onSuccess: () => {
                setEditDialog(false);
                setEditing(null);
                setEditingIngredientName(null);
                setForm({ quantity: '' });
                setIngredientId(null);
                fetchRecipe(shopId!, productId!)
                toast.success('Recipe updated');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const openEditDialog = (item: IngredientProduct) => {
        setIngredientId(item.ingredient_id)
        setEditing(item);
        setEditingIngredientName(item.ingredient.name)
        setForm({
            quantity: String(item.quantity),
        });
        setEditDialog(true);
    };
    
    const toggleStatus = (recipe: IngredientProduct) => {
        const recipe_id = recipe.id;
        const shop_id = recipe.shop_id;
        const product_id = recipe.product_id;
        const ingredient_id = recipe.ingredient_id;

        router.get(`/recipe/status`, {
            recipe_id: recipe_id,
            shop_id: shop_id,
            product_id: product_id,
            ingredient_id: ingredient_id,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                fetchRecipe(shopId!, productId!)
                toast.success('Status updated')
            },
            onError: () => toast.warning('Status Error'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ingredient Shop Setup" />

            <div className="p-4 space-y-4">
                <h1 className="text-2xl font-bold">Recipe by Shop</h1>
                <p className="text-gray-600">Setup recipe by shop</p>

                <div className="flex gap-4 items-center">
                    <Select onValueChange={(val) => setShopId(Number(val))} value={shopId?.toString()}>
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
                            {products.map((product) => (
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
                                <DialogTitle>Add Ingredient to Shop</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="text-sm">
                                    <div className="mb-2"><strong>Shop:</strong> {shops.find(s => s.id === shopId)?.name || '-'}</div>
                                    <div className="mb-2"><strong>Product:</strong> {products.find(p => p.id === productId)?.name || '-'}</div>
                                </div>

                                <div>
                                    <Select onValueChange={(val) => setIngredientId(Number(val))}>
                                        <SelectTrigger className="border rounded p-2 w-full dark:bg-transparent">
                                            <SelectValue placeholder="Select Ingredient" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredIngredients.map((ingredient) => (
                                            <SelectItem key={ingredient.id} value={String(ingredient.id)}>
                                                {ingredient.name}
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.ingredient_id && <p className="text-sm text-red-600 mt-1">{errors.ingredient_id}</p>}
                                </div>

                                <div>
                                    {/* <input
                                        type="number"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                        placeholder="Quantity Required"
                                        required
                                        className="border rounded p-2 w-full max-w-sm"
                                    /> */}
                                     <Input
                                        value={form.quantity}
                                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                        placeholder="Enter quantity"
                                        className="border rounded p-2 w-full dark:bg-transparent"
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
                                <DialogTitle>Edit Recipe</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="text-sm">
                                    <div className="mb-2"><strong>Shop:</strong> {shops.find(s => s.id === shopId)?.name || '-'}</div>
                                    {errors.shop_id && <p className="text-sm text-red-600 mt-1">{errors.shop_id}</p>}
                                    <div className="mb-2"><strong>Product:</strong> {products.find(p => p.id === productId)?.name || '-'}</div>
                                    {errors.product_id && <p className="text-sm text-red-600 mt-1">{errors.product_id}</p>}
                                    <div className="mb-2"><strong>Ingredient:</strong> {editingIngredientName}</div>
                                    {errors.ingredient_id && <p className="text-sm text-red-600 mt-1">{errors.ingredient_id}</p>}
                                </div>

                                <div>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                        placeholder="Quantity"
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
                            {ingredientProduct?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 text-center">
                                        No ingredients found.
                                    </td>
                                </tr>
                            ) : (
                                ingredientProduct?.map((recipe: IngredientProduct) => (
                                    <tr key={recipe.id} className="border-t">
                                        <td className="px-4 py-2 border-r">{recipe.ingredient.name}</td>
                                        <td className="px-4 py-2 border-r text-right">{formatNumber(recipe.quantity * 1)}</td>
                                        {/* <td className="px-4 py-2 border-r text-right">{ingredient.pivot.quantity}</td> */}
                                        <td className="px-4 py-2 border-r text-center">
                                            {/* <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${ingredient.pivot.isactive == true ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {ingredient.pivot.isactive == true ? 'Active' : 'Disable'}
                                            </span> */}
                                            <Button
                                                variant="outline" className="text-muted-foreground px-1.5"
                                                onClick={() => toggleStatus(recipe)}
                                            >
                                                {recipe.isactive == true ? (
                                                    <CircleCheck className="fill-green-500 dark:fill-green-400" />
                                                ) : (
                                                    <CircleX className="fill-red-500 dark:fill-red-400" />
                                                )}
                                                {recipe.isactive == true ? 'Active' : 'Disable'}
                                            </Button>
                                        </td>
                                        <td className="px-4 py-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(recipe)}>
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
