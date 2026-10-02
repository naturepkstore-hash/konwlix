import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getPolicyBySlug } from '@/lib/data';
import { Scale, ArrowLeft, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface PolicyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = await getPolicyBySlug(slug);

  if (!policy) return { title: 'Policy Not Found — Knowlix' };

  return {
    title: `${policy.title} — Community Policy`,
    description: policy.summary,
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { slug } = await params;
  const policy = await getPolicyBySlug(slug);

  if (!policy) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/policies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Policies</span>
        </Link>
      </div>

      <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-900 dark:bg-blue-950 dark:text-blue-300">
            {policy.category} &bull; Policy #{policy.orderIndex}
          </span>
          <span className="text-[11px] text-slate-400">
            Ratified Standards
          </span>
        </div>

        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {policy.title}
        </h1>

        <p className="mt-3 text-sm font-serif italic text-slate-700 dark:text-slate-300 border-l-4 border-blue-900 dark:border-blue-500 pl-4 py-1">
          {policy.summary}
        </p>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Updated: {new Date(policy.updatedAt).toLocaleDateString()}</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Active Community Consensus</span>
          </span>
        </div>
      </header>

      {/* Policy Text Body */}
      <div className="encyclopedia-prose whitespace-pre-wrap">
        {policy.currentContent}
      </div>

      {/* Revisions History Box if present */}
      {policy.revisions && policy.revisions.length > 0 && (
        <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60 text-xs">
          <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-white mb-2">
            Policy Ratification Provenance
          </h3>
          <ul className="space-y-1 text-slate-600 dark:text-slate-400">
            {policy.revisions.map((rev) => (
              <li key={rev.id}>
                &bull; <strong>{new Date(rev.createdAt).toLocaleDateString()}</strong>: {rev.changeSummary} (Ratified by @{rev.author?.username || 'admin'})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
