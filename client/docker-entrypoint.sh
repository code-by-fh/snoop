#!/bin/sh
set -e

CONFIG_FILE="/app/dist/config.json"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "⚠️  Config file not found: $CONFIG_FILE"
else
  # replace API URL
  if [ -n "$VITE_API_URL" ]; then
    echo "🔧 Injecting API URL: $VITE_API_URL"
    sed -i "s|__API_URL__|$VITE_API_URL|g" "$CONFIG_FILE"
  else
    echo "ℹ️  VITE_API_URL not set, skipping."
  fi

  # replace WebSocket URL
  if [ -n "$VITE_WS_URL" ]; then
    echo "🔧 Injecting WebSocket URL: $VITE_WS_URL"
    sed -i "s|__WS_URL__|$VITE_WS_URL|g" "$CONFIG_FILE"
  else
    echo "ℹ️  VITE_WS_URL not set, skipping."
  fi
fi

exec "$@"