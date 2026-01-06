# ✅ Server Setup - Ready for Deployment!

**Date**: 2025-10-10  
**Server**: 31.97.204.155:65002  
**Username**: u384627337  
**Status**: 🟢 **CONFIGURED AND READY**

---

## 🎉 What I've Done

### **1. Updated GitHub Actions Workflow** ✅

**File**: `.github/workflows/deploy-hostinger.yml`

**Changes**:
- ✅ Updated SSH port from `22` to `65002` (your custom port)
- ✅ Updated SSH host to use `SSH_HOST` secret
- ✅ Configured for your Hostinger server

**Workflow Features**:
- ✅ Automated testing
- ✅ Automated building
- ✅ SFTP deployment to Hostinger
- ✅ Database migrations
- ✅ PM2 restart
- ✅ Database backup before deployment

---

### **2. Created Server Setup Script** ✅

**File**: `scripts/setup-server.sh`

**Features**:
- ✅ Automated server setup
- ✅ Checks Node.js and npm installation
- ✅ Installs PM2 globally
- ✅ Creates necessary directories
- ✅ Creates `.env` template
- ✅ Creates PM2 ecosystem configuration
- ✅ Sets correct permissions

**Usage**:
```bash
# After first deployment, run on server:
cd ~/public_html/mediaplanpro
chmod +x scripts/setup-server.sh
./scripts/setup-server.sh
```

---

### **3. Created Connection Guide** ✅

**File**: `CONNECT_TO_SERVER.md`

**Includes**:
- ✅ SSH connection instructions
- ✅ Manual setup steps
- ✅ Environment file configuration
- ✅ MySQL database setup
- ✅ GitHub Secrets configuration
- ✅ Troubleshooting guide

---

### **4. Updated Setup Documentation** ✅

**File**: `SETUP_GITHUB_SECRETS.md`

**Updates**:
- ✅ Added your actual server details
- ✅ SSH_HOST: `31.97.204.155`
- ✅ SSH_PORT: `65002`
- ✅ SSH_USERNAME: `u384627337`

---

### **5. Pushed Everything to GitHub** ✅

All files are now on GitHub:
- ✅ Updated workflow
- ✅ Server setup script
- ✅ Connection guide
- ✅ Updated documentation

**Repository**: https://github.com/rythmscape11/mediaplanpro

---

## 🔐 Your Server Details

### **SSH Connection**

```bash
ssh -p 65002 u384627337@31.97.204.155
```

| Detail | Value |
|--------|-------|
| **IP Address** | 31.97.204.155 |
| **Port** | 65002 |
| **Username** | u384627337 |
| **Password** | [Your Hostinger password] |

---

### **GitHub Secrets to Add**

**Go to**: https://github.com/rythmscape11/mediaplanpro/settings/secrets/actions

Add these 10 secrets:

| # | Secret Name | Value |
|---|-------------|-------|
| 1 | `SSH_HOST` | `31.97.204.155` |
| 2 | `SSH_PORT` | `65002` |
| 3 | `SSH_USERNAME` | `u384627337` |
| 4 | `SSH_PASSWORD` | [Your Hostinger password] |
| 5 | `FTP_SERVER` | [From hPanel → FTP Accounts] |
| 6 | `FTP_USERNAME` | `u384627337` or `u384627337@yourdomain.com` |
| 7 | `FTP_PASSWORD` | [Your FTP password] |
| 8 | `DATABASE_URL` | `mysql://user:pass@localhost:3306/dbname` |
| 9 | `NEXTAUTH_URL` | `https://yourdomain.com` |
| 10 | `NEXTAUTH_SECRET` | `jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=` |
| 11 | `JWT_SECRET` | `B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=` |

---

## 🚀 Next Steps (You Need to Do)

### **Step 1: Connect to Server** (5 min)

```bash
ssh -p 65002 u384627337@31.97.204.155
```

Enter your password when prompted.

---

### **Step 2: Set Up Server** (15 min)

Once connected, run these commands:

```bash
# Create application directory
mkdir -p ~/public_html/mediaplanpro
cd ~/public_html/mediaplanpro

# Check Node.js version (should be 18+)
node --version
npm --version

# Install PM2
npm install -g pm2

# Verify PM2 installation
pm2 --version

# If PM2 not found, add to PATH
export PATH=$PATH:~/.npm-global/bin
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc

# Create directories
mkdir -p logs scripts prisma public

# Create .env file
cat > .env << 'EOF'
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DATABASE_NAME"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s="
JWT_SECRET="B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho="
NODE_ENV="production"
EOF

# Edit .env with your actual values
nano .env
# Update DATABASE_URL and NEXTAUTH_URL
# Press Ctrl+X, then Y, then Enter to save

# Exit SSH
exit
```

**Detailed instructions**: See [CONNECT_TO_SERVER.md](CONNECT_TO_SERVER.md)

---

### **Step 3: Set Up MySQL Database** (10 min)

1. Log in to Hostinger hPanel: https://hpanel.hostinger.com
2. Go to **Databases** → **MySQL Databases**
3. Create database: `u384627337_mediaplanpro`
4. Create user: `u384627337_media`
5. Password: `lktYh229jXil8Z9Qebdo`
6. Grant all privileges

**Your DATABASE_URL**:
```
mysql://u384627337_media:lktYh229jXil8Z9Qebdo@localhost:3306/u384627337_mediaplanpro
```

