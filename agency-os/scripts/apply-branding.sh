#!/bin/bash
# Apply Aureon One branding to Plane source
# Run from agency-os directory

set -e

PLANE_DIR="./plane"
BRANDING_DIR="./branding"

echo "🎨 Applying Aureon One branding to Plane..."

# Check if Plane directory exists
if [ ! -d "$PLANE_DIR" ]; then
    echo "❌ Plane directory not found. Run: git clone https://github.com/makeplane/plane.git"
    exit 1
fi

# Copy custom favicon
echo "📁 Copying favicon..."
if [ -f "$BRANDING_DIR/favicon.ico" ]; then
    cp "$BRANDING_DIR/favicon.ico" "$PLANE_DIR/web/public/favicon/"
fi

# Copy logo
echo "📁 Copying logo..."
if [ -f "$BRANDING_DIR/logo.svg" ]; then
    cp "$BRANDING_DIR/logo.svg" "$PLANE_DIR/web/public/plane-logos/"
fi

# Apply CSS overrides
echo "🎨 Applying CSS overrides..."
if [ -f "$BRANDING_DIR/custom-styles.css" ]; then
    cat "$BRANDING_DIR/custom-styles.css" >> "$PLANE_DIR/web/styles/globals.css"
fi

# Update app name in constants
echo "📝 Updating app constants..."
if [ -f "$PLANE_DIR/web/constants/seo-variables.ts" ]; then
    sed -i '' 's/Plane/Agency OS/g' "$PLANE_DIR/web/constants/seo-variables.ts"
fi

# Update page titles
if [ -f "$PLANE_DIR/web/app/layout.tsx" ]; then
    sed -i '' 's/Plane/Agency OS/g' "$PLANE_DIR/web/app/layout.tsx"
fi

echo ""
echo "✅ Branding applied!"
echo ""
echo "Next steps:"
echo "1. Add logo.svg to branding/ folder"
echo "2. Add favicon.ico to branding/ folder"
echo "3. Run: cd plane && npm run build"
