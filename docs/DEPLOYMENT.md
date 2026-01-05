# Deployment Guide

This guide covers deploying MediaPlanPro to various platforms and environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Vercel Deployment](#vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [AWS Deployment](#aws-deployment)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)

## Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 18.x or higher
- [ ] PostgreSQL database
- [ ] AWS S3 bucket for file storage
- [ ] OpenAI API key
- [ ] Sentry account (optional, for error tracking)
- [ ] Redis instance (optional, for caching)

## Environment Configuration

### Required Environment Variables

Create a `.env.production` file with the following variables:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://mediaplanpro.com
NEXT_PUBLIC_API_URL=https://mediaplanpro.com/api

# Database
DATABASE_URL=postgresql://user:password@host:5432/mediaplanpro

# Authentication
NEXTAUTH_URL=https://mediaplanpro.com
NEXTAUTH_SECRET=your-super-secret-key-change-this

# OpenAI
OPENAI_API_KEY=sk-...

# AWS S3
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_BUCKET=mediaplanpro-production

# Sentry (Optional)
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=your-org
SENTRY_PROJECT=mediaplanpro

# Redis (Optional)
REDIS_URL=redis://localhost:6379
```

### Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Vercel Deployment

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mediaplanpro)

### Manual Deployment

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Configure Project**:
   ```bash
   vercel link
   ```

4. **Set Environment Variables**:
   ```bash
   # Set each variable
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_SECRET production
   # ... repeat for all variables
   ```

5. **Deploy**:
   ```bash
   # Deploy to production
   vercel --prod

   # Or use the deployment script
   ./scripts/deploy.sh production
   ```

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  }
}
```

## Docker Deployment

### Build Docker Image

```bash
# Build image
docker build -t mediaplanpro:latest .

# Tag for registry
docker tag mediaplanpro:latest your-registry/mediaplanpro:latest

# Push to registry
docker push your-registry/mediaplanpro:latest
```

### Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Local Development with Docker

Use the dedicated dev stack when you want hot reload and local services managed by Docker:

```bash
cp .env.docker.example .env.docker
docker compose -f docker-compose.dev.yml up --build
```

This uses the `dev` target in the `Dockerfile`, mounts your working directory, and starts Postgres + Redis for local testing. Tear down with `docker compose -f docker-compose.dev.yml down` when you are finished.

### Docker Compose Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  app:
    image: your-registry/mediaplanpro:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: mediaplanpro
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

## AWS Deployment

### EC2 Deployment

1. **Launch EC2 Instance**:
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t3.medium or larger
   - Security Group: Allow ports 22, 80, 443

2. **Connect to Instance**:
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install Docker
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker ubuntu

   # Install Nginx
   sudo apt install -y nginx
   ```

4. **Deploy Application**:
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/mediaplanpro.git
   cd mediaplanpro

   # Install dependencies
   npm install

   # Build application
   npm run build

   # Start with PM2
   npm install -g pm2
   pm2 start npm --name "mediaplanpro" -- start
   pm2 save
   pm2 startup
   ```

### ECS Deployment

1. **Create ECS Cluster**
2. **Create Task Definition**
3. **Create Service**
4. **Configure Load Balancer**

See AWS documentation for detailed steps.

## Database Setup

### PostgreSQL on AWS RDS

1. **Create RDS Instance**:
   - Engine: PostgreSQL 15
   - Instance Class: db.t3.medium
   - Storage: 100 GB SSD
   - Multi-AZ: Yes (for production)

2. **Configure Security Group**:
   - Allow inbound on port 5432 from application servers

3. **Run Migrations**:
   ```bash
   DATABASE_URL=postgresql://... npx prisma migrate deploy
   ```

### Database Backups

```bash
# Manual backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Automated backups (cron)
0 2 * * * pg_dump $DATABASE_URL > /backups/backup-$(date +\%Y\%m\%d).sql
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check health endpoint
curl https://mediaplanpro.com/api/health

# Check application
curl https://mediaplanpro.com
```

### 2. Run Smoke Tests

```bash
npm run test:e2e:production
```

### 3. Monitor Application

- Check Sentry for errors
- Monitor server metrics
- Review application logs

### 4. Configure DNS

Point your domain to the deployment:

```
A     @     your-server-ip
CNAME www   your-domain.com
```

### 5. SSL Certificate

#### Using Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d mediaplanpro.com -d www.mediaplanpro.com
```

### 6. Performance Optimization

- Enable CDN (Cloudflare, AWS CloudFront)
- Configure caching headers
- Enable compression
- Optimize images

## Rollback Procedure

If deployment fails:

1. **Revert to Previous Version**:
   ```bash
   vercel rollback
   ```

2. **Restore Database**:
   ```bash
   psql $DATABASE_URL < backup-latest.sql
   ```

3. **Clear Cache**:
   ```bash
   redis-cli FLUSHALL
   ```

## Monitoring & Maintenance

### Application Monitoring

- **Sentry**: Error tracking and performance monitoring
- **Vercel Analytics**: Traffic and performance metrics
- **Custom Metrics**: `/api/metrics` endpoint

### Database Monitoring

- Monitor query performance
- Check connection pool usage
- Review slow query logs

### Regular Maintenance

- [ ] Weekly: Review error logs
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Annually: Performance review

## Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Database Connection Issues**:
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check Prisma
npx prisma db pull
```

**Memory Issues**:
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## Support

For deployment support:
- Email: devops@mediaplanpro.com
- Slack: #deployment
- Documentation: https://docs.mediaplanpro.com/deployment
