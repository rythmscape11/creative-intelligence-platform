#!/bin/bash

# Safely push Stripe environment variables to Vercel without committing secrets
# Requires the following variables to be exported in your shell before running:
#   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
#   STRIPE_SECRET_KEY
#   STRIPE_WEBHOOK_SECRET
#   NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID
#   NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID
#   NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID
#   NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID

set -euo pipefail

ENVIRONMENTS=(production preview development)
VARS=(
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  STRIPE_SECRET_KEY
  STRIPE_WEBHOOK_SECRET
  NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID
  NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID
  NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID
  NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID
)

# Ensure the Vercel CLI is available and authenticated before attempting to push secrets
if ! command -v npx >/dev/null 2>&1; then
  echo "❌ npx is required to run the Vercel CLI. Please install Node.js before continuing." >&2
  exit 1
fi

if ! npx --yes vercel whoami >/dev/null 2>&1; then
  echo "❌ Not logged in to Vercel. Run 'npx vercel login' first so the CLI can push environment variables." >&2
  exit 1
fi

missing=0
for var in "${VARS[@]}"; do
  value=${!var-}
  if [[ -z "${value}" ]]; then
    echo "❌ Missing required environment variable: ${var}" >&2
    missing=1
  fi
done

if [[ ${missing} -eq 1 ]]; then
  echo "Aborting. Please export all required variables before running this script." >&2
  exit 1
fi

echo "🚀 Adding Stripe environment variables to Vercel via CLI..."

for env in "${ENVIRONMENTS[@]}"; do
  echo "\n➡️  Target environment: ${env}"
  for var in "${VARS[@]}"; do
    echo "   • Adding ${var}"
    printf "%s\n" "${!var}" | npx vercel env add "${var}" "${env}" --force >/dev/null
  done
  echo "   ✅ Finished ${env}"
done

echo "\n✅ All Stripe environment variables added. If prompted, ensure you're logged in with 'npx vercel login'."
