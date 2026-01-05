'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { experimental_useObject } from '@ai-sdk/react';
import { toast } from '@/components/ui/toaster';
import { useCsrfHeaders } from '@/components/csrf-provider';
import { EnhancedBusinessInfoStep } from './enhanced-steps/business-info-step';
import { EnhancedMarketContextStep } from './enhanced-steps/market-context-step';
import { EnhancedObjectivesStep } from './enhanced-steps/objectives-step';
import { EnhancedResourcesStep } from './enhanced-steps/resources-step';
import { EnhancedChannelsStep } from './enhanced-steps/channels-step';
import { EnhancedContextStep } from './enhanced-steps/context-step';
import { StrategyGenerationLoading } from './strategy-generation-loading';
import { enhancedStrategyInputSchema, type EnhancedStrategyInput } from '@/lib/validations/enhanced-strategy';

const STEPS = [
  'business-info',
  'market-context',
  'objectives',
  'resources',
  'channels',
  'context',
] as const;

type Step = typeof STEPS[number];

interface Props {
  initialData?: Partial<EnhancedStrategyInput>;
}

export function EnhancedStrategyBuilder({ initialData }: Props) {
  const router = useRouter();
  const csrfHeaders = useCsrfHeaders();
  const [currentStep, setCurrentStep] = useState<Step>('business-info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form data state with all enhanced fields, populated with initialData if available
  const [formData, setFormData] = useState<Partial<EnhancedStrategyInput>>({
    businessName: '',
    industry: '',
    businessType: undefined,
    companyStage: undefined,
    targetMarketMaturity: undefined,
    competitiveLandscape: undefined,
    geographicScope: undefined,
    marketingObjectives: [],
    primaryKPI: undefined,
    budget: 10000,
    timeframe: undefined,
    teamSize: undefined,
    marketingMaturity: undefined,
    preferredChannels: [],
    brandPositioning: undefined,
    targetAudience: '',
    currentChallenges: [],
    existingMarTech: [],
    competitorInfo: '',
    existingMarketing: '',
    seasonalityFactors: '',
    regulatoryConstraints: '',
    brandVoice: '',
    brandValues: [],
    secondaryKPIs: [],
    pastPerformance: '',
    includeMarketIntelligence: false,
    ...initialData // Override defaults with initialData if provided
  });

  // Update form data
  const updateFormData = useCallback((data: Partial<EnhancedStrategyInput>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Validation function
  const validateCurrentStep = (): boolean => {
    // Basic validation - check required fields for current step
    switch (currentStep) {
      case 'business-info':
        return !!(formData.businessName && formData.industry && formData.businessType && formData.companyStage);
      case 'market-context':
        return !!(formData.targetMarketMaturity && formData.competitiveLandscape && formData.geographicScope);
      case 'objectives':
        return !!(formData.marketingObjectives && formData.marketingObjectives.length > 0 && formData.primaryKPI);
      case 'resources':
        return !!(formData.budget && formData.budget >= 1000 && formData.timeframe && formData.teamSize && formData.marketingMaturity);
      case 'channels':
        return !!(formData.brandPositioning && formData.targetAudience);
      case 'context':
        return true; // Optional fields
      default:
        return false;
    }
  };

  // Navigation functions
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      const currentIndex = STEPS.indexOf(currentStep);
      if (currentIndex < STEPS.length - 1) {
        setCurrentStep(STEPS[currentIndex + 1]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      toast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please fill in all required fields before continuing.',
      });
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // AI Streaming Hook
  // @ts-ignore - experimental_useObject is available in 'ai/react'
  const { object, submit, isLoading, error } = experimental_useObject({
    api: '/api/strategies/stream',
    // schema: We rely on the backend to enforce schema. 
    // Passing input schema here (enhancedStrategyInputSchema) is incorrect as it validates INPUT not OUTPUT.
  });

  // Handle stream errors
  useEffect(() => {
    if (error) {
      console.error('Streaming error:', error);
      setIsSubmitting(false);
      setSubmitError('An error occurred during strategy generation. Please try again.');
      toast({
        type: 'error',
        title: 'Generation Failed',
        description: 'Failed to generate strategy. Please try again.',
      });
    }
  }, [error]);

  // Calculate completed stages based on streaming object
  const calculateCompletedStages = () => {
    if (!object) return [];
    const stages: string[] = [];

    // Map object presence to stages
    // @ts-ignore
    if (object.executiveSummary?.overview) stages.push('analyzing');
    // @ts-ignore
    if (object.targetAudiencePersonas?.length > 0) stages.push('researching');
    // @ts-ignore
    if (object.channelStrategy?.length > 0) stages.push('developing');
    // @ts-ignore
    if (object.budgetBreakdown?.totalBudget) stages.push('calculating');
    // @ts-ignore
    if (object.implementationTimeline?.length > 0) stages.push('generating');

    // 'finalizing' is added when ALL above are present or when isLoading becomes false
    if (stages.length === 5 && !isLoading) stages.push('finalizing');

    return stages;
  };

  const streamingStages = calculateCompletedStages();

  // Watch for completion and redirect
  const hasRedirected = useRef(false);
  useEffect(() => {
    if (!isLoading && object && !hasRedirected.current) {
      // @ts-ignore
      const strategyId = object._strategyId;
      if (strategyId) {
        hasRedirected.current = true;
        setIsGenerationComplete(true);
        toast({
          type: 'success',
          title: 'Strategy Created!',
          description: 'Your comprehensive marketing strategy has been generated successfully.',
        });
        // Small delay to show 100% state
        setTimeout(() => {
          router.push(`/dashboard/strategies/${strategyId}`);
        }, 1000);
      }
    }
  }, [isLoading, object, router]);

  // Submit strategy
  const submitStrategy = async () => {
    // Clean up form data - convert empty strings to undefined for optional fields
    const cleanedData = {
      ...formData,
      competitorInfo: formData.competitorInfo?.trim() || undefined,
      existingMarketing: formData.existingMarketing?.trim() || undefined,
      seasonalityFactors: formData.seasonalityFactors?.trim() || undefined,
      regulatoryConstraints: formData.regulatoryConstraints?.trim() || undefined,
      currentChallenges: formData.currentChallenges && formData.currentChallenges.length > 0 ? formData.currentChallenges : undefined,
      existingMarTech: formData.existingMarTech && formData.existingMarTech.length > 0 ? formData.existingMarTech : undefined,
      preferredChannels: formData.preferredChannels && formData.preferredChannels.length > 0 ? formData.preferredChannels : undefined,
      brandVoice: formData.brandVoice?.trim() || undefined,
      brandValues: formData.brandValues && formData.brandValues.length > 0 ? formData.brandValues : undefined,
    };

    // Final validation
    try {
      enhancedStrategyInputSchema.parse(cleanedData);
    } catch (error: any) {
      console.error('Validation error:', error);
      toast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please check all required fields.',
      });
      return;
    }

    setIsSubmitting(true);
    setIsGenerationComplete(false);
    setSubmitError(null);
    hasRedirected.current = false;

    try {
      submit(cleanedData);
    } catch (error: any) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
      setSubmitError('Failed to start generation');
    }
  };

  // Handle final step submission
  const handleFinalStep = () => {
    if (validateCurrentStep()) {
      submitStrategy();
    } else {
      toast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please fill in all required fields before submitting.',
      });
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'business-info':
        return (
          <EnhancedBusinessInfoStep
            data={formData}
            onChange={updateFormData}
            onNext={goToNextStep}
          />
        );

      case 'market-context':
        return (
          <EnhancedMarketContextStep
            data={formData}
            onChange={updateFormData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );

      case 'objectives':
        return (
          <EnhancedObjectivesStep
            data={formData}
            onChange={updateFormData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );

      case 'resources':
        return (
          <EnhancedResourcesStep
            data={formData}
            onChange={updateFormData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );

      case 'channels':
        return (
          <EnhancedChannelsStep
            data={formData}
            onChange={updateFormData}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );

      case 'context':
        return (
          <EnhancedContextStep
            data={formData}
            onChange={updateFormData}
            onNext={handleFinalStep}
            onBack={goToPreviousStep}
            isSubmitting={isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  // Calculate progress
  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  return (
    <>
      {/* Premium Loading Overlay */}
      {isSubmitting && (
        <StrategyGenerationLoading
          isComplete={isGenerationComplete}
          completedStages={streamingStages}
        />
      )}

      <div className="max-w-4xl mx-auto py-8 px-4 md:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
            <span className="text-sm font-medium text-text-secondary">
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
            <span className="text-sm font-medium text-text-secondary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-bg-tertiary rounded-full h-2">
            <div
              className="bg-accent-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="mb-8 flex flex-wrap gap-2">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const stepLabels = {
              'business-info': 'Business Info',
              'market-context': 'Market Context',
              'objectives': 'Objectives',
              'resources': 'Resources',
              'channels': 'Channels',
              'context': 'Additional Context',
            };

            return (
              <button
                key={step}
                onClick={() => index <= currentStepIndex && goToStep(step)}
                disabled={index > currentStepIndex}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isCurrent
                  ? 'bg-accent-secondary text-white'
                  : isCompleted
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                    : 'bg-bg-tertiary text-text-tertiary cursor-not-allowed border border-border-primary'
                  }`}
              >
                {isCompleted && '✓ '}
                {stepLabels[step]}
              </button>
            );
          })}
        </div>

        {/* Error State */}
        {submitError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{submitError}</p>
          </div>
        )}

        {/* Current Step Content */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 md:p-8">
          {renderCurrentStep()}
        </div>
      </div>
    </>
  );
}

