# 🚀 MediaPlanPro - Deployment to Hostinger

Complete deployment package for deploying MediaPlanPro Blog CMS to Hostinger Cloud Startup with MySQL database.

---

## 📚 Quick Navigation

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **[QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md)** | Fast deployment (30-60 min) | First-time deployment, quick reference |
| **[DEPLOYMENT_GUIDE_HOSTINGER.md](DEPLOYMENT_GUIDE_HOSTINGER.md)** | Complete guide (2000+ lines) | Detailed instructions, troubleshooting |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | Interactive checklist | Track deployment progress |
| **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** | Overview & resources | Understanding deployment options |

---

## ⚡ Quick Start

### For Beginners (Follow Step-by-Step)

1. **Read**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
2. **Follow**: Check off each item as you complete it
3. **Time**: 60-90 minutes

### For Experienced Users (Fast Track)

1. **Read**: [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md)
2. **Deploy**: Follow condensed instructions
3. **Time**: 30-45 minutes

### For Teams (Automated CI/CD)

1. **Read**: [DEPLOYMENT_GUIDE_HOSTINGER.md](DEPLOYMENT_GUIDE_HOSTINGER.md) - Section 8
2. **Setup**: GitHub Actions workflow
3. **Deploy**: `git push origin main`

---

## 🛠️ What's Included

### Documentation (4 comprehensive guides)
- ✅ Complete deployment guide (2000+ lines)
- ✅ Interactive checklist (400+ items)
- ✅ Quick deployment guide (200+ lines)
- ✅ Deployment summary & resources

### Scripts (5 automated tools)
- ✅ `generate-secrets.sh` - Generate production secrets
- ✅ `backup-db.sh` - Automated database backups
- ✅ `optimize-db.sh` - Database optimization
- ✅ `seed.production.ts` - Production database seeding
- ✅ GitHub Actions workflow - CI/CD automation

### Configuration Files
- ✅ `ecosystem.config.js` - PM2 process manager
- ✅ `.github/workflows/deploy.yml` - GitHub Actions
- ✅ Updated `package.json` - Deployment scripts

---

## 📋 Prerequisites

Before starting deployment:

- [ ] Hostinger Cloud Startup plan active
- [ ] Domain name (or using Hostinger subdomain)
- [ ] SSH access to Hostinger server
- [ ] FTP/SFTP credentials
- [ ] Node.js 18+ installed locally
- [ ] Git installed (for CI/CD)

---

## 🎯 Deployment Options

### Option 1: Manual Deployment (Recommended for First Time)

**Best for**: Learning the process, full control

**Steps**:
1. Generate production secrets
2. Create MySQL database on Hostinger
3. Update Prisma schema for MySQL
4. Build application locally
5. Upload via SFTP
6. SSH into server
7. Install dependencies
8. Deploy database migrations
9. Start with PM2

**Guide**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

**Time**: 60-90 minutes

---

### Option 2: Git-Based Deployment (Recommended for Updates)

**Best for**: Fast deployments, version control

**Setup** (one-time):
1. Create bare git repository on server
2. Set up post-receive hook
3. Add git remote

**Deploy**:
```bash
git push production main
```

**Guide**: [DEPLOYMENT_GUIDE_HOSTINGER.md](DEPLOYMENT_GUIDE_HOSTINGER.md) - Section 8.3

**Time**: 5-10 minutes per deployment

---

### Option 3: GitHub Actions CI/CD (Recommended for Teams)

**Best for**: Automated deployments, team collaboration

**Setup** (one-time):
1. Configure GitHub Actions workflow
2. Add GitHub Secrets
3. Push to repository

**Deploy**:
```bash
git push origin main
# Deployment happens automatically!
```

**Guide**: [DEPLOYMENT_GUIDE_HOSTINGER.md](DEPLOYMENT_GUIDE_HOSTINGER.md) - Section 8.2

**Time**: Automatic on push

---

## 🔧 Deployment Scripts

All scripts are in the `scripts/` directory and are executable.

### Generate Production Secrets

```bash
./scripts/generate-secrets.sh
```

**Output**: NEXTAUTH_SECRET, JWT_SECRET, DATABASE_PASSWORD

**Save these securely!** You'll need them for `.env.production`

---

### Backup Database

```bash
# Update credentials in script first
nano scripts/backup-db.sh

# Run backup
./scripts/backup-db.sh
```

**Features**:
- Creates timestamped backups
- Compresses with gzip
- Auto-deletes old backups (30+ days)

**Schedule daily backups**:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup-db.sh
```

---

### Optimize Database

```bash
# Update credentials in script first
nano scripts/optimize-db.sh

