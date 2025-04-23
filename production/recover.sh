#!/bin/bash

# Disaster recovery script for Football Guess Who

echo "Football Guess Who - Disaster Recovery"
echo "====================================="
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/root/guess-who-footballer/production/logs/recovery-$TIMESTAMP.log"

# Create log directory if it doesn't exist
mkdir -p /root/guess-who-footballer/production/logs

# Function to log messages
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a $LOG_FILE
}

# Check for available backups
log "Checking for available database backups..."
BACKUP_DIR="/root/guess-who-footballer/backups"
BACKUPS=$(ls -t $BACKUP_DIR/*.sql.gz 2>/dev/null)

if [ -z "$BACKUPS" ]; then
    log "ERROR: No database backups found in $BACKUP_DIR"
    echo "No database backups found. Recovery cannot proceed."
    exit 1
fi

# Display available backups
echo "Available backups:"
echo "-----------------"
ls -lth $BACKUP_DIR/*.sql.gz 2>/dev/null | head -10 | awk '{print NR") " $9 " (" $5 ") - " $6 " " $7 " " $8}'
echo "-----------------"

# Ask user which backup to restore
read -p "Enter the number of the backup to restore (or 'latest' for most recent): " BACKUP_CHOICE

if [ "$BACKUP_CHOICE" == "latest" ]; then
    BACKUP_FILE=$(ls -t $BACKUP_DIR/*.sql.gz | head -1)
    log "Using latest backup: $BACKUP_FILE"
else
    BACKUP_FILE=$(ls -t $BACKUP_DIR/*.sql.gz | sed "${BACKUP_CHOICE}q;d")
    if [ -z "$BACKUP_FILE" ]; then
        log "ERROR: Invalid backup selection."
        echo "Invalid selection. Recovery aborted."
        exit 1
    fi
    log "Selected backup: $BACKUP_FILE"
fi

# Stop existing services
log "Stopping existing services..."
docker compose -f docker-compose.production.yml down
if [ $? -ne 0 ]; then
    log "WARNING: Failed to stop some services. Will attempt to continue."
fi

# Start just the database
log "Starting database container..."
docker compose -f docker-compose.production.yml up -d db
if [ $? -ne 0 ]; then
    log "ERROR: Failed to start database container."
    echo "Failed to start database container. Recovery aborted."
    exit 1
fi

# Wait for database to be ready
log "Waiting for database to be ready..."
sleep 15

# Check if database is ready
RETRY=0
MAX_RETRY=10
while [ $RETRY -lt $MAX_RETRY ]; do
    if docker exec footballer-db pg_isready -U postgres; then
        log "Database is ready."
        break
    else
        RETRY=$((RETRY+1))
        log "Database not ready, waiting... ($RETRY/$MAX_RETRY)"
        sleep 5
    fi
done

if [ $RETRY -eq $MAX_RETRY ]; then
    log "ERROR: Database failed to become ready after multiple attempts."
    echo "Database failed to become ready. Recovery aborted."
    exit 1
fi

# Restore the database
log "Restoring database from backup: $BACKUP_FILE"
echo "Restoring database from: $(basename $BACKUP_FILE)"
echo "This may take several minutes depending on the size of the backup..."

gunzip -c $BACKUP_FILE | docker exec -i footballer-db psql -U postgres football_guess_who
if [ $? -ne 0 ]; then
    log "ERROR: Database restoration failed."
    echo "Database restoration failed. See log for details: $LOG_FILE"
    exit 1
else
    log "Database successfully restored."
fi

# Start the application
log "Starting the application..."
docker compose -f docker-compose.production.yml up -d
if [ $? -ne 0 ]; then
    log "ERROR: Failed to start application containers."
    echo "Failed to start application containers. See log for details: $LOG_FILE"
    exit 1
else
    log "Application started successfully."
fi

# Wait for services to stabilize
log "Waiting for services to stabilize (30 seconds)..."
sleep 30

# Run health check
log "Running health checks..."
./health-check.sh >> $LOG_FILE 2>&1
HEALTH_CHECK_EXIT=$?
if [ $HEALTH_CHECK_EXIT -ne 0 ]; then
    log "WARNING: Health check reported issues. Check the log for details."
    echo "Health check reported issues. See log for details: $LOG_FILE"
else
    log "Health check passed successfully."
    echo "Health check passed. Recovery appears successful."
fi

log "Recovery completed at $(date)"
log "=================================================="

echo ""
echo "Recovery Summary:"
echo "------------------"
echo "Timestamp: $(date)"
echo "Backup used: $(basename $BACKUP_FILE)"
echo "Log file: $LOG_FILE"
docker compose -f docker-compose.production.yml ps
echo "------------------"
echo "Recovery complete! Application should be accessible at https://who.gair.com.au" 