'use client';

import {
  EnhancedStrategyInput,
  MARKETING_CHANNELS,
  BRAND_POSITIONING_OPTIONS,
} from '@/lib/validations/enhanced-strategy';

interface Props {
  data: Partial<EnhancedStrategyInput>;
  onChange: (data: Partial<EnhancedStrategyInput>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EnhancedChannelsStep({ data, onChange, onNext, onBack }: Props) {
  const handleChannelToggle = (value: string) => {
    const currentChannels = data.preferredChannels || [];
    const newChannels = currentChannels.includes(value as any)
      ? currentChannels.filter(ch => ch !== value)
      : [...currentChannels, value as any];
    onChange({ preferredChannels: newChannels });
  };

  const handleChange = (field: keyof EnhancedStrategyInput, value: any) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Channels & Positioning</h2>
        <p className="text-gray-300">Select your preferred marketing channels and brand positioning</p>
      </div>

      {/* Brand Positioning */}
      <div>
        <label htmlFor="brandPositioning" className="block text-sm font-medium text-gray-300 mb-2">
          Brand Positioning <span className="text-red-500">*</span>
        </label>
        <select
          id="brandPositioning"
          value={data.brandPositioning || ''}
          onChange={(e) => handleChange('brandPositioning', e.target.value)}
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          required
        >
          <option value="" className="bg-black text-white">Select brand positioning...</option>
          {BRAND_POSITIONING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-black text-white">
              {option.label}
            </option>
          ))}
        </select>
        {data.brandPositioning && (
          <p className="mt-2 text-sm text-gray-300">
            {BRAND_POSITIONING_OPTIONS.find(p => p.value === data.brandPositioning)?.description}
          </p>
        )}
      </div>

      {/* Brand Voice */}
      <div>
        <label htmlFor="brandVoice" className="block text-sm font-medium text-gray-300 mb-2">
          Brand Voice <span className="text-red-500">*</span>
        </label>
        <input
          id="brandVoice"
          type="text"
          value={data.brandVoice || ''}
          onChange={(e) => handleChange('brandVoice', e.target.value)}
          placeholder="e.g., Professional, Witty, Authoritative, Friendly"
          className="w-full px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
          required
        />
      </div>

      {/* Brand Values */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Brand Values (Max 5)
        </label>
        <div className="space-y-2">
          {(data.brandValues || []).map((value, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  const newValues = [...(data.brandValues || [])];
                  newValues[index] = e.target.value;
                  handleChange('brandValues', newValues);
                }}
                className="flex-1 px-4 py-2 bg-black border border-[#2A2A2A] rounded-lg text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B]"
              />
              <button
                type="button"
                onClick={() => {
                  const newValues = (data.brandValues || []).filter((_, i) => i !== index);
                  handleChange('brandValues', newValues);
                }}
                className="px-3 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
              >
                ×
              </button>
            </div>
          ))}
          {(data.brandValues || []).length < 5 && (
            <button
              type="button"
              onClick={() => handleChange('brandValues', [...(data.brandValues || []), ''])}
              className="text-sm text-[#F59E0B] hover:text-[#F59E0B]/80 font-medium"
            >
              + Add Value
            </button>
          )}
        </div>
      </div>

      {/* Preferred Channels (Multi-select) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Preferred Marketing Channels (Optional - select channels you want to focus on)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto border border-[#2A2A2A] rounded-lg p-4 bg-black">
          {MARKETING_CHANNELS.map((channel) => {
            const isSelected = (data.preferredChannels || []).includes(channel.value as any);
            return (
              <button
                key={channel.value}
                type="button"
                onClick={() => handleChannelToggle(channel.value)}
                className={`p-3 border rounded-lg text-left transition-all ${isSelected
                  ? 'border-[#F59E0B] bg-[#F59E0B]/10'
                  : 'border-[#2A2A2A] hover:border-border-hover bg-[#2A2A2A]'
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
                  <span className="text-sm font-medium text-white">{channel.label}</span>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-gray-300">
          {(data.preferredChannels || []).length === 0
            ? 'No channels selected - we\'ll recommend the best channels for you'
            : `${(data.preferredChannels || []).length} channel(s) selected`}
        </p>
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
          disabled={!data.brandPositioning}
          className="px-6 py-3 bg-[#F59E0B] text-white rounded-lg font-medium hover:bg-[#F59E0B]/90 disabled:bg-[#2A2A2A] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
        >
          Continue to Additional Context →
        </button>
      </div>
    </div>
  );
}

