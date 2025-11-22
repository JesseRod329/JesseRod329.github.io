import express from "express";

import fetch from "node-fetch";



const app = express();

app.use(express.json({ limit: "2mb" }));



const OAI = "http://localhost:11434/v1/chat/completions"; // Ollama OpenAI-compat



app.post("/chat", async (req, res) => {

  const { messages, system } = req.body;

  const body = {

    model: "llama3.1",

    messages: [

      ...(system ? [{ role: "system", content: system }] : []),

      ...messages

    ],

    temperature: 0.7

  };

  const r = await fetch(OAI, {

    method: "POST",

    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(body)

  });

  const json = await r.json();

  res.json(json);

});



const port = 8010;

app.listen(port, () => console.log("Gateway on", port));


