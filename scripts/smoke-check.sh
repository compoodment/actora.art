#!/usr/bin/env bash
set -euo pipefail

SITE_URL="${SITE_URL:-https://actora.art}"
BACKEND_URL="${BACKEND_URL:-http://127.0.0.1:4322}"
ADMIN_USER="${ADMIN_USER:-admin}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-}"

check_status() {
  local label="$1"
  local url="$2"
  local expected="${3:-200}"

  local status
  status="$(curl -sS -o /dev/null -w '%{http_code}' "$url")"

  if [[ "$status" != "$expected" ]]; then
    echo "FAIL  $label -> $status (expected $expected) [$url]"
    exit 1
  fi

  echo "OK    $label -> $status"
}

check_json_status() {
  local label="$1"
  local url="$2"
  local expected="200"
  if [[ $# -ge 3 ]]; then
    expected="$3"
    shift 3
  else
    shift 2
  fi
  local body
  local status

  body="$(mktemp)"

  status="$(curl -sS "$@" -o "$body" -w '%{http_code}' "$url")"

  if [[ "$status" != "$expected" ]]; then
    echo "FAIL  $label -> $status (expected $expected) [$url]"
    cat "$body"
    rm -f "$body"
    exit 1
  fi

  rm -f "$body"
  echo "OK    $label -> $status"
}

echo "Smoke check for actora.art"
echo "Site:    $SITE_URL"
echo "Backend: $BACKEND_URL"

check_status "homepage" "$SITE_URL/"
check_status "chat page" "$SITE_URL/chat/"
check_status "wall page" "$SITE_URL/lab/wall/"
check_json_status "public wall api" "$SITE_URL/api/wall"
check_json_status "backend health" "$BACKEND_URL/health"

if [[ -n "$ADMIN_PASSWORD" ]]; then
  check_json_status "admin status api" "$SITE_URL/admin/api/status" 200 -u "$ADMIN_USER:$ADMIN_PASSWORD"
else
  echo "SKIP  admin status api (set ADMIN_PASSWORD to enable)"
fi

echo "Smoke check passed"
