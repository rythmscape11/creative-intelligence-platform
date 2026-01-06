#!/bin/bash
# URL
BASE_URL="https://www.mediaplanpro.com"

# 1. Get CSRF token and cookies
echo "Fetching CSRF token..."
curl -s -c cookies.txt -b cookies.txt "$BASE_URL/api/auth/csrf" > csrf.json
cat csrf.json

# Extract token (simple grep/cut)
TOKEN=$(cat csrf.json | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo "Failed to get CSRF token"
  exit 1
fi

# 2. Attempt Login
echo "Attempting login..."
curl -v -c cookies.txt -b cookies.txt \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "csrfToken=$TOKEN&email=user@mediaplanpro.com&password=demo123&json=true" \
  "$BASE_URL/api/auth/callback/credentials"

echo "Done."
