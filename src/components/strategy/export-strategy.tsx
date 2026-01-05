'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, FileSpreadsheet, Presentation, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ExportJob {
  id: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  progress: number;
  format: 'pptx' | 'docx' | 'xlsx';
  result?: {
    fileUrl: string;
    filename: string;
    expiresAt: string;
  };
  createdAt: string;
  error?: string;
}

interface ExportStrategyProps {
  strategyId: string;
  businessName: string;
}

const formatIcons = {
  pptx: Presentation,
  docx: FileText,
  xlsx: FileSpreadsheet,
};

const formatLabels = {
  pptx: 'PowerPoint Presentation',
  docx: 'Word Document',
  xlsx: 'Excel Spreadsheet',
};

const formatDescriptions = {
  pptx: 'Professional presentation slides with charts and visuals',
  docx: 'Comprehensive document with detailed strategy breakdown',
  xlsx: 'Structured data with budget allocation and timeline',
};

export function ExportStrategy({ strategyId, businessName }: ExportStrategyProps) {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [isExporting, setIsExporting] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const startExport = async (format: 'pptx' | 'docx' | 'xlsx') => {
    setIsExporting(prev => ({ ...prev, [format]: true }));

    try {
      const response = await fetch(`/api/strategies/${strategyId}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          customization: {
            colors: {
              primary: '#A8D8EA',
              secondary: '#E6E6FA',
              accent: '#FFAB91',
            },
          },
        }),
      });

      if (response.ok) {
        // Get the blob from response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${businessName.replace(/[^a-zA-Z0-9]/g, '_')}_Strategy.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: 'Export Complete',
          description: `${formatLabels[format]} downloaded successfully`,
        });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Export failed');
      }
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Failed to start export',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(prev => ({ ...prev, [format]: false }));
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/export/job/${jobId}`);
        const data = await response.json();

        if (data.success) {
          const jobData = data.data;

          setExportJobs(prev =>
            prev.map(job =>
              job.id === jobId
                ? {
                  ...job,
                  status: jobData.status,
                  progress: jobData.progress || 0,
                  result: jobData.result,
                  error: jobData.error,
                }
                : job
            )
          );

          // Stop polling if job is completed or failed
          if (jobData.status === 'completed' || jobData.status === 'failed') {
            clearInterval(pollInterval);

            if (jobData.status === 'completed') {
              toast({
                title: 'Export Completed',
                description: 'Your file is ready for download.',
              });
            } else {
              toast({
                title: 'Export Failed',
                description: jobData.error || 'Export failed',
                variant: 'destructive',
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to poll job status:', error);
        clearInterval(pollInterval);
      }
    }, 2000); // Poll every 2 seconds

    // Stop polling after 5 minutes
    setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000);
  };

  const downloadFile = async (jobId: string) => {
    try {
      const response = await fetch(`/api/export/download/${jobId}`);
      const data = await response.json();

      if (data.success) {
        // Open download URL in new tab
        window.open(data.data.downloadUrl, '_blank');

        toast({
          title: 'Download Started',
          description: 'Your file download has started.',
        });
      } else {
        throw new Error(data.message || 'Download failed');
      }
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: error instanceof Error ? error.message : 'Failed to download file',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-zinc-900" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-zinc-100 text-zinc-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export Strategy</CardTitle>
          <CardDescription>
            Export your marketing strategy for {businessName} in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['pptx', 'docx', 'xlsx'] as const).map((format) => {
              const Icon = formatIcons[format];
              const isLoading = isExporting[format];

              return (
                <Card key={format} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-zinc-900" />
                      <CardTitle className="text-lg">{formatLabels[format]}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      {formatDescriptions[format]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => startExport(format)}
                      disabled={isLoading}
                      className="w-full"
                      variant="outline"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Export {format.toUpperCase()}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {exportJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Export History</CardTitle>
            <CardDescription>
              Track your export jobs and download completed files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exportJobs.map((job) => {
                const Icon = formatIcons[job.format];

                return (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-zinc-900" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{formatLabels[job.format]}</span>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-700">
                          Started {new Date(job.createdAt).toLocaleString()}
                        </div>
                        {job.status === 'active' && (
                          <div className="mt-2">
                            <Progress value={job.progress} className="w-48" />
                            <div className="text-xs text-gray-700 mt-1">
                              {job.progress}% complete
                            </div>
                          </div>
                        )}
                        {job.error && (
                          <div className="text-sm text-red-600 mt-1">
                            Error: {job.error}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusIcon(job.status)}
                      {job.status === 'completed' && job.result && (
                        <Button
                          onClick={() => downloadFile(job.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
