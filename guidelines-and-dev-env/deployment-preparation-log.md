# Football Guess Who - Deployment Preparation

## 1. Overview

This document outlines the process for preparing and deploying the "Football Guess Who" game to production environments. Based on the QA testing results and project requirements, this deployment plan ensures a secure, reliable, and scalable deployment.

## 2. Infrastructure Requirements

### 2.1 Hardware Recommendations

| Environment | CPU     | Memory | Storage | Network |
|-------------|---------|--------|---------|---------|
| Production  | 4 vCPUs | 8 GB   | 60 GB SSD | 1 Gbps |
| Staging     | 2 vCPUs | 4 GB   | 40 GB SSD | 1 Gbps |

### 2.2 Scaling Considerations

Based on performance testing, the application can handle up to 40 concurrent users on a single instance with acceptable response times. For higher loads, consider:

- Horizontal scaling with load balancer for the frontend/backend services
- Database connection pooling
- Redis for caching and session management
- Separate WebSocket servers for game sessions

## 3. Production Docker Configuration

### 3.1 Frontend Dockerfile

```dockerfile
# frontend/Dockerfile.production
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production image
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1
```

### 3.2 Backend Dockerfile

```dockerfile
# backend/Dockerfile.production
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build
RUN npx prisma generate

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files and prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

# Environment setup
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

# Start command
CMD ["node", "dist/server.js"]
```

### 3.3 Production Docker Compose

```yaml
# docker-compose.production.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.production
    restart: always
    depends_on:
      - backend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/ssl
    networks:
      - frontend-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.production
    restart: always
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/football_guess_who
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGIN=${CORS_ORIGIN}
      - LOG_LEVEL=info
    networks:
      - frontend-network
      - backend-network
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  db:
    image: postgres:14-alpine
    restart: always
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_USER=postgres
      - POSTGRES_DB=football_guess_who
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  redis:
    image: redis:alpine
    restart: always
    volumes:
      - redis_data:/data
    networks:
      - backend-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

networks:
  frontend-network:
  backend-network:

volumes:
  postgres_data:
  redis_data:
```

## 4. CI/CD Pipeline Configuration

### 4.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Football Guess Who

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    name: Test Application
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_USER: postgres
          POSTGRES_DB: football_guess_who_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run Tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/football_guess_who_test
          JWT_SECRET: test_secret
          NODE_ENV: test
  
  build-and-push:
    name: Build and Push Docker Images
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and Push Backend Image
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          file: ./backend/Dockerfile.production
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/football-guess-who-backend:latest
      
      - name: Build and Push Frontend Image
        uses: docker/build-push-action@v4
        with:
          context: ./frontend
          file: ./frontend/Dockerfile.production
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/football-guess-who-frontend:latest
  
  deploy:
    name: Deploy to Production
    needs: build-and-push
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Copy docker-compose.yml to server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USERNAME }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          source: "docker-compose.production.yml,.env.production"
          target: "/opt/football-guess-who"
      
      - name: Deploy to Production Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USERNAME }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /opt/football-guess-who
            cp .env.production .env
            docker compose -f docker-compose.production.yml pull
            docker compose -f docker-compose.production.yml up -d
            docker image prune -f
```

## 5. Environment Variables Configuration

### 5.1 Environment Variables Documentation

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| NODE_ENV | Environment mode | production | Yes |
| PORT | Backend server port | 3000 | Yes |
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:password@db:5432/football_guess_who | Yes |
| REDIS_URL | Redis connection string | redis://redis:6379 | Yes |
| JWT_SECRET | Secret for JWT tokens | your-secret-key | Yes |
| JWT_ACCESS_EXPIRES_IN | JWT access token expiry | 15m | No |
| JWT_REFRESH_EXPIRES_IN | JWT refresh token expiry | 7d | No |
| CORS_ORIGIN | Allowed CORS origins | https://yourdomain.com | Yes |
| LOG_LEVEL | Logging level | info | No |
| DB_PASSWORD | Database password | secure-password | Yes |

### 5.2 Sample Production .env File

```env
# .env.production
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/football_guess_who
REDIS_URL=redis://redis:6379
JWT_SECRET=your-secure-jwt-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
DB_PASSWORD=your-secure-db-password
```

## 6. Database Migration & Seeding

### 6.1 Production Migration Script

```bash
#!/bin/bash
# migrate-and-seed.sh

