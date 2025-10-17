# --- Build Stage ---
FROM node:22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# --- Production Stage ---
FROM node:22-slim AS production
WORKDIR /app

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        chromium \
        ca-certificates \
        curl \
        tzdata \
        jq; \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV TZ=Europe/Berlin
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PM2_LOG_DATE_FORMAT="YYYY-MM-DD HH:mm:ss"

COPY --from=builder /app /app

RUN npm install -g pm2

EXPOSE 5000
EXPOSE 8888

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=30s \
    CMD curl -fsS http://localhost:5000/health || echo "Healthcheck failed" >&2 || exit 1

CMD ["pm2-runtime", "server.js"]
