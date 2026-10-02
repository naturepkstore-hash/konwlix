import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticleBySlug } from '@/lib/data';
import ArticleControls from '@/components/article/ArticleControls';
import TableOfContents from '@/components/article/TableOfContents';
import ReferencesList from '@/components/article/ReferencesList';
import { BookOpen, Calendar, User as UserIcon, Tag, Eye, ArrowLeft } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found — Knowlix',
    };
  }

  return {
    title: article.title,
    description: article.summary,
    alternates: {
      canonical: `/article/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} — Knowlix Encyclopedia`,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
      modifiedTime: new Date(article.updatedAt).toISOString(),
      authors: [article.author.displayName || article.author.username],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-900 dark:hover:text-blue-400">
          Home
        </Link>
        <span>/</span>
        {article.categories[0] ? (
          <Link
            href={`/category/${article.categories[0].slug}`}
            className="hover:text-blue-900 dark:hover:text-blue-400"
          >
            {article.categories[0].name}
          </Link>
        ) : (
          <span>Articles</span>
        )}
        <span>/</span>
        <span className="text-slate-900 dark:text-slate-200 font-medium truncate max-w-xs">
          {article.title}
        </span>
      </nav>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
        {/* Main Content Column (3 cols) */}
        <div className="lg:col-span-3">
          {/* Encyclopedic Header */}
          <header className="mb-6">
            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {article.title}
            </h1>

            {/* Meta Strip */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="flex items-center gap-1">
                <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                <span>Primary Editor: </span>
                <Link
                  href={`/user/${article.author.username}`}
                  className="font-medium text-slate-800 hover:text-blue-900 hover:underline dark:text-slate-200 dark:hover:text-blue-400"
                >
                  @{article.author.username}
                </Link>
              </span>

              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Last updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
              </span>

              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5 text-slate-400" />
                <span>{article.viewCount} views</span>
              </span>
            </div>
          </header>

          {/* Article Controls (Read, Talk, Edit, History, Watch, Report) */}
          <ArticleControls
            articleId={article.id}
            slug={article.slug}
            title={article.title}
            qualityState={article.qualityState}
            protectionLevel={article.protectionLevel}
            protectionReason={article.protectionReason}
            talkCount={article.talkPage?.messages?.length || 0}
            revisionCount={article.revisions?.length || 1}
          />

          {/* Lead Paragraph Summary Callout */}
          <div className="rounded-lg border-l-4 border-blue-900 bg-slate-50 p-4 text-sm font-serif italic text-slate-800 dark:border-blue-500 dark:bg-slate-900 dark:text-slate-200 mb-6">
            {article.summary}
          </div>

          {/* Mobile/In-Flow Table of Contents */}
          <div className="lg:hidden">
            <TableOfContents content={article.content} />
          </div>

          {/* Main Article Content Prose */}
          <div className="encyclopedia-prose whitespace-pre-wrap">
            {article.content}
          </div>

          {/* References & Sources Section */}
          <ReferencesList references={article.references} />

          {/* Categorical Footer Tags */}
          {article.categories.length > 0 && (
            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-2 mb-2 font-semibold text-slate-700 dark:text-slate-300">
                <Tag className="h-3.5 w-3.5 text-blue-900 dark:text-blue-400" />
                <span>Categories:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="rounded-md bg-white border border-slate-300 px-2.5 py-1 text-slate-700 hover:border-blue-900 hover:text-blue-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-400"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Column (1 col): Table of Contents, Info Card */}
        <div className="space-y-6">
          <div className="sticky top-20">
            {/* Desktop Table of Contents */}
            <div className="hidden lg:block">
              <TableOfContents content={article.content} />
            </div>

            {/* Scholarly Metadata Box */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900 text-xs space-y-3">
              <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">
                Article Metadata
              </h3>
              <div className="space-y-2 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Quality State:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{article.qualityState}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{article.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Protection:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{article.protectionLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Citations:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{article.references.length} sources</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={`/article/${article.slug}/history`}
                  className="text-blue-900 hover:underline dark:text-blue-400 font-medium"
                >
                  View full edit provenance &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
