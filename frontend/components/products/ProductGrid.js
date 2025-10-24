"use client";

import ProductCard from './ProductCard';

export default function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow">
        <p className="text-secondary">No products found. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
