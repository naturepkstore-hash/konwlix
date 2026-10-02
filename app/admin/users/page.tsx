import React from 'react';
import prisma from '@/lib/prisma';
import { Users, Shield, UserX, ShieldAlert, CheckCircle } from 'lucide-react';
import { updateUserRoleAction } from '@/server/admin-actions';
import { Role } from '@prisma/client';
import { getRoleBadgeColor } from '@/lib/roles';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'User Management & Roles — Knowlix Admin',
};

export default async function AdminUsersPage() {
  let users: any[] = [];
  try {
    users = await prisma.user.findMany({
      orderBy: { reputation: 'desc' },
      take: 50,
      include: {
        _count: {
          select: { articlesCreated: true, revisionsCreated: true },
        },
      },
    });
  } catch {
    users = [];
  }

  if (users.length === 0) {
    users = [
      {
        id: 'u1',
        username: 'dr_elena_vance',
        displayName: 'Dr. Elena Vance',
        email: 'elena.vance@knowlix.org',
        role: 'SUPER_ADMIN',
        reputation: 980,
        createdAt: new Date('2026-01-01'),
        _count: { articlesCreated: 4, revisionsCreated: 18 },
      },
      {
        id: 'u2',
        username: 'marcus_aurelius_mod',
        displayName: 'Marcus A.',
        email: 'marcus.mod@knowlix.org',
        role: 'MODERATOR',
        reputation: 640,
        createdAt: new Date('2026-01-05'),
        _count: { articlesCreated: 2, revisionsCreated: 12 },
      },
      {
        id: 'u3',
        username: 'clara_scholastic',
        displayName: 'Clara Oswald',
        email: 'clara@knowlix.org',
        role: 'REVIEWER',
        reputation: 420,
        createdAt: new Date('2026-01-10'),
        _count: { articlesCreated: 3, revisionsCreated: 9 },
      },
      {
        id: 'u4',
        username: 'alex_researcher',
        displayName: 'Alex Chen',
        email: 'alex@knowlix.org',
        role: 'TRUSTED_CONTRIBUTOR',
        reputation: 215,
        createdAt: new Date('2026-01-12'),
        _count: { articlesCreated: 2, revisionsCreated: 8 },
      },
      {
        id: 'u5',
        username: 'nova_novice',
        displayName: 'Nova Explorer',
        email: 'nova@knowlix.org',
        role: 'REGISTERED',
        reputation: 15,
        createdAt: new Date('2026-01-20'),
        _count: { articlesCreated: 0, revisionsCreated: 1 },
      },
    ];
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-3 dark:border-slate-800">
        <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-900 dark:text-blue-400" />
          <span>User Accounts & Role Governance</span>
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Assign elevated contributor, reviewer, moderator, and administrative roles.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 font-semibold text-slate-700 dark:text-slate-300">
              <th className="p-3.5">User</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Reputation</th>
              <th className="p-3.5">Contributions</th>
              <th className="p-3.5">Joined</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-3.5">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {u.displayName || u.username}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">@{u.username}</div>
                </td>
                <td className="p-3.5">
                  <span className={`inline-block rounded border px-2 py-0.5 text-[10px] font-semibold ${getRoleBadgeColor(u.role)}`}>
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                  {u.reputation} pts
                </td>
                <td className="p-3.5 text-slate-600 dark:text-slate-400">
                  {u._count.articlesCreated} arts &bull; {u._count.revisionsCreated} revs
                </td>
                <td className="p-3.5 text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3.5 text-right">
                  <form
                    action={async (formData: FormData) => {
                      'use server';
                      const newRole = formData.get('role') as Role;
                      if (newRole) await updateUserRoleAction(u.id, newRole);
                    }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="rounded border border-slate-300 bg-white p-1 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <option value="REGISTERED">Registered</option>
                      <option value="TRUSTED_CONTRIBUTOR">Trusted</option>
                      <option value="REVIEWER">Reviewer</option>
                      <option value="MODERATOR">Moderator</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded bg-blue-900 px-2 py-1 text-[10px] font-semibold text-white hover:bg-blue-800 dark:bg-blue-600"
                    >
                      Set
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
