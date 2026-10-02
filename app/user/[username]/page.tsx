import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getUserProfile } from '@/lib/data';
import { User, Award, Calendar, BookOpen, Edit3, MessageSquare, History, ArrowRight } from 'lucide-react';
import { getRoleBadgeColor } from '@/lib/roles';

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserProfile(username);

  if (!user) return { title: 'User Not Found — Knowlix' };

  return {
    title: `@${user.username} — Contributor Profile`,
    description: `Public contributions and profile for @${user.username} on Knowlix.`,
  };
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = await params;
  const user = await getUserProfile(username);

  if (!user) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-900 text-xl font-bold text-white uppercase dark:bg-blue-600">
              {user.username.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                  {user.displayName || user.username}
                </h1>
                <span className={`rounded border px-2 py-0.5 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">@{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-md bg-slate-100 px-3 py-1.5 font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              Reputation: {user.reputation} pts
            </span>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="mt-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
            {user.bio}
          </p>
        )}

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Articles Authored</span>
            <p className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              {user._count.articlesCreated}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Total Revisions</span>
            <p className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              {user._count.revisionsCreated}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Talk Messages</span>
            <p className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              {user._count.talkMessages}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Member Since</span>
            <p className="font-serif text-sm font-bold text-slate-900 dark:text-white mt-1">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Contributions and Created Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Authored Articles */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-900 dark:text-blue-400" />
              <h2 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                Articles Authored
              </h2>
            </div>
          </div>

          {user.articlesCreated.length === 0 ? (
            <p className="text-xs text-slate-500">No published articles authored yet.</p>
          ) : (
            <ul className="space-y-3 text-xs">
              {user.articlesCreated.map((art) => (
                <li key={art.id} className="group">
                  <Link
                    href={`/article/${art.slug}`}
                    className="font-semibold text-slate-900 group-hover:text-blue-900 dark:text-slate-100 dark:group-hover:text-blue-400"
                  >
                    {art.title}
                  </Link>
                  <p className="text-slate-500 line-clamp-1 mt-0.5">{art.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Edit History */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-blue-900 dark:text-blue-400" />
              <h2 className="font-serif text-base font-bold text-slate-900 dark:text-white">
                Recent Contributions
              </h2>
            </div>
            <Link
              href={`/user/${user.username}/contributions`}
              className="text-xs font-semibold text-blue-900 hover:underline dark:text-blue-400"
            >
              Full Log &rarr;
            </Link>
          </div>

          <ul className="space-y-3 text-xs">
            {user.contributions.map((contrib) => (
              <li key={contrib.id} className="pb-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-blue-900 dark:text-blue-400">
                    {contrib.type.replace('_', ' ')}
                  </span>
                  <span>{new Date(contrib.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 mt-1 font-serif italic">
                  &ldquo;{contrib.summary}&rdquo;
                </p>
                {contrib.article && (
                  <Link
                    href={`/article/${contrib.article.slug}`}
                    className="mt-1 inline-block text-slate-500 hover:text-blue-900 dark:hover:text-blue-400"
                  >
                    on {contrib.article.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
