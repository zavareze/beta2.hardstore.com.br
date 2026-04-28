#!/usr/bin/env sh
set -eu

PROJECT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
NODE_VERSION=$(tr -d '[:space:]' < "$PROJECT_DIR/.nvmrc")
NODE_DIR="/root/.nvm/versions/node/v$NODE_VERSION/bin"

if [ ! -x "$NODE_DIR/node" ]; then
    echo "Node v$NODE_VERSION not found at $NODE_DIR/node" >&2
    echo "Install it with nvm or update .nvmrc to an installed Node version." >&2
    exit 1
fi

export PATH="$NODE_DIR:$PATH"
exec "$@"
