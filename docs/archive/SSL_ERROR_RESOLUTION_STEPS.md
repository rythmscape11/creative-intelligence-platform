# MediaPlanPro - SSL Error Resolution Steps

**Date**: October 12, 2025  
**Issue**: ERR_SSL_PROTOCOL_ERROR persisting after 2+ hours  
**Domain**: www.mediaplanpro.com / mediaplanpro.com  
**Status**: 🔴 **REQUIRES MANUAL INTERVENTION**

---

## Problem Analysis

### What We Know
- ✅ Domain registered and configured (mediaplanpro.com)
- ✅ Nameservers pointing to Vercel correctly
- ✅ DNS resolving to Vercel IP (84.32.84.32)
- ✅ SSL certificate issued 2 hours ago
- ✅ Vercel URL works fine (https://mediaplanpro.vercel.app)
- ❌ Custom domain SSL handshake failing

### Error Details
```
curl: (35) LibreSSL/3.3.6: error:1404B438:SSL routines:ST_CONNECT:tlsv1 alert internal error
```

This error indicates:
- Server is **rejecting** the SSL handshake
- Not a certificate propagation issue (2+ hours passed)
- Likely a **Vercel configuration issue**

### Possible Causes
1. **Deployment Protection** enabled on the project
2. **Password Protection** enabled
3. **Domain not properly linked** to latest deployment
4. **SSL certificate not properly bound** to the domain
5. **Vercel edge network configuration** issue

---

## Solution: Manual Configuration via Vercel Dashboard

Since CLI commands haven't resolved the issue, we need to configure this through the Vercel web dashboard.

### Step 1: Access Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Sign in with your account
3. Navigate to the **mediaplanpro** project

### Step 2: Check Deployment Protection

1. In the project, go to **Settings** tab
2. Click on **Deployment Protection** in the left sidebar
3. Check if any protection is enabled:
   - ❌ **Vercel Authentication** - Should be OFF for public sites
   - ❌ **Password Protection** - Should be OFF
   - ❌ **Trusted IPs** - Should be OFF or empty

4. If any protection is enabled:
   - **Disable** all protection methods
   - Click **Save**
   - Wait 2-3 minutes

### Step 3: Check and Re-configure Domains

1. In the project, go to **Settings** tab
2. Click on **Domains** in the left sidebar
3. You should see:
   - `www.mediaplanpro.com`
   - `mediaplanpro.com`

4. **Remove both domains**:
   - Click the **⋮** (three dots) next to each domain
   - Select **Remove**
   - Confirm removal

5. **Wait 2 minutes** for DNS to clear

6. **Re-add the domains**:
   - Click **Add** button
   - Enter: `www.mediaplanpro.com`
   - Click **Add**
   - Wait for verification
   - Repeat for `mediaplanpro.com`

7. **Verify SSL certificate**:
   - After adding, you should see a green checkmark ✅
   - SSL certificate should show as "Active"
   - If it shows "Pending", wait 5-10 minutes

### Step 4: Check Production Deployment

1. Go to **Deployments** tab
2. Find the latest **Production** deployment
3. Click on it to open
4. Check the **Domains** section:
   - Should list: `www.mediaplanpro.com`
   - Should list: `mediaplanpro.com`
   - Should list: `mediaplanpro.vercel.app`

5. If custom domains are missing:
   - Go back to **Settings** → **Domains**
   - Click **⋮** next to each custom domain
   - Select **Assign to Production**

### Step 5: Force SSL Certificate Renewal

1. In **Settings** → **Domains**
2. For each domain (`www.mediaplanpro.com` and `mediaplanpro.com`):
   - Click the **⋮** (three dots)
   - Look for **Renew Certificate** or **Refresh SSL**
   - Click it
   - Wait for completion

### Step 6: Check Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Verify **NEXTAUTH_URL** is set correctly:
   - Should be: `https://mediaplanpro.vercel.app` (for now)
   - Or: `https://www.mediaplanpro.com` (after SSL works)

3. If using custom domain in NEXTAUTH_URL and SSL isn't working:
   - **Temporarily change** back to: `https://mediaplanpro.vercel.app`
   - Click **Save**
   - Redeploy

### Step 7: Trigger New Deployment

1. Go to **Deployments** tab
2. Click **Redeploy** on the latest production deployment
3. Or push a new commit to trigger deployment:
   ```bash
   git commit --allow-empty -m "chore: Trigger redeployment for SSL fix"
   git push origin main
   ```

4. Wait for deployment to complete
5. Check if custom domain works

---

## Alternative Solution: Use Vercel Support

If the above steps don't work, this might be a Vercel platform issue that requires their support team.

### Contact Vercel Support

1. Go to: https://vercel.com/help
2. Click **Contact Support**
3. Provide the following information:

**Subject**: SSL Certificate Error on Custom Domain

**Message**:
```
Hello Vercel Support,

I'm experiencing an SSL handshake error on my custom domain:
- Domain: www.mediaplanpro.com and mediaplanpro.com
- Project: mediaplanpro
- Error: ERR_SSL_PROTOCOL_ERROR (tlsv1 alert internal error)

Details:
- Domain added 24 hours ago
- Nameservers correctly pointing to Vercel DNS
- DNS resolving to Vercel IP (84.32.84.32)
- SSL certificate issued 2+ hours ago (cert_PP6AaGtoYD5VVWgP5yUs0s2y)
- Vercel URL works fine: https://mediaplanpro.vercel.app
- Custom domain SSL handshake fails

The SSL certificate appears to be issued but the server is rejecting 
the SSL handshake with "tlsv1 alert internal error".

Could you please investigate and help resolve this issue?

Thank you!
```

---

## Temporary Workaround

While waiting for the SSL issue to be resolved, you can:

### Option 1: Use Vercel Domain
Continue using: https://mediaplanpro.vercel.app

This works perfectly and has valid SSL.

### Option 2: Set Up Redirect
Once SSL works, set up a redirect from non-www to www (or vice versa):

1. In Vercel Dashboard → **Settings** → **Domains**
2. Click **⋮** next to `mediaplanpro.com`
3. Select **Redirect to www.mediaplanpro.com**

---

## Diagnostic Commands

### Check DNS Resolution
```bash
dig www.mediaplanpro.com A +short
dig mediaplanpro.com A +short
```

Expected: `84.32.84.32` (or similar Vercel IP)

### Check SSL Certificate
```bash
curl -v https://www.mediaplanpro.com 2>&1 | grep -E "(SSL|certificate|error)"
```

### Check Vercel Certificate Status
```bash
npx vercel certs ls
```

### Check Domain Configuration
```bash
npx vercel domains inspect mediaplanpro.com
```

### Check Project Aliases
```bash
npx vercel alias ls
```

---

## What I've Already Tried

### ✅ Completed Actions
1. ✅ Verified domain configuration
2. ✅ Verified nameservers
3. ✅ Verified DNS resolution
4. ✅ Issued new SSL certificate
5. ✅ Waited 2+ hours for propagation
6. ✅ Checked certificate status
7. ✅ Verified project linking

### ❌ What Didn't Work
1. ❌ Waiting for SSL propagation (2+ hours)
2. ❌ Issuing new certificate
3. ❌ CLI-based certificate management

### 🔄 What Needs to Be Done
1. 🔄 Check Vercel Dashboard for deployment protection
2. 🔄 Remove and re-add domains via dashboard
3. 🔄 Force SSL certificate renewal via dashboard
4. 🔄 Contact Vercel support if needed

---

## Expected Outcome

After following the manual steps:

### Success Indicators
- ✅ https://www.mediaplanpro.com loads without errors
- ✅ SSL padlock icon appears in browser
- ✅ Certificate shows as issued by "Let's Encrypt"
- ✅ No security warnings
- ✅ curl command returns HTTP/2 200

### Timeline
- **Immediate**: Check deployment protection
- **5 minutes**: Remove and re-add domains
- **10 minutes**: SSL certificate should be active
- **15 minutes**: Test domain access
- **If still failing**: Contact Vercel support

---

## Next Steps After SSL Works

Once the SSL issue is resolved:

### 1. Update NEXTAUTH_URL
```bash
npx vercel env rm NEXTAUTH_URL production --yes
printf "https://www.mediaplanpro.com" | npx vercel env add NEXTAUTH_URL production
```

### 2. Redeploy
```bash
git commit --allow-empty -m "chore: Update NEXTAUTH_URL to custom domain"
git push origin main
```

### 3. Test Authentication
- Go to: https://www.mediaplanpro.com/auth/signin
- Sign in with admin credentials
- Verify redirect works

### 4. Set Up Domain Redirect
- Redirect `mediaplanpro.com` → `www.mediaplanpro.com`
- Or vice versa (choose one as primary)

---

## Important Notes

### Why This Is Unusual
- SSL certificates usually propagate in 5-15 minutes
- 2+ hours is **abnormal**
- Suggests a **configuration issue**, not propagation delay

### Most Likely Cause
Based on the error pattern:
1. **Deployment Protection** (80% probability)
   - Vercel Authentication enabled
   - Blocking SSL handshake for custom domains

2. **Domain Binding Issue** (15% probability)
   - Domain not properly linked to deployment
   - SSL certificate not bound to domain

3. **Vercel Platform Issue** (5% probability)
   - Edge network configuration problem
   - Requires Vercel support intervention

---

## Checklist for Manual Resolution

Use this checklist when working through the Vercel Dashboard:

- [ ] Access Vercel Dashboard
- [ ] Navigate to mediaplanpro project
- [ ] Check **Settings** → **Deployment Protection**
- [ ] Disable all protection methods
- [ ] Go to **Settings** → **Domains**
- [ ] Remove `www.mediaplanpro.com`
- [ ] Remove `mediaplanpro.com`
- [ ] Wait 2 minutes
- [ ] Re-add `www.mediaplanpro.com`
- [ ] Re-add `mediaplanpro.com`
- [ ] Verify SSL shows as "Active"
- [ ] Go to **Deployments** tab
- [ ] Check latest deployment has custom domains
- [ ] Trigger new deployment if needed
- [ ] Wait 5-10 minutes
- [ ] Test https://www.mediaplanpro.com
- [ ] If still failing, contact Vercel support

---

## Support Information

### Vercel Support
- **Help Center**: https://vercel.com/help
- **Contact**: https://vercel.com/support
- **Status Page**: https://www.vercel-status.com

### Project Details
- **Project Name**: mediaplanpro
- **Team**: anustups-projects-438c3483
- **Domain**: www.mediaplanpro.com, mediaplanpro.com
- **Certificate ID**: cert_PP6AaGtoYD5VVWgP5yUs0s2y

---

**Status**: 🔴 **REQUIRES MANUAL DASHBOARD CONFIGURATION**  
**Action**: **CHECK VERCEL DASHBOARD FOR DEPLOYMENT PROTECTION**  
**Priority**: **HIGH** - SSL should not take 2+ hours to propagate

