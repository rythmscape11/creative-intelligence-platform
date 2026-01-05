'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy, Mail, Link as LinkIcon, Trash2, Eye, MessageSquare, Edit } from 'lucide-react';

interface ShareStrategyProps {
  strategyId: string;
}

interface Share {
  id: string;
  token: string;
  shareUrl: string;
  sharedWith: string | null;
  accessLevel: 'VIEW' | 'COMMENT' | 'EDIT';
  expiresAt: string | null;
  createdAt: string;
  isActive: boolean;
}

export function ShareStrategy({ strategyId }: ShareStrategyProps) {
  const [shares, setShares] = useState<Share[]>([]);
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<'VIEW' | 'COMMENT' | 'EDIT'>('VIEW');
  const [expiresIn, setExpiresIn] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadShares();
  }, [strategyId]);

  const loadShares = async () => {
    try {
      const response = await fetch(`/api/strategies/${strategyId}/share`);
      const data = await response.json();
      if (data.success) {
        setShares(data.data);
      }
    } catch (error) {
      console.error('Failed to load shares:', error);
    }
  };

  const createShare = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/strategies/${strategyId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sharedWith: email || undefined,
          accessLevel,
          expiresIn,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Share Created',
          description: 'Strategy shared successfully',
        });
        setEmail('');
        loadShares();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create share',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareLink = (shareUrl: string) => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Copied',
      description: 'Share link copied to clipboard',
    });
  };

  const revokeAllShares = async () => {
    if (!confirm('Are you sure you want to revoke all shares?')) return;

    try {
      const response = await fetch(`/api/strategies/${strategyId}/share`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Shares Revoked',
          description: 'All shares have been revoked',
        });
        loadShares();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke shares',
        variant: 'destructive',
      });
    }
  };

  const getAccessIcon = (level: string) => {
    switch (level) {
      case 'VIEW': return <Eye className="h-4 w-4" />;
      case 'COMMENT': return <MessageSquare className="h-4 w-4" />;
      case 'EDIT': return <Edit className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" style={{ color: 'var(--color-primary-yellow)' }} />
            Share Strategy
          </CardTitle>
          <CardDescription>
            Share this strategy with team members or create a public link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional - leave empty for public link)</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accessLevel">Access Level</Label>
              <select
                id="accessLevel"
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{ borderColor: 'var(--color-neutral-light)' }}
              >
                <option value="VIEW">View Only</option>
                <option value="COMMENT">Can Comment</option>
                <option value="EDIT">Can Edit</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiresIn">Expires In (days)</Label>
              <Input
                id="expiresIn"
                type="number"
                min="1"
                max="365"
                value={expiresIn}
                onChange={(e) => setExpiresIn(parseInt(e.target.value))}
              />
            </div>
          </div>

          <Button
            onClick={createShare}
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Create Share Link
          </Button>
        </CardContent>
      </Card>

      {shares.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Shares ({shares.length})</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={revokeAllShares}
                className="btn btn-secondary"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Revoke All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shares.map((share) => (
                <div
                  key={share.id}
                  className="card card-pastel-blue p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {share.sharedWith ? (
                        <>
                          <Mail className="h-4 w-4" style={{ color: 'var(--color-primary-yellow)' }} />
                          <span className="font-medium">{share.sharedWith}</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="h-4 w-4" style={{ color: 'var(--color-primary-yellow)' }} />
                          <span className="font-medium">Public Link</span>
                        </>
                      )}
                      <Badge
                        className="ml-2"
                        style={{
                          background: '#f4f4f5', // zinc-100
                          color: 'var(--color-neutral-charcoal)',
                        }}
                      >
                        {getAccessIcon(share.accessLevel)}
                        <span className="ml-1">{share.accessLevel}</span>
                      </Badge>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.7 }}>
                      Created {new Date(share.createdAt).toLocaleDateString()}
                      {share.expiresAt && ` • Expires ${new Date(share.expiresAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyShareLink(share.shareUrl)}
                    className="btn btn-secondary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

