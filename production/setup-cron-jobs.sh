#!/bin/bash

# Setup cron jobs for Football Guess Who application

echo "Setting up cron jobs for health checks and backups..."

# Health checks every 5 minutes
(crontab -l 2>/dev/null || echo "") | grep -v 'health-check.sh' | { cat; echo "*/5 * * * * /root/guess-who-footballer/health-check.sh >> /root/guess-who-footballer/production/logs/health-check.log 2>&1"; } | crontab -

# Database backup daily at 2 AM
(crontab -l 2>/dev/null || echo "") | grep -v 'backup-database.sh' | { cat; echo "0 2 * * * /root/guess-who-footballer/backup-database.sh >> /root/guess-who-footballer/production/logs/backup.log 2>&1"; } | crontab -

# Log rotation weekly
(crontab -l 2>/dev/null || echo "") | grep -v 'logrotate' | { cat; echo "0 0 * * 0 /usr/sbin/logrotate /etc/logrotate.d/footballer-logs > /dev/null 2>&1"; } | crontab -

echo "Cron jobs set up successfully!"
echo "- Health checks: Every 5 minutes"
echo "- Database backups: Daily at 2 AM"
echo "- Log rotation: Weekly on Sunday at midnight"

# Create logrotate configuration
cat > /etc/logrotate.d/footballer-logs << EOF
/root/guess-who-footballer/production/logs/*.log {
    weekly
    rotate 12
    compress
    delaycompress
    missingok
    notifempty
    create 0640 root root
}
EOF

echo "Logrotate configuration created at /etc/logrotate.d/footballer-logs" 