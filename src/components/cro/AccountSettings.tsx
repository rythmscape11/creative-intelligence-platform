'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { User, Mail, Calendar, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resolveAppUrl } from '@/lib/url';

export function AccountSettings() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [deleting, setDeleting] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmation = prompt(
      'This action cannot be undone. All your data will be permanently deleted.\n\n' +
      'Type "DELETE" to confirm:'
    );

    if (confirmation !== 'DELETE') {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/account/delete', {
        method: 'POST',
      });

      if (response.ok) {
        alert('Your account has been deleted. You will be signed out.');
        await signOut({ redirectUrl: '/auth/signin' });
      } else {
        const data = await response.json();
        alert(`Failed to delete account: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Account Information */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
        <h2 className="text-xl font-bold text-text-primary mb-6">
          Account Information
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-text-tertiary" />
            <div>
              <p className="text-sm text-text-tertiary">Name</p>
              <p className="text-text-primary">{user.fullName || user.firstName || 'Not set'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-text-tertiary" />
            <div>
              <p className="text-sm text-text-tertiary">Email</p>
              <p className="text-text-primary">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-text-tertiary" />
            <div>
              <p className="text-sm text-text-tertiary">Member Since</p>
              <p className="text-text-primary">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
        <h2 className="text-xl font-bold text-text-primary mb-6">
          Account Actions
        </h2>

        <div className="space-y-4">
          {/* Sign Out */}
          <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
            <div>
              <h3 className="font-medium text-text-primary mb-1">
                Sign Out
              </h3>
              <p className="text-sm text-text-secondary">
                Sign out of your account on this device
              </p>
            </div>
            <Button
              variant="outline"
              onClick={async () => {
                if (isSigningOut) return;
                setIsSigningOut(true);
                try {
                  await signOut({ redirectUrl: '/auth/signin' });
                } catch (error) {
                  console.error('[Auth] Sign out failed', error);
                } finally {
                  setIsSigningOut(false);
                }
              }}
              className="flex items-center gap-2"
              disabled={isSigningOut}
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
            <div>
              <h3 className="font-medium text-red-400 mb-1">
                Delete Account
              </h3>
              <p className="text-sm text-text-secondary">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex items-center gap-2 border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? 'Deleting...' : 'Delete Account'}
            </Button>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
        <h2 className="text-xl font-bold text-text-primary mb-6">
          Privacy & Security
        </h2>

        <div className="space-y-4 text-sm text-text-secondary">
          <p>
            Your data is encrypted and stored securely. We never share your personal information with third parties.
          </p>
          <p>
            For more information, please review our{' '}
            <a href="/privacy" className="text-accent-secondary hover:underline">
              Privacy Policy
            </a>
            {' '}and{' '}
            <a href="/terms" className="text-accent-secondary hover:underline">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
