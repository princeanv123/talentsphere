const { GoogleGenAI } = require("@google/genai");
const {
  recordGeminiSuccess,
  recordGeminiFailure,
} = require("../services/systemHealthService");

console.log("Gemini API Key Loaded:", !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Calls Gemini API
 */
const callGemini = async (
  prompt,
  model = "gemini-3-flash-preview"
) => {
  const start = Date.now();

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("Empty response received from Gemini.");
    }

    const responseTimeMs = Date.now() - start;

    // Record successful real Gemini activity.
    recordGeminiSuccess(responseTimeMs);

    return response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  } catch (error) {
    const responseTimeMs = Date.now() - start;

    console.error("\n========== GEMINI ERROR ==========");
    console.dir(error, { depth: null });
    console.error("==================================\n");

    // Record failed real Gemini activity.
    recordGeminiFailure(error, responseTimeMs);

    throw error;
  }
};

/**
 * Calls Gemini and returns parsed JSON
 */
const parseGeminiJSON = async (
  prompt,
  model = "gemini-3-flash-preview"
) => {
  const text = await callGemini(prompt, model);

  try {
    return JSON.parse(text);

  } catch (error) {
    console.error("Invalid JSON received from Gemini");
    console.error(text);

    throw new Error("Invalid JSON received from Gemini.");
  }
};

module.exports = {
  callGemini,
  parseGeminiJSON,
};