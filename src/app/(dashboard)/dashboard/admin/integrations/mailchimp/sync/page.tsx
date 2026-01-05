'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Mail,
  ShoppingCart,
} from 'lucide-react';

interface SyncResult {
  source: string;
  total: number;
  successful: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}

type BulkSyncResponse = {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  errors?: Array<{ email: string; error: string }>;
};

export default function MailchimpBulkSyncPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSource, setCurrentSource] = useState('');
  const [results, setResults] = useState<SyncResult[]>([]);
  const [totalProcessed, setTotalProcessed] = useState(0);
  const [totalSuccessful, setTotalSuccessful] = useState(0);
  const [totalFailed, setTotalFailed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/auth/signin');
    }
  }, [isLoaded, isSignedIn, router]);

  const handleBulkSync = async () => {
    try {
      setSyncing(true);
      setProgress(0);
      setResults([]);
      setTotalProcessed(0);
      setTotalSuccessful(0);
      setTotalFailed(0);
      setError(null);

      // Sync contacts from LeadCapture
      setCurrentSource('Contact Form Submissions');
      setProgress(10);
      const leadCaptureResponse = await fetch('/api/integrations/mailchimp/bulk-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'lead_capture' }),
      });
      const leadCaptureData: BulkSyncResponse = await leadCaptureResponse.json();

      if (leadCaptureData.success) {
        setResults(prev => [...prev, {
          source: 'Contact Form Submissions',
          total: leadCaptureData.total,
          successful: leadCaptureData.successful,
          failed: leadCaptureData.failed,
          errors: leadCaptureData.errors || [],
        }]);
        setTotalProcessed(prev => prev + leadCaptureData.total);
        setTotalSuccessful(prev => prev + leadCaptureData.successful);
        setTotalFailed(prev => prev + leadCaptureData.failed);
      }

      // Sync contacts from ServiceInquiry
      setCurrentSource('Service Inquiries');
      setProgress(40);
      const inquiryResponse = await fetch('/api/integrations/mailchimp/bulk-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'service_inquiry' }),
      });
      const inquiryData: BulkSyncResponse = await inquiryResponse.json();

      if (inquiryData.success) {
        setResults(prev => [...prev, {
          source: 'Service Inquiries',
          total: inquiryData.total,
          successful: inquiryData.successful,
          failed: inquiryData.failed,
          errors: inquiryData.errors || [],
        }]);
        setTotalProcessed(prev => prev + inquiryData.total);
        setTotalSuccessful(prev => prev + inquiryData.successful);
        setTotalFailed(prev => prev + inquiryData.failed);
      }

      // Sync contacts from ServicePurchase
      setCurrentSource('Service Purchases');
      setProgress(70);
      const purchaseResponse = await fetch('/api/integrations/mailchimp/bulk-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'service_purchase' }),
      });
      const purchaseData: BulkSyncResponse = await purchaseResponse.json();

      if (purchaseData.success) {
        setResults(prev => [...prev, {
          source: 'Service Purchases (Customers)',
          total: purchaseData.total,
          successful: purchaseData.successful,
          failed: purchaseData.failed,
          errors: purchaseData.errors || [],
        }]);
        setTotalProcessed(prev => prev + purchaseData.total);
        setTotalSuccessful(prev => prev + purchaseData.successful);
        setTotalFailed(prev => prev + purchaseData.failed);
      }

      setProgress(100);
      setCurrentSource('Complete');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred during sync';
      console.error('Bulk sync error:', error);
      setError(message);
    } finally {
      setSyncing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-secondary mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin/integrations/mailchimp"
            className="inline-flex items-center text-sm mb-6 transition-colors text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mailchimp Settings
          </Link>

          <div className="flex items-center mb-4">
            <div className="p-3 bg-[#FFE01B]/20 rounded-lg mr-4">
              <RefreshCw className="h-8 w-8 text-[#FFE01B]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-primary">Bulk Contact Sync</h1>
              <p className="text-text-secondary">Sync all existing contacts to Mailchimp</p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Sync Error</h3>
                <p className="text-text-secondary">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-4 px-4 py-2 bg-bg-tertiary text-text-primary rounded-lg hover:bg-bg-hover transition-colors text-sm font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sync Button */}
        {!syncing && results.length === 0 && !error && (
          <div className="bg-bg-secondary rounded-xl border border-border-primary p-8 mb-8">
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-secondary/20 rounded-full mb-4">
                  <Users className="h-8 w-8 text-accent-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Ready to Sync Contacts</h2>
                <p className="text-text-secondary max-w-2xl mx-auto">
                  This will sync all contacts from your database to Mailchimp. This includes:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-bg-primary border border-border-primary rounded-lg p-4">
                  <Mail className="h-6 w-6 text-blue-500 mb-2 mx-auto" />
                  <p className="text-text-primary font-semibold">Contact Forms</p>
                  <p className="text-sm text-text-secondary">Lead submissions</p>
                </div>
                <div className="bg-bg-primary border border-border-primary rounded-lg p-4">
                  <Users className="h-6 w-6 text-green-500 mb-2 mx-auto" />
                  <p className="text-text-primary font-semibold">Service Inquiries</p>
                  <p className="text-sm text-text-secondary">Service requests</p>
                </div>
                <div className="bg-bg-primary border border-border-primary rounded-lg p-4">
                  <ShoppingCart className="h-6 w-6 text-purple-500 mb-2 mx-auto" />
                  <p className="text-text-primary font-semibold">Customers</p>
                  <p className="text-sm text-text-secondary">Service purchases</p>
                </div>
              </div>

              <button
                onClick={handleBulkSync}
                className="px-8 py-4 bg-accent-highlight text-white rounded-lg hover:bg-blue-600 transition-colors font-bold text-lg inline-flex items-center shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Start Bulk Sync
              </button>

            </div>
          </div>
        )}

        {/* Progress */}
        {syncing && (
          <div className="bg-bg-secondary rounded-xl border border-border-primary p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-highlight mb-4"></div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Syncing Contacts...</h2>
              <p className="text-text-secondary text-lg">{currentSource}</p>
            </div>

            <div className="w-full bg-bg-tertiary rounded-full h-4 mb-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-accent-highlight to-blue-500 h-4 rounded-full transition-all duration-500 shadow-glow-md"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-text-primary font-semibold text-lg">{progress}% Complete</p>

            {/* Real-time Stats */}
            {(totalProcessed > 0 || totalSuccessful > 0 || totalFailed > 0) && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-bg-tertiary rounded-lg p-4 text-center">
                  <p className="text-text-secondary text-sm mb-1">Processed</p>
                  <p className="text-text-primary text-2xl font-bold">{totalProcessed}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-green-400 text-sm mb-1">Successful</p>
                  <p className="text-green-400 text-2xl font-bold">{totalSuccessful}</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
                  <p className="text-red-400 text-sm mb-1">Failed</p>
                  <p className="text-red-400 text-2xl font-bold">{totalFailed}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-bg-secondary rounded-xl border border-border-primary p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Sync Summary</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-text-secondary font-medium">Total Processed</span>
                    <Users className="h-6 w-6 text-accent-highlight" />
                  </div>
                  <p className="text-4xl font-bold text-text-primary">{totalProcessed}</p>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 hover:border-green-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-400 font-medium">Successful</span>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-4xl font-bold text-green-400">{totalSuccessful}</p>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 hover:border-red-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-red-400 font-medium">Failed</span>
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <p className="text-4xl font-bold text-red-400">{totalFailed}</p>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={index} className="bg-bg-tertiary border border-border-primary rounded-lg p-6 hover:border-border-hover transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-text-primary">{result.source}</h3>
                      <span className="text-sm font-medium text-text-secondary bg-bg-primary px-3 py-1 rounded-full">
                        {result.total} contacts
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-base">
                      <span className="text-green-400 font-medium flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {result.successful} successful
                      </span>
                      {result.failed > 0 && (
                        <span className="text-red-400 font-medium flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          {result.failed} failed
                        </span>
                      )}
                    </div>

                    {result.errors.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border-primary">
                        <p className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Errors ({result.errors.length}):
                        </p>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar bg-bg-primary rounded-lg p-3">
                          {result.errors.map((error, errorIndex) => (
                            <div key={errorIndex} className="text-sm text-text-secondary border-l-2 border-red-500/30 pl-3 py-1">
                              <span className="text-red-400 font-medium">{error.email}:</span>{' '}
                              <span className="text-text-tertiary">{error.error}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setResults([]);
                    setTotalProcessed(0);
                    setTotalSuccessful(0);
                    setTotalFailed(0);
                    setError(null);
                  }}
                  className="px-8 py-4 bg-accent-highlight text-white rounded-lg hover:bg-blue-600 transition-colors font-bold text-lg inline-flex items-center shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Run Another Sync
                </button>
                <Link
                  href="/dashboard/admin/integrations/mailchimp"
                  className="px-8 py-4 bg-bg-tertiary text-text-primary rounded-lg hover:bg-bg-hover transition-colors font-bold text-lg inline-flex items-center"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Settings
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
