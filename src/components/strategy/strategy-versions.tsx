'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Version {
  id: string;
  strategyId: string;
  version: number;
  input: any;
  output: any;
  createdBy: string;
  createdAt: string;
}

interface StrategyVersionsProps {
  strategyId: string;
  currentVersion: number;
  onRestore?: () => void;
}

export function StrategyVersions({ strategyId, currentVersion, onRestore }: StrategyVersionsProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch versions
  const fetchVersions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/strategies/${strategyId}/versions`);

      if (!response.ok) {
        throw new Error('Failed to fetch versions');
      }

      const result = await response.json();

      if (result.success) {
        setVersions(result.data);
      }
    } catch (error) {
      console.error('Fetch versions error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to load version history.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Restore version
  const restoreVersion = async (versionId: string, versionNumber: number) => {
    if (!confirm(`Are you sure you want to restore to version ${versionNumber}? This will create a new version with the restored content.`)) {
      return;
    }

    try {
      setRestoring(versionId);
      const response = await fetch(`/api/strategies/${strategyId}/versions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to restore version');
      }

      toast({
        type: 'success',
        title: 'Version Restored',
        description: `Successfully restored to version ${versionNumber}.`,
      });

      setShowModal(false);
      if (onRestore) {
        onRestore();
      }
    } catch (error) {
      console.error('Restore version error:', error);
      toast({
        type: 'error',
        title: 'Error',
        description: 'Failed to restore version. Please try again.',
      });
    } finally {
      setRestoring(null);
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
    if (showModal) {
      fetchVersions();
    }
  }, [showModal, strategyId]);

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setShowModal(true)}
      >
        <ClockIcon className="h-5 w-5 mr-2" />
        Version History ({versions.length})
      </Button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="h-6 w-6 text-gray-700 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Version History
                  </h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-700 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-700">
                Current version: v{currentVersion}
              </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : versions.length === 0 ? (
                <div className="text-center py-12 text-gray-700">
                  <ClockIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No version history available yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {versions.map((version) => (
                    <div
                      key={version.id}
                      className={`border rounded-lg p-4 ${version.version === currentVersion
                          ? 'border-zinc-500 bg-zinc-50'
                          : 'border-gray-200'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${version.version === currentVersion
                                ? 'bg-zinc-900 text-white'
                                : 'bg-gray-100 text-gray-800'
                              }`}>
                              Version {version.version}
                              {version.version === currentVersion && ' (Current)'}
                            </span>
                            <span className="ml-3 text-sm text-gray-700">
                              {formatDate(version.createdAt)}
                            </span>
                          </div>

                          {/* Version Details */}
                          <div className="text-sm text-gray-700">
                            <p><strong>Business:</strong> {version.input.businessName}</p>
                            <p><strong>Industry:</strong> {version.input.industry}</p>
                            <p><strong>Budget:</strong> ${version.input.budget.toLocaleString()}</p>
                            <p><strong>Timeframe:</strong> {version.input.timeframe}</p>
                          </div>
                        </div>

                        {version.version !== currentVersion && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => restoreVersion(version.id, version.version)}
                            disabled={restoring === version.id}
                          >
                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                            {restoring === version.id ? 'Restoring...' : 'Restore'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

