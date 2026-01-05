# Quick Deployment Checklist

## 1. Add Clerk Keys to Local Environment

Add these to `.env.local`:

```bash
# Clerk Keys (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... or pk_live_...
CLERK_SECRET_KEY=sk_test_... or sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
```

## 2. Add Clerk Keys to Vercel Production

Run these commands:

```bash
npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
# Paste your publishable key when prompted

npx vercel env add CLERK_SECRET_KEY production
# Paste your secret key when prompted

npx vercel env add CLERK_WEBHOOK_SECRET production
# Paste your webhook secret when prompted
```

## 3. Deploy to Production

```bash
npx vercel --prod
```

## 4. Run Database Migration

After deployment:

```bash
npx prisma migrate deploy
```

## 5. Test

- Visit your production URL
- Try signing up/signing in
- Check webhook logs in Clerk Dashboard
