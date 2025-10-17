#!/bin/sh

# Inject HTTP API URL
if [ -n "$VITE_API_URL" ]; then
  echo "Injecting API URL: $VITE_API_URL"
  find /app/dist -type f -name '*.js' -exec sed -i "s|__API_URL__|$VITE_API_URL|g" {} \;
fi

# Inject WebSocket API URL
if [ -n "$VITE_WS_URL" ]; then
  echo "Injecting WebSocket URL: $VITE_WS_URL"
  find /app/dist -type f -name '*.js' -exec sed -i "s|__WS_URL__|$VITE_WS_URL|g" {} \;
fi

exec "$@"
