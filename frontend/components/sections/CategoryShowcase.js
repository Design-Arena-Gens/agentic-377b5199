"use client";

import CategoryBadge from '../category/CategoryBadge';

export default function CategoryShowcase({ categories = [] }) {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text">Shop by Category</h2>
          <p className="text-sm text-secondary">Find what you love faster with curated collections.</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {categories.map(category => (
          <CategoryBadge key={category._id} label={category.name} />
        ))}
      </div>
    </section>
  );
}
