# 🔐 GitHub Secrets Setup Guide

**Repository**: https://github.com/rythmscape11/mediaplanpro  
**Date**: 2025-10-10

---

## 📋 Your Generated Secrets

I've generated production secrets for you. **Save these securely!**

### **Generated Secrets** (from `scripts/generate-secrets.sh`)

```
NEXTAUTH_SECRET:
jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=

JWT_SECRET:
B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=

DATABASE_PASSWORD (for MySQL user):
lktYh229jXil8Z9Qebdo
```

---

## 🚀 Quick Setup (15 Minutes)

### **Step 1: Go to GitHub Secrets Page**

Click this link to open GitHub Secrets page:

👉 **https://github.com/rythmscape11/mediaplanpro/settings/secrets/actions**

Or navigate manually:
1. Go to https://github.com/rythmscape11/mediaplanpro
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

---

### **Step 2: Add Required Secrets**

Add each secret one by one. Click **"New repository secret"** for each:

#### **1. DATABASE_URL**

**Name**: `DATABASE_URL`

**Value**: (You need to get this from Hostinger)

**Format**:
```
mysql://USERNAME:PASSWORD@HOST:3306/DATABASE_NAME
```

**Example**:
```
mysql://u123456789:lktYh229jXil8Z9Qebdo@localhost:3306/u123456789_mediaplanpro
```

**How to get this**:
1. Log in to Hostinger hPanel: https://hpanel.hostinger.com
2. Go to **Databases** → **MySQL Databases**
3. Create new database: `u123456789_mediaplanpro`
4. Create new user with password: `lktYh229jXil8Z9Qebdo`
5. Grant all privileges to user on database
6. Use the connection details to build the URL

---

#### **2. NEXTAUTH_URL**

**Name**: `NEXTAUTH_URL`

**Value**: Your production domain

**Example**:
```
https://mediaplanpro.yourdomain.com
```

Or if using subdomain:
```
https://blog.yourdomain.com
```

Or if using main domain:
```
https://yourdomain.com
```

---

#### **3. NEXTAUTH_SECRET**

**Name**: `NEXTAUTH_SECRET`

**Value**: (Use the generated secret)
```
jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=
```

---

#### **4. JWT_SECRET**

**Name**: `JWT_SECRET`

**Value**: (Use the generated secret)
```
B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=
```

---

#### **5. FTP_SERVER**

**Name**: `FTP_SERVER`

**Value**: Your Hostinger FTP server

**Example**:
```
ftp.yourdomain.com
```

**How to get this**:
1. Log in to Hostinger hPanel
2. Go to **Files** → **FTP Accounts**
3. Find your FTP hostname (usually `ftp.yourdomain.com`)

---

#### **6. FTP_USERNAME**

**Name**: `FTP_USERNAME`

**Value**: Your FTP username

**Example**:
```
username@yourdomain.com
```

Or:
```
u123456789
```

**How to get this**:
1. Log in to Hostinger hPanel
2. Go to **Files** → **FTP Accounts**
3. Find your FTP username

---

#### **7. FTP_PASSWORD**

**Name**: `FTP_PASSWORD`

**Value**: Your FTP password

**Note**: This is the password you set when creating the FTP account in Hostinger.

---

#### **8. SSH_HOST**

**Name**: `SSH_HOST`

**Value**: Your Hostinger SSH IP address
```
31.97.204.155
```

---

#### **9. SSH_USERNAME**

**Name**: `SSH_USERNAME`

**Value**: Your SSH username
```
u384627337
```

---

#### **10. SSH_PASSWORD**

**Name**: `SSH_PASSWORD`

**Value**: Your SSH password

**Note**: Use the password from your Hostinger hPanel.

---

#### **11. SSH_PORT** (REQUIRED)

**Name**: `SSH_PORT`

**Value**:
```
65002
```

**Note**: Your Hostinger server uses a custom SSH port (65002), not the default port 22.

---

### **Step 3: Verify All Secrets Are Added**

After adding all secrets, you should see these in your GitHub Secrets page:

- ✅ `DATABASE_URL`
- ✅ `NEXTAUTH_URL`
- ✅ `NEXTAUTH_SECRET`
- ✅ `JWT_SECRET`
- ✅ `FTP_SERVER`
- ✅ `FTP_USERNAME`
- ✅ `FTP_PASSWORD`
- ✅ `SSH_HOST`
- ✅ `SSH_USERNAME`
- ✅ `SSH_PASSWORD`
- ✅ `SSH_PORT` (optional)

