const { GoogleGenAI } = require("@google/genai");

// Debug (remove in production if desired)
console.log("Gemini API Key Loaded:", !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// Resume Parser
// ======================================================

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
2. DO NOT put job history inside experience.
3. Location format:
   City, State, Country
4. summary must be 2-3 sentences.
5. skills must be an array of strings.
6. education must always be an array.
7. certifications must always be an array.
8. projects must always be an array.

Return ONLY valid JSON.
Never include markdown.
Never include explanations.

Resume:

${resumeText}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("Empty response received from Gemini.");
    }

    return response.text;
  } catch (error) {
    console.error("========== RESUME PARSER ERROR ==========");
    console.error(error);
    console.error("=========================================");

    const message = String(error?.message || error);

    if (
      message.includes("429") ||
      message.includes("RESOURCE_EXHAUSTED") ||
      message.toLowerCase().includes("quota")
    ) {
      throw new Error(
        "AI resume parsing is temporarily unavailable because the Gemini API quota has been reached."
      );
    }

    if (
      message.includes("API_KEY") ||
      message.includes("UNAUTHENTICATED")
    ) {
      throw new Error(
        "Unable to authenticate with the AI resume parsing service."
      );
    }

    if (
      message.includes("403") ||
      message.includes("PERMISSION_DENIED")
    ) {
      throw new Error(
        "Access to the AI resume parsing service has been denied."
      );
    }

    if (
      message.includes("404") ||
      message.includes("NOT_FOUND")
    ) {
      throw new Error(
        "Configured Gemini model not found."
      );
    }

    throw new Error(
      "Unable to parse the resume at this time."
    );
  }
};

// ======================================================
// AI Candidate Matching
// ======================================================

const generateMatchAnalysis = async (candidate, job) => {
  try {
    const prompt = `
You are an expert AI Recruitment Assistant.

Compare the following candidate with the job.

Candidate:

${JSON.stringify(candidate, null, 2)}

Job:

${JSON.stringify(job, null, 2)}

Return ONLY valid JSON.

{
  "matchScore": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "recommendation": "",
  "summary": ""
}

Rules:

- matchScore must be between 0 and 100.
- matchingSkills should contain only skills present in both candidate and job.
- missingSkills should contain important job skills missing from the candidate.
- recommendation should be one of:
  "Highly Recommended"
  "Recommended"
  "Consider"
  "Not Recommended"

Return ONLY JSON.
Do not include markdown.
Do not include explanations.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("Empty response received from Gemini.");
    }

    let analysisText = response.text;

// Remove markdown code fences if Gemini returns them
analysisText = analysisText
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

let analysis;

try {
  analysis = JSON.parse(analysisText);
} catch (err) {
  throw new Error("Invalid JSON received from Gemini.");
}
const requiredFields = [
  "matchScore",
  "matchingSkills",
  "missingSkills",
  "strengths",
  "weaknesses",
  "recommendation",
  "summary",
];

for (const field of requiredFields) {
  if (!(field in analysis)) {
    throw new Error(`Gemini response missing field: ${field}`);
  }
}
return analysis;
  } catch (error) {
    console.error("========== MATCH ANALYSIS ERROR ==========");
    console.error(error);
    console.error("==========================================");

    throw new Error(
      "Unable to generate AI candidate matching analysis."
    );
  }
};

// ======================================================
// Exports
// ======================================================

module.exports = {
  parseResume,
  generateMatchAnalysis,
};