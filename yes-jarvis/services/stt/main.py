import asyncio, base64, io, time

from fastapi import FastAPI, WebSocket

from faster_whisper import WhisperModel

import soundfile as sf



app = FastAPI()

model = WhisperModel("base.en", device="cpu")  # change model size if you have GPU



@app.websocket("/ws")

async def ws_stt(ws: WebSocket):

    await ws.accept()

    # client sends small PCM16 chunks as base64; we buffer ~1s then transcribe

    buf = bytearray()

    last = time.time()

    while True:

        msg = await ws.receive_text()

        if msg == "__end__":

            break

        chunk = base64.b64decode(msg)

        buf.extend(chunk)

        now = time.time()

        if now - last > 1.0:  # naive 1s window

            data = bytes(buf); buf.clear(); last = now

            # 16kHz mono PCM16 -> WAV bytes

            import numpy as np

            audio_array = np.frombuffer(data, dtype=np.int16).astype(np.float32) / 32768.0

            bio = io.BytesIO()

            sf.write(bio, audio_array, 16000, format="WAV", subtype="PCM_16")

            bio.seek(0)

            segments, _ = model.transcribe(bio, language="en", vad_filter=True)

            text = " ".join([s.text for s in segments]).strip()

            if text:

                await ws.send_json({"partial": text})

    await ws.send_json({"done": True})

