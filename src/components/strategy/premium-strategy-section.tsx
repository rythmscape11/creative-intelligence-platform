'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  type LucideIcon,
} from 'lucide-react';

// Premium Strategy Section Component
interface PremiumStrategySectionProps {
  title: string;
  icon: LucideIcon;
  content: any;
  sectionId: string;
  defaultExpanded?: boolean;
}

export function PremiumStrategySection({
  title,
  icon: Icon,
  content,
  sectionId,
  defaultExpanded = false,
}: PremiumStrategySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isCopied, setIsCopied] = useState(false);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  const copyToClipboard = async () => {
    try {
      const text = formatContentForCopy(content);
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatContentForCopy = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content.map((item, idx) => {
        if (typeof item === 'object') {
          return `${idx + 1}. ${formatObjectForCopy(item)}`;
        }
        return `${idx + 1}. ${item}`;
      }).join('\n');
    }

    if (typeof content === 'object' && content !== null) {
      return formatObjectForCopy(content);
    }

    return String(content);
  };

  const toTitleCase = (str: string): string => {
    return str
      .replace(/([A-Z])/g, ' $1') // Split camelCase
      .trim()
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatObjectForCopy = (obj: any): string => {
    return Object.entries(obj)
      .map(([key, value]) => {
        const formattedKey = toTitleCase(key);
        if (Array.isArray(value)) {
          return `${formattedKey}:\n${value.map((v, i) => `  ${i + 1}. ${v}`).join('\n')}`;
        }
        if (typeof value === 'object' && value !== null) {
          return `${formattedKey}:\n${formatObjectForCopy(value)}`;
        }
        return `${formattedKey}: ${value}`;
      })
      .join('\n');
  };

  if (!content) {
    return (
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-8 border border-gray-200 dark:border-[#2A2A2A] shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gray-100 dark:bg-[#2A2A2A] rounded-xl">
            <Icon className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 italic">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#1A1A1A] dark:to-[#111111] rounded-2xl border border-gray-200 dark:border-[#2A2A2A] shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Section Header */}
      <div className="p-6 border-b border-gray-200 dark:border-[#2A2A2A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={toggleSection}>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Click to {isExpanded ? 'collapse' : 'expand'} section
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-[#3A3A3A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#333333] transition-all shadow-sm hover:shadow-md"
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Copy</span>
                </>
              )}
            </button>

            <button
              onClick={toggleSection}
              className="p-2 bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-[#3A3A3A] rounded-lg hover:bg-gray-50 dark:hover:bg-[#333333] transition-all"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-8 animate-in fade-in slide-in-from-top-2 duration-300">
          {renderContent(content)}
        </div>
      )}
    </div>
  );
}

// Premium Content Rendering Functions
function renderContent(content: any): React.ReactNode {
  if (typeof content === 'string') {
    return (
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
      </div>
    );
  }

  if (Array.isArray(content)) {
    return (
      <div className="space-y-4">
        {content.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#0A0A0A] rounded-xl p-6 border border-gray-200 dark:border-[#2A2A2A] hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            {typeof item === 'object' ? renderObject(item) : (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">{String(item)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (typeof content === 'object') {
    return renderObject(content);
  }

  return <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{String(content)}</p>;
}

function renderObject(obj: any): React.ReactNode {
  return (
    <div className="space-y-6">
      {Object.entries(obj).map(([key, value]) => (
        <div key={key} className="group">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {key.replace(/([A-Z])/g, ' $1').trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
            </h3>
          </div>

          {typeof value === 'string' ? (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed ml-4 pl-4 border-l-2 border-gray-200 dark:border-[#2A2A2A] whitespace-pre-wrap">
              {value}
            </p>
          ) : Array.isArray(value) ? (
            <ul className="ml-4 space-y-3">
              {value.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  {typeof item === 'object' ? (
                    <div className="flex-1 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg p-4 border border-gray-200 dark:border-[#2A2A2A]">
                      <div className="space-y-2">
                        {Object.entries(item).map(([k, v]) => (
                          <div key={k} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                            <span className="font-semibold text-gray-900 dark:text-white min-w-[120px]">
                              {k.replace(/([A-Z])/g, ' $1').trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}:
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 flex-1">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">{String(item)}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : typeof value === 'object' && value !== null ? (
            <div className="ml-4 bg-gray-50 dark:bg-[#0A0A0A] rounded-lg p-4 border border-gray-200 dark:border-[#2A2A2A] space-y-3">
              {Object.entries(value).map(([k, v]) => (
                <div key={k} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white min-w-[140px]">
                    {k.replace(/([A-Z])/g, ' $1').trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 flex-1">{String(v)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 ml-4 pl-4 border-l-2 border-gray-200 dark:border-[#2A2A2A]">
              {String(value)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

