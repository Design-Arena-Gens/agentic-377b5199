"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection({ products = [] }) {
  return (
    <section className="bg-gradient-to-r from-primary to-indigo-600 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-wide">New Arrivals</span>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Elevate your lifestyle with curated products designed for you.
          </h1>
          <p className="text-lg text-white/80">Seamless shopping experience with fast shipping, secure payments, and personalized recommendations.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-white/80">
              Shop Now
            </Link>
            <Link href="/categories" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Browse Categories
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map(product => (
              <div key={product._id} className="relative overflow-hidden rounded-3xl bg-white/10 p-4 backdrop-blur">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.images?.[0] || 'https://via.placeholder.com/480x320?text=Product'}
                    alt={product.title}
                    fill
                    className="rounded-2xl object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="mt-4 space-y-1 text-white">
                  <p className="text-sm uppercase tracking-wide text-white/60">Featured</p>
                  <h3 className="text-xl font-semibold">{product.title}</h3>
                  <p className="text-lg font-medium text-accent">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
