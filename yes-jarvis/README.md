# YES Jarvis - Local Talking Avatar Assistant

A privacy-first, local talking avatar assistant with:
- **Speech-to-Text**: faster-whisper (local)
- **LLM**: Ollama (llama3.1)
- **Text-to-Speech**: Piper TTS (local)
- **3D Avatar**: React Three Fiber with Next.js
- **Lip-sync**: Placeholder (requires Ready Player Me GLB with ARKit blendshapes)

## Prerequisites

All prerequisites should already be installed, but here's what's needed:

- macOS (tested)
- Homebrew
- Node.js 20+
- Python 3.11+
- Ollama
- ffmpeg, portaudio, sox, cmake

## Setup

### 1. Install Piper TTS Python Package

The Piper TTS repository has been archived, so we use the Python package instead of the binary:

```bash
cd /Users/jesse/JesseRod329.github.io/yes-jarvis
source .venv/bin/activate
pip install piper-tts
```

This is already installed if you followed the initial setup, but you can verify with:
```bash
python -m piper --help
```

### 2. Download Piper Voice

Download an English female voice:

1. Visit [Piper Voices](https://huggingface.co/rhasspy/piper-voices)
2. Navigate to `en/en_US/amy/low/`
3. Download `en_US-amy-low.onnx` and `en_US-amy-low.onnx.json`
4. Place both files in `services/tts/voices/`

**Example commands:**

```bash
cd /Users/jesse/JesseRod329.github.io/yes-jarvis/services/tts/voices
curl -L https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/low/en_US-amy-low.onnx -o en_US-amy-low.onnx
curl -L https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/low/en_US-amy-low.onnx.json -o en_US-amy-low.onnx.json
```

### 3. Verify Ollama Model

Ensure `llama3.1` is available:

```bash
ollama list
# If not present:
ollama pull llama3.1
```

### 4. Start All Services

**Terminal 1 - STT Service:**
```bash
cd /Users/jesse/JesseRod329.github.io/yes-jarvis
source .venv/bin/activate
uvicorn services.stt.main:app --host 127.0.0.1 --port 8011 --reload
```

**Terminal 2 - TTS Service:**
```bash
cd /Users/jesse/JesseRod329.github.io/yes-jarvis/services/tts
npm install
node server.js
```

**Terminal 3 - Gateway Service:**
```bash
cd /Users/jesse/JesseRod329.github.io/yes-jarvis/services/gateway
npm install
node server.js
```

**Terminal 4 - Web App:**
```bash
cd /Users/jesse/JesseRod329.github.io/yes-jarvis/apps/web
npm run dev
```

### 5. Access the App

Open http://localhost:3000 in your browser.

The app will automatically request microphone permission. Speak into your mic, click "Respond" when ready, and the avatar will speak back.

## Avatar Model

Currently uses a fallback sphere. To use a real avatar:

1. Export a Ready Player Me avatar as GLB with ARKit/OVR morph targets
2. Place it at `apps/web/public/avatar.glb`
3. The app will automatically load it

**[Unverified]** Proper lip-sync requires:
- ARKit/Oculus blendshapes for visemes
- Viseme mapping from phonemes to mouth shapes
- Timing data synchronized with audio playback

## Service Endpoints

- **Gateway (LLM)**: http://127.0.0.1:8010/chat
- **STT (Speech-to-Text)**: ws://127.0.0.1:8011/ws
- **TTS (Text-to-Speech)**: http://127.0.0.1:8012/speak
- **Web App**: http://localhost:3000

## Troubleshooting

### STT Service Issues
- Ensure faster-whisper model downloads successfully (first run may take time)
- Check microphone permissions in System Preferences

### TTS Service Issues
- Verify `piper-tts` Python package is installed: `pip list | grep piper-tts`
- Ensure Python virtual environment is activated when running the service
- Check voice files are in `services/tts/voices/`
- Adjust voice file names in `services/tts/server.js` if needed
- Verify Python path: The service will use `.venv/bin/python` if available, otherwise system `python3`

### Gateway Issues
- Ensure Ollama is running: `ollama serve`
- Verify `llama3.1` model is available: `ollama list`

### Web App Issues
- Check browser console for errors
- Ensure all three backend services are running
- Verify CORS settings if needed

## Next Steps

- [ ] Add Ready Player Me GLB avatar
- [ ] Implement proper viseme mapping
- [ ] Add VAD (Voice Activity Detection) for better audio handling
- [ ] Reduce latency with smaller audio buffers
- [ ] Add Docker setup for easier deployment

## License

See individual component licenses.

