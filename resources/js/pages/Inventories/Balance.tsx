import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { ProductShop, type BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/ProductShop/columns';

type PageProps = {
  productShops: ProductShop[];
  errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Master', href: '' },
  { title: 'Inventory Balance', href: '/inventory-balance' },
];

export default function Inventories() {
  const { shops, products, inventories, productShops, errors } = usePage<PageProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Products" />
      <div className="flex flex-col gap-4 p-4 overflow-x-auto">
        {/* <h1 className="text-2xl font-bold">Product List</h1> */}
        <div>
          <h1 className="text-xl font-bold">Inventory Balance</h1>
          <span className="text-sm text-gray-500">Inventory Balance Information</span>
        </div>

        {/* Product Table */}
        <DataTable columns={columns} data={productShops}/>
      </div>
    </AppLayout>
  );
}
