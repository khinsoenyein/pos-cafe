import { SectionCards } from '@/components/section-cards';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
// import { formatNumber } from '@/lib/utils';
import { Sale, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import { ChartAreaInteractive } from './Sales/Sales-Chart';
import { ChartBarLabelCustom } from './Sales/Sales-BarChart';
import { columns } from '@/components/Sales/columns';
import { DataTable } from '@/components/ui/data-table';
import { CoffeeIcon, DollarSign, Percent } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart } from 'recharts';

export type DashboardProps = {
  totalSalesToday: number;
  totalSales: number;
  totalQty: number;
  totalProfit: number;
  salesByShop: { shop: string; total: number }[];
  sales: Sale[];
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
];
export default function Dashboard() {
  const {
    totalSalesToday,
    totalSales,
    totalQty,
    totalProfit,
    salesByShop,
    sales,
  } = usePage<DashboardProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          {/* <div className="flex flex-col gap-4 py-2 md:gap-6 md:py-4 px-4 lg:px-6">
            <Tabs defaultValue="account" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="report">Report</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">Overview</TabsContent>
              <TabsContent value="report">Reports</TabsContent>
            </Tabs>
          </div> */}

          <div className="flex flex-col gap-4 py-2 md:gap-6 md:py-4">
            <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-3 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
                <Card className="@container/card">
                    <CardHeader className="relative">
                    <CardDescription>Today Sales</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {formatNumber(totalSalesToday * 1)}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <Percent className="size-10" />
                    </div>
                    </CardHeader>
                </Card>
                <Card className="@container/card">
                    <CardHeader className="relative">
                    <CardDescription>Total Quantities</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {totalQty}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <CoffeeIcon className="size-10" />
                    </div>
                    </CardHeader>
                </Card>
                <Card className="@container/card">
                    <CardHeader className="relative">
                    <CardDescription>Total Sales</CardDescription>
                    <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                        {formatNumber(totalSales * 1)}
                    </CardTitle>
                    <div className="absolute right-4 top-4">
                        <DollarSign className="size-10" />
                    </div>
                    </CardHeader>
                </Card>
                </div>
          </div>

          {/* <div className="flex flex-col gap-4 pb-2 md:gap-6 md:pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 lg:px-6">
              <div className="md:col-span-2">
                <ChartAreaInteractive />
              </div>
              <div className="md:col-span-1">
                <ChartBarLabelCustom />
              </div>
            </div>
          </div> */}

          {/* <div className="flex flex-col gap-4 pb-2 md:gap-6 md:pb-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 px-4 lg:px-6">
              <div>
                <ChartAreaInteractive />
              </div>
            </div>
          </div> */}

          <div className="flex flex-col gap-4 pb-2 md:gap-6 md:pb-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 px-4 lg:px-6">
              <div>
                <DataTable columns={columns} data={sales}/>
              </div>
            </div>
          </div>
        </div>
      </div>

    </AppLayout>
  );
}
