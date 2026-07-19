console.log("=== STARTING GEMINI TEST ===");

require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

console.log("API Key Loaded:", !!process.env.GEMINI_API_KEY);
console.log("API Key:", process.env.GEMINI_API_KEY?.substring(0, 10) + "...");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Say Hello from Gemini.",
    });

    console.log("SUCCESS");
    console.log(response.text);
  } catch (error) {
    console.log("\n========== FULL ERROR ==========\n");
    console.dir(error, { depth: null });
    console.log("\n===============================\n");
  }
}

testGemini();