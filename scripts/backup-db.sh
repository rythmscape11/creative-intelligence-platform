#!/bin/bash

# MediaPlanPro - Database Backup Script
# This script creates automated backups of the MySQL database

# Configuration - UPDATE THESE VALUES
DB_USER="mediaplanpro_user"
DB_PASS="your-database-password"
DB_NAME="mediaplanpro_prod"
DB_HOST="localhost"
BACKUP_DIR="/home/username/backups"

# Create timestamp
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mediaplanpro_backup_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "🗄️  Starting database backup..."
echo "Database: $DB_NAME"
echo "Timestamp: $DATE"

# Perform backup
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_FILE

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✅ Database backup created: $BACKUP_FILE"
    
    # Compress backup
    gzip $BACKUP_FILE
    echo "✅ Backup compressed: $BACKUP_FILE.gz"
    
    # Delete backups older than 30 days
    find $BACKUP_DIR -name "mediaplanpro_backup_*.sql.gz" -mtime +30 -delete
    echo "✅ Old backups cleaned up (kept last 30 days)"
    
    # Show backup size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE.gz" | cut -f1)
    echo "📦 Backup size: $BACKUP_SIZE"
    
    echo "🎉 Backup completed successfully!"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Optional: Upload to remote storage
# Uncomment and configure if you want to upload to S3, Dropbox, etc.

# Example: Upload to S3
# aws s3 cp "$BACKUP_FILE.gz" s3://your-bucket/backups/

# Example: Upload via SCP to remote server
# scp "$BACKUP_FILE.gz" user@backup-server:/backups/mediaplanpro/

echo ""
echo "Backup location: $BACKUP_FILE.gz"

