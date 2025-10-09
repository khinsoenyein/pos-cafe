import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';
import ProductCard from '@/components/Sales/ProductCard';
import CartSidebar from '@/components/Sales/CartSidebar';
import ReceiptModal from '@/components/Sales/ReceiptModal';

import type { Product, Shop, SaleItem, PaymentType, Sale } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import ConfirmDialog from '@/components/ConfirmDialog';
import axios from 'axios';

type PageProps = {
    shops: Shop[];
    payment_types: PaymentType[];
    errors: Record<string, string>;
    flash: { success: string, voucher_number: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'POS', href: '/sales' },
];

export default function Sales() {
    const { shops, payment_types, errors, flash } = usePage<PageProps>().props;

    // console.log(shops);

    useEffect(() => {
        router.reload({ only: ['shops, payment_types'] });
    }, []);

    const [shopId, setShopId] = useState<number>(shops[0]?.id ?? 0);
    const currentShop = shops.find(s => s.id === shopId);

    const [items, setItems] = useState<SaleItem[]>([]);
    const [discount, setDiscount] = useState<number>(0);
    const [tax, setTax] = useState<number>(0);
    const [cash, setCash] = useState<number>(0);
    const [paymentTypeId, setPaymentTypeId] = useState<number>(payment_types[0]?.id ?? 0);
    const [voucherNumber, setVoucherNumber] = useState<string | null>(null);
    const [showReceipt, setShowReceipt] = useState<boolean>(false);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    
    const [sale, setSale] = useState<Sale>();

    // Function to handle shop change and trigger Inertia visit
    const handleShopChange = (shopId: string) => {
        const newShopId = Number(shopId);
        setShopId(newShopId);
        setItems([]); // Clear cart when shop changes
        setSearch(''); // Clear search term too
        setCash(0);
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

    const itemTotal = (item: SaleItem) => item.qty * item.price;
    const subTotal = items.reduce((sum, item) => sum + itemTotal(item), 0);
    const grand_total = subTotal - discount + tax;
    const change = cash - grand_total;

    const handleSubmit = async () => {
        try {
            const payload = {
                shop_id: shopId,
                sub_total: subTotal,
                discount: discount,
                tax: tax,
                grand_total: grand_total,
                pay: cash,
                change: change,
                payment_type_id: paymentTypeId,
                items,
            };

            const res = await axios.post("/sales/store", payload, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest", // ensures Laravel detects XHR
                },
            });

            const sale = res.data?.sale;
            if (sale) {
                // setVoucherNumber(String(voucher));
                setShowReceipt(true);
                setSale(res.data?.sale)

                toast.success("Sale created successfully");
            } else {
                toast.error("Unable to save");
            }

        } catch (err: any) {
            toast.error(err?.response?.data?.detail ?? "Failed to create sale");
        }
    };

    // Called when user confirms in ConfirmDialog
    const handleConfirm = () => {
        setShowConfirm(false);
        handleSubmit();
    };

    const filteredProducts = currentShop?.products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleReceiptClose = () => {
        setShowReceipt(false);
        setItems([]);
        setCash(0);
        setVoucherNumber(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales" />
            <div className="flex flex-col lg:flex-row gap-4 p-4">
                {/* Left: Product list */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                        {/* Shop Selector */}
                        {shops.length > 0 && (
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
                        )}

                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search product..."
                            className="border rounded p-2"
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
                    onRemove={handleRemoveItem}
                    sub_total={subTotal}
                    discount={discount}
                    setDiscount={setDiscount}
                    tax={tax}
                    setTax={setTax}
                    payment_types={payment_types}
                    paymentTypeId={paymentTypeId}
                    setPaymentTypeId={setPaymentTypeId}
                    cash={cash}
                    setCash={setCash}
                    change={change}
                    grand_total={grand_total}
                    onPay={() => setShowConfirm(true)}
                />

                {/* Receipt */}
                {sale && (
                    <ReceiptModal 
                        show={showReceipt}
                        onClose={handleReceiptClose}
                        // cart={items}
                        sale={sale} />
                )}

                {/* ConfirmDialog */}
                <ConfirmDialog
                    open={showConfirm}
                    title="Complete Sale"
                    description={`Are you sure you want to complete the sale? Total: ${grand_total.toLocaleString()}`}
                    confirmLabel="Save"
                    cancelLabel="Cancel"
                    onConfirm={handleConfirm}
                />
            </div>
        </AppLayout>
    );
}
