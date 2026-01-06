# Resend Domain Verification Setup Guide

## Overview
This guide explains how to verify your domain (`mediaplanpro.com`) in Resend to send emails from `hello@mediaplanpro.com` instead of the default `onboarding@resend.dev`.

## Why Domain Verification is Important
1. **Better Deliverability**: Emails from your own domain are less likely to land in spam
2. **Professional Branding**: Emails come from `hello@mediaplanpro.com` instead of `onboarding@resend.dev`
3. **Higher Trust**: Recipients trust emails from verified domains
4. **No Rate Limits**: Verified domains have higher sending limits

## Current Status
- ✅ Resend API Key configured: `RESEND_API_KEY`
- ✅ Environment variables added:
  - `RESEND_FROM_EMAIL="hello@mediaplanpro.com"`
  - `RESEND_FROM_NAME="MediaPlanPro"`
  - `RESEND_REPLY_TO_EMAIL="hello@mediaplanpro.com"`
- ⏳ **Domain verification pending**: `mediaplanpro.com` needs to be verified in Resend

## Step-by-Step Domain Verification

### Step 1: Log in to Resend Dashboard
1. Go to https://resend.com/login
2. Log in with your Resend account credentials

### Step 2: Add Your Domain
1. Navigate to **Domains** in the left sidebar
2. Click **Add Domain**
3. Enter your domain: `mediaplanpro.com`
4. Click **Add**

### Step 3: Add DNS Records
Resend will provide you with DNS records to add to your domain. You'll need to add these records to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare, etc.):

**Typical DNS Records Required:**

1. **SPF Record** (TXT):
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:_spf.resend.com ~all
   ```

2. **DKIM Record** (TXT):
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [Provided by Resend - unique to your account]
   ```

3. **DMARC Record** (TXT) - Optional but recommended:
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:hello@mediaplanpro.com
   ```

### Step 4: Add DNS Records to Your Domain Registrar

#### If using Hostinger DNS (For mediaplanpro.com - RECOMMENDED):

**Context:** The domain `mediaplanpro.com` is registered at Hostinger and forwarded to Vercel for hosting. DNS records must be added at Hostinger, not Vercel.

1. **Log in to Hostinger:**
   - Go to: https://hpanel.hostinger.com/
   - Log in with your Hostinger credentials

2. **Navigate to DNS Management:**
   - Click on **Domains** in the left sidebar
   - Select `mediaplanpro.com`
   - Click on **DNS / Name Servers**

3. **Add DNS Records:**

   **A. SPF Record (Sender Policy Framework):**
   - Click **Add Record**
   - Type: `TXT`
   - Name: `@` (or leave blank for root domain)
   - Value: `v=spf1 include:_spf.resend.com ~all`
   - TTL: `3600` (or default)
   - Click **Add Record**

   **B. DKIM Record (DomainKeys Identified Mail):**
   - Click **Add Record**
   - Type: `TXT`
   - Name: `resend._domainkey`
   - Value: [Copy from Resend dashboard - will be a long string starting with `p=`]
   - TTL: `3600` (or default)
   - Click **Add Record**

   **C. DMARC Record (Domain-based Message Authentication):**
   - Click **Add Record**
   - Type: `TXT`
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=none; rua=mailto:hello@mediaplanpro.com`
   - TTL: `3600` (or default)
   - Click **Add Record**

4. **Wait for DNS Propagation:**
   - Hostinger DNS typically propagates within 15-30 minutes
   - Can take up to 24-48 hours in some cases
   - Check propagation status: https://dnschecker.org/

**Important Notes:**
- Do NOT add these records in Vercel DNS if your domain is registered at Hostinger
- Hostinger manages the authoritative DNS for your domain
- Vercel only hosts the website, not the DNS

#### If using Vercel DNS (Only if domain is transferred to Vercel):
1. Log in to Vercel Dashboard: https://vercel.com/dashboard
2. Go to **Domains** in the left sidebar
3. Select your domain `mediaplanpro.com`
4. Click **DNS Records** tab
5. Click **Add** to add each DNS record provided by Resend
6. Add the following records:
   - **SPF Record**: Type: TXT, Name: `@`, Value: `v=spf1 include:_spf.resend.com ~all`
   - **DKIM Record**: Type: TXT, Name: `resend._domainkey`, Value: [Provided by Resend]
   - **DMARC Record**: Type: TXT, Name: `_dmarc`, Value: `v=DMARC1; p=none; rua=mailto:hello@mediaplanpro.com`
