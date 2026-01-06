# MediaPlanPro - Authentication Troubleshooting Guide

**Date**: October 12, 2025  
**Issue**: "Sign In Failed - Invalid email or password" error  
**Status**: 🔍 Investigating

---

## Issue Summary

Users are experiencing authentication failures when trying to sign in with valid credentials:
- **Email**: admin@mediaplanpro.com
- **Password**: MediaPlanPro2025!Admin
- **Error**: "Invalid email or password. Please try again."

---

## Verification Steps Completed

### ✅ Database Verification
**Status**: Password hash is VALID in database

```bash
# Test performed:
DATABASE_URL="..." npx tsx -e "
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@mediaplanpro.com' }
  });
  const isValid = await bcrypt.compare('MediaPlanPro2025!Admin', admin.password);
  console.log('Hash Match:', isValid); // Result: ✅ VALID
"
```

**Result**: 
- ✅ Admin user exists in database
- ✅ Password hash matches correctly
- ✅ Role is ADMIN
- ✅ User ID: cmgno3iif0000xr8588l4j06i

### ✅ Environment Variables
**Status**: All required variables are set

| Variable | Status | Value |
|----------|--------|-------|
| `NEXTAUTH_URL` | ✅ Set | `https://mediaplanpro.vercel.app` |
| `NEXTAUTH_SECRET` | ✅ Set | (encrypted) |
| `JWT_SECRET` | ✅ Set | (encrypted) |
| `DATABASE_URL` | ✅ Set | Neon PostgreSQL |

**Recent Fixes**:
1. Removed trailing newline from NEXTAUTH_URL
2. Updated to primary Vercel domain: `https://mediaplanpro.vercel.app`
3. Added to both Production and Preview environments

### ✅ Code Verification
**Status**: Authentication logic is correct

**File**: `src/lib/auth.ts`
- ✅ CredentialsProvider configured correctly
- ✅ bcrypt.compare() used for password validation
- ✅ User lookup by email working
- ✅ Session strategy: JWT (correct)
- ✅ Callbacks properly configured

---

## Possible Causes

### 1. Domain Mismatch
**Likelihood**: High  
**Description**: NEXTAUTH_URL doesn't match the domain you're accessing

**Check**:
- Are you accessing via `https://mediaplanpro.vercel.app`?
- Or via a different URL like `https://mediaplanpro-xxx.vercel.app`?

**Solution**:
- Always access via: `https://mediaplanpro.vercel.app`
- Or update NEXTAUTH_URL to match your access URL

### 2. Deployment Not Updated
**Likelihood**: Medium  
**Description**: Latest deployment hasn't picked up environment variable changes

**Check**:
- Wait for latest deployment to complete
- Current deployment building: `mediaplanpro-pfi6pj4as`

**Solution**:
- Wait 1-2 minutes for deployment to complete
- Try signing in again after deployment is ready

### 3. Browser Cache
**Likelihood**: Medium  
**Description**: Browser caching old authentication state

**Solution**:
1. Clear browser cache and cookies for the site
2. Open in incognito/private window
3. Try signing in again

### 4. CORS or Cookie Issues
**Likelihood**: Low  
**Description**: Cookies not being set due to domain/CORS issues

**Check**:
- Open browser DevTools → Application → Cookies
- Look for `next-auth.session-token` cookie
- Check if it's being set after sign-in attempt

**Solution**:
- Ensure you're on HTTPS (not HTTP)
- Check browser console for CORS errors

### 5. Database Connection Issue
**Likelihood**: Very Low  
**Description**: Production can't connect to database

**Check**:
- Verify DATABASE_URL is correct in production
- Check Vercel logs for database connection errors

**Solution**:
- Review Vercel function logs
- Verify Neon database is accessible

---

## Debugging Steps

### Step 1: Check Current Deployment
```bash
npx vercel ls --scope anustups-projects-438c3483 | head -5
```

Wait for status to show "● Ready" for the latest deployment.

### Step 2: Verify Environment Variables
```bash
npx vercel env pull .env.production.check --environment=production
cat .env.production.check | grep NEXTAUTH_URL
```

Should show:
```
NEXTAUTH_URL="https://mediaplanpro.vercel.app"
```
(No trailing newline or extra characters)

### Step 3: Check Vercel Logs
```bash
npx vercel logs https://mediaplanpro.vercel.app --since 5m
```

Look for authentication-related errors.

### Step 4: Test in Incognito Mode
1. Open incognito/private browser window
2. Go to: https://mediaplanpro.vercel.app/auth/signin
3. Enter credentials:
   - Email: admin@mediaplanpro.com
   - Password: MediaPlanPro2025!Admin
4. Click "Sign in"

### Step 5: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try signing in
4. Look for any error messages

