'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if items not provided
  const breadcrumbs = items || generateBreadcrumbs(pathname);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      {/* Home link */}
      <Link
        href="/"
        className="flex items-center text-text-secondary hover:text-accent-secondary transition-colors"
        aria-label="Home"
      >
        <HomeIcon className="h-4 w-4" />
      </Link>

      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return (
          <div key={item.href} className="flex items-center space-x-2">
            <ChevronRightIcon className="h-4 w-4 text-text-tertiary" aria-hidden="true" />
            {isLast ? (
              <span
                className="font-medium text-text-primary"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-text-secondary hover:text-accent-secondary transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Remove leading and trailing slashes
  const path = pathname.replace(/^\/|\/$/g, '');
  
  if (!path) {
    return [];
  }

  const segments = path.split('/');
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  // Define custom labels for common routes
  const labelMap: Record<string, string> = {
    'admin': 'Admin Panel',
    'blog': 'Blog',
    'strategy': 'Strategy Builder',
    'growth-suite': 'Growth Suite',
    'seo': 'SEO Tools',
    'competitors': 'Competitor Analysis',
    'attribution': 'Attribution',
    'experiments': 'A/B Testing',
    'heatmaps': 'Heatmaps',
    'repurposer': 'Content Repurposer',
    'widgets': 'Conversion Widgets',
    'dashboard': 'Dashboard',
    'pricing': 'Pricing',
    'about': 'About Us',
    'contact': 'Contact',
    'careers': 'Careers',
    'docs': 'Documentation',
    'help': 'Help Center',
    'community': 'Community',
    'status': 'Status',
    'api-docs': 'API Documentation',
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'cookies': 'Cookie Policy',
    'gdpr': 'GDPR',
    'templates': 'Templates',
    'demo': 'Demo',
    'edit': 'Edit',
    'create': 'Create',
    'new': 'New',
    'integrations': 'Integrations',
    'mailchimp': 'Mailchimp',
    'sync': 'Bulk Sync',
    'users': 'Users',
    'analytics': 'Analytics',
    'activity': 'Activity',
    'tracking': 'Tracking',
    'settings': 'Settings',
    'strategies': 'Strategies',
  };

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip dynamic route segments (those starting with [ or containing IDs)
    if (segment.startsWith('[') || /^[a-f0-9]{20,}$/i.test(segment)) {
      return;
    }

    // Get label from map or capitalize segment
    const label = labelMap[segment] || segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

