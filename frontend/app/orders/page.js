"use client";

import useSWR from 'swr';
import Link from 'next/link';
import api from '../../lib/api';
import { useAuthContext } from '../../context/AuthContext';

const fetcher = async url => {
  const response = await api.get(url);
  return response.data;
};

export default function OrdersPage() {
  const { user, loading } = useAuthContext();
  const { data, isLoading } = useSWR(user ? '/orders' : null, fetcher);

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-12">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl rounded-3xl bg-white px-4 py-12 text-center shadow">
        <h1 className="text-2xl font-semibold text-text">Access Denied</h1>
        <p className="mt-2 text-secondary">Sign in to view your orders and track shipment status.</p>
        <Link href="/auth" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div>
        <h1 className="text-3xl font-bold text-text">Orders</h1>
        <p className="text-secondary">Track your recent purchases and manage deliveries.</p>
      </div>

      {isLoading ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow">
          <p className="text-secondary">Fetching orders...</p>
        </div>
      ) : data?.length ? (
        <div className="space-y-6">
          {data.map(order => (
            <div key={order._id} className="rounded-3xl bg-white p-6 shadow">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-secondary">Order Placed</p>
                  <p className="text-lg font-semibold text-text">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary">Total</p>
                  <p className="text-lg font-semibold text-text">${order.totals?.grandTotal?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary">Status</p>
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{order.status}</span>
                </div>
                <Link href={`/orders/${order._id}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-12 text-center shadow">
          <p className="text-secondary">No orders yet. Start shopping to place your first order!</p>
        </div>
      )}
    </div>
  );
}
