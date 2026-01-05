'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Key,
    Workflow,
    Layers,
    ScrollText,
    Palette,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';

interface ForgeNavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

const forgeNavItems: ForgeNavItem[] = [
    { name: 'Overview', href: '/forge', icon: LayoutDashboard },
    { name: 'API Keys', href: '/forge/api-keys', icon: Key },
    { name: 'Flows', href: '/forge/flows', icon: Workflow },
    { name: 'Pipelines', href: '/forge/pipelines', icon: Layers },
    { name: 'Brand Kits', href: '/forge/brand-kits', icon: Palette },
    { name: 'Logs', href: '/forge/logs', icon: ScrollText },
];

export function ForgeSidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/forge') return pathname === '/forge';
        return pathname?.startsWith(href);
    };

    return (
        <nav className="space-y-1 px-3 py-4">
            {/* Back to Dashboard */}
            <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-white/5 border border-white/10 bg-white/5 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>← Back to Dashboard</span>
            </Link>

            <p className="px-3 py-2 text-xs font-semibold text-[#F1C40F] uppercase tracking-wider">
                Forge
            </p>
            {forgeNavItems.map((item) => {
                const active = isActive(item.href);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${active
                                ? 'bg-[#F1C40F]/10 text-[#F1C40F] border border-[#F1C40F]/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }
            `}
                    >
                        <item.icon className={`w-4 h-4 ${active ? 'text-[#F1C40F]' : 'text-gray-500 group-hover:text-gray-300'}`} />
                        <span className="text-sm font-medium">{item.name}</span>
                        {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </Link>
                );
            })}
        </nav>
    );
}
