import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Ingredient, IngredientShop, Inventory, Shop, type BreadcrumbItem } from '@/types';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectValue, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';
import { DialogDescription } from '@radix-ui/react-dialog';
import { formatDate } from '@/lib/utils';
import { columns } from '@/components/Inventories/columns';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

//   const availableIngredients = shopId
//     ? ingredients.filter((p) => {
//       return ingredientShops.some((ps) =>
//         ps?.shop_id === shopId &&
//         ps?.ingredient?.id === p.id &&
//         !ps?.isdeleted
//       );
//     })
//     : [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ingredients" />
      <div className="flex flex-col gap-4 p-4 overflow-x-auto">
        {/* <h1 className="text-2xl font-bold">Ingredient List</h1> */}
        <div>
          <h1 className="text-xl font-bold">Inventory</h1>
          <span className="text-sm text-gray-500">Inventory Transactions</span>
        </div>

        {/* <div className="flex items-center justify-between">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Inventory</DialogTitle>
                <DialogDescription><span className="text-sm text-gray-500">Keep Inventory Adjustments Per Shop</span></DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <div>
                  <Select onValueChange={handleShopChange} value={shopId?.toString()}>
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
                  <Select onValueChange={(val) => setIngredientId(Number(val))} value={ingredientId?.toString()}>
                      <SelectTrigger className="border rounded p-2 w-full dark:bg-transparent">
                          <SelectValue placeholder="Select Ingredient" />
                      </SelectTrigger>
                      <SelectContent>
                          {ingredients.map((ingredient) => (
                          <SelectItem key={ingredient.id} value={String(ingredient.id)}>
                              {ingredient.name}
                          </SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                  {errors.ingredient_id && <p className="text-sm text-red-600 mt-1">{errors.ingredient_id}</p>}
                </div>
                <div>
                  <Input
                    type="number"
                    name="change"
                    value={form.change}
                    onChange={handleChange}
                    placeholder="Change"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.change && <p className="text-sm text-red-600 mt-1">{errors.change}</p>}
                </div>
                <div>
                  <Textarea 
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="Reason"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.reason && <p className="text-sm text-red-600 mt-1">{errors.reason}</p>}
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
        </div> */}

        {/* Ingredient Table */}
        <DataTable  columns={columns} data={inventories}/>
      </div>
    </AppLayout>
  );
}
