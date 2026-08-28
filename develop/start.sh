#!/bin/bash
docker compose --env-file .env -f ./develop/docker-compose.dev.yaml up --build -d
docker compose -f ./develop/docker-compose.dev.yaml run --rm migrator -a latest
docker compose -f ./develop/docker-compose.dev.yaml logs -f
