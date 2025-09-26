import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Ingredient, type BreadcrumbItem } from '@/types';
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

type PageProps = {
  ingredients: Ingredient[];
  errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Master', href: '' },
  { title: 'Ingredients', href: '/ingredients' },
];

export default function Products() {
  const { ingredients, errors } = usePage<PageProps>().props;

  const [form, setForm] = useState({
    name: '',
    description: '',
    remark: '',
  });
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [search, setSearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', form.name);
    if (form.description) data.append('description', form.description);
    if (form.remark) data.append('remark', form.remark);

    router.post('/ingredients', data, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setForm({ name: '', description: '', remark: '' });
        setOpen(false);
        toast.success('Ingredient added successfully');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', form.name);
    if (form.description) data.append('description', form.description);
    if (form.remark) data.append('remark', form.remark);
    data.append('_method', 'PUT');

    router.post(`/ingredients/${editing.id}`, data, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setEditDialog(false);
        setEditing(null);
        setForm({ name: '', description: '', remark: '' });
        toast.success('Ingredient updated successfully');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  const openEdit = (ingredient: Ingredient) => {
    setEditing(ingredient);
    setForm({
      name: ingredient.name || '',
      description: ingredient.description || '',
      remark: ingredient.remark || '',
    });
    setEditDialog(true);
  };

  const filteredProducts = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Products" />
      <div className="flex flex-col gap-4 p-4 overflow-x-auto">
        {/* <h1 className="text-2xl font-bold">Ingredient List</h1> */}
        <div>
          <h1 className="text-xl font-bold">Ingredient</h1>
          <span className="text-sm text-gray-500">Ingredient Information</span>
        </div>

        <div className="flex items-center justify-between">
          <Input
            type="text"
            placeholder="Search ingredients..."
            className="border rounded p-2 w-full max-w-sm mr-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Add Ingredient</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Ingredient</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ingredient Name"
                    required
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
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

          {/* Edit Ingredient Dialog */}
          <Dialog open={editDialog} onOpenChange={setEditDialog}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Ingredient</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4" encType="multipart/form-data">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ingredient Name"
                    required
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
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

        {/* Ingredient Table */}
        <div className="overflow-x-auto border border-sidebar-border/70 dark:border-sidebar-border rounded-xl mt-2">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="bg-gray-100 dark:bg-sidebar">
              <tr>
                <th className="px-4 py-2 border-r">Name</th>
                <th className="px-4 py-2 border-r">Description</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center">
                    No ingredients found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((ingredient) => (
                  <tr key={ingredient.id} className="border-t">
                    <td className="px-4 py-2 border-r">{ingredient.name}</td>
                    <td className="px-4 py-2 border-r">{ingredient.description}</td>
                    <td className="px-4 py-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(ingredient)}>
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
