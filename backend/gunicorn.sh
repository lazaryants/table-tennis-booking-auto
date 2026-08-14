#!/bin/bash
source /var/www/TennisProject/venv/bin/activate
exec gunicorn -c "/var/www/TennisProject/backend/gunicorn_config.py" Tennis.wsgi
