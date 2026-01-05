#!/bin/bash

# MediaPlanPro - Database Optimization Script
# This script optimizes and analyzes MySQL tables for better performance

# Configuration - UPDATE THESE VALUES
DB_USER="mediaplanpro_user"
DB_PASS="your-database-password"
DB_NAME="mediaplanpro_prod"
DB_HOST="localhost"

echo "⚡ Starting database optimization..."
echo "Database: $DB_NAME"
echo ""

# Optimize tables
echo "🔧 Optimizing tables..."
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME << EOF
OPTIMIZE TABLE users;
OPTIMIZE TABLE blog_posts;
OPTIMIZE TABLE categories;
OPTIMIZE TABLE tags;
OPTIMIZE TABLE marketing_strategies;
OPTIMIZE TABLE sessions;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Tables optimized"
else
    echo "❌ Optimization failed"
    exit 1
fi

echo ""

# Analyze tables
echo "📊 Analyzing tables..."
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME << EOF
ANALYZE TABLE users;
ANALYZE TABLE blog_posts;
ANALYZE TABLE categories;
ANALYZE TABLE tags;
ANALYZE TABLE marketing_strategies;
ANALYZE TABLE sessions;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Tables analyzed"
else
    echo "❌ Analysis failed"
    exit 1
fi

echo ""

# Show table sizes
echo "📦 Table sizes:"
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME << EOF
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = '$DB_NAME'
ORDER BY (data_length + index_length) DESC;
EOF

echo ""
echo "🎉 Database optimization completed successfully!"

