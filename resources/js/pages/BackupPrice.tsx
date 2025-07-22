// resources/js/pages/ProductShopSetup.tsx

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
import { toast } from 'sonner';

// Import your types from the centralized types file
import type { Shop, Product, ShopWithProducts, ProductWithPivot } from '@/types';

// For the main page props
export type ProductShopSetupPageProps = {
    shops: Shop[];                          // List of all shops
    products: Product[];                 // List of all products (for the dropdown)
    currentShopWithProducts: ShopWithProducts | null; // The selected shop with its pivot products
    errors: Record<string, string | string[]>; // For Inertia errors
};

// Form state for adding/editing a product-shop association
export type ProductShopForm = {
    shop_id: number | '';
    product_id: number | '';
    price: number | '';
    stock: number | '';
};

// Breadcrumbs for your layout
const breadcrumbs = [
    { title: 'Master', href: '' },
    { title: 'Price by Shop', href: '/product-shop' },
];

export default function ProductShopSetup() {
    const { shops, products, currentShopWithProducts, errors } = usePage<ProductShopSetupPageProps>().props;

    const [selectedShopId, setSelectedShopId] = useState<number | ''>(currentShopWithProducts?.id || shops[0]?.id || '');
    const [newProductId, setNewProductId] = useState<number | null>(null);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);

    const [form, setForm] = useState<ProductShopForm>({ shop_id: '', product_id: '', price: '', stock: '' });

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [editDialog, setEditDialog] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    const openNew = (product: ProductWithPivot) => {
        setOpen(true);
        setForm({
            shop_id: newProductId || '',
            product_id: product.id,
            price: 0,
            stock: 0,
        });
    };

    useEffect(() => {
        if (editingProductId !== null && currentShopWithProducts) {
            const productToEdit = currentShopWithProducts.products.find(p => p.id === editingProductId);
            if (productToEdit) {
                setForm({
                    shop_id: editingProductId,
                    product_id: productToEdit.id,
                    price: productToEdit.pivot.price,
                    stock: productToEdit.pivot.stock,
                });
            } else {
                // If productToEdit is null (e.g., product not found in current shop), reset editing state
                setEditingProductId(null);
                setForm({ shop_id: '', product_id: '', price: '', stock: '' });
            }
        } else {
            // Reset form if not in editing mode or if selectedShop changes
            setForm({ shop_id: '', product_id: '', price: '', stock: '' });
        }
    }, [editingProductId, currentShopWithProducts]);

    const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newShopId = Number(e.target.value);
        setSelectedShopId(newShopId);
        setEditingProductId(null);
        setForm({ shop_id: '', product_id: '', price: '', stock: '' });
        router.get(
            route('price.index'),
            { shop_id: newShopId },
            { preserveScroll: true, preserveState: false }
        );
    };

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const product_id = Number(e.target.value);
        setNewProductId(product_id);
        setForm({ shop_id: '', product_id: '', price: '', stock: '' });
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedShopId) {
            toast.error('Please select a shop first.');
            return;
        }
        if (!form.product_id || form.price === '' || form.stock === '') {
            toast.error('Please fill all product details.');
            return;
        }

        setIsSubmitting(true);

        router.post(
            route('price.store'),
            {
                shop_id: selectedShopId,
                product_id: form.product_id,
                price: form.price,
                stock: form.stock,
                editing_product_id: editingProductId,
            },
            {
                onSuccess: () => {
                    toast.success(editingProductId ? 'Product setup updated!' : 'Product added to shop!');
                    setForm({ shop_id: '', product_id: '', price: '', stock: '' });
                    setEditingProductId(null);
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

    // Set the form into "editing" mode for a specific product
    const handleEditClick = (product: ProductWithPivot) => {
        setEditingProductId(product.id);
    };

    // Determine available products for the dropdown
    // Filter out products already associated with the current shop when adding new ones
    const availableProductsForSelection = products.filter(
        (product: Product) =>
            !currentShopWithProducts?.products.some(
                (associatedProduct) => associatedProduct.id === product.id
            ) || editingProductId === product.id // Include if currently editing this product
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Shop" />
            <div className="flex flex-col gap-4 p-4 overflow-x-auto">
                <div className="items-center">
                    <h1 className="text-xl font-bold">Price by Shop</h1>
                    <span className="text-sm text-gray-500">Setup product price by shop</span>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Product</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        name="shop_id"
                                        value={form.shop_id}
                                        onChange={handleChange}
                                        placeholder="Shop"
                                        required
                                        className="border rounded p-2 w-full dark:bg-transparent"
                                    />
                                    {errors.shop_id && <p className="text-sm text-red-600 mt-1">{errors.shop_id}</p>}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="product_id"
                                        value={form.product_id}
                                        onChange={handleChange}
                                        placeholder="SKU (optional)"
                                        className="border rounded p-2 w-full dark:bg-transparent"
                                    />
                                    {errors.product_id && <p className="text-sm text-red-600 mt-1">{errors.product_id}</p>}
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="Price"
                                        className="border rounded p-2 w-full dark:bg-transparent"
                                    />
                                    {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        onChange={handleChange}
                                        placeholder="Stock"
                                        className="border rounded p-2 w-full dark:bg-transparent"
                                    />
                                    {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock}</p>}
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

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Shop Selector */}
                    <select
                        className="border rounded p-2 w-full max-w-sm dark:bg-transparent"
                        value={selectedShopId}
                        onChange={handleShopChange}
                    >
                        {shops.length === 0 ? (
                            <option value="" disabled>No shop available</option>
                        ) : (<>
                            {shops.map(shop => (
                                <option key={shop.id} value={shop.id}>
                                    {shop.name}
                                </option>
                            ))}
                        </>)}

                    </select>

                    {/* Shop Product */}
                    <select
                        className="border rounded p-2 w-full max-w-sm dark:bg-transparent"
                        onChange={handleProductChange}
                    >
                        {products.length === 0 ? (
                            <option value="" disabled>No product to add!</option>
                        ) : (
                            <>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </>
                        )}
                    </select>

                    <Button className="p-2 border rounded flex-grow dark:bg-transparent" onClick={() => (openNew)}>
                        Add
                    </Button>
                </div>

                {/* Product Shop Table */}
                <div className="overflow-x-auto border border-sidebar-border/70 dark:border-sidebar-border rounded-xl mt-2">
                    <table className="min-w-full table-auto text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-sidebar">
                            <tr>
                                <th className="px-4 py-2 border-r">Product</th>
                                <th className="px-4 py-2 border-r">SKU</th>
                                <th className="px-4 py-2 border-r">Price</th>
                                <th className="px-4 py-2 border-r">Stock</th>
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
                                        <td className="px-4 py-2 border-r text-right">{product.pivot.price}</td>
                                        <td className="px-4 py-2 border-r text-right">{product.pivot.stock}</td>
                                        <td className="px-4 py-2 border-r text-center">
                                            {product.pivot.isactive ? (
                                                <Button className="bg-green-500" size="sm" onClick={() => handleEditClick(product)}>
                                                    Active
                                                </Button>
                                            ) : (
                                                <Button className="bg-red-500" size="sm" onClick={() => handleEditClick(product)}>
                                                    Disable
                                                </Button>
                                            )}

                                        </td>
                                        <td className="px-4 py-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditClick(product)}>
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
        </AppLayout >
    );
}
