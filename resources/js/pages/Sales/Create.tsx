import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import ProductCard from '@/components/Sales/ProductCard';
import CartSidebar from '@/components/Sales/CartSidebar';
import ReceiptModal from '@/components/Sales/ReceiptModal';

import type { Product, Shop, SaleItem } from '@/types';

type PageProps = {
    shops: Shop[];
    errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'POS', href: '/sales' },
];

export default function Sales() {
    const { shops, errors } = usePage<PageProps>().props;

    useEffect(() => {
        router.reload({ only: ['shops'] });
    }, []);

    const [shopId, setShopId] = useState<number>(shops[0]?.id ?? 0);
    const currentShop = shops.find(s => s.id === shopId);

    const [items, setItems] = useState<SaleItem[]>([]);
    const [cash, setCash] = useState<number>(0);
    const [showReceipt, setShowReceipt] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');

    // Function to handle shop change and trigger Inertia visit
    const handleShopChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newShopId = Number(e.target.value);
        setShopId(newShopId);
        setItems([]); // Clear cart when shop changes
        setSearch(''); // Clear search term too
        router.get(
            route('sales.create'), // Use your route name, e.g., 'sales.create'
            { shop_id: newShopId },
            { preserveScroll: true, preserveState: true } // Preserve scroll and form state during partial reload
        );
    };

    const handleAddProduct = (product: Product) => {
        const exists = items.find(i => i.product_id === product.id);
        if (exists) {
            setItems(prev => prev.map(i =>
                i.product_id === product.id ? { ...i, qty: i.qty + 1 } : i
            ));
        } else {
            setItems(prev => [...prev, {
                product_id: product.id,
                product_name: product.name,
                qty: 1,
                price: product.pivot.price,
            }]);
        }
    };
    const handleQtyChange = (product_id: number, delta: number) => {
        setItems(prev =>
            prev.map(item =>
                item.product_id === product_id ? {
                    ...item,
                    qty: delta //Math.max(1, item.qty + delta)
                } : item
            )
        );
    };

    const handlePriceChange = (product_id: number, price: number) => {
        setItems(prev =>
            prev.map(item =>
                item.product_id === product_id ? { ...item, price } : item
            )
        );
    };

    const handleRemoveItem = (product_id: number) => {
        setItems(prev => prev.filter(item => item.product_id !== product_id));
    };

    const subTotal = (item: SaleItem) => item.qty * item.price;
    const grandTotal = items.reduce((sum, item) => sum + subTotal(item), 0);
    const change = cash - grandTotal;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(
            '/sales/store',
            {
                shop_id: shopId,
                items,
                total: grandTotal
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Sales created successfully');
                    setShowReceipt(true);
                    // setItems([]);
                    // setCash(0);
                }
            }
        );
    };

    const filteredProducts = currentShop?.products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleReceiptClose = () => {
        setShowReceipt(false);
        setItems([]);
        setCash(0);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="POS Sales" />
            <div className="flex flex-col lg:flex-row gap-4 p-4">
                {/* Left: Product list */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                        {/* Shop Selector */}
                        {shops.length > 0 && ( // Ensure there are shops before rendering
                            <select
                                className="border rounded p-2 w-full sm:w-auto dark:bg-transparent flex-shrink-0" // w-auto for sm, flex-shrink-0 to not grow
                                value={shopId}
                                onChange={handleShopChange}
                            >
                                {shops.map(shop => (
                                    <option key={shop.id} value={shop.id}>
                                        {shop.name}
                                    </option>
                                ))}
                            </select>
                        )}

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search product..."
                            className="w-full p-2 border rounded flex-grow dark:bg-transparent"
                        />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} onAdd={handleAddProduct} />
                        ))}
                    </div>
                </div>

                {/* Cart Sidebar */}
                <CartSidebar
                    shop={currentShop}
                    items={items}
                    onQtyChange={handleQtyChange}
                    onPriceChange={handlePriceChange}
                    onRemove={handleRemoveItem}
                    total={grandTotal}
                    cash={cash}
                    setCash={setCash}
                    change={change}
                    onPay={handleSubmit}
                />

                {/* Receipt */}
                <ReceiptModal
                    show={showReceipt}
                    onClose={handleReceiptClose}
                    cart={items}
                    total={grandTotal}
                    cash={cash}
                />
            </div>
        </AppLayout>
    );
}