# Run optimization
./scripts/optimize-db.sh
```

**Features**:
- Optimizes all tables
- Analyzes table statistics
- Shows table sizes

**Schedule monthly**:
```bash
crontab -e
# Add: 0 3 1 * * /path/to/optimize-db.sh
```

---

### Seed Production Database

```bash
# Set credentials
export ADMIN_EMAIL="admin@yourdomain.com"
export ADMIN_PASSWORD="YourSecurePassword123!"

# Run seed
npm run deploy:seed
```

**Creates**:
- Admin user
- 4 categories
- 10 tags
- Welcome blog post

---

## 📦 NPM Scripts

Added to `package.json`:

```json
{
  "scripts": {
    "deploy:build": "npm ci && npm run build",
    "deploy:migrate": "prisma migrate deploy",
    "deploy:seed": "tsx prisma/seed.production.ts",
    "deploy:backup": "bash scripts/backup-db.sh",
    "deploy:optimize": "bash scripts/optimize-db.sh"
  }
}
```

**Usage**:
```bash
npm run deploy:build      # Build for production
npm run deploy:migrate    # Deploy database migrations
npm run deploy:seed       # Seed production database
npm run deploy:backup     # Backup database
npm run deploy:optimize   # Optimize database
```

---

## 🔐 Security Checklist

Before deploying:

- [ ] Generated new NEXTAUTH_SECRET (not dev secret)
- [ ] Generated new JWT_SECRET
- [ ] NEXTAUTH_URL uses HTTPS
- [ ] Strong database password (12+ chars)
- [ ] `.env` files in `.gitignore`
- [ ] No test credentials in production
- [ ] SSL certificate installed
- [ ] Force HTTPS enabled

---

## ✅ Post-Deployment Checklist

After deploying:

- [ ] Test homepage loads
- [ ] Verify SSL certificate (green padlock)
- [ ] Test authentication (sign in/out)
- [ ] Access Blog CMS dashboard
- [ ] Create test blog post
- [ ] Test search and filters
- [ ] Verify API endpoints secured
- [ ] Set up uptime monitoring
- [ ] Configure automated backups
- [ ] Test performance (Lighthouse)

---

## 🆘 Troubleshooting

### App Won't Start

```bash
# Check PM2 logs
pm2 logs mediaplanpro --lines 100

# Restart app
pm2 restart mediaplanpro

# Check environment variables
cat .env.production
```

### Database Connection Error

```bash
# Test MySQL connection
mysql -h localhost -u mediaplanpro_user -p mediaplanpro_prod

# Check DATABASE_URL
echo $DATABASE_URL
```

### Build Fails

```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### SSL Not Working

1. Wait 15 minutes after installation
2. Check hPanel SSL status
3. Clear browser cache
4. Try incognito mode

**More solutions**: See [DEPLOYMENT_GUIDE_HOSTINGER.md](DEPLOYMENT_GUIDE_HOSTINGER.md) - Section 7

---

## 📞 Support

### Documentation
- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth**: https://next-auth.js.org
- **PM2**: https://pm2.keymetrics.io/docs

### Hostinger
- **Support**: https://www.hostinger.com/support
- **Live Chat**: 24/7 available
- **Knowledge Base**: https://support.hostinger.com

### Community
- **Next.js Discord**: https://nextjs.org/discord
- **Prisma Discord**: https://pris.ly/discord

---

## 🎉 Ready to Deploy?

Choose your deployment method:

1. **First time?** → [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
2. **Experienced?** → [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md)
3. **Need details?** → [DEPLOYMENT_GUIDE_HOSTINGER.md](DEPLOYMENT_GUIDE_HOSTINGER.md)
4. **Want automation?** → [DEPLOYMENT_GUIDE_HOSTINGER.md](DEPLOYMENT_GUIDE_HOSTINGER.md) - Section 8

---

## 📊 Deployment Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT WORKFLOW                       │
└─────────────────────────────────────────────────────────────┘

1. PREPARATION (10 min)
   ├─ Generate secrets
   ├─ Update Prisma schema
   └─ Create .env.production

2. HOSTINGER SETUP (15 min)
   ├─ Create MySQL database
   ├─ Configure domain
   └─ Install SSL certificate

3. BUILD & UPLOAD (20 min)
   ├─ Build application
   ├─ Upload via SFTP
   └─ SSH into server

4. DEPLOYMENT (15 min)
   ├─ Install dependencies
   ├─ Deploy migrations
   ├─ Seed database
   └─ Start with PM2

5. TESTING (10 min)
   ├─ Test authentication
   ├─ Test Blog CMS
   └─ Verify SSL

6. POST-DEPLOYMENT (10 min)
   ├─ Set up monitoring
   ├─ Configure backups
   └─ Document credentials

TOTAL TIME: 60-90 minutes
```

---

## 🚀 Let's Deploy!

Everything is ready. Choose your guide and start deploying!

**Good luck!** 🎉

---

**Last Updated**: 2025-10-10  
**Version**: 1.0  
**Status**: Production Ready ✅

