import React from 'react';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { BookOpen, ShieldCheck, ShieldAlert, Edit, CheckCircle } from 'lucide-react';
import { updateProtectionAction } from '@/server/article-actions';
import { ProtectionLevel, QualityState } from '@prisma/client';
import { SEED_ARTICLES } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Article Protection & Quality Reviews — Knowlix Admin',
};

export default async function AdminArticlesPage() {
  let articles: any[] = [];
  try {
    articles = await prisma.article.findMany({
      include: {
        author: { select: { username: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });
  } catch {
    articles = [];
  }

  if (articles.length === 0) {
    articles = SEED_ARTICLES.map((a, i) => ({
      id: `art-${i + 1}`,
      title: a.title,
      slug: a.slug,
      qualityState: a.qualityState,
      status: a.status,
      protectionLevel: a.protectionLevel,
      author: { username: 'dr_elena_vance' },
      updatedAt: new Date(),
    }));
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
        <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-900 dark:text-blue-400" />
          <span>Article Protection & Quality Reviews</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Manage protection levels against edit wars and certify peer-reviewed quality ratings.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 font-semibold text-slate-700 dark:text-slate-300">
              <th className="p-3.5">Article Title</th>
              <th className="p-3.5">Quality State</th>
              <th className="p-3.5">Protection Level</th>
              <th className="p-3.5">Author</th>
              <th className="p-3.5 text-right">Update Protection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-3.5">
                  <Link
                    href={`/article/${art.slug}`}
                    className="font-serif font-bold text-slate-900 hover:text-blue-900 dark:text-white dark:hover:text-blue-400"
                  >
                    {art.title}
                  </Link>
                  <div className="text-[11px] text-slate-400 font-mono">/article/{art.slug}</div>
                </td>
                <td className="p-3.5">
                  <span className="rounded bg-blue-50 px-2 py-0.5 font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {art.qualityState}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className={`inline-block rounded px-2 py-0.5 font-semibold ${
                    art.protectionLevel === 'FULLY_PROTECTED'
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : art.protectionLevel === 'SEMI_PROTECTED'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {art.protectionLevel}
                  </span>
                </td>
                <td className="p-3.5 text-slate-600 dark:text-slate-400">
                  @{art.author?.username || 'scholar'}
                </td>
                <td className="p-3.5 text-right">
                  <form
                    action={async (formData: FormData) => {
                      'use server';
                      await updateProtectionAction(formData);
                    }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <input type="hidden" name="articleId" value={art.id} />
                    <select
                      name="level"
                      defaultValue={art.protectionLevel}
                      className="rounded border border-slate-300 bg-white p-1 text-[11px] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <option value="NONE">No Protection</option>
                      <option value="SEMI_PROTECTED">Semi-Protected</option>
                      <option value="FULLY_PROTECTED">Fully Protected</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded bg-slate-800 px-2 py-1 text-[10px] font-semibold text-white hover:bg-slate-700 dark:bg-slate-700"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
