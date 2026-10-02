import React from 'react';
import Link from 'next/link';
import { getPolicies } from '@/lib/data';
import { Scale, BookCheck, ShieldAlert, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export const metadata = {
  title: 'Community Policies & Standards',
  description: 'Knowlix 18 core governance policies, content guidelines, and editorial standards.',
};

export default async function PoliciesIndexPage() {
  const policies = await getPolicies();

  // Group by category
  const categories = Array.from(new Set(policies.map((p) => p.category)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300 mb-4">
          <Scale className="h-3.5 w-3.5" />
          <span>Knowlix Governance & Scholarly Standards</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
          Community Policies & Guidelines
        </h1>
        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          The 18 foundational rules ratified by the Knowlix editorial community to ensure academic integrity, neutral synthesis, reliable sourcing, and civility.
        </p>
      </div>

      {/* Policy Categorized Grid */}
      <div className="space-y-10">
        {categories.map((catName) => {
          const categoryPolicies = policies.filter((p) => p.category === catName);

          return (
            <section key={catName}>
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2.5 mb-4 dark:border-slate-800">
                <FileText className="h-4 w-4 text-blue-900 dark:text-blue-400" />
                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                  {catName}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryPolicies.map((pol) => (
                  <div
                    key={pol.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">
                        POLICY #{pol.orderIndex}
                      </span>
                      <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white mt-1">
                        <Link href={`/policies/${pol.slug}`} className="hover:text-blue-900 dark:hover:text-blue-400">
                          {pol.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                        {pol.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <Link
                        href={`/policies/${pol.slug}`}
                        className="text-xs font-bold text-blue-900 hover:underline dark:text-blue-400 flex items-center gap-1"
                      >
                        <span>Read policy</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
