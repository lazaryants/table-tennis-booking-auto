# Table Tennis Booking — автоматическое бронирование

Веб-приложение для автоматического бронирования столов настольного тенниса.

## Особенность этой версии

В этой версии бронирование происходит сразу, без подтверждения администратором или менеджером.

Пользователь выбирает дату, время и стол. Если слот свободен и допустим по времени, бронь создаётся сразу.

Это отдельный проект от версии с подтверждением бронирований.

## Возможности

- регистрация и авторизация пользователей;
- JWT access + refresh token;
- refresh token сроком 14 дней;
- просмотр расписания бронирований;
- автоматическое создание брони без подтверждения;
- отображение логина пользователя, занявшего слот;
- защита от двойного бронирования;
- запрет бронирования прошедших интервалов;
- отмена своей брони не позднее чем за 2 часа до начала;
- защита чужих бронирований от изменения и удаления;
- закрытый API пользователей;
- Django Admin;
- адаптивный Vue-интерфейс.

## Стек

### Backend

- Python
- Django 4.2
- Django REST Framework
- SimpleJWT
- django-filter
- SQLite
- Gunicorn

### Frontend

- Vue 3
- Vue Router
- Vuex
- Axios
- Bootstrap
- Vue CLI

### Production

- Nginx
- Gunicorn
- systemd
- HTTPS

## Структура проекта

    TennisProject/
    ├── backend/
    │   ├── main/
    │   ├── Tennis/
    │   ├── manage.py
    │   ├── requirements.txt
    │   └── .env.example
    ├── frontend/
    │   ├── public/
    │   ├── src/
    │   ├── package.json
    │   └── package-lock.json
    ├── .gitignore
    └── README.md

## API

Основные endpoints:

    /api/timelapses/
    /api/users/
    /api/signup/
    /api/token/
    /api/token/refresh/

Django Admin:

    /admin/

## Конфигурация

Рабочий секрет Django хранится в:

    backend/.env

Файл не должен попадать в Git.

Пример:

    backend/.env.example

Переменная:

    DJANGO_SECRET_KEY=change-me-to-a-long-random-secret

## База данных

Используется SQLite:

    backend/db.sqlite3

Рабочая база не хранится в Git. Структура базы воспроизводится Django-миграциями.

## Установка backend

    python3 -m venv venv
    ./venv/bin/pip install -r backend/requirements.txt

Создать конфигурацию:

    cp backend/.env.example backend/.env

Указать собственный DJANGO_SECRET_KEY.

Применить миграции:

    cd backend
    set -a
    . ./.env
    set +a
    ../venv/bin/python manage.py migrate

## Установка frontend

    cd frontend
    npm ci
    npm run build

Production-сборка создаётся в:

    frontend/dist/

и не хранится в Git.

## Production-схема

    Browser
       |
      HTTPS
       |
      Nginx
       |
       +---- Vue frontend
       |
       +---- /api/, /admin/
                  |
               Gunicorn
                  |
                Django
                  |
                SQLite

Gunicorn слушает только:

    127.0.0.1:8000

## Безопасность

В Git не должны попадать:

- backend/.env;
- backend/db.sqlite3;
- venv;
- frontend/node_modules;
- frontend/dist;
- резервные *.before-*;
- логи;
- SSL private keys.

