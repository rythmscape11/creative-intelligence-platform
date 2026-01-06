# 🚀 Easy Setup - Copy & Paste Commands

**Server**: 31.97.204.155:65002  
**Username**: u384627337

---

## Option 1: One-Command Setup (Recommended)

I've created an automated script. Just run:

```bash
chmod +x setup-everything.sh
./setup-everything.sh
```

You'll be prompted for your Hostinger password, and it will set up everything automatically!

---

## Option 2: Manual Setup (Copy & Paste)

If you prefer to do it manually, follow these steps:

### **Step 1: Connect to Server**

```bash
ssh -p 65002 u384627337@31.97.204.155
```

Enter your password when prompted.

---

### **Step 2: Run Setup Commands**

Once connected, copy and paste this entire block:

```bash
# Navigate to home
cd ~

# Create application directory
mkdir -p public_html/mediaplanpro
cd public_html/mediaplanpro

# Check Node.js
echo "📦 Node.js version:"
node --version
npm --version

# Install PM2
echo "🔧 Installing PM2..."
npm install -g pm2

# Add PM2 to PATH
export PATH=$PATH:~/.npm-global/bin
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc
source ~/.bashrc

# Verify PM2
echo "✅ PM2 version:"
pm2 --version

# Create directories
mkdir -p logs scripts prisma public

# Create .env file
cat > .env << 'EOF'
DATABASE_URL="mysql://u384627337_media:lktYh229jXil8Z9Qebdo@localhost:3306/u384627337_mediaplanpro"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s="
JWT_SECRET="B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho="
NODE_ENV="production"
EOF

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'mediaplanpro',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    time: true,
  }],
};
EOF

# Set permissions
chmod 755 ~/public_html/mediaplanpro
chmod 644 .env

# Display summary
echo ""
echo "✅ Server setup completed!"
echo ""
echo "📋 Summary:"
echo "  Directory: ~/public_html/mediaplanpro"
echo "  Node.js: $(node --version)"
echo "  npm: $(npm --version)"
echo "  PM2: $(pm2 --version 2>/dev/null || echo 'Check PATH')"
echo ""
echo "⚠️  IMPORTANT: Update .env with your domain"
echo ""
```

---

### **Step 3: Edit .env File**

Still on the server, edit the .env file:

```bash
nano .env
```

**Change this line**:
```
NEXTAUTH_URL="https://yourdomain.com"
```

**To your actual domain**, for example:
```
NEXTAUTH_URL="https://mediaplanpro.com"
```

**Save**: Press `Ctrl+X`, then `Y`, then `Enter`

---

### **Step 4: Exit Server**

```bash
exit
```

---

## ✅ Server Setup Complete!

Now you need to:

### **1. Create MySQL Database** (10 min)

Go to Hostinger hPanel: https://hpanel.hostinger.com

1. **Databases** → **MySQL Databases**
2. **Create Database**: `u384627337_mediaplanpro`
3. **Create User**: `u384627337_media`
4. **Password**: `lktYh229jXil8Z9Qebdo`
5. **Add User to Database** → **All Privileges**

---

### **2. Add GitHub Secrets** (15 min)

Go to: https://github.com/rythmscape11/mediaplanpro/settings/secrets/actions

Click **"New repository secret"** for each:

```
SSH_HOST = 31.97.204.155
SSH_PORT = 65002
SSH_USERNAME = u384627337
SSH_PASSWORD = [your Hostinger password]

FTP_SERVER = [from hPanel → FTP Accounts]
FTP_USERNAME = u384627337 or u384627337@yourdomain.com
FTP_PASSWORD = [your FTP password]

DATABASE_URL = mysql://u384627337_media:lktYh229jXil8Z9Qebdo@localhost:3306/u384627337_mediaplanpro
NEXTAUTH_URL = https://yourdomain.com
NEXTAUTH_SECRET = jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s=
JWT_SECRET = B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho=
```

---

### **3. Test Deployment** (10 min)

```bash
# Create a test change
echo "# MediaPlanPro Blog CMS" > README.md
git add README.md
git commit -m "Test automated deployment"
git push origin main
```

**Monitor**: https://github.com/rythmscape11/mediaplanpro/actions

---

## 🎉 Done!

Once deployment succeeds, your automated CI/CD is active!

**Future deployments**:
```bash
git add .
git commit -m "Your changes"
git push origin main
# ✅ Automatically deploys to Hostinger!
```

---

## 🐛 Troubleshooting

### PM2 Not Found

```bash
export PATH=$PATH:~/.npm-global/bin
pm2 --version
```

### Check Server Status

```bash
ssh -p 65002 u384627337@31.97.204.155 "pm2 status"
```

### View Logs

```bash
ssh -p 65002 u384627337@31.97.204.155 "pm2 logs mediaplanpro"
```

---

**Need help?** All detailed guides are in the repository:
- [CONNECT_TO_SERVER.md](CONNECT_TO_SERVER.md)
- [SERVER_SETUP_COMPLETE.md](SERVER_SETUP_COMPLETE.md)
- [SETUP_GITHUB_SECRETS.md](SETUP_GITHUB_SECRETS.md)

