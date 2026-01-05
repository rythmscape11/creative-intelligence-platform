'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Pause,
  Edit,
  Download,
  TrendingUp,
  Users,
  Target,
  BarChart3
} from 'lucide-react';

// Mock data - will be replaced with API call
const mockExperiment = {
  id: '1',
  name: 'Homepage Hero CTA Test',
  description: 'Testing "Get Started" vs "Try Free" button text to improve conversion rates',
  status: 'running',
  targetUrl: 'https://example.com',
  startDate: '2025-10-01',
  variants: [
    {
      id: 'control',
      name: 'Control (Get Started)',
      traffic: 50,
      stats: {
        views: 623,
        conversions: 42,
        conversionRate: 6.7,
        revenue: 4200,
      },
    },
    {
      id: 'variant-a',
      name: 'Variant A (Try Free)',
      traffic: 50,
      stats: {
        views: 624,
        conversions: 53,
        conversionRate: 8.5,
        revenue: 5300,
      },
    },
  ],
};

export default async function ExperimentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [experiment] = useState(mockExperiment);

  // Calculate overall stats
  const totalViews = experiment.variants.reduce((sum, v) => sum + v.stats.views, 0);
  const totalConversions = experiment.variants.reduce((sum, v) => sum + v.stats.conversions, 0);
  const overallCVR = (totalConversions / totalViews) * 100;

  // Calculate uplift (variant vs control)
  const control = experiment.variants[0];
  const variant = experiment.variants[1];
  const uplift = ((variant.stats.conversionRate - control.stats.conversionRate) / control.stats.conversionRate) * 100;
  const isPositive = uplift > 0;

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/growth-suite/experiments"
            className="inline-flex items-center text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Experiments
          </Link>

          <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 animate-fade-in-up">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h1 className="text-3xl font-bold mr-3"
                  >
                    {experiment.name}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${experiment.status === 'running'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {experiment.status === 'running' ? (
                      <span className="flex items-center">
                        <Play className="h-3 w-3 mr-1" />
                        Running
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Pause className="h-3 w-3 mr-1" />
                        Paused
                      </span>
                    )}
                  </span>
                </div>
                <p className="mb-4"
                >
                  {experiment.description}
                </p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span>
                      Target URL:
                    </span>
                    <span className="ml-2"
                    >
                      {experiment.targetUrl}
                    </span>
                  </div>
                  <div>
                    <span>
                      Started:
                    </span>
                    <span className="ml-2 font-medium"
                    >
                      {new Date(experiment.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button className="btn btn-secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                {experiment.status === 'running' ? (
                  <button className="btn btn-secondary">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </button>
                ) : (
                  <button className="bg-[#F59E0B] text-black hover:bg-[#D97706] rounded-lg px-4 py-2 flex items-center gap-2 transition-all font-semibold">
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 stagger-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium"
              >
                Total Views
              </span>
              <Users className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold"
            >
              {totalViews.toLocaleString()}
            </div>
          </div>

          <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 stagger-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium"
              >
                Conversions
              </span>
              <Target className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold"
            >
              {totalConversions}
            </div>
          </div>

          <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 stagger-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium"
              >
                Overall CVR
              </span>
              <BarChart3 className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold"
            >
              {overallCVR.toFixed(1)}%
            </div>
          </div>

          <div className={`rounded-lg p-6 ${isPositive ? 'bg-bg-tertiary border border-border-primary' : 'bg-bg-tertiary border border-border-primary'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium"
              >
                Uplift
              </span>
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold">
              {uplift > 0 ? '+' : ''}{uplift.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Variant Comparison */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6"
          >
            Variant Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiment.variants.map((variant, index) => (
              <div key={variant.id}
                className={`rounded-lg p-6 ${index === 0 ? 'bg-bg-tertiary border border-border-primary' : 'bg-bg-tertiary border border-border-primary'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold"
                  >
                    {variant.name}
                  </h3>
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-bg-tertiary"
                  >
                    {variant.traffic}% traffic
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>
                      Views
                    </span>
                    <span className="font-semibold"
                    >
                      {variant.stats.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      Conversions
                    </span>
                    <span className="font-semibold"
                    >
                      {variant.stats.conversions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      Conversion Rate
                    </span>
                    <span className="font-semibold text-lg"
                    >
                      {variant.stats.conversionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span>
                      Revenue
                    </span>
                    <span className="font-semibold"
                    >
                      ${variant.stats.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Significance */}
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6">
          <h3 className="font-semibold mb-2"
          >
            Statistical Significance
          </h3>
          <p className="text-sm mb-3"
          >
            Based on Bayesian analysis, there is a 94% probability that Variant A performs better than Control.
            We recommend running the test for at least 2 more weeks to reach 95% confidence.
          </p>
          <div className="w-full bg-bg-tertiary rounded-full h-3">
            <div className="h-3 rounded-full transition-all duration-300">
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs"
          >
            <span>0%</span>
            <span>94% confidence</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
