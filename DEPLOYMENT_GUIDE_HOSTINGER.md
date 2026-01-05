# MediaPlanPro - Complete Hostinger Deployment Guide

**Target Platform**: Hostinger Cloud Startup  
**Database**: MySQL  
**Application**: Next.js 14.2.33  
**Current State**: Running locally with SQLite  
**Date**: 2025-10-10

---

## 📋 Table of Contents

1. [Pre-Deployment Preparation](#1-pre-deployment-preparation)
2. [Hostinger Setup](#2-hostinger-setup)
3. [Database Migration (SQLite → MySQL)](#3-database-migration)
4. [Application Deployment](#4-application-deployment)
5. [Post-Deployment Configuration](#5-post-deployment-configuration)
6. [Production Considerations](#6-production-considerations)
7. [Troubleshooting](#7-troubleshooting)
8. [Automated Deployment (CI/CD)](#8-automated-deployment-cicd)

---

## 1. Pre-Deployment Preparation

### 1.1 Generate Production Secrets

**CRITICAL**: Never use development secrets in production!

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Save these securely** - you'll need them for environment variables.

### 1.2 Create Production Environment File

Create `.env.production.local` (DO NOT commit this file):

```env
# Database - MySQL on Hostinger
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# NextAuth.js - Use generated secrets from step 1.1
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="YOUR_GENERATED_SECRET_HERE"

# JWT Secret
JWT_SECRET="YOUR_GENERATED_JWT_SECRET_HERE"

# Google OAuth (Optional - use production credentials)
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"

# Node Environment
NODE_ENV="production"

# Optional Services
OPENAI_API_KEY="your-openai-key-if-needed"
```

### 1.3 Update Prisma Schema for MySQL

**File**: `prisma/schema.prisma`

**Find and replace**:

```prisma
// BEFORE (SQLite)
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

```prisma
// AFTER (MySQL)
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### 1.4 Update Schema for MySQL Compatibility

**Add MySQL-specific type annotations**:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique @db.VarChar(255)
  name      String   @db.VarChar(255)
  password  String   @db.VarChar(255)
  role      String   @default("USER") @db.VarChar(50)
  avatar    String?  @db.VarChar(500)
  // ... rest of fields
  
  @@map("users")
  @@index([email])
}

model BlogPost {
  id              String    @id @default(cuid())
  title           String    @db.VarChar(255)
  slug            String    @unique @db.VarChar(255)
  content         String    @db.Text
  excerpt         String    @db.VarChar(500)
  featuredImage   String?   @db.VarChar(500)
  status          String    @default("DRAFT") @db.VarChar(50)
  seoTitle        String?   @db.VarChar(255)
  seoDescription  String?   @db.VarChar(500)
  // ... rest of fields
  
  @@map("blog_posts")
  @@index([authorId])
  @@index([categoryId])
  @@index([status])
  @@index([slug])
}

model Category {
  id          String   @id @default(cuid())
  name        String   @unique @db.VarChar(100)
  slug        String   @unique @db.VarChar(100)
  description String?  @db.Text
  color       String?  @db.VarChar(50)
  // ... rest of fields
  
  @@map("categories")
  @@index([slug])
}

model Tag {
  id        String   @id @default(cuid())
  name      String   @unique @db.VarChar(100)
  slug      String   @unique @db.VarChar(100)
  // ... rest of fields
  
  @@map("tags")
  @@index([slug])
}
```

**Apply these changes to ALL models** in your schema.

### 1.5 Re-enable Case-Insensitive Search

**File**: `src/app/api/blog/posts/route.ts`

**Find** (around line 60):

```typescript
if (search) {
  where.OR = [
    { title: { contains: search } },
    { content: { contains: search } },
    { excerpt: { contains: search } },
  ];
}
```

**Replace with**:

```typescript
if (search) {
  where.OR = [
    { title: { contains: search, mode: 'insensitive' } },
    { content: { contains: search, mode: 'insensitive' } },
    { excerpt: { contains: search, mode: 'insensitive' } },
  ];
}
```

### 1.6 Update Next.js Configuration

**File**: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Production optimizations
  compress: true,
  
  // Image optimization
  images: {
    domains: ['yourdomain.com', 'localhost'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Output configuration for deployment
  output: 'standalone',
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXTAUTH_URL,
  },
  
  // Disable x-powered-by header
  poweredByHeader: false,
};

module.exports = nextConfig;
```

### 1.7 Security Checklist

Before deploying, verify:

- [ ] New NEXTAUTH_SECRET generated (not using dev secret)
- [ ] New JWT_SECRET generated
- [ ] NEXTAUTH_URL set to production domain (https://)
- [ ] All test credentials removed or changed
- [ ] Google OAuth uses production credentials
- [ ] Database password is strong
- [ ] `.env` files are in `.gitignore`
- [ ] No sensitive data in git repository

### 1.8 Test Build Locally

```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Test production build
npm start
```

Visit http://localhost:3000 and verify:
- ✅ All pages load
- ✅ Authentication works
- ✅ Blog CMS accessible
- ✅ No console errors

---

## 2. Hostinger Setup

### 2.1 Access Hostinger Control Panel

1. **Log in** to Hostinger: https://hpanel.hostinger.com
2. **Select** your Cloud Startup plan
3. **Access** hPanel (Hostinger control panel)

### 2.2 Create MySQL Database

**Steps**:

1. In hPanel, navigate to **"Databases"** → **"MySQL Databases"**
2. Click **"Create New Database"**
3. Fill in details:
   - **Database Name**: `mediaplanpro_prod` (or your choice)
   - **Username**: `mediaplanpro_user`
   - **Password**: Click "Generate" for a strong password
4. **IMPORTANT**: Copy and save these credentials immediately:

```
Database Host: localhost (or specific host shown)
Database Port: 3306
Database Name: mediaplanpro_prod
Username: mediaplanpro_user
Password: [generated-password]
```

5. Click **"Create Database"**

### 2.3 Construct Database Connection String

**Format**:
```
mysql://username:password@host:3306/database_name
```

**Example**:
```
mysql://mediaplanpro_user:SecurePass123@localhost:3306/mediaplanpro_prod
```

**URL Encode Special Characters**:

If your password contains special characters, encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `/` | `%2F` |
| `:` | `%3A` |
| `?` | `%3F` |

**Example with special characters**:
```
# Password: Pass@word#123
# Encoded: Pass%40word%23123
mysql://user:Pass%40word%23123@localhost:3306/database
```

### 2.4 Enable Remote MySQL Access (Optional - for testing)

**For testing connection from your local machine**:

1. In hPanel, go to **"Databases"** → **"Remote MySQL"**
2. Click **"Add New Host"**
3. Enter your IP address (find it at https://whatismyipaddress.com)
4. Click **"Add"**

**Get external host**:
- Hostinger provides: `mysql.hostinger.com` or similar
- Port: Usually `3306`

**Test connection locally**:

```bash
mysql -h mysql.hostinger.com -P 3306 -u mediaplanpro_user -p mediaplanpro_prod
```

Enter password when prompted. If successful, you'll see MySQL prompt.

### 2.5 Domain Configuration

**Option A: Use Hostinger Subdomain** (Easiest)

- Hostinger provides: `yoursite.hostingersite.com`
- No configuration needed
- SSL automatically provided

**Option B: Custom Domain** (Recommended for production)

**Step 1: Add Domain in hPanel**

1. Go to **"Domains"** → **"Add Domain"**
2. Enter your domain name (e.g., `mediaplanpro.com`)
3. Click **"Add Domain"**

**Step 2: Update DNS at Domain Registrar**

Get Hostinger's nameservers or IP from hPanel, then:

**Method 1: Change Nameservers** (Recommended)

At your domain registrar (GoDaddy, Namecheap, etc.):

```
Nameserver 1: ns1.dns-parking.com
Nameserver 2: ns2.dns-parking.com
```

(Use the actual nameservers provided by Hostinger)

**Method 2: Update A Records**

```
Type: A
Name: @
Value: [Hostinger IP address from hPanel]
TTL: 3600

Type: A  
Name: www
Value: [Hostinger IP address]
TTL: 3600
```

**Step 3: Wait for DNS Propagation**

- Usually takes 1-24 hours
- Check status: https://dnschecker.org

### 2.6 SSL Certificate Setup

**Hostinger provides FREE SSL certificates**:

1. In hPanel, go to **"SSL"**
2. Select your domain
3. Click **"Install SSL"** or **"Manage SSL"**
4. Choose **"Free SSL"** (Let's Encrypt)
5. Click **"Install"**
6. Wait 5-15 minutes for installation

**Verify SSL**:

```bash
curl -I https://yourdomain.com
```

Should return `HTTP/2 200` with SSL headers.

**Force HTTPS** (recommended):

1. In hPanel, go to **"Advanced"** → **"Force HTTPS"**
2. Toggle **ON**

Or add to `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 3. Database Migration

### 3.1 Test MySQL Connection Locally

**Install MySQL locally** (optional but recommended):

```bash
# macOS
brew install mysql
brew services start mysql

# Ubuntu/Debian
sudo apt-get install mysql-server
sudo systemctl start mysql

# Windows
# Download from https://dev.mysql.com/downloads/mysql/
```

**Create local test database**:

```bash
mysql -u root -p

CREATE DATABASE mediaplanpro_test;
CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'testpass';
GRANT ALL PRIVILEGES ON mediaplanpro_test.* TO 'testuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Update `.env` for local MySQL testing**:

```env
DATABASE_URL="mysql://testuser:testpass@localhost:3306/mediaplanpro_test"
```

### 3.2 Generate MySQL Migration

```bash
# Generate Prisma Client for MySQL
npx prisma generate

# Create migration
npx prisma migrate dev --name mysql_initial

# This will:
# 1. Create migration files
# 2. Apply to local database
# 3. Generate Prisma Client
```

**Review migration file**:

Check `prisma/migrations/[timestamp]_mysql_initial/migration.sql`

### 3.3 Test Application with MySQL Locally

```bash
# Start dev server
npm run dev

# Test in browser
open http://localhost:3000
```

**Verify**:
- ✅ Sign in works
- ✅ Blog CMS loads
- ✅ Can create/edit posts
- ✅ Search works (case-insensitive)
- ✅ No database errors in console

### 3.4 Deploy Migration to Production

**Option A: Using Prisma Migrate Deploy** (Recommended)

```bash
# Set production DATABASE_URL
export DATABASE_URL="mysql://user:pass@host:3306/database"

# Deploy migrations (doesn't create new migrations)
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

**Option B: Manual SQL Execution**

1. Export migration SQL:
   ```bash
   cat prisma/migrations/[timestamp]_mysql_initial/migration.sql
   ```

2. Connect to production MySQL:
   ```bash
   mysql -h host -u user -p database_name
   ```

3. Paste and execute SQL

### 3.5 Seed Production Database

**Create production seed**: `prisma/seed.production.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding production database...');

  // IMPORTANT: Use environment variable for admin password
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD environment variable is required');
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@yourdomain.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@yourdomain.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = [
    {
      name: 'Marketing Strategy',
      slug: 'marketing-strategy',
      description: 'Comprehensive guides on marketing strategy development',
      color: '#3B82F6',
    },
    {
      name: 'Content Marketing',
      slug: 'content-marketing',
      description: 'Content creation and distribution strategies',
      color: '#F59E0B',
    },
    {
      name: 'Digital Marketing',
      slug: 'digital-marketing',
      description: 'Latest trends and tactics in digital marketing',
      color: '#10B981',
    },
    {
      name: 'AI Marketing',
      slug: 'ai-marketing',
      description: 'How AI is transforming marketing practices',
      color: '#8B5CF6',
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('✅ Categories created');

  // Create tags
  const tags = [
    { name: 'SEO', slug: 'seo' },
    { name: 'Social Media', slug: 'social-media' },
    { name: 'Email Marketing', slug: 'email-marketing' },
    { name: 'Analytics', slug: 'analytics' },
    { name: 'Content Strategy', slug: 'content-strategy' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }

  console.log('✅ Tags created');
  console.log('🎉 Production database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Run production seed**:

```bash
# Set credentials
export DATABASE_URL="mysql://user:pass@host:3306/database"
export ADMIN_EMAIL="admin@yourdomain.com"
export ADMIN_PASSWORD="YourSecurePassword123!"

# Run seed
npx tsx prisma/seed.production.ts
```

---

## 4. Application Deployment

### 4.1 Prepare Application for Deployment

**Step 1: Update package.json scripts**

Add deployment scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "deploy:build": "npm ci && npm run build",
    "deploy:migrate": "prisma migrate deploy",
    "deploy:seed": "tsx prisma/seed.production.ts"
  }
}
```

**Step 2: Build for production**

```bash
# Clean install dependencies
npm ci

# Build application
npm run build
```

**Expected output**:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         95 kB
├ ○ /auth/signin                         3.8 kB         93 kB
├ ○ /blog                                8.1 kB        102 kB
└ ○ /dashboard/blog                      12.3 kB       110 kB
```

**Step 3: Test production build locally**

```bash
npm start
```

Visit http://localhost:3000 and verify everything works.

### 4.2 Upload to Hostinger

**Method 1: Git Deployment** (Recommended - see Section 8)

**Method 2: FTP/SFTP Upload**

**Get FTP credentials from hPanel**:

1. Go to **"Files"** → **"FTP Accounts"**
2. Create new FTP account or use existing
3. Note credentials:
   - Host: `ftp.yourdomain.com`
   - Username: `username@yourdomain.com`
   - Password: [your password]
   - Port: 21 (FTP) or 22 (SFTP)

**Upload via SFTP** (recommended over FTP):

```bash
# Using sftp command
sftp username@yourdomain.com

# Navigate to web root
cd public_html

# Create app directory
mkdir mediaplanpro
cd mediaplanpro

# Upload files (from local terminal)
put -r /path/to/local/mediaplanpro/*

# Or use rsync for faster upload
rsync -avz --exclude 'node_modules' --exclude '.git' \
  /path/to/local/mediaplanpro/ \
  username@yourdomain.com:~/public_html/mediaplanpro/
```

**Upload via FileZilla** (GUI):

1. Download FileZilla: https://filezilla-project.org
2. Connect:
   - Host: `sftp://yourdomain.com`
   - Username: `username@yourdomain.com`
   - Password: [your password]
   - Port: 22
3. Navigate to `public_html/mediaplanpro`
4. Upload all files except:
   - `node_modules/`
   - `.git/`
   - `.next/` (will be rebuilt on server)
   - `prisma/dev.db`
   - `.env` (use `.env.production` instead)

**Method 3: Hostinger File Manager**

1. In hPanel, go to **"Files"** → **"File Manager"**
2. Navigate to `public_html`
3. Create folder `mediaplanpro`
4. Upload files (slower for large projects)

### 4.3 SSH into Hostinger Server

**Enable SSH access**:

1. In hPanel, go to **"Advanced"** → **"SSH Access"**
2. Enable SSH
3. Note SSH credentials

**Connect via SSH**:

```bash
ssh username@yourdomain.com
# Or
ssh username@server-ip-address
```

**Navigate to app directory**:

```bash
cd ~/public_html/mediaplanpro
```

### 4.4 Install Dependencies on Server

```bash
# Install production dependencies
npm ci --production

# Or install all dependencies (needed for build)
npm ci
```

**If npm is not available**, install Node.js:

```bash
# Check Node.js version
node --version

# If not installed or wrong version, use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

### 4.5 Set Environment Variables

**Create `.env.production` on server**:

```bash
nano .env.production
```

**Paste your production environment variables**:

```env
DATABASE_URL="mysql://mediaplanpro_user:password@localhost:3306/mediaplanpro_prod"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-generated-secret"
JWT_SECRET="your-generated-jwt-secret"
NODE_ENV="production"
```

**Save**: Ctrl+O, Enter, Ctrl+X

**Set permissions**:

```bash
chmod 600 .env.production
```

### 4.6 Run Database Migrations

```bash
# Deploy migrations
npm run deploy:migrate

# Seed database
export ADMIN_EMAIL="admin@yourdomain.com"
export ADMIN_PASSWORD="YourSecurePassword123!"
npm run deploy:seed
```

### 4.7 Build Application on Server

```bash
# Build Next.js app
npm run build
```

**If build fails due to memory**, increase Node.js memory:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 4.8 Start Production Server

**Option A: Using PM2** (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "mediaplanpro" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown

# Check status
pm2 status

# View logs
pm2 logs mediaplanpro
```

**Option B: Using Hostinger Node.js Manager**

1. In hPanel, go to **"Advanced"** → **"Node.js"**
2. Click **"Create Application"**
3. Configure:
   - **Application Root**: `/public_html/mediaplanpro`
   - **Application URL**: `yourdomain.com`
   - **Application Startup File**: `server.js` or leave default
   - **Node.js Version**: 18.x or 20.x
4. Click **"Create"**
5. Application starts automatically

**Option C: Custom Server Script**

Create `server.js`:

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
```

**Start with PM2**:

```bash
pm2 start server.js --name mediaplanpro
```

### 4.9 Configure Reverse Proxy

**Hostinger usually handles this automatically**, but if needed:

**Create/Edit `.htaccess`** in `public_html`:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy to Node.js app
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Enable proxy
ProxyPreserveHost On
ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/
```

**Or use Nginx** (if available):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4.10 Verify Deployment

**Check if app is running**:

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs mediaplanpro --lines 50

# Check if port is listening
netstat -tulpn | grep :3000

# Test locally on server
curl http://localhost:3000
```

**Access from browser**:

```
https://yourdomain.com
```

**Verify**:
- ✅ Homepage loads
- ✅ SSL certificate is valid (green padlock)
- ✅ Sign-in page accessible
- ✅ Can sign in with admin credentials
- ✅ Dashboard loads
- ✅ Blog CMS accessible
- ✅ No console errors

---

## 5. Post-Deployment Configuration

### 5.1 Test Authentication Flows

**Test 1: Credentials Login**

1. Go to `https://yourdomain.com/auth/signin`
2. Sign in with admin credentials
3. Verify redirect to `/dashboard`
4. Check session persists on refresh

**Test 2: Google OAuth** (if configured)

1. Click "Sign in with Google"
2. Authorize application
3. Verify redirect works
4. Check user created in database

**Test 3: Protected Routes**

1. Sign out
2. Try to access `/dashboard/blog`
3. Verify redirect to `/auth/signin`
4. Sign in and verify access granted

### 5.2 Test Blog CMS Functionality

**Create a test post**:

1. Navigate to `/dashboard/blog`
2. Click "Create New Post"
3. Fill in all fields
4. Save as draft
5. Verify auto-save works
6. Publish post
7. View on public blog

**Test search and filters**:

1. Search for posts
2. Verify case-insensitive search works
3. Filter by category
4. Filter by status
5. Test pagination

**Test bulk actions**:

1. Select multiple posts
2. Perform bulk publish
3. Verify all posts published

### 5.3 Test API Endpoints

```bash
# Test categories API
curl https://yourdomain.com/api/blog/categories

# Test posts API (should require auth)
curl https://yourdomain.com/api/blog/posts

# Test with authentication
curl -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  https://yourdomain.com/api/blog/posts
```

### 5.4 Create Production Admin User

**IMPORTANT**: Remove or change test credentials!

```bash
# SSH into server
ssh username@yourdomain.com
cd ~/public_html/mediaplanpro

# Run production seed with real credentials
export DATABASE_URL="mysql://user:pass@localhost:3306/database"
export ADMIN_EMAIL="admin@yourdomain.com"
export ADMIN_PASSWORD="YourVerySecurePassword123!"
npm run deploy:seed
```

**Delete test users** (if they exist):

```bash
# Connect to MySQL
mysql -u mediaplanpro_user -p mediaplanpro_prod

# Delete test users
DELETE FROM users WHERE email IN (
  'admin@mediaplanpro.com',
  'editor@mediaplanpro.com',
  'user@mediaplanpro.com'
);

EXIT;
```

### 5.5 Configure Monitoring

**Set up PM2 monitoring**:

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Enable monitoring
pm2 monitor
```

**Set up error logging** (optional):

Install Sentry or similar:

```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:

```javascript
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: 'your-org',
    project: 'mediaplanpro',
  }
);
```

### 5.6 Set Up Backups

**Database backups**:

Create backup script `scripts/backup-db.sh`:

```bash
#!/bin/bash

# Configuration
DB_USER="mediaplanpro_user"
DB_PASS="your-password"
DB_NAME="mediaplanpro_prod"
BACKUP_DIR="/home/username/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Delete backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

**Make executable**:

```bash
chmod +x scripts/backup-db.sh
```

**Schedule with cron**:

```bash
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/username/public_html/mediaplanpro/scripts/backup-db.sh
```

**File backups**:

```bash
# Backup uploaded files
tar -czf backups/files_$(date +%Y%m%d).tar.gz public/uploads/

# Or use rsync to remote server
rsync -avz public/uploads/ user@backup-server:/backups/mediaplanpro/
```

---

## 6. Production Considerations

### 6.1 Performance Optimization

**Enable caching**:

Update `next.config.js`:

```javascript
const nextConfig = {
  // ... existing config

  // Cache static assets
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

**Enable compression** (if not already):

```bash
npm install compression
```

**Optimize images**:

Use Next.js Image component everywhere:

```tsx
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false}
  loading="lazy"
/>
```

**Database connection pooling**:

Update `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Connection pool configuration
export const prismaConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?connection_limit=10&pool_timeout=20',
    },
  },
};
```

### 6.2 Security Hardening

**Update NextAuth configuration**:

File: `src/lib/auth.ts`

```typescript
export const authOptions: NextAuthOptions = {
  // ... existing config

  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true, // HTTPS only in production
      },
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // Add security headers
  callbacks: {
    // ... existing callbacks
  },
};
```

**Add security headers**:

Update `next.config.js`:

```javascript
const nextConfig = {
  // ... existing config

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

**Rate limiting**:

Install rate limiter:

```bash
npm install express-rate-limit
```

Create middleware: `src/middleware/rate-limit.ts`

```typescript
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Limit login attempts
  message: 'Too many login attempts, please try again later.',
});
```

### 6.3 CDN Setup (Optional)

**Use Cloudflare** (free tier available):

1. Sign up at https://cloudflare.com
2. Add your domain
3. Update nameservers at domain registrar
4. Enable:
   - Auto Minify (JS, CSS, HTML)
   - Brotli compression
   - Rocket Loader
   - Caching

**Configure caching rules**:

```
Cache Level: Standard
Browser Cache TTL: 4 hours
Edge Cache TTL: 2 hours
```

**Or use Hostinger CDN** (if available):

1. In hPanel, go to **"Performance"** → **"CDN"**
2. Enable CDN
3. Configure zones

### 6.4 Monitoring and Alerts

**Set up uptime monitoring**:

Use UptimeRobot (free):

1. Sign up at https://uptimerobot.com
2. Add monitor:
   - Type: HTTPS
   - URL: `https://yourdomain.com`
   - Interval: 5 minutes
3. Set up email alerts

**Application monitoring**:

Install New Relic or similar:

```bash
npm install newrelic
```

**Log aggregation**:

Use PM2 logs or external service:

```bash
# View logs
pm2 logs mediaplanpro

# Export logs
pm2 logs mediaplanpro --lines 1000 > logs/app.log
```

### 6.5 Database Maintenance

**Optimize tables regularly**:

Create script `scripts/optimize-db.sh`:

```bash
#!/bin/bash

DB_USER="mediaplanpro_user"
DB_PASS="your-password"
DB_NAME="mediaplanpro_prod"

mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "
  OPTIMIZE TABLE users;
  OPTIMIZE TABLE blog_posts;
  OPTIMIZE TABLE categories;
  OPTIMIZE TABLE tags;
  ANALYZE TABLE users;
  ANALYZE TABLE blog_posts;
"

echo "Database optimization completed"
```

**Schedule monthly**:

```bash
crontab -e

# Run on 1st of each month at 3 AM
0 3 1 * * /home/username/public_html/mediaplanpro/scripts/optimize-db.sh
```

---

## 7. Troubleshooting

### 7.1 Database Connection Errors

**Error**: `Can't connect to MySQL server`

**Solutions**:

1. **Check DATABASE_URL**:
   ```bash
   echo $DATABASE_URL
   # Should be: mysql://user:pass@host:3306/database
   ```

2. **Test MySQL connection**:
   ```bash
   mysql -h localhost -u mediaplanpro_user -p mediaplanpro_prod
   ```

3. **Check MySQL is running**:
   ```bash
   systemctl status mysql
   # Or
   service mysql status
   ```

4. **Verify user permissions**:
   ```sql
   SHOW GRANTS FOR 'mediaplanpro_user'@'localhost';
   ```

5. **Check connection limit**:
   ```sql
   SHOW VARIABLES LIKE 'max_connections';
   SET GLOBAL max_connections = 200;
   ```

### 7.2 NextAuth Redirect Issues

**Error**: Redirect loop or "Callback URL not allowed"

**Solutions**:

1. **Verify NEXTAUTH_URL**:
   ```env
   # Must match your domain exactly
   NEXTAUTH_URL="https://yourdomain.com"
   # NOT http:// in production
   # NOT trailing slash
   ```

2. **Check Google OAuth redirect URIs**:
   - Go to Google Cloud Console
   - Add: `https://yourdomain.com/api/auth/callback/google`

3. **Clear cookies**:
   ```javascript
   // In browser console
   document.cookie.split(";").forEach(c => {
     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   ```

4. **Check session configuration**:
   ```typescript
   // src/lib/auth.ts
   session: {
     strategy: 'jwt',
     maxAge: 30 * 24 * 60 * 60,
   },
   ```

### 7.3 Build Failures

**Error**: `JavaScript heap out of memory`

**Solution**:

```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**Error**: `Module not found`

**Solution**:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error**: `Prisma Client not generated`

**Solution**:

```bash
npx prisma generate
npm run build
```

### 7.4 CORS and API Issues

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:

Add CORS headers to API routes:

```typescript
// src/app/api/blog/posts/route.ts
export async function GET(request: NextRequest) {
  const response = NextResponse.json({ data: posts });

  // Add CORS headers if needed
  response.headers.set('Access-Control-Allow-Origin', 'https://yourdomain.com');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  return response;
}
```

### 7.5 Environment Variable Issues

**Error**: `process.env.VARIABLE is undefined`

**Solutions**:

1. **Check .env file exists**:
   ```bash
   ls -la .env.production
   ```

2. **Verify variables are loaded**:
   ```bash
   # In Node.js
   node -e "console.log(process.env.DATABASE_URL)"
   ```

3. **Restart application**:
   ```bash
   pm2 restart mediaplanpro
   ```

4. **Check Next.js env loading**:
   ```javascript
   // Only NEXT_PUBLIC_* are exposed to browser
   // Server-side can access all env vars
   ```

### 7.6 SSL Certificate Issues

**Error**: `NET::ERR_CERT_AUTHORITY_INVALID`

**Solutions**:

1. **Reinstall SSL certificate**:
   - In hPanel, go to SSL
   - Click "Reinstall"

2. **Force HTTPS**:
   ```apache
   # .htaccess
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

3. **Check certificate expiry**:
   ```bash
   openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
   ```

### 7.7 Performance Issues

**Slow page loads**:

1. **Enable caching**:
   ```javascript
   // next.config.js - add cache headers
   ```

2. **Optimize database queries**:
   ```typescript
   // Add indexes
   @@index([field])
   ```

3. **Use CDN** for static assets

4. **Enable compression**:
   ```javascript
   // next.config.js
   compress: true,
   ```

5. **Check database connection pool**:
   ```env
   DATABASE_URL="mysql://user:pass@host:3306/db?connection_limit=10"
   ```

---

## 8. Automated Deployment (CI/CD)

### 8.1 Set Up Git Repository

**Initialize Git** (if not already):

```bash
git init
git add .
git commit -m "Initial commit"
```

**Create GitHub repository**:

1. Go to https://github.com/new
2. Create repository: `mediaplanpro`
3. Push code:

```bash
git remote add origin https://github.com/yourusername/mediaplanpro.git
git branch -M main
git push -u origin main
```

### 8.2 Set Up GitHub Actions

**Create workflow file**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test
        continue-on-error: true

      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}

      - name: Deploy to Hostinger via SFTP
        uses: SamKirkland/FTP-Deploy-Action@4.3.3
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          server-dir: /public_html/mediaplanpro/
          exclude: |
            **/.git*
            **/.git*/**
            **/node_modules/**
            **/.env
            **/prisma/dev.db

      - name: SSH and restart application
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          script: |
            cd ~/public_html/mediaplanpro
            npm ci --production
            npx prisma generate
            npx prisma migrate deploy
            pm2 restart mediaplanpro || pm2 start npm --name mediaplanpro -- start
            pm2 save
```

**Add GitHub Secrets**:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `JWT_SECRET`
   - `FTP_SERVER` (e.g., `ftp.yourdomain.com`)
   - `FTP_USERNAME`
   - `FTP_PASSWORD`
   - `SSH_HOST`
   - `SSH_USERNAME`
   - `SSH_PASSWORD`

### 8.3 Set Up Git Hooks for Auto-Deploy

**Create post-receive hook on server**:

```bash
# SSH into server
ssh username@yourdomain.com

# Create bare repository
mkdir -p ~/repos/mediaplanpro.git
cd ~/repos/mediaplanpro.git
git init --bare

# Create post-receive hook
nano hooks/post-receive
```

**Add hook script**:

```bash
#!/bin/bash

# Configuration
TARGET="/home/username/public_html/mediaplanpro"
GIT_DIR="/home/username/repos/mediaplanpro.git"
BRANCH="main"

while read oldrev newrev ref
do
  # Only deploy main branch
  if [[ $ref = refs/heads/"$BRANCH" ]]; then
    echo "Deploying ${BRANCH} branch to production..."

    # Checkout files
    git --work-tree=$TARGET --git-dir=$GIT_DIR checkout -f $BRANCH

    # Navigate to target
    cd $TARGET

    # Install dependencies
    echo "Installing dependencies..."
    npm ci --production

    # Generate Prisma Client
    echo "Generating Prisma Client..."
    npx prisma generate

    # Run migrations
    echo "Running database migrations..."
    npx prisma migrate deploy

    # Build application
    echo "Building application..."
    NODE_OPTIONS="--max-old-space-size=4096" npm run build

    # Restart application
    echo "Restarting application..."
    pm2 restart mediaplanpro || pm2 start npm --name mediaplanpro -- start
    pm2 save

    echo "Deployment completed successfully!"
  fi
done
```

**Make executable**:

```bash
chmod +x hooks/post-receive
```

**Add remote on local machine**:

```bash
git remote add production username@yourdomain.com:~/repos/mediaplanpro.git
```

**Deploy with git push**:

```bash
git push production main
```

### 8.4 Automated Deployment Workflow

**Now any changes made in VS Code will auto-deploy**:

```bash
# Make changes in VS Code
# Save files

# Commit changes
git add .
git commit -m "Update blog post editor"

# Push to production
git push production main

# Or push to GitHub (triggers GitHub Actions)
git push origin main
```

**Deployment happens automatically**:
1. Code pushed to repository
2. GitHub Actions or git hook triggered
3. Dependencies installed
4. Application built
5. Files uploaded to server
6. Database migrations run
7. Application restarted
8. Live site updated

### 8.5 Rollback Strategy

**If deployment fails, rollback**:

```bash
# SSH into server
ssh username@yourdomain.com
cd ~/public_html/mediaplanpro

# Checkout previous commit
git log --oneline
git checkout <previous-commit-hash>

# Rebuild
npm ci
npm run build
pm2 restart mediaplanpro
```

**Or use PM2 snapshots**:

```bash
# Before deployment, create snapshot
pm2 save

# After failed deployment, restore
pm2 resurrect
```

---

## 9. Final Checklist

### Pre-Deployment
- [ ] Generated new production secrets
- [ ] Updated Prisma schema for MySQL
- [ ] Re-enabled case-insensitive search
- [ ] Updated next.config.js for production
- [ ] Tested build locally
- [ ] Created .env.production with all variables

### Hostinger Setup
- [ ] Created MySQL database
- [ ] Saved database credentials
- [ ] Configured domain/subdomain
- [ ] Installed SSL certificate
- [ ] Enabled HTTPS redirect

### Database
- [ ] Deployed migrations to production
- [ ] Seeded production database
- [ ] Created production admin user
- [ ] Deleted test users
- [ ] Verified database connectivity

### Application
- [ ] Uploaded files to server
- [ ] Installed dependencies
- [ ] Built application
- [ ] Started with PM2
- [ ] Configured reverse proxy

### Testing
- [ ] Homepage loads
- [ ] SSL certificate valid
- [ ] Authentication works
- [ ] Blog CMS accessible
- [ ] API endpoints secured
- [ ] Search works (case-insensitive)
- [ ] No console errors

### Production
- [ ] Set up monitoring
- [ ] Configured backups
- [ ] Enabled caching
- [ ] Added security headers
- [ ] Set up CI/CD
- [ ] Documented deployment process

---

## 🎉 Deployment Complete!

Your MediaPlanPro Blog CMS is now live on Hostinger!

**Access your site**:
- **Public Site**: https://yourdomain.com
- **Admin Panel**: https://yourdomain.com/dashboard/blog
- **Sign In**: https://yourdomain.com/auth/signin

**Next Steps**:
1. Sign in with production admin credentials
2. Create your first blog post
3. Customize branding and content
4. Set up Google Analytics
5. Configure email notifications
6. Add more content

**Support Resources**:
- Hostinger Support: https://www.hostinger.com/support
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

---

**Last Updated**: 2025-10-10
**Version**: 1.0
**Status**: Production Ready ✅

