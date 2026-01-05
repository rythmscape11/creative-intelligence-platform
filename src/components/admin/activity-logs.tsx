'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Activity,
  User,
  FileText,
  Lightbulb,
  Share2,
  MessageSquare,
  History,
  Download,
  Shield,
  Trash2,
  Edit,
  Plus,
  Clock,
} from 'lucide-react';

interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface ActivityLogsProps {
  activities: ActivityLog[];
}

export function ActivityLogs({ activities: initialActivities }: ActivityLogsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredActivities = initialActivities.filter(activity => {
    const matchesSearch = activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || activity.action.includes(actionFilter);

    return matchesSearch && matchesAction;
  });

  const getActionIcon = (action: string) => {
    if (action.includes('CREATE')) return Plus;
    if (action.includes('UPDATE') || action.includes('EDIT')) return Edit;
    if (action.includes('DELETE')) return Trash2;
    if (action.includes('SHARE')) return Share2;
    if (action.includes('COMMENT')) return MessageSquare;
    if (action.includes('VERSION')) return History;
    if (action.includes('EXPORT')) return Download;
    if (action.includes('ROLE')) return Shield;
    return Activity;
  };

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'var(--color-primary-yellow)';
    if (action.includes('UPDATE') || action.includes('EDIT')) return 'var(--color-primary-yellow)';
    if (action.includes('DELETE')) return 'var(--color-accent-orange)';
    if (action.includes('SHARE')) return 'var(--color-accent-amber)';
    if (action.includes('EXPORT')) return 'var(--color-primary-yellow-dark)';
    return 'var(--color-neutral-charcoal)';
  };

  const getEntityIcon = (entityType: string) => {
    if (entityType === 'STRATEGY') return Lightbulb;
    if (entityType === 'BLOG_POST') return FileText;
    if (entityType === 'USER') return User;
    return Activity;
  };

  const formatAction = (action: string) => {
    return action
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Activity Logs ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.5 }} />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Action Filter */}
            <div>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                style={{ borderColor: 'var(--color-neutral-light)' }}
              >
                <option value="ALL">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="SHARE">Share</option>
                <option value="EXPORT">Export</option>
                <option value="ROLE">Role Changes</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}>
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p>No activities found</p>
              </div>
            ) : (
              filteredActivities.map((activity, index) => {
                const ActionIcon = getActionIcon(activity.action);
                const EntityIcon = getEntityIcon(activity.entityType);
                const actionColor = getActionColor(activity.action);

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg hover:shadow-md transition-all animate-fade-in-up bg-bg-tertiary border border-border-primary"
                    style={{
                      animationDelay: `${index * 0.05}s`
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: actionColor, color: 'white' }}
                    >
                      <ActionIcon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-text-primary">
                            {activity.user.name}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {formatAction(activity.action)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{
                              background: 'var(--color-primary-yellow-light)',
                              color: 'var(--color-neutral-charcoal)',
                            }}
                          >
                            <EntityIcon className="h-3 w-3 mr-1" />
                            {activity.entityType}
                          </Badge>
                        </div>
                      </div>

                      {/* Metadata */}
                      {activity.metadata && activity.metadata !== '{}' && (
                        <div className="text-sm mt-2 p-3 rounded-lg bg-bg-secondary border border-border-primary">
                          <pre className="whitespace-pre-wrap font-mono text-xs text-text-secondary overflow-x-auto">
                            {JSON.stringify(JSON.parse(activity.metadata), null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="flex items-center gap-1 mt-2 text-xs text-text-tertiary">
                        <Clock className="h-3 w-3" />
                        {new Date(activity.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

