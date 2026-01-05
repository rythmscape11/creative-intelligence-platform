# ✅ Server Setup - PARTIALLY COMPLETE!

**Date**: 2025-10-11  
**Server**: 31.97.204.155:65002  
**Status**: 🟡 **DIRECTORIES CREATED - NODE.JS NEEDED**

---

## ✅ What I've Done Successfully

### **1. Server Directories Created** ✅

```
~/public_html/mediaplanpro/
├── .env (configured with your secrets)
├── ecosystem.config.js (PM2 configuration)
├── logs/ (for application logs)
├── scripts/ (for deployment scripts)
├── prisma/ (for database)
└── public/ (for static files)
```

### **2. Environment File Created** ✅

Your `.env` file is configured with:
- ✅ DATABASE_URL (MySQL connection)
- ✅ NEXTAUTH_SECRET (your generated secret)
- ✅ JWT_SECRET (your generated secret)
- ✅ NODE_ENV=production

### **3. PM2 Configuration Created** ✅

`ecosystem.config.js` is ready for PM2 process management.

---

## 🟡 What's Missing

### **Node.js is Not Installed on Server**

The server doesn't have Node.js installed yet. You need to enable it through Hostinger hPanel.

---

## 🚀 Next Steps (30 Minutes)

### **Step 1: Enable Node.js in Hostinger** (10 min)

1. **Log in to Hostinger hPanel**: https://hpanel.hostinger.com

2. **Go to Advanced** → **Select PHP Version**

3. **Enable Node.js**:
   - Look for "Node.js" section
   - Select **Node.js 18** or higher
   - Click **"Save"** or **"Apply"**

4. **Alternative**: If you don't see Node.js option:
   - Go to **Advanced** → **SSH Access**
   - Contact Hostinger support to enable Node.js 18+
   - Or check if your plan supports Node.js applications

**Important**: Hostinger Cloud Startup should support Node.js. If not visible, contact support.

---

### **Step 2: Install PM2 on Server** (5 min)

Once Node.js is enabled, SSH into your server and install PM2:

```bash
ssh -p 65002 u384627337@31.97.204.155
```

Password: `jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=`

Then run:

```bash
# Check Node.js is now available
node --version
npm --version

# Install PM2 globally
npm install -g pm2

# Add PM2 to PATH
export PATH=$PATH:~/.npm-global/bin
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc
source ~/.bashrc

# Verify PM2
pm2 --version

# Exit
exit
```

---

### **Step 3: Create MySQL Database** (10 min)

1. **Log in to Hostinger hPanel**: https://hpanel.hostinger.com

2. **Go to Databases** → **MySQL Databases**

3. **Create Database**:
   - Click **"Create Database"**
   - Database name: `u384627337_mediaplanpro`
   - Click **"Create"**

4. **Create User**:
   - Scroll to **"MySQL Users"**
   - Click **"Create User"**
   - Username: `u384627337_media`
   - Password: `lktYh229jXil8Z9Qebdo`
   - Click **"Create"**

5. **Grant Privileges**:
   - Scroll to **"Add User to Database"**
   - User: `u384627337_media`
   - Database: `u384627337_mediaplanpro`
   - Click **"Add"**
   - Select **"All Privileges"**
   - Click **"Make Changes"**

**Your DATABASE_URL** (already in .env):
```
mysql://u384627337_media:lktYh229jXil8Z9Qebdo@localhost:3306/u384627337_mediaplanpro
```

---

### **Step 4: Get FTP Credentials** (5 min)

1. **In Hostinger hPanel**, go to **Files** → **FTP Accounts**

2. **Note down**:
   - FTP Server (e.g., `ftp.yourdomain.com` or `31.97.204.155`)
   - FTP Username (usually `u384627337` or `u384627337@yourdomain.com`)
   - FTP Password (create one if needed)

---

### **Step 5: Add GitHub Secrets** (15 min)

**Go to**: https://github.com/rythmscape11/mediaplanpro/settings/secrets/actions

Click **"New repository secret"** for each:

