'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, UserPlus, AlertTriangle } from 'lucide-react';
import { registerAction } from '@/server/auth-actions';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('displayName', displayName);
    formData.append('password', password);

    const res = await registerAction(formData);
    setIsSubmitting(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-white dark:bg-blue-600 mx-auto">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Join Knowlix
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Create an encyclopedia account to author articles, track citations, and join peer governance.
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="e.g. aristotle_scholar"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Dr. Aristotle"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scholar@university.edu"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password <span className="text-red-500">*</span> (min 8 chars)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="rounded-md bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-slate-800">
            By registering, you agree to adhere to the{' '}
            <Link href="/policies/neutral-point-of-view" className="text-blue-900 underline dark:text-blue-400">
              Neutral Point of View
            </Link>{' '}
            and{' '}
            <Link href="/policies/user-conduct" className="text-blue-900 underline dark:text-blue-400">
              Civility Guidelines
            </Link>
            .
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {isSubmitting ? 'Registering Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-blue-900 hover:underline dark:text-blue-400">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
