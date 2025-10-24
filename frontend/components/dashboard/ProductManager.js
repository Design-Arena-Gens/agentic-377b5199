"use client";

import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const fetcher = async url => {
  const response = await api.get(url);
  return response.data;
};

export default function ProductManager({ categories }) {
  const { data, mutate } = useSWR('/products', fetcher);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async formData => {
    try {
      await api.post('/products', {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: formData.images ? formData.images.split(',').map(url => url.trim()) : []
      });
      toast.success('Product created');
      reset();
      mutate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  const deleteProduct = async id => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      mutate();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-text">Add Product</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-secondary">Title</label>
            <input {...register('title', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-secondary">Description</label>
            <textarea {...register('description', { required: true })} rows={3} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="text-sm font-semibold text-secondary">Price</label>
            <input {...register('price', { required: true })} type="number" step="0.01" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="text-sm font-semibold text-secondary">Stock</label>
            <input {...register('stock', { required: true })} type="number" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="text-sm font-semibold text-secondary">Category</label>
            <select {...register('category', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm">
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-secondary">Images (comma separated URLs)</label>
            <input {...register('images')} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-secondary">
              <input type="checkbox" {...register('isFeatured')} className="rounded" />
              Featured Product
            </label>
          </div>
          <button type="submit" className="md:col-span-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
            Save Product
          </button>
        </form>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-text">Products</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-secondary">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-secondary">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map(product => (
                <tr key={product._id} className="border-t">
                  <td className="px-4 py-3 text-text">{product.title}</td>
                  <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">{product.category?.name}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteProduct(product._id)} className="text-sm font-semibold text-error">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