| # | Secret Name | Value |
|---|-------------|-------|
| 1 | `SSH_HOST` | `31.97.204.155` |
| 2 | `SSH_PORT` | `65002` |
| 3 | `SSH_USERNAME` | `u384627337` |
| 4 | `SSH_PASSWORD` | `jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=` |
| 5 | `FTP_SERVER` | [From Step 4 - FTP hostname] |
| 6 | `FTP_USERNAME` | [From Step 4 - FTP username] |
| 7 | `FTP_PASSWORD` | [From Step 4 - FTP password] |
| 8 | `DATABASE_URL` | `mysql://u384627337_media:lktYh229jXil8Z9Qebdo@localhost:3306/u384627337_mediaplanpro` |
| 9 | `NEXTAUTH_URL` | `https://yourdomain.com` (your actual domain) |
| 10 | `NEXTAUTH_SECRET` | `jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=` |
| 11 | `JWT_SECRET` | `B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=` |

---

### **Step 6: Update Domain in .env** (2 min)

SSH into server and update your actual domain:

```bash
ssh -p 65002 u384627337@31.97.204.155
nano ~/public_html/mediaplanpro/.env
```

Change:
```
NEXTAUTH_URL="https://yourdomain.com"
```

To your actual domain:
```
NEXTAUTH_URL="https://your-actual-domain.com"
```

Save: `Ctrl+X`, then `Y`, then `Enter`

Exit: `exit`

---

### **Step 7: Test Deployment** (10 min)

Once all secrets are added and Node.js is enabled:

```bash
git push origin main
```

**Monitor**: https://github.com/rythmscape11/mediaplanpro/actions

---

## ✅ Setup Checklist

Track your progress:

### **Server Setup**
- [x] Directories created
- [x] .env file created
- [x] PM2 config created
- [ ] Node.js enabled in hPanel
- [ ] PM2 installed
- [ ] Domain updated in .env

### **Database Setup**
- [ ] MySQL database created: `u384627337_mediaplanpro`
- [ ] MySQL user created: `u384627337_media`
- [ ] Password set: `lktYh229jXil8Z9Qebdo`
- [ ] Privileges granted

### **FTP Setup**
- [ ] FTP credentials obtained from hPanel
- [ ] FTP server hostname noted
- [ ] FTP username noted
- [ ] FTP password noted

### **GitHub Secrets** (11 secrets)
- [ ] `SSH_HOST`
- [ ] `SSH_PORT`
- [ ] `SSH_USERNAME`
- [ ] `SSH_PASSWORD`
- [ ] `FTP_SERVER`
- [ ] `FTP_USERNAME`
- [ ] `FTP_PASSWORD`
- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `JWT_SECRET`

### **Test**
- [ ] Push to GitHub
- [ ] Monitor deployment
- [ ] Verify success

---

## 🔑 Your Credentials Summary

### **SSH**
```
Host: 31.97.204.155
Port: 65002
Username: u384627337
Password: jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=
```

### **MySQL Database**
```
Database: u384627337_mediaplanpro
User: u384627337_media
Password: lktYh229jXil8Z9Qebdo
Connection: mysql://u384627337_media:lktYh229jXil8Z9Qebdo@localhost:3306/u384627337_mediaplanpro
```

### **Application Secrets**
```
NEXTAUTH_SECRET: jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=
JWT_SECRET: B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=
```

---

## 📞 Need Help?

### **If Node.js is not available**:
1. Contact Hostinger support
2. Ask them to enable Node.js 18+ for your account
3. Mention you're deploying a Next.js application

### **If you can't find FTP credentials**:
1. Go to hPanel → Files → FTP Accounts
2. Create a new FTP account if needed
3. Note down the credentials

### **If deployment fails**:
1. Check GitHub Actions logs
2. Verify all 11 secrets are added
3. Verify Node.js is installed on server
4. Check PM2 is installed: `ssh -p 65002 u384627337@31.97.204.155 "pm2 --version"`

---

## 🎉 Summary

### **✅ Completed**
- Server directories created
- Configuration files created
- .env file configured
- PM2 ecosystem configured

### **🟡 Pending**
1. Enable Node.js in Hostinger hPanel (10 min)
2. Install PM2 on server (5 min)
3. Create MySQL database (10 min)
4. Get FTP credentials (5 min)
5. Add GitHub Secrets (15 min)
6. Update domain in .env (2 min)
7. Test deployment (10 min)

**Total time remaining**: ~57 minutes

### **🚀 The Result**
Once complete:
- ✅ Automated deployment active
- ✅ Push to GitHub = Deploy to live site
- ✅ 5-10 minute deployments
- ✅ Zero downtime

---

**Next Step**: Enable Node.js in Hostinger hPanel, then continue with the checklist above.

**hPanel Login**: https://hpanel.hostinger.com

