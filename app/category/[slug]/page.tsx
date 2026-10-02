import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getCategoryBySlug } from '@/lib/data';
import { Compass, BookOpen, Calendar, ArrowRight, ArrowLeft, Tag } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: 'Category Not Found — Knowlix' };

  return {
    title: `${category.name} — Knowlix Encyclopedia`,
    description: category.description || `Browse encyclopedia articles in ${category.name}.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-900 dark:hover:text-blue-400">
          Home
        </Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-blue-900 dark:hover:text-blue-400">
          Categories
        </Link>
        <span>/</span>
        {category.parent && (
          <>
            <Link
              href={`/category/${category.parent.slug}`}
              className="hover:text-blue-900 dark:hover:text-blue-400"
            >
              {category.parent.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900 dark:text-slate-200 font-medium">{category.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-8 border-b border-slate-200 pb-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900 text-white dark:bg-blue-600">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              Category: {category.name}
            </h1>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {category.description || 'Comprehensive peer-reviewed entries cataloged in this subject area.'}
            </p>
          </div>
        </div>

        {/* Subcategories if any */}
        {category.children.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Sub-categories:</span>
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 font-medium"
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Articles in Category */}
      <div>
        <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white mb-4">
          Articles in this Discipline ({category.articles.length})
        </h2>

        {category.articles.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No articles published in this category yet</p>
            <p className="mt-1">Be the first scholar to author an article under this discipline.</p>
            <div className="mt-4">
              <Link
                href="/create"
                className="inline-block rounded bg-blue-900 px-4 py-2 font-bold text-white hover:bg-blue-800 dark:bg-blue-600"
              >
                + Create Article in {category.name}
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {category.articles.map((article) => (
              <article
                key={article.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                    <span>Quality: {article.qualityState}</span>
                    <span>&bull;</span>
                    <span>{article.viewCount || 0} views</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                    <Link href={`/article/${article.slug}`} className="hover:text-blue-900 dark:hover:text-blue-400">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>By @{article.author.username}</span>
                  <Link
                    href={`/article/${article.slug}`}
                    className="font-semibold text-blue-900 hover:underline dark:text-blue-400 flex items-center gap-1"
                  >
                    <span>Read</span>
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
