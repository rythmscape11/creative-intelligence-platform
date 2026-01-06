# Vercel Deployment Steps - MediaPlanPro

**Date**: January 2025  
**Project**: MediaPlanPro  
**Vercel Account**: rythmscape11

---

## Pre-Deployment Checklist

### ✅ Completed:
- [x] Code committed to Git (commit: 4820199)
- [x] Code pushed to GitHub (main branch)
- [x] Build successful locally (`npm run build`)
- [x] Vercel CLI installed (`npx vercel`)
- [x] Logged in to Vercel (rythmscape11)
- [x] Project linked to Vercel (projectId: prj_VkvrCpGtzUsEAqDlGGmzGdyjlJxB)
- [x] `vercel.json` configuration exists
- [x] Environment variables prepared

---

## Deployment Commands

### Option 1: Deploy to Production (Recommended)

```bash
# Deploy directly to production
npx vercel --prod
```

This will:
1. Build the project on Vercel's servers
2. Run database migrations (`prisma db push`)
3. Deploy to production domain
4. Assign the production URL

### Option 2: Deploy to Preview First

```bash
# Deploy to preview environment first
npx vercel

# If preview looks good, promote to production
npx vercel --prod
```

### Option 3: Deploy with Specific Environment

```bash
# Deploy with production environment variables
npx vercel --prod --env-file=.env.production
```

---

## Environment Variables Required

Make sure these are set in Vercel Dashboard:

### Database
- `DATABASE_URL` - PostgreSQL connection string (Neon)

### Authentication
- `NEXTAUTH_URL` - Production URL (https://mediaplanpro.vercel.app or custom domain)
- `NEXTAUTH_SECRET` - Secret key for NextAuth
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Email (Optional)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `EMAIL_FROM`

### Payment (Optional - if using Stripe)
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Analytics (Optional)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics
- `NEXT_PUBLIC_GTM_ID` - Google Tag Manager

---

## Deployment Process

### Step 1: Verify Environment Variables

```bash
# Check current Vercel environment variables
npx vercel env ls
```

### Step 2: Deploy to Production

```bash
# Deploy to production
npx vercel --prod
```

**Expected Output:**
```
Vercel CLI 48.2.9
🔍  Inspect: https://vercel.com/rythmscape11/mediaplanpro/...
✅  Production: https://mediaplanpro.vercel.app [copied to clipboard]
```

### Step 3: Monitor Deployment

1. Visit the Inspect URL to see build logs
2. Wait for build to complete (usually 2-5 minutes)
3. Check for any errors in the build logs

### Step 4: Verify Deployment

```bash
# Check deployment status
npx vercel ls
```

Visit your production URL:
- https://mediaplanpro.vercel.app

---

## Post-Deployment Verification

### 1. Homepage
- [ ] Visit homepage
- [ ] Check navigation works
- [ ] Verify logo and branding

### 2. Authentication
- [ ] Sign in with Google OAuth
- [ ] Sign in with email/password
- [ ] Sign out functionality

### 3. Tool Pages
- [ ] Visit `/tools`
- [ ] Test a few tool pages
- [ ] Verify enhanced pages work

### 4. Dashboard
- [ ] Access dashboard after login
- [ ] Check home icon works
- [ ] Verify navigation

### 5. Database
- [ ] Check if database migrations ran
- [ ] Verify data is accessible
- [ ] Test creating a strategy

---

## Troubleshooting

### Build Fails

**Check build logs:**
```bash
npx vercel logs <deployment-url>
```

**Common issues:**
- Missing environment variables
- Database connection issues
- TypeScript errors
- Prisma schema issues

### Database Issues

**If database push fails:**
1. Check `DATABASE_URL` is correct
2. Verify Neon database is accessible
3. Check Prisma schema is valid

**Manual database push:**
```bash
# Connect to production database and push schema
DATABASE_URL="your-production-db-url" npx prisma db push
```

### Environment Variable Issues

**Add missing variables:**
```bash
# Add environment variable
npx vercel env add VARIABLE_NAME production

# Or add via Vercel Dashboard:
# https://vercel.com/rythmscape11/mediaplanpro/settings/environment-variables
```

### OAuth Redirect Issues

**Update Google OAuth settings:**
1. Go to Google Cloud Console
2. Add authorized redirect URI:
   - `https://mediaplanpro.vercel.app/api/auth/callback/google`
3. Update `NEXTAUTH_URL` in Vercel:
   ```bash
   npx vercel env add NEXTAUTH_URL production
   # Enter: https://mediaplanpro.vercel.app
   ```

---

## Rollback Procedure

### If deployment has issues:

```bash
# List recent deployments
npx vercel ls

# Rollback to previous deployment
npx vercel rollback <previous-deployment-url>
```

Or via Vercel Dashboard:
1. Go to Deployments tab
2. Find previous working deployment
3. Click "Promote to Production"

---

## Custom Domain Setup (Optional)

### Add Custom Domain:

```bash
# Add domain via CLI
npx vercel domains add yourdomain.com

# Or via Vercel Dashboard:
# Settings > Domains > Add Domain
```

### Update Environment Variables:

```bash
# Update NEXTAUTH_URL to custom domain
npx vercel env add NEXTAUTH_URL production
# Enter: https://yourdomain.com
```

### Update Google OAuth:

1. Add new authorized redirect URI:
   - `https://yourdomain.com/api/auth/callback/google`

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel will automatically:
# 1. Detect the push
# 2. Build the project
# 3. Deploy to production
```

**Disable auto-deploy:**
- Go to Vercel Dashboard > Settings > Git
- Disable "Production Branch" auto-deploy

---

## Monitoring

### Check Deployment Status:

```bash
# List all deployments
npx vercel ls

# Get deployment details
npx vercel inspect <deployment-url>

# View logs
npx vercel logs <deployment-url>
```

### Vercel Dashboard:
- https://vercel.com/rythmscape11/mediaplanpro
- View analytics, logs, and deployment history

---

## Quick Reference Commands

```bash
# Deploy to production
npx vercel --prod

# Deploy to preview
npx vercel

# List deployments
npx vercel ls

# View logs
npx vercel logs

# Check environment variables
npx vercel env ls

# Add environment variable
npx vercel env add VARIABLE_NAME production

# Remove deployment
npx vercel rm <deployment-url>

# Check who you're logged in as
npx vercel whoami

# Link project to Vercel
npx vercel link
```

---

## Expected Deployment Time

- **Build Time**: 2-5 minutes
- **Database Migration**: 10-30 seconds
- **Total Deployment**: 3-6 minutes

---

## Success Criteria

✅ Deployment successful when:
- Build completes without errors
- Production URL is accessible
- Homepage loads correctly
- Authentication works
- Tool pages function properly
- Database is connected
- No console errors

---

## Next Steps After Deployment

1. **Test thoroughly** - Use the verification checklist above
2. **Monitor errors** - Check Vercel logs for any runtime errors
3. **Update DNS** - If using custom domain
4. **Submit sitemap** - To Google Search Console
5. **Enable analytics** - Verify GA4 and GTM are working
6. **Test payments** - If Stripe is configured
7. **User testing** - Have real users test the application

---

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma on Vercel**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- **Vercel Support**: https://vercel.com/support

---

**Status**: Ready to Deploy  
**Last Updated**: January 2025

