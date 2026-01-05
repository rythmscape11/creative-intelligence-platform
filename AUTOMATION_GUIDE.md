# 🤖 AUTOMATION GUIDE - MediaPlanPro

## Overview

This guide explains the automated testing and deployment setup for MediaPlanPro.

---

## 🔄 CI/CD Workflows

### 1. **Main CI/CD Pipeline** (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`

**Jobs:**
1. **Test** - Runs all tests with PostgreSQL and Redis
   - Type checking
   - Linting
   - Unit tests with coverage
   - E2E tests
   - Build verification

2. **Security** - Security scanning
   - npm audit
   - Snyk security scan (requires `SNYK_TOKEN` secret)

3. **Deploy Staging** - Auto-deploy to staging (on `develop` branch)
4. **Deploy Production** - Auto-deploy to production (on `main` branch)

**Required Secrets:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth.js secret
- `NEXTAUTH_URL` - Application URL
- `SNYK_TOKEN` - Snyk API token (optional)
- `STAGING_NEXTAUTH_URL` - Staging environment URL
- `PRODUCTION_NEXTAUTH_URL` - Production environment URL

---

### 2. **PR Quality Checks** (`.github/workflows/pr-check.yml`)

**Triggers:**
- Pull requests to `main`

**Jobs:**
1. **Quick Checks** (parallel)
   - TypeScript type checking
   - ESLint linting

2. **Build Check**
   - Prisma client generation
   - Next.js build
   - Build size reporting

3. **PR Summary**
   - Generates summary of all checks
   - Shows pass/fail status

**Benefits:**
- Fast feedback on PRs
- Prevents broken code from being merged
- No secrets required (uses placeholders)

---

### 3. **Vercel Deployment** (`.github/workflows/deploy-vercel.yml`)

**Triggers:**
- Push to `main` branch

**What it does:**
- Automatically deploys to Vercel
- Runs on every push to main

**Note:** Vercel also has its own automatic deployment from GitHub integration.

---

### 4. **Hostinger Deployment** (`.github/workflows/deploy-hostinger.yml`)

**Triggers:**
- Manual workflow dispatch

**What it does:**
- Deploys to Hostinger Cloud Startup
- Requires manual trigger

---

## 🧪 Testing

### Running Tests Locally

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Unit tests
npm test

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── e2e/            # End-to-end tests
```

---

## 🚀 Deployment

### Automatic Deployment

**Vercel (Production):**
1. Push to `main` branch
2. Vercel automatically builds and deploys
3. Check deployment status at: https://vercel.com/dashboard

**Staging:**
1. Push to `develop` branch
2. CI/CD pipeline deploys to staging
3. Check deployment logs in GitHub Actions

### Manual Deployment

**Hostinger:**
1. Go to GitHub Actions
2. Select "Deploy to Hostinger" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

---

## 📊 Build Verification

### What Gets Checked

1. **Type Safety**
   - All TypeScript files must compile without errors
   - No `any` types allowed (strict mode)

2. **Code Quality**
   - ESLint rules must pass
   - No console.log statements in production code
   - Proper error handling

3. **Build Success**
   - Next.js build must complete
   - No build errors or warnings
   - Prisma client generation successful

4. **Security**
   - No high-severity vulnerabilities
   - Dependencies up to date
   - Snyk scan passes (if configured)

---

## 🔧 Configuration

### GitHub Secrets

Add these secrets in GitHub repository settings:

**Required for CI/CD:**
```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://www.mediaplanpro.com
```

**Optional:**
```
SNYK_TOKEN=your-snyk-token
STAGING_NEXTAUTH_URL=https://staging.mediaplanpro.com
PRODUCTION_NEXTAUTH_URL=https://www.mediaplanpro.com
```

**Payment Gateways:**
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

### Environment Variables

See `.env.example` for all required environment variables.

---

## 📈 Monitoring

### Build Status

Check build status at:
- GitHub Actions: https://github.com/rythmscape11/mediaplanpro/actions
- Vercel Dashboard: https://vercel.com/dashboard

### Deployment Status

**Vercel:**
- Dashboard: https://vercel.com/dashboard
- Deployment URL: https://www.mediaplanpro.com

**Staging:**
- Check GitHub Actions logs
- Staging URL: (configure in secrets)

---

## 🐛 Troubleshooting

### Build Fails on CI but Works Locally

**Possible causes:**
1. Missing environment variables
2. Different Node.js version
3. Cached dependencies

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Use same Node version as CI
nvm use 18

# Check for missing env vars
cp .env.example .env
# Fill in all required values
```

### Type Check Fails

**Solution:**
```bash
# Run type check locally
npm run type-check

# Fix all TypeScript errors
# Common issues:
# - Missing type definitions
# - Incorrect prop types
# - Missing null checks
```

### Lint Fails

**Solution:**
```bash
# Run lint locally
npm run lint

# Auto-fix issues
npm run lint -- --fix

# Common issues:
# - Unused variables
# - Missing dependencies in useEffect
# - Console.log statements
```

### Build Fails

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Regenerate Prisma client
npm run db:generate

# Try building again
npm run build
```

---

## 🎯 Best Practices

### Before Pushing Code

1. **Run checks locally:**
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```

2. **Test your changes:**
   ```bash
   npm test
   ```

3. **Check for security issues:**
   ```bash
   npm audit
   ```

### Creating Pull Requests

1. Create feature branch from `main`
2. Make your changes
3. Run all checks locally
4. Push to GitHub
5. Create PR
6. Wait for CI checks to pass
7. Request review
8. Merge after approval

### Deployment Checklist

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Secrets added to Vercel/Hostinger
- [ ] Tested on staging (if available)

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

## 🆘 Getting Help

If you encounter issues:

1. Check GitHub Actions logs
2. Review error messages
3. Check this guide
4. Search for similar issues
5. Ask for help in team chat

---

**Last Updated:** 2025-10-27
**Maintained By:** MediaPlanPro Team

