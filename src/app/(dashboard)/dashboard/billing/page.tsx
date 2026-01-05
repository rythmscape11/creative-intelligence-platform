/**
 * Billing/Pricing Dashboard Page
 * 
 * For admins: Full PricingManager with CRUD + Whitelisting
 * For users: Subscription management and payment history
 */

import { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PaymentHistory } from '@/components/payment/payment-history';
import { SubscriptionManagement } from '@/components/dashboard/SubscriptionManagement';
import { PricingManager } from '@/components/admin/PricingManager';
import { WhitelistManager } from '@/components/admin/WhitelistManager';
import { ADMIN_EMAILS } from '@/config/tool-access';
import { prisma } from '@/lib/prisma';
import {
  CreditCardIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: 'Pricing & Plan | Aureon One',
  description: 'Manage your subscription and billing information',
};

async function checkIsAdmin(userId: string): Promise<boolean> {
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();

  if (email && ADMIN_EMAILS.includes(email)) return true;

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    return dbUser?.role === 'ADMIN';
  } catch {
    return false;
  }
}

export default async function BillingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth/signin?callbackUrl=/dashboard/billing');
  }

  const isAdmin = await checkIsAdmin(userId);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCardIcon className="h-8 w-8 text-white mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Pricing & Plan
                </h1>
                <p className="text-text-secondary mt-1">
                  {isAdmin ? 'Manage plans, pricing, and user access' : 'Manage your subscription and view payment history'}
                </p>
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                <Cog6ToothIcon className="h-4 w-4 text-white" />
                <span className="text-xs text-white font-medium">Admin Mode</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin ? (
          /* Admin View - Full Control */
          <Tabs defaultValue="plans" className="space-y-6">
            <TabsList className="bg-bg-secondary">
              <TabsTrigger value="plans">Pricing Plans</TabsTrigger>
              <TabsTrigger value="whitelist">User Whitelisting</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <PricingManager />
            </TabsContent>

            <TabsContent value="whitelist">
              <WhitelistManager />
            </TabsContent>

            <TabsContent value="history">
              <PaymentHistory limit={50} showAllUsers />
            </TabsContent>
          </Tabs>
        ) : (
          /* User View - Subscription Management */
          <div className="space-y-8">
            <SubscriptionManagement />

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Payment History</h2>
              <PaymentHistory limit={10} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
