#!/bin/bash

# Football Guess Who Health Check Script
# This script checks the health status of all application components

echo "Running Football Guess Who health checks..."
echo "------------------------------------"

# Check if frontend is up
echo "Checking frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://who.gair.com.au/health || echo "failed")
if [ "$FRONTEND_STATUS" == "200" ]; then
  echo "✅ Frontend is up (HTTP $FRONTEND_STATUS)"
else
  echo "❌ Frontend check failed with HTTP status $FRONTEND_STATUS"
fi

# Check if backend API is up
echo "Checking backend API..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://who.gair.com.au/api/health || echo "failed")
if [ "$API_STATUS" == "200" ]; then
  echo "✅ Backend API is up (HTTP $API_STATUS)"
else
  echo "❌ Backend API check failed with HTTP status $API_STATUS"
fi

# Check Docker services
echo "Checking Docker services..."
docker ps --format "{{.Names}}" | grep footballer | while read container_name; do
  CONTAINER_STATUS=$(docker inspect --format='{{.State.Status}}' $container_name)
  if [ "$CONTAINER_STATUS" == "running" ]; then
    echo "✅ $container_name is $CONTAINER_STATUS"
  else
    echo "❌ $container_name is $CONTAINER_STATUS"
  fi
done

# Check database connection
echo "Checking database connection..."
DB_CHECK=$(docker exec footballer-db pg_isready -U postgres 2>&1)
if [[ $DB_CHECK == *"accepting connections"* ]]; then
  echo "✅ Database connection successful"
else
  echo "❌ Database connection failed"
fi

# Check Redis connection
echo "Checking Redis connection..."
REDIS_CHECK=$(docker exec footballer-redis redis-cli ping 2>&1)
if [[ $REDIS_CHECK == "PONG" ]]; then
  echo "✅ Redis connection successful"
else
  echo "❌ Redis connection failed"
fi

# Check disk space
echo "Checking disk space..."
DISK_USAGE=$(df -h / | awk '{print $5}' | tail -n 1 | sed 's/%//')
if [ "$DISK_USAGE" -lt 90 ]; then
  echo "✅ Disk usage is acceptable: $DISK_USAGE%"
else
  echo "❌ Disk space critical: $DISK_USAGE%"
fi

# Check memory usage
echo "Checking memory usage..."
MEMORY_USAGE=$(free | grep Mem | awk '{print $3/$2 * 100.0}' | cut -d. -f1)
if [ "$MEMORY_USAGE" -lt 90 ]; then
  echo "✅ Memory usage is acceptable: $MEMORY_USAGE%"
else
  echo "❌ Memory usage critical: $MEMORY_USAGE%"
fi

# Check for recently encountered errors
echo "Checking logs for errors..."
ERROR_COUNT=$(docker logs --since 1h footballer-backend 2>&1 | grep -i "error" | wc -l)
if [ "$ERROR_COUNT" -lt 5 ]; then
  echo "✅ Error count is acceptable: $ERROR_COUNT errors in the last hour"
else
  echo "❌ High error count: $ERROR_COUNT errors in the last hour"
fi

echo "------------------------------------"
echo "Health check completed at $(date)" 