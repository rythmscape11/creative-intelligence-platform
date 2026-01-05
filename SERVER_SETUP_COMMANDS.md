# 🖥️ Server Setup Commands

**Server Details**:
- **IP**: 31.97.204.155
- **Port**: 65002
- **Username**: u384627337

---

## 📋 Step-by-Step Server Setup

### **Step 1: Connect to Server via SSH**

Open your terminal and run:

```bash
ssh -p 65002 u384627337@31.97.204.155
```

Enter your password when prompted.

---

### **Step 2: Create Application Directory**

Once connected, run these commands:

```bash
# Navigate to web root
cd ~

# Create application directory
mkdir -p public_html/mediaplanpro

# Navigate to the directory
cd public_html/mediaplanpro

# Verify you're in the right place
pwd
```

Expected output: `/home/u384627337/public_html/mediaplanpro`

---

### **Step 3: Check Node.js Version**

```bash
node --version
npm --version
```

If Node.js is not installed or version is too old, you may need to install it via Hostinger's control panel.

---

### **Step 4: Install PM2 Globally**

```bash
npm install -g pm2
```

Verify installation:

```bash
pm2 --version
```

---

### **Step 5: Set Up PM2 Startup**

```bash
# Generate startup script
pm2 startup

# Follow the instructions it provides (usually a command to run with sudo)
```

---

### **Step 6: Create Environment File**

```bash
# Create .env file
cat > .env << 'EOF'
# Database
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DATABASE_NAME"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s="

# JWT
JWT_SECRET="B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho="

# Node Environment
NODE_ENV="production"
EOF
```

**Important**: Edit the `.env` file with your actual database credentials:

```bash
nano .env
```

Update:
- `DATABASE_URL` with your MySQL connection string
- `NEXTAUTH_URL` with your actual domain

Press `Ctrl+X`, then `Y`, then `Enter` to save.

---

### **Step 7: Test PM2**

Create a test file to verify PM2 works:

```bash
# Create a simple test script
echo 'console.log("PM2 is working!");' > test.js

# Start with PM2
pm2 start test.js --name test

# Check status
pm2 status

# View logs
pm2 logs test

# Stop and delete test
pm2 stop test
pm2 delete test
rm test.js
```

---

### **Step 8: Prepare for Deployment**

```bash
# Create logs directory
mkdir -p logs

# Create scripts directory
mkdir -p scripts

# Set correct permissions
chmod 755 public_html/mediaplanpro
```

---

### **Step 9: Exit SSH**

```bash
exit
```

---

## ✅ Verification Checklist

After completing the setup, verify:

- [ ] SSH connection works on port 65002
- [ ] Directory `/home/u384627337/public_html/mediaplanpro` exists
- [ ] Node.js is installed and accessible
- [ ] PM2 is installed globally
- [ ] `.env` file created with correct values
- [ ] Logs directory created

---

## 🔐 GitHub Secrets to Add

Now that you have the server details, add these to GitHub Secrets:

**Go to**: https://github.com/rythmscape11/mediaplanpro/settings/secrets/actions

### **SSH Secrets**

| Secret Name | Value |
|-------------|-------|
| `SSH_HOST` | `31.97.204.155` |
| `SSH_PORT` | `65002` |
| `SSH_USERNAME` | `u384627337` |
| `SSH_PASSWORD` | `[your password]` |

### **FTP Secrets**

| Secret Name | Value |
|-------------|-------|
| `FTP_SERVER` | `[your FTP hostname from hPanel]` |
| `FTP_USERNAME` | `u384627337` or `u384627337@yourdomain.com` |
| `FTP_PASSWORD` | `[your FTP password]` |

### **Application Secrets**

| Secret Name | Value |
|-------------|-------|
| `DATABASE_URL` | `mysql://user:pass@localhost:3306/dbname` |
| `NEXTAUTH_URL` | `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | `jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=` |
| `JWT_SECRET` | `B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=` |

---

## 🚀 Next Steps

1. **Complete server setup** using the commands above
2. **Add GitHub Secrets** with the server details
3. **Set up MySQL database** in Hostinger hPanel
4. **Test deployment** by pushing to GitHub

---

**Created**: 2025-10-10  
**Server**: 31.97.204.155:65002

