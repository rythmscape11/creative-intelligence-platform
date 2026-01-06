#!/bin/bash

###############################################################################
# MediaPlanPro - Automated Server Setup
# This will set up your Hostinger server automatically
###############################################################################

set -e

# Server credentials
SSH_HOST="31.97.204.155"
SSH_PORT="65002"
SSH_USER="u384627337"
SSH_PASSWORD="jMyunSu06qylbgIK9qG7QX6wpzayPkNJl9iFk+vtE+s="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Setting up Hostinger server...${NC}"
echo ""

# Create the setup commands
cat > /tmp/server-setup-commands.sh << 'SETUP_SCRIPT'
#!/bin/bash

echo "🚀 Starting server setup..."

# Navigate to home
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
npm install -g pm2 2>&1 | tail -5

# Add PM2 to PATH
export PATH=$PATH:~/.npm-global/bin
echo 'export PATH=$PATH:~/.npm-global/bin' >> ~/.bashrc

# Verify PM2
echo "✅ PM2 installed:"
pm2 --version 2>/dev/null || echo "PM2 will be available after PATH update"

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
echo "📋 Summary:"
echo "  Directory: ~/public_html/mediaplanpro"
echo "  Node.js: $(node --version)"
echo "  npm: $(npm --version)"
echo ""

SETUP_SCRIPT

# Upload and execute the script
echo -e "${BLUE}📤 Connecting to server and running setup...${NC}"

# Use expect to handle SSH password
expect << EOF
set timeout 120
spawn ssh -p $SSH_PORT -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST "bash -s" < /tmp/server-setup-commands.sh
expect {
    "password:" {
        send "$SSH_PASSWORD\r"
        exp_continue
    }
    eof
}
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Server setup completed successfully!${NC}"
    echo ""
else
    echo ""
    echo -e "${YELLOW}⚠️  Setup may have completed with warnings${NC}"
    echo ""
fi

# Clean up
rm -f /tmp/server-setup-commands.sh

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Server Setup Complete!                                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "✅ Server is configured and ready"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create MySQL Database in Hostinger hPanel:"
echo "   https://hpanel.hostinger.com"
echo "   - Database: u384627337_mediaplanpro"
echo "   - User: u384627337_media"
echo "   - Password: lktYh229jXil8Z9Qebdo"
echo ""
echo "2. Add GitHub Secrets:"
echo "   https://github.com/rythmscape11/mediaplanpro/settings/secrets/actions"
echo ""
echo "3. Test deployment:"
echo "   git push origin main"
echo ""

