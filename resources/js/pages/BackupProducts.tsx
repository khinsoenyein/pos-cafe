import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
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

// Define type
type Product = {
  id: number;
  name: string;
  sku?: string;
  description?: string;
  remark?: string;
};

type PageProps = {
  products: Product[];
  errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Products', href: '/products' },
];

export default function Products() {
  const { products, errors } = usePage<PageProps>().props;

  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    remark: '',
  });
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/products', form, {
      preserveScroll: true,
      onSuccess: () => {
        setForm({ name: '', sku: '', description: '', remark: '' });
        setOpen(false);
        toast.success('Product added successfully');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setIsSubmitting(true);

    router.put(`/products/${editing.id}`, form, {
      preserveScroll: true,
      onSuccess: () => {
        setEditDialog(false);
        setEditing(null);
        setForm({ name: '', sku: '', description: '', remark: '' });
        toast.success('Product updated successfully');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name || '',
      sku: product.sku || '',
      description: product.description || '',
      remark: product.remark || '',
    });
    setEditDialog(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Products" />
      <div className="flex flex-col gap-4 p-4 overflow-x-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Product List</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    required
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="SKU (optional)"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.sku && <p className="text-sm text-red-600 mt-1">{errors.sku}</p>}
                </div>
                <div>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
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
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Product Dialog */}
          <Dialog open={editDialog} onOpenChange={setEditDialog}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    required
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    placeholder="SKU (optional)"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.sku && <p className="text-sm text-red-600 mt-1">{errors.sku}</p>}
                </div>
                <div>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
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

        {/* Product Table */}
        <div className="overflow-x-auto border border-sidebar-border/70 dark:border-sidebar-border rounded-xl mt-4">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="bg-gray-100 dark:bg-sidebar">
              <tr>
                <th className="px-4 py-2 border-r">Name</th>
                <th className="px-4 py-2 border-r">SKU</th>
                <th className="px-4 py-2 border-r">Description</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-center">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-2 border-r">{product.name}</td>
                    <td className="px-4 py-2 border-r">{product.sku}</td>
                    <td className="px-4 py-2 border-r">{product.description}</td>
                    <td className="px-4 py-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(product)}>
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
