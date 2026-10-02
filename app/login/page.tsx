'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, LogIn, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { loginAction } from '@/server/auth-actions';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleQuickLogin = (user: string, pass: string) => {
    setIdentifier(user);
    setPassword(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('identifier', identifier);
    formData.append('password', password);

    const res = await loginAction(formData);
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
        {/* Header */}
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-white dark:bg-blue-600 mx-auto">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sign in to Knowlix
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Access your research watchlist, contribute revisions, and participate in peer discussions.
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
              Username or Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. dr_elena_vance or email@knowlix.org"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-blue-900 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500"
          >
            {isSubmitting ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts Quick Login Assistance */}
        <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/20 text-xs text-slate-600 dark:text-slate-400">
          <p className="font-semibold text-blue-950 dark:text-blue-200 mb-1.5">
            Demo Scholarly Accounts (Password: <code>Knowlix2026!</code>)
          </p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('dr_elena_vance', 'Knowlix2026!')}
              className="rounded bg-white px-2 py-0.5 border border-slate-200 hover:bg-slate-50 text-[11px] font-mono dark:bg-slate-800 dark:border-slate-700"
            >
              dr_elena_vance (Super Admin)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('marcus_aurelius_mod', 'Knowlix2026!')}
              className="rounded bg-white px-2 py-0.5 border border-slate-200 hover:bg-slate-50 text-[11px] font-mono dark:bg-slate-800 dark:border-slate-700"
            >
              marcus_aurelius_mod (Moderator)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('alex_researcher', 'Knowlix2026!')}
              className="rounded bg-white px-2 py-0.5 border border-slate-200 hover:bg-slate-50 text-[11px] font-mono dark:bg-slate-800 dark:border-slate-700"
            >
              alex_researcher (Contributor)
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Don&apos;t have an account yet?{' '}
          <Link href="/register" className="font-semibold text-blue-900 hover:underline dark:text-blue-400">
            Join Knowlix
          </Link>
        </div>
      </div>
    </div>
  );
}
