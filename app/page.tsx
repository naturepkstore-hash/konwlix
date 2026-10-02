import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Sparkles,
  Compass,
  History,
  ShieldCheck,
  Users,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Scale,
  Award,
} from 'lucide-react';
import { getFeaturedArticles, getLatestArticles, getRecentlyUpdatedArticles, getAllCategories } from '@/lib/data';

export default async function HomePage() {
  const [featuredArticles, latestArticles, recentlyUpdated, categories] = await Promise.all([
    getFeaturedArticles(),
    getLatestArticles(6),
    getRecentlyUpdatedArticles(4),
    getAllCategories(),
  ]);

  return (
    <div className="space-y-12 pb-16">
      {/* Academic Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Independent, Peer-Moderated Academic Knowledge</span>
            </div>

            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Explore Knowledge. <br className="hidden sm:inline" />
              <span className="text-blue-900 dark:text-blue-400">Share Knowledge.</span>
            </h1>

            <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Knowlix is an open collaborative encyclopedia engineered for scholarly rigor, neutral point of view, and permanent revision provenance.
            </p>

            {/* Central Search Form */}
            <form action="/search" method="GET" className="mt-8 relative max-w-xl mx-auto">
              <input
                type="text"
                name="q"
                required
                placeholder="Search across thousands of articles, concepts, and primary sources..."
                className="w-full rounded-full border border-slate-300 bg-slate-50 py-3.5 pl-12 pr-28 text-sm text-slate-900 shadow-sm focus:border-blue-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500"
              />
              <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full bg-blue-900 px-5 text-xs font-bold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Quick Topic Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span>Trending Topics:</span>
              <Link href="/article/quantum-computing-and-superposition-dynamics" className="hover:text-blue-800 hover:underline dark:hover:text-blue-400">
                Quantum Computing
              </Link>
              &bull;
              <Link href="/article/the-ancient-silk-road-trans-eurasian-exchange-networks" className="hover:text-blue-800 hover:underline dark:hover:text-blue-400">
                Silk Road
              </Link>
              &bull;
              <Link href="/article/photosynthesis-and-cellular-respiration-cycles" className="hover:text-blue-800 hover:underline dark:hover:text-blue-400">
                Cellular Respiration
              </Link>
              &bull;
              <Link href="/article/deep-sea-hydrothermal-vents-and-extremophile-ecosystems" className="hover:text-blue-800 hover:underline dark:hover:text-blue-400">
                Hydrothermal Vents
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left 2 Cols: Featured Articles & Disciplines */}
          <div className="lg:col-span-2 space-y-10">
            {/* Featured Articles Section */}
            <section>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                  <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                    Featured Scholarly Entries
                  </h2>
                </div>
                <Link href="/search?filter=featured" className="text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400">
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredArticles.map((article) => (
                  <article
                    key={article.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-blue-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-900 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        {article.categories[0] && (
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {article.categories[0].name}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          &bull; {article.viewCount} views
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white line-clamp-2">
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
            </section>

            {/* Categorical Knowledge Disciplines */}
            <section>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                  <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                    Knowledge Disciplines
                  </h2>
                </div>
                <Link href="/categories" className="text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400">
                  All Categories &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/70 transition-colors"
                  >
                    <span className="font-serif text-sm font-bold text-slate-900 dark:text-white">
                      {cat.name}
                    </span>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {cat.description || 'Explore articles in this academic discipline.'}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar: Recent Updates, Policies, Contributors */}
          <div className="space-y-8">
            {/* Recently Updated Articles */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800 mb-3">
                <History className="h-4 w-4 text-blue-900 dark:text-blue-400" />
                <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-white">
                  Recently Updated Articles
                </h3>
              </div>
              <ul className="space-y-3 text-xs">
                {recentlyUpdated.map((item) => (
                  <li key={item.id} className="group">
                    <Link
                      href={`/article/${item.slug}`}
                      className="font-medium text-slate-800 group-hover:text-blue-900 dark:text-slate-200 dark:group-hover:text-blue-400 line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
                      <span>By @{item.author.username}</span>
                      <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Core Governance Principles Card */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/50 dark:bg-blue-950/20">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="h-4 w-4 text-blue-900 dark:text-blue-400" />
                <h3 className="font-serif text-sm font-bold text-blue-950 dark:text-blue-200">
                  The Knowlix Principles
                </h3>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-blue-900 dark:text-blue-400">1.</span>
                  <span><strong>Neutral Point of View</strong>: Fair representation of credible scholarly consensus.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-blue-900 dark:text-blue-400">2.</span>
                  <span><strong>Verifiability</strong>: Statements require authoritative third-party citations.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-blue-900 dark:text-blue-400">3.</span>
                  <span><strong>Permanent Provenance</strong>: Every edit is tracked in visual revision history.</span>
                </li>
              </ul>
              <div className="mt-4 pt-3 border-t border-blue-200/60 dark:border-blue-900/60">
                <Link
                  href="/policies"
                  className="text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400"
                >
                  Read all 18 Community Policies &rarr;
                </Link>
              </div>
            </div>

            {/* How to Contribute CTA */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 text-xs">
              <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-white mb-2">
                Contribute to Open Knowledge
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Anyone can suggest edits, contribute peer-reviewed references, or initiate discussion on talk pages.
              </p>
              <Link
                href="/create"
                className="inline-block w-full text-center rounded-md bg-slate-900 py-2 font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                Create New Encyclopedia Entry
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
