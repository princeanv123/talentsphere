const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateEmbedding = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("Text is required to generate embedding");
  }

  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding) {
    throw new Error("Embedding was not returned by Gemini");
  }

  return embedding;
};

module.exports = {
  generateEmbedding,
};