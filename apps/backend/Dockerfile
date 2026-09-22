# --- Stage 1: Build ---
FROM node:22-alpine AS builder

# Install required packages for Prisma on Alpine
RUN apk add --no-cache openssl libc6-compat

# Set working directory
WORKDIR /app

# Copy package.json, package-lock.json, and prisma schema first for caching
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies using npm install with a temporary cache, then clean the cache in the same layer to minimize size
RUN npm install --no-audit --no-fund --cache /tmp/npm-cache && rm -rf /tmp/npm-cache

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Prune devDependencies to keep only production dependencies in node_modules
RUN npm prune --omit=dev --ignore-scripts

# --- Stage 2: Production ---
FROM node:22-alpine AS runner

# Install runtime libraries for Prisma
RUN apk add --no-cache openssl libc6-compat

# Set working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Expose the application port
EXPOSE 7777

# Start the application
CMD ["npm", "run", "start:prod"]