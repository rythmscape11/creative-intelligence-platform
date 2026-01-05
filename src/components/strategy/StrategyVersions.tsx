'use client';

import { useState } from 'react';
import {
    ClockIcon,
    DocumentDuplicateIcon,
    ArrowPathIcon,
    TrashIcon,
    EyeIcon,
    CheckIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

export interface StrategyVersion {
    id: string;
    versionNumber: number;
    title: string;
    status: 'draft' | 'final' | 'archived';
    createdAt: Date;
    updatedAt: Date;
    createdBy: {
        id: string;
        name: string;
        avatar?: string;
    };
    changes?: string;
    isCurrentVersion: boolean;
}

interface StrategyVersionsProps {
    strategyId: string;
    versions: StrategyVersion[];
    currentVersionId: string;
    onVersionSelect: (versionId: string) => void;
    onVersionCreate: () => void;
    onVersionRestore: (versionId: string) => void;
    onVersionDelete: (versionId: string) => void;
    className?: string;
}

export function StrategyVersions({
    strategyId,
    versions,
    currentVersionId,
    onVersionSelect,
    onVersionCreate,
    onVersionRestore,
    onVersionDelete,
    className = ''
}: StrategyVersionsProps) {
    const [expandedVersion, setExpandedVersion] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

    const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);
    const displayedVersions = showAll ? sortedVersions : sortedVersions.slice(0, 5);
    const hasMore = versions.length > 5;

    const getStatusBadge = (status: StrategyVersion['status']) => {
        switch (status) {
            case 'final':
                return <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Final</span>;
            case 'draft':
                return <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">Draft</span>;
            case 'archived':
                return <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">Archived</span>;
        }
    };

    return (
        <div className={`bg-bg-secondary border border-border-primary rounded-xl ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary">
                <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-text-tertiary" />
                    <h3 className="font-semibold text-text-primary">Version History</h3>
                    <span className="px-2 py-0.5 bg-bg-tertiary text-text-tertiary text-xs rounded-full">
                        {versions.length} versions
                    </span>
                </div>
                <button
                    onClick={onVersionCreate}
                    className="flex items-center gap-1 px-3 py-1.5 bg-accent-primary text-white text-sm rounded-lg hover:bg-accent-secondary transition-colors"
                >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                    New Version
                </button>
            </div>

            {/* Version List */}
            <div className="divide-y divide-border-primary">
                {displayedVersions.map((version) => (
                    <div
                        key={version.id}
                        className={`${version.id === currentVersionId ? 'bg-accent-primary/5' : ''}`}
                    >
                        <div
                            className="flex items-center gap-4 px-4 py-3 hover:bg-bg-tertiary/50 cursor-pointer transition-colors"
                            onClick={() => setExpandedVersion(expandedVersion === version.id ? null : version.id)}
                        >
                            {/* Version Number */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-bg-tertiary text-text-primary font-semibold">
                                v{version.versionNumber}
                            </div>

                            {/* Version Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-text-primary truncate">{version.title}</p>
                                    {version.isCurrentVersion && (
                                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                            Current
                                        </span>
                                    )}
                                    {getStatusBadge(version.status)}
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-text-tertiary">
                                    <span>{version.createdBy.name}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(version.createdAt), { addSuffix: true })}</span>
                                </div>
                            </div>

                            {/* Expand Icon */}
                            <ChevronDownIcon
                                className={`h-5 w-5 text-text-tertiary transition-transform ${expandedVersion === version.id ? 'rotate-180' : ''
                                    }`}
                            />
                        </div>

                        {/* Expanded Details */}
                        {expandedVersion === version.id && (
                            <div className="px-4 pb-4 space-y-3 bg-bg-tertiary/30">
                                {/* Changes */}
                                {version.changes && (
                                    <div className="px-4 py-3 bg-bg-secondary rounded-lg border border-border-primary">
                                        <p className="text-sm text-text-secondary">
                                            <span className="font-medium text-text-primary">Changes: </span>
                                            {version.changes}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onVersionSelect(version.id);
                                        }}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-secondary hover:text-text-primary hover:border-border-secondary transition-colors"
                                    >
                                        <EyeIcon className="h-4 w-4" />
                                        View
                                    </button>

                                    {!version.isCurrentVersion && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onVersionRestore(version.id);
                                            }}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-bg-secondary border border-border-primary rounded-lg text-sm text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
                                        >
                                            <ArrowPathIcon className="h-4 w-4" />
                                            Restore
                                        </button>
                                    )}

                                    {version.status !== 'final' && !version.isCurrentVersion && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onVersionDelete(version.id);
                                            }}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-bg-secondary border border-border-primary rounded-lg text-sm text-red-400 hover:border-red-400 transition-colors"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                            Delete
                                        </button>
                                    )}
                                </div>

                                {/* Metadata */}
                                <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                                    <div>
                                        <span className="text-text-tertiary">Created:</span>
                                        <span className="ml-2 text-text-secondary">
                                            {new Date(version.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-text-tertiary">Updated:</span>
                                        <span className="ml-2 text-text-secondary">
                                            {formatDistanceToNow(new Date(version.updatedAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Show More */}
            {hasMore && (
                <div className="px-4 py-3 border-t border-border-primary">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="w-full text-sm text-accent-primary hover:text-accent-highlight transition-colors"
                    >
                        {showAll ? 'Show less' : `Show ${versions.length - 5} more versions`}
                    </button>
                </div>
            )}

            {/* Empty State */}
            {versions.length === 0 && (
                <div className="px-4 py-8 text-center">
                    <ClockIcon className="h-12 w-12 text-text-tertiary mx-auto mb-3" />
                    <p className="text-text-secondary">No version history</p>
                    <button
                        onClick={onVersionCreate}
                        className="mt-3 text-sm text-accent-primary hover:text-accent-highlight"
                    >
                        Create first version
                    </button>
                </div>
            )}
        </div>
    );
}

export default StrategyVersions;
