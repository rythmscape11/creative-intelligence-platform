'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { History, Clock, User, Save } from 'lucide-react';

interface VersionHistoryProps {
  strategyId: string;
}

interface Version {
  id: string;
  version: number;
  createdAt: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export function VersionHistory({ strategyId }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadVersions();
  }, [strategyId]);

  const loadVersions = async () => {
    try {
      const response = await fetch(`/api/strategies/${strategyId}/versions`);
      const data = await response.json();
      if (data.success) {
        setVersions(data.data);
      }
    } catch (error) {
      console.error('Failed to load versions:', error);
    }
  };

  const createVersion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/strategies/${strategyId}/versions`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Version Created',
          description: `Version ${data.data.version} has been saved`,
        });
        loadVersions();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create version',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const restoreVersion = async (versionId: string, versionNumber: number) => {
    if (!confirm(`Are you sure you want to restore to Version ${versionNumber}? This will create a new version with the restored content.`)) {
      return;
    }

    setRestoringId(versionId);
    try {
      const response = await fetch(`/api/strategies/${strategyId}/versions/${versionId}/restore`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Version Restored',
          description: `Successfully restored to Version ${versionNumber}`,
        });
        loadVersions();
        // Reload the page to show the restored content
        window.location.reload();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to restore version',
        variant: 'destructive',
      });
    } finally {
      setRestoringId(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" style={{ color: 'var(--color-accent-orange)' }} />
              Version History
            </CardTitle>
            <CardDescription>
              Track changes and restore previous versions
            </CardDescription>
          </div>
          <Button
            onClick={createVersion}
            disabled={isLoading}
            className="btn btn-primary"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Version
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {versions.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}>
              <History className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>No version history yet</p>
              <p className="text-sm mt-1">Save a version to track changes</p>
            </div>
          ) : (
            versions.map((version, index) => (
              <div
                key={version.id}
                className="card card-pastel-mint p-4 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Version Badge */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: index === 0 ? 'var(--gradient-accent)' : 'var(--gradient-secondary)',
                        color: 'white',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      v{version.version}
                    </div>

                    {/* Version Info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium" style={{ color: 'var(--color-neutral-charcoal)' }}>
                          Version {version.version}
                        </p>
                        {index === 0 && (
                          <Badge
                            style={{
                              background: 'var(--color-primary-yellow)',
                              color: 'white',
                            }}
                          >
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.7 }}>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(version.createdAt).toLocaleString()}
                        </span>
                        {version.createdBy && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {version.createdBy.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {index !== 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="btn btn-secondary"
                      onClick={() => restoreVersion(version.id, version.version)}
                      disabled={restoringId === version.id}
                    >
                      {restoringId === version.id ? 'Restoring...' : 'Restore'}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

