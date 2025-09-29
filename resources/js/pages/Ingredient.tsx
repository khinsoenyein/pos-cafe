import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Ingredient, Unit, type BreadcrumbItem } from '@/types';
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
import { Select, SelectContent, SelectGroup, SelectLabel, SelectValue, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type PageProps = {
  ingredients: Ingredient[];
  units: Unit[];
  errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Master', href: '' },
  { title: 'Ingredients', href: '/ingredients' },
];

export default function Products() {
  const { ingredients, units, errors } = usePage<PageProps>().props;

  const [form, setForm] = useState<{
    name: string;
    description: string;
    unit_id: number | null;
    remark: string;
  }>({
    name: '',
    description: '',
    unit_id: null,
    remark: '',
  });
  const resetForm = () => {
    setForm({
        name: '',
        description: '',
        unit_id: null,
        remark: '',
    });
  };
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [search, setSearch] = useState('');

  const [unitId, setUnitId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/ingredients',  {
      name: form.name,
      description: form.description,
      remark: form.remark,
      unit_id: unitId
    }, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setForm({ name: '', description: '', unit_id: null, remark: '' });
        setUnitId(null);
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

    router.post(`/ingredients/${editing.id}`, {
      id: editing.id,
      name: form.name,
      description: form.description,
      remark: form.remark,
      unit_id: form.unit_id,
      _method: 'PUT'
    }, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setEditDialog(false);
        setEditing(null);
        setForm({ name: '', description: '', unit_id: null, remark: '' });
        setUnitId(null);
        toast.success('Ingredient updated successfully');
      },
      onFinish: () => setIsSubmitting(false),
    });
  };

  // handle input changes
  const updateField = (field: string, value: any) => {
    setForm((s) => ({ ...s, [field]: value }));
  };

  const openEdit = (ingredient: Ingredient) => {
    setEditing(ingredient);
    setForm({
      name: ingredient.name || '',
      description: ingredient.description || '',
      unit_id: ingredient.unit_id || null,
      remark: ingredient.remark || '',
    });
    setEditDialog(true);
  };

  const filteredProducts = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ingredient" />
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
          <Dialog open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) {
                resetForm(); // cleanup when dialog closes
                }
            }}>
            <DialogTrigger asChild>
              <Button>Add Ingredient</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Ingredient</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <div>
                  <Input
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
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                </div>
                <div>
                    <Select onValueChange={(val) => setUnitId(Number(val))}>
                        <SelectTrigger className="border rounded p-2 w-full dark:bg-transparent">
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {units.map((unit) => (
                            <SelectItem key={unit.id} value={String(unit.id)}>
                                {unit.name} ({unit.symbol})
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.ingredient_id && <p className="text-sm text-red-600 mt-1">{errors.ingredient_id}</p>}
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

          {/* Edit Ingredient Dialog */}
          <Dialog open={editDialog} onOpenChange={(isOpen) => {
                setEditDialog(isOpen);
                if (!isOpen) {
                resetForm(); // cleanup when dialog closes
                }
            }}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Ingredient</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4" encType="multipart/form-data">
                <div>
                  <Input
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
                    <Select
                        value={form.unit_id ? String(form.unit_id) : ''}
                        // onValueChange={(val) => setUnitId(Number(val))}>
                        onValueChange={(v) => updateField('unit_id', v ? Number(v) : null)}
                    >
                        <SelectTrigger className="border rounded p-2 w-full dark:bg-transparent">
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {units.map((unit) => (
                            <SelectItem key={unit.id} value={String(unit.id)}>
                                {unit.name} ({unit.symbol})
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.ingredient_id && <p className="text-sm text-red-600 mt-1">{errors.ingredient_id}</p>}
                </div>
                <div>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="border rounded p-2 w-full dark:bg-transparent"
                  />
                  {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
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
                <th className="px-4 py-2 border-r">Base Unit</th>
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
                    <td className="px-4 py-2 border-r">{ingredient.unit.name} ({ingredient.unit.symbol})</td>
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
