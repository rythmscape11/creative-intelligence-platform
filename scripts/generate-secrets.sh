#!/bin/bash

# Generate Production Secrets for MediaPlanPro
# Run this script to generate secure random secrets for production

echo "=== MediaPlanPro Production Secrets Generator ==="
echo ""
echo "IMPORTANT: Save these secrets securely and add them to your .env.production file"
echo ""

echo "NEXTAUTH_SECRET (copy this to .env.production):"
openssl rand -base64 32
echo ""

echo "JWT_SECRET (copy this to .env.production):"
openssl rand -base64 32
echo ""

echo "DATABASE_PASSWORD (use this when creating MySQL user):"
openssl rand -base64 24 | tr -d "=+/" | cut -c1-20
echo ""

echo "=== IMPORTANT NOTES ==="
echo "1. NEVER commit these secrets to Git"
echo "2. Store them in a secure password manager"
echo "3. Use different secrets for each environment (dev, staging, production)"
echo "4. Rotate secrets periodically for security"
echo ""

