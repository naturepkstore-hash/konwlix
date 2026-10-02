import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Bookmark, BookOpen, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { toggleWatchlistAction } from '@/server/article-actions';

export const metadata = {
  title: 'My Watchlist — Knowlix',
};

export default async function WatchlistPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/watchlist');
  }

  const watched = await prisma.watchlist.findMany({
    where: { userId: user.id },
    include: {
      article: {
        include: {
          author: { select: { username: true } },
          categories: { include: { category: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bookmark className="h-6 w-6 text-blue-900 dark:text-blue-400" />
          <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            My Watched Articles ({watched.length})
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          You receive instant notifications whenever updates or reversions occur on these pages.
        </p>
      </header>

      {watched.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          <Bookmark className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">Your watchlist is empty</p>
          <p className="mt-1">Click the &ldquo;Watch&rdquo; button on any article to track revisions.</p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-block rounded bg-blue-900 px-4 py-2 font-bold text-white hover:bg-blue-800 dark:bg-blue-600"
            >
              Explore Articles
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {watched.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 transition-colors"
            >
              <div>
                <h2 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                  <Link href={`/article/${item.article.slug}`} className="hover:text-blue-900 hover:underline dark:hover:text-blue-400">
                    {item.article.title}
                  </Link>
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Author: @{item.article.author.username}</span>
                  <span>&bull;</span>
                  <span>Updated: {new Date(item.article.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/article/${item.article.slug}/history`}
                  className="text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400"
                >
                  History
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
