# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma schema and migrations
COPY --from=builder /app/prisma ./prisma

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist

# Create log directory
RUN mkdir -p logs

# Expose application port
EXPOSE 3000

# Run database migrations and start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"] 