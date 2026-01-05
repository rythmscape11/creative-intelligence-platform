'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, FlaskConical, Save } from 'lucide-react';

interface Variant {
  id: string;
  name: string;
  traffic: number;
  changes: {
    selector: string;
    type: 'text' | 'html' | 'css' | 'attribute';
    value: string;
  }[];
}

export default function CreateExperimentPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [variants, setVariants] = useState<Variant[]>([
    { id: 'control', name: 'Control (Original)', traffic: 50, changes: [] },
    { id: 'variant-a', name: 'Variant A', traffic: 50, changes: [] },
  ]);

  const addVariant = () => {
    const newId = `variant-${String.fromCharCode(65 + variants.length - 1)}`;
    const newVariants = [...variants];
    const equalTraffic = Math.floor(100 / (variants.length + 1));
    
    // Redistribute traffic equally
    newVariants.forEach(v => v.traffic = equalTraffic);
    newVariants.push({
      id: newId,
      name: `Variant ${String.fromCharCode(65 + variants.length - 1)}`,
      traffic: equalTraffic,
      changes: [],
    });
    
    setVariants(newVariants);
  };

  const removeVariant = (id: string) => {
    if (variants.length <= 2) return; // Keep at least control + 1 variant
    
    const newVariants = variants.filter(v => v.id !== id);
    const equalTraffic = Math.floor(100 / newVariants.length);
    newVariants.forEach(v => v.traffic = equalTraffic);
    
    setVariants(newVariants);
  };

  const updateVariantTraffic = (id: string, traffic: number) => {
    setVariants(variants.map(v => 
      v.id === id ? { ...v, traffic } : v
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: API call to create experiment
    console.log('Creating experiment:', {
      name,
      description,
      targetUrl,
      variants,
    });
    
    // Redirect to experiments list
    router.push('/growth-suite/experiments');
  };

  const totalTraffic = variants.reduce((sum, v) => sum + v.traffic, 0);

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/growth-suite/experiments"
            className="inline-flex items-center text-sm mb-4 transition-colors"
>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Experiments
          </Link>
          
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 animate-fade-in-up">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
>
                <FlaskConical className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold"
>
                Create Experiment
              </h1>
            </div>
            <p>
              Set up a new A/B test to optimize your conversion rates
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4"
>
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2"
>
                  Experiment Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Homepage Hero CTA Test"
                  required
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2"
>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you're testing and why"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2"
>
                  Target URL *
                </label>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  required
                  className="w-full px-4 py-2 rounded-lg border"
                />
                <p className="text-xs mt-1"
>
                  The page where this experiment will run
                </p>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold"
>
                Variants
              </h2>
              <button
                type="button"
                onClick={addVariant}
                className="btn btn-secondary text-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id} className="bg-bg-tertiary border border-border-primary rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[index].name = e.target.value;
                          setVariants(newVariants);
                        }}
                        className="font-medium bg-transparent border-none outline-none"

                      />
                    </div>
                    {variant.id !== 'control' && (
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="text-red-400 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs mb-1"
>
                        Traffic Split
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={variant.traffic}
                          onChange={(e) => updateVariantTraffic(variant.id, parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium w-12 text-right"
>
                          {variant.traffic}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {variant.id !== 'control' && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs mb-2"
>
                        Changes: {variant.changes.length} configured
                      </p>
                      <button
                        type="button"
                        className="text-xs"

                      >
                        Configure Changes →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {totalTraffic !== 100 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Traffic split must total 100% (currently {totalTraffic}%)
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={totalTraffic !== 100 || !name || !targetUrl}
              className="bg-[#F59E0B] text-black hover:bg-[#D97706] rounded-lg px-4 py-2 flex items-center gap-2 transition-all font-semibold flex-1"
            >
              <Save className="h-5 w-5 mr-2" />
              Create Experiment
            </button>
            <Link href="/growth-suite/experiments" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

