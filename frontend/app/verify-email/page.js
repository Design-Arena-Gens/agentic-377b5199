"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const { register, handleSubmit } = useForm();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleVerification({ token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerification = async data => {
    try {
      const response = await api.post('/auth/verify-email', data);
      setStatus(response.data.message);
      toast.success('Email verified successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    }
  };

  const handleResend = async data => {
    try {
      await api.post('/auth/resend-email', data);
      toast.success('Verification email sent');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend email');
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white px-4 py-12 shadow">
      <h1 className="text-2xl font-semibold text-text">Verify Email</h1>
      <p className="mt-2 text-sm text-secondary">Enter the verification token sent to your email or request a new one.</p>

      <form onSubmit={handleSubmit(handleVerification)} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-secondary">Verification Token</label>
          <input {...register('token', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
        </div>
        <button type="submit" className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
          Verify Email
        </button>
      </form>

      <div className="mt-8 rounded-2xl bg-gray-50 p-6">
        <p className="text-sm font-semibold text-text">Resend Email</p>
        <form onSubmit={handleSubmit(handleResend)} className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-secondary">Email</label>
            <input {...register('email', { required: true })} type="email" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <button type="submit" className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow">
            Resend Verification Email
          </button>
        </form>
      </div>

      {status && <p className="mt-4 text-center text-sm text-success">{status}</p>}
    </div>
  );
}
