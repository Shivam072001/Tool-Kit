# python_services/core/config.py

import os
from dotenv import load_dotenv

# Load environment variables from .env file in the project root
load_dotenv()

# --- DJANGO CORE SETTINGS ---
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'default-django-secret-key-insecure')
DEBUG = os.environ.get('DJANGO_DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# --- CELERY ASYNCHRONOUS TASKS ---
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

# --- EXTERNAL AI & API KEYS ---
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')

# --- INTERNAL SMTP SERVER ---
SMTP_HOST = os.environ.get('SMTP_HOST', '0.0.0.0')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 1025))

# --- INTERNAL COMMUNICATION ---
NODE_API_GATEWAY_URL = os.environ.get('NODE_API_GATEWAY_URL', 'http://localhost:8080/api')
