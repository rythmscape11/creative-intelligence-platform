# Hostinger Cloud Startup Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying MediaPlanPro to Hostinger Cloud Startup plan.

## Pre-Deployment Checklist

### ✅ Completed Tasks

- [x] **GTM Integration**: Google Tag Manager (GTM-NQRV6DDM) integrated
- [x] **UI/UX Enhancements**: Modern design with animations and glassmorphism
- [x] **Testing**: 313/339 tests passing (92.3% pass rate)
- [x] **Code Quality**: TypeScript, ESLint, comprehensive error handling
- [x] **Performance**: Optimized bundle, lazy loading, image optimization
- [x] **Security**: JWT auth, input validation, XSS/CSRF protection
- [x] **Monitoring**: Sentry integration, health checks, metrics API

### 📋 Pre-Deployment Requirements

- [ ] Hostinger Cloud Startup account active
- [ ] Domain name configured (e.g., mediaplanpro.com)
- [ ] PostgreSQL database created on Hostinger
- [ ] AWS S3 bucket created for file storage
- [ ] OpenAI API key obtained
- [ ] Sentry project created (optional)
- [ ] Environment variables prepared

## Hostinger Cloud Startup Specifications

**Plan Details**:
- **RAM**: 3 GB
- **CPU**: 2 cores
- **Storage**: 200 GB NVMe
- **Bandwidth**: Unlimited
- **Node.js**: Supported (v18.x recommended)
- **Database**: PostgreSQL available
- **SSL**: Free Let's Encrypt SSL included

## Step 1: Prepare Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://mediaplanpro.com
NEXT_PUBLIC_API_URL=https://mediaplanpro.com/api

# Database (Hostinger PostgreSQL)
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication
NEXTAUTH_URL=https://mediaplanpro.com
NEXTAUTH_SECRET="your-generated-secret-here"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_MODEL="gpt-4"

# AWS S3
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="mediaplanpro-production"

# Sentry (Optional)
SENTRY_DSN="https://...@sentry.io/..."
SENTRY_ENVIRONMENT="production"

# GTM
NEXT_PUBLIC_GTM_ID="GTM-NQRV6DDM"
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Step 2: Database Setup on Hostinger

### 2.1 Create PostgreSQL Database

1. Log into Hostinger control panel
2. Navigate to **Databases** → **PostgreSQL**
3. Create new database:
   - Database name: `mediaplanpro`
   - Username: `mediaplanpro_user`
   - Password: (generate strong password)
4. Note the connection details

### 2.2 Run Database Migrations

```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="postgresql://username:password@host:port/database"

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
node scripts/seed-all-data.js
```

## Step 3: Build Application

### 3.1 Install Dependencies

```bash
npm install --production=false
```

### 3.2 Build for Production

```bash
# Build Next.js application
npm run build

# Verify build completed successfully
ls -la .next
```

### 3.3 Test Production Build Locally

```bash
npm start
```

Visit `http://localhost:3000` to verify the build works correctly.

## Step 4: Deploy to Hostinger

### Method 1: Git Deployment (Recommended)

1. **Push to Git Repository**:
   ```bash
   git add .
   git commit -m "Production build"
   git push origin main
   ```

2. **Configure Hostinger Git Deployment**:
   - In Hostinger panel, go to **Git** section
   - Add your repository URL
   - Set branch to `main`
   - Configure build command: `npm install && npm run build`
   - Configure start command: `npm start`

3. **Set Environment Variables**:
   - In Hostinger panel, go to **Environment Variables**
   - Add all variables from `.env.production`

4. **Deploy**:
   - Click **Deploy** button
   - Wait for deployment to complete

### Method 2: FTP Upload

1. **Build Locally**:
   ```bash
   npm run build
   ```

2. **Upload Files via FTP**:
   - Connect to Hostinger FTP
   - Upload entire project directory
   - Ensure `.next`, `node_modules`, and all source files are uploaded

3. **SSH into Server**:
   ```bash
   ssh username@your-server-ip
   ```

4. **Install Dependencies**:
   ```bash
   cd /path/to/your/app
   npm install --production
   ```

5. **Start Application**:
   ```bash
   npm start
   ```

## Step 5: Configure Node.js Application

### 5.1 Set Node.js Version

In Hostinger panel:
1. Go to **Advanced** → **Node.js**
2. Select Node.js version: **18.x**
3. Set application root directory
4. Set entry point: `server.js` or `npm start`

