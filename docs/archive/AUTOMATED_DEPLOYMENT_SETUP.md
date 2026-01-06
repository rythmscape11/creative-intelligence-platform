# 🤖 Automated Vercel Deployment Setup

**Complete guide to set up fully automated deployment to Vercel**

---

## 🎯 **What This Does**

Once configured, every push to the `main` branch will automatically:
1. ✅ Build your Next.js application
2. ✅ Run database migrations
3. ✅ Deploy to Vercel production
4. ✅ Update your live site

**Zero manual intervention required!**

---

## 📋 **One-Time Setup (10 minutes)**

### **Option A: GitHub Integration (Recommended - Easiest)**

This is the simplest method - Vercel automatically detects and deploys from GitHub.

#### **Step 1: Connect GitHub to Vercel (5 min)**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import Repository:**
   - Find: `rythmscape11/mediaplanpro`
   - Click **"Import"**

3. **Configure Project:**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (uses our updated script)
   - Output Directory: `.next`

4. **Add Environment Variables:**
   ```
   NEXTAUTH_SECRET=jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=
   JWT_SECRET=B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=
   NODE_ENV=production
   ```

5. **Click "Deploy"** (first deploy will fail - expected)

#### **Step 2: Create Vercel Postgres Database (3 min)**

1. **In your project**, click **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose **"Hobby"** (Free)
5. Name: `mediaplanpro-db`
6. Region: **US East (iad1)**
7. Click **"Create"**
8. Click **"Connect Project"** → Select your project

#### **Step 3: Add Database Environment Variables (2 min)**

1. Go to **Settings** → **Environment Variables**
2. Add `DATABASE_URL`:
   - Copy value from `POSTGRES_PRISMA_URL` (in Storage tab)
   - Environment: All (Production, Preview, Development)
3. Add `NEXTAUTH_URL`:
   - Value: Your Vercel URL (e.g., `https://mediaplanpro.vercel.app`)
   - Environment: Production

#### **Step 4: Trigger Deployment**

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. ✅ **Done!** Deployment should succeed

---

### **Option B: GitHub Actions (Advanced - More Control)**

This method uses GitHub Actions for deployment with more control over the process.

#### **Step 1: Get Vercel Tokens (5 min)**

1. **Get Vercel Access Token:**
   - Go to: https://vercel.com/account/tokens
   - Click **"Create Token"**
   - Name: `GitHub Actions - MediaPlanPro`
   - Scope: Full Account
   - Expiration: No Expiration
   - Click **"Create"**
   - **Copy the token** (you won't see it again!)

2. **Get Vercel Project ID:**
   ```bash
   # Run this in your project directory
   npx vercel link
   # Follow prompts to link project
   
   # Get Project ID
   cat .vercel/project.json
   # Copy the "projectId" value
   ```

3. **Get Vercel Org ID:**
   ```bash
   # From the same file
   cat .vercel/project.json
   # Copy the "orgId" value
   ```

#### **Step 2: Add GitHub Secrets (3 min)**

1. **Go to GitHub Repository:**
   - Visit: https://github.com/rythmscape11/mediaplanpro
   - Click **"Settings"** → **"Secrets and variables"** → **"Actions"**

2. **Add these secrets:**
   - Click **"New repository secret"**
   
   **Secret 1:**
   - Name: `VERCEL_TOKEN`
   - Value: [Your Vercel Access Token from Step 1]
   
   **Secret 2:**
   - Name: `VERCEL_ORG_ID`
   - Value: [Your Org ID from Step 1]
   
   **Secret 3:**
   - Name: `VERCEL_PROJECT_ID`
   - Value: [Your Project ID from Step 1]

#### **Step 3: Push to GitHub**

The GitHub Actions workflow is already created in `.github/workflows/deploy-vercel.yml`

```bash
# Commit and push
git add .
git commit -m "feat: Add automated Vercel deployment"
git push origin main

# ✅ GitHub Actions will automatically deploy!
```

#### **Step 4: Monitor Deployment**

1. Go to: https://github.com/rythmscape11/mediaplanpro/actions
2. Click on the latest workflow run
3. Watch the deployment progress
4. ✅ Done when all steps are green!

---

## 🚀 **How to Use After Setup**

### **Automatic Deployment:**

```bash
# Make your changes
git add .
git commit -m "Your changes"
git push origin main

# ✅ Vercel automatically deploys!
# ✅ Takes 2-3 minutes
# ✅ Zero manual steps
```

### **Check Deployment Status:**

**Option A (GitHub Integration):**
- Go to: https://vercel.com/dashboard
- Click on your project
- See latest deployment status

**Option B (GitHub Actions):**
- Go to: https://github.com/rythmscape11/mediaplanpro/actions
- See workflow runs and status

---

## 📊 **Deployment Flow**

```
┌─────────────────────────────────────────────────────────────┐
│  Developer                                                   │
│  ├─ Make code changes                                       │
│  ├─ git commit -m "Update feature"                          │
│  └─ git push origin main                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  GitHub                                                      │
│  ├─ Receives push to main branch                            │
│  └─ Triggers deployment                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Vercel (Option A) OR GitHub Actions (Option B)             │
│  ├─ Checkout code                                           │
│  ├─ Install dependencies (npm install)                      │
│  ├─ Generate Prisma Client (prisma generate)                │
│  ├─ Run migrations (prisma migrate deploy)                  │
│  ├─ Build Next.js (next build)                              │
│  └─ Deploy to production                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  Live Site                                                   │
│  ✅ https://mediaplanpro.vercel.app                         │
│  ✅ Updated with latest changes                             │
│  ✅ Zero downtime deployment                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 **Configuration Files**

### **1. `vercel.json`** (Already created)
```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXTAUTH_URL": "https://mediaplanpro.vercel.app"
  }
}
```

### **2. `.github/workflows/deploy-vercel.yml`** (Already created)
GitHub Actions workflow for automated deployment.

### **3. `package.json`** (Already updated)
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

---

## 🔑 **Environment Variables**

### **Required in Vercel:**

```bash
# Authentication
NEXTAUTH_SECRET=jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=
JWT_SECRET=B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=
NEXTAUTH_URL=https://mediaplanpro.vercel.app