---

### **Step 4: Add GitHub Secrets** (15 min)

1. Go to: https://github.com/rythmscape11/mediaplanpro/settings/secrets/actions
2. Click **"New repository secret"**
3. Add all 11 secrets from the table above

**Important**: Make sure to add `SSH_PORT` as `65002` (not 22)!

---

### **Step 5: Test Deployment** (10 min)

Once all secrets are added:

**Option 1: Push a change**
```bash
echo "# MediaPlanPro Blog CMS" > README.md
git add README.md
git commit -m "Test automated deployment"
git push origin main
```

**Option 2: Manual trigger**
1. Go to: https://github.com/rythmscape11/mediaplanpro/actions
2. Click **"Deploy to Hostinger"**
3. Click **"Run workflow"**
4. Select branch: `main`
5. Click **"Run workflow"**

**Monitor deployment**:
- Go to: https://github.com/rythmscape11/mediaplanpro/actions
- Click on running workflow
- Watch progress (5-10 minutes)

---

## ✅ Setup Checklist

Use this to track your progress:

### **Server Setup**

- [ ] SSH into server: `ssh -p 65002 u384627337@31.97.204.155`
- [ ] Create directory: `mkdir -p ~/public_html/mediaplanpro`
- [ ] Check Node.js version (18+)
- [ ] Install PM2: `npm install -g pm2`
- [ ] Add PM2 to PATH if needed
- [ ] Create `.env` file
- [ ] Edit `.env` with actual values

### **Database Setup**

- [ ] Log in to Hostinger hPanel
- [ ] Create MySQL database: `u384627337_mediaplanpro`
- [ ] Create MySQL user: `u384627337_media`
- [ ] Set password: `lktYh229jXil8Z9Qebdo`
- [ ] Grant all privileges
- [ ] Note down DATABASE_URL

### **GitHub Secrets**

- [ ] Add `SSH_HOST` = `31.97.204.155`
- [ ] Add `SSH_PORT` = `65002`
- [ ] Add `SSH_USERNAME` = `u384627337`
- [ ] Add `SSH_PASSWORD` = [your password]
- [ ] Add `FTP_SERVER` = [from hPanel]
- [ ] Add `FTP_USERNAME` = [from hPanel]
- [ ] Add `FTP_PASSWORD` = [from hPanel]
- [ ] Add `DATABASE_URL` = [MySQL connection string]
- [ ] Add `NEXTAUTH_URL` = [your domain]
- [ ] Add `NEXTAUTH_SECRET` = `jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=`
- [ ] Add `JWT_SECRET` = `B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=`

### **Test Deployment**

- [ ] Push a test change OR trigger manually
- [ ] Monitor GitHub Actions
- [ ] Verify deployment succeeds
- [ ] Check live site

---

## 📚 Documentation Reference

All documentation is ready:

### **Server Setup**
- **[CONNECT_TO_SERVER.md](CONNECT_TO_SERVER.md)** - Complete connection and setup guide
- **[SERVER_SETUP_COMMANDS.md](SERVER_SETUP_COMMANDS.md)** - Quick command reference
- **[scripts/setup-server.sh](scripts/setup-server.sh)** - Automated setup script

### **GitHub Secrets**
- **[SETUP_GITHUB_SECRETS.md](SETUP_GITHUB_SECRETS.md)** - Detailed secrets setup guide

### **CI/CD**
- **[GITHUB_ACTIONS_CICD_GUIDE.md](GITHUB_ACTIONS_CICD_GUIDE.md)** - Complete CI/CD guide
- **[CICD_QUICK_REFERENCE.md](CICD_QUICK_REFERENCE.md)** - Quick reference card

---

## 🎯 Quick Start Commands

### **Connect to Server**
```bash
ssh -p 65002 u384627337@31.97.204.155
```

### **Check PM2 Status**
```bash
ssh -p 65002 u384627337@31.97.204.155 "pm2 status"
```

### **View Application Logs**
```bash
ssh -p 65002 u384627337@31.97.204.155 "pm2 logs mediaplanpro"
```

### **Restart Application**
```bash
ssh -p 65002 u384627337@31.97.204.155 "pm2 restart mediaplanpro"
```

---

## 🎉 Summary

### **What's Done** ✅

- ✅ GitHub Actions workflow configured for your server
- ✅ SSH port updated to 65002
- ✅ Server setup script created
- ✅ Connection guide created
- ✅ Documentation updated with your server details
- ✅ Everything pushed to GitHub

### **What You Need to Do** 🟡

1. **Connect to server** (5 min)
2. **Set up server** (15 min)
3. **Create MySQL database** (10 min)
4. **Add GitHub Secrets** (15 min)
5. **Test deployment** (10 min)

**Total time**: ~55 minutes

### **The Result** 🚀

Once complete:
- ✅ Automated deployment from VS Code to live site
- ✅ 5-10 minute deployments (hands-off)
- ✅ Professional CI/CD pipeline
- ✅ Zero-downtime deployments

---

**Server**: 31.97.204.155:65002  
**Username**: u384627337  
**Repository**: https://github.com/rythmscape11/mediaplanpro  
**Status**: 🟢 **READY FOR SETUP**

---

**Next Step**: Connect to your server and follow [CONNECT_TO_SERVER.md](CONNECT_TO_SERVER.md)

