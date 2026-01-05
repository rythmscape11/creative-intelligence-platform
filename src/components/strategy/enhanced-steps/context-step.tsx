'use client';

import { EnhancedStrategyInput, CURRENT_CHALLENGES } from '@/lib/validations/enhanced-strategy';

const MARTECH_OPTIONS = [
  { value: 'CRM', label: 'CRM (e.g., Salesforce, HubSpot)' },
  { value: 'MARKETING_AUTOMATION', label: 'Marketing Automation' },
  { value: 'ANALYTICS', label: 'Analytics (e.g., Google Analytics)' },
  { value: 'EMAIL_PLATFORM', label: 'Email Platform (e.g., Mailchimp)' },
  { value: 'SOCIAL_MEDIA_MANAGEMENT', label: 'Social Media Management' },
  { value: 'SEO_TOOLS', label: 'SEO Tools' },
  { value: 'ADVERTISING_PLATFORMS', label: 'Advertising Platforms' },
  { value: 'CONTENT_MANAGEMENT', label: 'Content Management (CMS)' },
  { value: 'CUSTOMER_DATA_PLATFORM', label: 'Customer Data Platform (CDP)' },
  { value: 'ATTRIBUTION_TOOLS', label: 'Attribution Tools' },
] as const;

interface Props {
  data: Partial<EnhancedStrategyInput>;
  onChange: (data: Partial<EnhancedStrategyInput>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function EnhancedContextStep({ data, onChange, onNext, onBack, isSubmitting }: Props) {
  const handleChallengeToggle = (value: string) => {
    const currentChallenges = data.currentChallenges || [];
    const newChallenges = currentChallenges.includes(value as any)
      ? currentChallenges.filter(ch => ch !== value)
      : [...currentChallenges, value as any];
    onChange({ currentChallenges: newChallenges });
  };

  const handleChange = (field: keyof EnhancedStrategyInput, value: any) => {
    onChange({ [field]: value });
  };

  const handleMarTechToggle = (value: string) => {
    const currentMarTech = data.existingMarTech || [];
    const newMarTech = currentMarTech.includes(value as any)
      ? currentMarTech.filter(mt => mt !== value)
      : [...currentMarTech, value as any];
    onChange({ existingMarTech: newMarTech });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Additional Context</h2>
        <p className="text-gray-300">Help us understand your challenges and existing setup (all optional)</p>
      </div>

      {/* Current Challenges (Multi-select) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Current Marketing Challenges (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {CURRENT_CHALLENGES.map((challenge) => {
            const isSelected = (data.currentChallenges || []).includes(challenge.value as any);
            return (
              <button
                key={challenge.value}
                type="button"
                onClick={() => handleChallengeToggle(challenge.value)}
                className={`p-3 border rounded-lg text-left transition-all ${isSelected
                  ? 'border-[#F59E0B] bg-[#F59E0B]/10'
                  : 'border-[#2A2A2A] hover:border-border-hover bg-black'
                  }`}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-4 h-4 rounded border mr-2 flex items-center justify-center ${isSelected ? 'bg-[#F59E0B] border-[#F59E0B]' : 'border-[#2A2A2A]'
                    }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-white">{challenge.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Existing MarTech */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Existing Marketing Tools (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {MARTECH_OPTIONS.map((tool) => {
            const isSelected = (data.existingMarTech || []).includes(tool.value as any);
            return (
              <button
                key={tool.value}
                type="button"
                onClick={() => handleMarTechToggle(tool.value)}
                className={`p-3 border rounded-lg text-left transition-all ${isSelected
                  ? 'border-[#F59E0B] bg-[#F59E0B]/10'
                  : 'border-[#2A2A2A] hover:border-border-hover bg-black'
                  }`}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-4 h-4 rounded border mr-2 flex items-center justify-center ${isSelected ? 'bg-[#F59E0B] border-[#F59E0B]' : 'border-[#2A2A2A]'
                    }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-white">{tool.label}</span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-gray-300">
          {(data.existingMarTech || []).length === 0
            ? 'No tools selected'
            : `${(data.existingMarTech || []).length} tool(s) selected`}
        </p>
      </div>

      {/* Competitor Info */}
      <div>
        <label htmlFor="competitorInfo" className="block text-sm font-medium text-gray-300 mb-2">
          Competitor Information (Optional)
        </label>
        <textarea
          id="competitorInfo"
          value={data.competitorInfo || ''}
          onChange={(e) => handleChange('competitorInfo', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          placeholder="Who are your main competitors? What are they doing well?"
        />
      </div>

      {/* Existing Marketing */}
      <div>
        <label htmlFor="existingMarketing" className="block text-sm font-medium text-gray-300 mb-2">
          Existing Marketing Efforts (Optional)
        </label>
        <textarea
          id="existingMarketing"
          value={data.existingMarketing || ''}
          onChange={(e) => handleChange('existingMarketing', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          placeholder="What marketing activities are you currently doing?"
        />
      </div>

      {/* Past Performance */}
      <div>
        <label htmlFor="pastPerformance" className="block text-sm font-medium text-gray-300 mb-2">
          Past Performance Summary (Optional)
        </label>
        <textarea
          id="pastPerformance"
          value={data.pastPerformance || ''}
          onChange={(e) => handleChange('pastPerformance', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          placeholder="Briefly describe your past marketing performance, wins, and losses."
        />
      </div>

      {/* Seasonality Factors */}
      <div>
        <label htmlFor="seasonalityFactors" className="block text-sm font-medium text-gray-300 mb-2">
          Seasonality Factors (Optional)
        </label>
        <textarea
          id="seasonalityFactors"
          value={data.seasonalityFactors || ''}
          onChange={(e) => handleChange('seasonalityFactors', e.target.value)}
          rows={2}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          placeholder="e.g., Holiday season, back-to-school, summer slowdown"
        />
      </div>

      {/* Regulatory Constraints */}
      <div>
        <label htmlFor="regulatoryConstraints" className="block text-sm font-medium text-gray-300 mb-2">
          Regulatory Constraints (Optional)
        </label>
        <textarea
          id="regulatoryConstraints"
          value={data.regulatoryConstraints || ''}
          onChange={(e) => handleChange('regulatoryConstraints', e.target.value)}
          rows={2}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          placeholder="e.g., GDPR compliance, healthcare regulations, financial services restrictions"
        />
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between pt-6 border-t border-[#2A2A2A] gap-4 sm:gap-0">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#2A2A2A] text-gray-300 rounded-lg font-medium hover:bg-[#3A3A3A] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={isSubmitting}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-[#2A2A2A] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Strategy...
            </>
          ) : (
            <>
              Generate Strategy 🚀
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-white">
              Ready to generate your strategy!
            </h3>
            <div className="mt-2 text-sm text-gray-300">
              <p>
                Click "Generate Strategy" to create your comprehensive marketing strategy.
                This will include 17 detailed sections with actionable recommendations tailored to your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