set -e

echo "Waiting for database..."
until pg_isready -h db -U postgres; do
  sleep 1
done
echo "Database is ready!"

echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding production data..."
npx prisma db seed

echo "Migration and seeding completed successfully!"
```

### 6.2 Prisma Configuration Updates

```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  // Enable query engine binaryTargets for production containers
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}

// ...rest of schema
```

## 7. Nginx Configuration for Frontend

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;

    # Redirect HTTP to HTTPS in production
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name localhost;

    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH";
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Frontend static files
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 30d;
            add_header Cache-Control "public, max-age=2592000";
        }
    }
    
    # Proxy API requests to backend
    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Proxy WebSocket connections
    location /socket.io {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 8. Deployment Instructions

### 8.1 Prerequisites

1. A Linux server with:
   - Docker and Docker Compose installed
   - At least 4GB RAM and 2 CPU cores
   - 60GB SSD storage
   - Ports 80 and 443 open

2. Domain name configured to point to your server

3. SSL certificates for HTTPS

### 8.2 Manual Deployment Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/football-guess-who.git
   cd football-guess-who
   ```

2. **Set up environment variables**
   ```bash
   cp .env.production.example .env
   # Edit .env file with your production values
   nano .env
   ```

3. **Create SSL directory and add certificates**
   ```bash
   mkdir -p ssl
   # Copy your SSL certificates to the ssl directory
   cp /path/to/your/cert.pem ssl/
   cp /path/to/your/key.pem ssl/
   ```

4. **Start the application with Docker Compose**
   ```bash
   docker compose -f docker-compose.production.yml up -d
   ```

5. **Run database migrations and seed data**
   ```bash
   docker compose -f docker-compose.production.yml exec backend sh -c "./migrate-and-seed.sh"
   ```

6. **Verify deployment**
   ```bash
   docker compose -f docker-compose.production.yml ps
   ```

### 8.3 Automated Deployment with CI/CD

1. **Configure GitHub Secrets**
   - Add the following secrets to your GitHub repository:
     - `DOCKERHUB_USERNAME`
     - `DOCKERHUB_TOKEN`
     - `PRODUCTION_HOST`
     - `PRODUCTION_USERNAME`
     - `PRODUCTION_SSH_KEY`

2. **Prepare the production server**
   ```bash
   # On the production server
   mkdir -p /opt/football-guess-who/ssl
   
   # Copy your SSL certificates
   cp /path/to/your/cert.pem /opt/football-guess-who/ssl/
   cp /path/to/your/key.pem /opt/football-guess-who/ssl/
   ```

3. **Trigger deployment by pushing to main branch or using workflow_dispatch**

4. **Verify deployment**
   ```bash
   # On the production server
   cd /opt/football-guess-who
   docker compose -f docker-compose.production.yml ps
   ```

## 9. Post-Deployment Verification

### 9.1 Automated Health Checks

```bash
#!/bin/bash
# health-check.sh

# Check frontend
echo "Checking frontend..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com)
if [ $HTTP_STATUS -eq 200 ]; then
  echo "Frontend is up (HTTP $HTTP_STATUS)"
else
  echo "Frontend check failed with HTTP status $HTTP_STATUS"
  exit 1
fi

# Check backend API
echo "Checking backend API..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/api/health)
if [ $API_STATUS -eq 200 ]; then
  echo "Backend API is up (HTTP $API_STATUS)"
else
  echo "Backend API check failed with HTTP status $API_STATUS"
  exit 1
fi

echo "All health checks passed successfully!"
```

### 9.2 Manual Verification Checklist

1. **Functionality Verification**
   - [ ] Create a single-player game
   - [ ] Create a multiplayer game and join with another browser
   - [ ] Test question asking and answering
   - [ ] Test card elimination
   - [ ] Test win/lose conditions
   - [ ] Test rematch functionality

2. **Performance Verification**
   - [ ] Check initial load time
   - [ ] Verify response times for game actions
   - [ ] Test reconnection handling

