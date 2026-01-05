'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Admin panel keyboard shortcuts
export function useAdminKeyboardShortcuts() {
  const router = useRouter();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'd',
      shiftKey: true,
      action: () => router.push('/admin'),
      description: 'Go to Admin Dashboard',
    },
    {
      key: 'u',
      shiftKey: true,
      action: () => router.push('/admin/users'),
      description: 'Go to Users',
    },
    {
      key: 'c',
      shiftKey: true,
      action: () => router.push('/admin/blog'),
      description: 'Go to Content',
    },
    {
      key: 's',
      shiftKey: true,
      action: () => router.push('/admin/strategies'),
      description: 'Go to Strategies',
    },
    {
      key: 'a',
      shiftKey: true,
      action: () => router.push('/admin/analytics'),
      description: 'Go to Analytics',
    },
    {
      key: 'l',
      shiftKey: true,
      action: () => router.push('/admin/activity'),
      description: 'Go to Activity Logs',
    },
    {
      key: 't',
      shiftKey: true,
      action: () => router.push('/admin/tracking'),
      description: 'Go to Tracking',
    },
    {
      key: 'i',
      shiftKey: true,
      action: () => router.push('/dashboard/admin/integrations'),
      description: 'Go to Integrations',
    },
    {
      key: ',',
      shiftKey: true,
      action: () => router.push('/admin/settings'),
      description: 'Go to Settings',
    },
    {
      key: 'b',
      shiftKey: true,
      action: () => router.push('/dashboard'),
      description: 'Back to Dashboard',
    },
    {
      key: '?',
      shiftKey: true,
      action: () => {
        // Toggle keyboard shortcuts help modal
        const event = new CustomEvent('toggle-shortcuts-help');
        window.dispatchEvent(event);
      },
      description: 'Show keyboard shortcuts',
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}

