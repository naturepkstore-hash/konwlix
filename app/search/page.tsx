import React from 'react';
import Link from 'next/link';
import { searchArticles, getAllCategories } from '@/lib/data';
import { Search, Filter, BookOpen, Calendar, ArrowRight, Tag } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}"` : 'Search Knowlix Encyclopedia',
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '', category = '' } = await searchParams;
  const results = await searchArticles(q, category || undefined);
  const allCategories = await getAllCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="mx-auto max-w-3xl text-center mb-10">
        <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
          Encyclopedia Search
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Query articles, historical documents, scientific frameworks, and bibliographic references.
        </p>

        {/* Big Search Form */}
        <form action="/search" method="GET" className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by keywords, topics, or authors..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-xs focus:border-blue-900 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>

          <select
            name="category"
            defaultValue={category}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="">All Disciplines</option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="rounded-lg bg-blue-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-800 dark:bg-blue-600 shadow-xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6 dark:border-slate-800 text-xs text-slate-500">
          <span>
            {q ? (
              <>
                Found <strong className="text-slate-900 dark:text-white">{results.length}</strong> matching entries for &ldquo;{q}&rdquo;
              </>
            ) : (
              'Enter a search term above to begin exploring.'
            )}
          </span>
          {category && (
            <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Filtered by: {category}
            </span>
          )}
        </div>

        {results.length === 0 && q ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs dark:border-slate-800 dark:bg-slate-900">
            <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">
              No matching articles found
            </h3>
            <p className="mt-1 text-slate-500 max-w-md mx-auto">
              There is currently no article matching &ldquo;{q}&rdquo;. Would you like to create one and contribute to the encyclopedia?
            </p>
            <div className="mt-6">
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-900 px-4 py-2 font-bold text-white hover:bg-blue-800 dark:bg-blue-600 shadow-xs"
              >
                <span>+ Create Article &ldquo;{q}&rdquo;</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((article) => (
              <article
                key={article.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {article.categories && article.categories[0] && (
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {article.categories[0].name}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">
                    Quality: {article.qualityState}
                  </span>
                </div>

                <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                  <Link href={`/article/${article.slug}`} className="hover:text-blue-900 hover:underline dark:hover:text-blue-400">
                    {article.title}
                  </Link>
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-2">
                  {article.summary}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                  </span>
                  <Link
                    href={`/article/${article.slug}`}
                    className="font-semibold text-blue-900 hover:underline dark:text-blue-400 flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
