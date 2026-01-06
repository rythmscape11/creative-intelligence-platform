# Google Search Console Setup Guide - MediaPlanPro

**Date:** October 14, 2025  
**Production URL:** https://www.mediaplanpro.com  
**Sitemap URL:** https://www.mediaplanpro.com/sitemap.xml  
**Status:** ✅ Ready for Submission

---

## 📋 Table of Contents

1. [Sitemap Overview](#sitemap-overview)
2. [Google Search Console Setup](#google-search-console-setup)
3. [Sitemap Submission Steps](#sitemap-submission-steps)
4. [Verification Methods](#verification-methods)
5. [Post-Submission Monitoring](#post-submission-monitoring)
6. [Troubleshooting](#troubleshooting)

---

## 🗺️ Sitemap Overview

### **Sitemap URLs**

MediaPlanPro has **TWO sitemap implementations**:

1. **Dynamic Sitemap (Recommended):**
   - URL: `https://www.mediaplanpro.com/sitemap.xml`
   - Location: `src/app/sitemap.xml/route.ts`
   - Updates: Automatically updates with current date
   - Format: XML generated via Next.js API route

2. **Static Sitemap (Backup):**
   - URL: `https://www.mediaplanpro.com/sitemap.xml` (served from public folder)
   - Location: `public/sitemap.xml`
   - Updates: Manual updates required
   - Format: Static XML file

**Submit this URL to Google Search Console:**
```
https://www.mediaplanpro.com/sitemap.xml
```

---

### **Sitemap Statistics**

| Category | Pages | Priority | Change Frequency |
|----------|-------|----------|------------------|
| **Homepage** | 1 | 1.0 | Daily |
| **Main Product Pages** | 4 | 0.9 | Weekly/Daily |
| **Secondary Pages** | 3 | 0.8 | Weekly/Monthly |
| **Growth Suite** | 7 | 0.7 | Weekly |
| **Company/Info** | 3 | 0.6-0.7 | Monthly |
| **Documentation** | 5 | 0.5-0.7 | Weekly/Daily |
| **Legal Pages** | 4 | 0.4 | Monthly |
| **Advertising Tools** | 5 | 0.8 | Weekly |
| **Content Tools** | 8 | 0.8 | Weekly |
| **Email Tools** | 4 | 0.8 | Weekly |
| **SEO Tools** | 7 | 0.8 | Weekly |
| **Social Media Tools** | 6 | 0.8 | Weekly |
| **TOTAL** | **57 Pages** | - | - |

---

### **Pages Included in Sitemap**

#### **Core Pages (Priority: 0.9-1.0)**
- ✅ Homepage: `/`
- ✅ Strategy Builder: `/strategy`
- ✅ Pricing: `/pricing`
- ✅ Blog: `/blog`
- ✅ Tools Hub: `/tools`

#### **Marketing Tools (Priority: 0.8)**

**Advertising Tools (5):**
- ✅ Ad Copy Generator
- ✅ Budget Allocator
- ✅ CPC/CPM Calculator
- ✅ Landing Page Analyzer
- ✅ ROI Calculator

**Content Tools (8):**
- ✅ Blog Outline Generator
- ✅ Content Calendar Generator
- ✅ Email Subject Tester
- ✅ Headline Analyzer
- ✅ Keyword Density Checker
- ✅ Meta Description Generator
- ✅ Readability Scorer
- ✅ Social Caption Generator

**Email Tools (4):**
- ✅ Email Preview
- ✅ List Segmentation Calculator
- ✅ Signature Generator
- ✅ Spam Score Checker

**SEO Tools (7):**
- ✅ Backlink Checker
- ✅ Keyword Research
- ✅ Page Speed Analyzer
- ✅ Robots.txt Generator
- ✅ Schema Generator
- ✅ SERP Preview
- ✅ XML Sitemap Generator

**Social Media Tools (6):**
- ✅ Best Time to Post
- ✅ Engagement Calculator
- ✅ Hashtag Generator
- ✅ Image Resizer
- ✅ Social Audit Tool
- ✅ UTM Builder

#### **Growth Suite (Priority: 0.7-0.8)**
- ✅ Growth Suite Hub
- ✅ SEO Analytics
- ✅ Competitor Analysis
- ✅ Attribution Tracking
- ✅ A/B Testing
- ✅ Heatmaps
- ✅ Content Repurposer
- ✅ Conversion Widgets

#### **Company & Legal (Priority: 0.4-0.7)**
- ✅ About
- ✅ Contact
- ✅ Careers
- ✅ Documentation
- ✅ Help Center
- ✅ API Docs
- ✅ Community
- ✅ Status Page
- ✅ Privacy Policy
- ✅ Terms of Service
- ✅ Cookie Policy
- ✅ GDPR Compliance

---

### **Pages Excluded from Sitemap**

The following pages are **intentionally excluded** (protected/internal):

- ❌ `/admin/*` - Admin panel (requires authentication)
- ❌ `/dashboard/*` - User dashboard (requires authentication)
- ❌ `/api/*` - API endpoints (not indexable)
- ❌ `/auth/*` - Authentication pages (not indexable)
- ❌ `/_next/*` - Next.js internal files
- ❌ `/static/*` - Static assets

These exclusions are also defined in `robots.txt`:
```
https://www.mediaplanpro.com/robots.txt
```

---

## 🚀 Google Search Console Setup

### **Step 1: Access Google Search Console**

1. Go to: https://search.google.com/search-console
2. Sign in with your Google account
3. Click **"Add Property"**

---

### **Step 2: Choose Property Type**

You have two options:

#### **Option A: Domain Property (Recommended)**
- Covers all subdomains and protocols (http/https)
- Requires DNS verification
- Domain: `mediaplanpro.com`

#### **Option B: URL Prefix Property**
- Covers only the specific URL
- Multiple verification methods available
- URL: `https://www.mediaplanpro.com`

**Recommendation:** Use **Domain Property** for comprehensive coverage.

---

## ✅ Verification Methods

### **Method 1: DNS Verification (Recommended for Domain Property)**

1. Google will provide a TXT record
2. Add the TXT record to your domain's DNS settings
3. Example TXT record:
   ```
   google-site-verification=abc123xyz456
   ```
4. Go to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare)
5. Add the TXT record to DNS settings
6. Wait 5-10 minutes for DNS propagation
7. Click **"Verify"** in Google Search Console

---

### **Method 2: HTML File Upload (For URL Prefix)**

1. Download the verification file from Google (e.g., `google1234567890abcdef.html`)
2. Upload to `public/` folder in your project
3. Commit and deploy to production
4. Verify the file is accessible: `https://www.mediaplanpro.com/google1234567890abcdef.html`
5. Click **"Verify"** in Google Search Console

---

### **Method 3: HTML Meta Tag (For URL Prefix)**

1. Google will provide a meta tag:
   ```html
   <meta name="google-site-verification" content="abc123xyz456" />
   ```
2. Add to `src/app/layout.tsx` in the `<head>` section:
   ```tsx
   export const metadata: Metadata = {
     verification: {
       google: 'abc123xyz456',
     },
   };
   ```
3. Deploy to production
4. Click **"Verify"** in Google Search Console

---

### **Method 4: Google Analytics (If Already Installed)**

1. Ensure Google Analytics is installed on your site
2. Use the same Google account for Search Console
3. Google will automatically verify via Analytics tracking code
4. Click **"Verify"**

---

## 📤 Sitemap Submission Steps

### **Step 1: Verify Sitemap is Accessible**

Before submitting, verify your sitemap is live:

```bash
curl -I https://www.mediaplanpro.com/sitemap.xml
```

Expected response:
```
HTTP/2 200
content-type: application/xml
```

Or visit in browser: https://www.mediaplanpro.com/sitemap.xml

---

### **Step 2: Submit Sitemap to Google Search Console**

1. **Log in** to Google Search Console
2. **Select your property** (mediaplanpro.com)
3. In the left sidebar, click **"Sitemaps"**
4. Under **"Add a new sitemap"**, enter:
   ```
   sitemap.xml
   ```
   (Google will automatically prepend your domain)
5. Click **"Submit"**

---

### **Step 3: Verify Submission**

After submission, you should see:

- **Status:** Success ✅
- **Type:** Sitemap
- **Submitted:** [Current Date]
- **Last Read:** [Will update after Google crawls]
- **Discovered URLs:** 57 (may take 24-48 hours to show)

---

## 📊 Post-Submission Monitoring

### **What to Monitor**

1. **Coverage Report**
   - Path: `Search Console > Coverage`
   - Check for errors, warnings, valid pages
   - Goal: All 57 pages indexed

2. **Sitemap Status**
   - Path: `Search Console > Sitemaps`
   - Check "Discovered URLs" count
   - Should show 57 URLs

3. **Index Coverage**
   - Path: `Search Console > Index > Coverage`
   - Monitor "Valid" vs "Excluded" pages
   - Investigate any errors

4. **Performance**
   - Path: `Search Console > Performance`
   - Track clicks, impressions, CTR, position
   - Monitor which pages get traffic

---

### **Expected Timeline**

| Timeframe | Expected Activity |
|-----------|-------------------|
| **0-24 hours** | Sitemap submitted, Google starts crawling |
| **1-3 days** | First pages indexed (homepage, high-priority pages) |
| **1-2 weeks** | Most pages indexed (tools, secondary pages) |
| **2-4 weeks** | All pages indexed, performance data available |
| **1-3 months** | Stable rankings, organic traffic growth |

---

## 🔧 Troubleshooting

### **Issue 1: Sitemap Not Found (404 Error)**

**Symptoms:**
- Google reports "Couldn't fetch sitemap"
- Status: 404 Not Found

**Solutions:**
1. Verify sitemap is accessible: `curl https://www.mediaplanpro.com/sitemap.xml`
2. Check Vercel deployment logs
3. Ensure `src/app/sitemap.xml/route.ts` is deployed
4. Clear Vercel cache and redeploy

---

### **Issue 2: Sitemap Has Errors**

**Symptoms:**
- Google reports "Sitemap has errors"
- Invalid XML format

**Solutions:**
1. Validate XML: https://www.xmlvalidation.com/
2. Check for special characters (escape `&`, `<`, `>`, `"`, `'`)
3. Ensure proper XML structure
4. Test locally before deploying

---

### **Issue 3: Pages Not Being Indexed**

**Symptoms:**
- Sitemap submitted successfully
- But pages not appearing in Google search

**Solutions:**
1. Check `robots.txt` - ensure pages aren't blocked
2. Verify pages don't have `noindex` meta tags
3. Check page quality (thin content, duplicate content)
4. Request indexing manually via Search Console
5. Build internal links to important pages

---

### **Issue 4: Discovered URLs Count is Wrong**

**Symptoms:**
- Google shows fewer than 57 URLs

**Solutions:**
1. Wait 48-72 hours for Google to fully crawl
2. Check for duplicate URLs in sitemap
3. Verify all URLs return 200 status codes
4. Check for redirect chains (301/302)

---

## 📈 SEO Best Practices

### **1. Regular Sitemap Updates**

- Update `lastmod` date when pages change
- Add new pages to sitemap immediately
- Remove deleted pages from sitemap
- Resubmit sitemap after major changes

### **2. Priority & Change Frequency**

Current settings are optimized:
- **Priority 1.0:** Homepage only
- **Priority 0.9:** Main product pages
- **Priority 0.8:** Marketing tools (high SEO value)
- **Priority 0.7:** Secondary pages
- **Priority 0.4:** Legal pages

### **3. Monitor & Optimize**

- Check Search Console weekly
- Fix crawl errors immediately
- Optimize pages with low CTR
- Build backlinks to high-priority pages

---

## 🎯 Next Steps After Submission

1. **✅ Submit Sitemap** - Follow steps above
2. **✅ Verify Ownership** - Complete verification
3. **✅ Monitor Coverage** - Check indexing status
4. **✅ Fix Errors** - Address any crawl issues
5. **✅ Build Content** - Add blog posts regularly
6. **✅ Build Links** - Get backlinks to tools
7. **✅ Track Performance** - Monitor rankings & traffic

---

## 📚 Additional Resources

- **Google Search Console Help:** https://support.google.com/webmasters
- **Sitemap Protocol:** https://www.sitemaps.org/protocol.html
- **Google Indexing Guide:** https://developers.google.com/search/docs/crawling-indexing
- **SEO Starter Guide:** https://developers.google.com/search/docs/fundamentals/seo-starter-guide

---

## 📝 Summary

**Sitemap URL to Submit:**
```
https://www.mediaplanpro.com/sitemap.xml
```

**Total Pages:** 57  
**Status:** ✅ Ready for Submission  
**Last Updated:** October 14, 2025  

**Quick Submission Link:**
```
https://search.google.com/search-console/sitemaps?resource_id=https://www.mediaplanpro.com
```

---

**Good luck with your SEO! 🚀**

