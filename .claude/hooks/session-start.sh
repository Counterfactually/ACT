#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo '{"async": true, "asyncTimeout": 120000}'

cd "${CLAUDE_PROJECT_DIR:-/home/user/ACT}"

# Install dependencies
npm install

# Start dev server in background if not already running
if ! lsof -ti:5173 > /dev/null 2>&1; then
  npm run dev > /tmp/easter-flip-dev.log 2>&1 &
  # Wait for server to be ready
  for i in $(seq 1 20); do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/ 2>/dev/null | grep -q "200"; then
      echo "Dev server ready on port 5173"
      break
    fi
    sleep 1
  done
else
  echo "Dev server already running on port 5173"
fi
