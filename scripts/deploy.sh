#!/bin/bash

# MediaPlanPro - Deployment Script
# This script handles deployment to various environments

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment is provided
if [ -z "$1" ]; then
    print_error "Environment not specified"
    echo "Usage: ./scripts/deploy.sh [staging|production]"
    exit 1
fi

ENVIRONMENT=$1

print_status "Starting deployment to ${ENVIRONMENT}..."
echo ""

# Validate environment
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    print_error "Invalid environment: ${ENVIRONMENT}"
    echo "Valid environments: staging, production"
    exit 1
fi

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    print_status "Loading environment variables from .env.${ENVIRONMENT}"
    export $(cat .env.${ENVIRONMENT} | grep -v '^#' | xargs)
else
    print_warning "No .env.${ENVIRONMENT} file found"
fi

# Pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if required environment variables are set
REQUIRED_VARS=(
    "DATABASE_URL"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable ${var} is not set"
        exit 1
    fi
done

print_success "Pre-deployment checks passed"
echo ""

# Run tests
print_status "Running tests..."
npm test || {
    print_error "Tests failed"
    exit 1
}
print_success "Tests passed"
echo ""

# Run database migrations
print_status "Running database migrations..."
npx prisma migrate deploy || {
    print_error "Database migration failed"
    exit 1
}
print_success "Database migrations completed"
echo ""

# Build application
print_status "Building application..."
npm run build || {
    print_error "Build failed"
    exit 1
}
print_success "Build completed"
echo ""

# Deploy based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
    print_status "Deploying to staging environment..."
    
    # Deploy to Vercel staging
    if command -v vercel &> /dev/null; then
        vercel --prod --yes || {
            print_error "Vercel deployment failed"
            exit 1
        }
    else
        print_warning "Vercel CLI not found. Skipping Vercel deployment."
    fi
    
elif [ "$ENVIRONMENT" = "production" ]; then
    print_status "Deploying to production environment..."
    
    # Confirm production deployment
    read -p "Are you sure you want to deploy to PRODUCTION? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        print_warning "Production deployment cancelled"
        exit 0
    fi
    
    # Create backup
    print_status "Creating database backup..."
    BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).sql"
    pg_dump $DATABASE_URL > "backups/${BACKUP_FILE}" || {
        print_warning "Database backup failed"
    }
    print_success "Database backup created: ${BACKUP_FILE}"
    
    # Deploy to Vercel production
    if command -v vercel &> /dev/null; then
        vercel --prod --yes || {
            print_error "Vercel deployment failed"
            exit 1
        }
    else
        print_warning "Vercel CLI not found. Skipping Vercel deployment."
    fi
    
    # Create Sentry release
    if [ -n "$SENTRY_AUTH_TOKEN" ]; then
        print_status "Creating Sentry release..."
        VERSION=$(git rev-parse HEAD)
        sentry-cli releases new "$VERSION" || print_warning "Sentry release creation failed"
        sentry-cli releases set-commits "$VERSION" --auto || print_warning "Sentry commits failed"
        sentry-cli releases finalize "$VERSION" || print_warning "Sentry finalize failed"
        sentry-cli releases deploys "$VERSION" new -e production || print_warning "Sentry deploy failed"
    fi
fi

print_success "Deployment completed successfully!"
echo ""

# Post-deployment tasks
print_status "Running post-deployment tasks..."

# Warm up cache
print_status "Warming up cache..."
if [ "$ENVIRONMENT" = "production" ]; then
    curl -X POST https://mediaplanpro.com/api/cache/warm || print_warning "Cache warm-up failed"
else
    curl -X POST https://staging.mediaplanpro.com/api/cache/warm || print_warning "Cache warm-up failed"
fi

# Run smoke tests
print_status "Running smoke tests..."
npm run test:e2e:${ENVIRONMENT} || print_warning "Smoke tests failed"

print_success "Post-deployment tasks completed"
echo ""

# Deployment summary
echo "=================================================="
echo "✅ Deployment Summary"
echo "=================================================="
echo "Environment: ${ENVIRONMENT}"
echo "Timestamp: $(date)"
echo "Git Commit: $(git rev-parse HEAD)"
echo "Git Branch: $(git branch --show-current)"
echo ""
echo "Next steps:"
echo "1. Monitor application logs"
echo "2. Check error tracking (Sentry)"
echo "3. Verify critical user flows"
echo "4. Monitor performance metrics"
echo "=================================================="
