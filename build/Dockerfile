FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i

COPY tsconfig.json tsconfig.migrations.json ./
COPY app ./app
COPY migrations ./migrations
RUN npm run build

FROM node:24-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=node:node /app/dist ./dist

USER node
EXPOSE 9000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:9000/health || exit 1

CMD ["npm", "start"]
