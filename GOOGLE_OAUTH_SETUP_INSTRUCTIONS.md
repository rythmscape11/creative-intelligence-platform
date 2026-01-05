# Google Analytics OAuth Integration - Setup Instructions

## Current Issue

**Error:** `Access blocked: mediaplanpro.com has not completed the Google verification process`

**Root Cause:** Your Google Cloud Console OAuth consent screen is in "Testing" mode, which restricts access to only approved test users.

---

## Solution: Add Test Users to Google Cloud Console

### Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account (mukherjeeanustup@gmail.com)
3. Select your MediaPlanPro project from the project dropdown

### Step 2: Navigate to OAuth Consent Screen

1. In the left sidebar, click **APIs & Services** → **OAuth consent screen**
2. You should see your current OAuth consent screen configuration

### Step 3: Add Test Users

1. Scroll down to the **Test users** section
2. Click **+ ADD USERS** button
3. Enter your email address: `mukherjeeanustup@gmail.com`
4. Click **SAVE**
5. (Optional) Add any other email addresses that need access during testing

### Step 4: Verify OAuth Scopes

Make sure the following scopes are added for Google Analytics integration:

**Required Scopes:**
- `https://www.googleapis.com/auth/analytics.readonly` - View Google Analytics data
- `https://www.googleapis.com/auth/userinfo.email` - View user email
- `https://www.googleapis.com/auth/userinfo.profile` - View user profile

**To Add/Verify Scopes:**
1. On the OAuth consent screen page, click **EDIT APP**
2. Click **SAVE AND CONTINUE** on the first page
3. On the **Scopes** page, click **ADD OR REMOVE SCOPES**
4. Search for and select the scopes listed above
5. Click **UPDATE** then **SAVE AND CONTINUE**
6. Click **SAVE AND CONTINUE** on the Test users page
7. Review and click **BACK TO DASHBOARD**

### Step 5: Test the Integration

1. Go to MediaPlanPro: https://www.mediaplanpro.com
2. Navigate to **Admin Panel** → **Integrations** → **Google Analytics**
3. Click **Connect Google Analytics**
4. You should now be able to authorize the app with your test user account

---

## Alternative: Publish the App (For Production)

If you want to make the integration available to all users (not just test users), you need to submit your app for Google verification:

### Requirements for Publishing:

1. **Complete OAuth Consent Screen:**
   - App name: MediaPlanPro
   - User support email: mukherjeeanustup@gmail.com
   - App logo (120x120px)
   - App domain: mediaplanpro.com
   - Authorized domains: mediaplanpro.com
   - Developer contact email: mukherjeeanustup@gmail.com

2. **Privacy Policy & Terms of Service:**
   - You must have a publicly accessible Privacy Policy URL
   - You must have a publicly accessible Terms of Service URL
   - These should explain how you use Google Analytics data

3. **Submit for Verification:**
   - On the OAuth consent screen page, click **PUBLISH APP**
   - Fill out the verification questionnaire
   - Provide a YouTube video demonstrating your app's use of Google Analytics data
   - Wait for Google's review (can take 1-6 weeks)

### Verification Process:

1. Google will review your app to ensure it complies with their policies
2. They'll verify that you only request the scopes you actually need
3. They'll check your privacy policy and terms of service
4. Once approved, any Google user can authorize your app

---

## Recommended Approach

**For Development/Testing (Immediate):**
- ✅ Add test users (takes 1 minute)
- ✅ Keep app in "Testing" mode
- ✅ Works for up to 100 test users

**For Production (Long-term):**
- 📝 Create Privacy Policy and Terms of Service pages
- 📝 Submit app for Google verification
- ⏳ Wait for approval (1-6 weeks)
- ✅ Make integration available to all users

---

## Current OAuth Configuration

Based on your previous setup, you should have:

**Authorized Redirect URIs:**
1. `https://www.mediaplanpro.com/api/auth/callback/google` (NextAuth)
2. `https://www.mediaplanpro.com/api/integrations/google-analytics/callback` (Google Analytics)
3. `http://localhost:3000/api/auth/callback/google` (Local development)
4. `http://localhost:3000/api/integrations/google-analytics/callback` (Local development)

**Environment Variables (Vercel Production):**
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
- `NEXTAUTH_URL` - https://www.mediaplanpro.com
- `NEXTAUTH_SECRET` - Your NextAuth secret

---

## Troubleshooting

### Issue: "Access blocked" error persists after adding test user

**Solution:**
1. Sign out of all Google accounts in your browser
2. Clear browser cache and cookies
3. Sign in again with the test user email
4. Try the OAuth flow again

### Issue: "redirect_uri_mismatch" error

**Solution:**
1. Verify the redirect URI in Google Cloud Console matches exactly
2. Check for trailing slashes (should NOT have trailing slash)
3. Verify the protocol (http vs https)

### Issue: "invalid_scope" error

**Solution:**
1. Verify all requested scopes are added in OAuth consent screen
2. Make sure scopes are enabled in the Google Analytics API

---

## Next Steps

1. ✅ **Immediate:** Add `mukherjeeanustup@gmail.com` as a test user
2. ✅ **Test:** Try the Google Analytics integration again
3. 📝 **Future:** Create Privacy Policy and Terms of Service
4. 📝 **Future:** Submit app for Google verification

---

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Check Vercel deployment logs for server-side errors
3. Verify all environment variables are set correctly in Vercel
4. Ensure Google Analytics API is enabled in Google Cloud Console

---

**Last Updated:** 2025-10-29

