import React from 'react';
import Link from 'next/link';
import { getAllCategories } from '@/lib/data';
import { Compass, FolderTree, BookOpen, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Knowledge Categories and Disciplines',
  description: 'Browse the complete taxonomy of academic disciplines in Knowlix.',
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  // Separate parent and subcategories
  const rootCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="h-6 w-6 text-blue-900 dark:text-blue-400" />
          <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
            Disciplines & Subject Areas
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Browse through human knowledge structured into interconnected scientific, historical, and philosophical branches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rootCategories.map((cat) => {
          const subcategories = categories.filter((c) => c.parentId === cat.id);

          return (
            <div
              key={cat.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                    <Link href={`/category/${cat.slug}`} className="hover:text-blue-900 dark:hover:text-blue-400">
                      {cat.name}
                    </Link>
                  </h2>
                </div>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
                  {cat.description || 'Comprehensive scholarly entries in this branch of knowledge.'}
                </p>

                {subcategories.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
                      Sub-branches:
                    </span>
                    <ul className="space-y-1 pl-1">
                      {subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link
                            href={`/category/${sub.slug}`}
                            className="text-blue-900 hover:underline dark:text-blue-400 font-medium"
                          >
                            &bull; {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Link
                  href={`/category/${cat.slug}`}
                  className="text-xs font-bold text-blue-900 hover:underline dark:text-blue-400 flex items-center gap-1"
                >
                  <span>Explore category</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
