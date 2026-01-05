'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface StrategyStatusProps {
  strategyId: string;
  initialStatus: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  onUpdate?: (status: string) => void;
}

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800', description: 'Work in progress' },
  { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800', description: 'Currently running' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-zinc-100 text-zinc-800', description: 'Finished successfully' },
  { value: 'ARCHIVED', label: 'Archived', color: 'bg-yellow-100 text-yellow-800', description: 'No longer active' },
];

export function StrategyStatus({ strategyId, initialStatus, onUpdate }: StrategyStatusProps) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  // Update status
  const updateStatus = async (newStatus: string) => {
    if (newStatus === status) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/strategies/${strategyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      setStatus(newStatus as typeof initialStatus);

      if (onUpdate) {
        onUpdate(newStatus);
      }

      toast({
        type: 'success',
        title: 'Status Updated',
        description: `Strategy status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Update status error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to update status. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === status);

  return (
    <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
      <div className="flex items-center mb-4">
        <CheckCircleIcon className="h-5 w-5 text-text-secondary mr-2" />
        <h3 className="text-lg font-semibold text-text-primary">Status</h3>
      </div>

      {/* Current Status */}
      <div className="mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatusOption?.color}`}>
          {currentStatusOption?.label}
        </span>
        <p className="mt-2 text-sm text-text-secondary">
          {currentStatusOption?.description}
        </p>
      </div>

      {/* Status Options */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Change Status
        </label>
        <div className="grid grid-cols-2 gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateStatus(option.value)}
              disabled={saving || option.value === status}
              className={`px-4 py-3 rounded-lg border-2 text-left transition-all ${option.value === status
                ? 'border-zinc-500 bg-zinc-50 dark:bg-zinc-900/20'
                : 'border-border-primary hover:border-border-secondary bg-bg-primary dark:bg-bg-secondary'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${option.color}`}>
                {option.label}
              </div>
              <p className="text-xs text-text-tertiary">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {saving && (
        <div className="mt-4 text-sm text-text-secondary">
          Updating status...
        </div>
      )}
    </div>
  );
}

