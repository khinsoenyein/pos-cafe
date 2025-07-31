import { Shop, User, type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type NavItem } from '@/types';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Shop setup',
        href: '/settings/user/shop',
    },
];

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: null,
    },
    {
        title: 'Password',
        href: '/settings/password',
        icon: null,
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
        icon: null,
    }
];

export type UserShopSetupPageProps = {
    usres: User[];
    shops: Shop[];
    errors: Record<string, string | string[]>; // For Inertia errors
};

type ProfileForm = {
    name: string;
    email: string;
};

export default function UserShop() {
    
    const { usres, shops, errors } = usePage<UserShopSetupPageProps>().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
    };

    const currentPath = window.location.pathname;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <div className="px-4 py-6">
                <Heading title="User Shop setup" description="Setup user and shop" />

                <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <aside className="w-full max-w-xl lg:w-48">
                        <nav className="flex flex-col space-y-1 space-x-0">
                            {sidebarNavItems.map((item, index) => (
                                <Button
                                    key={`${item.href}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        'bg-muted': currentPath === item.href,
                                    })}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.title}
                                    </Link>
                                </Button>
                            ))}
                        </nav>
                    </aside>

                    <Separator className="my-6 md:hidden" />

                    <div className="flex-1 md:max-w-2xl">
                        {/* <section className="max-w-xl space-y-12">{children}</section> */}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
