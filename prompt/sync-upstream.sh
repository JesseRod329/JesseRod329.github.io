#!/bin/bash

# Script to sync awesome-nano-banana-main with upstream repo
# This updates the prompt library with new cases from the upstream repository

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NANO_BANANA_DIR="${SCRIPT_DIR}/awesome-nano-banana-main"
UPSTREAM_REPO="https://github.com/JimmyLv/awesome-nano-banana.git"

echo "🔄 Syncing awesome-nano-banana-main with upstream..."

cd "$NANO_BANANA_DIR"

# Check if we're in a git repo
if [ ! -d ".git" ]; then
    echo "⚠️  This directory is not a git repository."
    echo "   Initializing git repository..."
    git init
    git remote add origin https://github.com/JesseRod329/JesseRod329.github.io.git 2>/dev/null || true
fi

# Add upstream remote if it doesn't exist
if ! git remote | grep -q upstream; then
    echo "➕ Adding upstream remote..."
    git remote add upstream "$UPSTREAM_REPO" 2>/dev/null || true
fi

# Fetch latest from upstream
echo "📥 Fetching latest from upstream..."
git fetch upstream

# Check what branch we're on
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")

# Checkout main branch if not already on it
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔀 Switching to main branch..."
    git checkout -b main 2>/dev/null || git checkout main
fi

# Merge upstream/main into current branch
echo "🔀 Merging upstream/main..."
if git merge upstream/main --no-edit --no-commit 2>/dev/null; then
    echo "✅ Successfully merged upstream changes"
    git reset --hard HEAD 2>/dev/null || true
else
    echo "⚠️  Merge had conflicts or upstream is already merged"
    echo "   Current state may differ from upstream"
fi

# Count cases before and after
BEFORE_COUNT=$(find cases -maxdepth 1 -type d -name '[0-9]*' | wc -l | tr -d ' ')
echo ""
echo "📊 Found $BEFORE_COUNT case directories"

# Go back to script directory
cd "$SCRIPT_DIR"

# Regenerate cases.json
echo ""
echo "🔄 Regenerating cases.json..."
node generate-cases.js

echo ""
echo "✅ Sync complete!"
echo "   Run 'node generate-cases.js' anytime to regenerate cases.json from YAML files"














