import React from 'react';
import Link from 'next/link';
import { getAdminStats } from '@/lib/data';
import {
  BookOpen,
  Users,
  Flag,
  History,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Overview — Knowlix',
};

export default async function AdminOverviewPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
        <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
          System Overview & Metrics
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Platform statistics, moderation backlog, and system health status.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>Total Articles</span>
            <BookOpen className="h-4 w-4 text-blue-900 dark:text-blue-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalArticles}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {stats.publishedArticles} published
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>Pending Reviews</span>
            <FileCheck2 className="h-4 w-4 text-amber-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            {stats.underReview}
          </p>
          <span className="text-[11px] text-slate-400">
            Awaiting peer review
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>Open Reports</span>
            <Flag className="h-4 w-4 text-red-500" />
          </div>
          <p className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            {stats.reportsOpen}
          </p>
          <span className="text-[11px] text-red-600 dark:text-red-400 font-medium">
            Action required
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>Total Users</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalUsers}
          </p>
          <span className="text-[11px] text-slate-400">
            Registered scholars
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>Total Revisions</span>
            <History className="h-4 w-4 text-slate-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalRevisions}
          </p>
          <span className="text-[11px] text-slate-400">
            Tracked in history
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span>System Status</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="font-serif text-base font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            Operational
          </p>
          <span className="text-[11px] text-slate-400">
            Vercel Serverless OK
          </span>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-white mb-2">
            Moderation Queue
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Review community reports regarding vandalism, copyright infringements, or biased language.
          </p>
          <Link
            href="/admin/reports"
            className="inline-block rounded-md bg-red-600 px-3 py-1.5 font-semibold text-white hover:bg-red-700"
          >
            Review Reports Queue ({stats.reportsOpen})
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-white mb-2">
            User Role & Protection Governance
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Grant trusted contributor roles, appoint peer reviewers, and manage article protection levels.
          </p>
          <Link
            href="/admin/users"
            className="inline-block rounded-md bg-blue-900 px-3 py-1.5 font-semibold text-white hover:bg-blue-800 dark:bg-blue-600"
          >
            Manage User Roles
          </Link>
        </div>
      </div>
    </div>
  );
}
