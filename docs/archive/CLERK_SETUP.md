# Clerk Environment Variables Setup Script

## Required Clerk Variables

You'll need to get these from your Clerk Dashboard (https://dashboard.clerk.com):

### 1. Publishable Key
- Go to Clerk Dashboard → API Keys
- Copy the **Publishable Key** (starts with `pk_live_` or `pk_test_`)

### 2. Secret Key  
- In the same API Keys section
- Copy the **Secret Key** (starts with `sk_live_` or `sk_test_`)

### 3. Webhook Secret
- Go to Webhooks → Add Endpoint
- Endpoint URL: `https://your-domain.vercel.app/api/webhooks/clerk`
- Subscribe to: `user.created`, `user.updated`, `user.deleted`
- Copy the **Signing Secret** (starts with `whsec_`)

## Add to Vercel

Run these commands (replace with your actual values):

```bash
# Navigate to project directory
cd /Users/anustupmukherjee/Documents/augment-projects/Project\ 1

# Add Clerk Publishable Key
npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production

# Add Clerk Secret Key
npx vercel env add CLERK_SECRET_KEY production

# Add Clerk Webhook Secret
npx vercel env add CLERK_WEBHOOK_SECRET production
```

When prompted, paste the corresponding value from Clerk Dashboard.

## Verify Environment Variables

```bash
# List all environment variables
npx vercel env ls
```

## Deploy

After adding environment variables:

```bash
# Deploy to production
npx vercel --prod
```

## Database Migration

After deployment, run the migration:

```bash
# Connect to production database and run migration
npx prisma migrate deploy
```
