# Google Sheets Integration Setup Guide

## Overview
This guide explains how to set up Google Sheets integration for MediaPlanPro to automatically sync leads and subscriptions to Google Sheets for easy access and marketing automation campaigns.

## Features
- ✅ **Real-time sync** of leads and subscriptions to Google Sheets
- ✅ **Automatic deduplication** - prevents duplicate entries
- ✅ **Update existing rows** - subscription status changes are reflected
- ✅ **Batch sync option** - manual sync of all historical data
- ✅ **Error handling** - graceful failure without breaking lead capture
- ✅ **Admin-only access** - secure RBAC controls

## Prerequisites
1. Google Cloud Platform account
2. Admin access to MediaPlanPro
3. Access to environment variables (Vercel dashboard or `.env` file)

## Step-by-Step Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** > **New Project**
3. Enter project name: `MediaPlanPro Sheets Integration`
4. Click **Create**

### Step 2: Enable Google Sheets API

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Sheets API"
3. Click on **Google Sheets API**
4. Click **Enable**

### Step 3: Create Service Account

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Enter service account details:
   - **Name**: `mediaplanpro-sheets-sync`
   - **Description**: `Service account for syncing leads and subscriptions to Google Sheets`
4. Click **Create and Continue**
5. Grant role: **Editor** (or create custom role with Sheets access)
6. Click **Continue** > **Done**

### Step 4: Create Service Account Key

1. In **Credentials** page, find your service account
2. Click on the service account email
3. Go to **Keys** tab
4. Click **Add Key** > **Create new key**
5. Select **JSON** format
6. Click **Create**
7. **Save the downloaded JSON file securely** - you'll need it for environment variables

### Step 5: Create Google Sheets

#### Sheet 1: MediaPlanPro - Leads

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **Blank** to create a new sheet
3. Rename the sheet to: `MediaPlanPro - Leads`
4. Add the following headers in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Email | Phone | Company | Message | Source | Status | Lead Score | Notes | Service Interest | Budget Range | Hear About Us |

5. **Copy the Sheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
   Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

6. **Share the sheet with the service account**:
   - Click **Share** button
   - Paste the service account email (from Step 3)
   - Set permission to **Editor**
   - Uncheck "Notify people"
   - Click **Share**

#### Sheet 2: MediaPlanPro - Subscriptions

1. Create another new sheet
2. Rename to: `MediaPlanPro - Subscriptions`
3. Add the following headers in Row 1:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | User ID | Name | Email | Plan Type | Subscription Status | Start Date | End Date | Amount | Payment Method | Payment ID |

4. **Copy the Sheet ID** from the URL
5. **Share the sheet with the service account** (same as above)

### Step 6: Configure Environment Variables

1. Open the JSON key file you downloaded in Step 4
2. **Minify the JSON** (remove all line breaks and spaces):
   ```bash
   # Use an online JSON minifier or this command:
   cat service-account-key.json | jq -c
   ```

3. Add the following environment variables:

#### For Local Development (`.env` file):
```bash
# Google Sheets Integration
GOOGLE_SHEETS_CREDENTIALS='{"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
GOOGLE_SHEETS_LEADS_ID="your-leads-sheet-id"
GOOGLE_SHEETS_SUBSCRIPTIONS_ID="your-subscriptions-sheet-id"
```

#### For Production (Vercel):
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `mediaplanpro`
3. Go to **Settings** > **Environment Variables**
4. Add three new variables:
   - **Name**: `GOOGLE_SHEETS_CREDENTIALS`
     - **Value**: (paste the minified JSON from Step 6.2)
     - **Environment**: Production, Preview, Development
   - **Name**: `GOOGLE_SHEETS_LEADS_ID`
     - **Value**: (paste the Leads sheet ID from Step 5)
     - **Environment**: Production, Preview, Development
   - **Name**: `GOOGLE_SHEETS_SUBSCRIPTIONS_ID`
     - **Value**: (paste the Subscriptions sheet ID from Step 5)
     - **Environment**: Production, Preview, Development
5. Click **Save**
6. **Redeploy** your application for changes to take effect

### Step 7: Test the Integration

#### Test 1: Submit a Lead Form
1. Go to https://www.mediaplanpro.com/contact
2. Fill out the contact form
3. Submit the form
4. Check the **MediaPlanPro - Leads** Google Sheet
5. Verify that a new row was added with the lead data

