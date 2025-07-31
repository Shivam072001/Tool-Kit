# backend-compute/Dockerfile

# ---- Base Stage ----
# Use a specific Python version. The 'slim' variant is a good balance of size and functionality.
FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /app

# Install OS-level dependencies that might be needed by Python packages.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Create and activate a virtual environment for clean dependency management.
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---- Production Stage ----
# This stage creates the final application image.
FROM python:3.11-slim AS production
WORKDIR /app

# Set up a non-root user.
RUN addgroup --system --gid 1001 django && \
    adduser --system --uid 1001 django
USER django

# Copy the virtual environment from the base stage.
COPY --from=base /opt/venv /opt/venv
# Copy the application source code.
COPY . .

# Make the virtual environment's binaries accessible.
ENV PATH="/opt/venv/bin:$PATH"

EXPOSE 8000

# Run the Django application using Gunicorn for production.
# Ensure 'gunicorn' is listed in your requirements.txt
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application"]