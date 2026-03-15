# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy server and built assets
COPY server.js ./
COPY --from=builder /app/dist ./dist

# Ensure PORT environment variable is set (Cloud Run default: 8080)
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the server with explicit logging
CMD ["node", "server.js"]
