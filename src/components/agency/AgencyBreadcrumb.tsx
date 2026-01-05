'use client';

/**
 * Agency Breadcrumb
 * 
 * Simple breadcrumb navigation for detail pages.
 * Uses existing UI patterns.
 */

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface AgencyBreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function AgencyBreadcrumb({ items, className = '' }: AgencyBreadcrumbProps) {
    return (
        <nav
            className={`flex items-center text-sm text-zinc-400 mb-4 ${className}`}
            aria-label="Breadcrumb"
        >
            <Link
                href="/agency"
                className="flex items-center hover:text-white transition-colors"
            >
                <Home className="h-4 w-4" />
                <span className="sr-only">Agency Dashboard</span>
            </Link>

            {items.map((item, index) => (
                <span key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-2" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-white transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-zinc-300">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
