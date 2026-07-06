#!/usr/bin/env bash
set -e
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$ROOT_DIR/backend"
npm run dev &
BACKEND_PID=$!

cd "$ROOT_DIR/mobile"
npm start

wait $BACKEND_PID
