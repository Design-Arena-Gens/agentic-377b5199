"use client";

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { useCartContext } from '../../context/CartContext';
import { useAuthContext } from '../../context/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totals, clearCart } = useCartContext();
  const { user, loading } = useAuthContext();
  const [isSubmitting, setSubmitting] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || ''
    }
  });

  const onSubmit = async data => {
    if (!items.length) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setSubmitting(true);
      const paymentIntent = await api.post('/payments/intent', {
        amount: Math.round(totals.total * 100),
        currency: 'usd'
      });

      await api.post('/orders', {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          fullName: data.fullName,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          phone: data.phone
        },
        paymentInfo: {
          provider: 'stripe',
          transactionId: paymentIntent.data.clientSecret,
          status: 'paid'
        }
      });

      clearCart();
      toast.success('Order placed successfully');
      router.push('/orders');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-12">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl bg-white px-4 py-12 text-center shadow">
        <h1 className="text-2xl font-semibold text-text">Sign in to checkout</h1>
        <p className="mt-2 text-secondary">You must be logged in to complete your purchase.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold text-text">Checkout</h1>
        <p className="text-secondary">Provide your shipping details to complete the order.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-text">Shipping Address</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-secondary">Full Name</label>
                <input {...register('fullName', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-secondary">Email</label>
                <input {...register('email', { required: true })} type="email" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-secondary">Phone</label>
                <input {...register('phone', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-secondary">Address Line 1</label>
                <input {...register('addressLine1', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-secondary">Address Line 2</label>
                <input {...register('addressLine2')} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-secondary">City</label>
                <input {...register('city', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-secondary">State</label>
                <input {...register('state', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-secondary">Postal Code</label>
                <input {...register('postalCode', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-secondary">Country</label>
                <input {...register('country', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-text">Payment</h2>
            <p className="mt-2 text-sm text-secondary">Securely powered by Stripe. Entering card details is simulated in this demo flow.</p>
            <div className="mt-4 space-y-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-secondary">
              <p>Simulated payment intent is generated on submission. Integrate Stripe Elements for production.</p>
            </div>
          </section>
        </div>

        <aside className="rounded-3xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-text">Order Summary</h2>
          <ul className="mt-4 space-y-3 text-sm text-secondary">
            {items.map(item => (
              <li key={item.product._id} className="flex justify-between">
                <span>{item.product.title} × {item.quantity}</span>
                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 text-sm text-secondary">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${totals.shipping.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between text-lg font-semibold text-text">
            <span>Total</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </aside>
      </form>
    </div>
  );
}
