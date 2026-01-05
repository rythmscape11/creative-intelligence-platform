'use client';

import { useState, useEffect } from 'react';
import { FormField, Input, Select } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { industryOptions, type BusinessInfo } from '@/lib/validations/strategy';

interface BusinessInfoStepProps {
  data: BusinessInfo;
  onChange: (data: BusinessInfo) => void;
  onNext: () => void;
  onBack?: () => void;
  errors?: Partial<Record<keyof BusinessInfo, string>>;
}

export function BusinessInfoStep({
  data,
  onChange,
  onNext,
  onBack,
  errors = {},
}: BusinessInfoStepProps) {
  const [formData, setFormData] = useState<BusinessInfo>({
    businessName: data?.businessName || '',
    industry: data?.industry || '',
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValid = (formData.businessName?.trim() || '').length >= 2 &&
                  (formData.industry?.trim() || '').length >= 2;

  const handleNext = () => {
    // Always call onNext, let the parent handle validation and error display
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
        <p className="mt-2 text-gray-600">
          Let's start with some basic information about your business
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <FormField
          label="Business Name"
          required
          error={errors.businessName}
        >
          <Input
            type="text"
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            error={!!errors.businessName}
          />
          <p className="text-sm text-gray-700 mt-1">
            The name of your company or organization
          </p>
        </FormField>

        <FormField
          label="Industry"
          required
          error={errors.industry}
        >
          <Select
            options={industryOptions}
            placeholder="Select your industry"
            value={formData.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            error={!!errors.industry}
          />
          <p className="text-sm text-gray-700 mt-1">
            Choose the industry that best describes your business
          </p>
        </FormField>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        {onBack ? (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
        ) : (
          <div />
        )}
        
        <Button
          type="button"
          onClick={handleNext}
        >
          Next: Audience & Budget
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center pt-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