3. **Security Verification**
   - [ ] Verify SSL is working correctly
   - [ ] Check for exposed sensitive information
   - [ ] Verify CORS settings

4. **Accessibility Verification**
   - [ ] Test with screen reader
   - [ ] Verify keyboard navigation
   - [ ] Check color contrast

## 10. Monitoring and Logging

### 10.1 Monitoring Setup

1. **System Monitoring**
   - Set up Prometheus for metrics collection
   - Configure Grafana for visualization
   - Create dashboards for:
     - Server resources (CPU, memory, disk)
     - Application metrics (response times, error rates)
     - Database performance

2. **Application Performance Monitoring**
   - Implement OpenTelemetry for tracing
   - Set up alerting for critical errors and performance issues

### 10.2 Log Management

1. **Centralized Logging**
   - Configure logging to output in JSON format
   - Set up ELK stack (Elasticsearch, Logstash, Kibana) or similar
   - Create log retention policies

2. **Log Categories**
   - Access logs (nginx)
   - Application logs (backend)
   - Database logs
   - Socket.io event logs

### 10.3 Alert Configuration

1. **Critical Alerts**
   - Server resource exhaustion (CPU > 90%, memory > 90%)
   - Application error rate > 1%
   - Response time > 500ms for 95th percentile
   - Database connection errors

2. **Warning Alerts**
   - Server resource utilization (CPU > 70%, memory > 70%)
   - Application error rate > 0.5%
   - Response time > 300ms for 95th percentile

## 11. Backup and Recovery

### 11.1 Database Backup Script

```bash
#!/bin/bash
# backup-database.sh

# Configuration
BACKUP_DIR="/opt/football-guess-who/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/football_guess_who_$TIMESTAMP.sql"
RETAIN_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create database backup
echo "Creating database backup..."
docker compose -f docker-compose.production.yml exec -T db pg_dump -U postgres football_guess_who > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Clean up old backups
find $BACKUP_DIR -name "football_guess_who_*.sql.gz" -type f -mtime +$RETAIN_DAYS -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
```

### 11.2 Recovery Procedure

1. **Restore from backup**
   ```bash
   # Restore database
   gunzip -c /path/to/backup.sql.gz | docker compose -f docker-compose.production.yml exec -T db psql -U postgres football_guess_who
   ```

2. **Rebuild and restart containers**
   ```bash
   docker compose -f docker-compose.production.yml down
   docker compose -f docker-compose.production.yml up -d
   ```

## 12. Scalability Plan

### 12.1 Vertical Scaling (Short-term)

1. Increase resources on existing servers:
   - Upgrade to 8 CPU cores
   - Increase memory to 16GB
   - Optimize database configuration

### 12.2 Horizontal Scaling (Long-term)

1. **Load Balancing**
   - Deploy multiple backend instances
   - Set up Nginx or cloud load balancer
   - Implement sticky sessions for WebSocket connections

2. **Database Scaling**
   - Implement read replicas
   - Consider database sharding for larger user bases

3. **Caching Layer**
   - Enhance Redis implementation
   - Add CDN for static assets

## 13. Security Considerations

1. **SSL/TLS Configuration**
   - Use strong cipher suites
   - Enable HTTP Strict Transport Security (HSTS)
   - Set up auto-renewal for SSL certificates

2. **Network Security**
   - Implement Web Application Firewall (WAF)
   - Set up rate limiting
   - Configure network ACLs

3. **Data Protection**
   - Encrypt sensitive data at rest
   - Implement proper authentication and authorization
   - Regular security audits

## 14. Conclusion

This deployment plan provides a comprehensive guide for taking the Football Guess Who game from development to production. By following these instructions, the team can ensure a smooth, secure, and scalable deployment that addresses the issues identified during QA testing while preparing for future growth.

The most critical considerations for the initial deployment are:

1. Fixing the reconnection issues identified in QA testing
2. Ensuring database transaction safety for game state
3. Implementing proper error handling and logging
4. Setting up monitoring and alerting for early problem detection
5. Establishing backup and recovery procedures

After successful deployment, the team should focus on addressing the performance bottlenecks identified during load testing and improving the mobile responsiveness of the UI to enhance user experience. 