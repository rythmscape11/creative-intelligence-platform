'use client';

import { useState } from 'react';
import {
  EnhancedStrategyInput,
  TIMEFRAMES,
  TEAM_SIZES,
  MARKETING_MATURITY_LEVELS,
} from '@/lib/validations/enhanced-strategy';

interface Props {
  data: Partial<EnhancedStrategyInput>;
  onChange: (data: Partial<EnhancedStrategyInput>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EnhancedResourcesStep({ data, onChange, onNext, onBack }: Props) {
  const [budgetDisplay, setBudgetDisplay] = useState(data.budget?.toLocaleString() || '10,000');

  const handleChange = (field: keyof EnhancedStrategyInput, value: any) => {
    onChange({ [field]: value });
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    handleChange('budget', value);
    setBudgetDisplay(value.toLocaleString());
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Resources & Timeline</h2>
        <p className="text-gray-300">Tell us about your budget, team, and timeline</p>
      </div>

      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
          Marketing Budget (USD) <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300">$1,000</span>
            <input
              type="range"
              id="budget"
              min="1000"
              max="1000000"
              step="1000"
              value={data.budget || 10000}
              onChange={handleBudgetChange}
              className="flex-1 h-2 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-accent-secondary"
            />
            <span className="text-sm text-gray-300">$1,000,000</span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-[#F59E0B]">${budgetDisplay}</span>
            <p className="text-sm text-gray-300 mt-1">
              {data.budget && data.budget < 10000 && 'Micro budget - Focus on organic channels'}
              {data.budget && data.budget >= 10000 && data.budget < 50000 && 'Small budget - Mix of organic and paid'}
              {data.budget && data.budget >= 50000 && data.budget < 100000 && 'Medium budget - Balanced multi-channel approach'}
              {data.budget && data.budget >= 100000 && data.budget < 500000 && 'Large budget - Comprehensive strategy'}
              {data.budget && data.budget >= 500000 && 'Enterprise budget - Full-scale marketing program'}
            </p>
          </div>
        </div>
      </div>

      {/* Timeframe */}
      <div>
        <label htmlFor="timeframe" className="block text-sm font-medium text-gray-300 mb-2">
          Strategy Timeframe <span className="text-red-500">*</span>
        </label>
        <select
          id="timeframe"
          value={data.timeframe || ''}
          onChange={(e) => handleChange('timeframe', e.target.value)}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          required
        >
          <option value="" className="bg-black text-white">Select timeframe...</option>
          {TIMEFRAMES.map((timeframe) => (
            <option key={timeframe.value} value={timeframe.value} className="bg-black text-white">
              {timeframe.label}
            </option>
          ))}
        </select>
        {data.timeframe && (
          <p className="mt-2 text-sm text-gray-300">
            {TIMEFRAMES.find(t => t.value === data.timeframe)?.description}
          </p>
        )}
      </div>

      {/* Team Size */}
      <div>
        <label htmlFor="teamSize" className="block text-sm font-medium text-gray-300 mb-2">
          Marketing Team Size <span className="text-red-500">*</span>
        </label>
        <select
          id="teamSize"
          value={data.teamSize || ''}
          onChange={(e) => handleChange('teamSize', e.target.value)}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          required
        >
          <option value="" className="bg-black text-white">Select team size...</option>
          {TEAM_SIZES.map((size) => (
            <option key={size.value} value={size.value} className="bg-black text-white">
              {size.label}
            </option>
          ))}
        </select>
        {data.teamSize && (
          <p className="mt-2 text-sm text-gray-300">
            {TEAM_SIZES.find(s => s.value === data.teamSize)?.description}
          </p>
        )}
      </div>

      {/* Marketing Maturity */}
      <div>
        <label htmlFor="marketingMaturity" className="block text-sm font-medium text-gray-300 mb-2">
          Marketing Maturity Level <span className="text-red-500">*</span>
        </label>
        <select
          id="marketingMaturity"
          value={data.marketingMaturity || ''}
          onChange={(e) => handleChange('marketingMaturity', e.target.value)}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          required
        >
          <option value="" className="bg-black text-white">Select marketing maturity...</option>
          {MARKETING_MATURITY_LEVELS.map((level) => (
            <option key={level.value} value={level.value} className="bg-black text-white">
              {level.label}
            </option>
          ))}
        </select>
        {data.marketingMaturity && (
          <p className="mt-2 text-sm text-gray-300">
            {MARKETING_MATURITY_LEVELS.find(l => l.value === data.marketingMaturity)?.description}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between pt-6 border-t border-[#2A2A2A] gap-4 sm:gap-0">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-[#2A2A2A] text-gray-300 rounded-lg font-medium hover:bg-[#3A3A3A] hover:text-white transition-colors w-full sm:w-auto"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.budget || data.budget < 1000 || !data.timeframe || !data.teamSize || !data.marketingMaturity}
          className="px-6 py-3 bg-[#F59E0B] text-white rounded-lg font-medium hover:bg-[#F59E0B]/90 disabled:bg-[#2A2A2A] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
        >
          Continue to Channels →
        </button>
      </div>
    </div>
  );
}

