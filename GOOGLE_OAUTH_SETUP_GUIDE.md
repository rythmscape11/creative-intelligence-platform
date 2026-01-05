# Google OAuth Setup Guide - Step by Step

**Date:** October 13, 2025  
**Application:** MediaPlanPro  
**Purpose:** Enable "Sign in with Google" functionality

---

## 📋 Overview

This guide will walk you through setting up Google OAuth 2.0 authentication for MediaPlanPro, allowing users to sign in with their Google accounts.

**Time Required:** 15-20 minutes  
**Prerequisites:** Google account

---

## 🚀 Step 1: Access Google Cloud Console

1. **Open your browser** and go to:
   ```
   https://console.cloud.google.com
   ```

2. **Sign in** with your Google account
   - Use your personal or business Google account
   - This will be the owner account for the project

---

## 📁 Step 2: Create a New Project (or Select Existing)

### **Option A: Create New Project**

1. Click the **project dropdown** at the top of the page (next to "Google Cloud")
2. Click **"NEW PROJECT"** button in the top-right of the dialog
3. Fill in project details:
   - **Project name:** `MediaPlanPro` (or your preferred name)
   - **Organization:** Leave as "No organization" (unless you have one)
   - **Location:** Leave as default
4. Click **"CREATE"**
5. Wait for the project to be created (takes ~30 seconds)
6. Click **"SELECT PROJECT"** when prompted

### **Option B: Use Existing Project**

1. Click the **project dropdown** at the top
2. Select your existing project from the list

---

## 🔧 Step 3: Enable Required APIs

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
   - Or use the search bar and type "API Library"

2. Search for **"Google+ API"** or **"Google Identity Services"**
   - Type in the search box at the top
   - Click on the result

3. Click **"ENABLE"** button
   - Wait for the API to be enabled (~10 seconds)
   - You'll see a green checkmark when done

**Note:** If you see "MANAGE" instead of "ENABLE", the API is already enabled.

---

## 🔐 Step 4: Configure OAuth Consent Screen

Before creating credentials, you must configure the OAuth consent screen.

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
   - Click on the left sidebar menu

2. **Choose User Type:**
   - Select **"External"** (for public users)
   - Click **"CREATE"**

3. **Fill in App Information (Page 1):**
   
   **App information:**
   - **App name:** `MediaPlanPro`
   - **User support email:** Your email address (select from dropdown)
   - **App logo:** (Optional) Upload your logo (120x120px PNG/JPG)

   **App domain:**
   - **Application home page:** `https://www.mediaplanpro.com`
   - **Application privacy policy:** `https://www.mediaplanpro.com/privacy`
   - **Application terms of service:** `https://www.mediaplanpro.com/terms`

   **Authorized domains:**
   - Click **"ADD DOMAIN"**
   - Enter: `mediaplanpro.com`
   - Click **"ADD DOMAIN"** again
   - Enter: `localhost` (for development)

   **Developer contact information:**
   - **Email addresses:** Your email address

4. Click **"SAVE AND CONTINUE"**

5. **Scopes (Page 2):**
   - Click **"ADD OR REMOVE SCOPES"**
   - Select these scopes:
     - `userinfo.email` - See your email address
     - `userinfo.profile` - See your personal info
     - `openid` - Associate you with your personal info
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

6. **Test users (Page 3):**
   - Click **"ADD USERS"**
   - Add your email address (for testing)
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**

7. **Summary (Page 4):**
   - Review your settings
   - Click **"BACK TO DASHBOARD"**

---

## 🎫 Step 5: Create OAuth 2.0 Client ID

1. Go to **"APIs & Services"** → **"Credentials"**

2. Click **"+ CREATE CREDENTIALS"** at the top
   - Select **"OAuth client ID"** from the dropdown

3. **Choose Application Type:**
   - Select **"Web application"** from the dropdown

4. **Fill in Client Details:**

   **Name:**
   ```
   MediaPlanPro Web Client
   ```

   **Authorized JavaScript origins:**
   - Click **"+ ADD URI"**
   - Add development URL:
     ```
     http://localhost:3000
     ```
   - Click **"+ ADD URI"** again
   - Add production URL:
     ```
     https://www.mediaplanpro.com
     ```

   **Authorized redirect URIs:**
   - Click **"+ ADD URI"**
   - Add development callback:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Click **"+ ADD URI"** again
   - Add production callback:
     ```
     https://www.mediaplanpro.com/api/auth/callback/google
     ```

5. Click **"CREATE"**

---

## 📋 Step 6: Copy Your Credentials

After creating the OAuth client, a dialog will appear with your credentials.

1. **Copy the credentials:**
   - **Client ID:** Starts with something like `123456789-abc...apps.googleusercontent.com`
   - **Client Secret:** A random string like `GOCSPX-abc123...`

2. **Save them securely:**
   - Copy to a text file temporarily
   - Or click **"DOWNLOAD JSON"** to save the credentials file

**⚠️ IMPORTANT:** Keep these credentials secure! Never commit them to Git.

---

## 💻 Step 7: Add Credentials to Local Development

1. **Open your `.env` file** in the project root

