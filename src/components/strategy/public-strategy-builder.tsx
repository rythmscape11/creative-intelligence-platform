'use client';

import { useState, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toaster';
import { useCsrfHeaders } from '@/components/csrf-provider';
import { EnhancedBusinessInfoStep } from './enhanced-steps/business-info-step';
import { EnhancedMarketContextStep } from './enhanced-steps/market-context-step';
import { EnhancedObjectivesStep } from './enhanced-steps/objectives-step';
import { EnhancedResourcesStep } from './enhanced-steps/resources-step';
import { EnhancedChannelsStep } from './enhanced-steps/channels-step';
import { EnhancedContextStep } from './enhanced-steps/context-step';
import { UpgradePrompt } from '@/components/cro/UpgradePrompt';
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

export function PublicStrategyBuilder() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const csrfHeaders = useCsrfHeaders();
  const [currentStep, setCurrentStep] = useState<Step>('business-info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [strategyGenerated, setStrategyGenerated] = useState(false);
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null);

  // Form data state - using any to avoid complex type issues with partial form state
  const [formData, setFormData] = useState<any>({
    // Basic Business Information
    businessName: '',
    industry: '',

    // Business Model & Stage
    businessType: '',
    companyStage: '',

    // Market Context
    targetMarketMaturity: '',
    competitiveLandscape: '',
    geographicScope: '',
    targetAudience: '',

    // Marketing Objectives
    marketingObjectives: [],
    primaryKPI: '',

    // Budget & Resources
    budget: 10000,
    timeframe: '3-6-months',

    // Team & Resources
    teamSize: 'SOLO',
    marketingMaturity: '',

    // Brand Positioning
    brandPositioning: '',

    // Channel Preferences (Optional)
    preferredChannels: [],

    // Current Challenges (Optional)
    currentChallenges: [],

    // Technology Stack (Optional)
    existingMarTech: [],

    // Additional Context (Optional)
    competitorInfo: '',
    existingMarketing: '',
    seasonalityFactors: '',
    regulatoryConstraints: '',
  });

  // Update form data
  const updateFormData = useCallback((updates: any) => {
    setFormData((prev: any) => ({ ...prev, ...updates }));
  }, []);

  // Validate current step
  const validateCurrentStep = (): boolean => {
    try {
      enhancedStrategyInputSchema.parse(formData as EnhancedStrategyInput);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Navigation
  const goToNextStep = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
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
    setIsSubmitting(true);
    setSubmitError(null);

    try {
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
      };

      // Validate input
      const validatedInput = enhancedStrategyInputSchema.parse(cleanedData as EnhancedStrategyInput);

      // Check if user is signed in
      if (!isSignedIn) {
        // For guest users, show the strategy preview but prompt to sign in to save
        setStrategyGenerated(true);
        setGeneratedStrategy(validatedInput);
        setShowUpgradePrompt(true);

        toast({
          type: 'success',
          title: 'Strategy Created!',
          description: 'Sign in to save your strategy and access premium features.',
        });

        setIsSubmitting(false);
        return;
      }

      // For signed-in users, save to database
      const response = await fetch('/api/strategies/create-enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...csrfHeaders,
        },
        body: JSON.stringify(validatedInput),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create strategy');
      }

      const result = await response.json();

      toast({
        type: 'success',
        title: 'Strategy Created!',
        description: 'Your marketing strategy has been generated successfully.',
      });

      // Keep loading state active - redirect will happen after loading animation completes
      router.push(`/dashboard/strategies/${result.data.id}`);

      // Don't set isSubmitting to false here - let the redirect happen naturally
    } catch (error: any) {
      console.error('Strategy creation error:', error);
      setSubmitError(error.message || 'Error generating strategy. Please try again.');

      toast({
        type: 'error',
        title: 'Creation Failed',
        description: error.message || 'Failed to create strategy. Please try again.',
      });

      // Only set isSubmitting to false on error
      setIsSubmitting(false);
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

  return (
    <>
      {/* Premium Loading Overlay */}
      {isSubmitting && <StrategyGenerationLoading />}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Guest User Info Banner */}
        {!isSignedIn && status !== 'loading' && (
          <div className="mb-6 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  You're using the free version
                </h3>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>
                    Create your strategy for free! Sign in to unlock premium features:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Save your strategies</li>
                    <li>Export to PPT/Word/Excel/PDF</li>
                    <li>AI-powered recommendations</li>
                    <li>Access strategy history</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <a
                    href="/auth/signin?callbackUrl=/strategy"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-[#F59E0B] hover:bg-[#D97706] transition-colors"
                  >
                    Sign In to Unlock Features
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = step === currentStep;
              const isCompleted = STEPS.indexOf(currentStep) > index;

              return (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${isActive
                          ? 'bg-[#F59E0B] text-black'
                          : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 dark:bg-[#2A2A2A] text-gray-500 dark:text-gray-400'
                        }`}
                    >
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 hidden sm:block">
                      {step.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`h-1 flex-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-[#2A2A2A]'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {submitError && (
          <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-sm text-red-400">{submitError}</p>
          </div>
        )}

        {/* Current Step */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm border border-gray-200 dark:border-[#2A2A2A] p-6">
          {renderCurrentStep()}
        </div>

        {/* Upgrade Prompt Modal */}
        {showUpgradePrompt && !isSignedIn && (
          <UpgradePrompt
            variant="modal"
            feature="save"
            onClose={() => setShowUpgradePrompt(false)}
          />
        )}
      </div>
    </>
  );
}

