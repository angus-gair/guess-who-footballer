#!/bin/bash

# Football Guess Who Database Restore Script
# This script restores a database from backup

# Check if a backup file is specified
if [ -z "$1" ]; then
    echo "Error: No backup file specified"
    echo "Usage: $0 <backup-file>"
    echo "Example: $0 football_guess_who_20230807_120000.sql.gz"
    exit 1
fi

# Set variables
BACKUP_FILE="$1"
BACKUP_DIR="/root/guess-who-footballer/backups"
FULL_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

# Check if backup file exists
if [ ! -f "$FULL_PATH" ]; then
    echo "Error: Backup file not found: $FULL_PATH"
    echo "Available backups:"
    ls -lh $BACKUP_DIR | grep "football_guess_who_"
    exit 1
fi

# Verify backup integrity if it has a checksum
if [ -f "${FULL_PATH}.sha256" ]; then
    echo "Verifying backup integrity..."
    CHECKSUM_RESULT=$(sha256sum -c "${FULL_PATH}.sha256" 2>&1)
    
    if [[ $CHECKSUM_RESULT == *"OK"* ]]; then
        echo "✅ Backup integrity verified"
    else
        echo "❌ Backup integrity check failed! The backup file may be corrupted."
        echo "Do you want to continue anyway? (y/N)"
        read -r CONTINUE
        if [[ ! "$CONTINUE" =~ ^[Yy]$ ]]; then
            echo "Restore aborted."
            exit 1
        fi
    fi
fi

# Confirm restoration
echo "WARNING: This will OVERWRITE the current database with the backup."
echo "Database: football_guess_who"
echo "Backup file: $BACKUP_FILE"
echo "Are you sure you want to continue? (y/N)"
read -r CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Restore aborted."
    exit 1
fi

# Extract backup if compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Extracting compressed backup..."
    EXTRACTED_FILE="${BACKUP_FILE%.gz}"
    gunzip -c "$FULL_PATH" > "${BACKUP_DIR}/${EXTRACTED_FILE}"
    RESTORE_FILE="${BACKUP_DIR}/${EXTRACTED_FILE}"
else
    RESTORE_FILE="$FULL_PATH"
fi

echo "Starting database restore..."

# Stop backend service temporarily
echo "Stopping backend service..."
docker compose -f docker-compose.production.yml stop backend

# Restore database
echo "Restoring from backup..."
cat "$RESTORE_FILE" | docker exec -i footballer-db psql -U postgres football_guess_who

# Restart backend service
echo "Starting backend service..."
docker compose -f docker-compose.production.yml start backend

# Clean up extracted file
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Cleaning up..."
    rm -f "${BACKUP_DIR}/${EXTRACTED_FILE}"
fi

echo "Database restore completed at $(date)"
echo "Please verify application functionality!" 