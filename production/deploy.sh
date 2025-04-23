#!/bin/bash

# Production deployment script for Football Guess Who

echo "Starting deployment process for Football Guess Who..."
echo "=================================================="
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/root/guess-who-footballer/production/logs/deployment-$TIMESTAMP.log"

# Create log directory if it doesn't exist
mkdir -p /root/guess-who-footballer/production/logs

# Function to log messages
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a $LOG_FILE
}

# Check for existing services
log "Checking for existing services..."
EXISTING_SERVICES=$(docker ps --filter "name=football-guess-who" --format "{{.Names}}")
if [ ! -z "$EXISTING_SERVICES" ]; then
    log "Found existing services:"
    log "$EXISTING_SERVICES"
    log "Stopping existing services..."
    docker stop $(docker ps --filter "name=football-guess-who" -q)
fi

# Backup database if it exists
BACKUP_BEFORE_DEPLOY=true
if $BACKUP_BEFORE_DEPLOY; then
    log "Creating pre-deployment database backup..."
    ./backup-database.sh
    if [ $? -ne 0 ]; then
        log "WARNING: Database backup failed, but continuing with deployment."
    else
        log "Pre-deployment database backup completed successfully."
    fi
fi

# Pull latest code if in a git repo
if [ -d ".git" ]; then
    log "Pulling latest code..."
    git pull
    if [ $? -ne 0 ]; then
        log "ERROR: Failed to pull latest code."
        exit 1
    fi
fi

# Make sure scripts are executable
log "Setting permissions on scripts..."
chmod +x health-check.sh backup-database.sh restore-database.sh

# Ensure we have an .env file
if [ ! -f ".env" ]; then
    log "ERROR: .env file not found. Deployment cannot continue."
    exit 1
fi

# Ensure necessary directories exist
log "Creating necessary directories..."
mkdir -p config/nginx/conf.d
mkdir -p config/nginx/certificates
mkdir -p backups

# Pull latest Docker images
log "Pulling latest Docker images..."
docker compose -f docker-compose.production.yml pull
if [ $? -ne 0 ]; then
    log "WARNING: Failed to pull some images, but continuing with local images."
fi

# Start the application
log "Starting the application with Docker Compose..."
docker compose -f docker-compose.production.yml up -d
if [ $? -ne 0 ]; then
    log "ERROR: Failed to start application containers."
    exit 1
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
else
    log "Health check passed successfully."
fi

# Setup cron jobs
log "Setting up cron jobs..."
./production/setup-cron-jobs.sh >> $LOG_FILE 2>&1
if [ $? -ne 0 ]; then
    log "WARNING: Failed to set up cron jobs."
fi

log "Deployment completed at $(date)"
log "=================================================="

# Print deployment summary
echo ""
echo "Deployment Summary:"
echo "------------------"
echo "Timestamp: $(date)"
echo "Log file: $LOG_FILE"
docker compose -f docker-compose.production.yml ps
echo "------------------"
echo "Deployment complete! Application should be accessible at https://who.gair.com.au" 