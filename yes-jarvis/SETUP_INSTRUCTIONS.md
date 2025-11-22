# Manual Setup Steps

## 1. Install Piper TTS Python Package

The Piper TTS repository was archived, so we use the Python package:

```bash
cd /Users/jesse/JesseRod329.github.io/yes-jarvis
source .venv/bin/activate
pip install piper-tts
```

Verify installation:
```bash
python -m piper --help
```

## 2. Download Piper Voice Model

Download an English female voice (already done if you followed the initial setup):

```bash
cd /Users/jesse/JesseRod329.github.io/yes-jarvis/services/tts/voices
curl -L https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/low/en_US-amy-low.onnx -o en_US-amy-low.onnx
curl -L https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/low/en_US-amy-low.onnx.json -o en_US-amy-low.onnx.json
```

## 3. Place Avatar GLB (Optional)

Place a Ready Player Me GLB file at:
```
apps/web/public/avatar.glb
```

The app will use a fallback sphere if this file doesn't exist.
