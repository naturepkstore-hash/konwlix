'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Knowlix Application Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h1 className="font-serif text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
        An Editorial System Error Occurred
      </h1>

      <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 max-w-md">
        We encountered an unexpected error while loading this encyclopedia resource. Our engineering logs have captured this event.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3 text-xs">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-900 px-4 py-2 font-bold text-white hover:bg-blue-800 dark:bg-blue-600 shadow-xs"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
      </div>
    </div>
  );
}