2. **Replace the placeholder values:**

   ```env
   # Google OAuth
   GOOGLE_CLIENT_ID="123456789-abc...apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="GOCSPX-abc123..."
   ```

3. **Save the file**

4. **Restart your development server:**
   ```bash
   # Stop the server (Ctrl+C)
   # Start it again
   npm run dev
   ```

---

## ☁️ Step 8: Add Credentials to Vercel (Production)

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   ```

2. **Select your project** (MediaPlanPro)

3. **Go to Settings:**
   - Click **"Settings"** tab at the top

4. **Navigate to Environment Variables:**
   - Click **"Environment Variables"** in the left sidebar

5. **Add GOOGLE_CLIENT_ID:**
   - Click **"Add New"** button
   - **Name:** `GOOGLE_CLIENT_ID`
   - **Value:** Paste your Client ID
   - **Environment:** Select all (Production, Preview, Development)
   - Click **"Save"**

6. **Add GOOGLE_CLIENT_SECRET:**
   - Click **"Add New"** button again
   - **Name:** `GOOGLE_CLIENT_SECRET`
   - **Value:** Paste your Client Secret
   - **Environment:** Select all (Production, Preview, Development)
   - Click **"Save"**

7. **Redeploy your application:**
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - Wait for deployment to complete (~2-3 minutes)

---

## 🧪 Step 9: Test Google Sign-In

### **Test in Development:**

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   ```
   http://localhost:3000/auth/signin
   ```

3. **Click "Sign in with Google" button**

4. **You should see:**
   - Google sign-in popup/redirect
   - List of your Google accounts
   - Permission request screen

5. **Select your account and grant permissions**

6. **You should be redirected to:**
   ```
   http://localhost:3000/dashboard
   ```

7. **Verify:**
   - You're signed in
   - Your name and email are displayed
   - Profile picture shows (if available)

### **Test in Production:**

1. **Go to your production site:**
   ```
   https://www.mediaplanpro.com/auth/signin
   ```

2. **Click "Sign in with Google" button**

3. **Complete the sign-in flow**

4. **Verify you're redirected to dashboard**

---

## 🔍 Troubleshooting

### **Error: "redirect_uri_mismatch"**

**Problem:** The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution:**
1. Go back to Google Cloud Console → Credentials
2. Click on your OAuth client
3. Check **"Authorized redirect URIs"**
4. Make sure these exact URLs are listed:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://www.mediaplanpro.com/api/auth/callback/google`
5. Save and try again

### **Error: "Access blocked: This app's request is invalid"**

**Problem:** OAuth consent screen not properly configured.

**Solution:**
1. Go to OAuth consent screen
2. Make sure status is "In production" or "Testing"
3. Add your email to test users if in testing mode
4. Verify all required fields are filled

### **Error: "Google sign-in button not showing"**

**Problem:** Credentials not properly configured in environment variables.

**Solution:**
1. Check `.env` file has correct values
2. Restart development server
3. Check browser console for errors
4. Verify credentials are not placeholder values

### **Error: "User not created in database"**

**Problem:** Database connection or user creation issue.

**Solution:**
1. Check database connection
2. Check Prisma schema is up to date
3. Run: `npx prisma db push`
4. Check server logs for errors

---

## 🔒 Security Best Practices

1. **Never commit credentials to Git:**
   - `.env` file is in `.gitignore`
   - Never share credentials publicly

2. **Use different credentials for development and production:**
   - Create separate OAuth clients if needed
   - Keep production credentials more secure

3. **Regularly rotate credentials:**
   - Change credentials every 6-12 months
   - Immediately rotate if compromised

4. **Monitor OAuth usage:**
   - Check Google Cloud Console for unusual activity
   - Review OAuth consent screen periodically

5. **Limit scopes:**
   - Only request necessary permissions
   - Users trust apps that request minimal access

---

## 📊 Verification Checklist

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized redirect URIs added (both dev and prod)
- [ ] Client ID copied
- [ ] Client Secret copied
- [ ] Credentials added to `.env` file
- [ ] Credentials added to Vercel
- [ ] Development server restarted
- [ ] Vercel redeployed
- [ ] Google sign-in tested in development
- [ ] Google sign-in tested in production
- [ ] User profile displays correctly
- [ ] Sign-out works correctly

---

## 🎉 Success!

If all tests pass, Google OAuth is now fully configured for MediaPlanPro!

**What users can now do:**
- ✅ Sign in with their Google account
- ✅ Sign up with their Google account
- ✅ No password required
- ✅ Automatic profile picture and name
- ✅ Faster authentication

**Next Steps:**
- Monitor sign-in success rates
- Gather user feedback
- Consider adding other OAuth providers (GitHub, Microsoft, etc.)

---

## 📞 Support

**If you encounter issues:**

1. **Check Google Cloud Console:**
   - APIs & Services → Credentials
   - Review OAuth client configuration

2. **Check Vercel Logs:**
   - Vercel Dashboard → Your Project → Logs
   - Look for authentication errors

3. **Check Browser Console:**
   - F12 → Console tab
   - Look for JavaScript errors

4. **Review NextAuth Documentation:**
   - https://next-auth.js.org/providers/google

---

**Last Updated:** October 13, 2025  
**Status:** ✅ **READY TO USE**

