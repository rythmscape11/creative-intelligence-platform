# 🚀 Vercel Deployment Guide - MediaPlanPro

**Complete step-by-step guide to deploy MediaPlanPro to Vercel**

---

## ✅ **Prerequisites (Already Done!)**

- ✅ GitHub repository: `rythmscape11/mediaplanpro`
- ✅ Code pushed to GitHub
- ✅ Prisma schema updated to PostgreSQL
- ✅ Build script configured for Vercel
- ✅ Environment variables documented

---

## 📋 **Deployment Steps**

### **Step 1: Sign Up for Vercel** (2 min)

1. **Go to**: https://vercel.com/signup (already opened in your browser)

2. **Click**: "Continue with GitHub"

3. **Authorize Vercel**: 
   - GitHub will ask for permission
   - Click "Authorize Vercel"
   - This connects your GitHub account

4. **Complete signup**:
   - You'll be redirected to Vercel dashboard
   - You might be asked to verify your email

---

### **Step 2: Import Your Project** (3 min)

1. **In Vercel Dashboard**, click **"Add New..."** → **"Project"**

2. **Import Git Repository**:
   - You'll see a list of your GitHub repositories
   - Find: `rythmscape11/mediaplanpro`
   - Click **"Import"**

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Don't deploy yet!** We need to add environment variables first.

---

### **Step 3: Add Environment Variables** (5 min)

**Before clicking "Deploy", scroll down to "Environment Variables" section**

Add these 3 variables:

#### **Variable 1: NEXTAUTH_SECRET**
- **Name**: `NEXTAUTH_SECRET`
- **Value**: `jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=`
- **Environment**: Check all (Production, Preview, Development)
- Click **"Add"**

#### **Variable 2: JWT_SECRET**
- **Name**: `JWT_SECRET`
- **Value**: `B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=`
- **Environment**: Check all (Production, Preview, Development)
- Click **"Add"**

#### **Variable 3: NODE_ENV**
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Environment**: Production only
- Click **"Add"**

**Note**: We'll add `DATABASE_URL` and `NEXTAUTH_URL` after the first deployment.

---

### **Step 4: Deploy (First Deployment)** (3 min)

1. **Click**: "Deploy" button

2. **Wait**: Vercel will:
   - Clone your repository
   - Install dependencies
   - Build your Next.js app
   - Deploy to edge network

3. **Expected**: Build will **FAIL** (this is normal!)
   - Reason: No database connection yet
   - Don't worry, we'll fix this next

4. **Note your URL**: 
   - Even if build fails, Vercel assigns a URL
   - It will be something like: `https://mediaplanpro-xyz123.vercel.app`
   - Or: `https://mediaplanpro.vercel.app`

---

### **Step 5: Create Vercel Postgres Database** (5 min)

1. **In your project dashboard**, click **"Storage"** tab (top menu)

2. **Click**: "Create Database"

3. **Select**: "Postgres"

4. **Choose plan**: 
   - **Hobby** (Free tier)
   - Includes: 256 MB storage, 60 hours compute/month

5. **Database name**: `mediaplanpro-db` (or leave default)

6. **Region**: Choose closest to your users (e.g., US East, EU West)

7. **Click**: "Create"

8. **Wait**: ~30 seconds for database to be created

9. **Important**: Vercel automatically adds these environment variables to your project:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` ← **This is your DATABASE_URL**
   - `POSTGRES_URL_NON_POOLING`
   - And others

---

### **Step 6: Update Environment Variables** (3 min)

1. **Go to**: Settings → Environment Variables

2. **Add DATABASE_URL**:
   - **Name**: `DATABASE_URL`
   - **Value**: Copy the value from `POSTGRES_PRISMA_URL` (shown in Storage tab)
   - **Environment**: Check all (Production, Preview, Development)
   - Click **"Add"**

3. **Add NEXTAUTH_URL**:
   - **Name**: `NEXTAUTH_URL`
   - **Value**: Your Vercel URL (e.g., `https://mediaplanpro.vercel.app`)
   - **Environment**: Production only
   - Click **"Add"**

**Your environment variables should now be**:
- ✅ `NEXTAUTH_SECRET`
- ✅ `JWT_SECRET`
- ✅ `NODE_ENV`
- ✅ `DATABASE_URL`
- ✅ `NEXTAUTH_URL`
- ✅ `POSTGRES_URL` (auto-added by Vercel)
- ✅ `POSTGRES_PRISMA_URL` (auto-added by Vercel)

---

### **Step 7: Redeploy** (3 min)

1. **Go to**: Deployments tab

2. **Click**: "..." menu on the latest deployment

3. **Click**: "Redeploy"

4. **Check**: "Use existing Build Cache" (optional, faster)

5. **Click**: "Redeploy"

6. **Wait**: 2-3 minutes for deployment

7. **Expected**: Build should **succeed** this time! ✅

---

### **Step 8: Run Database Migrations** (2 min)

Your build script automatically runs migrations, but let's verify:

1. **Check build logs**:
   - Go to Deployments → Click on latest deployment
   - Click "Building" to see logs
   - Look for: `prisma migrate deploy`
   - Should see: "Migrations applied successfully"

