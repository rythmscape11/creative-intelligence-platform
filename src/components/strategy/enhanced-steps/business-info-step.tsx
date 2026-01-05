'use client';

import { EnhancedStrategyInput, BUSINESS_TYPES, COMPANY_STAGES } from '@/lib/validations/enhanced-strategy';

interface Props {
  data: Partial<EnhancedStrategyInput>;
  onChange: (data: Partial<EnhancedStrategyInput>) => void;
  onNext: () => void;
}

export function EnhancedBusinessInfoStep({ data, onChange, onNext }: Props) {
  const handleChange = (field: keyof EnhancedStrategyInput, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Business Information</h2>
        <p className="text-gray-600 dark:text-gray-300">Tell us about your business to create a tailored strategy</p>
      </div>

      {/* Business Name */}
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="businessName"
          value={data.businessName || ''}
          onChange={(e) => handleChange('businessName', e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-[#2A2A2A] rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          placeholder="e.g., TechStart Inc."
          required
        />
      </div>

      {/* Industry */}
      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Industry <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="industry"
          value={data.industry || ''}
          onChange={(e) => handleChange('industry', e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-[#2A2A2A] rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          placeholder="e.g., Technology, Healthcare, E-commerce"
          required
        />
      </div>

      {/* Business Type */}
      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Business Type <span className="text-red-500">*</span>
        </label>
        <select
          id="businessType"
          value={data.businessType || ''}
          onChange={(e) => handleChange('businessType', e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-[#2A2A2A] rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          required
        >
          <option value="" className="bg-white dark:bg-black text-gray-900 dark:text-white">Select business type...</option>
          {BUSINESS_TYPES.map((type) => (
            <option key={type.value} value={type.value} className="bg-white dark:bg-black text-gray-900 dark:text-white">
              {type.label}
            </option>
          ))}
        </select>
        {data.businessType && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {BUSINESS_TYPES.find(t => t.value === data.businessType)?.description}
          </p>
        )}
      </div>

      {/* Company Stage */}
      <div>
        <label htmlFor="companyStage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Company Stage <span className="text-red-500">*</span>
        </label>
        <select
          id="companyStage"
          value={data.companyStage || ''}
          onChange={(e) => handleChange('companyStage', e.target.value)}
          className="w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-[#2A2A2A] rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          required
        >
          <option value="" className="bg-white dark:bg-black text-gray-900 dark:text-white">Select company stage...</option>
          {COMPANY_STAGES.map((stage) => (
            <option key={stage.value} value={stage.value} className="bg-white dark:bg-black text-gray-900 dark:text-white">
              {stage.label}
            </option>
          ))}
        </select>
        {data.companyStage && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {COMPANY_STAGES.find(s => s.value === data.companyStage)?.description}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-[#2A2A2A]">
        <button
          onClick={onNext}
          disabled={!data.businessName || !data.industry || !data.businessType || !data.companyStage}
          className="px-6 py-3 bg-[#F59E0B] text-black rounded-lg font-medium hover:bg-[#D97706] disabled:bg-gray-200 dark:disabled:bg-[#2A2A2A] disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Market Context →
        </button>
      </div>
    </div>
  );
}

