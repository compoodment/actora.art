#!/bin/bash
# Deploys the Caddyfile from repo to /etc/caddy/ and reloads Caddy
# Usage: ./deploy-caddy.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CADDYFILE="$SCRIPT_DIR/Caddyfile"

if [ ! -f "$CADDYFILE" ]; then
  echo "No Caddyfile found at $CADDYFILE"
  exit 1
fi

echo "Deploying Caddyfile..."
sudo cp "$CADDYFILE" /etc/caddy/Caddyfile
sudo systemctl reload caddy
echo "Done. Caddy reloaded."