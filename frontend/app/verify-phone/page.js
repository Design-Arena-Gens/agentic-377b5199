"use client";

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function VerifyPhonePage() {
  const initiateForm = useForm();
  const verifyForm = useForm();

  const initiateVerification = async data => {
    try {
      await api.post('/auth/phone/initiate', data);
      toast.success('Verification code sent to your phone');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send code');
    }
  };

  const handleVerification = async data => {
    try {
      await api.post('/auth/phone/verify', data);
      toast.success('Phone verified successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-3xl bg-white px-4 py-12 shadow">
      <h1 className="text-2xl font-semibold text-text">Verify Phone Number</h1>
      <p className="mt-2 text-sm text-secondary">Request an OTP to verify your mobile number.</p>

      <section className="mt-6 space-y-4">
        <form onSubmit={initiateForm.handleSubmit(initiateVerification)} className="rounded-2xl bg-gray-50 p-6">
          <h2 className="text-sm font-semibold text-text">Send Verification Code</h2>
          <div className="mt-3">
            <label className="text-sm font-medium text-secondary">Phone Number</label>
            <input {...initiateForm.register('phone', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <button type="submit" className="mt-4 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
            Send Code
          </button>
        </form>

        <form onSubmit={verifyForm.handleSubmit(handleVerification)} className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-sm font-semibold text-text">Verify Code</h2>
          <div className="mt-3">
            <label className="text-sm font-medium text-secondary">Phone Number</label>
            <input {...verifyForm.register('phone', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <div className="mt-3">
            <label className="text-sm font-medium text-secondary">OTP Code</label>
            <input {...verifyForm.register('code', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </div>
          <button type="submit" className="mt-4 w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow">
            Verify Phone
          </button>
        </form>
      </section>
    </div>
  );
}
