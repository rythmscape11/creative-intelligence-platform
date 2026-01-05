# Mailchimp Integration - Production Deployment Guide

**Last Updated:** October 27, 2025  
**Version:** 1.0  
**Status:** Ready for Production

---

## 📋 Pre-Deployment Checklist

### ✅ Code Deployment
- [x] All code committed to Git
- [x] Build successful (`npm run build`)
- [x] TypeScript compilation passed
- [x] No console errors or warnings
- [x] Changes pushed to main branch

### ⚠️ Environment Configuration
- [ ] Environment variables configured in production
- [ ] Encryption key generated and set
- [ ] Mailchimp account created
- [ ] Mailchimp API key generated
- [ ] Database migrations applied

### 🔧 Mailchimp Setup
- [ ] Mailchimp account verified
- [ ] Audience (list) created
- [ ] API key tested
- [ ] Server prefix identified
- [ ] Reply-to email configured

### 🧪 Testing
- [ ] Integration connection tested
- [ ] Contact sync tested
- [ ] Newsletter sending tested
- [ ] Analytics dashboard verified
- [ ] Error handling verified

---

## 🔐 Environment Variables

### Required Variables

Add these to your production environment (Vercel, Netlify, Hostinger, etc.):

```bash
# Mailchimp Configuration
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_SERVER_PREFIX=us1  # Replace with your server prefix (us1, us2, etc.)
MAILCHIMP_REPLY_TO=hello@mediaplanpro.com  # Your reply-to email

# Encryption (for storing API keys in database)
ENCRYPTION_KEY=your_32_character_encryption_key_here

# Application URL (for newsletter links)
NEXT_PUBLIC_APP_URL=https://www.mediaplanpro.com
```

### How to Get Mailchimp Credentials

#### 1. Create Mailchimp Account
- Go to https://mailchimp.com
- Sign up for an account (Free tier available)
- Verify your email address

