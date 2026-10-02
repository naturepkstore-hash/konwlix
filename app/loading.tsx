import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-white animate-pulse dark:bg-blue-600 mb-3">
        <BookOpen className="h-6 w-6" />
      </div>
      <p className="font-serif text-sm font-semibold text-slate-700 dark:text-slate-300">
        Loading Encyclopedia Resource...
      </p>
      <p className="text-[11px] text-slate-400 mt-1">Verifying peer-reviewed revisions & citations</p>
    </div>
  );
}