2. **If migrations didn't run**, you can run them manually:
   - Go to Settings → Environment Variables
   - Copy the `DATABASE_URL` value
   - Run locally:
   ```bash
   export DATABASE_URL="postgresql://..."
   npx prisma migrate deploy
   ```

---

### **Step 9: Seed Database (Optional)** (5 min)

To add test users and blog posts:

1. **Option A: Run locally** (recommended):
   ```bash
   # Set DATABASE_URL from Vercel
   export DATABASE_URL="postgresql://[copy from Vercel]"
   
   # Run seed script
   npm run db:seed
   ```

2. **Option B: Create users manually** through the app after deployment

---

### **Step 10: Test Your Deployment** (5 min)

1. **Visit your URL**: `https://mediaplanpro.vercel.app`

2. **Test pages**:
   - ✅ Homepage loads
   - ✅ `/login` page works
   - ✅ `/blog` page loads (might be empty if not seeded)

3. **Create an account**:
   - Go to `/login`
   - Click "Sign up" (if available)
   - Or use seeded credentials:
     - Email: `admin@mediaplanpro.com`
     - Password: `admin123`

4. **Test authentication**:
   - Login should work
   - Redirect to dashboard
   - Check role-based access

---

## ✅ **Deployment Checklist**

Track your progress:

- [ ] Sign up for Vercel with GitHub
- [ ] Import `rythmscape11/mediaplanpro` repository
- [ ] Add environment variables (NEXTAUTH_SECRET, JWT_SECRET, NODE_ENV)
- [ ] First deployment (expected to fail)
- [ ] Create Vercel Postgres database
- [ ] Add DATABASE_URL environment variable
- [ ] Add NEXTAUTH_URL environment variable
- [ ] Redeploy (should succeed)
- [ ] Verify migrations ran
- [ ] Seed database (optional)
- [ ] Test live site

---

## 🎯 **Expected Result**

After completion:

- ✅ **Live URL**: `https://mediaplanpro.vercel.app`
- ✅ **Automatic deployments**: Every push to `main` branch deploys automatically
- ✅ **PostgreSQL database**: Free tier (256 MB)
- ✅ **SSL certificate**: Automatic HTTPS
- ✅ **CDN**: Global edge network
- ✅ **Zero configuration**: Everything just works

---

## 🔄 **Future Deployments**

From now on, deployment is automatic:

```bash
# Make changes to your code
git add .
git commit -m "Your changes"
git push origin main

# ✅ Vercel automatically deploys!
# ✅ Takes 2-3 minutes
# ✅ Zero downtime
```

---

## 🌐 **Custom Domain (Optional)**

To use your own domain:

1. **In Vercel project**, go to Settings → Domains

2. **Add domain**: `mediaplanpro.com`

3. **Configure DNS**:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers

4. **Update NEXTAUTH_URL**:
   - Settings → Environment Variables
   - Update `NEXTAUTH_URL` to `https://mediaplanpro.com`
   - Redeploy

---

## 🐛 **Troubleshooting**

### **Build Fails**

**Check build logs**:
- Deployments → Click deployment → View logs
- Look for error messages

**Common issues**:
- Missing environment variables
- TypeScript errors
- Prisma schema issues

**Solution**:
- Fix errors in code
- Push to GitHub
- Vercel auto-deploys

---

### **Database Connection Fails**

**Symptoms**:
- "Can't reach database server"
- "Connection timeout"

**Solution**:
1. Verify `DATABASE_URL` is set correctly
2. Check it matches `POSTGRES_PRISMA_URL` from Storage tab
3. Ensure database is in same region as deployment

---

### **Authentication Fails**

**Symptoms**:
- Can't login
- "Invalid credentials" for correct password
- Redirect loops

**Solution**:
1. Verify `NEXTAUTH_URL` matches your Vercel URL exactly
2. Check `NEXTAUTH_SECRET` is set
3. Clear browser cookies
4. Try incognito mode

---

### **Migrations Don't Run**

**Symptoms**:
- "Table doesn't exist" errors
- Database is empty

**Solution**:
Run migrations manually:
```bash
export DATABASE_URL="postgresql://[from Vercel]"
npx prisma migrate deploy
```

---

## 📊 **Vercel Free Tier Limits**

Your free tier includes:

- ✅ **Bandwidth**: 100 GB/month
- ✅ **Build time**: 6,000 minutes/month
- ✅ **Serverless functions**: 100 GB-hours
- ✅ **Edge functions**: 500,000 invocations
- ✅ **Database**: 256 MB storage, 60 hours compute

**This is more than enough for development and small production apps!**

---

## 🎉 **Success!**

Once deployed, you have:

- ✅ Professional production deployment
- ✅ Automatic CI/CD from GitHub
- ✅ Global CDN
- ✅ Automatic SSL
- ✅ PostgreSQL database
- ✅ Zero configuration
- ✅ **FREE!**

---

## 📞 **Need Help?**

If you encounter issues:

1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Let me know and I'll help troubleshoot!

---

**Next Step**: Complete Vercel signup and import your project!

**Vercel Signup**: https://vercel.com/signup (already open)

