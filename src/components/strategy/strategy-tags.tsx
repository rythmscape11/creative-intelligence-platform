'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { TagIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface StrategyTagsProps {
  strategyId: string;
  initialTags: string[];
  onUpdate?: (tags: string[]) => void;
}

export function StrategyTags({ strategyId, initialTags, onUpdate }: StrategyTagsProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);

  // Add tag
  const addTag = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTag = newTag.trim().toLowerCase();

    if (!trimmedTag) {
      return;
    }

    if (tags.includes(trimmedTag)) {
      toast({
        type: 'error',
        title: 'Duplicate Tag',
        description: 'This tag already exists.',
      });
      return;
    }

    const updatedTags = [...tags, trimmedTag];
    await updateTags(updatedTags);
    setNewTag('');
  };

  // Remove tag
  const removeTag = async (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    await updateTags(updatedTags);
  };

  // Update tags on server
  const updateTags = async (updatedTags: string[]) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/strategies/${strategyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: updatedTags }),
      });

      if (!response.ok) {
        throw new Error('Failed to update tags');
      }

      setTags(updatedTags);

      if (onUpdate) {
        onUpdate(updatedTags);
      }

      toast({
        type: 'success',
        title: 'Tags Updated',
        description: 'Strategy tags have been updated successfully.',
      });
    } catch (error) {
      console.error('Update tags error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to update tags. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
      <div className="flex items-center mb-4">
        <TagIcon className="h-5 w-5 text-text-secondary mr-2" />
        <h3 className="text-lg font-semibold text-text-primary">Tags</h3>
      </div>

      {/* Add Tag Form */}
      <form onSubmit={addTag} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            className="flex-1 px-3 py-2 border border-border-primary bg-bg-primary dark:bg-bg-secondary text-text-primary rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
            disabled={saving}
          />
          <Button
            type="submit"
            disabled={saving || !newTag.trim()}
            size="sm"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </form>

      {/* Tags List */}
      {tags.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          <TagIcon className="h-12 w-12 mx-auto mb-2 text-text-tertiary" />
          <p>No tags yet. Add tags to organize your strategies.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-zinc-100 dark:bg-zinc-900/30 text-zinc-800 dark:text-zinc-200"
            >
              <TagIcon className="h-3 w-3 mr-1" />
              {tag}
              <button
                onClick={() => removeTag(tag)}
                disabled={saving}
                className="ml-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 disabled:opacity-50"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {saving && (
        <div className="mt-2 text-sm text-text-secondary">
          Saving...
        </div>
      )}
    </div>
  );
}

