'use client';

import { Sparkles, Lock, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface UpgradePromptProps {
  variant?: 'inline' | 'card' | 'banner' | 'modal';
  feature?: 'save' | 'pdf' | 'ai' | 'history' | 'team';
  title?: string;
  description?: string;
  className?: string;
  onClose?: () => void;
}

const FEATURE_CONFIG = {
  save: {
    icon: Sparkles,
    title: 'Save Your Results',
    description: 'Upgrade to Pro to save unlimited results and access them anytime.',
    benefit: 'Never lose your work again',
  },
  pdf: {
    icon: Zap,
    title: 'Premium PDF Exports',
    description: 'Create beautiful, branded PDF reports with Pro.',
    benefit: 'Look professional, win more clients',
  },
  ai: {
    icon: TrendingUp,
    title: 'AI-Powered Recommendations',
    description: 'Get intelligent insights to improve your marketing with Pro.',
    benefit: 'Boost your ROI by 40% on average',
  },
  history: {
    icon: Sparkles,
    title: 'Complete History',
    description: 'Track your progress over time with full access to all past analyses.',
    benefit: 'See your improvement over time',
  },
  team: {
    icon: Sparkles,
    title: 'Team Collaboration',
    description: 'Work together with your team in shared workspaces.',
    benefit: 'Collaborate seamlessly',
  },
};

export function UpgradePrompt({
  variant = 'card',
  feature = 'save',
  title,
  description,
  className = '',
  onClose,
}: UpgradePromptProps) {
  const config = FEATURE_CONFIG[feature];
  const Icon = config.icon;

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-lg ${className}`}>
        <Lock className="w-5 h-5 text-primary flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-text-primary">
            {title || config.title}
          </p>
          <p className="text-xs text-text-secondary">
            {description || config.description}
          </p>
        </div>
        <Link href="/pricing">
          <Button size="sm" variant="default">
            Upgrade
          </Button>
        </Link>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`relative bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-lg p-4 ${className}`}>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-text-tertiary hover:text-text-primary"
          >
            ×
          </button>
        )}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-text-primary mb-1">
              {title || config.title}
            </h4>
            <p className="text-sm text-text-secondary">
              {description || config.description}
            </p>
          </div>
          <Link href="/pricing">
            <Button size="sm">
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="relative w-full max-w-md bg-bg-secondary border border-border-primary rounded-xl p-8">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary"
            >
              ×
            </button>
          )}
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              {title || config.title}
            </h3>
            
            <p className="text-text-secondary mb-6">
              {description || config.description}
            </p>
            
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-primary">
                ✨ {config.benefit}
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Link href="/pricing">
                <Button className="w-full" size="lg">
                  Upgrade to Pro
                </Button>
              </Link>
              {onClose && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onClose}
                >
                  Maybe Later
                </Button>
              )}
            </div>
            
            <p className="text-xs text-text-tertiary mt-4">
              14-day free trial • No credit card required
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={`bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border-primary rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        
        <div className="flex-1">
          <h4 className="text-lg font-bold text-text-primary mb-2">
            {title || config.title}
          </h4>
          
          <p className="text-text-secondary mb-4">
            {description || config.description}
          </p>
          
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 mb-4">
            <p className="text-sm font-medium text-primary">
              ✨ {config.benefit}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link href="/pricing">
              <Button>
                Upgrade to Pro
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-text-tertiary mt-3">
            14-day free trial • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}

