import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, CircleDollarSign, FileBox, FileChartPie, FileText, Folder, LayoutGrid, LayoutList, ListCheck, LucideFileText, Package, PackageCheck, PackageOpen, ShoppingBasket, Store } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const posNavItems: NavItem[] = [
    {
        title: 'POS',
        href: '/sales/create',
        icon: ShoppingBasket,
    },
];

const masterNavItems: NavItem[] = [
    {
        title: 'Shop',
        href: '/shops',
        icon: Store,
    },
    {
        title: 'Product',
        href: '/products',
        icon: Package,
    },
    {
        title: 'Price',
        href: '/price',
        icon: CircleDollarSign,
    }
];

const recipeNavItems: NavItem[] = [
    {
        title: 'Ingredient',
        href: '/ingredients',
        icon: LayoutList,
    },
    {
        title: 'Recipe',
        href: '/recipe',
        icon: FileText,
    },
];

const inventoryNavItems: NavItem[] = [
    {
        title: 'Inventory Adjustment',
        href: '/inventory-adjustment',
        icon: PackageOpen,
    },
    {
        title: 'Inventory Balance',
        href: '/inventory-balance',
        icon: FileBox,
    },
];

const reportNavItems: NavItem[] = [
    {
        title: 'Sales',
        href: '/sales/list',
        icon: FileChartPie,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Admin',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} title='' />
                <NavMain items={posNavItems} title='POS' />
                <NavMain items={masterNavItems} title='Master' />
                <NavMain items={recipeNavItems} title='Recipe' />
                <NavMain items={inventoryNavItems} title='Inventory' />
                <NavMain items={reportNavItems} title='Report' />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
