from .base import *


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['melhor-rota-deploy-production.up.railway.app']

# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.getenv("PGDATABASE"),
        'USER': os.getenv("PGUSER"),
        'PASSWORD': os.getenv("PGPASSWORD"),
        'HOST': os.getenv("PGHOST"),
        'PORT': os.getenv("PGPORT"),
    }
}

CSRF_TRUSTED_ORIGINS = ["https://melhor-rota-deploy-production.up.railway.app"]

# HTTPS settings

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
# SECURE_SSL_REDIRECT = True

# HSTS settings
SECURE_HSTS_SECONDS = 31536000  # 1 year in seconds
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

# Email settings

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'melhorrota.contato@gmail.com'
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_PASSWORD")

# ALLAUTH
ACCOUNT_DEFAULT_HTTP_PROTOCOL = "https"
