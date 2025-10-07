import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Sale, type BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/Sales/columns';
import { useEffect } from 'react';

type PageProps = {
  sales: Sale[];
  errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Report', href: '' },
  { title: 'Sales List', href: '/sales/list' },
];

export default function Inventories() {
  const { sales, errors } = usePage<PageProps>().props;

//   useEffect(() => {
//       router.reload({ only: ['sales'] });
//   }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sales" />
      <div className="flex flex-col gap-4 p-4 overflow-x-auto">
        {/* <h1 className="text-2xl font-bold">Product List</h1> */}
        <div>
          <h1 className="text-xl font-bold">Sales List</h1>
          <span className="text-sm text-gray-500">List of Sales</span>
        </div>

        {/* Product Table */}
        <DataTable columns={columns} data={sales}/>
      </div>
    </AppLayout>
  );
}
