# Mailchimp Integration Guide - MediaPlanPro

**Last Updated:** January 2025  
**Status:** Production Ready  
**Integration Type:** Email Marketing

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Features](#features)
5. [Usage Guide](#usage-guide)
6. [Troubleshooting](#troubleshooting)
7. [API Reference](#api-reference)

---

## 🎯 Overview

The Mailchimp integration allows MediaPlanPro to automatically sync contacts from your database to Mailchimp, enabling powerful email marketing campaigns and automation.

### What Gets Synced

The integration syncs contacts from three sources:

1. **Contact Form Submissions** (LeadCapture)
   - Visitors who submit the contact form
   - Tagged as "Lead" in Mailchimp

2. **Service Inquiries** (ServiceInquiry)
   - Users who inquire about services
   - Tagged as "Service Inquiry" in Mailchimp

3. **Service Purchases** (ServicePurchase)
   - Customers who purchase services
   - Tagged as "Customer" in Mailchimp

### Key Features

- ✅ Automatic contact syncing
- ✅ Manual bulk sync
- ✅ Newsletter sending from blog posts
- ✅ Analytics dashboard
- ✅ Error logging and monitoring
- ✅ Encrypted API key storage

---

## 📦 Prerequisites

### 1. Mailchimp Account

You need an active Mailchimp account. Sign up at [mailchimp.com](https://mailchimp.com) if you don't have one.

### 2. Mailchimp API Key

**How to get your API key:**

1. Log in to your Mailchimp account
2. Click your profile icon in the top right
3. Select "Account & Billing"
4. Go to "Extras" → "API keys"
5. Click "Create A Key"
6. Copy the API key (it looks like: `32c33c610c12220891a7d83908858ffb-us2`)

**Important:** The API key includes a server prefix (e.g., `us2`, `us10`, `us21`). You'll need both parts.

### 3. Mailchimp Audience (List)

You need at least one audience (list) in Mailchimp where contacts will be synced.

**How to create an audience:**

1. Go to "Audience" in Mailchimp
2. Click "Create Audience"
3. Fill in the required details
4. Note the audience ID (you'll select it during setup)

### 4. Admin Access

You need ADMIN role in MediaPlanPro to configure integrations.

---

## 🚀 Setup Instructions

### Step 1: Navigate to Integrations

1. Log in to MediaPlanPro as an ADMIN
2. Go to Admin Panel (top right menu)
3. Click "Integrations" tab
4. Find "Mailchimp" in the available integrations
5. Click "Connect"

### Step 2: Enter API Credentials

On the Mailchimp configuration page:

1. **API Key:** Paste your full Mailchimp API key
   - Example: `32c33c610c12220891a7d83908858ffb-us2`

2. **Server Prefix:** Enter the server prefix from your API key
   - Example: `us2` (the part after the dash in your API key)

### Step 3: Test Connection

1. Click "Test Connection" button
2. Wait for the test to complete
3. If successful, you'll see a list of your Mailchimp audiences

### Step 4: Select Default Audience

1. Choose the audience where contacts should be synced
2. This is typically your main email list

### Step 5: Configure Automations

Toggle the automation options:

- **Sync Contact Form Submissions** - Sync LeadCapture contacts
- **Sync Service Inquiries** - Sync ServiceInquiry contacts
- **Sync Service Purchases** - Sync ServicePurchase (customers)
- **Send Blog Newsletters** - Enable newsletter sending (optional)

### Step 6: Save Configuration

1. Click "Save Configuration"
2. Wait for confirmation
3. Your integration is now active!

---

## ✨ Features

### 1. Automatic Contact Syncing

**How it works:**
- When a new contact is created in MediaPlanPro (via forms, inquiries, or purchases)
- The system automatically syncs them to Mailchimp
- Contacts are tagged based on their source
- Duplicate emails are handled gracefully (updated, not duplicated)

**Tags Applied:**
- `Lead` - Contact form submissions
- `Service Inquiry` - Service inquiry submissions
- `Customer` - Service purchases

### 2. Manual Bulk Sync

**When to use:**
- Initial setup to sync existing contacts
- After fixing data issues
- To ensure all contacts are synced

**How to use:**
1. Go to `/dashboard/admin/integrations/mailchimp/sync`
2. Click "Start Bulk Sync"
3. Wait for the process to complete
4. Review the results

**What gets synced:**
- All LeadCapture records
- All ServiceInquiry records
- All ServicePurchase records

### 3. Blog Newsletter Sending

**How it works:**
- Create a blog post in MediaPlanPro
- Use the "Send Newsletter" feature
- System creates a Mailchimp campaign
- Sends to your selected audience

**Requirements:**
- Blog post must be published
- Must have a featured image (recommended)
- Must have an excerpt

### 4. Analytics Dashboard

**Metrics tracked:**
- Total syncs performed
- Successful syncs
- Failed syncs
- Success rate percentage
- Total contacts synced
- Activity over last 7 days
- Recent sync logs

**How to access:**
1. Go to `/dashboard/admin/integrations/mailchimp`
2. Scroll to "Analytics" section
3. View real-time metrics

### 5. Error Logging

**What's logged:**
- Every sync operation
- Success/failure status
- Error messages
- Request/response data
- Records processed
- Operation duration

**How to view logs:**
1. Go to Analytics dashboard
2. Scroll to "Recent Activity"
3. View detailed logs with timestamps

---

## 📖 Usage Guide

### Syncing a Single Contact

**Automatic (Recommended):**
- Contact is synced automatically when created
- No manual action needed

**Manual (via API):**
```bash
POST /api/integrations/mailchimp/sync
Content-Type: application/json

{
  "source": "lead_capture",  // or "service_inquiry" or "service_purchase"
  "recordId": "clh9f240u0001oarst5nnzu30"
}
```

### Bulk Syncing All Contacts

1. Navigate to `/dashboard/admin/integrations/mailchimp/sync`
2. Click "Start Bulk Sync"
3. Monitor progress (shows percentage complete)
4. Review results:
   - Total processed
   - Successful syncs
   - Failed syncs
   - Error details

### Sending a Newsletter

1. Create and publish a blog post
2. Go to the blog post edit page
3. Click "Send as Newsletter" (if available)
4. Select audience
5. Confirm and send

### Viewing Analytics

1. Go to `/dashboard/admin/integrations/mailchimp`
2. View metrics:
   - **Total Syncs** - All sync operations
   - **Successful** - Syncs that completed successfully
   - **Failed** - Syncs that encountered errors
   - **Success Rate** - Percentage of successful syncs
   - **Contacts Synced** - Total number of contacts synced

3. View activity chart:
   - Shows syncs per day for last 7 days
   - Helps identify sync patterns

4. View recent logs:
   - Last 50 sync operations
   - Timestamps, status, error messages
   - Records processed count

### Disconnecting Integration

1. Go to `/dashboard/admin/integrations`
2. Find Mailchimp in "Connected Integrations"
3. Click "Disconnect"
4. Confirm the action
5. Integration is deactivated (configuration preserved)

**Note:** Disconnecting does NOT delete contacts from Mailchimp. It only stops future syncing.

---

## 🔧 Troubleshooting

### Issue: "Failed to connect to Mailchimp"

**Possible causes:**
1. Invalid API key
2. Incorrect server prefix
3. API key doesn't have required permissions
4. Mailchimp account suspended

**Solutions:**
1. Verify API key is correct (copy-paste from Mailchimp)
2. Check server prefix matches your API key
3. Generate a new API key in Mailchimp
4. Check Mailchimp account status

### Issue: "Sync failed" errors

**Possible causes:**
1. Invalid email addresses
2. Mailchimp audience deleted
3. API rate limits exceeded
4. Network connectivity issues

**Solutions:**
1. Check error logs for specific email addresses
2. Verify audience still exists in Mailchimp
3. Wait a few minutes and retry
4. Check internet connection

### Issue: Contacts not appearing in Mailchimp

**Possible causes:**
1. Wrong audience selected
2. Contacts marked as unsubscribed
3. Sync automation disabled
4. Integration not active

**Solutions:**
1. Verify correct audience is selected
2. Check contact status in Mailchimp
3. Enable sync automations in settings
4. Ensure integration status is "ACTIVE"

### Issue: Duplicate contacts

**This should not happen** - The integration uses Mailchimp's "upsert" functionality which updates existing contacts instead of creating duplicates.

If you see duplicates:
1. Check if emails are slightly different (e.g., case sensitivity)
2. Verify Mailchimp audience settings
3. Contact support

### Issue: Analytics not updating

**Possible causes:**
1. No recent sync operations
2. Browser cache
3. Database connection issues

**Solutions:**
1. Perform a test sync
2. Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+R)
3. Check server logs

---

## 🔌 API Reference

### Endpoints

#### 1. Test Connection
```
POST /api/integrations/mailchimp/test
```

**Request:**
```json
{
  "apiKey": "your-api-key-us2",
  "serverPrefix": "us2"
}
```

**Response:**
```json
{
  "success": true,
  "connected": true,
  "audiences": [
    {
      "id": "abc123",
      "name": "Main List",
      "stats": {
        "member_count": 1500,
        "unsubscribe_count": 50,
        "cleaned_count": 10
      }
    }
  ]
}
```

#### 2. Sync Single Contact
```
POST /api/integrations/mailchimp/sync
```

**Request:**
```json
{
  "source": "lead_capture",
  "recordId": "clh9f240u0001oarst5nnzu30"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact synced successfully",
  "mailchimpId": "abc123def456"
}
```

#### 3. Bulk Sync
```
POST /api/integrations/mailchimp/bulk-sync
```

**Request:**
```json
{
  "source": "lead_capture"
}
```

**Response:**
```json
{
  "success": true,
  "total": 150,
  "successful": 148,
  "failed": 2,
  "errors": [
    {
      "email": "invalid@email",
      "error": "Invalid email format"
    }
  ]
}
```

#### 4. Get Analytics
```
GET /api/integrations/{integrationId}/analytics?days=7
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalSyncs": 500,
    "successfulSyncs": 495,
    "failedSyncs": 5,
    "totalContactsSynced": 1200,
    "successRate": 99.0,
    "last7Days": [
      { "date": "2025-01-20", "count": 50 },
      { "date": "2025-01-21", "count": 75 }
    ],
    "recentLogs": [...]
  }
}
```

---

## 📊 Best Practices

1. **Test First** - Always test connection before going live
2. **Start Small** - Sync a small batch first to verify everything works
3. **Monitor Logs** - Check analytics regularly for errors
4. **Clean Data** - Ensure email addresses are valid before syncing
5. **Segment Audiences** - Use tags to segment contacts in Mailchimp
6. **Respect Privacy** - Only sync contacts who opted in
7. **Regular Backups** - Export Mailchimp data regularly

---

## 🆘 Support

If you encounter issues not covered in this guide:

1. Check the error logs in Analytics dashboard
2. Review Mailchimp's API documentation
3. Contact MediaPlanPro support
4. Check Mailchimp's status page for outages

---

## 📝 Changelog

### January 2025
- ✅ Initial Mailchimp integration release
- ✅ Automatic contact syncing
- ✅ Bulk sync functionality
- ✅ Analytics dashboard
- ✅ Newsletter sending
- ✅ Error logging and monitoring

---

**Integration Status:** ✅ Production Ready  
**Last Tested:** January 2025  
**Supported Mailchimp API Version:** 3.0

