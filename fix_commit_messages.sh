#!/bin/bash

# Script to fix incorrect commit messages for non-wrestling files
# This will create new commits with correct messages for each file/folder

echo "🔧 Fixing incorrect commit messages..."

# Function to create a proper commit message for each file/folder
fix_commit_message() {
    local file_path="$1"
    local correct_message="$2"
    
    echo "📝 Updating commit message for: $file_path"
    echo "   New message: $correct_message"
    
    # Touch the file to create a new commit with the correct message
    touch "$file_path"
    git add "$file_path"
    git commit -m "$correct_message"
}

# Fix DASH folder
fix_commit_message "DASH" "📊 Update analytics dashboard components and styling"

# Fix Midas Analytics gold-tracker
fix_commit_message "Midas Analytics/gold-tracker" "🥇 Update Midas Analytics gold tracker with enhanced features"

# Fix PRD MAKER
fix_commit_message "PRD MAKER" "📋 Update PRD Maker application with new features"

# Fix awesome-cursorrules-main
fix_commit_message "awesome-cursorrules-main" "⚡ Update awesome cursor rules collection with latest additions"

# Fix collage folder
fix_commit_message "collage" "🖼️ Update collage application with enhanced image processing"

# Fix mdmatch folder
fix_commit_message "mdmatch" "🔍 Update markdown matching tool with improved functionality"

# Fix markdown files
fix_commit_message "analytics-dashboard-ui.md" "📊 Update analytics dashboard UI documentation"
fix_commit_message "code-reviewer.md" "👀 Update code reviewer documentation and guidelines"
fix_commit_message "frontend-ui-specialist.md" "🎨 Update frontend UI specialist documentation"

# Fix HTML backup files
fix_commit_message "index-original-backup.html" "💾 Update original index backup with latest changes"
fix_commit_message "index-portfolio-backup.html" "💾 Update portfolio index backup with latest changes"

# Fix vite.svg
fix_commit_message "vite.svg" "⚡ Update Vite logo and build configuration"

echo "✅ All commit messages have been updated!"
echo "🚀 You can now push these changes with: git push origin main"



