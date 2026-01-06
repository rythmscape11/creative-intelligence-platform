# 🚀 Vercel Deployment Instructions - MediaPlanPro

**Quick deployment guide for MediaPlanPro to Vercel with Vercel Postgres**

---

## 🎯 **Current Status**

- ✅ Code pushed to GitHub: `rythmscape11/mediaplanpro`
- ✅ Vercel CLI installed and authenticated
- ✅ Build script updated for production migrations
- ✅ `vercel.json` configuration created
- ⚠️ **Issue:** Existing Neon database has failed migrations
- ✅ **Solution:** Use Vercel Postgres (recommended)

---

## 📋 **Deployment Steps**

### **Option A: Deploy via Vercel Dashboard (Recommended - Easiest)**

#### **Step 1: Go to Vercel Dashboard**
1. Open: https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**

#### **Step 2: Import Repository**
1. Find: `rythmscape11/mediaplanpro`
2. Click **"Import"**

#### **Step 3: Configure Project**
- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./`
- **Build Command:** `npm run build` (auto-filled)
- **Output Directory:** `.next` (auto-filled)

#### **Step 4: Add Environment Variables**

**IMPORTANT:** Add these BEFORE clicking Deploy:

```
NEXTAUTH_SECRET=jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=
JWT_SECRET=B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=
NODE_ENV=production
```

**Note:** Don't add `DATABASE_URL` yet - we'll add it after creating the database.

#### **Step 5: Click "Deploy"**
- First deployment will **FAIL** (expected - no database yet)
- This is normal! We'll fix it in the next steps.

#### **Step 6: Create Vercel Postgres Database**
1. In your project dashboard, click **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose **"Hobby"** plan (Free)
5. Database name: `mediaplanpro-db`
6. Region: **US East (iad1)** (same as deployment)
7. Click **"Create"**

#### **Step 7: Connect Database to Project**
1. After database is created, click **"Connect Project"**
2. Select your `mediaplanpro` project
3. Vercel automatically adds these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - And others

#### **Step 8: Add DATABASE_URL**
1. Go to **Settings** → **Environment Variables**
2. Add new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** Copy from `POSTGRES_PRISMA_URL` (in Storage tab)
   - **Environment:** All (Production, Preview, Development)
3. Click **"Save"**

#### **Step 9: Add NEXTAUTH_URL**
1. Still in Environment Variables
2. Add new variable:
   - **Name:** `NEXTAUTH_URL`
   - **Value:** Your Vercel URL (e.g., `https://mediaplanpro.vercel.app`)
   - **Environment:** Production
3. Click **"Save"**

#### **Step 10: Redeploy**
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes
5. ✅ **Deployment should succeed!**

---

### **Option B: Deploy via CLI (Advanced)**

If you prefer command line:

```bash
# 1. Link to Vercel project (first time only)
npx vercel link

# 2. Add environment variables via CLI
npx vercel env add NEXTAUTH_SECRET
# Paste: jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=

npx vercel env add JWT_SECRET
# Paste: B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=

npx vercel env add NODE_ENV
# Paste: production

# 3. Create Vercel Postgres via dashboard (see Option A, Step 6)

# 4. Add DATABASE_URL after database is created
npx vercel env add DATABASE_URL
# Paste the POSTGRES_PRISMA_URL from Vercel dashboard

# 5. Add NEXTAUTH_URL
npx vercel env add NEXTAUTH_URL
# Paste: https://mediaplanpro.vercel.app (or your assigned URL)

# 6. Deploy to production
npx vercel --prod
```

---

## 🗄️ **Database Setup**

### **After First Successful Deployment:**

#### **Option 1: Seed via Local Connection (Recommended)**

```bash
# 1. Get DATABASE_URL from Vercel
# Go to: Settings → Environment Variables → Copy POSTGRES_PRISMA_URL

# 2. Set it locally (temporary)
export DATABASE_URL="postgresql://default:..."

# 3. Run migrations (if not auto-run)
npx prisma migrate deploy

# 4. Seed the database
npm run db:seed

# 5. Verify
npx prisma studio
```

#### **Option 2: Create Admin User Manually**

After deployment, visit your site and:
1. Go to `/auth/signup`
2. Create your admin account
3. Use Prisma Studio to update role to `ADMIN`

---

## ✅ **Environment Variables Checklist**

Make sure these are set in Vercel:

- [x] `NEXTAUTH_SECRET` - Authentication secret
- [x] `JWT_SECRET` - JWT token secret
- [x] `NODE_ENV` - Set to `production`
- [x] `DATABASE_URL` - PostgreSQL connection string
- [x] `NEXTAUTH_URL` - Your Vercel URL
- [x] `POSTGRES_URL` - Auto-added by Vercel
- [x] `POSTGRES_PRISMA_URL` - Auto-added by Vercel
- [x] `POSTGRES_URL_NON_POOLING` - Auto-added by Vercel

