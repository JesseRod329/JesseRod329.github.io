#!/bin/bash

# Script to push IPTV project to GitHub
# Usage: ./PUSH_TO_GITHUB.sh YOUR_GITHUB_USERNAME REPO_NAME

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: ./PUSH_TO_GITHUB.sh YOUR_GITHUB_USERNAME REPO_NAME"
    echo ""
    echo "Example: ./PUSH_TO_GITHUB.sh jesse iptv-player"
    echo ""
    echo "First, create a repository on GitHub:"
    echo "1. Go to https://github.com/new"
    echo "2. Name it (e.g., 'iptv-player')"
    echo "3. Choose 'Private'"
    echo "4. DO NOT initialize with README"
    echo "5. Click 'Create repository'"
    exit 1
fi

GITHUB_USER=$1
REPO_NAME=$2

echo "Setting up GitHub remote..."
git remote add origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git 2>/dev/null || git remote set-url origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git

echo "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "Repository: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo ""
    echo "Password is set to: 12345678"
    echo "Password is stored in backend/.env (not committed to GitHub)"
else
    echo ""
    echo "❌ Failed to push. Make sure:"
    echo "1. Repository exists on GitHub"
    echo "2. You have push access"
    echo "3. You're authenticated (use GitHub CLI or SSH keys)"
fi

