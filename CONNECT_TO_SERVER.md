# 🖥️ Connect to Your Hostinger Server

**Server Details**:
- **IP Address**: 31.97.204.155
- **SSH Port**: 65002
- **Username**: u384627337
- **Password**: [Your Hostinger password]

---

## 🚀 Quick Connect

### **Option 1: Using Terminal (Mac/Linux)**

Open Terminal and run:

```bash
ssh -p 65002 u384627337@31.97.204.155
```

Enter your password when prompted.

---

### **Option 2: Using SSH Client (Windows)**

**Using PuTTY**:
1. Download PuTTY: https://www.putty.org/
2. Open PuTTY
3. Enter:
   - **Host Name**: `31.97.204.155`
   - **Port**: `65002`
   - **Connection type**: SSH
4. Click **"Open"**
5. Login as: `u384627337`
6. Enter your password

**Using Windows Terminal or PowerShell**:
```powershell
ssh -p 65002 u384627337@31.97.204.155
```

---

## 📋 Server Setup Steps

Once connected, follow these steps:

### **Step 1: Navigate to Application Directory**

```bash
cd ~/public_html/mediaplanpro
```

If the directory doesn't exist, create it:

```bash
mkdir -p ~/public_html/mediaplanpro
cd ~/public_html/mediaplanpro
```

---

### **Step 2: Run Automated Setup Script**

The setup script will be uploaded during the first deployment. For now, let's set up manually:

#### **A. Check Node.js Version**

```bash
node --version
npm --version
```

Expected: Node.js v18 or higher

If Node.js is not installed or version is too old:
1. Log in to Hostinger hPanel
2. Go to **Advanced** → **Select PHP Version**
3. Enable Node.js 18 or higher

---

#### **B. Install PM2**

```bash
npm install -g pm2
```

Verify installation:

```bash
pm2 --version
```

If you get "command not found", try:

```bash
export PATH=$PATH:~/.npm-global/bin
pm2 --version
```

Add to your `.bashrc` to make it permanent:

```bash
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc
source ~/.bashrc
```

---

#### **C. Create Directories**

```bash
mkdir -p ~/public_html/mediaplanpro/{logs,scripts,prisma,public}
```

---

#### **D. Create Environment File**

```bash
cd ~/public_html/mediaplanpro

cat > .env << 'EOF'
# Database Configuration
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DATABASE_NAME"

# NextAuth Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s="

# JWT Configuration
JWT_SECRET="B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho="

# Node Environment
NODE_ENV="production"
EOF
```

---

#### **E. Edit Environment File**

```bash
nano .env
```

Update these values:
- `DATABASE_URL`: Your MySQL connection string from Hostinger
- `NEXTAUTH_URL`: Your production domain (e.g., `https://yourdomain.com`)

**To save in nano**:
- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter` to save

---

### **Step 3: Verify Setup**

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check PM2
pm2 --version

# Check directory structure
ls -la ~/public_html/mediaplanpro

# Check .env file exists
cat ~/public_html/mediaplanpro/.env
```

---

### **Step 4: Exit SSH**

```bash
exit
```

---

## 🔐 Add GitHub Secrets

Now that the server is set up, add these secrets to GitHub:

**Go to**: https://github.com/rythmscape11/mediaplanpro/settings/secrets/actions

Click **"New repository secret"** for each:

### **SSH Secrets**

| Secret Name | Value |
|-------------|-------|
| `SSH_HOST` | `31.97.204.155` |
| `SSH_PORT` | `65002` |
| `SSH_USERNAME` | `u384627337` |
| `SSH_PASSWORD` | `[your Hostinger password]` |

### **FTP Secrets**

Get these from Hostinger hPanel → Files → FTP Accounts:

| Secret Name | Value |
|-------------|-------|
| `FTP_SERVER` | `[from hPanel]` |
| `FTP_USERNAME` | `u384627337` or `u384627337@yourdomain.com` |
| `FTP_PASSWORD` | `[your FTP password]` |

### **Database Secret**

Get this from Hostinger hPanel → Databases → MySQL Databases:

| Secret Name | Value |
|-------------|-------|
| `DATABASE_URL` | `mysql://user:password@localhost:3306/dbname` |

### **Application Secrets**

| Secret Name | Value |
|-------------|-------|
| `NEXTAUTH_URL` | `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | `jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=` |
| `JWT_SECRET` | `B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=` |

---

## 🗄️ Set Up MySQL Database

### **Step 1: Create Database**

1. Log in to Hostinger hPanel: https://hpanel.hostinger.com
2. Go to **Databases** → **MySQL Databases**
3. Click **"Create Database"**
4. Database name: `u384627337_mediaplanpro` (or similar)
5. Click **"Create"**

### **Step 2: Create Database User**

1. Scroll to **"MySQL Users"** section
2. Click **"Create User"**
3. Username: `u384627337_media` (or similar)
4. Password: `lktYh229jXil8Z9Qebdo` (use the generated password)
5. Click **"Create"**

### **Step 3: Grant Privileges**

1. Scroll to **"Add User to Database"**
2. Select user: `u384627337_media`
3. Select database: `u384627337_mediaplanpro`
4. Click **"Add"**
5. Select **"All Privileges"**
6. Click **"Make Changes"**

### **Step 4: Get Connection String**

Your `DATABASE_URL` will be:

```
mysql://u384627337_media:lktYh229jXil8Z9Qebdo@localhost:3306/u384627337_mediaplanpro
```

**Add this to**:
1. GitHub Secret: `DATABASE_URL`
2. Server `.env` file

---

## ✅ Verification Checklist

Before testing deployment:

- [ ] SSH connection works: `ssh -p 65002 u384627337@31.97.204.155`
- [ ] Directory exists: `~/public_html/mediaplanpro`
- [ ] Node.js installed (v18+)
- [ ] PM2 installed and accessible
- [ ] `.env` file created with correct values
- [ ] MySQL database created
- [ ] MySQL user created with privileges
- [ ] All GitHub Secrets added (10 secrets)

---

## 🚀 Test Deployment

Once everything is set up:

### **Option 1: Push a Change**

```bash
# On your local machine
echo "# MediaPlanPro Blog CMS" > README.md
git add README.md
git commit -m "Test automated deployment to Hostinger"
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
4. Look for green checkmarks ✅

---

## 🐛 Troubleshooting

### **SSH Connection Refused**

```bash
# Make sure you're using the correct port
ssh -p 65002 u384627337@31.97.204.155

# Not port 22!
```

### **PM2 Command Not Found**

```bash
# Add npm global bin to PATH
export PATH=$PATH:~/.npm-global/bin

# Make it permanent
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc
source ~/.bashrc
```

### **Permission Denied**

```bash
# Set correct permissions
chmod 755 ~/public_html/mediaplanpro
```

### **Database Connection Failed**

1. Verify database exists in hPanel
2. Verify user has privileges
3. Check `DATABASE_URL` format is correct
4. Test connection: `mysql -u username -p database_name`

---

## 📞 Need Help?

If you encounter issues:

1. **Check server logs**: `pm2 logs mediaplanpro`
2. **Check GitHub Actions logs**: https://github.com/rythmscape11/mediaplanpro/actions
3. **Verify secrets**: https://github.com/rythmscape11/mediaplanpro/settings/secrets/actions
4. **Test SSH manually**: `ssh -p 65002 u384627337@31.97.204.155`

---

**Server**: 31.97.204.155:65002  
**Username**: u384627337  
**Created**: 2025-10-10

