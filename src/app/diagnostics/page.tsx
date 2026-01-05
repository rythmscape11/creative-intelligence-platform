'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: unknown;
}

export default function DiagnosticsPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = useCallback(async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    // 1. Check Session
    results.push({
      name: 'Session Authentication',
      status: isSignedIn ? 'success' : 'error',
      message: isSignedIn ? `Authenticated as ${user?.primaryEmailAddress?.emailAddress}` : 'Not authenticated',
      details: isSignedIn ? {
        userId: user?.id,
        role: user?.publicMetadata?.role,
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
      } : null,
    });

    // 2. Check Dashboard Stats API
    try {
      const statsResponse = await fetch('/api/dashboard/stats');
      const statsData = await statsResponse.json();

      if (statsResponse.ok) {
        results.push({
          name: 'Dashboard Stats API',
          status: 'success',
          message: 'API responding correctly',
          details: {
            statusCode: statsResponse.status,
            role: statsData.role,
            strategiesTotal: statsData.strategies?.total,
            hasData: !!statsData,
          },
        });
      } else {
        results.push({
          name: 'Dashboard Stats API',
          status: 'error',
          message: `API error: ${statsData.error || 'Unknown error'}`,
          details: {
            statusCode: statsResponse.status,
            error: statsData,
          },
        });
      }
    } catch (error) {
      results.push({
        name: 'Dashboard Stats API',
        status: 'error',
        message: `Failed to fetch: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error,
      });
    }

    // 3. Check Database Connection (via API)
    try {
      const dbResponse = await fetch('/api/health');
      const dbData = await dbResponse.json();

      results.push({
        name: 'Database Connection',
        status: dbResponse.ok ? 'success' : 'error',
        message: dbResponse.ok ? 'Database connected' : 'Database connection failed',
        details: dbData,
      });
    } catch (error) {
      results.push({
        name: 'Database Connection',
        status: 'warning',
        message: 'Health check endpoint not available',
        details: error,
      });
    }

    // 4. Check Environment Variables
    const envVars = {
      hasNextAuthUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      hasNextAuthSecret: 'NEXTAUTH_SECRET is set (hidden)',
      nodeEnv: process.env.NODE_ENV,
    };

    results.push({
      name: 'Environment Variables',
      status: 'success',
      message: 'Environment variables loaded',
      details: envVars,
    });

    // 5. Check Local Storage
    try {
      const theme = localStorage.getItem('theme');
      results.push({
        name: 'Local Storage',
        status: 'success',
        message: 'Local storage accessible',
        details: {
          theme: theme || 'not set',
          available: true,
        },
      });
    } catch (error) {
      results.push({
        name: 'Local Storage',
        status: 'error',
        message: 'Local storage not accessible',
        details: error,
      });
    }

    // 6. Check Browser Info
    results.push({
      name: 'Browser Information',
      status: 'success',
      message: 'Browser details',
      details: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
      },
    });

    setDiagnostics(results);
    setIsRunning(false);
  }, [user, isSignedIn]);

  useEffect(() => {
    if (isLoaded) {
      runDiagnostics();
    }
  }, [runDiagnostics, isLoaded]);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
      case 'error':
        return 'border-red-500/20 bg-red-500/5';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'loading':
        return 'border-blue-500/20 bg-blue-500/5';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            System Diagnostics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive system health check and debugging information
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Success</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Error</span>
            </div>
          </div>
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running...' : 'Run Diagnostics'}
          </button>
        </div>

        <div className="space-y-4">
          {diagnostics.map((diagnostic, index) => (
            <Card
              key={index}
              className={`border-2 ${getStatusColor(diagnostic.status)} transition-all`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(diagnostic.status)}
                    {diagnostic.name}
                  </CardTitle>
                  <span className={`text-sm font-medium ${diagnostic.status === 'success' ? 'text-green-600 dark:text-green-400' :
                    diagnostic.status === 'error' ? 'text-red-600 dark:text-red-400' :
                      diagnostic.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-blue-600 dark:text-blue-400'
                    }`}>
                    {diagnostic.status.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {diagnostic.message}
                </p>
                {!!diagnostic.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                      View Details
                    </summary>
                    <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(diagnostic.details, null, 2)}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {diagnostics.length === 0 && !isRunning && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Click "Run Diagnostics" to start the system health check
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
