import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { StrategyList } from '@/components/admin/strategy-list';

export const metadata: Metadata = {
  title: 'Strategy Management | Admin',
  description: 'Manage user-created marketing strategies',
};

export default async function AdminStrategiesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/signin?callbackUrl=/admin/strategies');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/unauthorized?message=Admin access required');
  }

  // Get strategy statistics
  const [totalStrategies, todayStrategies, weekStrategies, monthStrategies] = await Promise.all([
    prisma.marketingStrategy.count(),
    prisma.marketingStrategy.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.marketingStrategy.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
      },
    }),
    prisma.marketingStrategy.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    }),
  ]);

  // Get recent strategies
  const recentStrategies = await prisma.marketingStrategy.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 text-text-primary">
          Strategy Management
        </h1>
        <p className="text-text-secondary">
          View, manage, and export user-created marketing strategies
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            Total Strategies
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {totalStrategies}
          </p>
        </div>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up stagger-1 hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            Today
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {todayStrategies}
          </p>
        </div>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up stagger-2 hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            This Week
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {weekStrategies}
          </p>
        </div>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up stagger-3 hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            This Month
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {monthStrategies}
          </p>
        </div>
      </div>

      {/* Strategies List */}
      <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">
            Recent Strategies
          </h2>
          <a
            href="/api/admin/strategies/export"
            className="btn btn-secondary"
            download
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export All
          </a>
        </div>

        <StrategyList strategies={recentStrategies} />
      </div>
    </div>
  );
}

