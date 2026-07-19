const { GoogleGenAI } = require("@google/genai");

// Debug (remove in production if desired)
console.log("Gemini API Key Loaded:", !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const parseResume = async (resumeText) => {
  const prompt = `
You are an AI resume parser.

Extract information from the resume.

Return ONLY valid JSON.

{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "experience": 0,
  "summary": "",
  "skills": [],

  "education": [
    {
      "degree": "",
      "institution": "",
      "field_of_study": "",
      "start_year": "",
      "end_year": "",
      "grade": ""
    }
  ],

  "certifications": [
    {
      "name": "",
      "issuer": "",
      "issue_date": "",
      "expiry_date": "",
      "credential_id": ""
    }
  ],

  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "role": "",
      "duration": ""
    }
  ]
}

Rules:

1. experience must be ONLY the total years of professional experience as a NUMBER.
Example:
8
12
18

2. DO NOT put job history inside experience.

3. Extract the candidate's location as:
"City, State, Country"

Example:
"Saint Paul, Minnesota, USA"

Do NOT include street address or ZIP code.

4. summary must be a 2-3 sentence professional summary.

5. skills must be an array of strings.

6. education must always be an array of objects.

7. certifications must always be an array of objects.

8. projects must always be an array of objects.

Return ONLY valid JSON.

Never include markdown.

Never include explanations.

If any value is unavailable:
- "" for strings
- [] for arrays
- 0 for experience

Resume:

${resumeText}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    if (!response) {
      throw new Error("No response received from Gemini.");
    }

    if (!response.text) {
      throw new Error("Empty response received from Gemini.");
    }

    return response.text;
  } catch (error) {
    // Debug logging
    console.log("========== FULL GEMINI ERROR ==========");
    console.dir(error, { depth: null });
    console.log("=======================================");

    const message = String(error?.message || error);

    // Quota exceeded
    if (
      message.includes("429") ||
      message.includes("RESOURCE_EXHAUSTED") ||
      message.toLowerCase().includes("quota") ||
      message.includes("GenerateRequestsPerDay") ||
      message.includes("rate_limit")
    ) {
      throw new Error(
        "AI resume parsing is temporarily unavailable because the Gemini API quota has been reached. Please try again later."
      );
    }

    // Invalid API Key
    if (
      message.includes("API_KEY") ||
      message.includes("API key") ||
      message.includes("API_KEY_INVALID") ||
      message.includes("UNAUTHENTICATED")
    ) {
      throw new Error(
        "Unable to authenticate with the AI resume parsing service."
      );
    }

    // Permission
    if (
      message.includes("PERMISSION_DENIED") ||
      message.includes("403")
    ) {
      throw new Error(
        "Access to the AI resume parsing service has been denied."
      );
    }

    // Model not found
    if (
      message.includes("NOT_FOUND") ||
      message.includes("404")
    ) {
      throw new Error(
        "The configured Gemini model is not available for this project."
      );
    }

    // Network
    if (
      message.toLowerCase().includes("network") ||
      message.toLowerCase().includes("fetch") ||
      message.toLowerCase().includes("socket") ||
      message.toLowerCase().includes("timeout")
    ) {
      throw new Error(
        "Unable to connect to the AI resume parsing service. Please check your network connection."
      );
    }

    // Fallback
    throw new Error(
      "Unable to parse the resume at this time. Please try again later."
    );
  }
};

module.exports = {
  parseResume,
};