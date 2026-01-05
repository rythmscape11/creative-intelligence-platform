'use client';

import { useState, useEffect } from 'react';
import { FormField, Select, MultiSelect } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { timeframeOptions, commonObjectives, type ObjectivesAndTimeframe } from '@/lib/validations/strategy';

interface ObjectivesTimeframeStepProps {
  data: ObjectivesAndTimeframe;
  onChange: (data: ObjectivesAndTimeframe) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Partial<Record<keyof ObjectivesAndTimeframe, string>>;
}

export function ObjectivesTimeframeStep({
  data,
  onChange,
  onNext,
  onBack,
  errors = {},
}: ObjectivesTimeframeStepProps) {
  const [formData, setFormData] = useState<ObjectivesAndTimeframe>({
    objectives: data?.objectives || [],
    timeframe: data?.timeframe || '',
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleObjectivesChange = (objectives: string[]) => {
    setFormData(prev => ({
      ...prev,
      objectives,
    }));
  };

  const handleTimeframeChange = (timeframe: string) => {
    setFormData(prev => ({
      ...prev,
      timeframe,
    }));
  };

  const isValid = (formData.objectives || []).length >= 1 &&
    (formData.timeframe || '').length > 0;

  const handleNext = () => {
    // Always call onNext, let the parent handle validation and error display
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Objectives & Timeline</h2>
        <p className="mt-2 text-gray-600">
          Set your marketing goals and define the timeframe for achieving them
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <FormField
          label="Marketing Objectives"
          required
          error={errors.objectives}
        >
          <MultiSelect
            options={commonObjectives}
            selected={formData.objectives}
            onChange={handleObjectivesChange}
            placeholder="Select your marketing objectives"
            error={!!errors.objectives}
            maxSelections={5}
          />
          <p className="text-sm text-gray-700 mt-1">
            Choose up to 5 primary objectives for your marketing strategy. You can add custom objectives too.
          </p>
        </FormField>

        <FormField
          label="Timeframe"
          required
          error={errors.timeframe}
        >
          <Select
            options={timeframeOptions}
            placeholder="Select your timeframe"
            value={formData.timeframe}
            onChange={(e) => handleTimeframeChange(e.target.value)}
            error={!!errors.timeframe}
          />
          <p className="text-sm text-gray-700 mt-1">
            How long do you want this marketing strategy to run?
          </p>
        </FormField>
      </div>

      {/* Objectives Preview */}
      {formData.objectives.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-900 mb-2">
            📋 Selected Objectives ({formData.objectives.length}/5)
          </h4>
          <ul className="text-sm text-green-800 space-y-1">
            {formData.objectives.map((objective, index) => (
              <li key={index}>• {objective}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeframe Guidance */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-zinc-900 mb-2">⏰ Timeframe Guidelines</h4>
        <div className="text-sm text-zinc-800 space-y-1">
          <p><strong>3-6 months:</strong> Quick wins, campaign launches, brand awareness</p>
          <p><strong>6-12 months:</strong> Lead generation, market expansion, product launches</p>
          <p><strong>12+ months:</strong> Long-term growth, market leadership, major transformations</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-zinc-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
        >
          Next Step
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center pt-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
