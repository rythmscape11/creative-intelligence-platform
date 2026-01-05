'use client';

import { EnhancedStrategyInput, MARKETING_OBJECTIVES, PRIMARY_KPIS } from '@/lib/validations/enhanced-strategy';

interface Props {
  data: Partial<EnhancedStrategyInput>;
  onChange: (data: Partial<EnhancedStrategyInput>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EnhancedObjectivesStep({ data, onChange, onNext, onBack }: Props) {
  const handleObjectiveToggle = (value: string) => {
    const currentObjectives = data.marketingObjectives || [];
    const newObjectives = currentObjectives.includes(value as any)
      ? currentObjectives.filter(obj => obj !== value)
      : [...currentObjectives, value as any];
    onChange({ marketingObjectives: newObjectives });
  };

  const handleChange = (field: keyof EnhancedStrategyInput, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Marketing Objectives</h2>
        <p className="text-gray-300">Select your primary marketing goals (choose at least one)</p>
      </div>

      {/* Marketing Objectives (Multi-select) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Marketing Objectives <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MARKETING_OBJECTIVES.map((objective) => {
            const isSelected = (data.marketingObjectives || []).includes(objective.value as any);
            return (
              <button
                key={objective.value}
                type="button"
                onClick={() => handleObjectiveToggle(objective.value)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${isSelected
                    ? 'border-[#F59E0B] bg-[#F59E0B]/10'
                    : 'border-[#2A2A2A] hover:border-border-hover bg-black'
                  }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-5 h-5 rounded border-2 mr-3 mt-0.5 flex items-center justify-center ${isSelected ? 'bg-[#F59E0B] border-[#F59E0B]' : 'border-[#2A2A2A]'
                    }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-white">{objective.label}</div>
                    <div className="text-sm text-gray-300 mt-1">{objective.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {(data.marketingObjectives || []).length === 0 && (
          <p className="mt-2 text-sm text-red-600">Please select at least one objective</p>
        )}
      </div>

      {/* Primary KPI */}
      <div>
        <label htmlFor="primaryKPI" className="block text-sm font-medium text-gray-300 mb-2">
          Primary KPI (Key Performance Indicator) <span className="text-red-500">*</span>
        </label>
        <select
          id="primaryKPI"
          value={data.primaryKPI || ''}
          onChange={(e) => handleChange('primaryKPI', e.target.value)}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          required
        >
          <option value="" className="bg-black text-white">Select primary KPI...</option>
          {PRIMARY_KPIS.map((kpi) => (
            <option key={kpi.value} value={kpi.value} className="bg-black text-white">
              {kpi.label}
            </option>
          ))}
        </select>
        {data.primaryKPI && (
          <p className="mt-2 text-sm text-gray-300">
            {PRIMARY_KPIS.find(k => k.value === data.primaryKPI)?.description}
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
          disabled={!data.marketingObjectives || data.marketingObjectives.length === 0 || !data.primaryKPI}
          className="px-6 py-3 bg-[#F59E0B] text-white rounded-lg font-medium hover:bg-[#F59E0B]/90 disabled:bg-[#2A2A2A] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
        >
          Continue to Resources →
        </button>
      </div>
    </div>
  );
}

