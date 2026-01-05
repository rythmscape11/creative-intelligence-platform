import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ActivityLogs } from '@/components/admin/activity-logs';

export const metadata: Metadata = {
  title: 'Activity Logs | Admin',
  description: 'View user activity and audit logs',
};

export default async function AdminActivityPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Get recent activities
  const activities = await prisma.userActivity.findMany({
    take: 100,
    orderBy: { timestamp: 'desc' },
  });

  // Get user details for activities
  const userIds = Array.from(new Set(activities.map(a => a.userId)));
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });

  // Map users to activities with proper type
  const activitiesWithUsers = activities.map(activity => {
    const user = users.find(u => u.id === activity.userId);
    return {
      id: activity.id,
      action: activity.action,
      entityType: activity.entityType || '',
      entityId: activity.entityId || '',
      metadata: activity.details || '{}',
      createdAt: activity.timestamp,
      user: user || {
        id: activity.userId,
        name: 'Unknown User',
        email: 'unknown@example.com',
      },
    };
  });

  const stats = {
    total: await prisma.userActivity.count(),
    today: await prisma.userActivity.count({
      where: {
        timestamp: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    thisWeek: await prisma.userActivity.count({
      where: {
        timestamp: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    }),
    thisMonth: await prisma.userActivity.count({
      where: {
        timestamp: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    }),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 text-text-primary">
          Activity Logs
        </h1>
        <p className="text-text-secondary">
          Monitor user activity and system events
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            Total Activities
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {stats.total}
          </p>
        </div>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up stagger-1 hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            Today
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {stats.today}
          </p>
        </div>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up stagger-2 hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            This Week
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {stats.thisWeek}
          </p>
        </div>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up stagger-3 hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            This Month
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {stats.thisMonth}
          </p>
        </div>
      </div>

      {/* Activity Logs */}
      <ActivityLogs activities={activitiesWithUsers} />
    </div>
  );
}

