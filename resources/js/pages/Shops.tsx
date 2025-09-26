import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Shop, type BreadcrumbItem } from '@/types';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type PageProps = {
  shops: Shop[];
  errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Master', href: '' },
  { title: 'Shops', href: '/shops' },
];

export default function Shops() {
  const { shops, errors } = usePage<PageProps>().props;

  const [form, setForm] = useState({
    name: '',
    code: '',
    location: '',
    remark: '',
  });
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editing, setEditing] = useState<Shop | null>(null);

  const [search, setSearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/shops', form, {
      preserveScroll: true,
      onSuccess: () => {
        setForm({ name: '', code: '', location: '', remark: '' });
        setOpen(false);
        toast.success('Shop added successfully');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setIsSubmitting(true);

    router.put(`/shops/${editing.id}`, form, {
      preserveScroll: true,
      onSuccess: () => {
        setEditDialog(false);
        setEditing(null);
        setForm({ name: '', code: '', location: '', remark: '' });
        toast.success('Shop updated successfully');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  const openEdit = (shop: Shop) => {
    setEditing(shop);
    setForm({
      name: shop.name || '',
      code: shop.code || '',
      location: shop.location || '',
      remark: shop.remark || '',
    });
    setEditDialog(true);
  };

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Shops" />
      <div className="flex flex-col gap-4 p-4 overflow-x-auto">
        {/* <h1 className="text-2xl font-bold">Shop List</h1> */}
        <div>
          <h1 className="text-xl font-bold">Shop</h1>
          <span className="text-sm text-gray-500">Shop Information</span>
        </div>
        <div className="flex items-center justify-between">
          <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="border rounded p-2 max-w-sm"
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Shop</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Shop</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Shop Name"
                    required
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <Input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="Shop code"
                    required
                    className="border rounded p-2 w-full dark:bg-transparent uppercase"
                  />
                  {errors.code && <p className="text-sm text-red-600 mt-1">{errors.code}</p>}
                </div>
                <div>
                  <Textarea 
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
                </div>
                <div>
                  <Textarea 
                    name="remark"
                    value={form.remark}
                    onChange={handleChange}
                    placeholder="Remark"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.remark && <p className="text-sm text-red-600 mt-1">{errors.remark}</p>}
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Shop Dialog */}
          <Dialog open={editDialog} onOpenChange={setEditDialog}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Shop</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Shop Name"
                    required
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    placeholder="Shop code"
                    required
                    className="border rounded p-2 w-full dark:bg-transparent uppercase"
                    readOnly
                  />
                  {errors.code && <p className="text-sm text-red-600 mt-1">{errors.code}</p>}
                </div>
                <div>
                  <textarea
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
                </div>
                <div>
                  <textarea
                    name="remark"
                    value={form.remark}
                    onChange={handleChange}
                    placeholder="Remark"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.remark && <p className="text-sm text-red-600 mt-1">{errors.remark}</p>}
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Shop Table */}
        <div className="overflow-x-auto border border-sidebar-border/70 dark:border-sidebar-border rounded-xl mt-2">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="bg-gray-100 dark:bg-sidebar">
              <tr>
                <th className="px-4 py-2 border-r">Name</th>
                <th className="px-4 py-2 border-r">Code</th>
                <th className="px-4 py-2 border-r">Loation</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center">
                    No shops found.
                  </td>
                </tr>
              ) : (
                filteredShops.map((shop) => (
                  <tr key={shop.id} className="border-t">
                    <td className="px-4 py-2 border-r">{shop.name}</td>
                    <td className="px-4 py-2 border-r">{shop.code}</td>
                    <td className="px-4 py-2 border-r">{shop.location}</td>
                    <td className="px-4 py-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(shop)}>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
