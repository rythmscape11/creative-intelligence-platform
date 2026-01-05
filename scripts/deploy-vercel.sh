#!/bin/bash

# MediaPlanPro - Automated Vercel Deployment Script
# This script automates the entire Vercel deployment process

set -e  # Exit on error

echo "🚀 MediaPlanPro - Automated Vercel Deployment"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if Vercel CLI is installed
echo "📦 Step 1: Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
else
    echo -e "${GREEN}✅ Vercel CLI found${NC}"
fi
echo ""

# Step 2: Check if logged in
echo "🔐 Step 2: Checking Vercel authentication..."
if ! npx vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in. Please login to Vercel...${NC}"
    npx vercel login
else
    VERCEL_USER=$(npx vercel whoami 2>&1 | tail -n 1)
    echo -e "${GREEN}✅ Logged in as: $VERCEL_USER${NC}"
fi
echo ""

# Step 3: Deploy to Vercel
echo "🚀 Step 3: Deploying to Vercel..."
echo -e "${YELLOW}This will deploy to production...${NC}"
echo ""

# Deploy with production flag
npx vercel --prod --yes

echo ""
echo -e "${GREEN}✅ Deployment initiated!${NC}"
echo ""
echo "📊 Next Steps:"
echo "1. Go to Vercel dashboard: https://vercel.com/dashboard"
echo "2. Create Vercel Postgres database (if not exists)"
echo "3. Add environment variables (if not exists):"
echo "   - DATABASE_URL"
echo "   - NEXTAUTH_URL"
echo "   - NEXTAUTH_SECRET"
echo "   - JWT_SECRET"
echo "   - NODE_ENV"
echo ""
echo "🎉 Deployment complete!"

