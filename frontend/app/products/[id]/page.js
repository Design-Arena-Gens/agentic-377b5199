import Image from 'next/image';
import Link from 'next/link';
import RelatedProducts from '../../../components/products/RelatedProducts';
import AddToCartPanel from '../../../components/products/AddToCartPanel';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:5000/api';

async function fetchProduct(id) {
  const response = await fetch(`${API_BASE}/products/${id}`, { next: { revalidate: 30 } });
  if (!response.ok) {
    return null;
  }
  return response.json();
}

async function fetchRelated(categoryId, currentId) {
  if (!categoryId) return [];
  const response = await fetch(`${API_BASE}/products?category=${categoryId}&limit=4`, { next: { revalidate: 60 } });
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.data.filter(product => product._id !== currentId);
}

export default async function ProductDetailPage({ params }) {
  const product = await fetchProduct(params.id);

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-text">Product not found</h1>
        <Link href="/products" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
          Back to Products
        </Link>
      </div>
    );
  }

  const related = await fetchRelated(product.category?._id, product._id);

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative h-96 overflow-hidden rounded-3xl bg-white shadow">
            <Image
              src={product.images?.[0] || 'https://via.placeholder.com/640x480?text=Product'}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {(product.images || []).map((image, index) => (
              <div key={index} className="relative h-24 overflow-hidden rounded-2xl bg-white shadow">
                <Image src={image} alt={`${product.title}-${index}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <AddToCartPanel product={product} />
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold text-text">Product Description</h2>
          <p className="text-secondary leading-relaxed">{product.description}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow">
          <h3 className="text-xl font-semibold text-text">Product Details</h3>
          <ul className="mt-4 space-y-2 text-sm text-secondary">
            <li><span className="font-semibold text-text">Category:</span> {product.category?.name || 'General'}</li>
            <li><span className="font-semibold text-text">Stock:</span> {product.stock} units</li>
            <li><span className="font-semibold text-text">SKU:</span> {product.slug}</li>
          </ul>
        </div>
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
