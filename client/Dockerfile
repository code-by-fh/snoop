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


ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

ARG VITE_WEBSOCKET_BASE_URL
ENV VITE_WEBSOCKET_BASE_URL=${VITE_WEBSOCKET_BASE_URL}

ENV NODE_ENV=production
ENV TZ=Europe/Berlin
ENV PORT=3000

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

USER node
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
