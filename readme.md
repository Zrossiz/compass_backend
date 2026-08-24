# Compass backend

## Миграции
docker compose -f deployment/docker-compose.dev.yaml run --rm migrator -a up
docker compose -f deployment/docker-compose.dev.yaml run --rm migrator -a down
docker compose -f deployment/docker-compose.dev.yaml run --rm migrator -a latest