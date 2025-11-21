# Setting Up GitHub Repository

This guide explains how to add your IPTV project to GitHub with password protection.

## Prerequisites

- Git installed on your system
- A GitHub account
- Password protection already configured (see `SETUP_PASSWORD.md`)

## Step 1: Initialize Git Repository

If you haven't already initialized git:

```bash
cd /Users/jesse/iptv
git init
```

## Step 2: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it (e.g., `iptv-player`)
5. Choose **Private** (this keeps your code private)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

## Step 3: Add Files and Commit

```bash
# Add all files (respecting .gitignore)
git add .

# Create initial commit
git commit -m "Initial commit: IPTV player with password protection"

# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Verify .gitignore

Make sure sensitive files are not committed:

```bash
# Check what will be committed
git status

# Verify .gitignore is working
cat .gitignore
```

The `.gitignore` should exclude:
- `.env` files (where password is stored)
- Database files (`database/*.db`)
- Virtual environment (`venv/`)
- Logs (`logs/*.log`)
- Other sensitive files

## Step 5: Set Password in Production

**IMPORTANT:** Never commit your password to GitHub!

When deploying or sharing:
1. Each user should set their own `IPTV_PASSWORD` environment variable
2. Or create their own `.env` file (which is gitignored)
3. Document this in your README

## Step 6: Update README

Add a section to your README about password protection:

```markdown
## Password Protection

This application supports password protection. See [SETUP_PASSWORD.md](SETUP_PASSWORD.md) for details.

To set a password:
```bash
export IPTV_PASSWORD="your-password"
```

## Security

- The repository is private on GitHub
- Password is set via environment variable (never committed)
- All API endpoints require authentication when password is set
```

## Making Repository Private

If you already created a public repository:

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to "Danger Zone"
4. Click "Change visibility"
5. Select "Make private"
6. Confirm

## Collaborators

To add collaborators to your private repository:

1. Go to repository Settings
2. Click "Collaborators" in the left sidebar
3. Click "Add people"
4. Enter their GitHub username or email
5. They'll receive an invitation

## Alternative: Public Repository with Password

If you want a public repository but still password-protect the app:

1. Keep the repository public (anyone can see the code)
2. Set `IPTV_PASSWORD` when running the app (password not in code)
3. Users must set their own password to run the app
4. The password is never in the repository

This way:
- Code is open source (public)
- Each deployment requires a password to access
- Password is never committed to GitHub

## Troubleshooting

### "Permission denied" when pushing
- Make sure you're authenticated with GitHub
- Use SSH keys or GitHub CLI for authentication
- Or use a personal access token

### Files you don't want are being committed
- Check `.gitignore` is working: `git check-ignore -v filename`
- Remove files from git cache: `git rm --cached filename`
- Commit the removal

### Want to remove password protection from code
- Simply don't set `IPTV_PASSWORD` environment variable
- The app will work without password protection
- Code supports both modes automatically

