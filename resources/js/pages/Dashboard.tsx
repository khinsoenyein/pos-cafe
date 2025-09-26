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
import { DataTable } from '@/components/data-table';
import { columns } from '@/components/Sales/columns';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart } from 'recharts';

export type DashboardProps = {
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
            <SectionCards />
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

          <div className="flex flex-col gap-4 pb-2 md:gap-6 md:pb-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 px-4 lg:px-6"> 
              <div>
                <ChartAreaInteractive />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pb-2 md:gap-6 md:pb-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 px-4 lg:px-6"> 
              <div>
                {/* Sales Table */}
                <DataTable columns={columns} data={sales}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </AppLayout>
  );
}
