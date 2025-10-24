"use client";

import useSWR from 'swr';
import { useState } from 'react';
import ProductGrid from './ProductGrid';
import SearchBar from '../common/SearchBar';
import CategoryBadge from '../category/CategoryBadge';
import api from '../../lib/api';

const fetcher = async url => {
  const response = await api.get(url);
  return response.data;
};

export default function ProductExplorer({ initialCategories = [] }) {
  const [filters, setFilters] = useState({ page: 1, category: '', search: '' });

  const queryParams = new URLSearchParams();
  queryParams.set('page', filters.page);
  if (filters.category) queryParams.set('category', filters.category);
  if (filters.search) queryParams.set('search', filters.search);

  const { data, isLoading } = useSWR(`/products?${queryParams.toString()}`, fetcher);

  return (
    <div className="space-y-6">
      <SearchBar onSearch={search => setFilters(prev => ({ ...prev, search, page: 1 }))} />
      <div className="flex flex-wrap gap-3">
        <CategoryBadge
          label="All"
          active={!filters.category}
          onClick={() => setFilters(prev => ({ ...prev, category: '', page: 1 }))}
        />
        {initialCategories.map(category => (
          <CategoryBadge
            key={category._id}
            label={category.name}
            active={filters.category === category._id}
            onClick={() => setFilters(prev => ({ ...prev, category: category._id, page: 1 }))}
          />
        ))}
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow">
          <p className="text-secondary">Loading products...</p>
        </div>
      ) : (
        <ProductGrid products={data?.data || []} />
      )}

      {data?.meta?.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: data.meta.pages }).map((_, index) => {
            const page = index + 1;
            const isActive = page === filters.page;
            return (
              <button
                key={page}
                onClick={() => setFilters(prev => ({ ...prev, page }))}
                className={`h-10 w-10 rounded-full text-sm font-semibold transition ${isActive ? 'bg-primary text-white' : 'bg-white text-secondary shadow hover:bg-primary/10'}`}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
