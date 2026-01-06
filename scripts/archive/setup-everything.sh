#!/bin/bash

###############################################################################
# MediaPlanPro - Complete Automated Setup Script
# 
# This script will:
# 1. Connect to your Hostinger server
# 2. Set up the server environment
# 3. Install PM2
# 4. Create necessary directories and files
# 5. Guide you through GitHub Secrets setup
# 6. Test the deployment
#
# Usage:
#   chmod +x setup-everything.sh
#   ./setup-everything.sh
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Server details
SSH_HOST="31.97.204.155"
SSH_PORT="65002"
SSH_USER="u384627337"
APP_DIR="~/public_html/mediaplanpro"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   MediaPlanPro - Automated Server Setup                   ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Function to print messages
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

# Check if SSH is available
if ! command -v ssh &> /dev/null; then
    print_error "SSH is not installed. Please install SSH client first."
    exit 1
fi

print_success "SSH client found"

# Prompt for password
echo ""
print_info "Server Details:"
echo "  Host: $SSH_HOST"
echo "  Port: $SSH_PORT"
echo "  User: $SSH_USER"
echo ""

read -sp "Enter your Hostinger password: " SSH_PASSWORD
echo ""
echo ""

if [ -z "$SSH_PASSWORD" ]; then
    print_error "Password cannot be empty"
    exit 1
fi

print_success "Password received"

# Test SSH connection
print_info "Testing SSH connection..."

sshpass -p "$SSH_PASSWORD" ssh -p $SSH_PORT -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST "echo 'Connection successful'" 2>/dev/null

if [ $? -eq 0 ]; then
    print_success "SSH connection successful!"
else
    # Check if sshpass is installed
    if ! command -v sshpass &> /dev/null; then
        print_warning "sshpass is not installed. Installing it will make this easier."
        print_info "On Mac: brew install hudochenkov/sshpass/sshpass"
        print_info "On Linux: sudo apt-get install sshpass"
        echo ""
        print_info "Alternatively, I'll create a script you can run manually."
        
        # Create manual setup script
        cat > setup-server-manual.sh << 'MANUAL_EOF'
#!/bin/bash

# Connect to server and run setup
ssh -p 65002 u384627337@31.97.204.155 << 'EOF'

echo "🚀 Starting server setup..."

# Navigate to home directory
cd ~

# Create application directory
echo "📁 Creating application directory..."
mkdir -p public_html/mediaplanpro
cd public_html/mediaplanpro

# Check Node.js
echo "📦 Checking Node.js..."
node --version
npm --version

# Install PM2
echo "🔧 Installing PM2..."
npm install -g pm2

# Add PM2 to PATH
export PATH=$PATH:~/.npm-global/bin
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc

# Verify PM2
pm2 --version

# Create directories
echo "📁 Creating directories..."
mkdir -p logs scripts prisma public

# Create .env file
echo "📝 Creating .env file..."
cat > .env << 'ENVEOF'
DATABASE_URL="mysql://u384627337_media:lktYh229jXil8Z9Qebdo@localhost:3306/u384627337_mediaplanpro"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s="
JWT_SECRET="B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho="
NODE_ENV="production"
ENVEOF

# Create PM2 ecosystem file
echo "⚙️  Creating PM2 configuration..."
cat > ecosystem.config.js << 'ECOEOF'
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
ECOEOF

# Set permissions
chmod 755 ~/public_html/mediaplanpro
chmod 644 .env

echo ""
echo "✅ Server setup completed!"
echo ""
echo "📋 Summary:"
echo "  Directory: ~/public_html/mediaplanpro"
echo "  Node.js: $(node --version)"
echo "  npm: $(npm --version)"
echo "  PM2: $(pm2 --version)"
echo ""
echo "⚠️  IMPORTANT: Edit .env file with your actual domain:"
echo "  nano ~/public_html/mediaplanpro/.env"
echo "  Update NEXTAUTH_URL with your domain"
echo ""

