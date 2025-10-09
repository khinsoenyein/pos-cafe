import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Ingredient, IngredientShop, Inventory, Shop, type BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';
import { columns } from '@/components/Inventories/columns';

type PageProps = {
  shops: Shop[];
  ingredients: Ingredient[];
  inventories: Inventory[];
  ingredientShops: IngredientShop[];
  errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Master', href: '' },
  { title: 'Inventory', href: '/inventory' },
];

export default function Inventories() {
  const { shops, ingredients, inventories, ingredientShops, errors } = usePage<PageProps>().props;

  const [form, setForm] = useState({
    shop_id: '',
    ingredient_id: '',
    change: '',
    reason: '',
    remark: '',
  });

  const [shopId, setShopId] = useState<number | null>(null);
  const [ingredientId, setIngredientId] = useState<number | null>(null);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: value });
  };

  const handleShopChange = (shopId: string) => {
    const newShopId = Number(shopId);
    setShopId(newShopId);
    setIngredientId(null);

    console.log({ shopId, ingredientShops });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/inventory-adjustment', {
      shop_id: shopId,
      ingredient_id: ingredientId,
      change: form.change,
      reason: form.reason,
      remark: form.remark
    }, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setForm({ shop_id: '', ingredient_id: '', change: '', reason: '', remark: '' });
        setOpen(false);
        setShopId(null);
        setIngredientId(null);
        toast.success('Inventory added successfully');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ingredients" />
      <div className="flex flex-col gap-4 p-4 overflow-x-auto">
        {/* <h1 className="text-2xl font-bold">Ingredient List</h1> */}
        <div>
          <h1 className="text-xl font-bold">Inventory</h1>
          <span className="text-sm text-gray-500">Inventory Transactions</span>
        </div>

        {/* Ingredient Table */}
        <DataTable  columns={columns} data={inventories}/>
      </div>
    </AppLayout>
  );
}
