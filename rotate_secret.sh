#!/bin/bash
# Read secret
SECRET=$(cat secret.txt)

echo "Updating NEXTAUTH_SECRET..."

# Remove old
npx vercel env rm NEXTAUTH_SECRET production -y || true

# Add new
printf "$SECRET" | npx vercel env add NEXTAUTH_SECRET production

echo "Secret updated."
rm secret.txt
