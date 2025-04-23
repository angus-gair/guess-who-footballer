#!/bin/bash

# Security audit script for Football Guess Who
echo "Football Guess Who - Security Audit"
echo "=================================="

# Check Docker container security
echo "Checking Docker container security..."
docker compose -f docker-compose.production.yml ps -q | xargs docker inspect --format='{{.Name}} - {{.HostConfig.SecurityOpt}}' | grep -v "null"

# Check open ports
echo "Checking open ports..."
ss -tuln | grep -E ":80|:443|:3000|:5432|:6379"

# Check file permissions
echo "Checking sensitive file permissions..."
find /root/guess-who-footballer -name "*.env*" -o -name "*.pem" -o -name "*.key" -o -name "*.crt" | xargs ls -la

# Check for latest Docker images
echo "Checking Docker image versions..."
docker images | grep -E 'footballer|nginx|postgres|redis'

# Check SSL certificate expiration
echo "Checking SSL certificate expiration..."
find /root/guess-who-footballer/config/nginx/certificates -name "*.crt" -o -name "*.pem" | xargs -I{} sh -c 'echo "Checking {}:"; openssl x509 -in {} -noout -dates'

echo "Security audit completed."
