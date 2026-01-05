import { Metadata } from 'next';
import Link from 'next/link';
import { StrategiesList } from '@/components/strategy/strategies-list';
import { Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Marketing Strategies | Aureon One',
  description: 'Manage your marketing strategies and campaigns',
};

export default function StrategiesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 animate-fade-in-up hover:border-border-hover transition-all">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Marketing Strategies
            </h1>
            <p className="mt-2 text-text-secondary">
              Create, manage, and export your marketing strategies
            </p>
          </div>
          <Link
            href="/dashboard/strategies/create"
            className="inline-flex items-center px-6 py-3 bg-accent-highlight text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Strategy
          </Link>
        </div>
      </div>

      {/* Strategies List */}
      <StrategiesList />
    </div>
  );
}
