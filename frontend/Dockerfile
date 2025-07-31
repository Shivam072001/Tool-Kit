# frontend/Dockerfile

# ---- Base Stage ----
# Use a specific Node.js version for consistency.
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
# Use npm ci for clean, reproducible builds in CI/CD environments.
RUN npm ci

# ---- Development Stage ----
# This stage is used for local development with hot-reloading.
FROM base AS development
CMD ["npm", "run", "dev"]

# ---- Build Stage ----
# This stage creates an optimized production build of the React app.
FROM base AS build
COPY . .
RUN npm run build

# ---- Production Stage ----
# This stage creates the final, lightweight production image.
FROM nginx:1.27-alpine AS production
# Set up a non-root user for security.
RUN addgroup --system --gid 1001 nginx && \
    adduser --system --uid 1001 nginx
USER nginx

# Copy the built static assets from the 'build' stage.
COPY --from=build /app/dist /usr/share/nginx/html
# Copy the custom Nginx configuration.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port
EXPOSE 80

# The default Nginx command will start the server.
CMD ["nginx", "-g", "daemon off;"]