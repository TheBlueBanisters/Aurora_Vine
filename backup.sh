#!/usr/bin/env bash
set -e

# ===== 用户手动控制区（只改这里） =====
TAG_NAME="我要下班谢谢"
REMOTE_NAME="origin"
BRANCH_NAME="main"
REMOTE_URL="https://github.com/TheBlueBanisters/Aurora_Vine.git"
# 示例：
# TAG_NAME="backup-2025-12-23"
# TAG_NAME="pre-ijcai-2026"
# 不想打 tag 就留空
# ======================================

cd "$(dirname "$0")"

echo "[backup] checking git repo..."
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "[backup] not a git repo, running git init"
    git init
fi

if ! git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
    echo "[backup] binding remote '$REMOTE_NAME' -> $REMOTE_URL"
    git remote add "$REMOTE_NAME" "$REMOTE_URL"
fi

# 勿使用 :(exclude)node_modules —— 在 Windows 上会触发「ignored node_modules」且 git add 返回 1，set -e 会直接退出。
# node_modules 已由 .gitignore 排除，普通 git add 不会纳入暂存区。
echo "[backup] staging changes (respect .gitignore, skip node_modules)..."
git add -A -- .
git add -f -- backup.sh follow.sh 2>/dev/null || true

if git diff --cached --quiet; then
    echo "[backup] no new changes to commit, will only push pending commits"
else
    if [ -n "$TAG_NAME" ]; then
        COMMIT_MSG="backup [$TAG_NAME] $(date '+%Y-%m-%d %H:%M:%S')"
    else
        COMMIT_MSG="backup $(date '+%Y-%m-%d %H:%M:%S')"
    fi

    echo "[backup] committing..."
    git commit -m "$COMMIT_MSG"

    # ===== 可选：打 tag =====
    if [ -n "$TAG_NAME" ]; then
        if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
            echo "[backup] tag '$TAG_NAME' already exists, skip tagging"
        else
            echo "[backup] tagging commit as '$TAG_NAME'"
            git tag -a "$TAG_NAME" -m "$COMMIT_MSG"
        fi
    fi
    # =======================
fi


echo "[backup] ensuring branch '$BRANCH_NAME'..."
git branch -M "$BRANCH_NAME"

echo "[backup] pushing commits..."
if ! git push "$REMOTE_NAME" "$BRANCH_NAME"; then
    echo "[backup] push rejected, trying to sync remote history first..."
    if ! git pull --rebase --allow-unrelated-histories "$REMOTE_NAME" "$BRANCH_NAME"; then
        echo "[backup] failed to auto-sync (likely conflict)."
        echo "[backup] resolve conflicts, then run: git rebase --continue"
        echo "[backup] after that, run this script again."
        exit 1
    fi
    echo "[backup] retrying push..."
    git push "$REMOTE_NAME" "$BRANCH_NAME"
fi

if [ -n "$TAG_NAME" ]; then
    echo "[backup] pushing tag '$TAG_NAME'..."
    git push "$REMOTE_NAME" "$TAG_NAME"
fi

echo "[backup] done"
