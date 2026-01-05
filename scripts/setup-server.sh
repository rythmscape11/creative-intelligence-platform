#!/bin/bash

###############################################################################
# MediaPlanPro Server Setup Script
# 
# This script sets up the Hostinger server for automated deployment
# 
# Usage:
#   1. Upload this script to your server
#   2. Make it executable: chmod +x setup-server.sh
#   3. Run it: ./setup-server.sh
###############################################################################

set -e  # Exit on error

echo "🚀 MediaPlanPro Server Setup"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Check if running on correct server
print_info "Checking server environment..."

# Get current directory
CURRENT_DIR=$(pwd)
print_info "Current directory: $CURRENT_DIR"

# Create application directory if it doesn't exist
APP_DIR="$HOME/public_html/mediaplanpro"
print_info "Setting up application directory: $APP_DIR"

if [ ! -d "$APP_DIR" ]; then
    mkdir -p "$APP_DIR"
    print_success "Created application directory"
else
    print_warning "Application directory already exists"
fi

cd "$APP_DIR"

# Check Node.js installation
print_info "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed: $NODE_VERSION"
    
    # Check if version is 18 or higher
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_warning "Node.js version is less than 18. You may need to upgrade."
        print_info "Contact Hostinger support to upgrade Node.js to version 18 or higher"
    fi
else
    print_error "Node.js is not installed!"
    print_info "Please install Node.js 18+ via Hostinger hPanel"
    exit 1
fi

# Check npm installation
print_info "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed!"
    exit 1
fi

# Install PM2 globally
print_info "Installing PM2 process manager..."
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    print_warning "PM2 is already installed: $PM2_VERSION"
else
    npm install -g pm2
    if [ $? -eq 0 ]; then
        print_success "PM2 installed successfully"
    else
        print_error "Failed to install PM2"
        print_info "You may need to install it manually: npm install -g pm2"
    fi
fi

# Verify PM2 installation
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 --version)
    print_success "PM2 version: $PM2_VERSION"
else
    print_error "PM2 is not available in PATH"
    print_info "Try running: export PATH=$PATH:~/.npm-global/bin"
fi

# Create necessary directories
print_info "Creating necessary directories..."

mkdir -p logs
mkdir -p scripts
mkdir -p prisma
mkdir -p public

print_success "Directories created"

# Create .env template
print_info "Creating .env template..."

if [ ! -f .env ]; then
    cat > .env << 'EOF'
# Database Configuration
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/DATABASE_NAME"

# NextAuth Configuration
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s="

# JWT Configuration
JWT_SECRET="B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho="

# Node Environment
NODE_ENV="production"

# Optional: Google OAuth (if using)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
EOF
    print_success ".env template created"
    print_warning "IMPORTANT: Edit .env file with your actual database credentials!"
    print_info "Run: nano .env"
else
    print_warning ".env file already exists, skipping creation"
fi

# Set correct permissions
print_info "Setting permissions..."
chmod 755 "$APP_DIR"
chmod 644 .env 2>/dev/null || true
print_success "Permissions set"

# Create a simple health check script
print_info "Creating health check script..."
cat > scripts/health-check.sh << 'EOF'
#!/bin/bash
# Simple health check script

if pm2 list | grep -q "mediaplanpro.*online"; then
    echo "✅ Application is running"
    exit 0
else
    echo "❌ Application is not running"
    exit 1
fi
EOF

chmod +x scripts/health-check.sh
print_success "Health check script created"

# Create PM2 ecosystem file
print_info "Creating PM2 ecosystem configuration..."
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
print_success "PM2 ecosystem configuration created"

# Display summary
echo ""
echo "=============================="
print_success "Server setup completed!"
echo "=============================="
echo ""

print_info "Summary:"
echo "  📁 Application directory: $APP_DIR"
echo "  📦 Node.js version: $NODE_VERSION"
echo "  📦 npm version: $NPM_VERSION"
if command -v pm2 &> /dev/null; then
    echo "  🔧 PM2 version: $(pm2 --version)"
else
    echo "  🔧 PM2: Not available in PATH"
fi
echo ""

print_warning "Next Steps:"
echo "  1. Edit .env file with your database credentials:"
echo "     nano .env"
echo ""
echo "  2. Add GitHub Secrets at:"
echo "     https://github.com/rythmscape11/mediaplanpro/settings/secrets/actions"
echo ""
echo "  3. Required secrets:"
echo "     - DATABASE_URL"
echo "     - NEXTAUTH_URL"
echo "     - NEXTAUTH_SECRET"
echo "     - JWT_SECRET"
echo "     - FTP_SERVER"
echo "     - FTP_USERNAME"
echo "     - FTP_PASSWORD"
echo "     - SSH_HOST (31.97.204.155)"
echo "     - SSH_PORT (65002)"
echo "     - SSH_USERNAME (u384627337)"
echo "     - SSH_PASSWORD"
echo ""
echo "  4. Test deployment by pushing to GitHub"
echo ""

print_success "Setup script completed successfully!"

