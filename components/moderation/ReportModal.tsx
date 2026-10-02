'use client';

import React, { useState } from 'react';
import { Flag, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { submitReportAction } from '@/server/article-actions';
import { ReportReason, ReportTargetType } from '@prisma/client';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle,
}: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason>('VANDALISM');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('targetType', targetType);
    formData.append('targetId', targetId);
    formData.append('reason', reason);
    formData.append('description', description);

    const res = await submitReportAction(formData);
    setIsSubmitting(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Flag className="h-5 w-5" />
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              Report Content
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="my-6 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-2" />
            <h4 className="font-semibold text-slate-900 dark:text-white">Report Submitted</h4>
            <p className="mt-1 text-xs text-slate-500">
              Community moderators will review your report against our neutral point of view and civility policies.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Target</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-200 dark:border-slate-700">
                {targetTitle} ({targetType})
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Reason for Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="VANDALISM">Vandalism / Page Defacement</option>
                <option value="SPAM">Spam / Commercial Backlinks</option>
                <option value="COPYRIGHT">Copyright Violation / Plagiarism</option>
                <option value="PROMOTIONAL">Promotional / Biased Advertising Tone</option>
                <option value="UNSUPPORTED_CLAIMS">Unsupported Claims / Missing Reliable Sources</option>
                <option value="PERSONAL_ATTACK">Personal Attack / Civility Violation</option>
                <option value="OTHER">Other Policy Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Detailed Explanation
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain why this content violates Knowlix community policies..."
                className="w-full rounded-md border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {errorMessage && (
              <div className="flex items-center gap-1.5 rounded-md bg-red-50 p-2.5 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-red-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
