# --- Build Stage ---
FROM node:22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build


# --- Production Stage ---
FROM node:22-alpine AS production

ENV NODE_ENV=production
ENV TZ=Europe/Berlin
ENV PORT=3000

RUN npm install -g serve

COPY --from=builder /app/dist /dist

COPY env.sh /docker-entrypoint.sh
RUN dos2unix /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
