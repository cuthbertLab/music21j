#!/usr/bin/env bash
set -euo pipefail

# Always run from project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

npm run lint
npm run typecheck
npm run test

rm -rf releases
npm run build:all
cp -rp build/ releases/
rm -rf releases/tests
