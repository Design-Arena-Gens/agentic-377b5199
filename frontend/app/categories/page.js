import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:5000/api';

async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories`, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error('Unable to load categories');
  }
  return response.json();
}

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold text-text">Browse Categories</h1>
        <p className="text-secondary">Explore collections curated by our merchandising team.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(category => (
          <div key={category._id} className="rounded-3xl bg-white p-8 shadow">
            <h2 className="text-xl font-semibold text-text">{category.name}</h2>
            <p className="mt-2 text-sm text-secondary">{category.description || 'Discover top picks in this category.'}</p>
            <Link
              href={`/products?category=${category._id}`}
              className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Shop Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
