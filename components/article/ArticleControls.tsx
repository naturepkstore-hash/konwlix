'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  MessageSquare,
  Edit3,
  History,
  Bookmark,
  Share2,
  Printer,
  Flag,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { ProtectionLevel, QualityState } from '@prisma/client';
import { toggleWatchlistAction } from '@/server/article-actions';
import ReportModal from '../moderation/ReportModal';

interface ArticleControlsProps {
  articleId: string;
  slug: string;
  title: string;
  qualityState: QualityState;
  protectionLevel: ProtectionLevel;
  protectionReason?: string | null;
  isWatchingInitial?: boolean;
  talkCount?: number;
  revisionCount?: number;
}

export default function ArticleControls({
  articleId,
  slug,
  title,
  qualityState,
  protectionLevel,
  protectionReason,
  isWatchingInitial = false,
  talkCount = 0,
  revisionCount = 1,
}: ArticleControlsProps) {
  const pathname = usePathname();
  const [isWatching, setIsWatching] = useState(isWatchingInitial);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleWatchToggle = async () => {
    const res = await toggleWatchlistAction(articleId);
    if (res.isWatching !== undefined) {
      setIsWatching(res.isWatching);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const isReadActive = pathname === `/article/${slug}`;
  const isTalkActive = pathname.includes('/talk');
  const isEditActive = pathname.includes('/edit');
  const isHistoryActive = pathname.includes('/history') || pathname.includes('/compare');

  const getQualityBadge = (quality: QualityState) => {
    switch (quality) {
      case 'VERIFIED':
        return {
          label: 'Verified Encyclopedia Entry',
          icon: ShieldCheck,
          color: 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
        };
      case 'REVIEWED':
        return {
          label: 'Peer-Reviewed Entry',
          icon: CheckCircle,
          color: 'bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
        };
      case 'DEVELOPING':
        return {
          label: 'Developing Article',
          icon: Clock,
          color: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
        };
      case 'STUB':
      default:
        return {
          label: 'Article Stub',
          icon: BookOpen,
          color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        };
    }
  };

  const qBadge = getQualityBadge(qualityState);
  const QualityIcon = qBadge.icon;

  return (
    <>
      <div className="mb-6 flex flex-col gap-3">
        {/* Protection Banner if semi/fully protected */}
        {protectionLevel !== 'NONE' && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-semibold">
                {protectionLevel === 'FULLY_PROTECTED'
                  ? 'Fully Protected Article'
                  : 'Semi-Protected Article'}
                :
              </span>{' '}
              {protectionReason ||
                (protectionLevel === 'FULLY_PROTECTED'
                  ? 'Only administrators can edit this page to prevent edit conflicts.'
                  : 'Only trusted contributors can edit this page.')}
            </div>
          </div>
        )}

        {/* Quality Rating Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 text-xs dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium ${qBadge.color}`}>
              <QualityIcon className="h-3.5 w-3.5" />
              <span>{qBadge.label}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <button
              onClick={handleWatchToggle}
              className={`flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                isWatching ? 'text-blue-700 font-semibold dark:text-blue-400' : ''
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isWatching ? 'fill-current' : ''}`} />
              <span>{isWatching ? 'Watching' : 'Watch'}</span>
            </button>

            <button
              onClick={handlePrint}
              aria-label="Print Article"
              className="flex items-center gap-1 rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={() => setIsReportOpen(true)}
              aria-label="Report Article"
              className="flex items-center gap-1 rounded px-2 py-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Flag className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Report</span>
            </button>
          </div>
        </div>

        {/* Encyclopedic View Tabs: Read | Talk | Edit | History */}
        <div className="flex items-center justify-between border-b border-slate-200 text-xs dark:border-slate-800">
          <div className="flex items-center gap-1">
            <Link
              href={`/article/${slug}`}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
                isReadActive
                  ? 'border-blue-900 text-blue-900 dark:border-blue-500 dark:text-blue-400 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Article</span>
            </Link>

            <Link
              href={`/article/${slug}/talk`}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
                isTalkActive
                  ? 'border-blue-900 text-blue-900 dark:border-blue-500 dark:text-blue-400 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Discussion {talkCount > 0 && `(${talkCount})`}</span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <Link
              href={`/article/${slug}/edit`}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
                isEditActive
                  ? 'border-blue-900 text-blue-900 dark:border-blue-500 dark:text-blue-400 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Link>

            <Link
              href={`/article/${slug}/history`}
              className={`flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
                isHistoryActive
                  ? 'border-blue-900 text-blue-900 dark:border-blue-500 dark:text-blue-400 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>View History {revisionCount > 1 && `(${revisionCount})`}</span>
            </Link>
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetType="ARTICLE"
        targetId={articleId}
        targetTitle={title}
      />
    </>
  );
}
