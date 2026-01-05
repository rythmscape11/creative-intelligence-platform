/**
 * Google Sheets Integration
 * 
 * Real-time sync of leads and subscriptions to Google Sheets
 * for easy access and marketing automation campaigns.
 */

import { google } from 'googleapis';

/**
 * Google Sheets configuration
 */
const GOOGLE_SHEETS_CONFIG = {
  // Leads sheet ID (create this sheet manually and add the ID here)
  leadsSheetId: process.env.GOOGLE_SHEETS_LEADS_ID || '',
  // Subscriptions sheet ID (create this sheet manually and add the ID here)
  subscriptionsSheetId: process.env.GOOGLE_SHEETS_SUBSCRIPTIONS_ID || '',
  // Service account credentials (JSON string)
  credentials: process.env.GOOGLE_SHEETS_CREDENTIALS || '',
};

/**
 * Initialize Google Sheets API client
 */
function getGoogleSheetsClient() {
  if (!GOOGLE_SHEETS_CONFIG.credentials) {
    console.warn('⚠️  GOOGLE_SHEETS_CREDENTIALS not configured. Google Sheets sync disabled.');
    return null;
  }

  try {
    const credentials = JSON.parse(GOOGLE_SHEETS_CONFIG.credentials);
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Error initializing Google Sheets client:', error);
    return null;
  }
}

/**
 * Lead data interface
 */
export interface LeadData {
  timestamp: Date;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source: string;
  status?: string;
  leadScore?: number;
  notes?: string;
  serviceInterest?: string;
  budgetRange?: string;
  hearAboutUs?: string;
}

/**
 * Subscription data interface
 */
export interface SubscriptionData {
  timestamp: Date;
  userId: string;
  name: string;
  email: string;
  planType: string;
  subscriptionStatus: string;
  startDate: Date;
  endDate?: Date;
  amount: number;
  paymentMethod: string;
  paymentId: string;
}

/**
 * Sync lead to Google Sheets
 */
export async function syncLeadToGoogleSheets(lead: LeadData): Promise<boolean> {
  const sheets = getGoogleSheetsClient();
  
  if (!sheets || !GOOGLE_SHEETS_CONFIG.leadsSheetId) {
    console.log('Google Sheets sync skipped (not configured)');
    return false;
  }

  try {
    console.log('[Google Sheets] Syncing lead:', lead.email);

    // Check if lead already exists
    const existingLead = await findLeadByEmail(lead.email);
    
    if (existingLead) {
      console.log('[Google Sheets] Lead already exists, skipping:', lead.email);
      return true;
    }

    // Prepare row data
    const row = [
      lead.timestamp.toISOString(),
      lead.name,
      lead.email,
      lead.phone || '',
      lead.company || '',
      lead.message || '',
      lead.source,
      lead.status || 'New',
      lead.leadScore || 0,
      lead.notes || '',
      lead.serviceInterest || '',
      lead.budgetRange || '',
      lead.hearAboutUs || '',
    ];

    // Append row to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.leadsSheetId,
      range: 'Sheet1!A:M', // Adjust range based on your sheet structure
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    console.log('[Google Sheets] ✅ Lead synced successfully:', lead.email);
    return true;
  } catch (error) {
    console.error('[Google Sheets] ❌ Error syncing lead:', error);
    return false;
  }
}

/**
 * Find lead by email in Google Sheets
 */
async function findLeadByEmail(email: string): Promise<boolean> {
  const sheets = getGoogleSheetsClient();
  
  if (!sheets || !GOOGLE_SHEETS_CONFIG.leadsSheetId) {
    return false;
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.leadsSheetId,
      range: 'Sheet1!C:C', // Column C contains emails
    });

    const values = response.data.values || [];
    return values.some(row => row[0] === email);
  } catch (error) {
    console.error('[Google Sheets] Error finding lead:', error);
    return false;
  }
}

/**
 * Sync subscription to Google Sheets
 */
export async function syncSubscriptionToGoogleSheets(subscription: SubscriptionData): Promise<boolean> {
  const sheets = getGoogleSheetsClient();
  
  if (!sheets || !GOOGLE_SHEETS_CONFIG.subscriptionsSheetId) {
    console.log('Google Sheets sync skipped (not configured)');
    return false;
  }

  try {
    console.log('[Google Sheets] Syncing subscription:', subscription.email);

    // Check if subscription already exists
    const existingRow = await findSubscriptionByPaymentId(subscription.paymentId);
    
    if (existingRow !== null) {
      // Update existing row
      console.log('[Google Sheets] Updating existing subscription:', subscription.paymentId);
      return await updateSubscriptionRow(existingRow, subscription);
    }

    // Prepare row data
    const row = [
      subscription.timestamp.toISOString(),
      subscription.userId,
      subscription.name,
      subscription.email,
      subscription.planType,
      subscription.subscriptionStatus,
      subscription.startDate.toISOString(),
      subscription.endDate?.toISOString() || '',
      subscription.amount,
      subscription.paymentMethod,
      subscription.paymentId,
    ];

    // Append row to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.subscriptionsSheetId,
      range: 'Sheet1!A:K', // Adjust range based on your sheet structure
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    console.log('[Google Sheets] ✅ Subscription synced successfully:', subscription.email);
    return true;
  } catch (error) {
    console.error('[Google Sheets] ❌ Error syncing subscription:', error);
    return false;
  }
}

/**
 * Find subscription by payment ID in Google Sheets
 */
async function findSubscriptionByPaymentId(paymentId: string): Promise<number | null> {
  const sheets = getGoogleSheetsClient();
  
  if (!sheets || !GOOGLE_SHEETS_CONFIG.subscriptionsSheetId) {
    return null;
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.subscriptionsSheetId,
      range: 'Sheet1!K:K', // Column K contains payment IDs
    });

    const values = response.data.values || [];
    const rowIndex = values.findIndex(row => row[0] === paymentId);
    
    return rowIndex !== -1 ? rowIndex + 1 : null; // +1 because sheets are 1-indexed
  } catch (error) {
    console.error('[Google Sheets] Error finding subscription:', error);
    return null;
  }
}

/**
 * Update subscription row in Google Sheets
 */
async function updateSubscriptionRow(rowNumber: number, subscription: SubscriptionData): Promise<boolean> {
  const sheets = getGoogleSheetsClient();
  
  if (!sheets || !GOOGLE_SHEETS_CONFIG.subscriptionsSheetId) {
    return false;
  }

  try {
    const row = [
      subscription.timestamp.toISOString(),
      subscription.userId,
      subscription.name,
      subscription.email,
      subscription.planType,
      subscription.subscriptionStatus,
      subscription.startDate.toISOString(),
      subscription.endDate?.toISOString() || '',
      subscription.amount,
      subscription.paymentMethod,
      subscription.paymentId,
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.subscriptionsSheetId,
      range: `Sheet1!A${rowNumber}:K${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    console.log('[Google Sheets] ✅ Subscription updated successfully');
    return true;
  } catch (error) {
    console.error('[Google Sheets] ❌ Error updating subscription:', error);
    return false;
  }
}

/**
 * Batch sync all leads from database to Google Sheets
 */
export async function batchSyncLeadsToGoogleSheets(leads: LeadData[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const lead of leads) {
    const result = await syncLeadToGoogleSheets(lead);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Batch sync all subscriptions from database to Google Sheets
 */
export async function batchSyncSubscriptionsToGoogleSheets(subscriptions: SubscriptionData[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const subscription of subscriptions) {
    const result = await syncSubscriptionToGoogleSheets(subscription);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
}

