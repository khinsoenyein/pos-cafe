import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { User, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, CircleDollarSign, FileBox, FileChartPie, FileText, Folder, FolderClosed, LayoutGrid, LayoutList, Package, PackageOpen, ShoppingBag, ShoppingBasket, Store } from 'lucide-react';
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

const purchaseNavItems: NavItem[] = [
    {
        title: 'Create',
        href: '/purchases/create',
        icon: ShoppingBag,
    },
    {
        title: 'List',
        href: '/purchases/list',
        icon: FolderClosed,
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
        title: 'Inventory Transaction',
        href: '/inventory-transaction',
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

interface UserMenuContentProps {
    user: User;
}

export function AppSidebar({ user }: UserMenuContentProps) {
    const isAdmin = Boolean(user?.admin); 

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

            
            {isAdmin == true ? (
                <SidebarContent>
                    <NavMain items={mainNavItems} title='' />
                    <NavMain items={posNavItems} title='POS' />
                    <NavMain items={purchaseNavItems} title='Purchase' />
                    <NavMain items={masterNavItems} title='Master' />
                    <NavMain items={recipeNavItems} title='Recipe' />
                    <NavMain items={inventoryNavItems} title='Inventory' />
                    <NavMain items={reportNavItems} title='Report' />
                </SidebarContent>
            ):(
                <SidebarContent>
                    <NavMain items={mainNavItems} title='' />
                    <NavMain items={posNavItems} title='POS' />
                </SidebarContent>
            )}

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
