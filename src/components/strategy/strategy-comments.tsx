'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { ChatBubbleLeftIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface Comment {
  id: string;
  strategyId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface StrategyCommentsProps {
  strategyId: string;
}

export function StrategyComments({ strategyId }: StrategyCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/strategies/${strategyId}/comments`);

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const result = await response.json();

      if (result.success) {
        setComments(result.data);
      }
    } catch (error) {
      console.error('Fetch comments error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to load comments.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add comment
  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/strategies/${strategyId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      toast({
        type: 'success',
        title: 'Comment Added',
        description: 'Your comment has been added successfully.',
      });

      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Add comment error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comment
  const deleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      setDeleting(commentId);
      const response = await fetch(`/api/strategies/${strategyId}/comments?commentId=${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      toast({
        type: 'success',
        title: 'Comment Deleted',
        description: 'The comment has been deleted successfully.',
      });

      fetchComments();
    } catch (error) {
      console.error('Delete comment error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete comment. Please try again.',
      });
    } finally {
      setDeleting(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    fetchComments();
  }, [strategyId]);

  return (
    <div className="bg-bg-secondary dark:bg-bg-tertiary rounded-lg border border-border-primary p-6">
      <div className="flex items-center mb-4">
        <ChatBubbleLeftIcon className="h-5 w-5 text-text-secondary mr-2" />
        <h3 className="text-lg font-semibold text-text-primary">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={addComment} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="w-full px-3 py-2 border border-border-primary bg-bg-primary dark:bg-bg-secondary text-text-primary rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent resize-none"
        />
        <div className="mt-2 flex justify-end">
          <Button
            type="submit"
            disabled={submitting || !newComment.trim()}
            size="sm"
          >
            {submitting ? 'Adding...' : 'Add Comment'}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-bg-tertiary dark:bg-bg-secondary rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-bg-tertiary dark:bg-bg-secondary rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          <ChatBubbleLeftIcon className="h-12 w-12 mx-auto mb-2 text-text-tertiary" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-l-4 border-zinc-500 dark:border-zinc-400 pl-4 py-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <UserCircleIcon className="h-5 w-5 text-text-secondary mr-2" />
                    <span className="text-sm text-text-secondary">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-text-primary whitespace-pre-wrap">{comment.content}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteComment(comment.id)}
                  disabled={deleting === comment.id}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

