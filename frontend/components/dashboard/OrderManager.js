"use client";

import useSWR from 'swr';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const fetcher = async url => {
  const response = await api.get(url);
  return response.data;
};

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderManager() {
  const { data, mutate } = useSWR('/orders', fetcher);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      toast.success('Order status updated');
      mutate();
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-text">Orders</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-secondary">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-secondary">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Update</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(order => (
              <tr key={order._id} className="border-t">
                <td className="px-4 py-3 text-text">#{order._id.slice(-6)}</td>
                <td className="px-4 py-3">{order.user?.email}</td>
                <td className="px-4 py-3">${order.totals?.grandTotal?.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{order.status}</span>
                </td>
                <td className="px-4 py-3">
                  <select
                    defaultValue={order.status}
                    onChange={event => updateStatus(order._id, event.target.value)}
                    className="rounded-xl border border-gray-200 px-3 py-2 text-xs"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
