# Football Guess Who - BAU Operations Guide

## Overview

This guide provides instructions for Business As Usual (BAU) staff to manage and maintain the "Football Guess Who" application in production. It covers common operations, troubleshooting procedures, and basic administration tasks.

## 1. Application Access

### 1.1 Production Environment

- **URL**: https://who.gair.com.au
- **Server**: AWS EC2 (eu-west-1)
- **SSH Access**: `ssh admin@who-gair-prod.example.com -i ~/.ssh/footballguesswho_prod.pem`
- **Application Directory**: `/opt/football-guess-who`

### 1.2 Admin Access

- **Admin Panel**: https://who.gair.com.au/admin
- **Admin Credentials**: Provided separately via secure channel
- **Monitoring Dashboard**: https://grafana.who.gair.com.au

## 2. Basic Operations

### 2.1 Service Management

#### Starting the Application

```bash
cd /opt/football-guess-who
docker compose -f docker-compose.production.yml up -d
```

#### Stopping the Application

```bash
cd /opt/football-guess-who
docker compose -f docker-compose.production.yml down
```

#### Restarting Individual Services

```bash
# Restart backend only
docker compose -f docker-compose.production.yml restart backend

# Restart frontend only
docker compose -f docker-compose.production.yml restart frontend

# Restart database
docker compose -f docker-compose.production.yml restart db

# Restart Redis
docker compose -f docker-compose.production.yml restart redis
```

#### Checking Service Status

```bash
docker compose -f docker-compose.production.yml ps
```

### 2.2 Viewing Logs

#### View Real-time Logs

```bash
# All services
docker compose -f docker-compose.production.yml logs --tail=100 -f

# Backend only
docker compose -f docker-compose.production.yml logs --tail=100 -f backend

# Frontend only
docker compose -f docker-compose.production.yml logs --tail=100 -f frontend
```

#### Accessing Historical Logs

Historical logs are available in Kibana:
1. Navigate to https://kibana.who.gair.com.au
2. Use the same credentials as the admin panel
3. Select the appropriate dashboard for the service you want to monitor

### 2.3 Health Checks

#### Running Manual Health Checks

```bash
cd /opt/football-guess-who
./health-check.sh
```

This script checks:
- Frontend accessibility
- Backend API functionality
- Database connection
- Redis connection

#### Viewing Automated Health Check Results

Automated health checks run every 5 minutes and are visible in:
1. Grafana dashboards
2. The Alerts tab in the monitoring system
3. CloudWatch metrics (if AWS is used)

## 3. Common Maintenance Tasks

### 3.1 Deploying Updates

When new versions are released, follow these steps:

```bash
# 1. Pull the latest changes
cd /opt/football-guess-who
git pull

# 2. Pull the latest Docker images
docker compose -f docker-compose.production.yml pull

# 3. Apply the update (zero downtime deployment)
docker compose -f docker-compose.production.yml up -d
```

### 3.2 Database Operations

#### Backup Database Manually

```bash
cd /opt/football-guess-who
./backup-database.sh
```

Backups are stored in:
- Local: `/opt/football-guess-who/backups/`
- Remote: S3 bucket `s3://footballguesswho-backups/`

#### Restore Database from Backup

```bash
# 1. List available backups
ls -la /opt/football-guess-who/backups/

# 2. Restore from a specific backup
gunzip -c /opt/football-guess-who/backups/football_guess_who_20230807_020000.sql.gz | \
  docker compose -f docker-compose.production.yml exec -T db psql -U postgres football_guess_who
```

#### Run Database Migrations

```bash
docker compose -f docker-compose.production.yml exec backend npx prisma migrate deploy
```

### 3.3 SSL Certificate Management

SSL certificates are managed through Let's Encrypt and automatically renew. If manual renewal is needed:

```bash
# Renew certificates
sudo certbot renew

# Reload Nginx to apply new certificates
docker compose -f docker-compose.production.yml exec frontend nginx -s reload
```

### 3.4 Clear Redis Cache

Sometimes clearing the Redis cache can resolve issues with sessions or state:

```bash
# Clear all Redis data (use with caution!)
docker compose -f docker-compose.production.yml exec redis redis-cli FLUSHALL

# Clear only session data
docker compose -f docker-compose.production.yml exec redis redis-cli --scan --pattern "session:*" | xargs -L 1 redis-cli DEL
```

## 4. Troubleshooting

### 4.1 Common Issues and Solutions

#### Application Not Responding

1. Check if all services are running:
   ```bash
   docker compose -f docker-compose.production.yml ps
   ```

