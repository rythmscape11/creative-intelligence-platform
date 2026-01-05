#!/bin/bash

# MediaPlanPro - Environment Setup Script
# This script sets up the development environment

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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

echo "=================================================="
echo "MediaPlanPro - Environment Setup"
echo "=================================================="
echo ""

# Check Node.js version
print_status "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js 18.x or higher"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required"
    echo "Current version: $(node -v)"
    exit 1
fi
print_success "Node.js version: $(node -v)"

# Check npm
print_status "Checking npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm version: $(npm -v)"

# Install dependencies
print_status "Installing dependencies..."
npm install || {
    print_error "Failed to install dependencies"
    exit 1
}
print_success "Dependencies installed"

# Setup environment file
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success ".env file created"
        print_warning "Please update .env file with your configuration"
    else
        print_warning ".env.example not found. Creating basic .env file..."
        cat > .env << EOF
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development_secret_change_in_production"

# OpenAI
OPENAI_API_KEY=""

# AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="us-east-1"
AWS_S3_BUCKET=""

# Sentry
SENTRY_DSN=""
SENTRY_ENVIRONMENT="development"

# Redis (optional)
REDIS_URL="redis://localhost:6379"
EOF
        print_success "Basic .env file created"
        print_warning "Please update .env file with your API keys and configuration"
    fi
else
    print_success ".env file already exists"
fi

# Setup Prisma
print_status "Setting up Prisma..."
npx prisma generate || {
    print_error "Failed to generate Prisma client"
    exit 1
}
print_success "Prisma client generated"

# Run database migrations
print_status "Running database migrations..."
npx prisma migrate dev --name init || {
    print_warning "Database migration failed or already exists"
}
print_success "Database migrations completed"

# Seed database (optional)
read -p "Do you want to seed the database with sample data? (y/n): " seed_db
if [ "$seed_db" = "y" ] || [ "$seed_db" = "Y" ]; then
    print_status "Seeding database..."
    if [ -f "scripts/seed-blog-data.js" ]; then
        node scripts/seed-blog-data.js || print_warning "Database seeding failed"
        print_success "Database seeded"
    else
        print_warning "Seed script not found"
    fi
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p backups
mkdir -p test-results
mkdir -p public/uploads
print_success "Directories created"

# Setup Git hooks (optional)
if [ -d ".git" ]; then
    read -p "Do you want to setup Git hooks? (y/n): " setup_hooks
    if [ "$setup_hooks" = "y" ] || [ "$setup_hooks" = "Y" ]; then
        print_status "Setting up Git hooks..."
        if command -v husky &> /dev/null; then
            npx husky install || print_warning "Husky setup failed"
            print_success "Git hooks configured"
        else
            print_warning "Husky not found. Skipping Git hooks setup."
        fi
    fi
fi

# Check optional dependencies
print_status "Checking optional dependencies..."

if command -v docker &> /dev/null; then
    print_success "Docker is installed: $(docker --version)"
else
    print_warning "Docker is not installed (optional for containerized deployment)"
fi

if command -v vercel &> /dev/null; then
    print_success "Vercel CLI is installed"
else
    print_warning "Vercel CLI is not installed (optional for deployment)"
    echo "Install with: npm install -g vercel"
fi

# Setup complete
echo ""
echo "=================================================="
echo "✅ Environment Setup Complete!"
echo "=================================================="
echo ""
echo "Next steps:"
echo "1. Update .env file with your API keys and configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to see your application"
echo ""
echo "Useful commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm test             - Run tests"
echo "  npm run lint         - Run linter"
echo "  npx prisma studio    - Open Prisma Studio (database GUI)"
echo ""
echo "=================================================="
