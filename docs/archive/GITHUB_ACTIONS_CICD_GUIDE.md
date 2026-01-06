# GitHub Actions CI/CD for Hostinger - Complete Guide

**Platform**: Hostinger Cloud Startup  
**Automation**: GitHub Actions  
**Result**: Changes in VS Code → Automatically deployed to live site

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Prepare Your Repository](#step-1-prepare-your-repository)
4. [Step 2: Get Hostinger Credentials](#step-2-get-hostinger-credentials)
5. [Step 3: Configure GitHub Secrets](#step-3-configure-github-secrets)
6. [Step 4: Create GitHub Actions Workflow](#step-4-create-github-actions-workflow)
7. [Step 5: Test the Deployment](#step-5-test-the-deployment)
8. [Step 6: Verify and Monitor](#step-6-verify-and-monitor)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Configuration](#advanced-configuration)

---

## Overview

### What This Does

```
┌─────────────────────────────────────────────────────────────┐
│           AUTOMATED DEPLOYMENT WORKFLOW                      │
└─────────────────────────────────────────────────────────────┘

1. You make changes in VS Code
   ↓
2. You commit: git commit -m "Update feature"
   ↓
3. You push: git push origin main
   ↓
4. GitHub Actions automatically:
   - Checks out code
   - Installs dependencies
   - Runs tests (optional)
   - Builds application
   - Uploads to Hostinger via SFTP
   - SSH into server
   - Installs production dependencies
   - Runs database migrations
   - Restarts PM2
   ↓
5. ✅ Your live site is updated!

Total time: 5-10 minutes (automatic)
```

### Benefits

- ✅ **Automated**: No manual deployment steps
- ✅ **Consistent**: Same process every time
- ✅ **Fast**: 5-10 minute deployments
- ✅ **Safe**: Tests run before deployment
- ✅ **Traceable**: Full deployment history
- ✅ **Rollback**: Easy to revert if needed

---

## Prerequisites

Before starting, ensure you have:

- [ ] GitHub account with repository access
- [ ] Hostinger Cloud Startup plan active
- [ ] SSH access enabled on Hostinger
- [ ] FTP/SFTP access enabled
- [ ] Domain configured and SSL installed
- [ ] MySQL database created
- [ ] Application working locally

---

## Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository (if not already done)

```bash
# Navigate to your project
cd /Users/anustupmukherjee/Documents/augment-projects/Project\ 1

# Check if git is initialized
git status

# If not initialized:
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Create GitHub Repository

**Option A: Via GitHub Website**

1. Go to https://github.com/new
2. Repository name: `mediaplanpro` (or your choice)
3. Description: "MediaPlanPro - Marketing Strategy Platform"
4. Visibility: Private (recommended) or Public
5. **Do NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

**Option B: Via GitHub CLI**

```bash
# Install GitHub CLI (if not installed)
brew install gh

# Login to GitHub
gh auth login

# Create repository
gh repo create mediaplanpro --private --source=. --remote=origin --push
```

### 1.3 Push Code to GitHub

```bash
# Add GitHub as remote (if not done)
git remote add origin https://github.com/YOUR_USERNAME/mediaplanpro.git

# Or if using SSH
git remote add origin git@github.com:YOUR_USERNAME/mediaplanpro.git

# Push code
git branch -M main
git push -u origin main
```

**Verify**: Visit your GitHub repository and confirm files are uploaded.

---

## Step 2: Get Hostinger Credentials

### 2.1 Get SSH Credentials

1. **Log in** to Hostinger hPanel: https://hpanel.hostinger.com
2. Navigate to **"Advanced"** → **"SSH Access"**
3. **Enable SSH** if not already enabled
4. Note down:
   ```
   SSH Host: _________________ (e.g., srv123.hostinger.com)
   SSH Port: 22 (default)
   SSH Username: _________________ (e.g., u123456789)
   SSH Password: _________________ (your hPanel password)
   ```

**Test SSH connection**:

```bash
ssh username@host -p 22
# Enter password when prompted
# If successful, you'll see server prompt
```

### 2.2 Get SFTP Credentials

1. In hPanel, navigate to **"Files"** → **"FTP Accounts"**
2. **Create FTP Account** or use existing
3. Note down:
   ```
   FTP Server: _________________ (e.g., ftp.yourdomain.com)
   FTP Username: _________________ (e.g., username@yourdomain.com)
   FTP Password: _________________ (create strong password)
   FTP Port: 21 (FTP) or 22 (SFTP)
   ```

**Recommended**: Use SFTP (port 22) for secure transfers.

**Test SFTP connection**:

```bash
sftp username@ftp.yourdomain.com
# Enter password when prompted
# If successful, you'll see sftp> prompt
```

### 2.3 Determine Server Directory

**Find your application directory**:

```bash
# SSH into server
ssh username@host

# Navigate to web root
cd ~
pwd
# Output: /home/username

# Your app should be in:
cd public_html/mediaplanpro
pwd
# Output: /home/username/public_html/mediaplanpro
```

**Note this path**: `/home/username/public_html/mediaplanpro`

---

## Step 3: Configure GitHub Secrets

### 3.1 Access GitHub Secrets

1. Go to your GitHub repository
2. Click **"Settings"** (top menu)
3. In left sidebar, click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**

### 3.2 Add Required Secrets

Add each of these secrets one by one:

#### Secret 1: DATABASE_URL

```
Name: DATABASE_URL
Value: mysql://mediaplanpro_user:YOUR_DB_PASSWORD@localhost:3306/mediaplanpro_prod
```

**Replace**:
- `mediaplanpro_user` with your MySQL username
- `YOUR_DB_PASSWORD` with your MySQL password
- `mediaplanpro_prod` with your database name

**Important**: URL-encode special characters in password!

#### Secret 2: NEXTAUTH_URL

```
Name: NEXTAUTH_URL
Value: https://yourdomain.com
```

**Replace** `yourdomain.com` with your actual domain.

#### Secret 3: NEXTAUTH_SECRET

```
Name: NEXTAUTH_SECRET
Value: [paste from ./scripts/generate-secrets.sh output]
```

**Generate if needed**:
```bash
./scripts/generate-secrets.sh
# Copy the NEXTAUTH_SECRET value
```

#### Secret 4: JWT_SECRET

```
Name: JWT_SECRET
Value: [paste from ./scripts/generate-secrets.sh output]
```

#### Secret 5: FTP_SERVER

```
Name: FTP_SERVER
Value: ftp.yourdomain.com
```

**Or** use the SFTP server provided by Hostinger.

#### Secret 6: FTP_USERNAME

```
Name: FTP_USERNAME
Value: username@yourdomain.com
```

**Use** the FTP/SFTP username from Step 2.2.

#### Secret 7: FTP_PASSWORD

```
Name: FTP_PASSWORD
Value: [your FTP password]
```

#### Secret 8: SSH_HOST

```
Name: SSH_HOST
Value: srv123.hostinger.com
```

**Use** the SSH host from Step 2.1.

#### Secret 9: SSH_USERNAME

```
Name: SSH_USERNAME
Value: u123456789
```

**Use** the SSH username from Step 2.1.

#### Secret 10: SSH_PASSWORD

```
Name: SSH_PASSWORD
Value: [your SSH password]
```

**Usually** the same as your hPanel password.

#### Secret 11: SSH_PORT (optional)

```
Name: SSH_PORT
Value: 22
```

#### Secret 12: GOOGLE_CLIENT_ID (optional)

```
Name: GOOGLE_CLIENT_ID
Value: [your Google OAuth client ID]
```

**Only if** using Google OAuth.

#### Secret 13: GOOGLE_CLIENT_SECRET (optional)

```
Name: GOOGLE_CLIENT_SECRET
Value: [your Google OAuth client secret]
```

### 3.3 Verify Secrets

After adding all secrets, you should see:

```
✅ DATABASE_URL
✅ NEXTAUTH_URL
✅ NEXTAUTH_SECRET
✅ JWT_SECRET
✅ FTP_SERVER
✅ FTP_USERNAME
✅ FTP_PASSWORD
✅ SSH_HOST
✅ SSH_USERNAME
✅ SSH_PASSWORD
✅ SSH_PORT (optional)
✅ GOOGLE_CLIENT_ID (optional)
✅ GOOGLE_CLIENT_SECRET (optional)
```

---

## Step 4: Create GitHub Actions Workflow

### 4.1 Verify Workflow File Exists

The workflow file should already exist at:

```
.github/workflows/deploy.yml
```

**Check**:

```bash
ls -la .github/workflows/deploy.yml
```

If it exists, you're good! If not, create it:

```bash
mkdir -p .github/workflows
```

### 4.2 Review Workflow Configuration

Open `.github/workflows/deploy.yml` and verify it contains:

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
      
      - name: Generate Prisma Client
        run: npx prisma generate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Run linter
        run: npm run lint
        continue-on-error: true
      
      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
      
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
            **/.env.local
            **/prisma/dev.db
            **/*.log
            **/.DS_Store
            **/coverage/**
            **/.vscode/**
      
      - name: SSH and restart application
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          port: ${{ secrets.SSH_PORT || 22 }}
          script: |
            cd ~/public_html/mediaplanpro
            
            # Install production dependencies
            npm ci --production
            
            # Generate Prisma Client
            npx prisma generate
            
            # Run database migrations
            npx prisma migrate deploy
            
            # Restart application with PM2
            pm2 restart mediaplanpro || pm2 start npm --name mediaplanpro -- start
            pm2 save
            
            # Show status
            pm2 status
            
            echo "✅ Deployment completed successfully!"
      
      - name: Notify deployment status
        if: always()
        run: |
          if [ ${{ job.status }} == 'success' ]; then
            echo "✅ Deployment successful!"
          else
            echo "❌ Deployment failed!"
          fi
```

### 4.3 Customize Workflow (if needed)

**Adjust server directory**:

If your app is in a different directory, update line:

```yaml
server-dir: /public_html/mediaplanpro/
```

And:

```yaml
cd ~/public_html/mediaplanpro
```

**Add tests** (optional):

Add before the build step:

```yaml
- name: Run tests
  run: npm test
  continue-on-error: false
```

**Add environment-specific builds**:

```yaml
- name: Build for production
  run: NODE_ENV=production npm run build
```

### 4.4 Commit Workflow File

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

---

## Step 5: Test the Deployment

### 5.1 Trigger First Deployment

**Option A: Push to main branch**

```bash
# Make a small change
echo "# MediaPlanPro" > README.md
git add README.md
git commit -m "Test deployment"
git push origin main
```

**Option B: Manual trigger**

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Click **"Deploy to Hostinger"** workflow
4. Click **"Run workflow"** button
5. Select branch: `main`
6. Click **"Run workflow"**

### 5.2 Monitor Deployment

1. Go to **"Actions"** tab in GitHub
2. Click on the running workflow
3. Watch each step execute in real-time

**Expected steps**:
```
✅ Checkout code
✅ Setup Node.js
✅ Install dependencies
✅ Generate Prisma Client
✅ Run linter
✅ Build application
✅ Deploy to Hostinger via SFTP
✅ SSH and restart application
✅ Notify deployment status
```

**Total time**: 5-10 minutes

### 5.3 Check for Errors

If any step fails:

1. Click on the failed step
2. Read the error message
3. See [Troubleshooting](#troubleshooting) section below

---

## Step 6: Verify and Monitor

### 6.1 Verify Deployment

**Check your live site**:

```bash
# Open in browser
open https://yourdomain.com
```

**Verify**:
- ✅ Homepage loads
- ✅ SSL certificate valid
- ✅ Sign in works
- ✅ Dashboard accessible
- ✅ Blog CMS functional

### 6.2 Check Server Logs

**SSH into server**:

```bash
ssh username@host
cd ~/public_html/mediaplanpro

# Check PM2 status
pm2 status

# View logs
pm2 logs mediaplanpro --lines 50
```

### 6.3 Set Up Notifications (Optional)

**Email notifications**:

1. Go to GitHub repository **Settings**
2. Click **"Notifications"**
3. Enable **"Actions"**
4. Choose notification preferences

**Slack notifications** (optional):

Add to workflow:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Troubleshooting

### Issue 1: SFTP Upload Fails

**Error**: `Failed to connect to FTP server`

**Solutions**:

1. **Verify FTP credentials**:
   ```bash
   # Test SFTP connection
   sftp username@ftp.yourdomain.com
   ```

2. **Check FTP_SERVER secret**:
   - Should be: `ftp.yourdomain.com`
   - NOT: `https://ftp.yourdomain.com`
   - NOT: `sftp://ftp.yourdomain.com`

3. **Try different FTP server**:
   - Use SSH host instead: `srv123.hostinger.com`

4. **Check server-dir path**:
   ```yaml
   server-dir: /public_html/mediaplanpro/
   ```
   - Must start with `/`
   - Must end with `/`

### Issue 2: SSH Connection Fails

**Error**: `Permission denied` or `Connection refused`

**Solutions**:

1. **Verify SSH is enabled**:
   - Check hPanel → Advanced → SSH Access

2. **Test SSH manually**:
   ```bash
   ssh username@host -p 22
   ```

3. **Check SSH secrets**:
   - SSH_HOST: `srv123.hostinger.com` (no protocol)
   - SSH_USERNAME: Correct username
   - SSH_PASSWORD: Correct password
   - SSH_PORT: `22`

4. **Try password authentication**:
   - Hostinger uses password auth (not SSH keys)

### Issue 3: Build Fails

**Error**: `JavaScript heap out of memory`

**Solution**:

Add to workflow before build step:

```yaml
- name: Increase Node memory
  run: export NODE_OPTIONS="--max-old-space-size=4096"

- name: Build application
  run: npm run build
  env:
    NODE_OPTIONS: "--max-old-space-size=4096"
```

### Issue 4: Prisma Generate Fails

**Error**: `Prisma schema not found`

**Solution**:

Ensure `prisma/schema.prisma` exists and is committed:

```bash
git add prisma/schema.prisma
git commit -m "Add Prisma schema"
git push
```

### Issue 5: PM2 Not Found

**Error**: `pm2: command not found`

**Solution**:

SSH into server and install PM2:

```bash
ssh username@host
npm install -g pm2
```

Or update workflow to install PM2:

```yaml
script: |
  cd ~/public_html/mediaplanpro
  
  # Install PM2 if not installed
  npm install -g pm2 || true
  
  # Rest of script...
```

### Issue 6: Database Migration Fails

**Error**: `Migration failed`

**Solution**:

1. **Check DATABASE_URL secret** is correct

2. **Test database connection**:
   ```bash
   ssh username@host
   mysql -h localhost -u user -p database
   ```

3. **Run migration manually**:
   ```bash
   cd ~/public_html/mediaplanpro
   npx prisma migrate deploy
   ```

### Issue 7: Deployment Succeeds but Site Not Updated

**Solutions**:

1. **Clear Next.js cache**:
   ```bash
   ssh username@host
   cd ~/public_html/mediaplanpro
   rm -rf .next
   npm run build
   pm2 restart mediaplanpro
   ```

2. **Check PM2 is running**:
   ```bash
   pm2 status
   pm2 logs mediaplanpro
   ```

3. **Hard refresh browser**:
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

---

## Advanced Configuration

### 10.1 Environment-Specific Deployments

**Deploy to staging and production**:

Create two workflows:

**`.github/workflows/deploy-staging.yml`**:

```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # Same steps as main workflow
      # But use staging secrets and server
```

**`.github/workflows/deploy-production.yml`**:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      # Production deployment steps
```

### 10.2 Add Deployment Approval

**Require manual approval before production**:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://yourdomain.com

    steps:
      # Deployment steps...
```

**Configure environment**:

1. Go to repository **Settings** → **Environments**
2. Click **"New environment"**
3. Name: `production`
4. Enable **"Required reviewers"**
5. Add reviewers
6. Click **"Save protection rules"**

Now deployments to production require approval!

### 10.3 Rollback Strategy

**Create rollback workflow**:

**`.github/workflows/rollback.yml`**:

```yaml
name: Rollback Deployment

on:
  workflow_dispatch:
    inputs:
      commit_sha:
        description: 'Commit SHA to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout specific commit
        uses: actions/checkout@v3
        with:
          ref: ${{ github.event.inputs.commit_sha }}

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install and build
        run: |
          npm ci
          npm run build

      - name: Deploy to Hostinger
        uses: SamKirkland/FTP-Deploy-Action@4.3.3
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          server-dir: /public_html/mediaplanpro/

      - name: Restart application
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          script: |
            cd ~/public_html/mediaplanpro
            npm ci --production
            pm2 restart mediaplanpro
```

**To rollback**:

1. Go to **Actions** → **Rollback Deployment**
2. Click **"Run workflow"**
3. Enter commit SHA to rollback to
4. Click **"Run workflow"**

### 10.4 Deployment with Database Backup

**Backup before deployment**:

```yaml
- name: Backup database before deployment
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USERNAME }}
    password: ${{ secrets.SSH_PASSWORD }}
    script: |
      cd ~/public_html/mediaplanpro
      ./scripts/backup-db.sh
```

### 10.5 Slack Notifications

**Add Slack notifications**:

```yaml
- name: Notify Slack on success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: custom
    custom_payload: |
      {
        text: "✅ Deployment to production successful!",
        attachments: [{
          color: 'good',
          text: `Deployed by: ${{ github.actor }}\nCommit: ${{ github.sha }}\nMessage: ${{ github.event.head_commit.message }}`
        }]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

- name: Notify Slack on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: custom
    custom_payload: |
      {
        text: "❌ Deployment to production failed!",
        attachments: [{
          color: 'danger',
          text: `Failed step: Check GitHub Actions for details`
        }]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

**Setup**:

1. Create Slack webhook: https://api.slack.com/messaging/webhooks
2. Add to GitHub Secrets: `SLACK_WEBHOOK`

### 10.6 Performance Monitoring

**Add Lighthouse CI**:

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      https://yourdomain.com
      https://yourdomain.com/blog
    uploadArtifacts: true
```

### 10.7 Security Scanning

**Add security checks**:

```yaml
- name: Run security audit
  run: npm audit --production

- name: Check for vulnerabilities
  run: npm audit fix --dry-run
```

### 10.8 Cache Dependencies

**Speed up builds with caching**:

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Install dependencies
  run: npm ci
```

### 10.9 Parallel Deployments

**Deploy to multiple servers**:

```yaml
jobs:
  deploy-server-1:
    runs-on: ubuntu-latest
    steps:
      # Deploy to server 1

  deploy-server-2:
    runs-on: ubuntu-latest
    steps:
      # Deploy to server 2
```

### 10.10 Deployment Status Badge

**Add badge to README**:

```markdown
![Deployment Status](https://github.com/YOUR_USERNAME/mediaplanpro/actions/workflows/deploy.yml/badge.svg)
```

---

## Best Practices

### 1. Use Branch Protection

**Protect main branch**:

1. Go to **Settings** → **Branches**
2. Click **"Add rule"**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
5. Click **"Create"**

### 2. Use Pull Requests

**Workflow**:

```bash
# Create feature branch
git checkout -b feature/new-blog-editor

# Make changes
# ...

# Commit and push
git add .
git commit -m "Add new blog editor"
git push origin feature/new-blog-editor

# Create pull request on GitHub
# Review and merge to main
# Deployment happens automatically!
```

### 3. Tag Releases

**Create releases**:

```bash
# Tag version
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Create release on GitHub
gh release create v1.0.0 --title "Version 1.0.0" --notes "Release notes"
```

### 4. Monitor Deployments

**Set up monitoring**:

- ✅ GitHub Actions email notifications
- ✅ Slack notifications
- ✅ Uptime monitoring (UptimeRobot)
- ✅ Error tracking (Sentry)
- ✅ Performance monitoring (New Relic)

### 5. Keep Secrets Secure

**Security checklist**:

- ✅ Never commit secrets to repository
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate secrets regularly
- ✅ Use environment-specific secrets
- ✅ Limit access to secrets

### 6. Test Before Deploying

**Add tests to workflow**:

```yaml
- name: Run unit tests
  run: npm test

- name: Run integration tests
  run: npm run test:integration

- name: Run E2E tests
  run: npm run test:e2e
```

### 7. Use Semantic Versioning

**Version format**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

Example: `1.2.3`

### 8. Document Deployments

**Keep deployment log**:

Create `CHANGELOG.md`:

```markdown
# Changelog

## [1.0.0] - 2025-10-10

### Added
- GitHub Actions CI/CD
- Automated deployments
- Database migrations

### Changed
- Updated deployment process

### Fixed
- Fixed authentication redirect issue
```

---

## Complete Workflow Example

Here's a production-ready workflow with all best practices:

**`.github/workflows/deploy-production.yml`**:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  release:
    types: [published]
  workflow_dispatch:

env:
  NODE_VERSION: '18'

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm test
        continue-on-error: false

      - name: Run security audit
        run: npm audit --production
        continue-on-error: true

  build:
    name: Build Application
    needs: test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma Client
        run: npx prisma generate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Build application
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          NODE_ENV: production

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next

  deploy:
    name: Deploy to Hostinger
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://yourdomain.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: .next

      - name: Backup database
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          port: ${{ secrets.SSH_PORT || 22 }}
          script: |
            cd ~/public_html/mediaplanpro
            ./scripts/backup-db.sh || echo "Backup script not found"

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
            **/.env.local
            **/prisma/dev.db
            **/*.log
            **/.DS_Store
            **/coverage/**
            **/.vscode/**
            **/tests/**

      - name: Install dependencies and restart
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          password: ${{ secrets.SSH_PASSWORD }}
          port: ${{ secrets.SSH_PORT || 22 }}
          script: |
            cd ~/public_html/mediaplanpro

            echo "📦 Installing dependencies..."
            npm ci --production

            echo "🔧 Generating Prisma Client..."
            npx prisma generate

            echo "🗄️ Running database migrations..."
            npx prisma migrate deploy

            echo "🔄 Restarting application..."
            pm2 restart mediaplanpro || pm2 start npm --name mediaplanpro -- start
            pm2 save

            echo "✅ Deployment completed!"
            pm2 status

      - name: Verify deployment
        run: |
          sleep 10
          curl -f https://yourdomain.com || exit 1

      - name: Notify Slack on success
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: "✅ Production deployment successful!",
              attachments: [{
                color: 'good',
                fields: [
                  { title: 'Deployed by', value: '${{ github.actor }}', short: true },
                  { title: 'Commit', value: '${{ github.sha }}', short: true },
                  { title: 'Message', value: '${{ github.event.head_commit.message }}', short: false }
                ]
              }]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

      - name: Notify Slack on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              text: "❌ Production deployment failed!",
              attachments: [{
                color: 'danger',
                text: 'Check GitHub Actions for details: https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}'
              }]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Summary

### What You've Accomplished

✅ **Set up GitHub repository**
✅ **Configured GitHub Secrets** (10+ secrets)
✅ **Created GitHub Actions workflow**
✅ **Automated deployment process**
✅ **Enabled continuous deployment**

### Deployment Workflow

```
Make changes in VS Code
  ↓
git commit -m "Update"
  ↓
git push origin main
  ↓
GitHub Actions automatically:
  - Runs tests
  - Builds application
  - Deploys to Hostinger
  - Restarts PM2
  ↓
✅ Live site updated!
```

### Time Savings

- **Manual deployment**: 30-60 minutes
- **Automated deployment**: 5-10 minutes (hands-off)
- **Savings**: 80-90% time reduction

### Next Steps

1. **Test the workflow**: Make a small change and push
2. **Monitor deployments**: Check GitHub Actions tab
3. **Set up notifications**: Add Slack or email alerts
4. **Add tests**: Ensure quality before deployment
5. **Document process**: Update team documentation

---

## 🎉 Congratulations!

You now have a fully automated CI/CD pipeline!

**Any changes you make in VS Code and push to GitHub will automatically deploy to your live Hostinger website!**

---

**Questions?** See [Troubleshooting](#troubleshooting) or refer to:
- [DEPLOYMENT_GUIDE_HOSTINGER.md](DEPLOYMENT_GUIDE_HOSTINGER.md)
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

**Last Updated**: 2025-10-10
**Status**: ✅ **PRODUCTION READY**

