'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { canCreateArticle, canEditArticle, canProtectArticle, canReviewRevisions } from '@/lib/roles';
import { slugify, isValidSlug } from '@/lib/slugify';
import { validateArticleContent } from '@/lib/content-validator';
import { logAuditEvent } from '@/lib/audit';
import { ProtectionLevel, QualityState, ReportReason, ReportTargetType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createArticleAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !canCreateArticle(user)) {
    return { error: 'You must be signed in to create an article.' };
  }

  const title = (formData.get('title') as string || '').trim();
  const rawSlug = (formData.get('slug') as string || '').trim();
  const summary = (formData.get('summary') as string || '').trim();
  const content = (formData.get('content') as string || '').trim();
  const categoryIds = formData.getAll('categoryIds') as string[];
  const editSummary = (formData.get('editSummary') as string || 'Initial article publication').trim();
  const referencesJson = formData.get('references') as string;

  let parsedReferences: Array<{
    title: string;
    authors?: string;
    publisher?: string;
    publicationDate?: string;
    url?: string;
    doiOrIsbn?: string;
    citationNotes?: string;
  }> = [];

  try {
    if (referencesJson) {
      parsedReferences = JSON.parse(referencesJson);
    }
  } catch {
    parsedReferences = [];
  }

  // Validate
  const validation = validateArticleContent(title, summary, content, parsedReferences.length);
  if (!validation.isValid) {
    const errorMsg = validation.issues.find((i) => i.type === 'error')?.message || 'Validation failed';
    return { error: errorMsg, issues: validation.issues };
  }

  const slug = rawSlug ? slugify(rawSlug) : slugify(title);
  if (!isValidSlug(slug)) {
    return { error: 'Invalid URL slug generated. Please provide alphanumeric characters and hyphens.' };
  }

  try {
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      return { error: `An article with the slug "${slug}" already exists.` };
    }

    // Determine initial status based on user role
    const initialStatus = user.role === 'REGISTERED' ? 'SUBMITTED' : 'PUBLISHED';
    const publishedAt = initialStatus === 'PUBLISHED' ? new Date() : null;

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        summary,
        qualityState: 'STUB',
        status: initialStatus,
        createdById: user.id,
        publishedAt,
        categories: {
          create: categoryIds.map((cid) => ({ categoryId: cid })),
        },
        revisions: {
          create: {
            revisionNumber: 1,
            title,
            summary,
            content,
            editSummary,
            isMinorEdit: false,
            createdById: user.id,
          },
        },
        talkPage: {
          create: {},
        },
        references: {
          create: parsedReferences.map((ref, idx) => ({
            title: ref.title,
            authors: ref.authors,
            publisher: ref.publisher,
            publicationDate: ref.publicationDate,
            url: ref.url,
            doiOrIsbn: ref.doiOrIsbn,
            citationNotes: ref.citationNotes,
            orderIndex: idx + 1,
          })),
        },
        contributions: {
          create: {
            userId: user.id,
            type: 'CREATE_ARTICLE',
            summary: `Created article "${title}"`,
          },
        },
      },
      include: {
        revisions: true,
      },
    });

    // Update currentRevisionId
    if (article.revisions[0]) {
      await prisma.article.update({
        where: { id: article.id },
        data: { currentRevisionId: article.revisions[0].id },
      });
    }

    await logAuditEvent({
      userId: user.id,
      action: 'ARTICLE_CREATED',
      targetType: 'ARTICLE',
      targetId: article.id,
      details: { slug, title, status: initialStatus },
    });

    revalidatePath('/');
    revalidatePath('/search');
    revalidatePath(`/article/${slug}`);

    return { success: true, slug, status: initialStatus };
  } catch (error) {
    console.error('Error creating article:', error);
    return { error: 'Database error occurred while creating article.' };
  }
}

