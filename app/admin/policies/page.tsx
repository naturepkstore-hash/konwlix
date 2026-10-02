import React from 'react';
import { getPolicies } from '@/lib/data';
import { Scale, Edit, Calendar, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Policy Governance — Knowlix Admin',
};

export default async function AdminPoliciesPage() {
  const policies = await getPolicies();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
        <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="h-5 w-5 text-blue-900 dark:text-blue-400" />
          <span>Community Policy Governance</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Review and update the 18 ratified community governance, licensing, and editorial standards.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        {policies.map((pol) => (
          <div key={pol.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400">
                {pol.category} &bull; POLICY #{pol.orderIndex}
              </span>
              <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white mt-0.5">
                <Link href={`/policies/${pol.slug}`} className="hover:text-blue-900 hover:underline dark:hover:text-blue-400">
                  {pol.title}
                </Link>
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {pol.summary}
              </p>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>Last amended: {new Date(pol.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <Link
              href={`/policies/${pol.slug}`}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 shrink-0"
            >
              View Document
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
