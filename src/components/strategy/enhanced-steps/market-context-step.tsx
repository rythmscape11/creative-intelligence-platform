'use client';

import {
  EnhancedStrategyInput,
  MARKET_MATURITY_LEVELS,
  COMPETITIVE_LANDSCAPES,
  GEOGRAPHIC_SCOPES,
} from '@/lib/validations/enhanced-strategy';

interface Props {
  data: Partial<EnhancedStrategyInput>;
  onChange: (data: Partial<EnhancedStrategyInput>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EnhancedMarketContextStep({ data, onChange, onNext, onBack }: Props) {
  const handleChange = (field: keyof EnhancedStrategyInput, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Market Context</h2>
        <p className="text-gray-300">Help us understand your market environment</p>
      </div>

      {/* Target Market Maturity */}
      <div>
        <label htmlFor="targetMarketMaturity" className="block text-sm font-medium text-gray-300 mb-2">
          Target Market Maturity <span className="text-red-500">*</span>
        </label>
        <select
          id="targetMarketMaturity"
          value={data.targetMarketMaturity || ''}
          onChange={(e) => handleChange('targetMarketMaturity', e.target.value)}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          required
        >
          <option value="" className="bg-black text-white">Select market maturity...</option>
          {MARKET_MATURITY_LEVELS.map((level) => (
            <option key={level.value} value={level.value} className="bg-black text-white">
              {level.label}
            </option>
          ))}
        </select>
        {data.targetMarketMaturity && (
          <p className="mt-2 text-sm text-gray-300">
            {MARKET_MATURITY_LEVELS.find(l => l.value === data.targetMarketMaturity)?.description}
          </p>
        )}
      </div>

      {/* Competitive Landscape */}
      <div>
        <label htmlFor="competitiveLandscape" className="block text-sm font-medium text-gray-300 mb-2">
          Competitive Landscape <span className="text-red-500">*</span>
        </label>
        <select
          id="competitiveLandscape"
          value={data.competitiveLandscape || ''}
          onChange={(e) => handleChange('competitiveLandscape', e.target.value)}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          required
        >
          <option value="" className="bg-black text-white">Select competitive landscape...</option>
          {COMPETITIVE_LANDSCAPES.map((landscape) => (
            <option key={landscape.value} value={landscape.value} className="bg-black text-white">
              {landscape.label}
            </option>
          ))}
        </select>
        {data.competitiveLandscape && (
          <p className="mt-2 text-sm text-gray-300">
            {COMPETITIVE_LANDSCAPES.find(l => l.value === data.competitiveLandscape)?.description}
          </p>
        )}
      </div>

      {/* Geographic Scope */}
      <div>
        <label htmlFor="geographicScope" className="block text-sm font-medium text-gray-300 mb-2">
          Geographic Scope <span className="text-red-500">*</span>
        </label>
        <select
          id="geographicScope"
          value={data.geographicScope || ''}
          onChange={(e) => handleChange('geographicScope', e.target.value)}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          required
        >
          <option value="" className="bg-black text-white">Select geographic scope...</option>
          {GEOGRAPHIC_SCOPES.map((scope) => (
            <option key={scope.value} value={scope.value} className="bg-black text-white">
              {scope.label}
            </option>
          ))}
        </select>
        {data.geographicScope && (
          <p className="mt-2 text-sm text-gray-300">
            {GEOGRAPHIC_SCOPES.find(s => s.value === data.geographicScope)?.description}
          </p>
        )}
      </div>

      {/* Market Intelligence Integration */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex items-center h-5">
            <input
              id="includeMarketIntelligence"
              type="checkbox"
              checked={data.includeMarketIntelligence || false}
              onChange={(e) => handleChange('includeMarketIntelligence', e.target.checked)}
              className="w-4 h-4 text-[#F59E0B] border-gray-300 rounded focus:ring-[#F59E0B] bg-black"
            />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor="includeMarketIntelligence" className="font-medium text-white">
              Include Market Intelligence Data
            </label>
            <p className="text-gray-400">
              Automatically fetch and analyze live competitor data and industry news to enhance your strategy.
            </p>
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-300 mb-2">
          Target Audience <span className="text-red-500">*</span>
        </label>
        <textarea
          id="targetAudience"
          value={data.targetAudience || ''}
          onChange={(e) => handleChange('targetAudience', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          placeholder="Describe your target audience in detail (e.g., demographics, psychographics, pain points, behaviors)"
          required
          minLength={10}
        />
        <p className="mt-2 text-sm text-gray-300">
          Minimum 10 characters. Be specific about who you're targeting (age, location, interests, challenges, etc.)
        </p>
        {data.targetAudience && data.targetAudience.length < 10 && (
          <p className="mt-1 text-sm text-red-600">
            Target audience description must be at least 10 characters ({data.targetAudience.length}/10)
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
          disabled={
            !data.targetMarketMaturity ||
            !data.competitiveLandscape ||
            !data.geographicScope ||
            !data.targetAudience ||
            (data.targetAudience?.length ?? 0) < 10
          }
          className="px-6 py-3 bg-[#F59E0B] text-white rounded-lg font-medium hover:bg-[#F59E0B]/90 disabled:bg-[#2A2A2A] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
        >
          Continue to Objectives →
        </button>
      </div>
    </div>
  );
}

