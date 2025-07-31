# backend-gateway/Dockerfile

# ---- Base Stage ----
# This stage installs all dependencies, including devDependencies for things like testing.
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- Build Stage ----
# This stage copies the source code and removes development dependencies.
FROM base AS build
COPY . .
RUN npm prune --production

# ---- Production Stage ----
# This final stage creates a minimal image with only what's needed to run the application.
FROM node:18-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# Set up a non-root user for enhanced security.
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs
USER nodejs

# Copy pruned dependencies and source code from the 'build' stage.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/src ./src

EXPOSE 8080
CMD [ "node", "src/server.js" ]