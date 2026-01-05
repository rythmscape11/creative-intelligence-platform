'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { BlogPostList } from './blog-post-list';
import { BlogFilters } from './blog-filters';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    color: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Filters {
  status?: string;
  categoryId?: string;
  authorId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  _count?: {
    posts: number;
  };
}

export function BlogManagementDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<Filters>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    scheduled: 0,
    categories: 0,
  });

  // Fetch blog posts
  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);

      // Build params object, filtering out undefined/empty values
      const paramsObj: Record<string, string> = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };

      // Only add filter params if they have values
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          paramsObj[key] = value.toString();
        }
      });

      const params = new URLSearchParams(paramsObj);

      const response = await fetch(`/api/blog/posts?${params}`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.error || 'Failed to fetch blog posts');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit, pagination.page]);

  // Fetch categories for filter
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<Filters>) => {
    // Update both filters and pagination in a single state update to avoid race condition
    setFilters(prev => ({ ...prev, ...newFilters }));
    // Use functional update to ensure we're working with latest pagination state
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  // Handle post deletion
  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Post deleted successfully');
        fetchPosts(); // Refresh list
      } else {
        toast.error(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  // Handle post duplication
  const handleDuplicate = async (postId: string) => {
    try {
      const response = await fetch(`/api/blog/posts/${postId}/duplicate`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Post duplicated successfully');
        fetchPosts(); // Refresh list
      } else {
        toast.error(data.error || 'Failed to duplicate post');
      }
    } catch (error) {
      console.error('Error duplicating post:', error);
      toast.error('Failed to duplicate post');
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string, categoryId?: string) => {
    if (selectedPosts.length === 0) {
      toast.error('Please select at least one post');
      return;
    }

    const confirmMessages: Record<string, string> = {
      publish: 'Are you sure you want to publish the selected posts?',
      archive: 'Are you sure you want to archive the selected posts?',
      delete: 'Are you sure you want to delete the selected posts? This action cannot be undone.',
      changeCategory: 'Are you sure you want to change the category for the selected posts?',
    };

    if (!confirm(confirmMessages[action])) {
      return;
    }

    try {
      const response = await fetch('/api/blog/posts/bulk', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postIds: selectedPosts,
          action,
          categoryId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setSelectedPosts([]); // Clear selection
        fetchPosts(); // Refresh list
      } else {
        toast.error(data.error || 'Failed to perform bulk action');
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(posts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  // Handle individual selection
  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId]);
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    }
  };

  useEffect(() => {
    if (categories.length === 0) {
      setStats((prev) => ({
        ...prev,
        categories: 0,
        total: pagination.total,
      }));
      return;
    }

    let cancelled = false;

    const loadStats = async () => {
      try {
        const response = await fetch('/api/blog/stats', {
          credentials: 'include',
        });
        const data = await response.json();

        if (!cancelled && data.success) {
          setStats({
            total: data.data.total || 0,
            published: data.data.published || 0,
            draft: data.data.draft || 0,
            scheduled: data.data.scheduled || 0,
            categories: categories.length,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        if (!cancelled) {
          setStats({
            total: pagination.total,
            published: 0,
            draft: 0,
            scheduled: 0,
            categories: categories.length,
          });
        }
      }
    };

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [categories, pagination.total]);

  // Show loading state while session is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Posts */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all rounded-lg p-6">
          <p className="text-sm font-medium mb-2 text-text-secondary">Total Posts</p>
          <p className="text-4xl font-bold text-text-primary mb-1">{stats.total}</p>
          <p className="text-xs text-text-tertiary">All blog posts</p>
        </div>

        {/* Published */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 hover:border-green-500/40 transition-all rounded-lg p-6">
          <p className="text-sm font-medium mb-2 text-text-secondary">Published</p>
          <p className="text-4xl font-bold text-green-400 mb-1">{stats.published}</p>
          <p className="text-xs text-text-tertiary">Live on website</p>
        </div>

        {/* Draft */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 hover:border-yellow-500/40 transition-all rounded-lg p-6">
          <p className="text-sm font-medium mb-2 text-text-secondary">Draft</p>
          <p className="text-4xl font-bold text-yellow-400 mb-1">{stats.draft}</p>
          <p className="text-xs text-text-tertiary">Work in progress</p>
        </div>

        {/* Scheduled */}
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all rounded-lg p-6">
          <p className="text-sm font-medium mb-2 text-text-secondary">Scheduled</p>
          <p className="text-4xl font-bold text-purple-400 mb-1">{stats.scheduled}</p>
          <p className="text-xs text-text-tertiary">Future posts</p>
        </div>

        {/* Categories */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all rounded-lg p-6">
          <p className="text-sm font-medium mb-2 text-text-secondary">Categories</p>
          <p className="text-4xl font-bold text-cyan-400 mb-1">{stats.categories}</p>
          <p className="text-xs text-text-tertiary">Content topics</p>
        </div>
      </div>

      {/* Filters */}
      <BlogFilters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">
            {selectedPosts.length} post(s) selected
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('publish')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
            >
              Publish
            </button>

            <button
              onClick={() => handleBulkAction('archive')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors shadow-sm"
            >
              Archive
            </button>

            {user?.publicMetadata?.role === 'ADMIN' && (
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
              >
                Delete
              </button>
            )}

            <button
              onClick={() => setSelectedPosts([])}
              className="px-4 py-2 bg-bg-tertiary border border-border-primary text-text-primary rounded-lg text-sm font-medium hover:bg-bg-hover transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Blog Post List */}
      <BlogPostList
        posts={posts}
        loading={loading}
        selectedPosts={selectedPosts}
        onSelectAll={handleSelectAll}
        onSelectPost={handleSelectPost}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        userRole={user?.publicMetadata?.role as string | undefined}
        currentUserId={user?.id}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border-primary pt-4">
          <div className="text-sm text-text-secondary">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} posts
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-border-primary bg-bg-secondary text-text-primary rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-tertiary transition-colors"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first, last, current, and adjacent pages
                return (
                  page === 1 ||
                  page === pagination.totalPages ||
                  Math.abs(page - pagination.page) <= 1
                );
              })
              .map((page, index, array) => {
                // Add ellipsis
                if (index > 0 && page - array[index - 1] > 1) {
                  return [
                    <span key={`ellipsis-${page}`} className="px-2 text-text-tertiary">...</span>,
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${page === pagination.page
                          ? 'bg-accent-highlight text-white border-accent-highlight'
                          : 'border-border-primary bg-bg-secondary text-text-primary hover:bg-bg-tertiary'
                        }`}
                    >
                      {page}
                    </button>
                  ];
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${page === pagination.page
                        ? 'bg-accent-highlight text-white border-accent-highlight'
                        : 'border-border-primary bg-bg-secondary text-text-primary hover:bg-bg-tertiary'
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 border border-border-primary bg-bg-secondary text-text-primary rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-bg-tertiary transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
