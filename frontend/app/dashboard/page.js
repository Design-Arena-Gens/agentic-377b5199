"use client";

import useSWR from 'swr';
import api from '../../lib/api';

const fetcher = async url => {
  const response = await api.get(url);
  return response.data;
};

export default function DashboardOverviewPage() {
  const { data: products } = useSWR('/products', fetcher);
  const { data: orders } = useSWR('/orders', fetcher);

  const totalRevenue = orders?.reduce((sum, order) => sum + (order.totals?.grandTotal || 0), 0) || 0;
  const pendingOrders = orders?.filter(order => order.status !== 'delivered').length || 0;

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-sm text-secondary">Total Revenue</p>
          <p className="mt-2 text-2xl font-semibold text-text">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-sm text-secondary">Products</p>
          <p className="mt-2 text-2xl font-semibold text-text">{products?.data?.length || 0}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow">
          <p className="text-sm text-secondary">Pending Orders</p>
          <p className="mt-2 text-2xl font-semibold text-text">{pendingOrders}</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-text">Recent Orders</h2>
        <div className="mt-4 space-y-3 text-sm text-secondary">
          {(orders || []).slice(0, 5).map(order => (
            <div key={order._id} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
              <div>
                <p className="font-semibold text-text">Order #{order._id.slice(-6)}</p>
                <p>{order.user?.email}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-text">${order.totals?.grandTotal?.toFixed(2)}</p>
                <p>{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
