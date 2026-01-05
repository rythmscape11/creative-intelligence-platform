#!/bin/bash
# Deploy Plane to Railway with Aureon One branding
# Usage: ./deploy-railway.sh

set -e

echo "🚀 Deploying Agency OS (Plane) to Railway..."

# Check Railway CLI
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "📝 Logging in to Railway..."
railway login

# Create new project
echo "📦 Creating Railway project..."
railway init --name "aureon-agency-os"

# Set environment variables
echo "⚙️ Setting environment variables..."
railway variables set \
    NEXT_PUBLIC_API_BASE_URL="https://api.app.aureonone.in" \
    NEXT_PUBLIC_APP_URL="https://app.aureonone.in" \
    NEXT_PUBLIC_DEPLOY_URL="https://app.aureonone.in" \
    DATABASE_URL="postgresql://..." \
    REDIS_URL="redis://..." \
    SECRET_KEY="$(openssl rand -hex 32)" \
    DJANGO_SETTINGS_MODULE="plane.settings.production" \
    CORS_ALLOWED_ORIGINS="https://aureonone.in,https://www.aureonone.in,https://app.aureonone.in"

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Go to Railway dashboard to monitor deployment"
echo "2. Add custom domain: app.aureonone.in"
echo "3. Configure SSL (automatic)"
echo "4. Update DNS records"
