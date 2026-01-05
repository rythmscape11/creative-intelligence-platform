/**
 * Feature Badge Component
 * 
 * Displays badges for role-restricted and plan-restricted features
 * Provides visual indicators for premium features and access requirements
 */

import { Crown, Shield, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FeatureBadgeType = 
  | 'admin-only'      // ADMIN role required
  | 'editor-plus'     // EDITOR or ADMIN role required
  | 'pro-plan'        // PRO plan or higher required
  | 'team-plan'       // TEAM plan or higher required
  | 'enterprise'      // ENTERPRISE plan required
  | 'premium';        // Generic premium feature

interface FeatureBadgeProps {
  type: FeatureBadgeType;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const badgeConfig: Record<FeatureBadgeType, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colors: {
    bg: string;
    text: string;
    border: string;
  };
}> = {
  'admin-only': {
    label: 'Admin Only',
    icon: Shield,
    colors: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
    },
  },
  'editor-plus': {
    label: 'Editor+',
    icon: Shield,
    colors: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
    },
  },
  'pro-plan': {
    label: 'Pro Plan',
    icon: Crown,
    colors: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
    },
  },
  'team-plan': {
    label: 'Team Plan',
    icon: Crown,
    colors: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/20',
    },
  },
  'enterprise': {
    label: 'Enterprise',
    icon: Sparkles,
    colors: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
    },
  },
  'premium': {
    label: 'Premium',
    icon: Lock,
    colors: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/20',
    },
  },
};

const sizeClasses = {
  sm: {
    container: 'px-1.5 py-0.5 text-xs',
    icon: 'h-3 w-3',
  },
  md: {
    container: 'px-2 py-1 text-sm',
    icon: 'h-3.5 w-3.5',
  },
  lg: {
    container: 'px-3 py-1.5 text-base',
    icon: 'h-4 w-4',
  },
};

export function FeatureBadge({ 
  type, 
  className, 
  showIcon = true,
  size = 'sm',
}: FeatureBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;
  const sizeClass = sizeClasses[size];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium border',
        config.colors.bg,
        config.colors.text,
        config.colors.border,
        sizeClass.container,
        className
      )}
    >
      {showIcon && <Icon className={sizeClass.icon} />}
      {config.label}
    </span>
  );
}

/**
 * Feature Lock Overlay Component
 * 
 * Displays a lock overlay on disabled features with upgrade CTA
 */

interface FeatureLockOverlayProps {
  type: FeatureBadgeType;
  title: string;
  description?: string;
  upgradeUrl?: string;
  className?: string;
}

export function FeatureLockOverlay({
  type,
  title,
  description,
  upgradeUrl = '/pricing',
  className,
}: FeatureLockOverlayProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'absolute inset-0 bg-bg-primary/95 backdrop-blur-sm rounded-lg',
        'flex flex-col items-center justify-center p-6 text-center',
        'border-2 border-dashed',
        config.colors.border,
        className
      )}
    >
      <div className={cn(
        'rounded-full p-3 mb-3',
        config.colors.bg
      )}>
        <Icon className={cn('h-6 w-6', config.colors.text)} />
      </div>
      
      <h3 className="text-lg font-semibold text-text-primary mb-1">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-text-secondary mb-4 max-w-xs">
          {description}
        </p>
      )}
      
      <FeatureBadge type={type} size="md" className="mb-3" />
      
      <a
        href={upgradeUrl}
        className={cn(
          'px-4 py-2 rounded-lg font-medium text-sm transition-all',
          'bg-accent-highlight text-white hover:bg-blue-600',
          'hover:scale-105 shadow-lg hover:shadow-xl'
        )}
      >
        {type.includes('plan') ? 'Upgrade Plan' : 'Contact Admin'}
      </a>
    </div>
  );
}

/**
 * Feature Tooltip Component
 * 
 * Displays a tooltip explaining feature access requirements
 */

interface FeatureTooltipProps {
  type: FeatureBadgeType;
  children: React.ReactNode;
  className?: string;
}

export function FeatureTooltip({
  type,
  children,
  className,
}: FeatureTooltipProps) {
  const config = badgeConfig[type];

  const tooltipText: Record<FeatureBadgeType, string> = {
    'admin-only': 'This feature requires Administrator access. Contact your system admin for access.',
    'editor-plus': 'This feature requires Editor or Administrator role.',
    'pro-plan': 'This feature is available on the Pro plan and higher. Upgrade to unlock.',
    'team-plan': 'This feature is available on the Team plan and higher. Upgrade to unlock.',
    'enterprise': 'This feature is available on the Enterprise plan. Contact sales for details.',
    'premium': 'This is a premium feature. Upgrade your plan to unlock.',
  };

  return (
    <div className={cn('group relative inline-block', className)}>
      {children}
      <div className={cn(
        'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
        'hidden group-hover:block z-50',
        'w-64 p-3 rounded-lg shadow-xl',
        'bg-bg-tertiary border border-border-primary',
        'text-sm text-text-secondary'
      )}>
        <div className="flex items-start gap-2">
          <config.icon className={cn('h-4 w-4 flex-shrink-0 mt-0.5', config.colors.text)} />
          <p>{tooltipText[type]}</p>
        </div>
        {/* Arrow */}
        <div className={cn(
          'absolute top-full left-1/2 -translate-x-1/2 -mt-px',
          'border-8 border-transparent border-t-bg-tertiary'
        )} />
      </div>
    </div>
  );
}

/**
 * Disabled Feature Card Component
 * 
 * Displays a card for a disabled feature with upgrade CTA
 */

interface DisabledFeatureCardProps {
  type: FeatureBadgeType;
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  upgradeUrl?: string;
  className?: string;
}

export function DisabledFeatureCard({
  type,
  title,
  description,
  icon: Icon,
  upgradeUrl = '/pricing',
  className,
}: DisabledFeatureCardProps) {
  const config = badgeConfig[type];

  return (
    <div
      className={cn(
        'relative p-6 rounded-lg border-2 border-dashed',
        'bg-bg-secondary/50',
        config.colors.border,
        'opacity-60 hover:opacity-80 transition-opacity',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={cn(
            'rounded-lg p-3',
            config.colors.bg
          )}>
            <Icon className={cn('h-6 w-6', config.colors.text)} />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-text-primary">
              {title}
            </h3>
            <FeatureBadge type={type} size="sm" />
          </div>
          
          <p className="text-sm text-text-secondary mb-4">
            {description}
          </p>
          
          <a
            href={upgradeUrl}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-lg',
              'font-medium text-sm transition-all',
              config.colors.bg,
              config.colors.text,
              'hover:scale-105'
            )}
          >
            {type.includes('plan') ? (
              <>
                <Crown className="h-4 w-4" />
                Upgrade to Unlock
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Request Access
              </>
            )}
          </a>
        </div>
      </div>
    </div>
  );
}

