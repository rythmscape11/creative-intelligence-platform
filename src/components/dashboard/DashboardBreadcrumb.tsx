'use client';

/**
 * Dashboard Breadcrumb
 * 
 * Simple breadcrumb navigation for dashboard detail pages.
 * Uses existing UI patterns.
 */

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface DashboardBreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function DashboardBreadcrumb({ items, className = '' }: DashboardBreadcrumbProps) {
    return (
        <nav
            className={`flex items-center text-sm text-muted-foreground mb-4 ${className}`}
            aria-label="Breadcrumb"
        >
            <Link
                href="/dashboard"
                className="flex items-center hover:text-foreground transition-colors"
            >
                <Home className="h-4 w-4" />
                <span className="sr-only">Dashboard</span>
            </Link>

            {items.map((item, index) => (
                <span key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-2" />
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
