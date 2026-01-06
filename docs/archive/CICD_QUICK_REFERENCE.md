# GitHub Actions CI/CD - Quick Reference Card

**For**: Hostinger Cloud Startup Deployment  
**Last Updated**: 2025-10-10

---

## 🚀 Quick Setup (30 Minutes)

### Step 1: Push to GitHub (5 min)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/mediaplanpro.git
git push -u origin main
```

### Step 2: Add GitHub Secrets (10 min)

Go to: **Repository → Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Example Value |
|-------------|---------------|
| `DATABASE_URL` | `mysql://user:pass@localhost:3306/db` |
| `NEXTAUTH_URL` | `https://yourdomain.com` |
| `NEXTAUTH_SECRET` | `[from generate-secrets.sh]` |
| `JWT_SECRET` | `[from generate-secrets.sh]` |
| `FTP_SERVER` | `ftp.yourdomain.com` |
| `FTP_USERNAME` | `username@yourdomain.com` |
| `FTP_PASSWORD` | `[your FTP password]` |
| `SSH_HOST` | `srv123.hostinger.com` |
| `SSH_USERNAME` | `u123456789` |
| `SSH_PASSWORD` | `[your SSH password]` |

### Step 3: Verify Workflow File (2 min)

Check file exists: `.github/workflows/deploy.yml`

```bash
ls -la .github/workflows/deploy.yml
```

### Step 4: Test Deployment (10 min)

```bash
echo "# Test" >> README.md
git add README.md
git commit -m "Test deployment"
git push origin main
```

Watch: **GitHub → Actions tab**

### Step 5: Verify Live Site (3 min)

```bash
open https://yourdomain.com
```

---

## 📋 GitHub Secrets Checklist

Copy this to ensure you have all secrets:

```
□ DATABASE_URL
□ NEXTAUTH_URL
□ NEXTAUTH_SECRET
□ JWT_SECRET
□ FTP_SERVER
□ FTP_USERNAME
□ FTP_PASSWORD
□ SSH_HOST
□ SSH_USERNAME
□ SSH_PASSWORD
□ SSH_PORT (optional, default: 22)
□ GOOGLE_CLIENT_ID (optional)
□ GOOGLE_CLIENT_SECRET (optional)
```

---

## 🔄 Daily Workflow

### Make Changes

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes in VS Code
# ... edit files ...

# 3. Commit changes
git add .
git commit -m "Add new feature"

# 4. Push to GitHub
git push origin feature/new-feature

# 5. Create Pull Request on GitHub
# 6. Merge to main
# 7. Deployment happens automatically!
```

### Monitor Deployment

1. Go to **GitHub → Actions**
2. Click on running workflow
3. Watch progress (5-10 minutes)
4. Check live site

---

## 🛠️ Common Commands

### Generate Secrets

```bash
./scripts/generate-secrets.sh
```

### Test SFTP Connection

```bash
sftp username@ftp.yourdomain.com
```

### Test SSH Connection

```bash
ssh username@srv123.hostinger.com
```

### Check PM2 Status

```bash
ssh username@host
pm2 status
pm2 logs mediaplanpro
```

### Manual Deployment

```bash
git push origin main
```

### Trigger Manual Workflow

1. Go to **Actions** tab
2. Click **"Deploy to Hostinger"**
3. Click **"Run workflow"**
4. Select branch: `main`
5. Click **"Run workflow"**

---

## 🐛 Troubleshooting Quick Fixes

### SFTP Upload Fails

```yaml
# Check FTP_SERVER secret
# Should be: ftp.yourdomain.com
# NOT: https://ftp.yourdomain.com
```

### SSH Connection Fails

```bash
# Test manually
ssh username@host -p 22

# Verify SSH is enabled in hPanel
```

### Build Fails (Memory)

Add to workflow:

```yaml
env:
  NODE_OPTIONS: "--max-old-space-size=4096"
```

### PM2 Not Found

SSH into server:

```bash
npm install -g pm2
```

### Site Not Updating

```bash
# SSH into server
ssh username@host
cd ~/public_html/mediaplanpro

