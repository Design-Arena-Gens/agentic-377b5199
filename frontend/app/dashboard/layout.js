"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import AdminSidebar from '../../components/dashboard/AdminSidebar';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute roles={[ 'admin', 'manager' ]}>
      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-12">
        <AdminSidebar activePath={pathname} />
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text">Admin Dashboard</h1>
              <p className="text-secondary">Manage products, orders, and customers.</p>
            </div>
            <Link href="/" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow">
              View Storefront
            </Link>
          </div>
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