### **Optional (for future features):**
- [ ] `GOOGLE_CLIENT_ID` - For Google OAuth
- [ ] `GOOGLE_CLIENT_SECRET` - For Google OAuth
- [ ] `STRIPE_SECRET_KEY` - For payments
- [ ] `STRIPE_PUBLISHABLE_KEY` - For payments
- [ ] `RAZORPAY_KEY_ID` - For payments (India)
- [ ] `RAZORPAY_KEY_SECRET` - For payments (India)

---

## 🔍 **Verify Deployment**

### **1. Check Build Logs**
1. Go to **Deployments** → Click latest deployment
2. Click **"Building"** to see logs
3. Look for:
   - ✅ `prisma generate` - Success
   - ✅ `prisma migrate deploy` - Success
   - ✅ `next build` - Success

### **2. Test Live Site**
Visit your URL: `https://mediaplanpro.vercel.app`

**Test these pages:**
- ✅ Homepage: `/`
- ✅ Tools: `/tools`
- ✅ Blog: `/blog`
- ✅ Pricing: `/pricing`
- ✅ Sign In: `/auth/signin`
- ✅ Strategy Builder: `/strategy`

### **3. Test Authentication**
1. Go to `/auth/signin`
2. Try to sign in (should work if seeded)
3. Or create new account at `/auth/signup`

---

## 🐛 **Troubleshooting**

### **Build Fails with "prisma migrate deploy" Error**

**Cause:** Database not connected or migrations failed

**Solution:**
1. Check `DATABASE_URL` is set correctly
2. Verify it matches `POSTGRES_PRISMA_URL`
3. Try manual migration:
   ```bash
   export DATABASE_URL="postgresql://..."
   npx prisma migrate deploy
   ```

### **"Can't reach database server" Error**

**Cause:** Database connection string incorrect

**Solution:**
1. Go to Storage tab in Vercel
2. Copy `POSTGRES_PRISMA_URL` exactly
3. Update `DATABASE_URL` environment variable
4. Redeploy

### **Authentication Doesn't Work**

**Cause:** `NEXTAUTH_URL` mismatch

**Solution:**
1. Check `NEXTAUTH_URL` matches your Vercel URL exactly
2. Include `https://` prefix
3. No trailing slash
4. Redeploy after changing

### **"Table doesn't exist" Errors**

**Cause:** Migrations didn't run

**Solution:**
```bash
# Connect to production database
export DATABASE_URL="postgresql://..."

# Run migrations
npx prisma migrate deploy

# Verify tables exist
npx prisma studio
```

---

## 🎯 **Expected Timeline**

- **Step 1-5:** 5 minutes (Import & configure)
- **Step 6-7:** 3 minutes (Create database)
- **Step 8-9:** 2 minutes (Add env vars)
- **Step 10:** 3 minutes (Redeploy)
- **Database seed:** 5 minutes (Optional)

**Total:** ~15-20 minutes

---

## 🚀 **Post-Deployment**

### **Automatic Deployments**
Every push to `main` branch automatically deploys:

```bash
git add .
git commit -m "Your changes"
git push origin main
# ✅ Vercel auto-deploys in 2-3 minutes
```

### **Custom Domain (Optional)**
1. Go to **Settings** → **Domains**
2. Add your domain: `mediaplanpro.com`
3. Configure DNS (CNAME or nameservers)
4. Update `NEXTAUTH_URL` to new domain
5. Redeploy

---

## 📊 **Vercel Free Tier Limits**

Your deployment includes:

- ✅ **Bandwidth:** 100 GB/month
- ✅ **Build time:** 6,000 minutes/month
- ✅ **Serverless functions:** 100 GB-hours
- ✅ **Database:** 256 MB storage, 60 hours compute
- ✅ **SSL:** Automatic HTTPS
- ✅ **CDN:** Global edge network

**Perfect for development and small production apps!**

---

## ✅ **Success Criteria**

Your deployment is successful when:

- ✅ Build completes without errors
- ✅ Homepage loads at your Vercel URL
- ✅ All pages are accessible
- ✅ Authentication works
- ✅ Database queries work
- ✅ No console errors

---

## 📞 **Next Steps**

1. **Complete deployment** using Option A (Dashboard) or Option B (CLI)
2. **Seed database** with test data
3. **Test all features** on live site
4. **Set up custom domain** (optional)
5. **Configure OAuth** (optional - Google, GitHub)
6. **Set up payments** (optional - Stripe, Razorpay)

---

## 🎉 **You're Ready!**

Follow the steps above and your MediaPlanPro will be live on Vercel in ~15 minutes!

**Start here:** https://vercel.com/dashboard

Good luck! 🚀

