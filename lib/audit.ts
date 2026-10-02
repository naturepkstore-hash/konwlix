import prisma from './prisma';

export async function logAuditEvent({
  userId,
  action,
  targetType,
  targetId,
  details,
  ipAddress,
  userAgent,
}: {
  userId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: string | Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    const detailsString = typeof details === 'object' ? JSON.stringify(details) : details;
    return await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        targetType,
        targetId: targetId || null,
        details: detailsString,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
    return null;
  }
}
