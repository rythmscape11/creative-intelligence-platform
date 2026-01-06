# 🤖 Setup Automated Deployment - Quick Guide

**Follow these steps to enable fully automated deployment**

---

## ✅ **What You'll Get**

After this 10-minute setup:
- ✅ **Push to GitHub** → **Auto-deploy to Vercel**
- ✅ **Zero manual steps** after initial setup
- ✅ **2-3 minute deployments** automatically
- ✅ **Preview deployments** for pull requests
- ✅ **Production deployments** on merge to main

---

## 🚀 **Setup Steps (10 minutes)**

### **Step 1: Import to Vercel (2 min)**

The Vercel dashboard is already open in your browser.

1. **Click "Import"** next to `rythmscape11/mediaplanpro`
   - If you don't see it, click **"Add New..."** → **"Project"**
   - Search for: `mediaplanpro`

2. **Configure Project:**
   - Framework: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Add Environment Variables** (click "Add" for each):

   ```bash
   # Variable 1
   Name: NEXTAUTH_SECRET
   Value: jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=
   
   # Variable 2
   Name: JWT_SECRET
   Value: B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=
   
   # Variable 3
   Name: NODE_ENV
   Value: production
   ```

4. **Click "Deploy"**
   - First deployment will **FAIL** (expected - no database)
   - This is normal! Continue to next step.

---

### **Step 2: Create Database (3 min)**

1. **In your Vercel project**, click **"Storage"** tab (top menu)

2. **Click "Create Database"**

3. **Select "Postgres"**

4. **Configure:**
   - Plan: **Hobby** (Free - 256MB)
   - Name: `mediaplanpro-db`
   - Region: **US East (iad1)**

5. **Click "Create"** (takes ~30 seconds)

6. **Click "Connect Project"**
   - Select your `mediaplanpro` project
   - This auto-adds database environment variables

---

### **Step 3: Add Final Environment Variables (2 min)**

1. **Go to Settings** → **Environment Variables**

2. **Add DATABASE_URL:**
   - Click **"Add New"**
   - Name: `DATABASE_URL`
   - Value: Go to **Storage** tab → Copy `POSTGRES_PRISMA_URL` value
   - Environment: **All** (Production, Preview, Development)
   - Click **"Save"**

3. **Add NEXTAUTH_URL:**
   - Click **"Add New"**
   - Name: `NEXTAUTH_URL`
   - Value: Your Vercel URL (shown in deployment, e.g., `https://mediaplanpro.vercel.app`)
   - Environment: **Production**
   - Click **"Save"**

---

### **Step 4: Redeploy (3 min)**

1. **Go to Deployments** tab

2. **Click "..."** menu on the latest (failed) deployment

3. **Click "Redeploy"**

4. **Wait 2-3 minutes**

5. ✅ **Deployment should succeed!**

---

## 🎉 **Setup Complete!**

### **Test Automated Deployment:**

```bash
# Make a small change
echo "# Test automated deployment" >> README.md

# Commit and push
git add README.md
git commit -m "test: Verify automated deployment"
git push origin main

# ✅ Watch it auto-deploy!
# Go to: https://vercel.com/dashboard
# See deployment start automatically
```

---

## 📊 **How It Works**

```
┌──────────────────────────────────────────────────────┐
│  You push to GitHub                                  │
│  $ git push origin main                              │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│  Vercel detects push (via GitHub integration)        │
│  Automatically starts deployment                     │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│  Vercel builds and deploys                           │
│  1. Install dependencies                             │
│  2. Generate Prisma Client                           │
│  3. Run database migrations                          │
│  4. Build Next.js                                    │
│  5. Deploy to production                             │
└──────────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│  Live site updated!                                  │
│  https://mediaplanpro.vercel.app                     │
│  ✅ Zero manual intervention                         │
└──────────────────────────────────────────────────────┘
```

---

## ✅ **Verification Checklist**

After setup, verify:

- [ ] Vercel project created and linked to GitHub
- [ ] All environment variables added (5 total)
- [ ] Vercel Postgres database created and connected
- [ ] First deployment succeeded
- [ ] Live site accessible at your Vercel URL
- [ ] Test push triggers automatic deployment

---

## 🔑 **Environment Variables Summary**

Your Vercel project should have these:

**Manually Added (5):**
- ✅ `NEXTAUTH_SECRET`
- ✅ `JWT_SECRET`
- ✅ `NODE_ENV`
- ✅ `DATABASE_URL`
- ✅ `NEXTAUTH_URL`

**Auto-Added by Vercel (7+):**
- ✅ `POSTGRES_URL`
- ✅ `POSTGRES_PRISMA_URL`
- ✅ `POSTGRES_URL_NON_POOLING`
- ✅ `POSTGRES_USER`
- ✅ `POSTGRES_HOST`
- ✅ `POSTGRES_PASSWORD`
- ✅ `POSTGRES_DATABASE`

---

## 🎯 **What Happens Now**

### **Every time you push to `main`:**
1. Vercel automatically detects the push
2. Starts a new deployment
3. Builds your application
4. Runs database migrations
5. Deploys to production
6. Updates your live site
7. **Takes 2-3 minutes total**

### **For pull requests:**
1. Vercel creates a preview deployment
2. Unique URL for testing
3. Automatic comments on PR with preview link
4. Perfect for testing before merge

---

## 🐛 **Troubleshooting**

### **Deployment Still Failing?**

1. **Check build logs:**
   - Deployments → Click deployment → View logs
   - Look for specific error message

2. **Verify environment variables:**
   - Settings → Environment Variables
   - Ensure all 5 are set correctly

3. **Check database connection:**
   - Verify `DATABASE_URL` matches `POSTGRES_PRISMA_URL`
   - Ensure database is in same region

### **Automatic Deployment Not Triggering?**

1. **Check GitHub integration:**
   - Settings → Git → Verify connected to GitHub
   - Ensure repository access is granted

2. **Check deployment settings:**
   - Settings → Git → Production Branch should be `main`
   - Auto-deploy should be enabled

3. **Verify GitHub app:**
   - Go to: https://github.com/apps/vercel
   - Check it's installed on your repository

---

## 📞 **Next Steps**

### **Optional: Seed Database**

```bash
# Get DATABASE_URL from Vercel
# Settings → Environment Variables → Copy DATABASE_URL

# Set it locally (temporary)
export DATABASE_URL="postgresql://default:..."

# Run seed
npm run db:seed

# Verify
npx prisma studio
```

### **Optional: Custom Domain**

1. Settings → Domains
2. Add your domain
3. Configure DNS
4. Update `NEXTAUTH_URL` to new domain

---

## 🎊 **Success!**

You now have:
- ✅ Fully automated deployments
- ✅ Zero manual intervention
- ✅ Production-ready CI/CD pipeline
- ✅ Preview deployments for PRs
- ✅ Instant rollback capability

**Every push to `main` = Automatic deployment!** 🚀

---

## 📚 **Additional Resources**

- **Full Guide:** `AUTOMATED_DEPLOYMENT_SETUP.md`
- **Quick Start:** `VERCEL_QUICK_START.md`
- **Deployment Instructions:** `VERCEL_DEPLOYMENT_INSTRUCTIONS.md`

---

**Start Now:** The Vercel dashboard is already open in your browser!

**Follow the 4 steps above and you'll be done in 10 minutes!** 🎉

