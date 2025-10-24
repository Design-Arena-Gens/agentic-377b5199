"use client";

import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';
import { useAuthContext } from '../../../context/AuthContext';

const fetcher = async id => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const { data, error, isLoading } = useSWR(user ? params.id : null, fetcher);

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-12">Loading...</div>;
  if (!user) {
    router.push('/auth');
    return null;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl bg-white px-4 py-12 text-center shadow">
        <h1 className="text-2xl font-semibold text-text">Unable to load order</h1>
        <Link href="/orders" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (isLoading || !data) {
    return <div className="mx-auto max-w-4xl px-4 py-12">Fetching order details...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text">Order #{data._id.slice(-8)}</h1>
          <p className="text-secondary">Placed on {new Date(data.createdAt).toLocaleString()}</p>
        </div>
        <Link href="/orders" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow">
          Back to Orders
        </Link>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-text">Items</h2>
        <ul className="mt-4 space-y-3 text-sm text-secondary">
          {data.items.map(item => (
            <li key={item._id} className="flex items-center justify-between">
              <span>{item.product?.title} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between text-lg font-semibold text-text">
          <span>Total</span>
          <span>${data.totals?.grandTotal?.toFixed(2)}</span>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-text">Shipping Address</h3>
          <ul className="mt-4 space-y-1 text-sm text-secondary">
            <li>{data.shippingAddress.fullName}</li>
            <li>{data.shippingAddress.addressLine1}</li>
            {data.shippingAddress.addressLine2 && <li>{data.shippingAddress.addressLine2}</li>}
            <li>{data.shippingAddress.city}, {data.shippingAddress.state} {data.shippingAddress.postalCode}</li>
            <li>{data.shippingAddress.country}</li>
            <li>Phone: {data.shippingAddress.phone}</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow">
          <h3 className="text-lg font-semibold text-text">Payment</h3>
          <p className="mt-4 text-sm text-secondary">Status: <span className="font-semibold text-success">{data.paymentInfo.status}</span></p>
          <p className="text-sm text-secondary">Provider: {data.paymentInfo.provider}</p>
          <p className="text-sm text-secondary">Transaction: {data.paymentInfo.transactionId}</p>
        </div>
      </section>
    </div>
  );
}
