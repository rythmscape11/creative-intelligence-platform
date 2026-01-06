# MediaPlanPro - Hostinger Cloud Startup Deployment Guide

This guide provides step-by-step instructions for deploying MediaPlanPro to Hostinger's Cloud Startup platform.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Hostinger Deployment Steps](#hostinger-deployment-steps)
6. [Post-Deployment Tasks](#post-deployment-tasks)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

---

## Prerequisites

### Required Accounts & Services

- ✅ **Hostinger Cloud Startup** account
- ✅ **PostgreSQL or MySQL** database (provided by Hostinger)
- ✅ **OpenAI API** key (for AI strategy generation)
- ✅ **AWS S3** account (for file storage and exports)
- ⚠️ **Google OAuth** credentials (optional, for Google Sign-In)
- ⚠️ **Unsplash API** key (optional, for blog images)

### Local Requirements

- Node.js 18+ installed
- Git installed
- Access to your repository

---

## Pre-Deployment Checklist

### 1. Verify Local Build

```bash
# Install dependencies
npm install

# Run production build
npm run build

# Check for errors
# ✅ Build should complete without errors
# ✅ No TypeScript errors
# ✅ No missing dependencies
```

### 2. Database Migration Preparation

```bash
# Generate Prisma client
npx prisma generate

# Check migrations
npx prisma migrate status

# Create migration if needed
npx prisma migrate dev --name production-ready
```

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in production values:

```bash
cp .env.example .env
```

**Critical Variables** (must be set):
- `DATABASE_URL` - PostgreSQL/MySQL connection string
- `NEXTAUTH_URL` - Your production domain (e.g., https://mediaplanpro.com)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `OPENAI_API_KEY` - Your OpenAI API key
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET` - Your S3 bucket name

---

## Database Setup

### Option 1: PostgreSQL (Recommended)

Hostinger provides PostgreSQL databases. Follow these steps:

1. **Create Database in Hostinger Panel**:
   - Log in to Hostinger control panel
   - Navigate to "Databases" → "PostgreSQL"
   - Create new database: `mediaplanpro_prod`
   - Note the connection details

2. **Update DATABASE_URL**:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/mediaplanpro_prod"
   ```

3. **Update Prisma Schema** (if using PostgreSQL):
   
   Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

4. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

### Option 2: MySQL

If using MySQL instead:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `DATABASE_URL`:
   ```env
   DATABASE_URL="mysql://username:password@host:port/mediaplanpro_prod"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Seed Database (Optional)

If you want to populate with demo data:

```bash
# Seed users and initial data
npx prisma db seed

# Populate blog posts (2,000 posts)
npm run seed:blog

# Update blog images with Unsplash
UNSPLASH_ACCESS_KEY=your_key npx tsx scripts/update-blog-media.ts
```

---

## Environment Configuration

### Generate Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

### Complete .env File

Create `.env` in your project root with these values:

```env
# Database (from Hostinger)
DATABASE_URL="postgresql://user:pass@host:5432/mediaplanpro_prod"

# NextAuth.js
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="[generated-secret-from-openssl]"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# JWT
JWT_SECRET="[generated-secret-from-openssl]"

# OpenAI (Required)
OPENAI_API_KEY="sk-your-openai-api-key"

# AWS S3 (Required)
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="mediaplanpro-files"

# Unsplash (Optional)
UNSPLASH_ACCESS_KEY="your-unsplash-access-key"

# Environment
NODE_ENV="production"
```

---

## Hostinger Deployment Steps

### Method 1: Git Deployment (Recommended)

1. **Push Code to Git Repository**:
   ```bash
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Connect Repository in Hostinger**:
   - Log in to Hostinger control panel
   - Navigate to "Cloud" → "Your Instance"
   - Go to "Git" section
   - Connect your GitHub/GitLab repository
   - Select branch: `main`

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Start command: `npm start`
   - Node version: `18.x` or higher

4. **Set Environment Variables**:
   - In Hostinger panel, go to "Environment Variables"
   - Add all variables from your `.env` file
   - **Important**: Do NOT commit `.env` to Git

5. **Deploy**:
   - Click "Deploy" button
   - Wait for build to complete
   - Check deployment logs for errors

### Method 2: Manual Upload (Alternative)

1. **Build Locally**:
   ```bash
   npm run build
   ```

2. **Upload Files via FTP/SFTP**:
   - Upload entire project folder
   - Exclude: `node_modules`, `.git`, `.env.local`

3. **SSH into Server**:
   ```bash
   ssh your-username@your-server-ip
   ```

4. **Install Dependencies**:
   ```bash
   cd /path/to/your/app
   npm install --production
   ```

5. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

6. **Start Application**:
   ```bash
   npm start
   ```

---

## Post-Deployment Tasks

### 1. Verify Application

Visit your domain and check:
- ✅ Homepage loads correctly
- ✅ Login works (test with demo credentials)
- ✅ Dashboard accessible after login
- ✅ Blog posts display with images
- ✅ Strategy builder loads
- ✅ No console errors

### 2. Test Authentication Flow

1. Visit a protected route (e.g., `/dashboard/strategies/create`)
2. Should redirect to `/auth/signin`
3. Log in with credentials
4. Should redirect back to originally requested page

### 3. Test Core Features

- ✅ Create new strategy
- ✅ Generate AI strategy
- ✅ Export to PPTX/DOCX/XLSX
- ✅ Upload files
- ✅ Browse blog posts
- ✅ Search functionality

### 4. Configure Custom Domain (Optional)

1. In Hostinger panel, go to "Domains"
2. Add your custom domain
3. Update DNS records:
   - A record: Point to server IP
   - CNAME: www → your-domain.com
4. Update `NEXTAUTH_URL` in environment variables
5. Redeploy application

### 5. Enable SSL Certificate

1. In Hostinger panel, go to "SSL"
2. Enable "Let's Encrypt" SSL
3. Force HTTPS redirect
4. Verify SSL is working: https://yourdomain.com

---

## Troubleshooting

### Build Fails

**Error**: `Module not found` or `Cannot find module`

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Errors

**Error**: `Can't reach database server`

**Solution**:
- Verify `DATABASE_URL` is correct
- Check database server is running
- Verify firewall allows connections
- Test connection:
  ```bash
  npx prisma db pull
  ```

### Authentication Not Working

**Error**: Users can't log in or session not persisting

**Solution**:
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies
- Check `/api/auth/session` returns valid data

### Images Not Loading

**Error**: Blog images return 404

**Solution**:
- Verify Unsplash API key is set
- Check `next.config.js` has correct image domains
- Run image update script:
  ```bash
  UNSPLASH_ACCESS_KEY=your_key npx tsx scripts/update-blog-media.ts --force
  ```

### S3 Upload Fails

**Error**: File uploads fail

**Solution**:
- Verify AWS credentials are correct
- Check S3 bucket exists and is accessible
- Verify bucket permissions allow uploads
- Check CORS configuration on S3 bucket

---

## Maintenance

### Update Blog Images

```bash
# Refresh all blog images with new Unsplash photos
UNSPLASH_ACCESS_KEY=your_key npx tsx scripts/update-blog-media.ts --force
```

### Database Backups

```bash
# Backup database (PostgreSQL)
pg_dump -h host -U username -d mediaplanpro_prod > backup.sql

# Restore database
psql -h host -U username -d mediaplanpro_prod < backup.sql
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart application
pm2 restart mediaplanpro
```

### Monitor Logs

```bash
# View application logs
pm2 logs mediaplanpro

# View error logs
pm2 logs mediaplanpro --err

# View Hostinger logs
# Check Hostinger control panel → Logs
```

---

## Production Checklist

Before going live, verify:

- [ ] All environment variables set correctly
- [ ] Database migrations completed
- [ ] SSL certificate enabled
- [ ] Custom domain configured
- [ ] Authentication flow working
- [ ] All core features tested
- [ ] Error tracking enabled (Sentry)
- [ ] Analytics configured
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] Documentation updated

---

## Support & Resources

- **Hostinger Support**: https://www.hostinger.com/support
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
- **Project Documentation**: See `/docs` folder

---

**🎉 Congratulations! Your MediaPlanPro application is now deployed!**