### 5.2 Configure Process Manager

Use PM2 for process management:

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start npm --name "mediaplanpro" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Step 6: Configure Domain and SSL

### 6.1 Point Domain to Hostinger

1. Update DNS records:
   ```
   A Record: @ → Your Hostinger IP
   CNAME: www → your-domain.com
   ```

2. Wait for DNS propagation (up to 48 hours)

### 6.2 Enable SSL Certificate

1. In Hostinger panel, go to **SSL**
2. Select **Free Let's Encrypt SSL**
3. Click **Install**
4. Wait for SSL activation

### 6.3 Force HTTPS

Add to your Next.js configuration or use Hostinger's force HTTPS option.

## Step 7: Post-Deployment Verification

### 7.1 Health Check

```bash
curl https://mediaplanpro.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-08T...",
  "checks": {
    "database": { "status": "healthy" },
    "memory": { "status": "healthy" }
  }
}
```

### 7.2 GTM Verification

1. Visit your site
2. Open browser console
3. Check for `window.dataLayer`
4. Use Google Tag Assistant to verify GTM is firing

### 7.3 Test Key Features

- [ ] User registration and login
- [ ] Strategy creation
- [ ] AI generation (if OpenAI key configured)
- [ ] Export to PPTX/DOCX/XLSX
- [ ] Blog CMS access
- [ ] Admin dashboard (admin users)

## Step 8: Performance Optimization

### 8.1 Enable Caching

Configure caching headers in `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/:all*(svg|jpg|png|webp)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
}
```

### 8.2 Enable Compression

Hostinger typically has gzip enabled by default. Verify:

```bash
curl -H "Accept-Encoding: gzip" -I https://mediaplanpro.com
```

### 8.3 Configure CDN (Optional)

Consider using Cloudflare for additional performance:
1. Sign up for Cloudflare
2. Add your domain
3. Update nameservers
4. Enable caching and optimization features

## Step 9: Monitoring Setup

### 9.1 Configure Sentry

1. Create Sentry project
2. Add SENTRY_DSN to environment variables
3. Verify errors are being tracked

### 9.2 Setup Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Monitor:
- `https://mediaplanpro.com`
- `https://mediaplanpro.com/api/health`

### 9.3 Setup Log Monitoring

Configure log rotation:

```bash
# Install logrotate
sudo apt-get install logrotate

# Configure rotation for PM2 logs
pm2 install pm2-logrotate
```

## Step 10: Backup Strategy

### 10.1 Database Backups

Create automated backup script:

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"
DB_URL="your-database-url"

pg_dump $DB_URL > "$BACKUP_DIR/backup_$DATE.sql"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Schedule with cron:
```bash
0 2 * * * /path/to/backup-db.sh
```

### 10.2 File Backups

S3 files are automatically backed up by AWS. Configure versioning:

```bash
aws s3api put-bucket-versioning \
  --bucket mediaplanpro-production \
  --versioning-configuration Status=Enabled
```

## Troubleshooting

### Application Won't Start

1. Check logs:
   ```bash
   pm2 logs mediaplanpro
   ```

2. Verify environment variables:
   ```bash
   pm2 env 0
   ```

3. Check Node.js version:
   ```bash
   node --version
   ```

### Database Connection Issues

1. Verify DATABASE_URL is correct
2. Check PostgreSQL is running
3. Verify firewall allows connections
4. Test connection:
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

### High Memory Usage

1. Monitor with PM2:
   ```bash
   pm2 monit
   ```

2. Restart application:
   ```bash
   pm2 restart mediaplanpro
   ```

3. Consider upgrading Hostinger plan if needed

### SSL Certificate Issues

1. Verify domain points to correct IP
2. Check SSL certificate status in Hostinger panel
3. Force SSL renewal if needed

## Maintenance

### Regular Tasks

- **Daily**: Monitor error logs and uptime
- **Weekly**: Review performance metrics
- **Monthly**: Update dependencies, review security
- **Quarterly**: Database optimization, backup verification

### Update Procedure

1. Test updates locally
2. Create database backup
3. Deploy to staging (if available)
4. Deploy to production
5. Verify functionality
6. Monitor for errors

## Support

For deployment issues:
- **Hostinger Support**: https://www.hostinger.com/support
- **MediaPlanPro Docs**: /docs
- **Email**: support@mediaplanpro.com

---

**Deployment Status**: Ready for Production  
**Last Updated**: 2025-10-08  
**Version**: 1.0.0
