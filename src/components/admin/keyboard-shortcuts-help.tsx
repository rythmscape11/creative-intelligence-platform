'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
}

const shortcuts: Shortcut[] = [
  { key: 'Shift + D', description: 'Go to Admin Dashboard' },
  { key: 'Shift + U', description: 'Go to Users' },
  { key: 'Shift + C', description: 'Go to Content' },
  { key: 'Shift + S', description: 'Go to Strategies' },
  { key: 'Shift + A', description: 'Go to Analytics' },
  { key: 'Shift + L', description: 'Go to Activity Logs' },
  { key: 'Shift + T', description: 'Go to Tracking' },
  { key: 'Shift + I', description: 'Go to Integrations' },
  { key: 'Shift + <', description: 'Go to Settings' },
  { key: 'Shift + B', description: 'Back to Dashboard' },
  { key: 'Shift + ?', description: 'Show this help' },
];

export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggle-shortcuts-help', handleToggle);
    return () => window.removeEventListener('toggle-shortcuts-help', handleToggle);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary border border-border-primary rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-primary">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Keyboard Shortcuts
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Navigate faster with keyboard shortcuts
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-bg-hover rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 px-4 bg-bg-tertiary rounded-lg hover:bg-bg-hover transition-colors"
              >
                <span className="text-text-primary">{shortcut.description}</span>
                <kbd className="px-3 py-1.5 bg-bg-primary border border-border-primary rounded text-sm font-mono text-accent-secondary">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-6 p-4 bg-bg-tertiary border border-border-primary rounded-lg">
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">Tip:</span> Press{' '}
              <kbd className="px-2 py-0.5 bg-bg-primary border border-border-primary rounded text-xs font-mono text-accent-secondary">
                Shift + ?
              </kbd>{' '}
              anytime to toggle this help menu.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="p-6 border-t border-border-primary">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full px-4 py-2 bg-accent-secondary hover:bg-accent-hover text-black font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

