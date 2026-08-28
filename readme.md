# Compass backend

## Старт

Создать .env и прописать туда переменные окружения из .env.example  
Запуск приложения
./develop/start.sh
Остановить приложение
./develop/stop.sh

## Миграции

Применить одну - docker compose -f deployment/docker-compose.dev.yaml run --rm migrator -a up  
Откатить одну - docker compose -f deployment/docker-compose.dev.yaml run --rm migrator -a down  
Применить все - docker compose -f deployment/docker-compose.dev.yaml run --rm migrator -a latest

Если не тянутся новые миграции в контейнер - надо пересобрать его: docker compose -f deployment/docker-compose.dev.yaml run --build --rm migrator -a up
