'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import {
    DocumentTextIcon,
    WrenchScrewdriverIcon,
    NewspaperIcon,
    UserGroupIcon,
    CogIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchResult {
    id: string;
    title: string;
    description: string;
    type: 'strategy' | 'tool' | 'blog' | 'page' | 'setting';
    url: string;
    icon?: React.ElementType;
}

// Define searchable items
const SEARCHABLE_ITEMS: SearchResult[] = [
    // Pages
    { id: 'dashboard', title: 'Dashboard', description: 'Main dashboard overview', type: 'page', url: '/dashboard', icon: DocumentTextIcon },
    { id: 'analytics', title: 'Analytics', description: 'View usage analytics', type: 'page', url: '/dashboard/analytics', icon: DocumentTextIcon },
    { id: 'team', title: 'Team Management', description: 'Manage team members', type: 'page', url: '/dashboard/team', icon: UserGroupIcon },
    { id: 'exports', title: 'Export History', description: 'View exported documents', type: 'page', url: '/dashboard/exports', icon: DocumentTextIcon },
    { id: 'strategies', title: 'My Strategies', description: 'View all strategies', type: 'page', url: '/dashboard/strategies', icon: DocumentTextIcon },
    { id: 'create-strategy', title: 'Create Strategy', description: 'Generate new AI strategy', type: 'page', url: '/dashboard/strategies/create', icon: DocumentTextIcon },

    // Agency
    { id: 'agency-branding', title: 'Agency Branding', description: 'Customize agency branding', type: 'setting', url: '/dashboard/agency-branding', icon: CogIcon },
    { id: 'agency-os', title: 'Agency OS Guide', description: 'Agency setup guide', type: 'page', url: '/dashboard/agency-os', icon: DocumentTextIcon },

    // Tools
    { id: 'roi-calculator', title: 'ROI Calculator', description: 'Calculate marketing ROI', type: 'tool', url: '/tools/advertising/roi-calculator', icon: WrenchScrewdriverIcon },
    { id: 'budget-allocator', title: 'Budget Allocator', description: 'Optimize budget distribution', type: 'tool', url: '/tools/advertising/budget-allocator', icon: WrenchScrewdriverIcon },
    { id: 'headline-analyzer', title: 'Headline Analyzer', description: 'Analyze headline effectiveness', type: 'tool', url: '/tools/content/headline-analyzer', icon: WrenchScrewdriverIcon },
    { id: 'keyword-research', title: 'Keyword Research', description: 'Find SEO keywords', type: 'tool', url: '/tools/seo/keyword-research', icon: WrenchScrewdriverIcon },
    { id: 'hashtag-generator', title: 'Hashtag Generator', description: 'Generate social media hashtags', type: 'tool', url: '/tools/social/hashtag-generator', icon: WrenchScrewdriverIcon },
    { id: 'email-preview', title: 'Email Preview', description: 'Preview email templates', type: 'tool', url: '/tools/email/email-preview', icon: WrenchScrewdriverIcon },

    // Blog
    { id: 'blog', title: 'Blog', description: 'Marketing insights & guides', type: 'blog', url: '/blog', icon: NewspaperIcon },

    // Settings
    { id: 'settings', title: 'Settings', description: 'Account settings', type: 'setting', url: '/dashboard/settings', icon: CogIcon },
    { id: 'pricing', title: 'Pricing', description: 'View subscription plans', type: 'page', url: '/pricing', icon: DocumentTextIcon },
];

interface GlobalSearchProps {
    className?: string;
}

export function GlobalSearch({ className = '' }: GlobalSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Search function
    const search = useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const lowerQuery = searchQuery.toLowerCase();
        const filtered = SEARCHABLE_ITEMS.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery)
        );

        setResults(filtered.slice(0, 10));
        setSelectedIndex(0);
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => search(query), 150);
        return () => clearTimeout(timer);
    }, [query, search]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd/Ctrl + K to open
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 100);
            }

            // Escape to close
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                setQuery('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Navigate results with arrow keys
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            router.push(results[selectedIndex].url);
            setIsOpen(false);
            setQuery('');
        }
    };

    const typeColors: Record<string, string> = {
        strategy: 'bg-blue-500/20 text-blue-400',
        tool: 'bg-green-500/20 text-green-400',
        blog: 'bg-purple-500/20 text-purple-400',
        page: 'bg-gray-500/20 text-gray-400',
        setting: 'bg-amber-500/20 text-amber-400'
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => {
                    setIsOpen(true);
                    setTimeout(() => inputRef.current?.focus(), 100);
                }}
                className={`flex items-center gap-2 px-3 py-2 bg-bg-tertiary border border-border-primary rounded-lg text-text-secondary hover:text-text-primary hover:border-border-secondary transition-colors ${className}`}
            >
                <MagnifyingGlassIcon className="h-5 w-5" />
                <span className="hidden md:inline">Search...</span>
                <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 bg-bg-secondary rounded text-xs text-text-tertiary">
                    <span className="text-sm">⌘</span>K
                </kbd>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => {
                            setIsOpen(false);
                            setQuery('');
                        }}
                    />

                    {/* Search Dialog */}
                    <div className="relative w-full max-w-xl mx-4 bg-bg-secondary border border-border-primary rounded-xl shadow-2xl overflow-hidden">
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-primary">
                            <MagnifyingGlassIcon className="h-5 w-5 text-text-tertiary" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search pages, tools, and more..."
                                className="flex-1 bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-none"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="p-1 hover:bg-bg-tertiary rounded"
                                >
                                    <XMarkIcon className="h-4 w-4 text-text-tertiary" />
                                </button>
                            )}
                        </div>

                        {/* Results */}
                        <div className="max-h-96 overflow-y-auto">
                            {results.length > 0 ? (
                                <div className="py-2">
                                    {results.map((result, index) => {
                                        const Icon = result.icon || DocumentTextIcon;
                                        return (
                                            <Link
                                                key={result.id}
                                                href={result.url}
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setQuery('');
                                                }}
                                                className={`flex items-center gap-3 px-4 py-3 hover:bg-bg-tertiary cursor-pointer ${index === selectedIndex ? 'bg-bg-tertiary' : ''
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 ${typeColors[result.type]} rounded-lg flex items-center justify-center`}>
                                                    <Icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-text-primary truncate">{result.title}</p>
                                                    <p className="text-sm text-text-secondary truncate">{result.description}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 text-xs rounded ${typeColors[result.type]}`}>
                                                    {result.type}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : query ? (
                                <div className="py-8 text-center text-text-secondary">
                                    No results found for "{query}"
                                </div>
                            ) : (
                                <div className="py-4 px-4">
                                    <p className="text-xs text-text-tertiary uppercase tracking-wide mb-2">Quick Actions</p>
                                    <div className="space-y-1">
                                        {SEARCHABLE_ITEMS.slice(0, 5).map(item => {
                                            const Icon = item.icon || DocumentTextIcon;
                                            return (
                                                <Link
                                                    key={item.id}
                                                    href={item.url}
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        setQuery('');
                                                    }}
                                                    className="flex items-center gap-3 px-3 py-2 hover:bg-bg-tertiary rounded-lg"
                                                >
                                                    <Icon className="h-4 w-4 text-text-tertiary" />
                                                    <span className="text-text-primary">{item.title}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-4 py-2 border-t border-border-primary text-xs text-text-tertiary">
                            <span>
                                <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">↑↓</kbd> to navigate
                            </span>
                            <span>
                                <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">Enter</kbd> to select
                            </span>
                            <span>
                                <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded">Esc</kbd> to close
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default GlobalSearch;
