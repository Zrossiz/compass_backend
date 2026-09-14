# Compass backend

## Development

Создайте `backend/.env` на основе `backend/.env.example`, затем из каталога
`backend` выполните:

```sh
./develop/start.sh
```

Остановка development-окружения:

```sh
./develop/stop.sh
```

## Production

Production-конфигурация находится в `backend/prod`. Она запускает API,
PostgreSQL и MinIO в отдельном Compose-проекте `compass-prod`. PostgreSQL и
MinIO не публикуют порты наружу; API по умолчанию доступен только на
`127.0.0.1:10000` для подключения reverse proxy.

1. Создайте production-файл окружения:

```sh
cp prod/.env.prod.example prod/.env.prod
```

2. Замените все значения `replace-with-*`, укажите настоящий `FRONTEND_URI` и
   проверьте закреплённую версию `MINIO_IMAGE`. Файл `prod/.env.prod` нельзя
   добавлять в Git.

3. Запустите deployment:

```sh
./prod/start.sh
```

Скрипт собирает backend-образ, запускает PostgreSQL и MinIO, применяет все
ожидающие миграции и только после успешной миграции запускает API.

Логи API:

```sh
./prod/logs.sh
```

Остановка без удаления данных:

```sh
./prod/stop.sh
```

Данные сохраняются в Docker volumes `compass-prod_postgres_data` и
`compass-prod_minio_data`. Настройте их регулярное резервное копирование до
реального запуска.

Production должен находиться за HTTPS reverse proxy. Значение `FRONTEND_URI`
должно точно совпадать с публичным origin фронтенда, например
`https://compass.example.com`.

## Миграции вручную

Применить одну следующую миграцию в production:

```sh
docker compose --env-file prod/.env.prod -f prod/docker-compose.prod.yaml run --rm migrator -a up
```

Откатить одну последнюю миграцию:

```sh
docker compose --env-file prod/.env.prod -f prod/docker-compose.prod.yaml run --rm migrator -a down
```
