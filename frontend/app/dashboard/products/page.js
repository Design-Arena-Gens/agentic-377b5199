import ProductManager from '../../../components/dashboard/ProductManager';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:5000/api';

async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to load categories');
  }
  return response.json();
}

export default async function DashboardProductsPage() {
  const categories = await fetchCategories();
  return <ProductManager categories={categories} />;
}
