import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config(); // Load .env if running locally

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Use environment variable for safety
const apiKey = process.env.GROQ_API_KEY || "YOUR_FALLBACK_KEY";
const groq = new Groq({
  apiKey: apiKey,
  dangerouslyAllowBrowser: false,
});

// Test route
app.get("/", (req, res) => {
  res.send("✅ GoldenGlass AI backend is running!");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "No message provided." });
  }

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0]?.message?.content || "No reply.";
    res.json({ reply });
  } catch (error) {
    console.error("Groq API error:", error);
    res.status(500).json({ reply: "🤖 Error talking to Groq." });
  }
});

// Railway will use process.env.PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));