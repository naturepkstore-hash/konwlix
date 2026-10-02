import { Role, ProtectionLevel, BlockScope } from '@prisma/client';

export const ROLE_HIERARCHY: Record<Role, number> = {
  GUEST: 0,
  REGISTERED: 1,
  TRUSTED_CONTRIBUTOR: 2,
  REVIEWER: 3,
  MODERATOR: 4,
  ADMIN: 5,
  SUPER_ADMIN: 6,
};

export interface UserAuthContext {
  id: string;
  role: Role;
  reputation: number;
  isBlocked?: boolean;
  blockScope?: BlockScope | null;
}

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canCreateArticle(user?: UserAuthContext | null): boolean {
  if (!user) return false;
  if (user.isBlocked && (user.blockScope === 'ALL' || user.blockScope === 'EDITING_ONLY')) {
    return false;
  }
  return hasRole(user.role, 'REGISTERED');
}

export function canEditArticle(
  user: UserAuthContext | null,
  protectionLevel: ProtectionLevel = 'NONE'
): boolean {
  if (!user) return false;
  if (user.isBlocked && (user.blockScope === 'ALL' || user.blockScope === 'EDITING_ONLY')) {
    return false;
  }

  switch (protectionLevel) {
    case 'FULLY_PROTECTED':
      return hasRole(user.role, 'ADMIN');
    case 'SEMI_PROTECTED':
      return hasRole(user.role, 'TRUSTED_CONTRIBUTOR');
    case 'NONE':
    default:
      return hasRole(user.role, 'REGISTERED');
  }
}

export function canPostDiscussion(user?: UserAuthContext | null): boolean {
  if (!user) return false;
  if (user.isBlocked && (user.blockScope === 'ALL' || user.blockScope === 'TALK_ONLY')) {
    return false;
  }
  return hasRole(user.role, 'REGISTERED');
}

export function canReviewRevisions(user?: UserAuthContext | null): boolean {
  if (!user) return false;
  return hasRole(user.role, 'REVIEWER');
}

export function canModerateContent(user?: UserAuthContext | null): boolean {
  if (!user) return false;
  return hasRole(user.role, 'MODERATOR');
}

export function canProtectArticle(user?: UserAuthContext | null): boolean {
  if (!user) return false;
  return hasRole(user.role, 'MODERATOR');
}

export function canBlockUser(user?: UserAuthContext | null): boolean {
  if (!user) return false;
  return hasRole(user.role, 'MODERATOR');
}

export function canManageCategories(user?: UserAuthContext | null): boolean {
  if (!user) return false;
  return hasRole(user.role, 'ADMIN');
}

export function canManagePolicies(user?: UserAuthContext | null): boolean {
  if (!user) return false;
  return hasRole(user.role, 'ADMIN');
}

export function canManageUsers(user?: UserAuthContext | null): boolean {
  if (!user) return false;
  return hasRole(user.role, 'ADMIN');
}

export function canAccessAdminDashboard(user?: UserAuthContext | null): boolean {
  if (!user) return false;
  return hasRole(user.role, 'REVIEWER');
}

export function getRoleBadgeColor(role: Role): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
    case 'ADMIN':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800';
    case 'MODERATOR':
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    case 'REVIEWER':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800';
    case 'TRUSTED_CONTRIBUTOR':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    case 'REGISTERED':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
    case 'GUEST':
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}