### Step 6: Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try signing in
4. Look for `/api/auth/callback/credentials` request
5. Check the response status and body

---

## Quick Fixes to Try

### Fix 1: Clear Browser Data
1. Open browser settings
2. Clear browsing data
3. Select "Cookies and other site data"
4. Select "Cached images and files"
5. Clear data
6. Try signing in again

### Fix 2: Use Incognito Mode
1. Open new incognito/private window
2. Navigate to: https://mediaplanpro.vercel.app/auth/signin
3. Try signing in

### Fix 3: Wait for Deployment
1. Check deployment status
2. Wait for "● Ready" status
3. Try signing in after deployment completes

### Fix 4: Try Different Browser
1. Open different browser (Chrome, Firefox, Safari, Edge)
2. Navigate to sign-in page
3. Try signing in

---

## Alternative Sign-In Methods

### Method 1: Create New Admin User
If the issue persists, create a new admin user:

```bash
DATABASE_URL="postgresql://..." npx tsx -e "
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('NewPassword123!', 12);
  
  const user = await prisma.user.create({
    data: {
      email: 'admin2@mediaplanpro.com',
      name: 'Admin User 2',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  
  console.log('✅ New admin created:', user.email);
}

createAdmin().finally(() => prisma.\$disconnect());
"
```

Then try signing in with:
- Email: admin2@mediaplanpro.com
- Password: NewPassword123!

### Method 2: Reset Admin Password
Reset the existing admin password:

```bash
DATABASE_URL="postgresql://..." npx tsx -e "
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  const newPassword = 'MediaPlanPro2025!Admin';
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  const user = await prisma.user.update({
    where: { email: 'admin@mediaplanpro.com' },
    data: { password: hashedPassword },
  });
  
  console.log('✅ Password reset for:', user.email);
  console.log('   New password:', newPassword);
}

resetPassword().finally(() => prisma.\$disconnect());
"
```

---

## Expected Behavior

### Successful Sign-In Flow
1. User enters email and password
2. Click "Sign in" button
3. Request sent to `/api/auth/callback/credentials`
4. NextAuth validates credentials:
   - Looks up user by email
   - Compares password hash
   - Returns user object if valid
5. JWT token created and stored in cookie
6. User redirected to dashboard
7. Success toast shown: "Welcome back!"

### Failed Sign-In Flow
1. User enters email and password
2. Click "Sign in" button
3. Request sent to `/api/auth/callback/credentials`
4. NextAuth validates credentials:
   - User not found OR
   - Password doesn't match
5. Returns error
6. Error toast shown: "Invalid email or password"

---

## Monitoring & Logs

### Check Vercel Function Logs
```bash
# Real-time logs
npx vercel logs https://mediaplanpro.vercel.app --follow

# Last 10 minutes
npx vercel logs https://mediaplanpro.vercel.app --since 10m
```

Look for:
- Database connection errors
- bcrypt comparison errors
- NextAuth errors
- Session creation errors

### Check Browser Console
Look for:
- Network errors (failed requests)
- CORS errors
- Cookie errors
- JavaScript errors

### Check Network Requests
In DevTools Network tab, look for:
- `/api/auth/callback/credentials` - Should return 200
- `/api/auth/session` - Should return user session
- Response bodies for error messages

---

## Current Status

### Latest Actions Taken
1. ✅ Verified password hash in database (VALID)
2. ✅ Fixed NEXTAUTH_URL (removed newline)
3. ✅ Updated NEXTAUTH_URL to primary domain
4. ✅ Added NEXTAUTH_URL to Preview environment
5. 🔄 Triggered redeployment (in progress)

### Next Steps
1. **Wait for deployment to complete** (~1-2 minutes)
2. **Clear browser cache** or use incognito mode
3. **Try signing in** at: https://mediaplanpro.vercel.app/auth/signin
4. **Check browser console** for errors if it fails
5. **Check Vercel logs** for server-side errors

---

## Contact Information

If the issue persists after trying all troubleshooting steps:

1. **Check Deployment Status**:
   ```bash
   npx vercel ls --scope anustups-projects-438c3483 | head -5
   ```

2. **Verify Latest Environment Variables**:
   ```bash
   npx vercel env pull .env.check --environment=production
   cat .env.check | grep NEXTAUTH
   ```

3. **Check Recent Logs**:
   ```bash
   npx vercel logs https://mediaplanpro.vercel.app --since 5m | grep -i "auth\|error"
   ```

---

## Temporary Workaround

If you need immediate access, you can:

1. **Create a new admin user** with a different email
2. **Reset the password** for the existing admin user
3. **Use Google Sign-In** (if configured)

---

**Last Updated**: October 12, 2025, 19:50 IST  
**Status**: Deployment in progress, waiting for completion  
**ETA**: 1-2 minutes

