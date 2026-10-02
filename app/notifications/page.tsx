import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Bell, CheckCheck, Clock, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Notifications — Knowlix',
};

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/notifications');
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 30,
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-900 dark:text-blue-400" />
          <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
            Editorial Notifications
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Alerts for replies to your discussion posts, watched article updates, and moderation resolutions.
        </p>
      </header>

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          <Bell className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No notifications at this time</p>
          <p className="mt-1">When someone interacts with your edits or watched articles, alerts will show here.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {notifications.map((notif) => (
            <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-start justify-between gap-3">
              <div>
                <span className="font-semibold text-blue-900 dark:text-blue-400 uppercase tracking-wider text-[10px]">
                  {notif.type.replace('_', ' ')}
                </span>
                <h3 className="font-serif text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {notif.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {notif.message}
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>

              {notif.linkUrl && (
                <Link
                  href={notif.linkUrl}
                  className="rounded-md bg-slate-100 px-3 py-1 font-semibold text-blue-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-blue-400 shrink-0"
                >
                  View
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