2. Check system resources:
   ```bash
   # Check disk space
   df -h
   
   # Check memory usage
   free -m
   
   # Check CPU usage
   top
   ```

3. Restart the services if needed:
   ```bash
   docker compose -f docker-compose.production.yml restart
   ```

#### Database Connection Issues

1. Check if database service is running:
   ```bash
   docker compose -f docker-compose.production.yml ps db
   ```

2. Check database logs:
   ```bash
   docker compose -f docker-compose.production.yml logs --tail=100 db
   ```

3. Verify database connection from backend:
   ```bash
   docker compose -f docker-compose.production.yml exec backend npx prisma db execute --stdin <<< "SELECT 1"
   ```

#### WebSocket Connection Issues

1. Check backend logs for WebSocket errors:
   ```bash
   docker compose -f docker-compose.production.yml logs --tail=100 -f backend | grep socket
   ```

2. Verify Nginx WebSocket proxy settings:
   ```bash
   docker compose -f docker-compose.production.yml exec frontend cat /etc/nginx/conf.d/default.conf | grep -A 10 "location /socket.io"
   ```

3. Restart the backend:
   ```bash
   docker compose -f docker-compose.production.yml restart backend
   ```

### 4.2 Emergency Procedures

#### Full Application Restart

If the application is completely unresponsive, perform a full restart:

```bash
cd /opt/football-guess-who
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml up -d
```

#### Rollback to Previous Version

If a deployment causes issues, roll back to the previous version:

```bash
# 1. Pull the previous image version
docker pull yourusername/football-guess-who-backend:previous
docker pull yourusername/football-guess-who-frontend:previous

# 2. Update the docker-compose.production.yml file to use the previous tag
# Edit docker-compose.production.yml and change the image tags

# 3. Restart with the updated configuration
docker compose -f docker-compose.production.yml up -d
```

#### Contact Support Team

If you're unable to resolve the issue, contact the support team:

- **Email**: support@gair.com.au
- **Phone**: +1-555-123-4567
- **Slack Channel**: #footballguesswho-support

## 5. Monitoring and Alerts

### 5.1 Monitoring Dashboards

- **System Dashboard**: https://grafana.who.gair.com.au/d/system
  - Shows server CPU, memory, disk usage
  - Network traffic statistics
  - Container health

- **Application Dashboard**: https://grafana.who.gair.com.au/d/application
  - API response times
  - Error rates
  - Active user sessions
  - Game statistics

- **Database Dashboard**: https://grafana.who.gair.com.au/d/database
  - Query performance
  - Connection pool status
  - Transaction rate
  - Table sizes

### 5.2 Alert Notifications

Alerts are configured to notify the operations team via multiple channels:

- **Email**: alerts@gair.com.au
- **Slack**: #footballguesswho-alerts
- **PagerDuty**: For critical alerts only

Alert severity levels:

1. **Critical**: Requires immediate attention, affects all users
2. **High**: Requires attention within 1 hour, affects many users
3. **Medium**: Should be addressed within 1 day, affects some users
4. **Low**: Should be fixed in the next release, minor impact

### 5.3 Regular Health Checks

The following health checks run automatically:

- **Frontend Availability**: Every 1 minute
- **Backend API Health**: Every 1 minute
- **Database Connection**: Every 5 minutes
- **Full Game Flow Test**: Every 30 minutes

## 6. Scheduled Maintenance

### 6.1 Regular Maintenance Tasks

| Task | Frequency | Automated | Manual Steps Required |
|------|-----------|-----------|----------------------|
| Database Backup | Daily (2 AM) | Yes | None |
| Database Vacuum | Weekly (Sunday 3 AM) | Yes | None |
| SSL Certificate Renewal | Monthly | Yes | Check renewal status |
| Log Rotation | Daily | Yes | None |
| Security Updates | Monthly | No | Review and apply updates |

### 6.2 Maintenance Window

Scheduled maintenance window: **Tuesdays, 2 AM - 4 AM UTC**

During this window:
- Application updates may be deployed
- Database maintenance may occur
- System updates may be applied

Users should be notified at least 48 hours in advance of any scheduled maintenance that might cause downtime.

## 7. Scaling Operations

### 7.1 Handling Increased Load

If the monitoring system shows increased load or reduced performance:

1. Scale up backend services:
   ```bash
   docker compose -f docker-compose.production.yml up -d --scale backend=3
   ```

2. Monitor the effect of scaling:
   - Watch response times in Grafana
   - Check server resource usage
   - Verify database performance