export async function editArticleAction(formData: FormData) {
  const user = await getCurrentUser();
  const articleId = formData.get('articleId') as string;
  const title = (formData.get('title') as string || '').trim();
  const summary = (formData.get('summary') as string || '').trim();
  const content = (formData.get('content') as string || '').trim();
  const editSummary = (formData.get('editSummary') as string || '').trim();
  const isMinorEdit = formData.get('isMinorEdit') === 'true';
  const referencesJson = formData.get('references') as string;

  if (!articleId) return { error: 'Missing article identifier.' };

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      revisions: { orderBy: { revisionNumber: 'desc' }, take: 1 },
      watchers: true,
    },
  });

  if (!article) return { error: 'Article not found.' };

  if (!canEditArticle(user, article.protectionLevel)) {
    return { error: 'You do not have permission to edit this protected article.' };
  }

  if (!editSummary) {
    return { error: 'Please provide a brief edit summary explaining your changes.' };
  }

  let parsedReferences: Array<{
    title: string;
    authors?: string;
    publisher?: string;
    publicationDate?: string;
    url?: string;
    doiOrIsbn?: string;
    citationNotes?: string;
  }> = [];

  try {
    if (referencesJson) parsedReferences = JSON.parse(referencesJson);
  } catch {
    parsedReferences = [];
  }

  const latestRev = article.revisions[0];
  const nextRevNumber = (latestRev?.revisionNumber || 0) + 1;

  try {
    const newRevision = await prisma.articleRevision.create({
      data: {
        articleId: article.id,
        revisionNumber: nextRevNumber,
        title,
        summary,
        content,
        editSummary,
        isMinorEdit,
        createdById: user!.id,
        previousRevisionId: latestRev?.id || null,
      },
    });

    // Update article latest pointer and info
    await prisma.article.update({
      where: { id: article.id },
      data: {
        title,
        summary,
        currentRevisionId: newRevision.id,
        updatedAt: new Date(),
      },
    });

    // Record user contribution
    await prisma.userContribution.create({
      data: {
        userId: user!.id,
        articleId: article.id,
        revisionId: newRevision.id,
        type: 'EDIT_ARTICLE',
        summary: editSummary,
      },
    });

    // Notify watchers
    const watcherUserIds = article.watchers
      .map((w) => w.userId)
      .filter((uid) => uid !== user!.id);

    if (watcherUserIds.length > 0) {
      await prisma.notification.createMany({
        data: watcherUserIds.map((uid) => ({
          userId: uid,
          type: 'WATCHLIST_EDIT',
          title: `Watched article updated: ${title}`,
          message: `${user!.username} made an edit: "${editSummary}"`,
          linkUrl: `/article/${article.slug}`,
        })),
      });
    }

    await logAuditEvent({
      userId: user!.id,
      action: 'ARTICLE_EDITED',
      targetType: 'ARTICLE',
      targetId: article.id,
      details: { revisionNumber: nextRevNumber, isMinorEdit, editSummary },
    });

    revalidatePath(`/article/${article.slug}`);
    revalidatePath(`/article/${article.slug}/history`);

    return { success: true, slug: article.slug, revisionNumber: nextRevNumber };
  } catch (error) {
    console.error('Error updating article:', error);
    return { error: 'Failed to record article revision.' };
  }
}

export async function revertRevisionAction(formData: FormData) {
  const user = await getCurrentUser();
  const articleId = formData.get('articleId') as string;
  const targetRevisionId = formData.get('targetRevisionId') as string;
  const reason = (formData.get('reason') as string || 'Reverted vandalism/unconstructive edit').trim();

  if (!user) return { error: 'Authentication required to revert revisions.' };

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { revisions: { orderBy: { revisionNumber: 'desc' }, take: 1 } },
  });

  if (!article) return { error: 'Article not found.' };

  if (!canEditArticle(user, article.protectionLevel)) {
    return { error: 'Permission denied to revert revisions on this article.' };
  }

  const targetRevision = await prisma.articleRevision.findUnique({
    where: { id: targetRevisionId },
  });

  if (!targetRevision) return { error: 'Target revision not found.' };

  const latestRev = article.revisions[0];
  const nextRevNumber = (latestRev?.revisionNumber || 0) + 1;

  try {
    const revertRevision = await prisma.articleRevision.create({
      data: {
        articleId: article.id,
        revisionNumber: nextRevNumber,
        title: targetRevision.title,
        summary: targetRevision.summary,
        content: targetRevision.content,
        editSummary: `Reverted to revision #${targetRevision.revisionNumber}: ${reason}`,
        isMinorEdit: false,
        createdById: user.id,
        previousRevisionId: latestRev?.id || null,
      },
    });

    await prisma.article.update({
      where: { id: article.id },
      data: {
        title: targetRevision.title,
        summary: targetRevision.summary,
        currentRevisionId: revertRevision.id,
      },
    });

    await prisma.userContribution.create({
      data: {
        userId: user.id,
        articleId: article.id,
        revisionId: revertRevision.id,
        type: 'REVERT_EDIT',
        summary: `Reverted to rev #${targetRevision.revisionNumber}: ${reason}`,
      },
    });

    // Notify the author of the reverted revision
    if (latestRev && latestRev.createdById !== user.id) {
      await prisma.notification.create({
        data: {
          userId: latestRev.createdById,
          type: 'REVISION_REVERTED',
          title: `Your edit on ${article.title} was reverted`,
          message: `${user.username} reverted your edit: "${reason}"`,
          linkUrl: `/article/${article.slug}/history`,
        },
      });
    }

    await logAuditEvent({
      userId: user.id,
      action: 'REVISION_REVERTED',
      targetType: 'ARTICLE',
      targetId: article.id,
      details: { targetRevisionNumber: targetRevision.revisionNumber, reason },
    });

    revalidatePath(`/article/${article.slug}`);
    revalidatePath(`/article/${article.slug}/history`);

    return { success: true, slug: article.slug };
  } catch (error) {
    console.error('Error reverting revision:', error);
    return { error: 'Failed to revert revision.' };
  }
}

