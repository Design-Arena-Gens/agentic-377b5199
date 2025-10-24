"use client";

import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const fetcher = async url => {
  const response = await api.get(url);
  return response.data;
};

export default function CategoryManager() {
  const { data, mutate } = useSWR('/categories', fetcher);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async formData => {
    try {
      await api.post('/categories', formData);
      toast.success('Category created');
      reset();
      mutate();
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  const deleteCategory = async id => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      mutate();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 rounded-3xl bg-white p-6 shadow">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="text-sm font-semibold text-secondary">Name</label>
          <input {...register('name', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-secondary">Description</label>
          <input {...register('description')} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
        </div>
        <button type="submit" className="md:col-span-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
          Add Category
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-secondary">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-secondary">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(category => (
              <tr key={category._id} className="border-t">
                <td className="px-4 py-3 text-text">{category.name}</td>
                <td className="px-4 py-3">{category.description}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => deleteCategory(category._id)} className="text-sm font-semibold text-error">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
