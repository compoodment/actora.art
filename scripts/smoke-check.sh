#!/usr/bin/env bash
set -euo pipefail

SITE_URL="${SITE_URL:-https://actora.art}"

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

echo "Public smoke check for actora.art"
echo "Site: $SITE_URL"

check_status "homepage" "$SITE_URL/"
check_status "chat page" "$SITE_URL/chat/"
check_status "wall page" "$SITE_URL/lab/wall/"
check_json_status "chat bootstrap api" "$SITE_URL/api/chat"
check_json_status "wall api" "$SITE_URL/api/wall"
check_json_status "wall budget api" "$SITE_URL/api/wall/budget"
check_json_status "auth session api" "$SITE_URL/api/auth/me"

echo "Smoke check passed"
