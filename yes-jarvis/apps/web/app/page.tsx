"use client";

import { Canvas } from "@react-three/fiber";

import { OrbitControls, useGLTF } from "@react-three/drei";

import { useEffect, useMemo, useRef, useState } from "react";



function Avatar() {

  // fallback primitive if avatar.glb missing

  try {

    // @ts-ignore

    const glb = useGLTF("/avatar.glb", true, true);

    // naive: find first mesh with morph targets

    const meshRef = useRef<any>(null);



    // Simple idle blink

    useEffect(() => {

      let t = 0;

      const id = setInterval(() => {

        if (!meshRef.current) return;

        const inf = meshRef.current.morphTargetInfluences;

        if (!inf) return;

        t = (t + 1) % 50;

        // fake eyelid morph at index 0 if exists

        if (inf.length > 0) {

          inf[0] = t === 1 ? 1 : 0;

        }

      }, 120);

      return () => clearInterval(id);

    }, []);



    return (

      <primitive

        ref={meshRef}

        object={glb.scene}

        position={[0, -1.2, 0]}

        scale={1.2}

      />

    );

  } catch (e) {

    // Fallback: simple sphere

    return <mesh position={[0, 0, 0]}><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color="pink" /></mesh>;

  }

}



export default function Home() {

  const [listening, setListening] = useState(false);

  const [transcript, setTranscript] = useState("");

  const [reply, setReply] = useState("");



  // audio ws to STT

  useEffect(() => {

    let ws: WebSocket | null = null;

    let mediaStream: MediaStream | null = null;

    let processor: ScriptProcessorNode | null = null;

    let ctx: AudioContext | null = null;



    async function start() {

      setListening(true);

      ws = new WebSocket("ws://127.0.0.1:8011/ws");

      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 16k mono PCM16 chunks via MediaRecorder (WAV-like): we'll transcode in server

      ctx = new AudioContext({ sampleRate: 16000 });

      const source = ctx.createMediaStreamSource(mediaStream);

      processor = ctx.createScriptProcessor(4096, 1, 1);

      source.connect(processor); processor.connect(ctx.destination);

      processor.onaudioprocess = e => {

        const input = e.inputBuffer.getChannelData(0);

        // float32 -> PCM16

        const buf = new Int16Array(input.length);

        for (let i = 0; i < input.length; i++) {

          const s = Math.max(-1, Math.min(1, input[i]));

          buf[i] = s < 0 ? s * 0x8000 : s * 0x7fff;

        }

        if (ws && ws.readyState === 1) {

          const b64 = btoa(String.fromCharCode(...new Uint8Array(buf.buffer)));

          ws.send(b64);

        }

      };



      ws.onmessage = (ev) => {

        try {

          const msg = JSON.parse(ev.data);

          if (msg.partial) setTranscript((p) => (p + " " + msg.partial).trim());

        } catch {}

      };

    }



    // Autostart on mount. Add a button if you prefer consent gating.

    start().catch(console.error);

    return () => {

      setListening(false);

      if (ws && ws.readyState === 1) ws.send("__end__");

      if (processor) processor.disconnect();

      if (ctx) ctx.close();

      if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());

    };

  }, []);



  async function askLLM() {

    const text = transcript.trim();

    if (!text) return;

    const r = await fetch("http://127.0.0.1:8010/chat", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({

        system: "You are a helpful, charismatic female on-screen assistant.",

        messages: [{ role: "user", content: text }]

      })

    });

    const j = await r.json();

    const content = j?.choices?.[0]?.message?.content ?? "";

    setReply(content);



    // TTS

    const t = await fetch("http://127.0.0.1:8012/speak", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ text: content })

    });

    const wav = await t.arrayBuffer();

    const audioCtx = new AudioContext();

    const audio = await audioCtx.decodeAudioData(wav.slice(0));

    const src = audioCtx.createBufferSource();

    src.buffer = audio; src.connect(audioCtx.destination); src.start();



    // [Unverified] naive "lip-sync": pulse a mouth morph target in time with words

    // Real visemes require avatar blendshapes + viseme timings.

  }



  return (

    <main style={{ width: "100vw", height: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }}>

      <div style={{ width: "100%", height: "100%" }}>

        <Canvas camera={{ position: [0, 1.2, 2.2], fov: 40 }}>

          <ambientLight intensity={0.8} />

          <directionalLight position={[2, 4, 2]} intensity={1.2} />

          <Avatar />

          <OrbitControls />

        </Canvas>

      </div>

      <div style={{ padding: "24px" }}>

        <h1>YES Jarvis (Local)</h1>

        <p><b>Listening:</b> {String(listening)}</p>

        <p><b>You said:</b> {transcript}</p>

        <p><b>Assistant:</b> {reply}</p>

        <button onClick={askLLM} style={{padding:"12px 16px", marginTop: 12}}>Respond</button>

        <div style={{marginTop:12, opacity:0.7, fontSize:12}}>

          [Unverified] Lip-sync is placeholder. For proper visemes, supply a Ready Player Me GLB with ARKit/Oculus blendshapes and map viseme timings.

        </div>

      </div>

    </main>

  );

}