3. Scale down when load decreases:
   ```bash
   docker compose -f docker-compose.production.yml up -d --scale backend=1
   ```

### 7.2 Database Performance

If database performance degrades:

1. Run vacuum analyze to optimize the database:
   ```bash
   docker compose -f docker-compose.production.yml exec db psql -U postgres -c "VACUUM ANALYZE;" football_guess_who
   ```

2. Check for long-running queries:
   ```bash
   docker compose -f docker-compose.production.yml exec db psql -U postgres -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query FROM pg_stat_activity WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 minutes';" football_guess_who
   ```

## 8. Backup and Recovery

### 8.1 Backup Schedule

- **Database**: Full backup daily at 2 AM UTC
- **Configuration Files**: Backed up with each change
- **User Uploads**: Backed up daily at 3 AM UTC

### 8.2 Backup Locations

- **Primary**: S3 bucket `s3://footballguesswho-backups/`
- **Secondary**: Local storage at `/opt/football-guess-who/backups/`

### 8.3 Recovery Procedures

#### Recover from Database Failure

1. Stop the application:
   ```bash
   docker compose -f docker-compose.production.yml down
   ```

2. Restore the database:
   ```bash
   # Find the most recent backup
   aws s3 ls s3://footballguesswho-backups/ --recursive | sort | tail -n 10
   
   # Download the backup
   aws s3 cp s3://footballguesswho-backups/daily/football_guess_who_20230807_020000.sql.gz /tmp/
   
   # Start just the database
   docker compose -f docker-compose.production.yml up -d db
   
   # Wait for database to be ready
   sleep 10
   
   # Restore from backup
   gunzip -c /tmp/football_guess_who_20230807_020000.sql.gz | \
     docker compose -f docker-compose.production.yml exec -T db psql -U postgres football_guess_who
   ```

3. Restart the application:
   ```bash
   docker compose -f docker-compose.production.yml up -d
   ```

## 9. Security Procedures

### 9.1 Security Updates

Apply security updates promptly:

```bash
# Update the server
sudo apt update
sudo apt upgrade -y

# Update Docker images
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d
```

### 9.2 Access Management

User access is managed through the admin panel:
1. Navigate to https://who.gair.com.au/admin
2. Go to User Management
3. Update or revoke access as needed

### 9.3 Audit Logs

Security audit logs are stored in Elasticsearch and can be viewed in Kibana:
1. Navigate to https://kibana.who.gair.com.au
2. Select "Security Dashboard"
3. Filter by date, user, or activity type

## 10. Contact Information

### 10.1 Support Team

- **Email**: support@gair.com.au
- **Phone**: +1-555-123-4567
- **Slack**: #footballguesswho-support

### 10.2 Escalation Path

1. **Level 1**: On-call Support Engineer
   - Response time: 15 minutes
   - Available 24/7

2. **Level 2**: DevOps Team Lead
   - Response time: 30 minutes
   - Available during business hours, on-call after hours

3. **Level 3**: Development Team Lead
   - Response time: 1 hour
   - Available during business hours, on-call for critical issues

4. **Level 4**: CTO
   - Response time: 2 hours
   - Escalate only for critical business impact issues

## Appendix A: Environment Variables

```env
# Generic .env file for reference
# Actual values are stored securely and provided via separate secure channel

# Server Configuration
NODE_ENV=production
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://postgres:db_password_here@db:5432/football_guess_who
DB_PASSWORD=db_password_here

# Redis Configuration
REDIS_URL=redis://redis:6379

# JWT Authentication
JWT_SECRET=strong_random_string_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://who.gair.com.au

# Logging
LOG_LEVEL=info
```

## Appendix B: Quick Reference

### Common Commands

```bash
# Start all services
docker compose -f docker-compose.production.yml up -d

# Stop all services
docker compose -f docker-compose.production.yml down

# View logs
docker compose -f docker-compose.production.yml logs --tail=100 -f

# Restart a specific service
docker compose -f docker-compose.production.yml restart backend

# Run health check
./health-check.sh

# Backup database
./backup-database.sh

# Check disk space
df -h

# Check server load
top
```

### Useful Endpoints

- **Frontend**: https://who.gair.com.au
- **API Base URL**: https://who.gair.com.au/api
- **Health Check**: https://who.gair.com.au/api/health
- **Admin Panel**: https://who.gair.com.au/admin
- **Monitoring**: https://grafana.who.gair.com.au
- **Logs**: https://kibana.who.gair.com.au 