import ProductGrid from '../components/products/ProductGrid';
import HeroSection from '../components/sections/HeroSection';
import CategoryShowcase from '../components/sections/CategoryShowcase';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:5000/api';

async function fetchProducts() {
  const response = await fetch(`${API_BASE}/products?limit=8`, { next: { revalidate: 60 } });
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories`, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export default async function HomePage() {
  const [productData, categories] = await Promise.all([fetchProducts(), fetchCategories()]);

  return (
    <div className="space-y-16 pb-16">
      <HeroSection products={productData.data.slice(0, 3)} />
      <CategoryShowcase categories={categories} />
      <section className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text">Featured Products</h2>
            <p className="text-sm text-secondary">Curated selection handpicked for you.</p>
          </div>
        </div>
        <div className="mt-8">
          <ProductGrid products={productData.data} />
        </div>
      </section>
    </div>
  );
}
