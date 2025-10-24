"use client";

import Link from 'next/link';
import { useCartContext } from '../../context/CartContext';

export default function CartPage() {
  const { items, totals, updateQuantity, removeItem } = useCartContext();

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold text-text">Your Cart</h1>
        <p className="text-secondary">Review your items before checkout.</p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow">
          <p className="text-secondary">Your cart is empty. Start shopping to add items.</p>
          <Link href="/products" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {items.map(item => (
              <div key={item.product._id} className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow md:flex-row md:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-text">{item.product.title}</h3>
                  <p className="text-sm text-secondary">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-gray-200">
                    <button onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))} className="px-3 py-1 text-lg">
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="px-3 py-1 text-lg">
                      +
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.product._id)} className="text-sm font-semibold text-error">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-white p-8 shadow">
            <h2 className="text-xl font-semibold text-text">Order Summary</h2>
            <dl className="mt-4 space-y-2 text-sm text-secondary">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>${totals.subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd>${totals.tax.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>${totals.shipping.toFixed(2)}</dd>
              </div>
            </dl>
            <div className="mt-6 flex items-center justify-between text-lg font-semibold text-text">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="mt-6 flex w-full justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
              Continue to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
