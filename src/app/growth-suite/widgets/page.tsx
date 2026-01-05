'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Layout, Copy, Check, Download, Eye, Code } from 'lucide-react';
import { generateWidgetCode, type WidgetType, type WidgetConfig } from '@/lib/growth-suite/widget-generator';

const widgetTypes: { id: WidgetType; name: string; description: string; icon: string }[] = [
  { id: 'exit-intent', name: 'Exit Intent Popup', description: 'Capture visitors before they leave', icon: '🚪' },
  { id: 'slide-in', name: 'Slide-in Box', description: 'Non-intrusive notification box', icon: '📦' },
  { id: 'sticky-bar', name: 'Sticky Bar', description: 'Persistent top/bottom banner', icon: '📌' },
  { id: 'social-proof', name: 'Social Proof', description: 'Show recent activity notifications', icon: '👥' },
  { id: 'countdown', name: 'Countdown Timer', description: 'Create urgency with countdown', icon: '⏰' }
];

export default function WidgetsPage() {
  const [selectedType, setSelectedType] = useState<WidgetType>('exit-intent');
  const [config, setConfig] = useState<WidgetConfig>({
    type: 'exit-intent',
    title: 'Wait! Before you go...',
    message: 'Get 20% off your first purchase. Subscribe to our newsletter!',
    buttonText: 'Get My Discount',
    buttonUrl: '#subscribe',
    position: 'bottom',
    delay: 3000,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonColor: '#F59E0B'
  });
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const code = generateWidgetCode({ ...config, type: selectedType });
    setGeneratedCode(code);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedType}-widget.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateConfig = (key: keyof WidgetConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-bg-secondary border border-border-primary rounded-lg p-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4 bg-[#F59E0B]">
              <Layout className="h-6 w-6 text-black" />
            </div>
            <h1 className="text-4xl font-bold text-text-primary">Widget Library</h1>
          </div>
          <p className="text-lg text-text-secondary">
            Boost conversions with customizable on-site widgets
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Widget Type Selection */}
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-text-primary">Select Widget Type</h2>
              <div className="grid grid-cols-1 gap-3">
                {widgetTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      selectedType === type.id
                        ? 'bg-[#F59E0B]/10 border-[#F59E0B]'
                        : 'bg-bg-tertiary border-border-primary hover:border-border-hover'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{type.icon}</span>
                      <div className="flex-1">
                        <div className={`font-semibold ${selectedType === type.id ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {type.name}
                        </div>
                        <div className="text-sm text-text-tertiary">{type.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuration Form */}
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-text-primary">Customize Widget</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-text-primary">Title</label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => updateConfig('title', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-text-primary">Message</label>
                  <textarea
                    value={config.message}
                    onChange={(e) => updateConfig('message', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">Button Text</label>
                    <input
                      type="text"
                      value={config.buttonText}
                      onChange={(e) => updateConfig('buttonText', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">Button URL</label>
                    <input
                      type="text"
                      value={config.buttonUrl}
                      onChange={(e) => updateConfig('buttonUrl', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    />
                  </div>
                </div>

                {(selectedType === 'slide-in' || selectedType === 'sticky-bar') && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">Position</label>
                    <select
                      value={config.position}
                      onChange={(e) => updateConfig('position', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    >
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      {selectedType === 'slide-in' && (
                        <>
                          <option value="bottom-right">Bottom Right</option>
                          <option value="bottom-left">Bottom Left</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                {(selectedType === 'slide-in' || selectedType === 'social-proof') && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">Delay (ms)</label>
                    <input
                      type="number"
                      value={config.delay}
                      onChange={(e) => updateConfig('delay', parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-tertiary text-text-primary focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                    />
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">Background</label>
                    <input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                      className="w-full h-10 rounded-lg border border-border-primary bg-bg-tertiary cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">Text Color</label>
                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => updateConfig('textColor', e.target.value)}
                      className="w-full h-10 rounded-lg border border-border-primary bg-bg-tertiary cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-primary">Button Color</label>
                    <input
                      type="color"
                      value={config.buttonColor}
                      onChange={(e) => updateConfig('buttonColor', e.target.value)}
                      className="w-full h-10 rounded-lg border border-border-primary bg-bg-tertiary cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full px-6 py-3 rounded-lg bg-[#F59E0B] hover:bg-[#D97706] text-black font-semibold transition-colors flex items-center justify-center"
                >
                  <Code className="h-5 w-5 mr-2" />
                  Generate Widget Code
                </button>
              </div>
            </div>
          </div>

          {/* Code Output Panel */}
          <div className="space-y-6">
            <div className="bg-bg-secondary border border-border-primary rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-primary">Generated Code</h2>
                {generatedCode && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover transition-colors flex items-center text-sm"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-3 py-2 rounded-lg bg-bg-tertiary border border-border-primary text-text-primary hover:bg-bg-hover transition-colors flex items-center text-sm"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                )}
              </div>

              {generatedCode ? (
                <div className="bg-bg-tertiary rounded-lg p-4 max-h-[600px] overflow-auto">
                  <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap break-all">
                    {generatedCode}
                  </pre>
                </div>
              ) : (
                <div className="bg-bg-elevated rounded-lg p-12 text-center">
                  <Code className="h-16 w-16 mx-auto mb-4 text-text-tertiary" />
                  <p className="text-text-secondary">
                    Configure your widget and click "Generate Widget Code"
                  </p>
                </div>
              )}
            </div>

            {generatedCode && (
              <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6">
                <h3 className="font-semibold mb-2 text-text-primary flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-[#F59E0B]" />
                  Installation Instructions
                </h3>
                <ol className="text-sm text-text-secondary space-y-2 list-decimal list-inside">
                  <li>Copy the generated code above</li>
                  <li>Paste it before the closing <code className="bg-bg-secondary px-1 rounded">&lt;/body&gt;</code> tag in your HTML</li>
                  <li>The widget will automatically activate on page load</li>
                  <li>Test the widget in a private/incognito window</li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Free Tier Notice */}
        <div className="mt-8 bg-bg-tertiary border border-border-primary rounded-lg p-6">
          <div className="flex items-start">
            <Layout className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5 text-[#F59E0B]" />
            <div>
              <h4 className="font-semibold mb-1 text-text-primary">Pure JavaScript Widgets</h4>
              <p className="text-sm text-text-secondary">
                All widgets are generated as standalone JavaScript code with no external dependencies. Simply copy and paste into your website.
                <Link href="/pricing" className="ml-1 underline text-[#F59E0B] hover:text-[#D97706]">
                  Upgrade for advanced analytics
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

