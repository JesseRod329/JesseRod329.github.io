import { spawn } from "child_process";

import express from "express";

import path from "path";

import fs from "fs";

import { fileURLToPath } from "url";



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);



const app = express();

app.use(express.json({ limit: "2mb" }));



// Resolve paths relative to project root (two levels up from this file)
const PROJECT_ROOT = path.resolve(__dirname, "../..");

const VDIR = path.join(PROJECT_ROOT, "services/tts/voices");

const PYTHON = process.env.PYTHON || "python3"; // Python executable

const VOICE = path.join(VDIR, "en_US-amy-low.onnx"); // adjust if your voice differs

const VOICE_CFG = path.join(VDIR, "en_US-amy-low.onnx.json"); // adjust

const VENV_PYTHON = path.join(PROJECT_ROOT, ".venv/bin/python"); // venv Python if available



app.post("/speak", async (req, res) => {

  const { text } = req.body || {};

  if (!text) return res.status(400).json({ error: "No text" });



  const out = path.join(PROJECT_ROOT, `services/tts/out_${Date.now()}.wav`);

  const inputFile = path.join(PROJECT_ROOT, `services/tts/in_${Date.now()}.txt`);

  

  // Use venv Python if available, otherwise system Python

  const pythonCmd = fs.existsSync(VENV_PYTHON) ? VENV_PYTHON : PYTHON;

  const args = [

    "-m", "piper",

    "-m", VOICE,

    "-c", VOICE_CFG,

    "-i", inputFile,

    "-f", out

  ];



  try {

    // Write text to input file

    fs.writeFileSync(inputFile, text, "utf8");



    const proc = spawn(pythonCmd, args, {

      cwd: PROJECT_ROOT,

      env: { ...process.env, PYTHONUNBUFFERED: "1" }

    });



    let err = "";

    proc.stderr.on("data", (d) => (err += d.toString()));



    proc.on("close", (code) => {

      // Clean up input file

      try { fs.unlinkSync(inputFile); } catch {}



      if (code !== 0) {

        return res.status(500).json({ error: err || "piper failed" });

      }



      try {

        const wav = fs.readFileSync(out);

        res.setHeader("Content-Type", "audio/wav");

        res.send(wav);

        // Clean up output file

        fs.unlinkSync(out);

      } catch (e) {

        res.status(500).json({ error: `Failed to read output: ${e.message}` });

      }

    });

  } catch (e) {

    try { fs.unlinkSync(inputFile); } catch {}

    res.status(500).json({ error: `Failed to start piper: ${e.message}` });

  }

});



const port = 8012;

app.listen(port, () => console.log("Piper wrapper on", port));

