import React from 'react';
import Link from 'next/link';
import { BookOpen, Search, ArrowLeft, PlusCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 mb-4">
        <BookOpen className="h-8 w-8" />
      </div>

      <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
        404 — Article or Page Not Found
      </h1>

      <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 max-w-md">
        The encyclopedia entry or resource you requested does not exist in the Knowlix repository or may have been moved.
      </p>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-900 px-4 py-2 font-bold text-white hover:bg-blue-800 dark:bg-blue-600 shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <Search className="h-4 w-4" />
          <span>Search Encyclopedia</span>
        </Link>
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 rounded-md border border-blue-300 bg-blue-50 px-4 py-2 font-semibold text-blue-900 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Author This Topic</span>
        </Link>
      </div>
    </div>
  );
}
