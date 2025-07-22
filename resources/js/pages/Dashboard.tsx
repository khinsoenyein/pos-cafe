import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
// import { formatNumber } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart } from 'recharts';

export type DashboardProps = {
  totalShops: number;
  totalProducts: number;
  totalSalesToday: number;
  lowStockCount: number;
  salesByShop: { shop: string; total: number }[];
  lowStockProducts: { name: string; stock: number; shop: string }[];
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];
export default function Dashboard() {
  const {
    totalShops,
    totalProducts,
    totalSalesToday,
    lowStockCount,
    salesByShop,
    lowStockProducts,
  } = usePage<DashboardProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
    </AppLayout>
  );
}
