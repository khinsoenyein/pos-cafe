import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { IngredientShop, type BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/IngredientShop/columns';
import { useEffect } from 'react';

type PageProps = {
  ingredientShops: IngredientShop[];
  errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Master', href: '' },
  { title: 'Inventory Balance', href: '/inventory-balance' },
];

export default function Inventories() {
  const { ingredientShops, errors } = usePage<PageProps>().props;

  useEffect(() => {
      router.reload({ only: ['ingredientShops'] });
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Balance" />
      <div className="flex flex-col gap-4 p-4 overflow-x-auto">
        <div>
          <h1 className="text-xl font-bold">Inventory Balance</h1>
          <span className="text-sm text-gray-500">Inventory Balance Information</span>
        </div>

        {/* Product Table */}
        <DataTable columns={columns} data={ingredientShops}/>
      </div>
    </AppLayout>
  );
}
