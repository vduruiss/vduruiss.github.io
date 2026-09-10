#!/bin/sh
set -eu

PORT="${PREVIEW_PORT:-8765}"
ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
OUTPUT_DIR="$ROOT_DIR/previews"
CHROME_LOG="$OUTPUT_DIR/chrome.log"

if [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
elif command -v google-chrome >/dev/null 2>&1; then
  CHROME=$(command -v google-chrome)
elif command -v chromium >/dev/null 2>&1; then
  CHROME=$(command -v chromium)
else
  echo "Chrome or Chromium is required for automated screenshots." >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
: > "$CHROME_LOG"
cd "$ROOT_DIR"
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT INT TERM
sleep 1

"$CHROME" --headless=new --disable-gpu --hide-scrollbars --run-all-compositor-stages-before-draw \
  --virtual-time-budget=1500 --window-size=1440,1100 \
  --screenshot="$OUTPUT_DIR/home-desktop.png" "http://127.0.0.1:$PORT/index.html" 2>>"$CHROME_LOG"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --run-all-compositor-stages-before-draw \
  --virtual-time-budget=1500 --window-size=1146,900 \
  --screenshot="$OUTPUT_DIR/home-medium.png" "http://127.0.0.1:$PORT/index.html" 2>>"$CHROME_LOG"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --run-all-compositor-stages-before-draw \
  --virtual-time-budget=1500 --window-size=390,844 \
  --screenshot="$OUTPUT_DIR/home-mobile.png" "http://127.0.0.1:$PORT/scripts/mobile-home-preview.html" 2>>"$CHROME_LOG"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --run-all-compositor-stages-before-draw \
  --virtual-time-budget=1500 --window-size=1440,6000 \
  --screenshot="$OUTPUT_DIR/home-long.png" "http://127.0.0.1:$PORT/index.html" 2>>"$CHROME_LOG"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --run-all-compositor-stages-before-draw \
  --virtual-time-budget=1500 --window-size=1440,1100 \
  --screenshot="$OUTPUT_DIR/publications-desktop.png" "http://127.0.0.1:$PORT/publications.html" 2>>"$CHROME_LOG"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --run-all-compositor-stages-before-draw \
  --virtual-time-budget=1500 --window-size=1440,6000 \
  --screenshot="$OUTPUT_DIR/publications-long.png" "http://127.0.0.1:$PORT/publications.html" 2>>"$CHROME_LOG"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --run-all-compositor-stages-before-draw \
  --virtual-time-budget=1500 --window-size=390,844 \
  --screenshot="$OUTPUT_DIR/publications-mobile.png" "http://127.0.0.1:$PORT/scripts/mobile-publications-preview.html" 2>>"$CHROME_LOG"

echo "Preview images written to $OUTPUT_DIR"
