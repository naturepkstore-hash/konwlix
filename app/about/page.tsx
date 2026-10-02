import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Scale, Globe, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Knowlix Encyclopedia',
  description: 'Mission, architecture, and principles of the Knowlix Open Encyclopedia project.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <header className="border-b border-slate-200 pb-8 dark:border-slate-800 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-white dark:bg-blue-600 mx-auto mb-4">
          <BookOpen className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
          About Knowlix
        </h1>
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          An open, non-commercial collaborative knowledge platform built for verifiable academic synthesis, peer-review governance, and long-term historical provenance.
        </p>
      </header>

      {/* Core Mission */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
          Our Scholarly Mission
        </h2>
        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          Knowlix was designed from the ground up to provide a rigorous, respectful, and reliable alternative to chaotic crowdsourced platforms. We prioritize <strong>depth over brevity</strong>, <strong>verifiability over sensationalism</strong>, and <strong>neutrality over ideological advocacy</strong>.
        </p>
      </section>

      {/* 3 Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <Scale className="h-6 w-6 text-blue-900 dark:text-blue-400 mb-3" />
          <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">
            Neutral Point of View
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Articles explain scholarly consensus with appropriate weight, avoiding emotive prose, commercial marketing, or bias.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <ShieldCheck className="h-6 w-6 text-emerald-700 dark:text-emerald-400 mb-3" />
          <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">
            Citations & Verifiability
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Every material claim must link to authoritative peer-reviewed journals, university press monographs, or reliable sources.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <Globe className="h-6 w-6 text-blue-900 dark:text-blue-400 mb-3" />
          <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">
            Immutable Provenance
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            No edits are overwritten silently. Every revision has line-by-line and word-by-word diffs with rollback capabilities.
          </p>
        </div>
      </section>

      {/* Production Architecture */}
      <section className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/50 dark:bg-blue-950/20 text-xs space-y-3">
        <h2 className="font-serif text-base font-bold text-blue-950 dark:text-blue-200">
          Architecture & Engineering Rigor
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Knowlix runs on a modern, serverless-native stack built with Next.js App Router, TypeScript, Prisma ORM, and hosted PostgreSQL. It features zero reliance on ephemeral local disk storage, full edge-safe session JWT handling, and seamless Vercel deployment support.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-blue-900 dark:text-blue-400 font-semibold">
          <Link href="/policies" className="hover:underline flex items-center gap-1">
            <span>Explore 18 Policies</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link href="/create" className="hover:underline flex items-center gap-1">
            <span>Contribute an Article</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
