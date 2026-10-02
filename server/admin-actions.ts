'use server';

import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { canManageUsers, canBlockUser, canModerateContent, canManageCategories, canManagePolicies } from '@/lib/roles';
import { logAuditEvent } from '@/lib/audit';
import { Role, BlockScope, ReportStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { slugify } from '@/lib/slugify';

export async function updateUserRoleAction(userId: string, newRole: Role) {
  const user = await getCurrentUser();
  if (!user || !canManageUsers(user)) {
    return { error: 'Permission denied to manage user roles.' };
  }

  try {
    const targetUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'USER_ROLE_UPDATED',
      targetType: 'USER',
      targetId: userId,
      details: { newRole, username: targetUser.username },
    });

    revalidatePath('/admin/users');
    return { success: true, role: targetUser.role };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { error: 'Failed to update user role.' };
  }
}

export async function blockUserAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !canBlockUser(user)) {
    return { error: 'Permission denied to apply user blocks.' };
  }

  const targetUserId = formData.get('userId') as string;
  const reason = (formData.get('reason') as string || '').trim();
  const scope = (formData.get('scope') as BlockScope) || 'ALL';
  const durationDays = parseInt(formData.get('durationDays') as string || '7', 10);

  if (!targetUserId || !reason) {
    return { error: 'Please specify target user and reason for block.' };
  }

  const endAt = durationDays > 0 ? new Date(Date.now() + durationDays * 86400000) : null;

  try {
    await prisma.userBlock.create({
      data: {
        userId: targetUserId,
        blockedById: user.id,
        reason,
        scope,
        endAt,
        isActive: true,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'USER_BLOCKED',
      targetType: 'USER',
      targetId: targetUserId,
      details: { reason, scope, durationDays },
    });

    revalidatePath('/admin/users');
    revalidatePath('/admin/blocks');
    return { success: true };
  } catch (error) {
    console.error('Error blocking user:', error);
    return { error: 'Failed to apply user block.' };
  }
}

export async function unblockUserAction(blockId: string) {
  const user = await getCurrentUser();
  if (!user || !canBlockUser(user)) {
    return { error: 'Permission denied.' };
  }

  try {
    const block = await prisma.userBlock.update({
      where: { id: blockId },
      data: { isActive: false },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'USER_UNBLOCKED',
      targetType: 'USER',
      targetId: block.userId,
    });

    revalidatePath('/admin/blocks');
    return { success: true };
  } catch (error) {
    console.error('Error unblocking user:', error);
    return { error: 'Failed to unblock user.' };
  }
}

export async function resolveReportAction(
  reportId: string,
  status: ReportStatus,
  resolutionNotes: string
) {
  const user = await getCurrentUser();
  if (!user || !canModerateContent(user)) {
    return { error: 'Permission denied to moderate reports.' };
  }

  try {
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        resolution: resolutionNotes,
        assignedModeratorId: user.id,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'REPORT_RESOLVED',
      targetType: 'REPORT',
      targetId: reportId,
      details: { status, resolutionNotes },
    });

    revalidatePath('/admin/reports');
    return { success: true };
  } catch (error) {
    console.error('Error resolving report:', error);
    return { error: 'Failed to update report resolution.' };
  }
}

export async function createCategoryAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !canManageCategories(user)) {
    return { error: 'Permission denied to manage categories.' };
  }

  const name = (formData.get('name') as string || '').trim();
  const description = (formData.get('description') as string || '').trim();
  const parentId = (formData.get('parentId') as string) || null;

  if (!name) return { error: 'Category name is required.' };
  const slug = slugify(name);

  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'CATEGORY_CREATED',
      targetType: 'CATEGORY',
      targetId: category.id,
      details: { name, slug },
    });

    revalidatePath('/categories');
    revalidatePath('/admin/categories');
    return { success: true, slug: category.slug };
  } catch (error) {
    console.error('Error creating category:', error);
    return { error: 'Category creation failed. Make sure name is unique.' };
  }
}

export async function updatePolicyAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !canManagePolicies(user)) {
    return { error: 'Only administrators can update encyclopedia governance policies.' };
  }

  const policyId = formData.get('policyId') as string;
  const content = (formData.get('content') as string || '').trim();
  const changeSummary = (formData.get('changeSummary') as string || 'Governance policy revision').trim();

  if (!policyId || !content) {
    return { error: 'Missing policy content or identifier.' };
  }

  try {
    const policy = await prisma.policy.update({
      where: { id: policyId },
      data: {
        currentContent: content,
        updatedAt: new Date(),
      },
    });

    await prisma.policyRevision.create({
      data: {
        policyId: policy.id,
        title: policy.title,
        content,
        changeSummary,
        authorId: user.id,
      },
    });

    await logAuditEvent({
      userId: user.id,
      action: 'POLICY_UPDATED',
      targetType: 'POLICY',
      targetId: policy.id,
      details: { changeSummary },
    });

    revalidatePath(`/policies/${policy.slug}`);
    revalidatePath('/policies');
    return { success: true, slug: policy.slug };
  } catch (error) {
    console.error('Error updating policy:', error);
    return { error: 'Failed to save policy revision.' };
  }
}
