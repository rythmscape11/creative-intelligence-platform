'use client';

import { ReactNode } from 'react';

export interface AdminCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  variant?: 'default' | 'blue' | 'mint' | 'lavender' | 'peach' | 'sage';
  className?: string;
}

export function AdminCard({
  title,
  description,
  children,
  actions,
  variant = 'default',
  className = '',
}: AdminCardProps) {
  const variantClasses = {
    default: 'glass-card',
    blue: 'card-pastel-blue',
    mint: 'card-pastel-mint',
    lavender: 'card-pastel-lavender',
    peach: 'card-pastel-peach',
    sage: 'card-pastel-sage',
  };

  return (
    <div className={`card ${variantClasses[variant]} ${className}`}>
      {(title || description || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && (
              <h3
                className="text-lg font-bold mb-1"
                style={{ color: 'var(--color-neutral-charcoal)' }}
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                className="text-sm"
                style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.7 }}
              >
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'blue' | 'mint' | 'lavender' | 'peach' | 'sage';
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down';
  };
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = 'blue',
  trend,
}: StatCardProps) {
  const variantColors = {
    blue: 'var(--color-primary-yellow)',
    mint: 'var(--color-primary-yellow)',
    lavender: 'var(--color-accent-amber)',
    peach: 'var(--color-secondary-peach)',
    sage: 'var(--color-primary-yellow)',
  };

  const variantClasses = {
    blue: 'card-pastel-blue',
    mint: 'card-pastel-mint',
    lavender: 'card-pastel-lavender',
    peach: 'card-pastel-peach',
    sage: 'card-pastel-sage',
  };

  return (
    <div className={`card ${variantClasses[variant]} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-sm font-medium"
          style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.7 }}
        >
          {title}
        </h3>
        {icon && <div style={{ color: variantColors[variant] }}>{icon}</div>}
      </div>
      <p className="text-3xl font-bold mb-2" style={{ color: variantColors[variant] }}>
        {value}
      </p>
      {subtitle && (
        <p
          className="text-xs"
          style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}
        >
          {subtitle}
        </p>
      )}
      {trend && (
        <div className="mt-2 flex items-center gap-1">
          {trend.direction === 'up' ? (
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
          <span
            className={`text-xs font-medium ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}
          >
            {trend.value}%
          </span>
          <span className="text-xs" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}>
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="card glass-card p-12">
      <div className="text-center max-w-md mx-auto">
        {icon && (
          <div className="mb-4 flex justify-center" style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.3 }}>
            {icon}
          </div>
        )}
        <h3
          className="text-lg font-bold mb-2"
          style={{ color: 'var(--color-neutral-charcoal)' }}
        >
          {title}
        </h3>
        {description && (
          <p
            className="mb-6"
            style={{ color: 'var(--color-neutral-charcoal)', opacity: 0.6 }}
          >
            {description}
          </p>
        )}
        {action && (
          <button onClick={action.onClick} className="btn btn-primary">
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

