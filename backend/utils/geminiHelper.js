const { GoogleGenAI } = require("@google/genai");

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

  try {

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("Empty response received from Gemini.");
    }

    return response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  } catch (error) {

    console.error("\n========== GEMINI ERROR ==========");
    console.dir(error, { depth: null });
    console.error("==================================\n");

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