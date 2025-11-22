# Piper TTS Setup (DEPRECATED - Now Using Python Package)

**NOTE**: We now use the `piper-tts` Python package instead of the binary. This file is kept for reference only.

The Piper TTS repository was archived (Oct 6, 2025), making binaries unavailable. We've switched to the Python package which is easier to install and maintain.

## Current Setup

We use the `piper-tts` Python package installed via pip:

```bash
cd /Users/jesse/JesseRod329.github.io/yes-jarvis
source .venv/bin/activate
pip install piper-tts
```

The TTS service (`services/tts/server.js`) now calls `python -m piper` instead of a binary.

## Legacy Binary Setup (Reference Only)

If you need to use the binary for some reason, here were the old options:

### Option 1: Download from GitHub Releases (No Longer Available)
The repository is archived, so binaries are not available.

### Option 2: Build from Source
You could build from the archived source, but the Python package is recommended.

## Verification

Test the Python package:
```bash
cd /Users/jesse/JesseRod329.github.io/yes-jarvis
source .venv/bin/activate
python -m piper --help
```
