import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';
import { History, ArrowLeft, GitCompare, User, Calendar, Shield } from 'lucide-react';
import { getRoleBadgeColor } from '@/lib/roles';

interface HistoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function HistoryPage({ params }: HistoryPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const revisions = article.revisions || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href={`/article/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to &ldquo;{article.title}&rdquo;</span>
        </Link>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-900 dark:text-blue-400" />
            <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              Revision Provenance: {article.title}
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Complete, immutable audit log of every editorial contribution and reversion.
          </p>
        </div>

        {revisions.length >= 2 && (
          <Link
            href={`/article/${slug}/compare?revA=${revisions[revisions.length - 1].id}&revB=${revisions[0].id}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-blue-800 dark:bg-blue-600"
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>Compare Latest vs First Version</span>
          </Link>
        )}
      </div>

      {/* Revision List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {revisions.map((rev, index) => {
            const isLatest = index === 0;
            const previousRev = revisions[index + 1];

            return (
              <li
                key={rev.id}
                className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-blue-900 dark:text-blue-400">
                        Revision #{rev.revisionNumber}
                      </span>

                      {isLatest && (
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Current Live Version
                        </span>
                      )}

                      {rev.isMinorEdit && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          minor
                        </span>
                      )}

                      <span className="text-slate-400">&bull;</span>
                      <span className="text-slate-500">
                        {new Date(rev.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span>By:</span>
                      <Link
                        href={`/user/${rev.author.username}`}
                        className="font-semibold text-slate-800 hover:text-blue-900 dark:text-slate-200 dark:hover:text-blue-400"
                      >
                        @{rev.author.username}
                      </Link>
                      <span className={`rounded border px-1.5 py-0.2 text-[10px] ${getRoleBadgeColor(rev.author.role)}`}>
                        {rev.author.role.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="font-serif italic text-slate-800 dark:text-slate-200 pt-0.5">
                      &ldquo;{rev.editSummary || 'No edit summary provided'}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {previousRev && (
                      <Link
                        href={`/article/${slug}/compare?revA=${previousRev.id}&revB=${rev.id}`}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-750"
                      >
                        Compare with previous
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
