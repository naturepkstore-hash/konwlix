import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';
import { canEditArticle } from '@/lib/roles';
import DiffViewer from '@/components/history/DiffViewer';
import { ArrowLeft } from 'lucide-react';

interface ComparePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ revA?: string; revB?: string }>;
}

export default async function ComparePage({ params, searchParams }: ComparePageProps) {
  const { slug } = await params;
  const { revA, revB } = await searchParams;

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const user = await getCurrentUser();
  const canRevert = canEditArticle(user, article.protectionLevel);

  const revisions = article.revisions || [];
  
  // Find revisions
  const oldRev = revisions.find((r) => r.id === revA) || revisions[revisions.length - 1];
  const newRev = revisions.find((r) => r.id === revB) || revisions[0];

  if (!oldRev || !newRev) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href={`/article/${slug}/history`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Revision History</span>
        </Link>
      </div>

      <DiffViewer
        articleId={article.id}
        slug={article.slug}
        oldRevision={oldRev}
        newRevision={newRev}
        canRevert={canRevert}
      />
    </div>
  );
}
