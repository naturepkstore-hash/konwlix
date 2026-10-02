'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Reply,
  CheckCircle2,
  Lock,
  Flag,
  Send,
  EyeOff,
  User as UserIcon,
} from 'lucide-react';
import { postTalkMessageAction, resolveTalkMessageAction } from '@/server/talk-actions';
import { Role } from '@prisma/client';
import { getRoleBadgeColor } from '@/lib/roles';
import ReportModal from '../moderation/ReportModal';

export interface TalkMessageData {
  id: string;
  talkPageId: string;
  parentId?: string | null;
  content: string;
  isResolved: boolean;
  isHidden: boolean;
  createdAt: Date | string;
  author: {
    username: string;
    displayName?: string | null;
    role: Role;
  };
}

interface TalkThreadProps {
  talkPageId: string;
  slug: string;
  articleTitle: string;
  isLocked: boolean;
  messages: TalkMessageData[];
  currentUser?: {
    id: string;
    username: string;
    role: Role;
  } | null;
}

export default function TalkThread({
  talkPageId,
  slug,
  articleTitle,
  isLocked,
  messages,
  currentUser,
}: TalkThreadProps) {
  const [newTopicContent, setNewTopicContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ id: string; title: string } | null>(null);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicContent.trim()) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('talkPageId', talkPageId);
    formData.append('content', newTopicContent);
    formData.append('slug', slug);

    await postTalkMessageAction(formData);
    setIsSubmitting(false);
    setNewTopicContent('');
  };

  const handleReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('talkPageId', talkPageId);
    formData.append('parentId', parentId);
    formData.append('content', replyContent);
    formData.append('slug', slug);

    await postTalkMessageAction(formData);
    setIsSubmitting(false);
    setReplyContent('');
    setReplyingToId(null);
  };

  const handleToggleResolve = async (messageId: string) => {
    await resolveTalkMessageAction(messageId, slug);
  };

  const topLevelMessages = messages.filter((m) => !m.parentId);

  return (
    <div className="space-y-6">
      {/* Talk Page Guidance Header */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/50 dark:bg-blue-950/20 text-xs text-slate-700 dark:text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-serif text-sm font-bold text-blue-950 dark:text-blue-200">
          <MessageSquare className="h-4 w-4 text-blue-800 dark:text-blue-400" />
          <span>Discussion Guidelines for &ldquo;{articleTitle}&rdquo;</span>
        </div>
        <p>
          This is the Talk page for discussing improvements to the article. Please adhere to the{' '}
          <span className="font-semibold">Neutral Point of View</span>,{' '}
          <span className="font-semibold">Civility</span>, and{' '}
          <span className="font-semibold">Reliable Sources</span> policies. This page is not a forum for general debate on the topic.
        </p>
      </div>

      {isLocked && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <Lock className="h-4 w-4 text-amber-600" />
          <span className="font-medium">
            This discussion thread has been locked by community moderators. New topics cannot be posted.
          </span>
        </div>
      )}

      {/* Discussion List */}
      <div className="space-y-4">
        {topLevelMessages.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900">
            <MessageSquare className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">No discussion topics yet</p>
            <p className="mt-1">
              Start the first discussion thread to suggest improvements, point out missing citations, or propose structural edits.
            </p>
          </div>
        ) : (
          topLevelMessages.map((msg) => {
            const replies = messages.filter((m) => m.parentId === msg.id);

            return (
              <div
                key={msg.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200 uppercase text-[10px]">
                      {msg.author.username.slice(0, 2)}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      @{msg.author.username}
                    </span>
                    <span className={`rounded border px-1.5 py-0.2 text-[10px] ${getRoleBadgeColor(msg.author.role)}`}>
                      {msg.author.role.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400">
                      &bull; {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {msg.isResolved && (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Resolved
                      </span>
                    )}

                    <button
                      onClick={() => handleToggleResolve(msg.id)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                    >
                      {msg.isResolved ? 'Re-open' : 'Mark Resolved'}
                    </button>

                    <button
                      onClick={() =>
                        setReportTarget({ id: msg.id, title: `Talk message by @${msg.author.username}` })
                      }
                      className="text-slate-400 hover:text-red-500"
                      title="Report comment"
                    >
                      <Flag className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {msg.content}
                </p>

                {/* Reply Button */}
                {!isLocked && (
                  <div className="pt-1">
                    <button
                      onClick={() => setReplyingToId(replyingToId === msg.id ? null : msg.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Reply className="h-3.5 w-3.5" />
                      <span>{replyingToId === msg.id ? 'Cancel Reply' : 'Reply'}</span>
                    </button>
                  </div>
                )}

                {/* Reply Form */}
                {replyingToId === msg.id && (
                  <form onSubmit={(e) => handleReply(e, msg.id)} className="pt-2 pl-4 border-l-2 border-blue-300 dark:border-blue-700">
                    <textarea
                      required
                      rows={2}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your constructive reply..."
                      className="w-full rounded border border-slate-300 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="rounded border border-slate-300 px-3 py-1 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded bg-blue-900 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-800"
                      >
                        Post Reply
                      </button>
                    </div>
                  </form>
                )}

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-3">
                    {replies.map((rep) => (
                      <div key={rep.id} className="rounded bg-slate-50 p-3 dark:bg-slate-800/60 text-xs">
                        <div className="flex items-center justify-between mb-1 text-slate-500">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                            <span>@{rep.author.username}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              &bull; {new Date(rep.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setReportTarget({ id: rep.id, title: `Reply by @${rep.author.username}` })
                            }
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Flag className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {rep.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Start New Thread Form */}
      {!isLocked && currentUser && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-serif text-base font-bold text-slate-900 dark:text-white mb-2">
            Start a New Discussion Thread
          </h3>
          <form onSubmit={handleCreateTopic} className="space-y-3">
            <textarea
              required
              rows={4}
              value={newTopicContent}
              onChange={(e) => setNewTopicContent(e.target.value)}
              placeholder="State your question, source critique, or proposed modification clearly and civilly..."
              className="w-full rounded-md border border-slate-300 bg-slate-50 p-3 text-xs text-slate-900 focus:border-blue-700 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newTopicContent.trim()}
                className="inline-flex items-center gap-1.5 rounded-md bg-blue-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Posting...' : 'Post Discussion Topic'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {reportTarget && (
        <ReportModal
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
          targetType="TALK_MESSAGE"
          targetId={reportTarget.id}
          targetTitle={reportTarget.title}
        />
      )}
    </div>
  );
}
