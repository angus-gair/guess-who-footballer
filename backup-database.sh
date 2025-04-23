#!/bin/bash

# Football Guess Who Database Backup Script
# This script creates daily backups of the database and manages retention

# Load environment variables
source .env

# Set variables
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/guess-who-footballer/backups"
BACKUP_FILE="football_guess_who_${TIMESTAMP}.sql"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create the backup
echo "Creating database backup: $BACKUP_FILE"
docker exec footballer-db pg_dump -U postgres football_guess_who > "$BACKUP_DIR/$BACKUP_FILE"

# Compress the backup
echo "Compressing backup file..."
gzip "$BACKUP_DIR/$BACKUP_FILE"

# Create checksum for verification
echo "Creating checksum file..."
sha256sum "$BACKUP_DIR/$BACKUP_FILE.gz" > "$BACKUP_DIR/$BACKUP_FILE.gz.sha256"

# Set proper permissions
chmod 600 "$BACKUP_DIR/$BACKUP_FILE.gz"
chmod 600 "$BACKUP_DIR/$BACKUP_FILE.gz.sha256"

# Clean up old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find $BACKUP_DIR -name "football_guess_who_*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "football_guess_who_*.sql.gz.sha256" -mtime +$RETENTION_DAYS -delete

# Verify backup was created successfully
if [ -f "$BACKUP_DIR/$BACKUP_FILE.gz" ]; then
    echo "Backup created successfully: $BACKUP_FILE.gz ($(du -h "$BACKUP_DIR/$BACKUP_FILE.gz" | cut -f1))"
    
    # Upload to remote storage if configured
    if [ ! -z "$S3_BUCKET" ]; then
        echo "Uploading backup to S3 bucket: $S3_BUCKET"
        aws s3 cp "$BACKUP_DIR/$BACKUP_FILE.gz" "s3://$S3_BUCKET/football-guess-who-backups/"
        aws s3 cp "$BACKUP_DIR/$BACKUP_FILE.gz.sha256" "s3://$S3_BUCKET/football-guess-who-backups/"
    fi
else
    echo "Error: Backup creation failed!"
    exit 1
fi

echo "Backup process completed at $(date)" 