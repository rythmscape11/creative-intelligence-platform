#!/bin/bash

# Script to replace console.log/error/warn with logger service
# This is a helper script for the QA audit security fixes

echo "🔍 Finding all console.log/error/warn statements..."

# Find all TypeScript/TSX files with console statements
FILES=$(grep -rl "console\.\(log\|error\|warn\)" src --include="*.ts" --include="*.tsx" | grep -v "logger-service.ts")

echo "📝 Found console statements in the following files:"
echo "$FILES"

echo ""
echo "⚠️  Manual replacement required for each file to ensure correct context"
echo "   Use the logger service: import { logger } from '@/lib/services/logger-service';"
echo ""
echo "   Replace patterns:"
echo "   - console.log(...) → logger.info(...)"
echo "   - console.error(...) → logger.error(...)"
echo "   - console.warn(...) → logger.warn(...)"
echo "   - console.debug(...) → logger.debug(...)"
echo ""
echo "📊 Total files to fix: $(echo "$FILES" | wc -l)"