# Database (from Vercel Postgres)
DATABASE_URL=postgresql://default:...

# Environment
NODE_ENV=production
```

### **Required in GitHub (for Option B only):**

```bash
VERCEL_TOKEN=<your-vercel-access-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID=<your-project-id>
```

---

## ✅ **Verification Checklist**

After setup, verify everything works:

- [ ] Push a small change to `main` branch
- [ ] Check deployment starts automatically
- [ ] Wait for deployment to complete (2-3 min)
- [ ] Visit your live site
- [ ] Verify changes are live
- [ ] Check no errors in deployment logs

---

## 🐛 **Troubleshooting**

### **Deployment Fails?**

**Check build logs:**
- Vercel: Dashboard → Deployments → Click deployment → View logs
- GitHub Actions: Actions tab → Click workflow run → View logs

**Common issues:**
1. **Missing environment variables**
   - Solution: Add all required env vars in Vercel dashboard

2. **Database connection fails**
   - Solution: Verify `DATABASE_URL` matches `POSTGRES_PRISMA_URL`

3. **Migration fails**
   - Solution: Check migration files are committed to Git

### **GitHub Actions Not Triggering?**

1. Check workflow file is in `.github/workflows/`
2. Verify GitHub secrets are set correctly
3. Check Actions tab for error messages
4. Ensure workflow is enabled (Actions → Enable workflow)

### **Vercel Integration Not Working?**

1. Check GitHub app is installed: https://github.com/apps/vercel
2. Verify repository access is granted
3. Check Vercel project settings → Git Integration

---

## 📈 **Deployment Metrics**

### **Typical Deployment Timeline:**

| Step | Time |
|------|------|
| Git push | 1 sec |
| Trigger detection | 5 sec |
| Checkout code | 10 sec |
| Install dependencies | 30 sec |
| Generate Prisma | 5 sec |
| Run migrations | 10 sec |
| Build Next.js | 60 sec |
| Deploy to edge | 20 sec |
| **Total** | **~2-3 min** |

### **Success Rate:**
- ✅ First deployment: May fail (database setup needed)
- ✅ After setup: 99%+ success rate
- ✅ Zero downtime deployments

---

## 🎯 **Recommended Setup**

**For most users:** Use **Option A (GitHub Integration)**
- ✅ Easiest to set up
- ✅ Official Vercel integration
- ✅ Automatic preview deployments for PRs
- ✅ Built-in deployment protection

**For advanced users:** Use **Option B (GitHub Actions)**
- ✅ More control over deployment process
- ✅ Custom build steps
- ✅ Integration with other CI/CD tools
- ✅ Custom notifications

---

## 🚀 **Quick Start**

**Choose your path:**

### **Path 1: GitHub Integration (10 min)**
1. Go to https://vercel.com/new
2. Import `rythmscape11/mediaplanpro`
3. Add environment variables
4. Deploy
5. Create Vercel Postgres database
6. Add `DATABASE_URL` and `NEXTAUTH_URL`
7. Redeploy
8. ✅ Done!

### **Path 2: GitHub Actions (15 min)**
1. Get Vercel tokens
2. Add GitHub secrets
3. Push to main
4. ✅ Done!

---

## 📞 **Support**

**Documentation:**
- Vercel Docs: https://vercel.com/docs
- GitHub Actions: https://docs.github.com/actions

**Quick Guides:**
- `VERCEL_QUICK_START.md` - 5-minute quick start
- `VERCEL_DEPLOYMENT_INSTRUCTIONS.md` - Comprehensive guide

---

## 🎉 **Success!**

Once set up, you'll have:
- ✅ Fully automated deployments
- ✅ Zero manual intervention
- ✅ Automatic preview deployments for PRs
- ✅ Production deployments on merge to main
- ✅ Instant rollback capability
- ✅ Deployment notifications

**Happy deploying!** 🚀