---

## 🎯 What Happens Next

Once you add all the secrets:

1. **Automatic Deployment**: Any push to `main` branch will trigger deployment
2. **Manual Deployment**: You can trigger deployment manually from GitHub Actions tab
3. **Deployment Time**: 5-10 minutes (automatic)

---

## 🧪 Test the Deployment

### **Option 1: Push a Change**

```bash
# Make a small change
echo "# MediaPlanPro Blog CMS" > README.md
git add README.md
git commit -m "Test automated deployment"
git push origin main
```

### **Option 2: Manual Trigger**

1. Go to: https://github.com/rythmscape11/mediaplanpro/actions
2. Click **"Deploy to Hostinger"** workflow
3. Click **"Run workflow"**
4. Select branch: `main`
5. Click **"Run workflow"**

### **Monitor Deployment**

1. Go to: https://github.com/rythmscape11/mediaplanpro/actions
2. Click on the running workflow
3. Watch the progress (5-10 minutes)
4. Check for green checkmarks ✅

---

## 📝 Hostinger Setup Checklist

Before the deployment can work, make sure you have:

### **Database Setup**

- [ ] Created MySQL database in Hostinger hPanel
- [ ] Created MySQL user with password
- [ ] Granted all privileges to user on database
- [ ] Noted down database connection details

### **FTP/SFTP Setup**

- [ ] FTP account created in Hostinger
- [ ] FTP username and password noted
- [ ] FTP server hostname noted

### **SSH Setup**

- [ ] SSH access enabled in Hostinger hPanel
- [ ] SSH username and password noted
- [ ] SSH hostname noted

### **Domain Setup**

- [ ] Domain pointed to Hostinger
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Domain accessible via HTTPS

### **Server Directory**

- [ ] Created directory: `~/public_html/mediaplanpro`
- [ ] Directory has correct permissions

---

## 🔧 Hostinger Configuration Steps

### **1. Create MySQL Database**

1. Log in to hPanel: https://hpanel.hostinger.com
2. Go to **Databases** → **MySQL Databases**
3. Click **"Create Database"**
4. Database name: `u123456789_mediaplanpro`
5. Click **"Create"**

### **2. Create MySQL User**

1. In MySQL Databases page
2. Scroll to **"MySQL Users"**
3. Click **"Create User"**
4. Username: `u123456789_media` (or similar)
5. Password: `lktYh229jXil8Z9Qebdo` (use generated password)
6. Click **"Create"**

### **3. Grant Privileges**

1. Scroll to **"Add User to Database"**
2. Select user: `u123456789_media`
3. Select database: `u123456789_mediaplanpro`
4. Click **"Add"**
5. Select **"All Privileges"**
6. Click **"Make Changes"**

### **4. Enable SSH Access**

1. Go to **Advanced** → **SSH Access**
2. Click **"Enable SSH"**
3. Note down SSH hostname and username

### **5. Create Server Directory**

SSH into your server:

```bash
ssh u123456789@srv123.hostinger.com
```

Create directory:

```bash
mkdir -p ~/public_html/mediaplanpro
cd ~/public_html/mediaplanpro
```

### **6. Install PM2**

```bash
npm install -g pm2
```

---

## ✅ Verification

After adding all secrets and setting up Hostinger:

1. **Test GitHub Secrets**: All secrets should be visible in GitHub (values hidden)
2. **Test SSH Connection**: `ssh username@host` should work
3. **Test FTP Connection**: `sftp username@ftp.yourdomain.com` should work
4. **Test Database**: MySQL connection should work

---

## 🚀 Ready to Deploy!

Once all secrets are added and Hostinger is configured:

```bash
git add .
git commit -m "Configure GitHub Actions CI/CD"
git push origin main
```

Watch the deployment at:
👉 **https://github.com/rythmscape11/mediaplanpro/actions**

---

## 📞 Need Help?

If you encounter issues:

1. **Check GitHub Actions logs**: https://github.com/rythmscape11/mediaplanpro/actions
2. **Verify secrets are correct**: Settings → Secrets and variables → Actions
3. **Test SSH/FTP manually**: Use terminal to test connections
4. **Check Hostinger status**: Ensure services are running

---

**Created**: 2025-10-10  
**Status**: ✅ Ready for setup

