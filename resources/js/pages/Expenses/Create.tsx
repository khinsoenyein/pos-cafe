import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Expense, ExpenseCategory, PaymentType, Shop, type BreadcrumbItem } from '@/types';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectValue, SelectItem, SelectTrigger } from '@/components/ui/select';
import { formatDateYmd, formatNumber } from '@/lib/utils';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/Expenses/columns';

type PageProps = {
    expenses: Expense[];
    shops: Shop[];
    expense_categories: ExpenseCategory[];
    payment_types: PaymentType[];
    errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Expenses', href: '/expenses' },
];

export default function Expenses() {
    const { expenses, shops, expense_categories, payment_types, errors } = usePage<PageProps>().props;

    const [form, setForm] = useState<{
        shop_id: number | null;
        expense_category_id: number | null;
        payment_type_id: number | null;
        amount: number;
        image: File | null;
        description: string;
        remark: string;
    }>({
        shop_id: null,
        expense_category_id: null,
        payment_type_id: null,
        amount: 0,
        image: null as File | null,
        description: '',
        remark: '',
    });

    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState('');

    const [shopId, setShopId] = useState<number | null>(null);
    const [expenseCategoryId, setExpenseCategoryId] = useState<number | null>(null);
    const [paymentTypeId, setPaymentTypeId] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;
        if (name === 'image' && files) {
            setForm({ ...form, image: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/expenses', {
            shop_id: shopId,
            expense_category_id: expenseCategoryId,
            payment_type_id: paymentTypeId,
            amount: form.amount,
            description: form.description,
            remark: form.remark,
            image: form.image
        }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setForm({ shop_id: null, expense_category_id: null, payment_type_id: null, amount: 0, description: '', remark: '', image: null });
                setOpen(false);
                toast.success('Expense added successfully');
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    // handle input changes
    const updateField = (field: string, value: any) => {
        setForm((s) => ({ ...s, [field]: value }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Expenses" />
            <div className="flex flex-col gap-4 p-4 overflow-x-auto">
                <div>
                    <h1 className="text-xl font-bold">Expenses</h1>
                    <span className="text-sm text-gray-500">List of Expenses</span>
                </div>

                <div className="flex items-center justify-between">
                    {/* <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search expense..."
                        className="border rounded p-2 max-w-sm"
                    /> */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>Add Expense</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Add Expense</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                                <div>
                                    <Select onValueChange={(val) => setShopId(Number(val))}>
                                        <SelectTrigger className="border rounded p-2 w-full dark:bg-transparent">
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
                                    {errors.shop_id && <p className="text-sm text-red-600 mt-1">{errors.shop_id}</p>}
                                </div>
                                <div>
                                    <Select onValueChange={(val) => setExpenseCategoryId(Number(val))}>
                                        <SelectTrigger className="border rounded p-2 w-full dark:bg-transparent">
                                            <SelectValue placeholder="Select expense category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {expense_categories.map((expense_category) => (
                                                <SelectItem key={expense_category.id} value={String(expense_category.id)}>
                                                    {expense_category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.expense_category_id && <p className="text-sm text-red-600 mt-1">{errors.expense_category_id}</p>}
                                </div>
                                <div>
                                    <Select onValueChange={(val) => setPaymentTypeId(Number(val))}>
                                        <SelectTrigger className="border rounded p-2 w-full dark:bg-transparent">
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {payment_types.map((payment_type) => (
                                                <SelectItem key={payment_type.id} value={String(payment_type.id)}>
                                                    {payment_type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.payment_type_id && <p className="text-sm text-red-600 mt-1">{errors.payment_type_id}</p>}
                                </div>
                                <div>
                                    <Input
                                        type="text"
                                        name="amount"
                                        value={form.amount}
                                        onChange={handleChange}
                                        placeholder="Amount"
                                        required
                                        className="border rounded p-2 w-full dark:bg-transparent"
                                    />
                                    {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
                                </div>
                                <div>
                                    <Textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Description"
                                        className="border rounded p-2 w-full dark:bg-transparent"
                                    />
                                    {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                                </div>
                                <div>
                                    <Input
                                        id="picture"
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                    {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
                                </div>
                                <div>
                                    <Textarea
                                        name="remark"
                                        value={form.remark}
                                        onChange={handleChange}
                                        placeholder="Remark"
                                        className="border rounded p-2 w-full dark:bg-transparent"
                                    />
                                    {errors.remark && <p className="text-sm text-red-600 mt-1">{errors.remark}</p>}
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

                {/* Expense Table */}
                <DataTable columns={columns} data={expenses}/>

                {/* <div className="overflow-x-auto border border-sidebar-border/70 dark:border-sidebar-border rounded-xl mt-2">
                    <table className="min-w-full table-auto text-left text-sm">
                        <thead className="bg-gray-100 dark:bg-sidebar">
                            <tr>
                                <th className="px-4 py-2 border-r">#</th>
                                <th className="px-4 py-2 border-r">Date</th>
                                <th className="px-4 py-2 border-r">Shop</th>
                                <th className="px-4 py-2 border-r">Category</th>
                                <th className="px-4 py-2 border-r">Payment Type</th>
                                <th className="px-4 py-2 border-r">Amount</th>
                                <th className="px-4 py-2 border-r">Description</th>
                                <th className="px-4 py-2 border-r">Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-4 text-center">
                                        No expense found.
                                    </td>
                                </tr>
                            ) : (
                                expenses.map((expense, idx) => (
                                    <tr key={expense.id} className="border-t">
                                        <td className="px-4 py-2 border-r">{idx + 1}</td>
                                        <td className="px-4 py-2 border-r">{formatDateYmd(expense.expense_date)}</td>
                                        <td className="px-4 py-2 border-r">{expense.shop.name}</td>
                                        <td className="px-4 py-2 border-r">{expense.expense_category.name}</td>
                                        <td className="px-4 py-2 border-r">{expense.payment_type.name}</td>
                                        <td className="px-4 py-2 border-r">{formatNumber(expense.amount * 1)}</td>
                                        <td className="px-4 py-2 border-r">{expense.description}</td>
                                        <td className="px-4 py-2 border-r">
                                            {expense.image ? (
                                                <img
                                                    src={`/storage/${expense.image}`}
                                                    alt={expense.voucher_number}
                                                    className="h-12 w-12 object-cover rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-400 italic">No image</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div> */}
            </div>
        </AppLayout>
    );
}
