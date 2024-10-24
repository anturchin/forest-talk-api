# Forest Talk API

**Версия**: `0.0.1`  
**Деплой**: https://forest-talk-api.onrender.com  
**Swagger Документация**: https://forest-talk-api.onrender.com/api/docs  
**Таблицы БД**: https://drawsql.app/teams/13243564321/diagrams/foresttalk

---

## Обзор проекта

**Forest Talk API** — это RESTful API сервис, построенный на основе NestJS. API предоставляет функции аутентификации пользователей, взаимодействие с базой данных и обмен данными между пользователями. Основные технологии включают Prisma для работы с базой данных, JWT для аутентификации, и кеширование с помощью Redis. API предназначен для масштабируемости и может быть легко деплоен в облачные сервисы.

### Основные функции:

1. **Аутентификация пользователей**:  
   Использование JWT для безопасной аутентификации и управления доступом к ресурсам API.

2. **Управление пользователями**:  
   CRUD-операции для работы с профилями пользователей (создание, изменение, удаление и просмотр).

3. **Кеширование**:  
   Redis используется для кеширования часто запрашиваемых данных, что улучшает производительность API.

4. **Простая интеграция с базой данных**:  
   Prisma используется для управления схемой базы данных, выполнения миграций и работы с данными.

5. **Автогенерируемая документация**:  
   Документация API автоматически генерируется с помощью Swagger, что позволяет легко ознакомиться с доступными эндпоинтами.

---

## Структура проекта

```bash
forest-talk-api/
│
├── src/
│   ├── auth/                  # Модуль аутентификации
│   ├── user/                  # Модуль для работы с пользователями
│   ├── prisma/                # Prisma клиент и конфигурация
│   ├── redis/                 # Redis клиент и конфигурация
│   ├── common/                # Общие утилиты и константы
│   └── app.module.ts          # Основной модуль приложения
│   └── main.ts                # Точка входа в приложение
│
├── test/                      # e2e тесты
│
├── Dockerfile                 # Конфигурация Docker для сборки образа в продакш
├── docker-compose.yml         # Конфигурация Docker Compose для запуска Postgres, Redis, Adminer
├── package.json               # Зависимости и скрипты
└── README.md                  # Описание проекта
```

## Docker

Для запуска проекта в контейнерах используется docker-compose, что позволяет развернуть PostgreSQL и Redis базы данных вместе с приложением.

**Конфигурация Docker Compose:**

```bash
version: '3.8'
services:
  db:
    image: postgres:alpine  # Используется образ PostgreSQL на базе Alpine Linux, легкий и оптимизированный для использования в контейнерах.
    restart: always  # Автоматически перезапускает контейнер в случае его сбоя.
    shm_size: 128mb  # Размер разделяемой памяти для PostgreSQL, что помогает улучшить производительность при работе с большими запросами.
    environment:
      POSTGRES_USER: ${POSTGRES_USER}  # Имя пользователя для подключения к базе данных, берется из переменных окружения.
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}  # Пароль для доступа к базе данных.
      POSTGRES_DB: ${POSTGRES_DB}  # Имя базы данных, которая будет создана при запуске контейнера.
    ports:
      - '5432:5432'  # Проброс порта PostgreSQL для внешнего доступа. Локальный порт 5432 маппится на порт контейнера 5432.
    volumes:
      - postgres-data:/var/lib/postgresql/data  # Сохранение данных базы данных на локальной машине через том, чтобы данные не терялись при перезапуске контейнера.

  redis:
    image: redis:alpine  # Образ Redis на базе Alpine Linux. Redis используется для кэширования данных.
    restart: always  # Контейнер Redis будет перезапущен автоматически в случае сбоя.
    ports:
      - '6379:6379'  # Проброс порта для внешнего доступа к Redis. Локальный порт 6379 маппится на порт контейнера 6379.
    volumes:
      - redis-data:/data  # Монтирование тома для хранения данных Redis. Это необходимо для сохранения данных между перезапусками контейнера.

  adminer:
    image: adminer  # Используется Adminer — веб-интерфейс для управления базами данных, упрощенный аналог phpMyAdmin.
    restart: always  # Контейнер Adminer будет перезапущен автоматически в случае сбоя.
    ports:
      - 8080:8080  # Проброс порта для доступа к веб-интерфейсу Adminer. Локальный порт 8080 маппится на порт контейнера 8080.

volumes:
  postgres-data:  # Том для хранения данных PostgreSQL.
  redis-data:  # Том для хранения данных Redis.
```

- **PostgreSQL:** Используется для управления реляционными данными через Prisma ORM.
- **Redis:** Используется для кеширования данных и повышения производительности.
- **Adminer:** Интерфейс для управления базой данных PostgreSQL.

## Команды Docker

- Запуск сервисов в docker-compose:

```bash
docker-compose up --build -d
```

- Остановка и удаление контейнеров:

```bash
docker-compose down
```

## Деплой на Render

Для деплоя на Render можно использовать следующий Dockerfile:

