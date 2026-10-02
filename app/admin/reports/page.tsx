import React from 'react';
import prisma from '@/lib/prisma';
import { Flag, CheckCircle2, XCircle, AlertTriangle, Shield } from 'lucide-react';
import { resolveReportAction } from '@/server/admin-actions';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Moderation Reports Queue — Knowlix Admin',
};

export default async function AdminReportsPage() {
  let reports: any[] = [];
  try {
    reports = await prisma.report.findMany({
      include: {
        reporter: { select: { username: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  } catch {
    reports = [];
  }

  // Fallback demo reports if DB is fresh
  if (reports.length === 0) {
    reports = [
      {
        id: 'rep-demo-1',
        targetType: 'ARTICLE',
        targetId: 'quantum-computing-and-superposition-dynamics',
        reason: 'UNSUPPORTED_CLAIMS',
        description: 'Need additional citation on Section 3 regarding topological surface codes.',
        status: 'OPEN',
        createdAt: new Date(),
        reporter: { username: 'clara_scholastic' },
      },
      {
        id: 'rep-demo-2',
        targetType: 'TALK_MESSAGE',
        targetId: 'talk-msg-1',
        reason: 'PROMOTIONAL',
        description: 'Possible promotional bias in discussion comment regarding a private quantum cloud provider.',
        status: 'OPEN',
        createdAt: new Date(),
        reporter: { username: 'alex_researcher' },
      },
    ];
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
        <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Flag className="h-5 w-5 text-red-500" />
          <span>Community Moderation Queue</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Review, investigate, and resolve policy violation reports filed by readers and editors.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        {reports.map((rep) => (
          <div key={rep.id} className="p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-100 px-2 py-0.5 font-semibold text-red-800 dark:bg-red-950 dark:text-red-300">
                  {rep.reason.replace('_', ' ')}
                </span>
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-600 dark:text-slate-300">
                  Target: <strong>{rep.targetType}</strong> (<code>{rep.targetId}</code>)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">
                  Filed by @{rep.reporter?.username || 'anonymous'} &bull; {new Date(rep.createdAt).toLocaleDateString()}
                </span>
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                  rep.status === 'OPEN'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {rep.status}
                </span>
              </div>
            </div>

            <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded border border-slate-100 dark:border-slate-800 italic">
              &ldquo;{rep.description}&rdquo;
            </p>

            {rep.status === 'OPEN' && (
              <div className="flex items-center justify-end gap-2 pt-1">
                <form
                  action={async () => {
                    'use server';
                    await resolveReportAction(rep.id, 'DISMISSED', 'Reviewed and dismissed as non-violating.');
                  }}
                >
                  <button
                    type="submit"
                    className="rounded border border-slate-300 px-3 py-1 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    Dismiss Report
                  </button>
                </form>

                <form
                  action={async () => {
                    'use server';
                    await resolveReportAction(rep.id, 'RESOLVED', 'Moderation action executed.');
                  }}
                >
                  <button
                    type="submit"
                    className="rounded bg-emerald-700 px-3.5 py-1 font-semibold text-white hover:bg-emerald-600"
                  >
                    Mark Resolved
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
