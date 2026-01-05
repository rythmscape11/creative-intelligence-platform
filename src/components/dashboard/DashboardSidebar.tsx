'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    Home,
    Briefcase,
    TrendingUp,
    Search,
    Sparkles,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    Users,
    Shield,
    FileText,
    CreditCard,
    History,
    Target,
    Globe,
    Zap,
    Key,
    LineChart,
    Package,
    LayoutGrid,
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { useFeatures } from '@/context/feature-context';
import { FeatureKey } from '@/lib/features';
import { useToolAccess } from '@/hooks/use-tool-access';

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
    featureKey?: FeatureKey;
    description?: string;
}

// Main navigation - simplified, no nested items
const mainNav: NavItem[] = [
    { name: 'Overview', href: '/dashboard', icon: Home },
];

// Product modules - each opens its own dashboard
const productNav: NavItem[] = [
    {
        name: 'Agency OS',
        href: '/dashboard/agency-os',
        icon: Briefcase,
        featureKey: 'agency_os',
        description: 'Manage clients, projects & tasks'
    },
    {
        name: 'Frameworks',
        href: '/dashboard/frameworks',
        icon: Package,
        description: 'Your purchased frameworks'
    },
];

// Tools navigation
const toolsNav: NavItem[] = [
    { name: 'The Optimiser', href: '/dashboard/marketing', icon: TrendingUp, featureKey: 'optimiser' },
    { name: 'The Analyser', href: '/dashboard/competition', icon: Search, featureKey: 'analyser' },
    { name: 'GEO Engine', href: '/dashboard/geo', icon: Sparkles, featureKey: 'geo_engine' },
    { name: 'The Strategiser', href: '/dashboard/strategies', icon: BarChart3, featureKey: 'strategiser' },
    { name: 'Aureon Forge', href: '/forge', icon: Zap, badge: 'BETA' },
];

// Admin navigation
const adminNav: NavItem[] = [
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Leads', href: '/dashboard/admin/leads', icon: Target },
    { name: 'Frameworks', href: '/dashboard/admin/frameworks', icon: Package },
    { name: 'Metrics', href: '/dashboard/admin/metrics', icon: BarChart3 },
    { name: 'Activity Logs', href: '/dashboard/admin/activity', icon: History },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: LineChart },
    { name: 'Billing & MRR', href: '/admin/billing', icon: CreditCard },
    { name: 'Integrations', href: '/dashboard/admin/integrations', icon: Globe },
    { name: 'Strategy Metrics', href: '/dashboard/admin/strategy-metrics', icon: LineChart },
    { name: 'Tracking', href: '/dashboard/admin/tracking', icon: Target },
    { name: 'Governor', href: '/dashboard/admin/governor', icon: Shield },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
    { name: 'API Config', href: '/admin/api-config', icon: Key },
];

const utilityNav: NavItem[] = [
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'My Strategies', href: '/dashboard/strategies', icon: FileText },
];

function AdminNav({ collapsed, NavLink }: { collapsed: boolean; NavLink: React.ComponentType<{ item: NavItem }> }) {
    const { isAdmin } = useToolAccess();

    if (!isAdmin) return null;

    return (
        <div className="pt-6 space-y-1">
            {!collapsed && (
                <p className="px-3 py-2 text-xs font-medium text-amber-500 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Admin
                </p>
            )}
            {adminNav.map((item) => (
                <NavLink key={item.href} item={item} />
            ))}
        </div>
    );
}

interface DashboardSidebarProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    mobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

