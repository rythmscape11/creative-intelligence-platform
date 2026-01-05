'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toaster';
import { useCsrfHeaders, useCsrfLoaded } from '@/components/csrf-provider';
import { BusinessInfoStep } from './business-info-step';
import { AudienceBudgetStep } from './audience-budget-step';
import { ObjectivesTimeframeStep } from './objectives-timeframe-step';
import { ChallengesContextStep } from './challenges-context-step';
import {
  strategyInputSchema,
  businessInfoSchema,
  audienceAndBudgetSchema,
  objectivesAndTimeframeSchema,
  challengesAndContextSchema,
  type StrategyInput,
  type BusinessInfo,
  type AudienceAndBudget,
  type ObjectivesAndTimeframe,
  type ChallengesAndContext,
} from '@/lib/validations/strategy';

const STEPS = [
  'business-info',
  'audience-budget',
  'objectives-timeframe',
  'challenges-context',
] as const;

type Step = typeof STEPS[number];

interface ValidationErrors {
  businessInfo?: Partial<Record<keyof BusinessInfo, string>>;
  audienceBudget?: Partial<Record<keyof AudienceAndBudget, string>>;
  objectivesTimeframe?: Partial<Record<keyof ObjectivesAndTimeframe, string>>;
  challengesContext?: Partial<Record<keyof ChallengesAndContext, string>>;
}

export function StrategyBuilder() {
  const router = useRouter();
  const csrfHeaders = useCsrfHeaders();
  const csrfLoaded = useCsrfLoaded();
  const [currentStep, setCurrentStep] = useState<Step>('business-info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Form data state
  const [formData, setFormData] = useState<StrategyInput>({
    businessName: '',
    industry: '',
    targetAudience: '',
    budget: 0,
    objectives: [],
    timeframe: '',
    currentChallenges: '',
    competitorInfo: '',
    existingMarketing: '',
  });

  // Update form data for specific sections
  const updateBusinessInfo = useCallback((data: BusinessInfo) => {
    setFormData(prev => ({ ...prev, ...data }));
    setErrors(prev => ({ ...prev, businessInfo: {} }));
  }, []);

  const updateAudienceBudget = useCallback((data: AudienceAndBudget) => {
    setFormData(prev => ({ ...prev, ...data }));
    setErrors(prev => ({ ...prev, audienceBudget: {} }));
  }, []);

  const updateObjectivesTimeframe = useCallback((data: ObjectivesAndTimeframe) => {
    setFormData(prev => ({ ...prev, ...data }));
    setErrors(prev => ({ ...prev, objectivesTimeframe: {} }));
  }, []);

  const updateChallengesContext = useCallback((data: ChallengesAndContext) => {
    setFormData(prev => ({ ...prev, ...data }));
    setErrors(prev => ({ ...prev, challengesContext: {} }));
  }, []);

  // Validation functions
  const validateStep = (step: Step): boolean => {
    try {
      switch (step) {
        case 'business-info':
          businessInfoSchema.parse({
            businessName: formData.businessName,
            industry: formData.industry,
          });
          setErrors(prev => ({ ...prev, businessInfo: {} }));
          return true;

        case 'audience-budget':
          audienceAndBudgetSchema.parse({
            targetAudience: formData.targetAudience,
            budget: formData.budget,
          });
          setErrors(prev => ({ ...prev, audienceBudget: {} }));
          return true;

        case 'objectives-timeframe':
          objectivesAndTimeframeSchema.parse({
            objectives: formData.objectives,
            timeframe: formData.timeframe,
          });
          setErrors(prev => ({ ...prev, objectivesTimeframe: {} }));
          return true;

        case 'challenges-context':
          challengesAndContextSchema.parse({
            currentChallenges: formData.currentChallenges,
            competitorInfo: formData.competitorInfo,
            existingMarketing: formData.existingMarketing,
          });
          setErrors(prev => ({ ...prev, challengesContext: {} }));
          return true;

        default:
          return false;
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });

        setErrors(prev => ({
          ...prev,
          [step === 'business-info' ? 'businessInfo' :
            step === 'audience-budget' ? 'audienceBudget' :
              step === 'objectives-timeframe' ? 'objectivesTimeframe' :
                'challengesContext']: fieldErrors,
        }));
      }
      return false;
    }
  };

  // Navigation functions
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      const currentIndex = STEPS.indexOf(currentStep);
      if (currentIndex < STEPS.length - 1) {
        setCurrentStep(STEPS[currentIndex + 1]);
      }
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  };

  // Submit strategy
  const submitStrategy = async () => {
    // Check if CSRF token is loaded
    if (!csrfLoaded) {
      toast({
        type: 'error',
        title: 'Please Wait',
        description: 'Security token is loading. Please try again in a moment.',
      });
      return;
    }

    // Validate all data
    try {
      strategyInputSchema.parse(formData);
    } catch (error: any) {
      toast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please check all fields and try again.',
      });
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/strategies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...csrfHeaders,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();

      setSuccessMessage('Strategy created successfully! Redirecting to your new strategy...');

      toast({
        type: 'success',
        title: 'Strategy Created!',
        description: 'Your marketing strategy has been generated successfully.',
      });

      // Keep loading state active - redirect will happen naturally
      router.push(`/dashboard/strategies/${result.data.id}`);

      // Don't set loading states to false here - let the redirect happen naturally
    } catch (error: any) {
      console.error('Strategy creation error:', error);
      const errorMessage = error.message || 'Error generating strategy. Please try again.';
      setSubmitError(errorMessage);

      toast({
        type: 'error',
        title: 'Creation Failed',
        description: errorMessage,
      });

      // Only set loading states to false on error
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Handle final step submission
  const handleFinalStep = () => {
    if (validateStep(currentStep)) {
      submitStrategy();
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'business-info':
        return (
          <BusinessInfoStep
            data={{
              businessName: formData.businessName,
              industry: formData.industry,
            }}
            onChange={updateBusinessInfo}
            onNext={goToNextStep}
            errors={errors.businessInfo}
          />
        );

      case 'audience-budget':
        return (
          <AudienceBudgetStep
            data={{
              targetAudience: formData.targetAudience,
              budget: formData.budget,
            }}
            onChange={updateAudienceBudget}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            errors={errors.audienceBudget}
          />
        );

      case 'objectives-timeframe':
        return (
          <ObjectivesTimeframeStep
            data={{
              objectives: formData.objectives,
              timeframe: formData.timeframe,
            }}
            onChange={updateObjectivesTimeframe}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
            errors={errors.objectivesTimeframe}
          />
        );

      case 'challenges-context':
        return (
          <ChallengesContextStep
            data={{
              currentChallenges: formData.currentChallenges,
              competitorInfo: formData.competitorInfo,
              existingMarketing: formData.existingMarketing,
            }}
            onChange={updateChallengesContext}
            onNext={handleFinalStep}
            onBack={goToPreviousStep}
            errors={errors.challengesContext}
            isSubmitting={isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 md:px-6 lg:px-8" data-testid="strategy-builder-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Your Marketing Strategy</h1>
        <p className="mt-2 text-lg text-gray-600">
          Build a comprehensive marketing strategy tailored to your business
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-zinc-900 mr-3"></div>
            <p className="text-zinc-900">Generating strategy...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{submitError}</p>
        </div>
      )}

      {/* Success State */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
}
