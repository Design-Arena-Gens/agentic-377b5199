import ProductGrid from './ProductGrid';

export default function RelatedProducts({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-text">Related Products</h2>
      <ProductGrid products={products} />
    </section>
  );
}