export function DashboardSidebar({
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const { isVisible, flags } = useFeatures();

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname?.startsWith(href);
    };

    const NavLink = ({ item }: { item: NavItem }) => {
        const active = isActive(item.href);
        const featureStatus = item.featureKey ? flags[item.featureKey] : 'LIVE';

        let badge = item.badge;
        let badgeColor = item.badgeColor;

        if (featureStatus === 'COMING_SOON') {
            badge = 'SOON';
            badgeColor = 'bg-amber-600';
        }

        return (
            <Link
                href={item.href}
                onClick={(e) => {
                    if (featureStatus === 'COMING_SOON') {
                        e.preventDefault();
                    }
                    setMobileOpen(false);
                }}
                className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                    active
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5',
                    featureStatus === 'COMING_SOON' && 'opacity-75'
                )}
            >
                {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#B3001B] rounded-r" />
                )}

                <item.icon className={cn(
                    'w-5 h-5 flex-shrink-0',
                    active ? 'text-[#F1C40F]' : 'text-gray-500 group-hover:text-gray-300'
                )} />

                {!collapsed && (
                    <span className={cn(
                        'text-sm font-medium truncate',
                        active && 'font-semibold'
                    )}>
                        {item.name}
                    </span>
                )}

                {badge && !collapsed && (
                    <span className={cn("ml-auto text-xs text-white px-1.5 py-0.5 rounded-full", badgeColor || 'bg-[#B3001B]')}>
                        {badge}
                    </span>
                )}
            </Link>
        );
    };

    // Product card for major modules
    const ProductCard = ({ item }: { item: NavItem }) => {
        const active = isActive(item.href);
        const featureStatus = item.featureKey ? flags[item.featureKey] : 'LIVE';

        return (
            <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative border',
                    active
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                        : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20',
                    featureStatus === 'COMING_SOON' && 'opacity-75'
                )}
            >
                <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    active ? 'bg-indigo-600' : 'bg-white/10 group-hover:bg-white/20'
                )}>
                    <item.icon className={cn('w-5 h-5', active ? 'text-white' : 'text-gray-400 group-hover:text-white')} />
                </div>

                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <span className={cn('text-sm font-medium block', active && 'font-semibold')}>
                            {item.name}
                        </span>
                        {item.description && (
                            <span className="text-xs text-gray-500 truncate block">
                                {item.description}
                            </span>
                        )}
                    </div>
                )}
            </Link>
        );
    };

    const filterNav = (items: NavItem[]) => items.filter(item => !item.featureKey || isVisible(item.featureKey));

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className={cn(
                'flex items-center h-16 px-4 border-b border-white/5',
                collapsed ? 'justify-center' : 'gap-3'
            )}>
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/brand/aureon-one-icon-gold.svg"
                        alt="Aureon One"
                        width={32}
                        height={32}
                        className="flex-shrink-0"
                    />
                    {!collapsed && (
                        <span className="text-white font-bold text-lg">Aureon One</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto w-full scrollbar-none">
                {/* Main nav */}
                <div className="space-y-1">
                    {filterNav(mainNav).map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                </div>

                {/* Product Modules - Agency OS & Frameworks */}
                <div className="pt-4 space-y-2">
                    {!collapsed && (
                        <p className="px-3 py-2 text-xs font-medium text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                            <LayoutGrid className="w-3 h-3" />
                            Products
                        </p>
                    )}
                    {filterNav(productNav).map((item) => (
                        <ProductCard key={item.href} item={item} />
                    ))}
                </div>

                {/* Tools */}
                <div className="pt-6 space-y-1">
                    {!collapsed && (
                        <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tools
                        </p>
                    )}
                    {filterNav(toolsNav).map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                </div>

                {/* Utilities */}
                <div className="pt-6 space-y-1">
                    {!collapsed && filterNav(utilityNav).length > 0 && (
                        <p className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Utilities
                        </p>
                    )}
                    {filterNav(utilityNav).map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                </div>

                {/* Admin Section */}
                <AdminNav collapsed={collapsed} NavLink={NavLink} />
            </nav>

            {/* User section */}
            <div className={cn(
                'p-4 border-t border-white/5',
                collapsed ? 'flex justify-center' : 'flex items-center gap-3'
            )}>
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: 'w-8 h-8',
                        }
                    }}
                />
                {!collapsed && (
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Account</p>
                        <p className="text-xs text-gray-500 truncate">Manage profile</p>
                    </div>
                )}
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => {
                    setCollapsed(!collapsed);
                    localStorage.setItem('dashboard-sidebar-collapsed', String(!collapsed));
                }}
                className="hidden lg:flex items-center justify-center h-10 border-t border-white/5 text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
            >
                {collapsed ? (
                    <ChevronRight className="w-5 h-5" />
                ) : (
                    <ChevronLeft className="w-5 h-5" />
                )}
            </button>
        </>
    );

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar - Mobile */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-[260px] bg-[#050709] flex flex-col transform transition-transform duration-300 lg:hidden',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {sidebarContent}
            </aside>

            {/* Sidebar - Desktop */}
            <aside
                className={cn(
                    'hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col bg-[#050709] border-r border-white/5 transition-all duration-300',
                    collapsed ? 'w-[72px]' : 'w-[260px]'
                )}
            >
                {sidebarContent}
            </aside>
        </>
    );
}

export default DashboardSidebar;
