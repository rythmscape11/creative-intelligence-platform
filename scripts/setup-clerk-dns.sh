#!/bin/bash

# Domain name
DOMAIN="mediaplanpro.com"

echo "Configuring Clerk DNS records for $DOMAIN on Vercel..."

# 1. Add standard records
echo "Adding standard CNAME records..."
npx vercel dns add $DOMAIN clerk CNAME frontend-api.clerk.services
npx vercel dns add $DOMAIN accounts CNAME accounts.clerk.services

# 2. Prompt for unique ID
echo ""
echo "For the next records, we need the unique Clerk Instance ID."
echo "Look at your Clerk DNS settings for the 'clkmail' record."
echo "It looks like: mail.THIS_PART_IS_THE_ID.clerk.services"
echo "Example from your screenshot: uj9cfv3m1nfe"
echo ""
read -p "Enter your Clerk Instance ID: " INSTANCE_ID

if [ -z "$INSTANCE_ID" ]; then
  echo "Error: Instance ID is required."
  exit 1
fi

# 3. Add unique records
echo "Adding unique CNAME records..."
npx vercel dns add $DOMAIN clkmail CNAME "mail.$INSTANCE_ID.clerk.services"
npx vercel dns add $DOMAIN clk._domainkey CNAME "dkim1.$INSTANCE_ID.clerk.services"
npx vercel dns add $DOMAIN clk2._domainkey CNAME "dkim2.$INSTANCE_ID.clerk.services"

echo ""
echo "✅ All DNS records added!"
echo "Please go to your Clerk Dashboard and click 'Verify configuration'."