EOF
MANUAL_EOF

        chmod +x setup-server-manual.sh
        
        print_success "Created setup-server-manual.sh"
        print_info "Run this script to set up your server:"
        echo ""
        echo "  ./setup-server-manual.sh"
        echo ""
        print_info "You'll be prompted for your password when connecting."
        exit 0
    fi
    
    print_error "SSH connection failed. Please check your password and try again."
    exit 1
fi

# Run server setup
print_info "Setting up server environment..."

sshpass -p "$SSH_PASSWORD" ssh -p $SSH_PORT -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST << 'REMOTE_COMMANDS'

echo "🚀 Starting server setup..."

# Navigate to home directory
cd ~

# Create application directory
echo "📁 Creating application directory..."
mkdir -p public_html/mediaplanpro
cd public_html/mediaplanpro

# Check Node.js
echo "📦 Checking Node.js..."
NODE_VERSION=$(node --version 2>/dev/null || echo "not installed")
NPM_VERSION=$(npm --version 2>/dev/null || echo "not installed")

echo "  Node.js: $NODE_VERSION"
echo "  npm: $NPM_VERSION"

# Install PM2
echo "🔧 Installing PM2..."
npm install -g pm2 2>/dev/null || echo "PM2 installation attempted"

# Add PM2 to PATH
export PATH=$PATH:~/.npm-global/bin
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc

# Verify PM2
PM2_VERSION=$(pm2 --version 2>/dev/null || echo "not found")
echo "  PM2: $PM2_VERSION"

# Create directories
echo "📁 Creating directories..."
mkdir -p logs scripts prisma public

# Create .env file
echo "📝 Creating .env file..."
cat > .env << 'EOF'
DATABASE_URL="mysql://u384627337_media:lktYh229jXil8Z9Qebdo@localhost:3306/u384627337_mediaplanpro"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s="
JWT_SECRET="B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho="
NODE_ENV="production"
EOF

# Create PM2 ecosystem file
echo "⚙️  Creating PM2 configuration..."
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
chmod 644 .env 2>/dev/null || true

echo ""
echo "✅ Server setup completed!"
echo ""

REMOTE_COMMANDS

if [ $? -eq 0 ]; then
    print_success "Server setup completed successfully!"
else
    print_error "Server setup encountered errors"
    exit 1
fi

# Clear password from memory
unset SSH_PASSWORD

echo ""
print_success "Server is ready!"
echo ""

# Next steps
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Next Steps                                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

print_info "1. Update .env file on server with your actual domain:"
echo "   ssh -p $SSH_PORT $SSH_USER@$SSH_HOST"
echo "   nano ~/public_html/mediaplanpro/.env"
echo "   (Update NEXTAUTH_URL with your domain)"
echo ""

print_info "2. Create MySQL database in Hostinger hPanel:"
echo "   - Database: u384627337_mediaplanpro"
echo "   - User: u384627337_media"
echo "   - Password: lktYh229jXil8Z9Qebdo"
echo ""

print_info "3. Add GitHub Secrets:"
echo "   https://github.com/rythmscape11/mediaplanpro/settings/secrets/actions"
echo ""
echo "   Required secrets:"
echo "   - SSH_HOST = 31.97.204.155"
echo "   - SSH_PORT = 65002"
echo "   - SSH_USERNAME = u384627337"
echo "   - SSH_PASSWORD = [your password]"
echo "   - FTP_SERVER = [from hPanel]"
echo "   - FTP_USERNAME = [from hPanel]"
echo "   - FTP_PASSWORD = [from hPanel]"
echo "   - DATABASE_URL = mysql://u384627337_media:lktYh229jXil8Z9Qebdo@localhost:3306/u384627337_mediaplanpro"
echo "   - NEXTAUTH_URL = https://yourdomain.com"
echo "   - NEXTAUTH_SECRET = jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s="
echo "   - JWT_SECRET = B1Uguvp3zD31MgGs71emSKSJU3j7YXfRqemAie/AJho="
echo ""

print_info "4. Test deployment:"
echo "   git push origin main"
echo ""

print_success "Setup complete! Follow the steps above to finish configuration."

