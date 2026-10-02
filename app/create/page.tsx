import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { canCreateArticle } from '@/lib/roles';
import { getAllCategories } from '@/lib/data';
import ArticleEditor from '@/components/editor/ArticleEditor';
import { BookPlus, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Create New Article',
  description: 'Contribute a new peer-reviewed encyclopedic article to Knowlix.',
};

export default async function CreateArticlePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/create');
  }

  const isPermitted = canCreateArticle(user);
  const allCategories = await getAllCategories();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <BookPlus className="h-6 w-6 text-blue-900 dark:text-blue-400" />
          <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            Create New Encyclopedia Entry
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Publish an original, neutral, and verifiable scholarly article with independent citations.
        </p>
      </div>

      {!isPermitted ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-6 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="flex items-center gap-2 font-serif text-base font-bold">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            <span>Account Blocked from Editing</span>
          </div>
          <p className="mt-2 leading-relaxed">
            Your account is currently restricted from creating or editing articles: {user.blockReason || 'Violation of community policies'}.
          </p>
        </div>
      ) : (
        <ArticleEditor
          mode="create"
          categories={allCategories.map((c) => ({ id: c.id, name: c.name }))}
        />
      )}
    </div>
  );
}
