"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth');
      } else if (roles && !roles.includes(user.role)) {
        router.replace('/');
      }
    }
  }, [user, loading, router, roles]);

  if (loading || !user) {
    return <div className="px-4 py-12">Loading...</div>;
  }

  if (roles && !roles.includes(user.role)) {
    return <div className="px-4 py-12">Unauthorized</div>;
  }

  return children;
}