7. Click **Save** for each record
8. Wait 5-10 minutes for DNS propagation

**Note:** If your domain is managed by Vercel, this is the easiest method. Vercel DNS propagates quickly (usually within 5-10 minutes).

#### If using Cloudflare:
1. Log in to Cloudflare
2. Select your domain `mediaplanpro.com`
3. Go to **DNS** > **Records**
4. Click **Add record**
5. Add each DNS record provided by Resend
6. Set **Proxy status** to **DNS only** (gray cloud icon)
7. Click **Save**

#### If using GoDaddy:
1. Log in to GoDaddy
2. Go to **My Products** > **DNS**
3. Click **Add** under DNS Records
4. Add each DNS record provided by Resend
5. Click **Save**

#### If using Namecheap:
1. Log in to Namecheap
2. Go to **Domain List** > Select your domain
3. Click **Advanced DNS**
4. Click **Add New Record**
5. Add each DNS record provided by Resend
6. Click **Save All Changes**

### Step 5: Verify Domain in Resend
1. Go back to Resend Dashboard > **Domains**
2. Click **Verify** next to your domain
3. Resend will check the DNS records
4. If successful, you'll see a green checkmark ✅
5. If failed, wait 5-10 minutes for DNS propagation and try again

**Note:** DNS propagation can take up to 48 hours, but usually completes within 5-30 minutes.

### Step 6: Update Environment Variables in Vercel

After domain verification, you need to ensure the environment variables are set correctly in Vercel.

#### Option A: Using Vercel Dashboard (Recommended for beginners)

1. **Log in to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `mediaplanpro`
3. **Go to Settings** > **Environment Variables**
4. **Verify/Add the following variables:**
   - `RESEND_API_KEY`: Your Resend API key (should already be set)
   - `RESEND_FROM_EMAIL`: `hello@mediaplanpro.com` (or `noreply@mediaplanpro.com`)
   - `RESEND_FROM_NAME`: `MediaPlanPro`
   - `RESEND_REPLY_TO_EMAIL`: `hello@mediaplanpro.com`
   - `ADMIN_EMAIL`: `hello@mediaplanpro.com` (for admin notifications)

5. **Set environment for all environments:**
   - Check: ✅ Production
   - Check: ✅ Preview
   - Check: ✅ Development

6. **Click Save** for each variable

7. **Redeploy your application:**
   - Go to **Deployments** tab
   - Click **...** (three dots) on the latest deployment
   - Click **Redeploy**
   - This ensures the new environment variables are loaded

**Note:** Environment variables are only loaded at build time. You MUST redeploy after changing them.

---

#### Option B: Using Vercel CLI (Recommended for developers)

**Prerequisites:**
- Install Vercel CLI: `npm install -g vercel`
- Log in to Vercel: `vercel login`
- Link your project: `vercel link` (run in project directory)

**1. Add Environment Variables:**

```bash
# Navigate to your project directory
cd /path/to/mediaplanpro

# Add RESEND_FROM_EMAIL for all environments
vercel env add RESEND_FROM_EMAIL

# When prompted:
# - Enter value: hello@mediaplanpro.com
# - Select environments: Production, Preview, Development (use spacebar to select, enter to confirm)

# Add RESEND_FROM_NAME
vercel env add RESEND_FROM_NAME
# Value: MediaPlanPro
# Environments: Production, Preview, Development

# Add RESEND_REPLY_TO_EMAIL
vercel env add RESEND_REPLY_TO_EMAIL
# Value: hello@mediaplanpro.com
# Environments: Production, Preview, Development

# Add ADMIN_EMAIL
vercel env add ADMIN_EMAIL
# Value: hello@mediaplanpro.com
# Environments: Production, Preview, Development
```

**2. Verify Environment Variables:**

```bash
# List all environment variables
vercel env ls

# Pull environment variables to local .env file (optional)
vercel env pull .env.local
```

**3. Trigger Redeployment:**

```bash
# Option 1: Redeploy latest deployment
vercel --prod

# Option 2: Trigger redeploy via API
vercel deploy --prod

# Option 3: Check deployment status
vercel ls
```

**4. Check Deployment Status:**

```bash
# List recent deployments
vercel ls

# Get deployment details
vercel inspect <deployment-url>

# View deployment logs
vercel logs <deployment-url>
```

**Useful Vercel CLI Commands:**

