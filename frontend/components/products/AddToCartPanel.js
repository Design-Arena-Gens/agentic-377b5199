"use client";

import { useState } from 'react';
import { useCartContext } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';

export default function AddToCartPanel({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartContext();
  const { user } = useAuthContext();

  return (
    <div className="rounded-3xl bg-white p-8 shadow">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">{product.title}</h1>
          <p className="text-secondary">{product.category?.name}</p>
        </div>
        <span className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</span>
      </div>
      <p className="mt-4 text-sm text-secondary">Inclusive of all taxes. Free shipping on orders above $500.</p>

      <div className="mt-6 flex items-center gap-4">
        <label className="text-sm font-semibold text-secondary">Quantity</label>
        <div className="flex items-center rounded-full border border-gray-200 bg-gray-50">
          <button
            onClick={() => setQuantity(qty => Math.max(1, qty - 1))}
            className="px-4 py-2 text-lg font-bold text-secondary"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(qty => Math.min(product.stock, qty + 1))}
            className="px-4 py-2 text-lg font-bold text-secondary"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={() => addItem(product, quantity)}
        className="mt-8 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
      >
        Add to Cart
      </button>

      {!user && (
        <p className="mt-4 text-center text-xs text-secondary">Sign in for faster checkout and order tracking.</p>
      )}
    </div>
  );
}
