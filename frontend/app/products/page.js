import ProductExplorer from '../../components/products/ProductExplorer';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:5000/api';

async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories`, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error('Failed to load categories');
  }
  return response.json();
}

export default async function ProductsPage() {
  const categories = await fetchCategories();

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-text">Shop Products</h1>
        <p className="text-secondary">Filter by category, search by name, or browse the entire catalog.</p>
      </div>
      <ProductExplorer initialCategories={categories} />
    </div>
  );
}
