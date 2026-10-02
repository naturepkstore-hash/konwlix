import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { canAccessAdminDashboard } from '@/lib/roles';
import {
  Shield,
  LayoutDashboard,
  Flag,
  Users,
  BookOpen,
  Scale,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || !canAccessAdminDashboard(user)) {
    redirect('/login?redirect=/admin');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Admin Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-blue-900 bg-blue-950 p-6 text-white shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <h1 className="font-serif text-2xl font-bold">
              Knowlix Administrative & Moderation Center
            </h1>
          </div>
          <p className="mt-1 text-xs text-blue-200">
            Authenticated Session: @{user.username} ({user.role}) &bull; Server-Side Authorization Enforced
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Encyclopedia</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Admin Navigation Sidebar */}
        <aside className="space-y-1 text-xs font-medium text-slate-700 dark:text-slate-300">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <LayoutDashboard className="h-4 w-4 text-slate-400" />
            <span>Dashboard Overview</span>
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center gap-2.5 rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Flag className="h-4 w-4 text-red-500" />
            <span>Moderation Reports</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-2.5 rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Users className="h-4 w-4 text-slate-400" />
            <span>User Accounts & Roles</span>
          </Link>
          <Link
            href="/admin/articles"
            className="flex items-center gap-2.5 rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <BookOpen className="h-4 w-4 text-slate-400" />
            <span>Article Protections & Reviews</span>
          </Link>
          <Link
            href="/admin/policies"
            className="flex items-center gap-2.5 rounded-lg p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Scale className="h-4 w-4 text-slate-400" />
            <span>Policy Governance</span>
          </Link>
        </aside>

        {/* Admin Content Area */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
