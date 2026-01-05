# MediaPlanPro - Deployment Checklist

Use this checklist to ensure a smooth deployment to Hostinger Cloud Startup.

---

## Phase 1: Pre-Deployment Preparation

### 1.1 Generate Production Secrets
- [ ] Run `./scripts/generate-secrets.sh`
- [ ] Save NEXTAUTH_SECRET securely
- [ ] Save JWT_SECRET securely
- [ ] Save DATABASE_PASSWORD (if creating new DB user)

### 1.2 Update Prisma Schema
- [ ] Change datasource provider from "sqlite" to "mysql"
- [ ] Add `relationMode = "prisma"`
- [ ] Add MySQL type annotations (@db.VarChar, @db.Text)
- [ ] Add indexes to frequently queried fields
- [ ] Review all models for MySQL compatibility

### 1.3 Update Application Code
- [ ] Re-enable case-insensitive search in `src/app/api/blog/posts/route.ts`
- [ ] Update `next.config.js` with production settings
- [ ] Add security headers
- [ ] Configure image domains
- [ ] Set `output: 'standalone'` if needed

### 1.4 Create Production Environment File
- [ ] Create `.env.production.local` (DO NOT commit)
- [ ] Add DATABASE_URL with MySQL connection string
- [ ] Add NEXTAUTH_URL with production domain (https://)
- [ ] Add NEXTAUTH_SECRET (generated in step 1.1)
- [ ] Add JWT_SECRET (generated in step 1.1)
- [ ] Add GOOGLE_CLIENT_ID (production credentials)
- [ ] Add GOOGLE_CLIENT_SECRET (production credentials)
- [ ] Set NODE_ENV="production"

### 1.5 Test Locally
- [ ] Install dependencies: `npm ci`
- [ ] Build application: `npm run build`
- [ ] Test production build: `npm start`
- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Test Blog CMS functionality
- [ ] Check browser console for errors

### 1.6 Security Review
- [ ] Verify no test credentials in code
- [ ] Check `.gitignore` includes `.env*` files
- [ ] Review API endpoints for authentication
- [ ] Ensure HTTPS-only in production
- [ ] Verify secure cookie settings
- [ ] Check CORS configuration

---

## Phase 2: Hostinger Setup

### 2.1 Access Hostinger
- [ ] Log in to hPanel: https://hpanel.hostinger.com
- [ ] Verify Cloud Startup plan is active
- [ ] Note server details (IP, hostname)

### 2.2 Create MySQL Database
- [ ] Navigate to "Databases" → "MySQL Databases"
- [ ] Click "Create New Database"
- [ ] Database Name: `mediaplanpro_prod`
- [ ] Username: `mediaplanpro_user`
- [ ] Generate strong password
- [ ] Save credentials securely:
  ```
  Host: _______________
  Port: 3306
  Database: _______________
  Username: _______________
  Password: _______________
  ```
- [ ] Construct DATABASE_URL:
  ```
  mysql://username:password@host:3306/database
  ```
- [ ] URL-encode special characters in password

### 2.3 Configure Domain
- [ ] Choose option:
  - [ ] Option A: Use Hostinger subdomain (easier)
  - [ ] Option B: Configure custom domain
- [ ] If custom domain:
  - [ ] Add domain in hPanel
  - [ ] Update DNS at registrar
  - [ ] Wait for DNS propagation (check: https://dnschecker.org)

### 2.4 Install SSL Certificate
- [ ] Navigate to "SSL" in hPanel
- [ ] Select your domain
- [ ] Click "Install SSL"
- [ ] Choose "Free SSL" (Let's Encrypt)
- [ ] Wait for installation (5-15 minutes)
- [ ] Verify SSL: `curl -I https://yourdomain.com`
- [ ] Enable "Force HTTPS" in hPanel

### 2.5 Enable SSH Access
- [ ] Navigate to "Advanced" → "SSH Access"
- [ ] Enable SSH
- [ ] Note SSH credentials:
  ```
  Host: _______________
  Port: 22
  Username: _______________
  Password: _______________
  ```
- [ ] Test SSH connection: `ssh username@yourdomain.com`

### 2.6 Configure FTP/SFTP
- [ ] Navigate to "Files" → "FTP Accounts"
- [ ] Create FTP account or use existing
- [ ] Note FTP credentials:
  ```
  Host: _______________
  Port: 21 (FTP) or 22 (SFTP)
  Username: _______________
  Password: _______________
  ```

---

## Phase 3: Database Migration

### 3.1 Test MySQL Locally (Optional but Recommended)
- [ ] Install MySQL locally
- [ ] Create test database
- [ ] Update `.env` with local MySQL connection
- [ ] Run migrations: `npx prisma migrate dev --name mysql_initial`
- [ ] Test application with MySQL
- [ ] Verify all features work

### 3.2 Deploy Migration to Production
- [ ] SSH into Hostinger server
- [ ] Navigate to app directory
- [ ] Set DATABASE_URL environment variable
- [ ] Run: `npx prisma migrate deploy`
- [ ] Verify migration completed successfully

### 3.3 Seed Production Database
- [ ] Set environment variables:
  ```bash
  export ADMIN_EMAIL="admin@yourdomain.com"
  export ADMIN_PASSWORD="YourSecurePassword123!"
  ```
- [ ] Run: `npm run deploy:seed`
- [ ] Verify admin user created
- [ ] Verify categories created
- [ ] Verify tags created

### 3.4 Verify Database
- [ ] Connect to MySQL: `mysql -u user -p database`
- [ ] Check users: `SELECT * FROM users;`
- [ ] Check categories: `SELECT * FROM categories;`
- [ ] Check tags: `SELECT * FROM tags;`
- [ ] Verify indexes: `SHOW INDEX FROM blog_posts;`

---

## Phase 4: Application Deployment

### 4.1 Prepare Deployment Package
- [ ] Clean build: `rm -rf .next node_modules`
- [ ] Install dependencies: `npm ci`
- [ ] Build application: `npm run build`
- [ ] Verify build successful (no errors)

### 4.2 Upload to Hostinger
- [ ] Choose upload method:
  - [ ] Option A: SFTP (recommended)
  - [ ] Option B: Git deployment (see Phase 6)
  - [ ] Option C: File Manager (slow)
- [ ] Create directory: `~/public_html/mediaplanpro`
- [ ] Upload all files except:
  - [ ] `node_modules/`
  - [ ] `.git/`
  - [ ] `.next/` (will rebuild)
  - [ ] `prisma/dev.db`
  - [ ] `.env` (use production env)

### 4.3 Install Dependencies on Server
- [ ] SSH into server
- [ ] Navigate to app directory: `cd ~/public_html/mediaplanpro`
- [ ] Check Node.js version: `node --version` (should be 18+)
- [ ] Install dependencies: `npm ci --production`
- [ ] Or install all: `npm ci` (if building on server)

### 4.4 Set Environment Variables
- [ ] Create `.env.production` on server
- [ ] Add all production environment variables
- [ ] Set permissions: `chmod 600 .env.production`
- [ ] Verify variables loaded: `node -e "console.log(process.env.DATABASE_URL)"`

### 4.5 Build on Server (if needed)
- [ ] Run: `npm run build`
- [ ] If memory error, increase: `NODE_OPTIONS="--max-old-space-size=4096" npm run build`
- [ ] Verify build successful

### 4.6 Start Application
- [ ] Install PM2: `npm install -g pm2`
- [ ] Start app: `pm2 start npm --name mediaplanpro -- start`
- [ ] Or use ecosystem file: `pm2 start ecosystem.config.js --env production`
- [ ] Save PM2 config: `pm2 save`
- [ ] Setup startup: `pm2 startup` (follow instructions)
- [ ] Check status: `pm2 status`
- [ ] View logs: `pm2 logs mediaplanpro`

### 4.7 Configure Reverse Proxy
- [ ] Check if Hostinger auto-configured proxy
- [ ] If needed, create/edit `.htaccess`
- [ ] Add HTTPS redirect
- [ ] Add proxy rules to Node.js app
- [ ] Test: `curl http://localhost:3000`

---

## Phase 5: Post-Deployment Testing

### 5.1 Basic Functionality
- [ ] Access homepage: `https://yourdomain.com`
- [ ] Verify SSL certificate (green padlock)
- [ ] Check all pages load without errors
- [ ] Verify no console errors in browser
- [ ] Test responsive design (mobile, tablet, desktop)

### 5.2 Authentication Testing
- [ ] Navigate to `/auth/signin`
- [ ] Sign in with admin credentials
- [ ] Verify redirect to `/dashboard`
- [ ] Check session persists on refresh
- [ ] Sign out and verify redirect
- [ ] Test "Remember me" functionality
- [ ] If Google OAuth configured:
  - [ ] Test Google sign-in
  - [ ] Verify user created in database
  - [ ] Check redirect works correctly

### 5.3 Blog CMS Testing
- [ ] Access `/dashboard/blog`
- [ ] Verify blog list loads
- [ ] Test search functionality (case-insensitive)
- [ ] Test filters (status, category, author)
- [ ] Test pagination
- [ ] Create new blog post
- [ ] Verify auto-save works
- [ ] Publish post
- [ ] Edit existing post
- [ ] Test bulk actions
- [ ] Delete test post (admin only)

### 5.4 API Testing
- [ ] Test categories API: `curl https://yourdomain.com/api/blog/categories`
- [ ] Test tags API: `curl https://yourdomain.com/api/blog/tags`
- [ ] Test posts API (should require auth): `curl https://yourdomain.com/api/blog/posts`
- [ ] Verify proper error responses (401, 403, 404)

### 5.5 Public Blog Testing
- [ ] Navigate to `/blog`
- [ ] Verify published posts display
- [ ] Click on a post
- [ ] Verify full content loads
- [ ] Check related posts display
- [ ] Test category filtering
- [ ] Test tag filtering
- [ ] Verify SEO meta tags

---

## Phase 6: Production Configuration

### 6.1 Create Production Admin User
- [ ] SSH into server
- [ ] Run production seed with real credentials
- [ ] Save admin credentials securely
- [ ] Delete test users from database:
  ```sql
  DELETE FROM users WHERE email IN (
    'admin@mediaplanpro.com',
    'editor@mediaplanpro.com',
    'user@mediaplanpro.com'
  );
  ```

### 6.2 Set Up Monitoring
- [ ] Configure PM2 monitoring: `pm2 monitor`
- [ ] Install log rotation: `pm2 install pm2-logrotate`
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure error tracking (Sentry, optional)
- [ ] Set up email alerts for downtime

### 6.3 Configure Backups
- [ ] Update `scripts/backup-db.sh` with production credentials
- [ ] Make executable: `chmod +x scripts/backup-db.sh`
- [ ] Test backup: `./scripts/backup-db.sh`
- [ ] Schedule daily backups with cron:
  ```bash
  crontab -e
  # Add: 0 2 * * * /path/to/backup-db.sh
  ```
- [ ] Verify backup files created
- [ ] Test backup restoration

### 6.4 Performance Optimization
- [ ] Enable caching in `next.config.js`
- [ ] Configure CDN (Cloudflare, optional)
- [ ] Optimize images (use Next.js Image component)
- [ ] Enable compression
- [ ] Configure database connection pooling
- [ ] Run database optimization: `./scripts/optimize-db.sh`
- [ ] Schedule monthly optimization with cron

### 6.5 Security Hardening
- [ ] Add security headers in `next.config.js`
- [ ] Configure secure cookies in NextAuth
- [ ] Set up rate limiting (optional)
- [ ] Review and restrict API endpoints
- [ ] Enable CORS only for trusted domains
- [ ] Set up firewall rules (if available)

---

## Phase 7: Automated Deployment (CI/CD)

### 7.1 Set Up Git Repository
- [ ] Initialize Git: `git init`
- [ ] Create GitHub repository
- [ ] Push code: `git push origin main`
- [ ] Verify `.gitignore` excludes sensitive files

### 7.2 Configure GitHub Actions
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Add GitHub Secrets:
  - [ ] DATABASE_URL
  - [ ] NEXTAUTH_URL
  - [ ] NEXTAUTH_SECRET
  - [ ] JWT_SECRET
  - [ ] FTP_SERVER
  - [ ] FTP_USERNAME
  - [ ] FTP_PASSWORD
  - [ ] SSH_HOST
  - [ ] SSH_USERNAME
  - [ ] SSH_PASSWORD
- [ ] Test workflow: Push to main branch
- [ ] Verify deployment succeeds

### 7.3 Set Up Git Hooks (Alternative)
- [ ] SSH into server
- [ ] Create bare repository: `~/repos/mediaplanpro.git`
- [ ] Create post-receive hook
- [ ] Make hook executable
- [ ] Add remote on local: `git remote add production user@host:~/repos/mediaplanpro.git`
- [ ] Test deployment: `git push production main`

---

## Phase 8: Final Verification

### 8.1 Complete System Test
- [ ] Test all user roles (Admin, Editor, User)
- [ ] Verify role-based access control
- [ ] Test all CRUD operations
- [ ] Verify email notifications (if configured)
- [ ] Test error handling
- [ ] Check 404 and error pages

### 8.2 Performance Check
- [ ] Run Lighthouse audit
- [ ] Check page load times
- [ ] Verify Core Web Vitals
- [ ] Test under load (optional)

### 8.3 SEO Verification
- [ ] Verify meta tags on all pages
- [ ] Check robots.txt
- [ ] Verify sitemap.xml
- [ ] Test social media sharing
- [ ] Check structured data

### 8.4 Documentation
- [ ] Document deployment process
- [ ] Save all credentials securely
- [ ] Create runbook for common tasks
- [ ] Document rollback procedure

---

## ✅ Deployment Complete!

Once all items are checked, your MediaPlanPro Blog CMS is live!

**Next Steps**:
1. Announce launch
2. Monitor for issues
3. Gather user feedback
4. Plan future enhancements

**Support**:
- Hostinger Support: https://www.hostinger.com/support
- Documentation: See DEPLOYMENT_GUIDE_HOSTINGER.md

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Production URL**: _______________  
**Admin Email**: _______________

