#!/bin/bash

# Security hardening script for Football Guess Who production environment

echo "Football Guess Who - Security Hardening"
echo "======================================"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/root/guess-who-footballer/production/logs/security-$TIMESTAMP.log"

# Create log directory if it doesn't exist
mkdir -p /root/guess-who-footballer/production/logs

# Function to log messages
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a $LOG_FILE
}

log "Starting security hardening process..."

# Check if we're running as root
if [ "$EUID" -ne 0 ]; then
    log "ERROR: This script must be run as root."
    exit 1
fi

# 1. Docker security hardening
log "Applying Docker security best practices..."

# Verify Docker daemon configuration
if [ ! -f "/etc/docker/daemon.json" ]; then
    log "Creating Docker daemon configuration..."
    cat > /etc/docker/daemon.json << EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "icc": false,
  "no-new-privileges": true,
  "userns-remap": "default"
}
EOF
    log "Docker daemon configuration created. Restart Docker service to apply."
else
    log "Docker daemon.json already exists. Please review it manually."
fi

# 2. Application security
log "Hardening application security..."

# Check for .env file permissions
if [ -f "/root/guess-who-footballer/.env" ]; then
    log "Setting secure permissions on .env file..."
    chmod 600 /root/guess-who-footballer/.env
fi

# 3. Docker Compose configuration
log "Applying security settings to Docker Compose configuration..."

# Create a security-focused override file
log "Creating Docker Compose security override file..."
cat > /root/guess-who-footballer/docker-compose.security.yml << EOF
version: '3.8'

services:
  frontend:
    security_opt:
      - no-new-privileges:true
    read_only: true
    volumes:
      - /tmp
    healthcheck:
      retries: 5

  backend:
    security_opt:
      - no-new-privileges:true
    read_only: true
    volumes:
      - /tmp
    healthcheck:
      retries: 5

  db:
    security_opt:
      - no-new-privileges:true
    volumes:
      - postgres-data:/var/lib/postgresql/data:Z
    healthcheck:
      retries: 3

  redis:
    security_opt:
      - no-new-privileges:true
    read_only: true
    volumes:
      - redis-data:/data:Z
      - /tmp
    healthcheck:
      retries: 3
EOF

log "Docker Compose security override file created."
log "To use it, run: docker compose -f docker-compose.production.yml -f docker-compose.security.yml up -d"

# 4. SSL/TLS configuration for Nginx
log "Creating secure TLS configuration for Nginx..."

mkdir -p /root/guess-who-footballer/config/nginx/conf.d

# Create a strong TLS configuration
cat > /root/guess-who-footballer/config/nginx/conf.d/ssl.conf << EOF
# Security-focused SSL/TLS configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
add_header X-Frame-Options SAMEORIGIN;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' wss:; frame-ancestors 'self'; form-action 'self';";
EOF

log "Secure Nginx SSL configuration created."

# 5. Create a security audit script
log "Creating security audit script..."

cat > /root/guess-who-footballer/production/security-audit.sh << EOF
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
EOF

chmod +x /root/guess-who-footballer/production/security-audit.sh
log "Security audit script created and made executable."

# 6. Check for unnecessary services and open ports
log "Checking for unnecessary services and open ports..."
unnecessary_services=$(systemctl list-unit-files --state=enabled | grep -E 'telnet|rsh|rlogin|rexec|ftp|vsftpd|telnetd')
if [ ! -z "$unnecessary_services" ]; then
    log "WARNING: Potentially unnecessary services found:"
    log "$unnecessary_services"
    log "Consider disabling these services."
fi

# Check for suspicious open ports
suspicious_ports=$(ss -tuln | grep -E ':23|:21|:25|:69|:111|:512|:513|:514')
if [ ! -z "$suspicious_ports" ]; then
    log "WARNING: Potentially suspicious open ports found:"
    log "$suspicious_ports"
    log "Consider securing or closing these ports."
fi

# 7. Set up a firewall (if not already configured)
if ! command -v ufw &> /dev/null; then
    log "Installing UFW firewall..."
    apt-get update && apt-get install -y ufw
fi

log "Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
# Don't enable UFW automatically as it might cut your SSH connection
log "Firewall configured but not enabled. To enable, run: ufw enable"

log "Security hardening completed at $(date)"
log "======================================"

echo ""
echo "Security Hardening Summary:"
echo "--------------------------"
echo "Timestamp: $(date)"
echo "Log file: $LOG_FILE"
echo "Security measures applied:"
echo "  - Docker daemon hardening"
echo "  - Environment file permissions"
echo "  - Docker Compose security configuration"
echo "  - Nginx SSL/TLS hardening"
echo "  - Security audit script created"
echo "  - Firewall configured (but not enabled)"
echo "--------------------------"
echo "Please review the log file for any warnings or additional steps needed."
echo "To enable the firewall, run: ufw enable"
echo "To use the security-enhanced Docker Compose configuration, run:"
echo "docker compose -f docker-compose.production.yml -f docker-compose.security.yml up -d" 