'use client';

import { useState, useEffect } from 'react';
import { FormField, Textarea, CurrencyInput } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { type AudienceAndBudget } from '@/lib/validations/strategy';

interface AudienceBudgetStepProps {
  data: AudienceAndBudget;
  onChange: (data: AudienceAndBudget) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Partial<Record<keyof AudienceAndBudget, string>>;
}

export function AudienceBudgetStep({
  data,
  onChange,
  onNext,
  onBack,
  errors = {},
}: AudienceBudgetStepProps) {
  const [formData, setFormData] = useState<AudienceAndBudget>({
    targetAudience: data?.targetAudience || '',
    budget: data?.budget || 0,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = (field: keyof AudienceAndBudget, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValid = (formData.targetAudience?.trim() || '').length >= 10 &&
    (formData.budget || 0) >= 1000;

  const handleNext = () => {
    // Always call onNext, let the parent handle validation and error display
    onNext();
  };

  // Budget suggestions based on common ranges
  const budgetSuggestions = [
    { label: '$1,000 - $5,000', value: 3000 },
    { label: '$5,000 - $15,000', value: 10000 },
    { label: '$15,000 - $50,000', value: 30000 },
    { label: '$50,000 - $100,000', value: 75000 },
    { label: '$100,000+', value: 150000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Target Audience & Budget</h2>
        <p className="mt-2 text-gray-600">
          Define who you want to reach and your marketing investment
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <FormField
          label="Target Audience"
          required
          error={errors.targetAudience}
        >
          <Textarea
            placeholder="Describe your ideal customers (demographics, interests, pain points, etc.)"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            error={!!errors.targetAudience}
            rows={4}
          />
          <p className="text-sm text-gray-700 mt-1">
            Be specific about age, location, interests, behaviors, and challenges your audience faces
          </p>
        </FormField>

        <FormField
          label="Marketing Budget"
          required
          error={errors.budget}
        >
          <CurrencyInput
            value={formData.budget}
            onChange={(value) => handleInputChange('budget', value)}
            placeholder="Enter your marketing budget"
            error={!!errors.budget}
          />
          <p className="text-sm text-gray-700 mt-1">
            Total budget available for marketing activities (USD)
          </p>

          {/* Budget Suggestions */}
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Quick select:</p>
            <div className="flex flex-wrap gap-2">
              {budgetSuggestions.map((suggestion) => (
                <button
                  key={suggestion.value}
                  type="button"
                  onClick={() => handleInputChange('budget', suggestion.value)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${formData.budget === suggestion.value
                      ? 'bg-primary-100 border-primary-300 text-primary-800'
                      : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        </FormField>
      </div>

      {/* Budget Guidance */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-900 mb-2">💡 Budget Guidelines</h4>
        <ul className="text-sm text-zinc-800 space-y-1">
          <li>• Small businesses: $1,000 - $15,000 per month</li>
          <li>• Medium businesses: $15,000 - $50,000 per month</li>
          <li>• Large businesses: $50,000+ per month</li>
          <li>• Consider 5-10% of revenue for marketing budget</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>

        <Button
          type="button"
          onClick={handleNext}
        >
          Next: Objectives & Timeline
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center pt-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
