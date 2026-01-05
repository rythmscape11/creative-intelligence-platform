'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    ChevronUpDownIcon,
    PlusIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export interface Client {
    id: string;
    name: string;
    logo?: string;
    industry?: string;
    status: 'active' | 'inactive' | 'pending';
    lastActive?: Date;
    strategiesCount?: number;
}

interface MultiClientSwitcherProps {
    clients: Client[];
    currentClientId?: string;
    onSwitch: (clientId: string) => void;
    onCreateNew?: () => void;
    className?: string;
}

export function MultiClientSwitcher({
    clients,
    currentClientId,
    onSwitch,
    onCreateNew,
    className = ''
}: MultiClientSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentClient = clients.find(c => c.id === currentClientId);

    // Filter clients by search
    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.industry?.toLowerCase().includes(search.toLowerCase())
    );

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setSearch('');
        }
    };

    const handleSwitch = (clientId: string) => {
        onSwitch(clientId);
        setIsOpen(false);
        setSearch('');
    };

    const getStatusColor = (status: Client['status']) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'inactive': return 'bg-gray-500';
            case 'pending': return 'bg-amber-500';
        }
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                className="flex items-center gap-3 w-full px-3 py-2 bg-bg-secondary border border-border-primary rounded-lg hover:border-border-secondary transition-colors"
            >
                {/* Client Avatar/Logo */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-semibold text-sm">
                    {currentClient ? (
                        currentClient.logo ? (
                            <img src={currentClient.logo} alt={currentClient.name} className="w-full h-full rounded-lg object-cover" />
                        ) : (
                            currentClient.name.charAt(0).toUpperCase()
                        )
                    ) : (
                        <BuildingOfficeIcon className="w-4 h-4" />
                    )}
                </div>

                {/* Client Info */}
                <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                        {currentClient?.name || 'Select Client'}
                    </p>
                    {currentClient?.industry && (
                        <p className="text-xs text-text-tertiary truncate">{currentClient.industry}</p>
                    )}
                </div>

                {/* Status Indicator */}
                {currentClient && (
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(currentClient.status)}`} />
                )}

                {/* Chevron */}
                <ChevronUpDownIcon className="w-5 h-5 text-text-tertiary" />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-bg-secondary border border-border-primary rounded-xl shadow-xl z-50 overflow-hidden">
                    {/* Search */}
                    <div className="p-2 border-b border-border-primary">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Client List */}
                    <div className="max-h-64 overflow-y-auto">
                        {filteredClients.length > 0 ? (
                            filteredClients.map(client => (
                                <button
                                    key={client.id}
                                    onClick={() => handleSwitch(client.id)}
                                    className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-bg-tertiary transition-colors ${client.id === currentClientId ? 'bg-bg-tertiary' : ''
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center text-accent-primary font-semibold">
                                        {client.logo ? (
                                            <img src={client.logo} alt={client.name} className="w-full h-full rounded-lg object-cover" />
                                        ) : (
                                            client.name.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text-primary truncate">{client.name}</p>
                                        <div className="flex items-center gap-2">
                                            {client.industry && (
                                                <span className="text-xs text-text-tertiary">{client.industry}</span>
                                            )}
                                            {client.strategiesCount !== undefined && (
                                                <span className="text-xs text-text-tertiary">
                                                    • {client.strategiesCount} strategies
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status & Check */}
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(client.status)}`} />
                                        {client.id === currentClientId && (
                                            <CheckIcon className="w-5 h-5 text-accent-primary" />
                                        )}
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center text-text-tertiary">
                                No clients found
                            </div>
                        )}
                    </div>

                    {/* Add New Client */}
                    {onCreateNew && (
                        <div className="border-t border-border-primary p-2">
                            <button
                                onClick={() => {
                                    onCreateNew();
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add New Client
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/**
 * Quick client status badge
 */
export function ClientStatusBadge({ status }: { status: Client['status'] }) {
    const config = {
        active: { color: 'bg-green-500/20 text-green-400', label: 'Active' },
        inactive: { color: 'bg-gray-500/20 text-gray-400', label: 'Inactive' },
        pending: { color: 'bg-amber-500/20 text-amber-400', label: 'Pending' }
    };

    const { color, label } = config[status];

    return (
        <span className={`px-2 py-0.5 text-xs rounded-full ${color}`}>
            {label}
        </span>
    );
}

export default MultiClientSwitcher;
