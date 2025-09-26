import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { Product, type BreadcrumbItem } from '@/types';
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
  products: Product[];
  errors: Record<string, string>;
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Master', href: '' },
  { title: 'Products', href: '/products' },
];

export default function Products() {
  const { products, errors } = usePage<PageProps>().props;

  const [form, setForm] = useState({
    name: '',
    sku: '',
    description: '',
    image: null as File | null,
    remark: '',
  });
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'image' && files) {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', form.name);
    if (form.sku) data.append('sku', form.sku);
    if (form.description) data.append('description', form.description);
    if (form.remark) data.append('remark', form.remark);
    if (form.image) data.append('image', form.image);

    router.post('/products', data, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setForm({ name: '', sku: '', description: '', remark: '', image: null });
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
    const data = new FormData();
    data.append('name', form.name);
    if (form.sku) data.append('sku', form.sku);
    if (form.description) data.append('description', form.description);
    if (form.remark) data.append('remark', form.remark);
    if (form.image) data.append('image', form.image);
    data.append('_method', 'PUT');

    router.post(`/products/${editing.id}`, data, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setEditDialog(false);
        setEditing(null);
        setForm({ name: '', sku: '', description: '', remark: '', image: null });
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
      image: null,
    });
    setEditDialog(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Products" />
      <div className="flex flex-col gap-4 p-4 overflow-x-auto">
        {/* <h1 className="text-2xl font-bold">Product List</h1> */}
        <div>
          <h1 className="text-xl font-bold">Product</h1>
          <span className="text-sm text-gray-500">Product Information</span>
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
              <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <div>
                  <Input
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
                  <Input
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
                  <Input
                    id="picture"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full"
                  />
                  {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
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
              <form onSubmit={handleEditSubmit} className="space-y-4" encType="multipart/form-data">
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
                {editing?.image && (
                  <div>
                    <img
                      src={`/storage/${editing.image}`}
                      alt="Current Product"
                      className="h-20 w-20 rounded border mb-2"
                    />
                  </div>
                )}
                <div>
                  <Input
                    id="picture"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full"
                  />
                  {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
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
        <div className="overflow-x-auto border border-sidebar-border/70 dark:border-sidebar-border rounded-xl mt-2">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="bg-gray-100 dark:bg-sidebar">
              <tr>
                <th className="px-4 py-2 border-r">Name</th>
                <th className="px-4 py-2 border-r">SKU</th>
                {/* <th className="px-4 py-2 border-r">Description</th> */}
                <th className="px-4 py-2 border-r">Image</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-center">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-2 border-r">{product.name}</td>
                    <td className="px-4 py-2 border-r">{product.sku}</td>
                    {/* <td className="px-4 py-2 border-r">{product.description}</td> */}
                    <td className="px-4 py-2 border-r">
                      {product.image ? (
                        <img
                          src={`/storage/${product.image}`}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                    </td>
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
