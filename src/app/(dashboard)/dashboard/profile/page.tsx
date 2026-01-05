'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import {
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.emailAddresses[0]?.emailAddress) || '',
    email: user?.emailAddresses[0]?.emailAddress || '',
  });

  const handleSave = () => {
    toast({
      type: 'success',
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-text-secondary hover:text-white mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-text-secondary mt-2">
          Manage your personal information and account details
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="bg-bg-tertiary rounded-lg shadow-sm border border-border-primary p-6 hover:border-border-hover transition-all">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Personal Information
            </h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-accent-warning to-accent-highlight rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {(user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.emailAddresses[0]?.emailAddress)?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              {isEditing && (
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-text-secondary mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <UserIcon className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-bg-elevated border border-border-primary text-white rounded-lg focus:ring-2 focus:ring-accent-warning focus:border-transparent"
                  />
                ) : (
                  <p className="text-white py-2">{(user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.emailAddresses[0]?.emailAddress)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-bg-elevated border border-border-primary text-white rounded-lg focus:ring-2 focus:ring-accent-warning focus:border-transparent"
                  />
                ) : (
                  <p className="text-white py-2">{user?.emailAddresses[0]?.emailAddress}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <ShieldCheckIcon className="h-4 w-4 inline mr-2" />
                  Role
                </label>
                <p className="text-white py-2 capitalize">
                  {(user?.publicMetadata?.role as string)?.toLowerCase()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <CalendarIcon className="h-4 w-4 inline mr-2" />
                  Member Since
                </label>
                <p className="text-white py-2">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-border-primary">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.emailAddresses[0]?.emailAddress) || '',
                      email: user?.emailAddresses[0]?.emailAddress || '',
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Account Stats */}
        <div className="bg-bg-tertiary rounded-lg shadow-sm border border-border-primary p-6 hover:border-border-hover transition-all">
          <h2 className="text-xl font-semibold text-white mb-6">
            Account Activity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-bg-elevated rounded-lg border border-border-primary">
              <p className="text-3xl font-bold text-accent-warning">0</p>
              <p className="text-sm text-text-secondary mt-1">Strategies Created</p>
            </div>
            <div className="text-center p-4 bg-bg-elevated rounded-lg border border-border-primary">
              <p className="text-3xl font-bold text-accent-success">0</p>
              <p className="text-sm text-text-secondary mt-1">Exports Generated</p>
            </div>
            <div className="text-center p-4 bg-bg-elevated rounded-lg border border-border-primary">
              <p className="text-3xl font-bold text-accent-highlight">0</p>
              <p className="text-sm text-text-secondary mt-1">Team Members</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-bg-tertiary rounded-lg shadow-sm border border-border-primary p-6 hover:border-border-hover transition-all">
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/settings"
              className="flex items-center p-4 border border-border-primary rounded-lg hover:border-accent-warning hover:bg-bg-hover transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-white">Settings</h3>
                <p className="text-sm text-text-secondary">
                  Manage account preferences
                </p>
              </div>
              <ArrowLeftIcon className="h-5 w-5 text-text-secondary transform rotate-180" />
            </Link>

            <Link
              href="/dashboard/strategies/create"
              className="flex items-center p-4 border border-border-primary rounded-lg hover:border-accent-warning hover:bg-bg-hover transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-white">Create Strategy</h3>
                <p className="text-sm text-text-secondary">
                  Start a new marketing plan
                </p>
              </div>
              <ArrowLeftIcon className="h-5 w-5 text-text-secondary transform rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

