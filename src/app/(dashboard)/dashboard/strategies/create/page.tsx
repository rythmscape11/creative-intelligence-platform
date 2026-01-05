import { Metadata } from 'next';
import { EnhancedStrategyBuilder } from '@/components/strategy/enhanced-strategy-builder';

export const metadata: Metadata = {
  title: 'Create Marketing Strategy | Aureon One',
  description: 'Create a comprehensive, director-level marketing strategy with AI-powered insights trained in world-renowned marketing frameworks',
};

export default function CreateStrategyPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">
                  Create Marketing Strategy
                </h1>
                <p className="mt-2 text-text-secondary">
                  Generate a comprehensive, director-level marketing strategy tailored to your business needs
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-lg px-4 py-2">
                  <p className="text-sm font-medium text-accent-secondary">✨ World-Class Frameworks</p>
                  <p className="text-xs text-text-tertiary">17 comprehensive sections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Strategy Builder */}
      <div className="py-8">
        <EnhancedStrategyBuilder />
      </div>
    </div>
  );
}
