/**
 * Google Analytics Integration Library
 * 
 * Provides functions for:
 * - OAuth 2.0 authentication
 * - GA4 event tracking
 * - Analytics data retrieval
 * - Property management
 */

import { google } from 'googleapis';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { decrypt, encrypt } from './encryption';

// Types
export interface GoogleAnalyticsConfig {
  accessToken: string;
  refreshToken?: string;
  propertyId?: string;
  measurementId?: string;
}

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
}

export interface AnalyticsReport {
  dimensions?: string[];
  metrics: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  orderBy?: Array<{
    metric?: { metricName: string };
    dimension?: { dimensionName: string };
    desc?: boolean;
  }>;
  limit?: number;
}

// OAuth 2.0 Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_ANALYTICS_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_ANALYTICS_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_ANALYTICS_REDIRECT_URI || 
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/integrations/google-analytics/callback`;

// Scopes required for Google Analytics
const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/analytics.edit',
];

// Check if Google Analytics is properly configured
export const isGoogleAnalyticsConfigured =
  GOOGLE_CLIENT_ID &&
  GOOGLE_CLIENT_ID !== '' &&
  GOOGLE_CLIENT_SECRET &&
  GOOGLE_CLIENT_SECRET !== '';

if (!isGoogleAnalyticsConfigured) {
  console.warn('⚠️  Google Analytics credentials are not set. Integration features will not work until configured.');
}

/**
 * Create OAuth2 client
 */
export function createOAuth2Client() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

/**
 * Generate OAuth authorization URL
 */
export function getAuthorizationUrl(): string {
  if (!isGoogleAnalyticsConfigured) {
    throw new Error('Google Analytics is not configured. Please set GOOGLE_ANALYTICS_CLIENT_ID and GOOGLE_ANALYTICS_CLIENT_SECRET environment variables.');
  }

  const oauth2Client = createOAuth2Client();
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent', // Force consent screen to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(code: string) {
  if (!isGoogleAnalyticsConfigured) {
    throw new Error('Google Analytics is not configured.');
  }

  const oauth2Client = createOAuth2Client();
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Failed to obtain access and refresh tokens');
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date,
    };
  } catch (error: any) {
    console.error('Error exchanging code for tokens:', error);
    throw new Error(`Failed to exchange authorization code: ${error.message}`);
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<string> {
  if (!isGoogleAnalyticsConfigured) {
    throw new Error('Google Analytics is not configured.');
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    if (!credentials.access_token) {
      throw new Error('Failed to refresh access token');
    }

    return credentials.access_token;
  } catch (error: any) {
    console.error('Error refreshing access token:', error);
    throw new Error(`Failed to refresh access token: ${error.message}`);
  }
}

/**
 * Get Google Analytics properties for the authenticated user
 */
export async function getAnalyticsProperties(accessToken: string) {
  if (!isGoogleAnalyticsConfigured) {
    throw new Error('Google Analytics is not configured.');
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const analytics = google.analytics({
    version: 'v3',
    auth: oauth2Client,
  });

  try {
    // Get account summaries
    const response = await analytics.management.accountSummaries.list();
    
    return response.data.items || [];
  } catch (error: any) {
    console.error('Error fetching analytics properties:', error);
    throw new Error(`Failed to fetch analytics properties: ${error.message}`);
  }
}

/**
 * Get GA4 properties for the authenticated user
 */
export async function getGA4Properties(accessToken: string) {
  if (!isGoogleAnalyticsConfigured) {
    throw new Error('Google Analytics is not configured.');
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });

  const analyticsAdmin = google.analyticsadmin({
    version: 'v1beta',
    auth: oauth2Client,
  });

  try {
    // List all accounts
    const accountsResponse = await analyticsAdmin.accounts.list();
    const accounts = accountsResponse.data.accounts || [];

    const allProperties = [];

    // For each account, get properties
    for (const account of accounts) {
      if (account.name) {
        const propertiesResponse = await analyticsAdmin.properties.list({
          filter: `parent:${account.name}`,
        });
        
        const properties = propertiesResponse.data.properties || [];
        allProperties.push(...properties);
      }
    }

    return allProperties;
  } catch (error: any) {
    console.error('Error fetching GA4 properties:', error);
    throw new Error(`Failed to fetch GA4 properties: ${error.message}`);
  }
}

/**
 * Test Google Analytics connection
 */
export async function testGoogleAnalyticsConnection(config: GoogleAnalyticsConfig): Promise<boolean> {
  try {
    // Try to fetch properties to verify connection
    const properties = await getGA4Properties(config.accessToken);
    return properties.length >= 0; // Even 0 properties means connection works
  } catch (error: any) {
    console.error('Google Analytics connection test failed:', error);
    return false;
  }
}

/**
 * Run a GA4 report
 */
export async function runGA4Report(
  config: GoogleAnalyticsConfig,
  report: AnalyticsReport
) {
  if (!isGoogleAnalyticsConfigured) {
    throw new Error('Google Analytics is not configured.');
  }

  if (!config.propertyId) {
    throw new Error('Property ID is required to run reports');
  }

  try {
    // Create OAuth2 client with access token
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: config.accessToken });

    const analyticsDataClient = new BetaAnalyticsDataClient({
      authClient: oauth2Client as any,
    });

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${config.propertyId}`,
      dateRanges: [
        {
          startDate: report.dateRange.startDate,
          endDate: report.dateRange.endDate,
        },
      ],
      dimensions: report.dimensions?.map(name => ({ name })),
      metrics: report.metrics.map(name => ({ name })),
      orderBys: report.orderBy,
      limit: report.limit || 10,
    });

    return response;
  } catch (error: any) {
    console.error('Error running GA4 report:', error);
    throw new Error(`Failed to run GA4 report: ${error.message}`);
  }
}

/**
 * Get real-time data from GA4
 */
export async function getGA4RealtimeData(
  config: GoogleAnalyticsConfig,
  metrics: string[]
) {
  if (!isGoogleAnalyticsConfigured) {
    throw new Error('Google Analytics is not configured.');
  }

  if (!config.propertyId) {
    throw new Error('Property ID is required to get realtime data');
  }

  try {
    // Create OAuth2 client with access token
    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({ access_token: config.accessToken });

    const analyticsDataClient = new BetaAnalyticsDataClient({
      authClient: oauth2Client as any,
    });

    const [response] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${config.propertyId}`,
      metrics: metrics.map(name => ({ name })),
    });

    return response;
  } catch (error: any) {
    console.error('Error getting GA4 realtime data:', error);
    throw new Error(`Failed to get GA4 realtime data: ${error.message}`);
  }
}

/**
 * Format report data for display
 */
export function formatReportData(response: any) {
  const rows = response.rows || [];
  const dimensionHeaders = response.dimensionHeaders || [];
  const metricHeaders = response.metricHeaders || [];

  return rows.map((row: any) => {
    const formattedRow: Record<string, any> = {};

    // Add dimensions
    row.dimensionValues?.forEach((value: any, index: number) => {
      const header = dimensionHeaders[index];
      formattedRow[header.name] = value.value;
    });

    // Add metrics
    row.metricValues?.forEach((value: any, index: number) => {
      const header = metricHeaders[index];
      formattedRow[header.name] = value.value;
    });

    return formattedRow;
  });
}

