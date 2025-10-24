"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCartContext } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCartContext();

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg">
      <Link href={`/products/${product._id}`}>
        <div className="relative h-56 w-full">
          <Image
            src={product.images?.[0] || 'https://via.placeholder.com/640x480?text=Product'}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-text">{product.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-secondary">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
          <button
            onClick={() => addItem(product, 1)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