```bash
# Remove an environment variable
vercel env rm VARIABLE_NAME

# Update an environment variable (remove and re-add)
vercel env rm RESEND_FROM_EMAIL
vercel env add RESEND_FROM_EMAIL

# Pull all environment variables to local file
vercel env pull .env.local

# Link project to Vercel (if not already linked)
vercel link

# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Check project info
vercel project ls

# View build logs
vercel logs <deployment-url>
```

**Troubleshooting:**

```bash
# If vercel command not found:
npm install -g vercel

# If not logged in:
vercel login

# If project not linked:
vercel link

# Check Vercel CLI version:
vercel --version

# Get help:
vercel --help
vercel env --help
```

### Step 7: Test Email Sending
Once the domain is verified and environment variables are updated, test the email system:

1. **Test via API endpoint:**
   ```bash
   curl -X POST https://www.mediaplanpro.com/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "your-email@gmail.com",
       "phone": "+1234567890",
       "company": "Test Company",
       "subject": "Test Subject",
       "message": "This is a test message",
       "serviceInterest": "SEO",
       "budgetRange": "$1,000 - $5,000",
       "hearAboutUs": "Google Search"
     }'
   ```

2. **Or test via service inquiry form:**
   - Visit: https://www.mediaplanpro.com/services/marketing-strategy-development
   - Fill out the lead capture form
   - Submit the form
   - Check your email inbox

3. **Check your email inbox** (including spam folder)
4. **Verify email details:**
   - From: MediaPlanPro <hello@mediaplanpro.com>
   - Reply-To: hello@mediaplanpro.com
   - Subject: ✅ We received your inquiry for [Service Name]
   - Content: Should include your name and service details

## Alternative: Use Resend Testing Email (Temporary)
If you can't verify the domain immediately, you can temporarily use Resend's testing email:

1. **Keep the current setup** - emails will be sent from `onboarding@resend.dev`
2. **Emails will still work** but may have lower deliverability
3. **Verify domain later** when you have access to DNS settings

## Troubleshooting

### Issue: Emails not being received
**Possible Causes:**
1. Domain not verified in Resend
2. DNS records not propagated yet
3. Emails landing in spam folder
4. Resend API key invalid or expired

**Solutions:**
1. Check Resend Dashboard > Domains > Verify status
2. Wait 5-30 minutes for DNS propagation
3. Check spam/junk folder
4. Verify `RESEND_API_KEY` in `.env` file
5. Check server logs for email sending errors:
   ```bash
   # In production (Vercel)
   vercel logs --follow
   
   # In development
   npm run dev
   # Then submit a form and check console logs
   ```

### Issue: DNS records not verifying
**Possible Causes:**
1. DNS records not added correctly
2. DNS propagation delay
3. Proxy enabled on Cloudflare (should be DNS only)

**Solutions:**
1. Double-check DNS records match exactly what Resend provided
2. Wait up to 48 hours for DNS propagation
3. Use DNS checker tool: https://dnschecker.org/
4. Disable Cloudflare proxy (set to DNS only)

### Issue: Emails landing in spam
**Possible Causes:**
1. Domain not verified
2. Missing DMARC record
3. Email content triggers spam filters

**Solutions:**
1. Verify domain in Resend
2. Add DMARC record to DNS
3. Review email content and remove spam trigger words
4. Add SPF and DKIM records correctly

## Email Templates Location
All email templates are located in:
- `src/lib/email-templates.ts` - Auto-response and admin notification templates
- `src/lib/email.ts` - Email service configuration and helper functions

## API Endpoints Using Email
1. `/api/contact` - Contact form submissions
2. `/api/services/inquiry` - Service inquiry submissions
3. `/api/lead-capture` - Lead capture form submissions

## Monitoring Email Delivery
1. **Resend Dashboard**: https://resend.com/emails
   - View all sent emails
   - Check delivery status
   - View bounce/complaint rates

2. **Server Logs**:
   ```bash
   # Check email sending logs
   grep "Email" vercel-logs.txt
   grep "Resend" vercel-logs.txt
   ```

## Next Steps After Domain Verification
1. ✅ Test email delivery to multiple email providers (Gmail, Outlook, Yahoo)
2. ✅ Verify emails don't land in spam
3. ✅ Set up email monitoring and alerts
4. ✅ Configure DMARC reporting to track email authentication
5. ✅ Implement Google Sheets integration for lead tracking

## Support
- **Resend Documentation**: https://resend.com/docs
- **Resend Support**: support@resend.com
- **DNS Propagation Checker**: https://dnschecker.org/

