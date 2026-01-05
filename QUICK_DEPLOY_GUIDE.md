# MediaPlanPro - Quick Deployment Guide

**For**: Hostinger Cloud Startup  
**Time**: ~30-60 minutes  
**Difficulty**: Intermediate

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Generate secrets
./scripts/generate-secrets.sh

# 2. Update Prisma schema (change sqlite to mysql)
# Edit prisma/schema.prisma

# 3. Create .env.production
# Add DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, etc.

# 4. Build locally
npm run deploy:build

# 5. Upload to Hostinger via SFTP
# Use FileZilla or rsync

# 6. SSH into server
ssh username@yourdomain.com
cd ~/public_html/mediaplanpro

# 7. Install and deploy
npm ci
npm run deploy:migrate
npm run deploy:seed
pm2 start npm --name mediaplanpro -- start

# 8. Done! Visit https://yourdomain.com
```

---

## 📋 Detailed Steps

### Step 1: Generate Production Secrets (2 minutes)

```bash
./scripts/generate-secrets.sh
```

**Save the output**:
- NEXTAUTH_SECRET
- JWT_SECRET
- DATABASE_PASSWORD (optional)

### Step 2: Update Prisma Schema (5 minutes)

**File**: `prisma/schema.prisma`

**Change line 2-5**:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### Step 3: Create Hostinger MySQL Database (5 minutes)

1. Log in to hPanel: https://hpanel.hostinger.com
2. Go to **Databases** → **MySQL Databases**
3. Click **Create New Database**
4. Fill in:
   - Database: `mediaplanpro_prod`
   - Username: `mediaplanpro_user`
   - Password: Generate strong password
5. **Save credentials**

### Step 4: Create Production Environment File (3 minutes)

Create `.env.production`:

```env
DATABASE_URL="mysql://mediaplanpro_user:PASSWORD@localhost:3306/mediaplanpro_prod"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="paste-from-step-1"
JWT_SECRET="paste-from-step-1"
NODE_ENV="production"
```

**Replace**:
- `PASSWORD` with your database password
- `yourdomain.com` with your actual domain

### Step 5: Build Application (5 minutes)

```bash
npm run deploy:build
```

**Expected**: Build completes without errors

### Step 6: Upload to Hostinger (10-20 minutes)

**Option A: Using SFTP (Recommended)**

```bash
# Get FTP credentials from hPanel → Files → FTP Accounts

# Upload with rsync
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ username@yourdomain.com:~/public_html/mediaplanpro/
```

**Option B: Using FileZilla**

1. Download FileZilla
2. Connect:
   - Host: `sftp://yourdomain.com`
   - Username: From hPanel
   - Password: From hPanel
   - Port: 22
3. Upload all files to `public_html/mediaplanpro`

### Step 7: SSH into Server (1 minute)

```bash
ssh username@yourdomain.com
cd ~/public_html/mediaplanpro
```

### Step 8: Install Dependencies (5 minutes)

```bash
npm ci --production
```

### Step 9: Deploy Database (3 minutes)

```bash
# Run migrations
npm run deploy:migrate

# Seed database
export ADMIN_EMAIL="admin@yourdomain.com"
export ADMIN_PASSWORD="YourSecurePassword123!"
npm run deploy:seed
```

### Step 10: Start Application (2 minutes)

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name mediaplanpro -- start

# Save configuration
pm2 save

# Setup auto-start on reboot
pm2 startup
```

### Step 11: Configure SSL (5 minutes)

1. In hPanel, go to **SSL**
2. Select your domain
3. Click **Install SSL**
4. Choose **Free SSL**
5. Wait 5-10 minutes

### Step 12: Test Deployment (5 minutes)

Visit: `https://yourdomain.com`

**Verify**:
- ✅ Homepage loads
- ✅ SSL certificate valid (green padlock)
- ✅ Sign in works
- ✅ Dashboard accessible
- ✅ Blog CMS functional

---

## 🔧 Troubleshooting

### Build Fails

```bash
# Increase memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Database Connection Error

```bash
# Test connection
mysql -h localhost -u mediaplanpro_user -p mediaplanpro_prod

# Check DATABASE_URL format
echo $DATABASE_URL
```

### App Won't Start

```bash
# Check logs
pm2 logs mediaplanpro

# Restart
pm2 restart mediaplanpro

# Check if port is in use
netstat -tulpn | grep :3000
```

### SSL Not Working

1. Wait 15 minutes after installation
2. Clear browser cache
3. Try incognito mode
4. Check hPanel SSL status

---

## 📚 Full Documentation

For detailed instructions, see:
- **DEPLOYMENT_GUIDE_HOSTINGER.md** - Complete guide
- **DEPLOYMENT_CHECKLIST.md** - Step-by-step checklist

---

## 🆘 Need Help?

- **Hostinger Support**: https://www.hostinger.com/support
- **Documentation**: See DEPLOYMENT_GUIDE_HOSTINGER.md
- **Check logs**: `pm2 logs mediaplanpro`

---

## ✅ Success!

Your MediaPlanPro Blog CMS is now live!

**Next Steps**:
1. Sign in with admin credentials
2. Create your first blog post
3. Customize branding
4. Set up automated backups
5. Configure monitoring

**Admin Panel**: https://yourdomain.com/dashboard/blog

---

**Deployment Time**: ~30-60 minutes  
**Status**: Production Ready ✅

