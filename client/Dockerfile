# --- Build Stage ---
FROM node:22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


# --- Production Stage ---
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV TZ=Europe/Berlin
ENV PORT=3000

RUN npm install -g serve

COPY --from=builder /app/dist ./dist
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER node
EXPOSE 3000

ENTRYPOINT ["sh", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["serve", "-s", "dist", "-l", "3000"]
