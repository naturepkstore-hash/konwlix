'use client';

import React, { useState } from 'react';
import { computeRevisionDiff } from '@/lib/diff';
import { revertRevisionAction } from '@/server/article-actions';
import { RotateCcw, ArrowLeft, ArrowRight, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RevisionMeta {
  id: string;
  revisionNumber: number;
  title: string;
  summary: string;
  content: string;
  editSummary: string;
  isMinorEdit: boolean;
  createdAt: Date | string;
  author: {
    username: string;
    displayName?: string | null;
  };
}

interface DiffViewerProps {
  articleId: string;
  slug: string;
  oldRevision: RevisionMeta;
  newRevision: RevisionMeta;
  canRevert?: boolean;
}

export default function DiffViewer({
  articleId,
  slug,
  oldRevision,
  newRevision,
  canRevert = false,
}: DiffViewerProps) {
  const router = useRouter();
  const [diffMode, setDiffMode] = useState<'word' | 'line'>('word');
  const [isReverting, setIsReverting] = useState(false);
  const [revertReason, setRevertReason] = useState('');
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const diff = computeRevisionDiff(oldRevision.content, newRevision.content);

  const handleRevert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsReverting(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('articleId', articleId);
    formData.append('targetRevisionId', oldRevision.id);
    formData.append('reason', revertReason || `Restored revision #${oldRevision.revisionNumber}`);

    const res = await revertRevisionAction(formData);
    setIsReverting(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setShowRevertModal(false);
      router.push(`/article/${slug}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Diff Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Comparing Revisions</span>
            </h2>
            <p className="text-xs text-slate-500">
              Comparing Revision #{oldRevision.revisionNumber} vs Revision #{newRevision.revisionNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-md bg-slate-100 p-0.5 dark:bg-slate-800 text-xs">
              <button
                onClick={() => setDiffMode('word')}
                className={`rounded px-2.5 py-1 font-medium ${
                  diffMode === 'word'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Inline Word Diff
              </button>
              <button
                onClick={() => setDiffMode('line')}
                className={`rounded px-2.5 py-1 font-medium ${
                  diffMode === 'line'
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Line-by-Line
              </button>
            </div>

            {canRevert && (
              <button
                onClick={() => setShowRevertModal(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 shadow-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restore Revision #{oldRevision.revisionNumber}</span>
              </button>
            )}
          </div>
        </div>

        {/* Change Stats */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium">
          <span className="rounded bg-emerald-100 px-2 py-0.5 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            +{diff.stats.wordsAdded} words ({diff.stats.linesAdded} lines added)
          </span>
          <span className="rounded bg-red-100 px-2 py-0.5 text-red-800 dark:bg-red-950/60 dark:text-red-300">
            -{diff.stats.wordsRemoved} words ({diff.stats.linesRemoved} lines removed)
          </span>
        </div>

        {/* Revision Metadata Compare Table */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Older Version: Revision #{oldRevision.revisionNumber}
            </span>
            <p className="text-slate-500 mt-0.5">
              By @{oldRevision.author.username} &bull; {new Date(oldRevision.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-1 italic text-slate-700 dark:text-slate-300">
              &ldquo;{oldRevision.editSummary}&rdquo;
            </p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-3.5 dark:border-blue-900/50 dark:bg-blue-950/20">
            <span className="font-semibold text-blue-950 dark:text-blue-200">
              Newer Version: Revision #{newRevision.revisionNumber}
            </span>
            <p className="text-slate-500 mt-0.5">
              By @{newRevision.author.username} &bull; {new Date(newRevision.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-1 italic text-blue-900 dark:text-blue-300">
              &ldquo;{newRevision.editSummary}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Visual Diff Rendering Canvas */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white mb-4">
          Detailed Visual Differences
        </h3>

        {diffMode === 'word' ? (
          <div className="encyclopedia-prose whitespace-pre-wrap font-sans text-sm leading-relaxed p-4 rounded bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800">
            {diff.wordDiff.map((part, index) => {
              if (part.added) {
                return (
                  <span key={index} className="diff-added font-medium">
                    {part.value}
                  </span>
                );
              }
              if (part.removed) {
                return (
                  <span key={index} className="diff-removed">
                    {part.value}
                  </span>
                );
              }
              return <span key={index}>{part.value}</span>;
            })}
          </div>
        ) : (
          <div className="space-y-1 font-mono text-xs p-4 rounded bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 overflow-x-auto">
            {diff.lineDiff.map((part, index) => (
              <div
                key={index}
                className={`py-0.5 px-2 rounded ${
                  part.added
                    ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200'
                    : part.removed
                    ? 'bg-red-100 text-red-900 dark:bg-red-950/70 dark:text-red-200'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="select-none font-bold mr-2">
                  {part.added ? '+' : part.removed ? '-' : ' '}
                </span>
                <span>{part.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revert Modal */}
      {showRevertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              Restore Revision #{oldRevision.revisionNumber}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              This will create a new revision restoring the exact content of Revision #{oldRevision.revisionNumber}.
            </p>

            <form onSubmit={handleRevert} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Revert Reason / Edit Summary
                </label>
                <input
                  type="text"
                  required
                  value={revertReason}
                  onChange={(e) => setRevertReason(e.target.value)}
                  placeholder="e.g. Reverted vandalism / unsupported claims"
                  className="w-full rounded border border-slate-300 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {errorMessage && (
                <div className="flex items-center gap-1.5 rounded bg-red-50 p-2 text-xs text-red-700">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRevertModal(false)}
                  className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReverting}
                  className="rounded bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  {isReverting ? 'Restoring...' : 'Confirm Restore'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
