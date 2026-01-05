#!/bin/bash
# =============================================================
# AureonOne VPS Setup Script for Hostinger
# Server: 72.61.249.51
# =============================================================

set -e

echo "================================================"
echo "🚀 AureonOne VPS Setup Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: System Update
echo -e "${YELLOW}[1/6] Updating system packages...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✓ System updated${NC}"

# Step 2: Install essential tools
echo -e "${YELLOW}[2/6] Installing essential tools...${NC}"
apt install -y curl wget git ufw fail2ban htop

# Step 3: Configure Firewall
echo -e "${YELLOW}[3/6] Configuring firewall...${NC}"
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8000/tcp  # Coolify dashboard
ufw --force enable
echo -e "${GREEN}✓ Firewall configured${NC}"

# Step 4: Install Docker
echo -e "${YELLOW}[4/6] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# Verify Docker
docker --version

# Step 5: Install Coolify
echo -e "${YELLOW}[5/6] Installing Coolify...${NC}"
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash

# Step 6: Display completion info
echo ""
echo "================================================"
echo -e "${GREEN}🎉 SETUP COMPLETE!${NC}"
echo "================================================"
echo ""
echo "Your server is ready for deployment!"
echo ""
echo "Next Steps:"
echo "================================================"
echo ""
echo "1. Open Coolify Dashboard:"
echo -e "   ${YELLOW}http://72.61.249.51:8000${NC}"
echo ""
echo "2. Create your admin account"
echo ""
echo "3. Connect GitHub:"
echo "   - Go to Sources → Add GitHub"
echo "   - Authorize access to rythmscape11/mediaplanpro"
echo ""
echo "4. Create Project & Deploy:"
echo "   - New Project → Add Resource"
echo "   - Select your repo"
echo "   - Add environment variables"
echo "   - Click Deploy!"
echo ""
echo "================================================"
echo "Environment Variables to Add in Coolify:"
echo "================================================"
echo ""
echo "DATABASE_URL=<your-neon-connection-string>"
echo "CLERK_SECRET_KEY=<your-clerk-secret>"
echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>"
echo "RAZORPAY_KEY_ID=<your-razorpay-key>"
echo "RAZORPAY_KEY_SECRET=<your-razorpay-secret>"
echo "RESEND_API_KEY=<your-resend-key>"
echo "NEXT_PUBLIC_APP_URL=https://aureonone.in"
echo ""
echo "================================================"
echo ""
echo "For domain setup (aureonone.in):"
echo "Point your domain's A record to: 72.61.249.51"
echo ""
echo "Coolify will auto-generate SSL certificates!"
echo ""
echo -e "${GREEN}Happy deploying! 🚀${NC}"
