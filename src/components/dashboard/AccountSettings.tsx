'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { User, Mail, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resolveAppUrl } from '@/lib/url';

export function AccountSettings() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.')) {
      return;
    }

    if (!confirm('This is your final warning. All your saved results, subscription, and account data will be permanently deleted. Are you absolutely sure?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
      });

      if (response.ok) {
        await signOut();
        window.location.href = '/auth/signin';
      } else {
        alert('Failed to delete account. Please contact support.');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
        <h3 className="text-xl font-bold text-text-primary mb-6">
          Account Information
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-text-tertiary">Name</div>
              <div className="text-text-primary font-medium">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.emailAddresses[0]?.emailAddress || 'Not set'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-text-tertiary">Email</div>
              <div className="text-text-primary font-medium">
                {user?.emailAddresses[0]?.emailAddress || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
        <h3 className="text-xl font-bold text-text-primary mb-4">
          Session
        </h3>
        <p className="text-text-secondary mb-4">
          Sign out of your account on this device.
        </p>
        <Button
          variant="outline"
          onClick={async () => {
            if (isSigningOut) return;
            setIsSigningOut(true);
            try {
              await signOut();
              window.location.href = '/auth/signin';
            } catch (error) {
              console.error('[Auth] Sign out failed', error);
            } finally {
              setIsSigningOut(false);
            }
          }}
          disabled={isSigningOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isSigningOut ? 'Signing Out...' : 'Sign Out'}
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
        <h3 className="text-xl font-bold text-red-400 mb-4">
          Danger Zone
        </h3>
        <p className="text-text-secondary mb-4">
          Once you delete your account, there is no going back. All your data will be permanently deleted.
        </p>
        <Button
          variant="outline"
          onClick={handleDeleteAccount}
          disabled={loading}
          className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-500"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {loading ? 'Deleting...' : 'Delete Account'}
        </Button>
      </div>
    </div>
  );
}
