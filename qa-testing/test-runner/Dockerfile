# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci --omit=dev --no-audit

# Copy rest of the application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Set healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost:3001/health || exit 1

# Set user to non-root
USER node

# Start the application
CMD ["node", "src/server.js"] 