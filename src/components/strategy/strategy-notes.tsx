'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { DocumentTextIcon, CheckIcon } from '@heroicons/react/24/outline';

interface StrategyNotesProps {
  strategyId: string;
  initialNotes: string;
  onUpdate?: (notes: string) => void;
}

export function StrategyNotes({ strategyId, initialNotes, onUpdate }: StrategyNotesProps) {
  const [notes, setNotes] = useState(initialNotes || '');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Debounced auto-save
  useEffect(() => {
    if (!hasChanges) return;

    const timeoutId = setTimeout(() => {
      saveNotes();
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [notes, hasChanges]);

  // Save notes to server
  const saveNotes = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/strategies/${strategyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to save notes');
      }

      setLastSaved(new Date());
      setHasChanges(false);

      if (onUpdate) {
        onUpdate(notes);
      }
    } catch (error) {
      console.error('Save notes error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to save notes. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle notes change
  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasChanges(true);
  };

  // Manual save
  const handleManualSave = () => {
    if (hasChanges) {
      saveNotes();
    }
  };

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return '';

    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return lastSaved.toLocaleDateString();
  };

  return (
    <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <DocumentTextIcon className="h-5 w-5 text-text-secondary mr-2" />
          <h3 className="text-lg font-semibold text-text-primary">Notes</h3>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-sm text-text-secondary">
              {saving ? (
                'Saving...'
              ) : hasChanges ? (
                'Unsaved changes'
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 inline mr-1 text-green-600 dark:text-green-400" />
                  Saved {formatLastSaved()}
                </>
              )}
            </span>
          )}
          {hasChanges && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              disabled={saving}
            >
              Save Now
            </Button>
          )}
        </div>
      </div>

      {/* Notes Editor */}
      <textarea
        value={notes}
        onChange={(e) => handleNotesChange(e.target.value)}
        placeholder="Add notes about this strategy..."
        rows={10}
        className="w-full px-3 py-2 border border-border-primary bg-bg-primary dark:bg-bg-secondary text-text-primary rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none font-mono text-sm"
        disabled={saving}
      />

      <div className="mt-2 text-xs text-text-secondary">
        Auto-saves after 2 seconds of inactivity
      </div>
    </div>
  );
}
