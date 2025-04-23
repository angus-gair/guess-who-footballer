#!/bin/bash

# Football Guess Who - Application Metrics Monitoring Script

echo "Football Guess Who - Metrics Monitoring"
echo "======================================="
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/root/guess-who-footballer/production/logs/metrics-$TIMESTAMP.log"

# Create log directory if it doesn't exist
mkdir -p /root/guess-who-footballer/production/logs

# Function to log messages
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a $LOG_FILE
}

log "Starting metrics collection..."

# Create metrics storage directory if it doesn't exist
mkdir -p /root/guess-who-footballer/production/metrics

# System metrics
log "Collecting system metrics..."
echo "=== System Metrics ===" > /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt
echo "Date: $(date)" >> /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt
echo "" >> /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt

echo "CPU Usage:" >> /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt
top -bn1 | grep "Cpu(s)" >> /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt
echo "" >> /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt

echo "Memory Usage:" >> /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt
free -h >> /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt
echo "" >> /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt

echo "Disk Usage:" >> /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt
df -h >> /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt
echo "" >> /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt

# Docker container metrics
log "Collecting Docker container metrics..."
echo "=== Docker Container Metrics ===" > /root/guess-who-footballer/production/metrics/containers-$TIMESTAMP.txt
echo "Date: $(date)" >> /root/guess-who-footballer/production/metrics/containers-$TIMESTAMP.txt
echo "" >> /root/guess-who-footballer/production/metrics/containers-$TIMESTAMP.txt

docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}\t{{.PIDs}}" >> /root/guess-who-footballer/production/metrics/containers-$TIMESTAMP.txt

# Application-specific metrics
log "Collecting application-specific metrics..."
echo "=== Application Metrics ===" > /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
echo "Date: $(date)" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
echo "" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt

# Database metrics
echo "Database Metrics:" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
if docker ps | grep -q "footballer-db"; then
    # Active connections
    echo "- Active connections:" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    docker exec footballer-db psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;" football_guess_who >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    
    # Database size
    echo "- Database size:" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    docker exec footballer-db psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('football_guess_who'));" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    
    # Table counts
    echo "- Table row counts:" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    docker exec footballer-db psql -U postgres -c "SELECT schemaname, relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC;" football_guess_who >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
else
    echo "Database container not running." >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
fi
echo "" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt

# Redis metrics
echo "Redis Metrics:" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
if docker ps | grep -q "footballer-redis"; then
    # Redis info
    echo "- Redis info:" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    docker exec footballer-redis redis-cli info | grep -E 'used_memory_human|connected_clients|connected_slaves|keyspace' >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    
    # Redis key count by pattern
    echo "- Session keys:" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    docker exec footballer-redis redis-cli --scan --pattern "session:*" | wc -l >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    
    echo "- Game state keys:" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    docker exec footballer-redis redis-cli --scan --pattern "game:*" | wc -l >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
else
    echo "Redis container not running." >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
fi
echo "" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt

# Backend API metrics (if exposing metrics)
echo "Backend API Metrics:" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
if curl -s -f -o /dev/null https://who.gair.com.au/api/health; then
    # Get API metrics if health endpoint is working
    API_METRICS=$(curl -s https://who.gair.com.au/api/metrics 2>/dev/null)
    if [ $? -eq 0 ] && [ ! -z "$API_METRICS" ]; then
        echo "$API_METRICS" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    else
        echo "- API is healthy but metrics endpoint not available." >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    fi
else
    echo "Backend API not responding." >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
fi
echo "" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt

# Business metrics - check for active games
echo "Game Metrics:" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
if docker ps | grep -q "footballer-backend"; then
    # Use grep to count matches in the logs as an approximation
    echo "- Games started today (estimated):" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    docker logs --since 24h footballer-backend 2>&1 | grep -c "Game created" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    
    echo "- Multiplayer games today (estimated):" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    docker logs --since 24h footballer-backend 2>&1 | grep -c "Player joined game" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    
    echo "- Games won today (estimated):" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
    docker logs --since 24h footballer-backend 2>&1 | grep -c "Game won" >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
else
    echo "Backend container not running." >> /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt
fi

# Combine all metrics into a single report
log "Creating combined metrics report..."
cat /root/guess-who-footballer/production/metrics/system-$TIMESTAMP.txt > /root/guess-who-footballer/production/metrics/report-$TIMESTAMP.txt
echo "" >> /root/guess-who-footballer/production/metrics/report-$TIMESTAMP.txt
cat /root/guess-who-footballer/production/metrics/containers-$TIMESTAMP.txt >> /root/guess-who-footballer/production/metrics/report-$TIMESTAMP.txt
echo "" >> /root/guess-who-footballer/production/metrics/report-$TIMESTAMP.txt
cat /root/guess-who-footballer/production/metrics/application-$TIMESTAMP.txt >> /root/guess-who-footballer/production/metrics/report-$TIMESTAMP.txt

# Clean up old metrics (keep the last 30 days)
find /root/guess-who-footballer/production/metrics -name "*.txt" -type f -mtime +30 -delete

log "Metrics collection completed at $(date)"
log "======================================="

echo ""
echo "Metrics Collection Summary:"
echo "--------------------------"
echo "Timestamp: $(date)"
echo "Log file: $LOG_FILE"
echo "Metrics report: /root/guess-who-footballer/production/metrics/report-$TIMESTAMP.txt"
echo "--------------------------"
echo "Metrics have been collected and stored in the metrics directory."
echo "To view the full report, run: cat /root/guess-who-footballer/production/metrics/report-$TIMESTAMP.txt" 