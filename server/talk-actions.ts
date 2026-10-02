'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { canPostDiscussion, canModerateContent } from '@/lib/roles';
import { logAuditEvent } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

export async function postTalkMessageAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !canPostDiscussion(user)) {
    return { error: 'You must be signed in to contribute to article discussions.' };
  }

  const talkPageId = formData.get('talkPageId') as string;
  const parentId = (formData.get('parentId') as string) || null;
  const content = (formData.get('content') as string || '').trim();
  const slug = formData.get('slug') as string;

  if (!talkPageId || !content) {
    return { error: 'Comment content cannot be empty.' };
  }

  try {
    const talkPage = await prisma.talkPage.findUnique({
      where: { id: talkPageId },
    });

    if (!talkPage) return { error: 'Discussion page not found.' };

    if (talkPage.isLocked && !canModerateContent(user)) {
      return { error: 'This discussion thread has been locked by community moderators.' };
    }

    const message = await prisma.talkMessage.create({
      data: {
        talkPageId,
        parentId,
        authorId: user.id,
        content,
      },
    });

    // Record user contribution
    await prisma.userContribution.create({
      data: {
        userId: user.id,
        articleId: talkPage.articleId,
        type: 'TALK_POST',
        summary: `Posted discussion message: "${content.slice(0, 60)}..."`,
      },
    });

    // If replying to another user's message, notify them
    if (parentId) {
      const parentMsg = await prisma.talkMessage.findUnique({
        where: { id: parentId },
      });
      if (parentMsg && parentMsg.authorId !== user.id) {
        await prisma.notification.create({
          data: {
            userId: parentMsg.authorId,
            type: 'TALK_REPLY',
            title: `Reply to your discussion post`,
            message: `${user.username} replied to your talk message.`,
            linkUrl: `/article/${slug}/talk`,
          },
        });
      }
    }

    if (slug) {
      revalidatePath(`/article/${slug}/talk`);
    }

    return { success: true, messageId: message.id };
  } catch (error) {
    console.error('Error posting talk message:', error);
    return { error: 'Failed to post message to discussion thread.' };
  }
}

export async function resolveTalkMessageAction(messageId: string, slug: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Authentication required.' };

  try {
    const msg = await prisma.talkMessage.findUnique({ where: { id: messageId } });
    if (!msg) return { error: 'Message not found.' };

    // Authors or moderators can toggle resolved
    if (msg.authorId !== user.id && !canModerateContent(user)) {
      return { error: 'Only the author or a moderator can mark this topic as resolved.' };
    }

    await prisma.talkMessage.update({
      where: { id: messageId },
      data: { isResolved: !msg.isResolved },
    });

    if (slug) revalidatePath(`/article/${slug}/talk`);
    return { success: true, isResolved: !msg.isResolved };
  } catch (error) {
    console.error('Error toggling message resolve:', error);
    return { error: 'Failed to update message resolution status.' };
  }
}

export async function hideTalkMessageAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !canModerateContent(user)) {
    return { error: 'Only moderators can hide discussion comments.' };
  }

  const messageId = formData.get('messageId') as string;
  const reason = (formData.get('reason') as string || 'Violation of civility guidelines').trim();
  const slug = formData.get('slug') as string;

  try {
    await prisma.talkMessage.update({
      where: { id: messageId },
      data: {
        isHidden: true,
        hiddenReason: reason,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'TALK_MESSAGE_HIDDEN',
      targetType: 'TALK_MESSAGE',
      targetId: messageId,
      details: { reason },
    });

    if (slug) revalidatePath(`/article/${slug}/talk`);
    return { success: true };
  } catch (error) {
    console.error('Error hiding talk message:', error);
    return { error: 'Failed to moderate talk message.' };
  }
}