```bash
# Базовый образ Node.js
FROM node:20-alpine

# Рабочая директория
WORKDIR /app

# Копирование файлов зависимостей и установка
COPY package*.json ./
RUN npm install

# Копирование всех файлов приложения
COPY . .

# Генерация Prisma Client
RUN npm run prisma:generate

# Сборка приложения
RUN npm run build

# Открытие порта
EXPOSE 3000

# Запуск миграций и старта в продакшене
CMD [ "sh", "-c", "npm run prisma:migrate && npm run start:prod" ]
```

## Деплой:

1. **Подключение репозитория:** Включите автоматический деплой из вашего репозитория на [render.com](https://render.com).

2. **Настройка переменных окружения:** Обязательно задайте переменные окружения для базы данных и JWT:

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=forest_talk

REDIS_HOST=localhost
REDIS_PORT=6379

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

JWT_ACCESS_SECRET=secret-jwt
JWT_REFRESH_SECRET=secret-refresh
```

3. **Автодеплой:** Включите автоматические деплои при каждом pull request в основную ветку вашего репозитория.

4. **Мониторинг:** Следите за логами приложения на Render для отладки и мониторинга состояния сервиса.

## CI/CD Пайплайн

Для обеспечения автоматического тестирования и сборки на каждый пуш в ветку develop, используется GitHub Actions.

### Конфигурация CI:

```bash
name: Node.js CI

on:
  push:
    branches: [ "develop" ]
  pull_request:
    branches: [ "develop" ]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]
    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run ci:format
    - run: npm run lint
    - run: npm run test
    - run: npm run build
```

### Описание:

1. **Запуск пайплайна**:  
   Пайплайн запускается при каждом пуше или pull request в ветку develop.

2. **Сборка**:  
   Пайплайн запускается на последней версии Ubuntu и выполняет установку зависимостей, проверку форматирования, линтинг, тесты, а затем сборку приложения.

3. **Кэширование**:  
   Используется кэширование зависимостей Node.js для ускорения процесса сборки.

4. **Тестирование и сборка:**:  
   После успешной проверки форматирования и линтинга запускаются тесты, а затем производится сборка проекта.

## Скрипты проекта

- **`build`**: `nest build`  
  Компилирует проект с использованием NestJS, собирая его в директорию `dist` для последующего выполнения в продакшн-среде.

- **`format`**: `prettier --write .`  
  Форматирует весь код проекта согласно правилам Prettier. Применяет автоформатирование к файлам в текущем проекте.

- **`ci:format`**: `prettier --check .`  
  Проверяет форматирование кода с использованием Prettier без внесения изменений. Полезно для CI/CD пайплайнов, чтобы убедиться, что код отформатирован правильно.

- **`start`**: `nest start`  
  Запускает NestJS приложение в стандартном режиме. Подходит для продакшн-среды или ручного запуска.

- **`start:dev`**: `nest start --watch`  
  Запускает приложение в режиме разработки с включенным "горячим" перезапуском при изменении файлов. Удобно для локальной разработки.

- **`start:debug`**: `nest start --debug --watch`  
  Запуск приложения с возможностью отладки (debugging) и горячей перезагрузки. Используется для детальной отладки в процессе разработки.

- **`start:prod`**: `node dist/main`  
  Запуск скомпилированного продакшн-кода, который был собран с помощью команды `build`. Используется для выполнения в продакшн-среде.

- **`lint`**: `eslint "{src,apps,libs,test}/**/*.ts" --fix`  
  Выполняет проверку кода на соответствие правилам ESLint и автоматически исправляет найденные проблемы.

- **`test`**: `jest`  
  Запуск тестов с использованием фреймворка Jest для юнит-тестирования.

- **`test:watch`**: `jest --watch`  
  Запускает тесты в режиме слежения за файлами, чтобы тесты выполнялись автоматически при изменении файлов.

- **`test:cov`**: `jest --coverage`  
  Запускает тесты с измерением покрытия кода (code coverage), чтобы узнать, какая часть кода была протестирована.

- **`test:debug`**:  
  `node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand`  
  Запуск тестов в режиме отладки с использованием Jest и Node.js.

- **`test:e2e`**: `jest --config ./test/jest-e2e.json`  
  Запуск e2e (end-to-end) тестов с использованием конфигурации, указанной в файле `jest-e2e.json`.

- **`prisma:generate`**: `npx prisma generate --schema=./src/prisma/schema.prisma`  
  Генерация Prisma Client на основе схемы базы данных, расположенной по указанному пути.

- **`prisma:migrate`**: `npx prisma migrate deploy --schema=./src/prisma/schema.prisma`  
  Применение миграций базы данных в продакшн-среде на основе схемы.

- **`prisma:dev`**: `npx prisma migrate dev --schema=./src/prisma/schema.prisma`  
  Применение миграций в режиме разработки, также включает возможность создания новых миграций.

- **`prisma:rollback`**: `npx prisma migrate reset --force --schema=./src/prisma/schema.prisma`  
  Полный сброс базы данных с откатом всех миграций.

- **`prisma:status`**: `npx prisma migrate status --schema=./src/prisma/schema.prisma`  
  Проверка статуса миграций базы данных.
