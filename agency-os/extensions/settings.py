"""
Django Settings for Agency OS Extension Layer

This is a standalone Django app that connects to the same PostgreSQL
database as Plane but manages its own extension tables.
"""
import os
from pathlib import Path

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = os.getenv('EXTENSION_SECRET_KEY', 'change-me-in-production')
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'extensions',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]

# Database - connects to same Postgres as Plane
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'plane'),
        'USER': os.getenv('POSTGRES_USER', 'plane'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'plane'),
        'HOST': os.getenv('POSTGRES_HOST', 'plane-db'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}

# Use DATABASE_URL if provided (Docker/Heroku style)
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:
    import dj_database_url
    DATABASES['default'] = dj_database_url.parse(DATABASE_URL)

# Plane API configuration
PLANE_API_URL = os.getenv('PLANE_API_URL', 'http://api:8000')
PLANE_API_KEY = os.getenv('PLANE_API_KEY', '')
PLANE_API_TIMEOUT = int(os.getenv('PLANE_API_TIMEOUT', '30'))

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.UUIDField'

# REST Framework (if used)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [],
    'DEFAULT_PERMISSION_CLASSES': [],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
    },
    'loggers': {
        'extensions': {
            'handlers': ['console'],
            'level': os.getenv('LOG_LEVEL', 'INFO'),
            'propagate': True,
        },
    },
}
