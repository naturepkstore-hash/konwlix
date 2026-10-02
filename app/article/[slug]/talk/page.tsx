import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';
import TalkThread from '@/components/talk/TalkThread';
import ArticleControls from '@/components/article/ArticleControls';
import { ArrowLeft, MessageSquare } from 'lucide-react';

interface TalkPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TalkPage({ params }: TalkPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const user = await getCurrentUser();
  const talkPage = article.talkPage;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-4">
        <Link
          href={`/article/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Article: &ldquo;{article.title}&rdquo;</span>
        </Link>
      </div>

      <header className="mb-6">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Talk: {article.title}
        </h1>
        <p className="mt-2 text-xs text-slate-500">
          Collaborative discussion and source analysis for improving this encyclopedia entry.
        </p>
      </header>

      {/* Article Controls */}
      <ArticleControls
        articleId={article.id}
        slug={article.slug}
        title={article.title}
        qualityState={article.qualityState}
        protectionLevel={article.protectionLevel}
        protectionReason={article.protectionReason}
        talkCount={talkPage?.messages?.length || 0}
        revisionCount={article.revisions?.length || 1}
      />

      <TalkThread
        talkPageId={talkPage?.id || `talk-${article.slug}`}
        slug={article.slug}
        articleTitle={article.title}
        isLocked={talkPage?.isLocked || false}
        messages={talkPage?.messages || []}
        currentUser={user}
      />
    </div>
  );
}