#### 2. Generate API Key
1. Log in to Mailchimp
2. Click your profile icon → Account & Billing
3. Click "Extras" → "API keys"
4. Click "Create A Key"
5. Copy the API key (save it securely - you won't see it again!)

#### 3. Find Server Prefix
- Your server prefix is in your Mailchimp URL
- Example: If your URL is `https://us1.admin.mailchimp.com/`, your prefix is `us1`
- Common prefixes: `us1`, `us2`, `us3`, `us19`, etc.

#### 4. Generate Encryption Key
Run this command to generate a secure 32-character key:

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Or use this online tool: https://www.random.org/strings/

---

## 🗄️ Database Migrations

### Verify Schema

Ensure your database has the required tables:

```bash
# Check current schema
npx prisma db pull

# Apply migrations
npx prisma db push

# Or use migrate (recommended for production)
npx prisma migrate deploy
```

### Required Models

The following models must exist in your database:

1. **Integration** - Stores Mailchimp configuration
   - Fields: `id`, `type`, `name`, `apiKey`, `serverPrefix`, `audienceId`, `isActive`, etc.

2. **IntegrationLog** - Tracks sync operations
   - Fields: `id`, `integrationId`, `action`, `status`, `recordsProcessed`, `errorMessage`, etc.

3. **LeadCapture** - Contact form submissions
   - Fields: `id`, `email`, `name`, `source`, `page`, `capturedAt`, etc.

4. **ServiceInquiry** - Service inquiry forms
   - Fields: `id`, `email`, `name`, `phone`, `serviceInterest`, etc.

5. **ServicePurchase** - Customer purchases
   - Fields: `id`, `userId`, `serviceName`, `amount`, etc.

### Verify Tables Exist

```sql
-- Run this in your database console
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('Integration', 'IntegrationLog', 'LeadCapture', 'ServiceInquiry', 'ServicePurchase');
```

---

## 🚀 Deployment Steps

### Step 1: Configure Environment Variables

**For Vercel:**
```bash
vercel env add MAILCHIMP_API_KEY
vercel env add MAILCHIMP_SERVER_PREFIX
vercel env add MAILCHIMP_REPLY_TO
vercel env add ENCRYPTION_KEY
```

**For Netlify:**
1. Go to Site Settings → Environment Variables
2. Add each variable with its value

**For Hostinger:**
1. Go to your hosting control panel
2. Find "Environment Variables" or ".env configuration"
3. Add each variable

### Step 2: Apply Database Migrations

```bash
# Production database
npx prisma migrate deploy

# Or if using db push
npx prisma db push
```

### Step 3: Deploy Application

```bash
# Commit all changes
git add -A
git commit -m "feat: add Mailchimp integration production config"
git push origin main

# Deploy (if not auto-deployed)
vercel --prod
# or
netlify deploy --prod
```

### Step 4: Configure Mailchimp in Admin Panel

1. Navigate to `https://yourdomain.com/dashboard/admin/integrations`
2. Click on "Mailchimp" card
3. Enter your Mailchimp credentials:
   - API Key
   - Server Prefix (e.g., `us1`)
4. Click "Test Connection"
5. If successful, select your default audience
6. Enable desired automations:
   - ✅ Sync new contacts automatically
   - ✅ Send blog newsletters
   - ✅ Sync service inquiries
   - ✅ Sync service purchases
7. Click "Save Configuration"

### Step 5: Test Integration

#### Test Contact Sync
1. Submit a test contact form at `/contact`
2. Check Mailchimp audience for new contact
3. Verify contact appears with correct tags

#### Test Newsletter
1. Create a test blog post at `/dashboard/blog/create`
2. Set status to "PUBLISHED"
3. Check "Send as Newsletter"
4. Click "Save"
5. Check Mailchimp campaigns for new campaign
6. Verify email was sent

#### Test Bulk Sync
1. Go to `/dashboard/admin/integrations/mailchimp/sync`
2. Click "Start Bulk Sync"
3. Wait for completion
4. Verify all contacts synced successfully

#### Test Analytics
1. Go to `/dashboard/admin/integrations/mailchimp`
2. Scroll to "Analytics & Sync Logs"
3. Verify metrics display correctly
4. Check recent sync logs

---

## 🔍 Verification Checklist

### Integration Status
- [ ] Integration shows as "Active" in admin panel
- [ ] Test connection succeeds
- [ ] Audience is selected
- [ ] Automations are enabled

### Contact Sync
- [ ] New contacts appear in Mailchimp
- [ ] Contacts have correct merge fields (FNAME, LNAME, etc.)
- [ ] Tags are applied correctly
- [ ] Source tracking works

### Newsletter
- [ ] Blog posts can be sent as newsletters
- [ ] Campaigns are created in Mailchimp
- [ ] Emails are delivered to subscribers
- [ ] Links in emails work correctly

### Analytics
- [ ] Sync logs are recorded
- [ ] Metrics calculate correctly
- [ ] Charts display data
- [ ] Error messages are logged

### Error Handling
- [ ] Invalid API key shows error message
- [ ] Network errors are handled gracefully
- [ ] Failed syncs are logged
- [ ] Users see helpful error messages

---

## 🐛 Troubleshooting

### Issue: "Invalid API Key" Error

**Solution:**
1. Verify API key is correct (no extra spaces)
2. Check server prefix matches your Mailchimp account
3. Ensure API key has not been revoked
4. Generate a new API key if needed

### Issue: Contacts Not Syncing

**Solution:**
1. Check integration is active (`isActive = true`)
2. Verify "Sync new contacts" automation is enabled
3. Check IntegrationLog for error messages
4. Ensure audience ID is set correctly
5. Verify Mailchimp audience exists

### Issue: Newsletter Not Sending

**Solution:**
1. Check "Send blog newsletters" automation is enabled
2. Verify audience has subscribers
3. Check Mailchimp campaign was created
4. Review IntegrationLog for errors
5. Ensure blog post status is "PUBLISHED"

### Issue: Analytics Not Showing Data

**Solution:**
1. Perform at least one sync operation
2. Check IntegrationLog table has records
3. Verify date range includes sync operations
4. Refresh the page
5. Check browser console for errors

### Issue: Encryption Errors

**Solution:**
1. Verify ENCRYPTION_KEY is set in environment
2. Ensure key is exactly 32 characters (hex)
3. Check key hasn't changed (would invalidate existing encrypted data)
4. Re-save integration configuration if key changed

---

## 📊 Monitoring

### Key Metrics to Monitor

1. **Sync Success Rate**
   - Target: >95%
   - Check: `/dashboard/admin/integrations/mailchimp` analytics

2. **Contact Growth**
   - Monitor Mailchimp audience size
   - Compare with LeadCapture table count

3. **Newsletter Performance**
   - Open rates (check Mailchimp reports)
   - Click rates
   - Unsubscribe rates

4. **Error Frequency**
   - Check IntegrationLog for failed operations
   - Set up alerts for high error rates

### Recommended Monitoring Tools

- **Mailchimp Reports** - Campaign performance
- **Database Queries** - Sync operation counts
- **Application Logs** - Error tracking
- **Uptime Monitoring** - API availability

---

## 🔒 Security Best Practices

### API Key Security
- ✅ Store API keys encrypted in database
- ✅ Never commit API keys to Git
- ✅ Use environment variables for sensitive data
- ✅ Rotate API keys periodically (every 90 days)
- ✅ Restrict API key permissions in Mailchimp

### Access Control
- ✅ Only ADMIN role can configure integrations
- ✅ Only ADMIN/EDITOR can send newsletters
- ✅ Integration logs are admin-only
- ✅ API endpoints validate authentication

### Data Privacy
- ✅ Comply with GDPR/privacy regulations
- ✅ Provide unsubscribe options
- ✅ Don't sync sensitive data to Mailchimp
- ✅ Use double opt-in for newsletter signups
- ✅ Honor unsubscribe requests immediately

---

## 📈 Performance Optimization

### Batch Operations
- Use bulk sync for large contact lists
- Limit batch size to 500 contacts per request
- Implement rate limiting to avoid API throttling

### Caching
- Cache audience lists (refresh every 24 hours)
- Cache analytics data (refresh every hour)
- Use Redis for high-traffic sites

### Async Processing
- Contact sync is fire-and-forget (non-blocking)
- Newsletter sending is asynchronous
- Bulk operations show progress in real-time

---

## 🔄 Maintenance

### Daily Tasks
- Monitor sync success rate
- Check for error spikes in logs

### Weekly Tasks
- Review newsletter performance
- Check contact growth trends
- Verify automations are running

### Monthly Tasks
- Audit Mailchimp audience for duplicates
- Review and clean up old integration logs
- Update merge fields if needed
- Test all integration features

### Quarterly Tasks
- Rotate API keys
- Review and update automations
- Audit security settings
- Performance optimization review

---

## 📞 Support Resources

### Documentation
- **Mailchimp API Docs:** https://mailchimp.com/developer/
- **Integration Guide:** `MAILCHIMP_INTEGRATION_GUIDE.md`
- **Completion Summary:** `MAILCHIMP_COMPLETION_SUMMARY.md`

### Mailchimp Support
- **Help Center:** https://mailchimp.com/help/
- **API Status:** https://status.mailchimp.com/
- **Community:** https://mailchimp.com/community/

### Internal Resources
- Check IntegrationLog table for detailed error messages
- Review application logs for debugging
- Contact development team for technical issues

---

## ✅ Production Readiness Sign-Off

Before going live, ensure all items are checked:

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Mailchimp account verified and configured
- [ ] Integration tested end-to-end
- [ ] Error handling verified
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Monitoring set up
- [ ] Team trained on features
- [ ] Documentation reviewed

**Deployment Date:** _______________  
**Deployed By:** _______________  
**Verified By:** _______________

---

**Status:** ✅ Ready for Production Deployment


