"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { useAuthContext } from '../../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const { login } = useAuthContext();
  const router = useRouter();
  const loginForm = useForm();
  const registerForm = useForm();

  const handleLogin = async data => {
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.token, response.data.user);
      router.push('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async data => {
    try {
      await api.post('/auth/register', data);
      toast.success('Registration successful. Check your email and phone for verification.');
      setMode('login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-3xl bg-white px-4 py-12 shadow">
      <div className="mx-auto max-w-md">
        <div className="flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full px-6 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-primary shadow' : 'text-secondary'}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 rounded-full px-6 py-2 text-sm font-semibold transition ${mode === 'register' ? 'bg-white text-primary shadow' : 'text-secondary'}`}
          >
            Register
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="mt-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-secondary">Email</label>
              <input
                {...loginForm.register('email', { required: true })}
                type="email"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-secondary">Password</label>
              <input
                {...loginForm.register('password', { required: true })}
                type="password"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
              />
            </div>
            <button type="submit" className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
              Sign In
            </button>
            <div className="grid gap-2 text-center text-xs text-secondary">
              <button type="button" onClick={() => router.push('/verify-email')} className="text-primary">
                Verify Email
              </button>
              <button type="button" onClick={() => router.push('/verify-phone')} className="text-primary">
                Verify Phone
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="mt-8 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-secondary">Full Name</label>
                <input {...registerForm.register('name', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-secondary">Email</label>
                <input {...registerForm.register('email', { required: true })} type="email" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-secondary">Phone</label>
                <input {...registerForm.register('phone', { required: true })} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-secondary">Password</label>
                <input {...registerForm.register('password', { required: true })} type="password" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </div>
            </div>
            <button type="submit" className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white">
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
