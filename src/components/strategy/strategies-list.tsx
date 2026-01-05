'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  TagIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { EmptyState } from './EmptyState';


interface Strategy {
  id: string;
  name?: string;
  input: {
    businessName: string;
    industry: string;
    budget: number;
    timeframe: string;
    objectives: string[];
  };
  output: any;
  generatedBy: 'AI' | 'FALLBACK';
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  tags: string[];
  notes?: string;
  version: number;
  isArchived: boolean;
  commentCount: number;
  versionCount: number;
  createdAt: string;
  updatedAt: string;
}

interface StrategiesResponse {
  success: boolean;
  data: Strategy[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  freeTier?: boolean;
}


export function StrategiesList() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Filter and search state
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [isFreeTier, setIsFreeTier] = useState(false);



  // Bulk actions state
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Available tags (extracted from all strategies)
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    strategies.forEach(strategy => {
      strategy.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [strategies]);

  // Fetch strategies with filters
  const fetchStrategies = async (pageNum = 1) => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '10',
        sortBy,
        sortOrder,
        archived: showArchived.toString(),
      });

      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      if (selectedTags.length > 0) {
        params.append('tags', selectedTags.join(','));
      }

      console.log('Fetching strategies with params:', params.toString());
      const response = await fetch(`/api/strategies/enhanced?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch strategies');
      }

      const result: StrategiesResponse = await response.json();

      if (result.success) {
        setStrategies(result.data);
        setPagination(result.pagination);
        setPage(pageNum);
        setIsFreeTier(!!result.freeTier);
      } else {

        throw new Error('Failed to load strategies');
      }
    } catch (error) {
      console.error('Fetch strategies error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to load strategies. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete strategy
  const deleteStrategy = async (id: string) => {
    if (!confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/strategies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete strategy');
      }

      toast({
        type: 'success',
        title: 'Strategy Deleted',
        description: 'The strategy has been deleted successfully.',
      });

      // Refresh the list
      fetchStrategies(page);
    } catch (error) {
      console.error('Delete strategy error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to delete strategy. Please try again.',
      });
    } finally {
      setDeleting(null);
    }
  };

  // Duplicate strategy
  const duplicateStrategy = async (id: string) => {
    try {
      const response = await fetch(`/api/strategies/${id}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate strategy');
      }

      toast({
        type: 'success',
        title: 'Strategy Duplicated',
        description: 'The strategy has been duplicated successfully.',
      });

      // Refresh the list
      fetchStrategies(page);
    } catch (error) {
      console.error('Duplicate strategy error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to duplicate strategy. Please try again.',
      });
    }
  };

  // Archive/Restore strategy
  const toggleArchive = async (id: string, isArchived: boolean) => {
    try {
      const action = isArchived ? 'restore' : 'archive';
      const response = await fetch('/api/strategies/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          strategyIds: [id],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} strategy`);
      }

      toast({
        type: 'success',
        title: isArchived ? 'Strategy Restored' : 'Strategy Archived',
        description: `The strategy has been ${isArchived ? 'restored' : 'archived'} successfully.`,
      });

      // Refresh the list
      fetchStrategies(page);
    } catch (error) {
      console.error('Toggle archive error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to update strategy. Please try again.',
      });
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: string) => {
    if (selectedStrategies.length === 0) {
      toast({
        type: 'error',
        title: 'No Selection',
        description: 'Please select at least one strategy.',
      });
      return;
    }

    const confirmMessage = {
      delete: 'Are you sure you want to delete the selected strategies? This action cannot be undone.',
      archive: 'Are you sure you want to archive the selected strategies?',
      restore: 'Are you sure you want to restore the selected strategies?',
    }[action];

    if (confirmMessage && !confirm(confirmMessage)) {
      return;
    }

    try {
      setBulkActionLoading(true);
      const response = await fetch('/api/strategies/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          strategyIds: selectedStrategies,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} strategies`);
      }

      const result = await response.json();

      toast({
        type: 'success',
        title: 'Bulk Action Complete',
        description: result.message || `Successfully ${action}d ${selectedStrategies.length} strategies.`,
      });

      // Clear selection and refresh
      setSelectedStrategies([]);
      fetchStrategies(page);
    } catch (error) {
      console.error('Bulk action error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to perform bulk action. Please try again.',
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Toggle strategy selection
  const toggleStrategySelection = (id: string) => {
    setSelectedStrategies(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  // Select all strategies
  const toggleSelectAll = () => {
    if (selectedStrategies.length === strategies.length) {
      setSelectedStrategies([]);
    } else {
      setSelectedStrategies(strategies.map(s => s.id));
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-800',
      ACTIVE: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-zinc-100 text-zinc-800',
      ARCHIVED: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Fetch strategies when filters change
  useEffect(() => {
    fetchStrategies(1); // Reset to page 1 when filters change
  }, [statusFilter, searchQuery, sortBy, sortOrder, selectedTags, showArchived]);

  // Initial load
  useEffect(() => {
    fetchStrategies();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="flex space-x-4">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (strategies.length === 0) {
    if (isFreeTier) {
      return <EmptyState />;
    }

    return (
      <div className="text-center py-12">
        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-700" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No strategies yet</h3>
        <p className="mt-1 text-sm text-gray-700">
          Get started by creating your first marketing strategy.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/dashboard/strategies/create">
              Create Strategy
            </Link>
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      {/* Filters and Search */}
      <div className="bg-white dark:bg-bg-secondary rounded-lg border border-gray-200 dark:border-border-primary p-4 space-y-4 transition-colors">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-700 dark:text-text-tertiary" />
            <input
              type="text"
              placeholder="Search strategies by name, business, industry, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-border-primary rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent bg-white dark:bg-bg-tertiary text-gray-900 dark:text-text-primary placeholder-gray-500 dark:placeholder-text-tertiary transition-colors"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
            className="whitespace-nowrap border-gray-300 dark:border-border-primary text-gray-700 dark:text-text-secondary hover:bg-gray-50 dark:hover:bg-bg-tertiary"
          >
            <ArchiveBoxIcon className="h-5 w-5 mr-2" />
            {showArchived ? 'Show Active' : 'Show Archived'}
          </Button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-border-primary rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent bg-white dark:bg-bg-tertiary text-gray-900 dark:text-text-primary transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
              Sort By
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-border-primary rounded-lg focus:ring-2 focus:ring-zinc-500 focus:border-transparent bg-white dark:bg-bg-tertiary text-gray-900 dark:text-text-primary transition-colors"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="updatedAt-desc">Recently Updated</option>
              <option value="updatedAt-asc">Least Recently Updated</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>

          {/* Tag Filter */}
          {availableTags.length > 0 && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
                Filter by Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.slice(0, 5).map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag)
                      ? 'bg-zinc-900 text-white'
                      : 'bg-gray-100 dark:bg-bg-tertiary text-gray-700 dark:text-text-secondary hover:bg-gray-200 dark:hover:bg-bg-elevated'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedStrategies.length > 0 && (
        <div className="bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {selectedStrategies.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStrategies([])}
                className="border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/40"
              >
                Clear Selection
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction(showArchived ? 'restore' : 'archive')}
                disabled={bulkActionLoading}
                className="border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/40"
              >
                <ArchiveBoxIcon className="h-4 w-4 mr-1" />
                {showArchived ? 'Restore' : 'Archive'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                disabled={bulkActionLoading}
                className="border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Header with Select All */}
      {strategies.length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-bg-tertiary rounded-lg p-3 transition-colors">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedStrategies.length === strategies.length && strategies.length > 0}
              onChange={toggleSelectAll}
              className="h-4 w-4 text-zinc-600 focus:ring-zinc-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-700"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-text-secondary">
              Select All ({strategies.length} strategies)
            </span>
          </div>
          <div className="text-sm text-gray-700 dark:text-text-secondary">
            Showing {strategies.length} of {pagination.total} total
          </div>
        </div>
      )}

      {/* Strategies Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className="bg-white dark:bg-bg-secondary rounded-lg border border-gray-200 dark:border-border-primary p-6 hover:shadow-md dark:hover:border-border-hover transition-all relative group"
          >
            {/* Selection Checkbox */}
            <div className="absolute top-4 left-4">
              <input
                type="checkbox"
                checked={selectedStrategies.includes(strategy.id)}
                onChange={() => toggleStrategySelection(strategy.id)}
                className="h-4 w-4 text-zinc-600 focus:ring-zinc-500 border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-700"
              />
            </div>

            {/* Header */}
            <div className="ml-8 mb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-text-primary truncate">
                    {strategy.name || strategy.input.businessName}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-text-secondary capitalize">
                    {strategy.input.industry}
                  </p>
                </div>
              </div>

              {/* Status and Version */}
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(strategy.status)}`}>
                  {strategy.status}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                  v{strategy.version}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${strategy.generatedBy === 'AI'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                  : 'bg-zinc-100 dark:bg-zinc-900/30 text-zinc-800 dark:text-zinc-300'
                  }`}>
                  {strategy.generatedBy}
                </span>
              </div>

              {/* Tags */}
              {strategy.tags && strategy.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {strategy.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-bg-tertiary text-gray-700 dark:text-text-secondary"
                    >
                      <TagIcon className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {strategy.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-bg-tertiary text-gray-700 dark:text-text-secondary">
                      +{strategy.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="ml-8 space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-text-tertiary">
                <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                {formatCurrency(strategy.input.budget)}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-text-tertiary">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {strategy.input.timeframe.replace('-', ' ')}
              </div>
              <div className="text-sm text-gray-600 dark:text-text-tertiary">
                {strategy.input.objectives.length} objective{strategy.input.objectives.length !== 1 ? 's' : ''}
              </div>

              {/* Comment and Version Counts */}
              <div className="flex items-center gap-4 text-sm text-gray-700 dark:text-text-secondary">
                <div className="flex items-center">
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                  {strategy.commentCount || 0} comments
                </div>
                <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center">
                  <span className="text-zinc-600 text-sm font-medium">
                    {(strategy.name || strategy.input.businessName || '?').charAt(0)}
                  </span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {strategy.versionCount || 0} versions
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="ml-8 flex flex-col gap-3 pt-4 border-t border-gray-100 dark:border-border-primary">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 text-xs text-gray-700 dark:text-text-tertiary">
                <span>Created: {formatDate(strategy.createdAt)}</span>
                <span>Updated: {formatDate(strategy.updatedAt)}</span>
              </div>

              <div className="flex justify-between items-center gap-2">
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    title="View Strategy"
                    className="text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-bg-tertiary"
                  >
                    <Link href={`/dashboard/strategies/${strategy.id}`}>
                      <EyeIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    title="Edit Strategy"
                    className="text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-bg-tertiary"
                  >
                    <Link href={`/dashboard/strategies/${strategy.id}/edit`}>
                      <PencilIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateStrategy(strategy.id)}
                    title="Duplicate Strategy"
                    className="text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-bg-tertiary"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleArchive(strategy.id, strategy.isArchived)}
                    title={strategy.isArchived ? 'Restore Strategy' : 'Archive Strategy'}
                    className="text-gray-600 dark:text-text-secondary hover:text-gray-900 dark:hover:text-text-primary hover:bg-gray-100 dark:hover:bg-bg-tertiary"
                  >
                    <ArchiveBoxIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteStrategy(strategy.id)}
                    disabled={deleting === strategy.id}
                    title="Delete Strategy"
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => fetchStrategies(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-700">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => fetchStrategies(page + 1)}
            disabled={page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
