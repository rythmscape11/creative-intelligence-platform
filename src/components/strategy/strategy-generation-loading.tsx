'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Sparkles,
  Target,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface StrategyGenerationLoadingProps {
  onComplete?: () => void;
  isComplete?: boolean; // New prop to indicate when API call is complete
}

const GENERATION_STAGES = [
  {
    id: 'analyzing',
    label: 'Analyzing your business context...',
    icon: Target,
    duration: 2000, // 2 seconds
  },
  {
    id: 'researching',
    label: 'Researching target audience personas...',
    icon: Users,
    duration: 2000, // 2 seconds
  },
  {
    id: 'developing',
    label: 'Developing channel strategy...',
    icon: TrendingUp,
    duration: 2000, // 2 seconds
  },
  {
    id: 'calculating',
    label: 'Calculating budget allocations...',
    icon: DollarSign,
    duration: 2000, // 2 seconds
  },
  {
    id: 'generating',
    label: 'Generating implementation timeline...',
    icon: Calendar,
    duration: 2000, // 2 seconds
  },
  {
    id: 'finalizing',
    label: 'Finalizing your comprehensive strategy...',
    icon: Sparkles,
    duration: 2000, // 2 seconds
  },
];

const MINIMUM_DISPLAY_TIME = 2000; // Much faster for streaming

export function StrategyGenerationLoading({
  onComplete,
  isComplete = false,
  completedStages: externalCompletedStages
}: StrategyGenerationLoadingProps & { completedStages?: string[] }) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedStages, setCompletedStages] = useState<string[]>([]);

  // Use external stages if provided (Streaming Mode)
  const isStreaming = !!externalCompletedStages;

  useEffect(() => {
    if (externalCompletedStages) {
      setCompletedStages(externalCompletedStages);

      // Calculate progress based on stages
      // Map stages: analyzing -> business-info, etc.
      // We'll just trust the length
      const progressPerStage = 100 / GENERATION_STAGES.length;
      const calculatedProgress = Math.min(
        (externalCompletedStages.length / GENERATION_STAGES.length) * 100,
        95
      );

      // Smoothly animate progress
      setProgress(Math.max(progress, calculatedProgress));

      // Update current stage index
      if (externalCompletedStages.length < GENERATION_STAGES.length) {
        setCurrentStageIndex(externalCompletedStages.length);
      } else {
        setCurrentStageIndex(GENERATION_STAGES.length - 1);
      }
    }
  }, [externalCompletedStages]);

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      setCompletedStages(GENERATION_STAGES.map(s => s.id));
      if (onComplete) {
        setTimeout(onComplete, 1000);
      }
    }
  }, [isComplete, onComplete]);

  // Render Logic
  const currentStage = GENERATION_STAGES[currentStageIndex] || GENERATION_STAGES[GENERATION_STAGES.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500">
      <div className="w-full max-w-2xl mx-4">
        {/* Main Card */}
        <div className="bg-white dark:bg-bg-secondary rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-border-primary">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-text-primary mb-2">
              Creating Your Strategy
            </h2>
            <p className="text-gray-600 dark:text-text-secondary">
              {isStreaming ? "AI is typing your strategy in real-time..." : "Our AI is crafting a comprehensive marketing strategy..."}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-text-secondary">
                Progress
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-text-secondary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stages List */}
          <div className="space-y-3">
            {GENERATION_STAGES.map((stage, index) => {
              const Icon = stage.icon;
              // For streaming, use the passed props. For legacy, use internal index.
              const isCompleted = isStreaming
                ? completedStages.includes(stage.id)
                : index < currentStageIndex;

              const isCurrent = isStreaming
                ? !isCompleted && index === completedStages.length
                : index === currentStageIndex;

              return (
                <div
                  key={stage.id}
                  className={`flex items-center p-4 rounded-lg transition-all duration-300 ${isCurrent
                      ? 'bg-blue-50 dark:bg-blue-500/10 border-2 border-blue-500 dark:border-blue-400 transform scale-102'
                      : isCompleted
                        ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30'
                        : 'bg-gray-50 dark:bg-bg-tertiary border border-gray-200 dark:border-border-primary opacity-60'
                    }`}
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCurrent
                        ? 'bg-blue-500 dark:bg-blue-600'
                        : isCompleted
                          ? 'bg-green-500 dark:bg-green-600'
                          : 'bg-gray-300 dark:bg-bg-hover'
                      }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5 text-gray-600 dark:text-text-tertiary" />
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${isCurrent
                          ? 'text-blue-900 dark:text-blue-300 font-bold'
                          : isCompleted
                            ? 'text-green-900 dark:text-green-300'
                            : 'text-gray-500 dark:text-text-tertiary'
                        }`}
                    >
                      {stage.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