#### Test 2: Check Server Logs
```bash
# In development
npm run dev
# Submit a form and check console logs for:
# [Google Sheets] Syncing lead: email@example.com
# [Google Sheets] ✅ Lead synced successfully: email@example.com

# In production (Vercel)
vercel logs --follow
# Submit a form and check logs
```

#### Test 3: Manual Batch Sync (Admin Only)
1. Sign in as an admin user
2. Open browser console (F12)
3. Run the following command:
   ```javascript
   fetch('/api/admin/sync-to-sheets', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ syncType: 'all' })
   })
   .then(res => res.json())
   .then(data => console.log(data));
   ```
4. Check the response for sync results
5. Verify that all historical leads and subscriptions are now in Google Sheets

## API Endpoints

### 1. Manual Batch Sync (Admin Only)
```bash
POST /api/admin/sync-to-sheets
Content-Type: application/json

{
  "syncType": "all" | "leads" | "subscriptions"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sync completed successfully",
  "results": {
    "leads": {
      "success": 150,
      "failed": 0,
      "total": 150
    },
    "subscriptions": {
      "success": 25,
      "failed": 0,
      "total": 25
    }
  }
}
```

### 2. Get Sync Status (Admin Only)
```bash
GET /api/admin/sync-to-sheets
```

**Response:**
```json
{
  "configured": true,
  "leadsSheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "subscriptionsSheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "counts": {
    "leads": 150,
    "subscriptions": 25
  }
}
```

## Automatic Sync Triggers

The following actions automatically sync data to Google Sheets:

1. **Contact Form Submission** (`/api/contact`)
   - Syncs to Leads sheet
   - Includes: name, email, phone, company, message, service interest, budget range

2. **Lead Capture Form** (`/api/lead-capture`)
   - Syncs to Leads sheet
   - Includes: name, email, source, page, tool ID

3. **Service Inquiry Form** (`/api/services/inquiry`)
   - Syncs to Leads sheet
   - Includes: name, email, phone, company, service category, budget, timeline

4. **Subscription Created/Updated** (Future implementation)
   - Syncs to Subscriptions sheet
   - Includes: user ID, name, email, plan type, status, dates, amount, payment method

## Troubleshooting

### Issue: "Google Sheets sync skipped (not configured)"
**Cause:** Environment variables not set or invalid

**Solution:**
1. Verify `GOOGLE_SHEETS_CREDENTIALS` is set correctly
2. Verify `GOOGLE_SHEETS_LEADS_ID` and `GOOGLE_SHEETS_SUBSCRIPTIONS_ID` are set
3. Check that JSON credentials are properly minified (no line breaks)
4. Restart dev server or redeploy to Vercel

### Issue: "Error syncing lead: 403 Forbidden"
**Cause:** Service account doesn't have access to the sheet

**Solution:**
1. Open the Google Sheet
2. Click **Share**
3. Add the service account email with **Editor** permission
4. Try syncing again

### Issue: "Error syncing lead: Invalid credentials"
**Cause:** JSON credentials are malformed or expired

**Solution:**
1. Download a new JSON key from Google Cloud Console
2. Minify the JSON properly
3. Update `GOOGLE_SHEETS_CREDENTIALS` environment variable
4. Restart/redeploy

### Issue: Duplicate entries in Google Sheets
**Cause:** Deduplication logic not working

**Solution:**
1. Check that email column (Column C) is correct
2. Verify `findLeadByEmail()` function is working
3. Manually remove duplicates from sheet
4. Test with a new lead submission

## Security Best Practices

1. **Never commit credentials to Git**
   - Add `service-account-key.json` to `.gitignore`
   - Use environment variables only

2. **Restrict service account permissions**
   - Only grant access to specific sheets
   - Use least privilege principle

3. **Limit admin access**
   - Only ADMIN role can trigger manual sync
   - Regular users cannot access sync endpoints

4. **Monitor sync logs**
   - Check Vercel logs regularly
   - Set up alerts for sync failures

## Next Steps

1. ✅ Set up Google Sheets integration (this guide)
2. ✅ Test lead capture sync
3. ✅ Test subscription sync (when subscriptions are created)
4. ✅ Set up automated reports using Google Sheets
5. ✅ Create marketing automation workflows
6. ✅ Export data for analysis and campaigns

## Support

- **Google Sheets API Documentation**: https://developers.google.com/sheets/api
- **Google Cloud Console**: https://console.cloud.google.com/
- **Vercel Environment Variables**: https://vercel.com/docs/environment-variables