export async function toggleWatchlistAction(articleId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Please sign in to manage your watchlist.' };

  try {
    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_articleId: {
          userId: user.id,
          articleId,
        },
      },
    });

    if (existing) {
      await prisma.watchlist.delete({
        where: { id: existing.id },
      });
      return { isWatching: false };
    } else {
      await prisma.watchlist.create({
        data: {
          userId: user.id,
          articleId,
        },
      });
      return { isWatching: true };
    }
  } catch (error) {
    console.error('Watchlist toggle error:', error);
    return { error: 'Failed to update watchlist.' };
  }
}

export async function submitReportAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Please sign in to file a moderation report.' };

  const targetType = formData.get('targetType') as ReportTargetType;
  const targetId = formData.get('targetId') as string;
  const reason = formData.get('reason') as ReportReason;
  const description = (formData.get('description') as string || '').trim();

  if (!targetId || !reason || !description) {
    return { error: 'Please provide all required report details.' };
  }

  try {
    await prisma.report.create({
      data: {
        reporterId: user.id,
        targetType,
        targetId,
        reason,
        description,
        status: 'OPEN',
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'REPORT_SUBMITTED',
      targetType,
      targetId,
      details: { reason, description },
    });

    return { success: true };
  } catch (error) {
    console.error('Error creating report:', error);
    return { error: 'Failed to submit report. Please try again.' };
  }
}

export async function updateQualityStateAction(articleId: string, qualityState: QualityState) {
  const user = await getCurrentUser();
  if (!user || !canReviewRevisions(user)) {
    return { error: 'Only authorized reviewers can modify article quality ratings.' };
  }

  try {
    const updated = await prisma.article.update({
      where: { id: articleId },
      data: { qualityState },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'QUALITY_STATE_UPDATED',
      targetType: 'ARTICLE',
      targetId: articleId,
      details: { qualityState },
    });

    revalidatePath(`/article/${updated.slug}`);
    return { success: true, qualityState };
  } catch (error) {
    console.error('Error updating quality state:', error);
    return { error: 'Failed to update quality state.' };
  }
}

export async function updateProtectionAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !canProtectArticle(user)) {
    return { error: 'Only moderators and administrators can modify article protection.' };
  }

  const articleId = formData.get('articleId') as string;
  const level = formData.get('level') as ProtectionLevel;
  const reason = (formData.get('reason') as string || '').trim();

  if (!articleId || !level) return { error: 'Missing protection parameters.' };

  try {
    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        protectionLevel: level,
        protectionReason: reason || null,
      },
    });

    await prisma.articleProtection.create({
      data: {
        articleId: article.id,
        level,
        reason: reason || 'Protection updated by moderation team',
        appliedById: user.id,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'PROTECTION_UPDATED',
      targetType: 'ARTICLE',
      targetId: article.id,
      details: { level, reason },
    });

    revalidatePath(`/article/${article.slug}`);
    return { success: true, slug: article.slug };
  } catch (error) {
    console.error('Error setting protection:', error);
    return { error: 'Failed to set article protection.' };
  }
}
