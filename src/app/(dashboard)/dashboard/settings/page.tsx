'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
  ];

  const handleSaveSettings = () => {
    toast({
      type: 'success',
      title: 'Settings Saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-text-secondary hover:text-white mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-text-secondary mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${
                    activeTab === tab.id
                      ? 'bg-bg-hover text-white border-l-4 border-accent-warning'
                      : 'text-text-secondary hover:bg-bg-hover hover:text-white'
                  }
                `}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-bg-tertiary rounded-lg shadow-sm border border-border-primary p-6 hover:border-border-hover transition-all">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Profile Information
                  </h2>
                  <p className="text-text-secondary mb-6">
                    Update your account profile information and email address.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      defaultValue={(user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.emailAddresses[0]?.emailAddress) || ''}
                      className="w-full px-4 py-2 bg-bg-elevated border border-border-primary text-white rounded-lg focus:ring-2 focus:ring-accent-warning focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.emailAddresses[0]?.emailAddress || ''}
                      className="w-full px-4 py-2 bg-bg-elevated border border-border-primary text-white rounded-lg focus:ring-2 focus:ring-accent-warning focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={(user?.publicMetadata?.role as string) || ''}
                      disabled
                      className="w-full px-4 py-2 bg-bg-secondary border border-border-primary text-text-tertiary rounded-lg"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Notification Preferences
                  </h2>
                  <p className="text-text-secondary mb-6">
                    Manage how you receive notifications and updates.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-border-primary">
                    <div>
                      <h3 className="font-medium text-white">Email Notifications</h3>
                      <p className="text-sm text-text-secondary">Receive email updates about your strategies</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 text-accent-warning accent-accent-warning" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border-primary">
                    <div>
                      <h3 className="font-medium text-white">Strategy Updates</h3>
                      <p className="text-sm text-text-secondary">Get notified when strategies are updated</p>
                    </div>
                    <input type="checkbox" defaultChecked className="h-5 w-5 text-accent-warning accent-accent-warning" />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border-primary">
                    <div>
                      <h3 className="font-medium text-white">Weekly Reports</h3>
                      <p className="text-sm text-text-secondary">Receive weekly performance summaries</p>
                    </div>
                    <input type="checkbox" className="h-5 w-5 text-accent-warning accent-accent-warning" />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h3 className="font-medium text-white">Marketing Updates</h3>
                      <p className="text-sm text-text-secondary">Get tips and best practices</p>
                    </div>
                    <input type="checkbox" className="h-5 w-5 text-accent-warning accent-accent-warning" />
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Security Settings
                  </h2>
                  <p className="text-text-secondary mb-6">
                    Manage your password and security preferences.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-bg-elevated border border-border-primary text-white rounded-lg focus:ring-2 focus:ring-accent-warning focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-bg-elevated border border-border-primary text-white rounded-lg focus:ring-2 focus:ring-accent-warning focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 bg-bg-elevated border border-border-primary text-white rounded-lg focus:ring-2 focus:ring-accent-warning focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveSettings}>
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Billing & Subscription
                  </h2>
                  <p className="text-text-secondary mb-6">
                    Manage your subscription and payment methods.
                  </p>
                </div>

                <div className="bg-bg-elevated border border-accent-warning/30 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Free Plan</h3>
                      <p className="text-sm text-text-secondary">Currently active</p>
                    </div>
                    <span className="px-4 py-2 bg-accent-warning text-bg-primary rounded-lg font-medium">
                      Active
                    </span>
                  </div>
                  <p className="text-text-secondary mb-4">
                    You're on the free plan with access to basic features.
                  </p>
                  <Button variant="outline">
                    Upgrade to Pro
                  </Button>
                </div>

                <div className="border-t border-border-primary pt-6">
                  <h3 className="font-medium text-white mb-4">Payment Methods</h3>
                  <p className="text-text-secondary text-sm">
                    No payment methods on file. Add a payment method to upgrade your plan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

