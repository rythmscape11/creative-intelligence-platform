# MediaPlanPro - Production Deployment Guide

**Last Updated**: 2025-10-10  
**Status**: ✅ Ready for Production Deployment

---

## 📋 Pre-Deployment Checklist

### ✅ Completed
- [x] Build passing without errors
- [x] TypeScript compilation successful
- [x] Rate limiting implemented
- [x] Password reset flow complete
- [x] CSRF protection implemented
- [x] Email service integrated
- [x] Security logging enabled
- [x] Console logs replaced with logger

### ⏳ Required Before Deployment
- [ ] Database migration executed
- [ ] Environment variables configured
- [ ] Email service API key obtained
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Database backup configured

---

## 🗄️ Database Migration

### Step 1: Run Prisma Migration

The password reset feature requires new database fields. Run this migration:

```bash
# Development
npx prisma migrate dev --name add_password_reset_and_csrf

# Production
npx prisma migrate deploy
```

### Step 2: Verify Migration

```bash
npx prisma studio
```

Check that the `User` model now has:
- `resetToken` (String, optional)
- `resetTokenExpiry` (DateTime, optional)

---

## 🔐 Environment Variables

### Required Variables

Create a `.env.production` file with the following:

```env
# Database (PostgreSQL for Hostinger)
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-a-secure-random-string-here"
NEXTAUTH_URL="https://yourdomain.com"

# App Configuration
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# Email Service (Choose ONE)
# Option 1: Resend (Recommended)
RESEND_API_KEY="re_xxxxxxxxxxxx"

# Option 2: SendGrid
# SENDGRID_API_KEY="SG.xxxxxxxxxxxx"

# OAuth (Optional - if using Google login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# CSRF Protection
CSRF_SECRET="generate-another-secure-random-string"

# Sentry (Optional - for error tracking)
SENTRY_DSN="https://xxxx@sentry.io/xxxx"
```

### Generate Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate CSRF_SECRET
openssl rand -base64 32
```

---

## 📧 Email Service Setup

### Option 1: Resend (Recommended)

1. Sign up at https://resend.com
2. Verify your domain
3. Get API key from dashboard
4. Add to `.env.production`:
   ```env
   RESEND_API_KEY="re_xxxxxxxxxxxx"
   ```

**Pricing**: Free tier includes 3,000 emails/month

### Option 2: SendGrid

1. Sign up at https://sendgrid.com
2. Verify your domain
3. Create API key with "Mail Send" permissions
4. Add to `.env.production`:
   ```env
   SENDGRID_API_KEY="SG.xxxxxxxxxxxx"
   ```

**Pricing**: Free tier includes 100 emails/day

### Email Templates

The system includes a pre-built password reset email template. To customize:

Edit `src/lib/services/email-service.ts` → `sendPasswordResetEmail()` method

---

## 🚀 Deployment Steps

### For Hostinger Cloud Startup

#### 1. Prepare Database

```bash
# Connect to PostgreSQL
psql -h your-host -U your-user -d your-database

# Verify connection
\dt

# Exit
\q
```

#### 2. Build Application

```bash
# Install dependencies
npm install --production=false

# Generate Prisma Client
npx prisma generate

# Run database migration
npx prisma migrate deploy

# Build Next.js app
npm run build
```

#### 3. Start Production Server

```bash
# Start server
npm start

# Or with PM2 (recommended)
pm2 start npm --name "mediaplanpro" -- start
pm2 save
pm2 startup
```

#### 4. Configure Nginx (if applicable)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🧪 Post-Deployment Testing

### 1. Authentication Flow

- [ ] Sign up new user
- [ ] Sign in with credentials
- [ ] Sign in with Google (if enabled)
- [ ] Sign out

### 2. Password Reset Flow

- [ ] Request password reset
- [ ] Receive email
- [ ] Click reset link
- [ ] Set new password
- [ ] Sign in with new password

### 3. Rate Limiting

- [ ] Try 6 failed logins (should be blocked)
- [ ] Try 4 registrations in 1 hour (should be blocked)
- [ ] Try 4 password resets in 1 hour (should be blocked)

### 4. CSRF Protection

- [ ] Create strategy (should require CSRF token)
- [ ] Update user role (admin, should require CSRF token)
- [ ] Create blog post (admin, should require CSRF token)

### 5. Role-Based Access

- [ ] USER role → redirects to /strategy
- [ ] ADMIN role → redirects to /dashboard
- [ ] EDITOR role → redirects to /dashboard

---

## 📊 Monitoring

### Application Logs

```bash
# View logs with PM2
pm2 logs mediaplanpro

# View last 100 lines
pm2 logs mediaplanpro --lines 100

# Follow logs in real-time
pm2 logs mediaplanpro --lines 0
```

### Database Monitoring

```bash
# Check database size
SELECT pg_size_pretty(pg_database_size('your_database'));

# Check active connections
SELECT count(*) FROM pg_stat_activity;

# Check slow queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

### Email Delivery

Check email service dashboard:
- **Resend**: https://resend.com/emails
- **SendGrid**: https://app.sendgrid.com/email_activity

---

## 🔒 Security Hardening

### 1. Enable HTTPS

Ensure SSL certificate is installed and all traffic redirects to HTTPS.

### 2. Set Security Headers

Add to `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
      ],
    },
  ];
},
```

### 3. Database Security

- Use strong passwords
- Enable SSL connections
- Restrict IP access
- Regular backups

### 4. Rate Limiting

Already implemented for:
- Login (5 attempts / 15 min)
- Registration (3 attempts / hour)
- Password reset (3 attempts / hour)
- Strategy creation (10 / hour)

---

## 🔄 Backup Strategy

### Database Backups

```bash
# Manual backup
pg_dump -h your-host -U your-user -d your-database > backup-$(date +%Y%m%d).sql

# Automated daily backup (cron)
0 2 * * * pg_dump -h your-host -U your-user -d your-database > /backups/db-$(date +\%Y\%m\%d).sql
```

### File Backups

```bash
# Backup uploaded files
tar -czf files-backup-$(date +%Y%m%d).tar.gz public/uploads

# Backup environment
cp .env.production .env.production.backup
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Reset Prisma client
rm -rf node_modules/.prisma
npx prisma generate
```

### Email Not Sending

1. Check API key is correct
2. Verify domain is verified with email provider
3. Check logs: `pm2 logs mediaplanpro | grep -i email`
4. Test in development mode (emails log to console)

### Rate Limiting Too Strict

Adjust limits in `src/lib/rate-limiters.ts`:

```typescript
export const loginRateLimiter = new RateLimiter({
  maxAttempts: 10,  // Increase from 5
  windowMs: 15 * 60 * 1000,
});
```

---

## 📞 Support

### Documentation
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- NextAuth: https://next-auth.js.org

### Email Service Support
- Resend: https://resend.com/docs
- SendGrid: https://docs.sendgrid.com

---

## ✅ Production Readiness Checklist

- [ ] Database migrated
- [ ] Environment variables set
- [ ] Email service configured and tested
- [ ] Build successful
- [ ] Application running
- [ ] HTTPS enabled
- [ ] All authentication flows tested
- [ ] Password reset tested
- [ ] Rate limiting tested
- [ ] CSRF protection tested
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Error tracking configured (Sentry)

---

**Deployment Date**: _____________  
**Deployed By**: _____________  
**Version**: 1.0.0

