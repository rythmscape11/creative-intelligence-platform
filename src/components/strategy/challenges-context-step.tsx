'use client';

import { useState, useEffect } from 'react';
import { FormField, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { type ChallengesAndContext } from '@/lib/validations/strategy';

interface ChallengesContextStepProps {
  data: ChallengesAndContext;
  onChange: (data: ChallengesAndContext) => void;
  onNext: () => void;
  onBack: () => void;
  errors?: Partial<Record<keyof ChallengesAndContext, string>>;
  isSubmitting?: boolean;
}

export function ChallengesContextStep({
  data,
  onChange,
  onNext,
  onBack,
  errors = {},
  isSubmitting = false,
}: ChallengesContextStepProps) {
  const [formData, setFormData] = useState<ChallengesAndContext>({
    currentChallenges: data?.currentChallenges || '',
    competitorInfo: data?.competitorInfo || '',
    existingMarketing: data?.existingMarketing || '',
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = (field: keyof ChallengesAndContext, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValid = (formData.currentChallenges?.trim() || '').length >= 10;

  const handleNext = () => {
    // Always call onNext, let the parent handle validation and error display
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Challenges & Context</h2>
        <p className="mt-2 text-gray-600">
          Help us understand your current situation and challenges
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <FormField
          label="Current Marketing Challenges"
          required
          error={errors.currentChallenges}
        >
          <Textarea
            placeholder="Describe the main challenges you're facing with your current marketing efforts..."
            value={formData.currentChallenges}
            onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
            error={!!errors.currentChallenges}
            rows={4}
          />
          <p className="text-sm text-gray-700 mt-1">
            Be specific about obstacles, pain points, or areas where you're struggling
          </p>
        </FormField>

        <FormField
          label="Competitor Information"
          error={errors.competitorInfo}
        >
          <Textarea
            placeholder="Tell us about your main competitors and their marketing strategies (optional)..."
            value={formData.competitorInfo || ''}
            onChange={(e) => handleInputChange('competitorInfo', e.target.value)}
            error={!!errors.competitorInfo}
            rows={3}
          />
          <p className="text-sm text-gray-700 mt-1">
            Optional: Share insights about competitors' strengths, weaknesses, or strategies
          </p>
        </FormField>

        <FormField
          label="Existing Marketing Efforts"
          error={errors.existingMarketing}
        >
          <Textarea
            placeholder="Describe your current marketing activities and their performance (optional)..."
            value={formData.existingMarketing || ''}
            onChange={(e) => handleInputChange('existingMarketing', e.target.value)}
            error={!!errors.existingMarketing}
            rows={3}
          />
          <p className="text-sm text-gray-700 mt-1">
            Optional: What marketing channels, campaigns, or tactics are you currently using?
          </p>
        </FormField>
      </div>

      {/* Context Tips */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-purple-900 mb-2">💡 Tips for Better Results</h4>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Be honest about current challenges - this helps create realistic strategies</li>
          <li>• Include specific metrics if available (conversion rates, ROI, etc.)</li>
          <li>• Mention any budget or resource constraints</li>
          <li>• Share what has worked well in the past</li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        
        <Button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="min-w-[140px]"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </div>
          ) : (
            'Create Strategy'
          )}
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center pt-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
        </div>
      </div>

      {/* Final Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">🎯 Ready to Generate Your Strategy</h4>
        <p className="text-sm text-gray-700">
          Once you click "Create Strategy", our AI will analyze your inputs and generate a comprehensive 
          marketing strategy tailored to your business needs. This process typically takes 30-60 seconds.
        </p>
      </div>
    </div>
  );
}
