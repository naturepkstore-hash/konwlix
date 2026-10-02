import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAllCategories } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';
import { canEditArticle } from '@/lib/roles';
import ArticleEditor from '@/components/editor/ArticleEditor';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

interface EditArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { slug } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=/article/${slug}/edit`);
  }

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const isPermitted = canEditArticle(user, article.protectionLevel);
  const allCategories = await getAllCategories();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href={`/article/${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to &ldquo;{article.title}&rdquo;</span>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
          Editing: {article.title}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Every revision is permanently tracked with full provenance. Please provide a clear edit summary.
        </p>
      </div>

      {!isPermitted ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="flex items-center gap-2 font-serif text-base font-bold">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            <span>Editing Restricted</span>
          </div>
          <p className="mt-2 leading-relaxed">
            This article is protected under the <strong>{article.protectionLevel}</strong> protocol ({article.protectionReason || 'Protection enforced by moderation'}). Your account role (<code>{user.role}</code>) does not currently have permission to edit this page directly.
          </p>
          <div className="mt-4">
            <Link
              href={`/article/${slug}/talk`}
              className="inline-block rounded bg-amber-800 px-4 py-2 font-semibold text-white hover:bg-amber-700"
            >
              Suggest Changes on Talk Page
            </Link>
          </div>
        </div>
      ) : (
        <ArticleEditor
          mode="edit"
          articleId={article.id}
          initialData={{
            title: article.title,
            slug: article.slug,
            summary: article.summary,
            content: article.content,
            categoryIds: article.categories.map((c) => c.id),
            references: article.references.map((r) => ({
              title: r.title,
              authors: r.authors || undefined,
              publisher: r.publisher || undefined,
              publicationDate: r.publicationDate || undefined,
              url: r.url || undefined,
              doiOrIsbn: r.doiOrIsbn || undefined,
              citationNotes: r.citationNotes || undefined,
            })),
          }}
          categories={allCategories.map((c) => ({ id: c.id, name: c.name }))}
        />
      )}
    </div>
  );
}
