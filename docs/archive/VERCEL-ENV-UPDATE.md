# 🔧 Fix Canonical URL - Vercel Environment Variable Update

## ❌ Current Issue

Your site is showing the wrong canonical URL:
- **Current:** `https://mediaplanpro.vercel.app/`
- **Should be:** `https://www.mediaplanpro.com/`

This happens because `NEXTAUTH_URL` is not set in your Vercel production environment.

---

## ✅ Solution: Update Vercel Environment Variables

### **Step 1: Go to Vercel Dashboard**

1. Visit: https://vercel.com/anustups-projects-438c3483/mediaplanpro
2. Click on your **"mediaplanpro"** project
3. Click **"Settings"** tab at the top
4. Click **"Environment Variables"** in the left sidebar

### **Step 2: Add NEXTAUTH_URL Variable**

1. In the "Environment Variables" section, click **"Add New"**
2. Fill in the form:
   - **Key:** `NEXTAUTH_URL`
   - **Value:** `https://www.mediaplanpro.com`
   - **Environment:** Select **"Production"** only
3. Click **"Save"**

### **Step 3: Redeploy Your Site**

After adding the environment variable, you need to redeploy:

**Option A: Redeploy from Vercel Dashboard**
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Confirm the redeployment

**Option B: Redeploy by Pushing to GitHub**
```bash
# Make a small change and push
git commit --allow-empty -m "chore: trigger redeploy for NEXTAUTH_URL fix"
git push origin main
```

### **Step 4: Verify the Fix**

After redeployment (takes 2-3 minutes):

1. **Check your homepage source code:**
   - Visit: https://www.mediaplanpro.com/
   - Right-click → "View Page Source"
   - Search for `<link rel="canonical"`
   - Should show: `<link rel="canonical" href="https://www.mediaplanpro.com/" />`

2. **Check Google Search Console:**
   - Go to: https://search.google.com/search-console
   - Use URL Inspection for: `https://www.mediaplanpro.com/`
   - Wait 1-2 days for Google to re-crawl
   - "User-declared canonical" should now show: `https://www.mediaplanpro.com/`

---

## 📋 Complete List of Required Environment Variables

Make sure these are all set in Vercel Production environment:

### **Required (Must Have):**
```
NEXTAUTH_URL=https://www.mediaplanpro.com
NEXTAUTH_SECRET=jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=
NEXT_PUBLIC_APP_URL=https://www.mediaplanpro.com
DATABASE_URL=postgresql://neondb_owner:npg_cZT0Cbkjv9KV@ep-fancy-dream-ad78leuw-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=
NODE_ENV=production
```

### **Analytics (Already Set):**
```
NEXT_PUBLIC_GA_TRACKING_ID=G-KW67PBLSR7
NEXT_PUBLIC_GTM_ID=GTM-NQRV6DDM
GOOGLE_SITE_VERIFICATION=lhXZpqpqP8HCTHRmtPWXHr4YvCh_MOBIoNNFw50ouAM
```

### **SEO/IndexNow (New - Add These):**
```
INDEXNOW_KEY=1234567890abcdef1234567890abcdef
INDEXNOW_API_SECRET=your-secret-api-key-here
```

---

## 🎯 Why This Matters for SEO

### **Canonical URLs Tell Google:**
- Which version of your URL is the "official" one
- Prevents duplicate content issues
- Consolidates ranking signals to one domain

### **Current Problem:**
- Google sees `mediaplanpro.vercel.app` as canonical
- This splits your SEO authority between two domains
- Your custom domain (`mediaplanpro.com`) doesn't get full credit

### **After Fix:**
- All pages will declare `mediaplanpro.com` as canonical
- Google will consolidate all ranking signals to your main domain
- Better SEO performance and rankings

---

## ⏱️ Timeline

| Action | Timeline |
|--------|----------|
| Add environment variable in Vercel | Immediate |
| Redeploy site | 2-3 minutes |
| Canonical URL updated in HTML | Immediate after deploy |
| Google re-crawls and updates | 1-7 days |
| Full canonical consolidation | 2-4 weeks |

---

## 🔍 How to Verify It's Working

### **1. Check HTML Source (Immediate)**
```bash
curl -s https://www.mediaplanpro.com/ | grep canonical
```

Should output:
```html
<link rel="canonical" href="https://www.mediaplanpro.com/" />
```

### **2. Check Google Search Console (1-7 days)**
- URL Inspection → `https://www.mediaplanpro.com/`
- Look for "User-declared canonical"
- Should show: `https://www.mediaplanpro.com/`

### **3. Check All Pages**
Test a few tool pages to ensure they all use the correct domain:
- https://www.mediaplanpro.com/tools/advertising/roi-calculator
- https://www.mediaplanpro.com/tools/content/headline-analyzer
- https://www.mediaplanpro.com/strategy

---

## 🚨 Common Mistakes to Avoid

❌ **Don't use trailing slash:** `https://www.mediaplanpro.com/` (with slash)  
✅ **Use without trailing slash:** `https://www.mediaplanpro.com` (no slash)

❌ **Don't use http:** `http://www.mediaplanpro.com`  
✅ **Use https:** `https://www.mediaplanpro.com`

❌ **Don't use vercel domain:** `https://mediaplanpro.vercel.app`  
✅ **Use custom domain:** `https://www.mediaplanpro.com`

---

## 📞 Need Help?

If you encounter any issues:

1. **Check Vercel deployment logs:**
   - Go to Deployments tab
   - Click on latest deployment
   - Check "Build Logs" for errors

2. **Verify environment variable is set:**
   - Settings → Environment Variables
   - Look for `NEXTAUTH_URL`
   - Should show value: `https://www.mediaplanpro.com`

3. **Clear cache and redeploy:**
   - Sometimes Vercel caches old values
   - Try redeploying 2-3 times if needed

---

## ✅ Checklist

- [ ] Add `NEXTAUTH_URL=https://www.mediaplanpro.com` in Vercel
- [ ] Add `INDEXNOW_KEY` in Vercel (for SEO)
- [ ] Add `INDEXNOW_API_SECRET` in Vercel (for SEO)
- [ ] Redeploy site from Vercel or GitHub
- [ ] Verify canonical URL in page source
- [ ] Wait 1-7 days for Google to re-crawl
- [ ] Check Google Search Console for updated canonical

---

**Last Updated:** 2025-01-24  
**Priority:** 🔴 HIGH - Fix this ASAP for proper SEO

