# Mailchimp Integration Guide for MediaPlanPro

This guide will help you set up and configure the Mailchimp integration for MediaPlanPro to automatically sync contacts and send email campaigns.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Your Mailchimp API Key](#getting-your-mailchimp-api-key)
3. [Setting Up the Integration](#setting-up-the-integration)
4. [Configuring Automation](#configuring-automation)
5. [Testing the Integration](#testing-the-integration)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Features](#advanced-features)

---

## Prerequisites

Before you begin, make sure you have:

- ✅ A Mailchimp account (free or paid)
- ✅ Admin access to MediaPlanPro dashboard
- ✅ At least one audience (list) created in Mailchimp

---

## Getting Your Mailchimp API Key

### Step 1: Log in to Mailchimp

Go to [https://mailchimp.com](https://mailchimp.com) and log in to your account.

### Step 2: Navigate to API Keys

1. Click on your profile icon in the bottom left corner
2. Select **Account & Billing** from the dropdown
3. Click on **Extras** → **API keys**
4. Or go directly to: [https://admin.mailchimp.com/account/api/](https://admin.mailchimp.com/account/api/)

### Step 3: Create a New API Key

1. Scroll down to the **Your API keys** section
2. Click **Create A Key**
3. Give your key a descriptive name (e.g., "MediaPlanPro Integration")
4. Click **Generate Key**
5. **IMPORTANT**: Copy the API key immediately - you won't be able to see it again!

### Step 4: Find Your Server Prefix

Your API key will look something like this: `abc123def456ghi789jkl012mno345-us1`

The part after the dash (`us1` in this example) is your **server prefix**. Common prefixes include:
- `us1`, `us2`, `us3`, etc. (US servers)
- `eu1` (European servers)
- `au1` (Australian servers)

**Save both the API key and server prefix** - you'll need them in the next step.

---

## Setting Up the Integration

### Step 1: Access the Integrations Page

1. Log in to MediaPlanPro
2. Go to **Dashboard** → **Admin** → **Integrations**
3. Find the **Mailchimp** card in the "Available Integrations" section
4. Click **Connect**

### Step 2: Enter Your Credentials

1. Paste your **API Key** in the first field
2. Enter your **Server Prefix** (e.g., `us1`) in the second field
3. Click **Test Connection**

### Step 3: Verify Connection

If the connection is successful, you'll see:
- ✅ "Connection Successful!" message
- A list of your Mailchimp audiences

If the connection fails:
- ❌ Check that your API key is correct
- ❌ Verify the server prefix matches your API key
- ❌ Ensure your Mailchimp account is active

### Step 4: Select Default Audience

1. From the **Default Audience** dropdown, select the audience where new contacts should be added
2. This is typically your main newsletter list

### Step 5: Configure Automation Settings

Enable the automations you want:

- ☑️ **Sync contact form submissions** - Adds people who fill out the contact form
- ☑️ **Sync service inquiries** - Adds people who inquire about services
- ☑️ **Sync service purchases** - Adds customers who purchase services
- ☐ **Send blog post newsletters** - Automatically send new blog posts (coming soon)

### Step 6: Save Configuration

Click **Save Configuration** to activate the integration.

---

## Configuring Automation

### Contact Segmentation

MediaPlanPro automatically tags contacts in Mailchimp based on their source:

| Source | Tags Applied |
|--------|-------------|
| Contact Form | `contact_form`, service interest (if provided) |
| Service Inquiry | `service_inquiry`, service category, service name |
| Service Purchase | `customer`, `service_purchase`, service category, tier |
| Newsletter Signup | `newsletter`, page source |

### Merge Fields

The following merge fields are automatically populated:

| Field | Description | Example |
|-------|-------------|---------|
| `FNAME` | First name | John |
| `LNAME` | Last name | Doe |
| `PHONE` | Phone number | +1-555-0123 |
| `COMPANY` | Company name | Acme Corp |
| `INTEREST` | Service interest | SEO Services |
| `SERVICE` | Purchased service | Marketing Strategy |
| `TIER` | Service tier | PROFESSIONAL |
| `BUDGET` | Budget range | $5,000-$10,000 |
| `TIMELINE` | Project timeline | 1-3 months |

### Creating Automation Workflows in Mailchimp

#### Welcome Email for New Subscribers

1. In Mailchimp, go to **Automations** → **Create** → **Welcome new subscribers**
2. Set the trigger to: **When someone subscribes to your audience**
3. Add a filter: **Tag is** `newsletter`
4. Design your welcome email
5. Activate the automation

#### Lead Nurturing for Service Inquiries

1. Create a new automation: **Custom** → **Start from scratch**
2. Set the trigger to: **When a subscriber is added with tag** `service_inquiry`
3. Add a series of emails:
   - Day 0: Thank you for your inquiry
   - Day 2: Case study relevant to their interest
   - Day 5: Special offer or consultation booking
   - Day 10: Follow-up
4. Activate the automation

#### Onboarding for New Customers

1. Create a new automation: **Custom** → **Start from scratch**
2. Set the trigger to: **When a subscriber is added with tag** `customer`
3. Add onboarding emails:
   - Day 0: Welcome and next steps
   - Day 1: Getting started guide
   - Day 7: Check-in and support resources
   - Day 30: Feedback request
4. Activate the automation

---

## Testing the Integration

### Test 1: Contact Form Sync

1. Go to your MediaPlanPro contact page: `/contact`
2. Fill out the contact form with a test email
3. Submit the form
4. Check Mailchimp → **Audience** → **All contacts**
5. Verify the contact was added with the correct tags

### Test 2: Service Inquiry Sync

1. Go to a service page: `/services/seo-audit-optimization`
2. Submit an inquiry with a test email
3. Check Mailchimp for the new contact
4. Verify tags include `service_inquiry` and the service category

### Test 3: Service Purchase Sync

1. Complete a test purchase (use Razorpay test cards)
2. After payment confirmation, check Mailchimp
3. Verify the contact has `customer` and `service_purchase` tags

---

## Troubleshooting

### Contacts Not Syncing

**Problem**: Contacts are not appearing in Mailchimp

**Solutions**:
1. Check integration status in `/dashboard/admin/integrations`
2. Verify the integration is **Active** (green checkmark)
3. Check the **Last Sync** timestamp
4. Look for error messages in the integration card
5. Re-test the connection

### API Key Errors

**Problem**: "Failed to connect to Mailchimp" error

**Solutions**:
1. Verify your API key is correct (no extra spaces)
2. Check that the server prefix matches your API key
3. Ensure your Mailchimp account is not suspended
4. Try generating a new API key

### Duplicate Contacts

**Problem**: Same person appears multiple times in Mailchimp

**Solutions**:
- Mailchimp automatically handles duplicates by email address
- If you see duplicates, they likely have different email addresses
- Use Mailchimp's merge contacts feature to combine them

### Tags Not Applying

**Problem**: Contacts are added but tags are missing

**Solutions**:
1. Check that automation settings are enabled
2. Verify the integration has permission to add tags
3. Check Mailchimp's tag limits (free accounts have restrictions)
4. Re-save the integration configuration

---

## Advanced Features

### Custom Merge Fields

To add custom merge fields:

1. In Mailchimp, go to **Audience** → **Settings** → **Audience fields and *|MERGE|* tags**
2. Click **Add A Field**
3. Create fields like `BUDGET`, `TIMELINE`, `SERVICE`, etc.
4. MediaPlanPro will automatically populate these fields when available

### Segmentation Strategies

Create segments in Mailchimp for targeted campaigns:

**High-Value Leads**:
- Tag is `service_inquiry`
- Budget is greater than $5,000

**Recent Customers**:
- Tag is `customer`
- Signup date is in the last 30 days

**Service-Specific**:
- Tag contains `SEO` or `CONTENT_MARKETING`
- Status is subscribed

### Campaign Ideas

**Monthly Newsletter**:
- Send to all subscribers with tag `newsletter`
- Include latest blog posts, tips, and updates

**Service Promotion**:
- Send to contacts with tag `service_inquiry`
- Offer limited-time discount or free consultation

**Customer Success Stories**:
- Send to contacts with tag `customer`
- Share case studies and testimonials

---

## Environment Variables

For production deployment, add these to your `.env` file:

```bash
# Mailchimp Configuration
MAILCHIMP_API_KEY=your-api-key-here
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_REPLY_TO=hello@mediaplanpro.com

# Encryption Key (32 bytes for AES-256)
ENCRYPTION_KEY=your-64-character-hex-string-here

# App URL
NEXT_PUBLIC_APP_URL=https://www.mediaplanpro.com
```

**Security Note**: Never commit your `.env` file to version control!

---

## API Rate Limits

Mailchimp has the following rate limits:

- **Free accounts**: 500 contacts, 10 API calls per second
- **Paid accounts**: Unlimited contacts, 10 API calls per second

MediaPlanPro automatically handles rate limiting with:
- Async sync (doesn't block user requests)
- Error retry with exponential backoff
- Batch operations for bulk syncs

---

## Support

If you need help:

1. Check the integration logs in `/dashboard/admin/integrations`
2. Review Mailchimp's API documentation: [https://mailchimp.com/developer/](https://mailchimp.com/developer/)
3. Contact MediaPlanPro support with:
   - Integration ID
   - Error messages
   - Steps to reproduce the issue

---

## Next Steps

After setting up Mailchimp:

1. ✅ Create welcome email automation
2. ✅ Set up lead nurturing sequences
3. ✅ Design email templates with MediaPlanPro branding
4. ✅ Create segments for targeted campaigns
5. ✅ Monitor integration logs for any issues
6. ✅ Test all automation workflows

---

**Congratulations!** Your Mailchimp integration is now set up and ready to automatically sync contacts and power your email marketing campaigns. 🎉

