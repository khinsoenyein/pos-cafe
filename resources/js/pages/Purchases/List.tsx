import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Purchase, type BreadcrumbItem } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/Purchases/columns';
import { useEffect } from 'react';

type PageProps = {
  purchases: Purchase[];
  errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Report', href: '' },
  { title: 'Purchase Vouchers', href: '/purchases/list' },
];

export default function Inventories() {
  const { purchases, errors } = usePage<PageProps>().props;

  useEffect(() => {
      router.reload({ only: ['purchases'] });
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sales" />
      <div className="flex flex-col gap-4 p-4 overflow-x-auto">
        <div>
          <h1 className="text-xl font-bold">Purchase Vouchers</h1>
          <span className="text-sm text-gray-500">List of Purchase Vouchers</span>
        </div>

        {/* Product Table */}
        <DataTable columns={columns} data={purchases}/>
      </div>
    </AppLayout>
  );
}
