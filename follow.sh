#!/usr/bin/env bash
set -e

# ===== 用户手动控制区（只改这里） =====
REMOTE_NAME="origin"
BRANCH_NAME="main"
REMOTE_URL="https://github.com/TheBlueBanisters/Aurora_Vine.git"
AUTO_NPM_INSTALL="true"   # true/false
# ======================================

cd "$(dirname "$0")"

echo "[follow] checking git repo..."
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "[follow] not a git repo in current directory"
    echo "[follow] run backup.sh first to initialize and bind remote"
    exit 1
fi

if ! git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
    echo "[follow] binding remote '$REMOTE_NAME' -> $REMOTE_URL"
    git remote add "$REMOTE_NAME" "$REMOTE_URL"
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "[follow] local changes detected, please commit/stash first"
    echo "[follow] tip: run backup.sh first, then retry follow.sh"
    exit 1
fi

echo "[follow] ensuring branch '$BRANCH_NAME'..."
git branch -M "$BRANCH_NAME"
git checkout "$BRANCH_NAME"

echo "[follow] fetching latest from '$REMOTE_NAME/$BRANCH_NAME'..."
git fetch "$REMOTE_NAME" "$BRANCH_NAME"

echo "[follow] rebasing local branch onto latest remote..."
git pull --rebase "$REMOTE_NAME" "$BRANCH_NAME"

if [ "$AUTO_NPM_INSTALL" = "true" ] && [ -f "package.json" ]; then
    echo "[follow] installing npm dependencies..."
    npm install
fi

echo "[follow] done"
