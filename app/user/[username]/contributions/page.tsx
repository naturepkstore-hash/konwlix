import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getUserProfile } from '@/lib/data';
import { History, ArrowLeft, ArrowRight, User } from 'lucide-react';

interface ContributionsPageProps {
  params: Promise<{ username: string }>;
}

export default async function ContributionsPage({ params }: ContributionsPageProps) {
  const { username } = await params;
  const user = await getUserProfile(username);

  if (!user) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href={`/user/${username}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to @{username}&apos;s profile</span>
        </Link>
      </div>

      <header className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-blue-900 dark:text-blue-400" />
          <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            User Contributions: @{username}
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Chronological record of articles created, edits submitted, reversions, and discussion threads.
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {user.contributions.map((item) => (
            <li key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wider text-[10px]">
                  {item.type.replace('_', ' ')}
                </span>
                <span>{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <p className="font-serif text-sm font-semibold text-slate-900 dark:text-white">
                {item.article ? (
                  <Link href={`/article/${item.article.slug}`} className="hover:text-blue-900 hover:underline dark:hover:text-blue-400">
                    {item.article.title}
                  </Link>
                ) : (
                  'Encyclopedia Action'
                )}
              </p>
              <p className="mt-1 text-slate-600 dark:text-slate-400 italic">
                &ldquo;{item.summary}&rdquo;
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
