"use client";

import useSWR from 'swr';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const fetcher = async url => {
  const response = await api.get(url);
  return response.data;
};

const roles = ['customer', 'manager', 'admin'];

export default function UserManager() {
  const { data, mutate } = useSWR('/users', fetcher);

  const changeRole = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      toast.success('Role updated');
      mutate();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-text">Users</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-secondary">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-secondary">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(user => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-3 text-text">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone}</td>
                <td className="px-4 py-3">
                  <select
                    className="rounded-xl border border-gray-200 px-3 py-2 text-xs"
                    defaultValue={user.role}
                    onChange={event => changeRole(user._id, event.target.value)}
                  >
                    {roles.map(role => (
                      <option key={role} value={role}>{role}</option>
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
