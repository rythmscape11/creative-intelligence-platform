# Error Handling Playbook

## Overview
This guide covers common errors and how to debug/resolve them.

---

## Payment Errors

### "Payment system not configured"
**Cause:** Missing Razorpay credentials
**Fix:**
```bash
# Set in .env.local
RAZORPAY_KEY_ID=rzp_xxx
RAZORPAY_KEY_SECRET=xxx
```

### "Invalid signature" on webhook
**Cause:** Webhook secret mismatch
**Fix:**
1. Get secret from Razorpay Dashboard → Webhooks
2. Update: `RAZORPAY_WEBHOOK_SECRET=xxx`

### Subscription creation fails
**Debugging:**
```typescript
// Check Razorpay logs
console.log('Razorpay error:', error.error?.description);
```
**Common causes:**
- Invalid plan ID (not created in Razorpay dashboard)
- Customer creation failed
- Insufficient balance

---

## Authentication Errors

### "Unauthorized" (401)
**Cause:** User not logged in or session expired
**Fix:** Redirect to `/auth/signin`

### "Forbidden" (403)
**Cause:** User lacks required role/subscription
**Debugging:**
```typescript
const user = await prisma.user.findFirst({
  where: { clerkId: userId },
});
console.log('User role:', user.role);
console.log('Subscriptions:', await prisma.productSubscription.findMany({
  where: { userId: user.id }
}));
```

### Clerk session issues
**Fix:**
1. Clear cookies
2. Check Clerk dashboard for user status
3. Verify CLERK_SECRET_KEY is correct

---

## Database Errors

### "PrismaClientKnownRequestError"
**Common codes:**
- `P2002` - Unique constraint violation
- `P2025` - Record not found
- `P2003` - Foreign key constraint

**Example handling:**
```typescript
try {
  await prisma.user.create({ ... });
} catch (error) {
  if (error.code === 'P2002') {
    return { error: 'Email already exists' };
  }
  throw error;
}
```

### Connection errors
**Fix:**
```bash
# Test connection
npx prisma db pull

# Reset connection pool
npx prisma generate
```

---

## Build Errors

### "Module not found"
**Fix:**
```bash
rm -rf node_modules .next
npm install
npm run build
```

### TypeScript errors
**Common fixes:**
1. Run `npx prisma generate` after schema changes
2. Check import paths (use `@/` alias)
3. Add missing type annotations

### Prisma type mismatches
**After schema changes:**
```bash
npx prisma generate
```

---

## Runtime Errors

### "Cannot read properties of undefined"
**Always check for null:**
```typescript
// Bad
const name = user.name;

// Good
const name = user?.name || 'Unknown';
```

### API timeout
**Causes:**
- Database query too slow
- External API delay

**Fix:**
```typescript
// Add timeout handling
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000);

try {
  const response = await fetch(url, { signal: controller.signal });
} finally {
  clearTimeout(timeout);
}
```

---

## Debugging Tips

### Enable verbose logging
```typescript
console.log('[Module] Action:', { data });
```

### Check environment
```typescript
console.log('Environment:', {
  hasRazorpay: !!process.env.RAZORPAY_KEY_ID,
  hasClerk: !!process.env.CLERK_SECRET_KEY,
  dbUrl: process.env.DATABASE_URL?.substring(0, 30) + '...',
});
```

### Test in isolation
```bash
# Test single API
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

---

## Monitoring

### Key metrics to watch
1. API response times
2. Payment failure rates
3. Auth error rates
4. Database query times

### Log analysis
```bash
# Search Vercel logs
vercel logs --filter "error"
```
