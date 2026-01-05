'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DocumentArrowDownIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
  TableCellsIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface ExportRecord {
  id: string;
  strategyId: string;
  strategyTitle: string;
  format: 'PDF' | 'DOCX' | 'PPTX' | 'CSV';
  createdAt: string;
  fileSize: string;
  downloadUrl?: string;
}

const formatIcons: Record<string, React.ElementType> = {
  PDF: DocumentTextIcon,
  DOCX: DocumentTextIcon,
  PPTX: PresentationChartBarIcon,
  CSV: TableCellsIcon
};

const formatColors: Record<string, { bg: string; text: string }> = {
  PDF: { bg: 'bg-red-500/20', text: 'text-red-400' },
  DOCX: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  PPTX: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  CSV: { bg: 'bg-green-500/20', text: 'text-green-400' }
};

export default function ExportsPage() {
  const [exports, setExports] = useState<ExportRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'PDF' | 'DOCX' | 'PPTX' | 'CSV'>('all');

  useEffect(() => {
    async function fetchExports() {
      try {
        const response = await fetch('/api/user/exports');
        if (response.ok) {
          const data = await response.json();
          setExports(data.exports || []);
        }
      } catch (error) {
        console.error('Failed to fetch exports:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExports();
  }, []);

  const filteredExports = filter === 'all'
    ? exports
    : exports.filter(e => e.format === filter);

  const exportCounts = {
    all: exports.length,
    PDF: exports.filter(e => e.format === 'PDF').length,
    DOCX: exports.filter(e => e.format === 'DOCX').length,
    PPTX: exports.filter(e => e.format === 'PPTX').length,
    CSV: exports.filter(e => e.format === 'CSV').length
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="p-2 rounded-lg hover:bg-bg-secondary transition-colors">
                <ArrowLeftIcon className="h-5 w-5 text-text-secondary" />
              </Link>
              <h1 className="text-3xl font-bold text-text-primary">Export History</h1>
            </div>
            <p className="text-text-secondary ml-10">
              View and download your exported strategy documents
            </p>
          </div>

          <Link
            href="/dashboard/strategies/create"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            Create & Export Strategy
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'PDF', 'DOCX', 'PPTX', 'CSV'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === type
                  ? 'bg-green-500 text-white'
                  : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                }`}
            >
              {type === 'all' ? 'All' : type} ({exportCounts[type]})
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(['PDF', 'DOCX', 'PPTX', 'CSV'] as const).map((format) => {
            const Icon = formatIcons[format];
            const colors = formatColors[format];
            return (
              <div
                key={format}
                className="bg-bg-secondary border border-border-primary rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-primary">{exportCounts[format]}</p>
                    <p className="text-xs text-text-secondary">{format} exports</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Exports Table */}
        <div className="bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-text-secondary mt-4">Loading exports...</p>
            </div>
          ) : filteredExports.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-tertiary">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Strategy</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Format</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-secondary">Size</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-primary">
                  {filteredExports.map((exportRecord) => {
                    const Icon = formatIcons[exportRecord.format];
                    const colors = formatColors[exportRecord.format];
                    return (
                      <tr key={exportRecord.id} className="hover:bg-bg-tertiary">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${colors.bg} rounded flex items-center justify-center`}>
                              <Icon className={`h-4 w-4 ${colors.text}`} />
                            </div>
                            <span className="text-text-primary font-medium">{exportRecord.strategyTitle}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded ${colors.bg} ${colors.text}`}>
                            {exportRecord.format}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-secondary text-sm">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(exportRecord.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-text-secondary text-sm">
                          {exportRecord.fileSize}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/strategies/${exportRecord.strategyId}`}
                              className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                              title="View Strategy"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </Link>
                            {exportRecord.downloadUrl && (
                              <a
                                href={exportRecord.downloadUrl}
                                download
                                className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                                title="Download"
                              >
                                <ArrowDownTrayIcon className="h-5 w-5" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <DocumentArrowDownIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No exports yet</h3>
              <p className="text-text-secondary mb-4">
                {filter === 'all'
                  ? 'Create a strategy and export it to see your history'
                  : `No ${filter} exports found`}
              </p>
              <Link
                href="/dashboard/strategies/create"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Create Strategy
              </Link>
            </div>
          )}
        </div>

        {/* Quick Export Formats Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-red-500/20 rounded flex items-center justify-center">
                <DocumentTextIcon className="h-4 w-4 text-red-400" />
              </div>
              <h3 className="font-medium text-text-primary">PDF Export</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Professional document format, perfect for printing and sharing
            </p>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-orange-500/20 rounded flex items-center justify-center">
                <PresentationChartBarIcon className="h-4 w-4 text-orange-400" />
              </div>
              <h3 className="font-medium text-text-primary">PPTX Export</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Presentation format, ideal for client meetings and pitches
            </p>
          </div>

          <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                <DocumentTextIcon className="h-4 w-4 text-blue-400" />
              </div>
              <h3 className="font-medium text-text-primary">DOCX Export</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Editable document format, great for customization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