# Clear cache and rebuild
rm -rf .next
npm run build
pm2 restart mediaplanpro
```

---

## 📊 Deployment Status

### Check Workflow Status

**GitHub Actions Tab**:
- ✅ Green checkmark = Success
- ❌ Red X = Failed
- 🟡 Yellow dot = Running

### Check Live Site

```bash
curl -I https://yourdomain.com
# Should return: HTTP/2 200
```

### Check Server Status

```bash
ssh username@host
pm2 status
# Should show: mediaplanpro | online
```

---

## 🔐 Security Best Practices

- ✅ Never commit `.env` files
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate secrets every 90 days
- ✅ Use branch protection on `main`
- ✅ Require pull request reviews
- ✅ Enable 2FA on GitHub account

---

## 📈 Workflow Optimization

### Speed Up Builds

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Add Tests

```yaml
- name: Run tests
  run: npm test
```

### Add Notifications

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🎯 Deployment Checklist

Before each deployment:

- [ ] Code tested locally
- [ ] All tests passing
- [ ] No console errors
- [ ] Database migrations ready
- [ ] Environment variables updated
- [ ] Secrets configured in GitHub
- [ ] Backup created (automatic)

After deployment:

- [ ] Check GitHub Actions status
- [ ] Verify live site loads
- [ ] Test authentication
- [ ] Check PM2 status
- [ ] Monitor error logs
- [ ] Test critical features

---

## 📞 Quick Links

### Documentation
- **Full Guide**: [GITHUB_ACTIONS_CICD_GUIDE.md](GITHUB_ACTIONS_CICD_GUIDE.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE_HOSTINGER.md](DEPLOYMENT_GUIDE_HOSTINGER.md)
- **Troubleshooting**: [GITHUB_ACTIONS_CICD_GUIDE.md#troubleshooting](GITHUB_ACTIONS_CICD_GUIDE.md#troubleshooting)

### Hostinger
- **hPanel**: https://hpanel.hostinger.com
- **Support**: https://www.hostinger.com/support

### GitHub
- **Actions**: https://github.com/YOUR_USERNAME/mediaplanpro/actions
- **Secrets**: https://github.com/YOUR_USERNAME/mediaplanpro/settings/secrets/actions

---

## ⏱️ Deployment Timeline

| Phase | Time | Status |
|-------|------|--------|
| Checkout & Setup | 1 min | 🔵 |
| Install Dependencies | 2 min | 🔵 |
| Run Tests | 1 min | 🔵 |
| Build Application | 2 min | 🔵 |
| Upload to Hostinger | 2 min | 🟢 |
| SSH & Install | 1 min | 🟢 |
| Run Migrations | 1 min | 🟢 |
| Restart PM2 | 30 sec | 🟢 |
| **Total** | **~10 min** | ✅ |

---

## 🎉 Success Indicators

### GitHub Actions
```
✅ All checks passed
✅ Build successful
✅ Deployment completed
```

### Live Site
```
✅ Homepage loads (200 OK)
✅ SSL certificate valid
✅ Authentication works
✅ Dashboard accessible
```

### Server
```
✅ PM2 status: online
✅ No errors in logs
✅ Database connected
```

---

## 🔄 Rollback Procedure

If deployment fails:

1. **Check GitHub Actions logs**
2. **Identify failed step**
3. **Fix issue locally**
4. **Push fix**:
   ```bash
   git add .
   git commit -m "Fix deployment issue"
   git push origin main
   ```

Or **rollback to previous version**:

1. Go to **Actions** → **Rollback Deployment**
2. Enter previous commit SHA
3. Run workflow

---

## 📝 Notes

- Deployments run automatically on push to `main`
- Manual trigger available in Actions tab
- Secrets are encrypted and secure
- Workflow runs on Ubuntu latest
- Node.js version: 18
- PM2 manages application process
- Database backups before deployment
- SFTP for file transfer
- SSH for server commands

---

**Keep this card handy for quick reference!**

**Last Updated**: 2025-10-10  
**Version**: 1.0

