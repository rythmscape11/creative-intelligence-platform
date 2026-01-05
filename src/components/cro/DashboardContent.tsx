'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { SavedResults } from './SavedResults';
import { SubscriptionManagement } from './SubscriptionManagement';
import { AccountSettings } from './AccountSettings';

type Tab = 'results' | 'subscription' | 'settings';

export function DashboardContent() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState<Tab>('results');

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 text-center">
        <p className="text-text-secondary">Please sign in to access your dashboard.</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'results', label: 'Saved Results' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-border-primary">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                  ? 'border-accent-secondary text-accent-secondary'
                  : 'border-transparent text-text-tertiary hover:text-text-secondary hover:border-border-primary'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'results' && <SavedResults />}
        {activeTab === 'subscription' && <SubscriptionManagement />}
        {activeTab === 'settings' && <AccountSettings />}
      </div>
    </div>
  );
}

