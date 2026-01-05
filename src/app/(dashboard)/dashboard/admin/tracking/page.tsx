import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TrackingCodesManagement } from '@/components/admin/tracking-codes-management';

export const metadata: Metadata = {
  title: 'Tracking Codes | Admin',
  description: 'Manage analytics, pixels, and tracking scripts',
};

export default async function AdminTrackingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/signin?callbackUrl=/admin/tracking');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/unauthorized?message=Admin access required');
  }

  // Get tracking codes
  const trackingCodes = await prisma.trackingCode.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const stats = {
    total: trackingCodes.length,
    active: trackingCodes.filter(tc => tc.isActive).length,
    inactive: trackingCodes.filter(tc => !tc.isActive).length,
    analytics: trackingCodes.filter(tc => tc.type === 'ANALYTICS').length,
    pixels: trackingCodes.filter(tc => tc.type === 'PIXEL').length,
    tagManagers: trackingCodes.filter(tc => tc.type === 'TAG_MANAGER').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 text-text-primary">
          Tracking Codes
        </h1>
        <p className="text-text-secondary">
          Manage analytics, pixels, and tracking scripts for your website
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            Total Codes
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {stats.total}
          </p>
        </div>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up stagger-1 hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            Active
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {stats.active}
          </p>
        </div>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up stagger-2 hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            Inactive
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {stats.inactive}
          </p>
        </div>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up stagger-3 hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            Analytics
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {stats.analytics}
          </p>
        </div>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up stagger-1 hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            Pixels
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {stats.pixels}
          </p>
        </div>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 animate-fade-in-up stagger-2 hover:border-border-hover transition-all">
          <p className="text-sm font-medium mb-1 text-text-secondary">
            Tag Managers
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {stats.tagManagers}
          </p>
        </div>
      </div>

      {/* Tracking Codes Management Component */}
      <TrackingCodesManagement initialTrackingCodes={trackingCodes} />
    </div>
  );
}

