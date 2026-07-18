const { GoogleGenAI } = require("@google/genai");
// TEMPORARY DEBUG
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
  "education": [],
  "certifications": [],
  "projects": []
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

6. education must be an array.

7. certifications must be an array.

8. projects must be an array.

IMPORTANT:

Return ONLY a single valid JSON object.

The response MUST be parseable by JavaScript JSON.parse().

Do NOT include:
- Markdown code fences
- JSON code fences
- Explanations
- Notes
- Comments
- Trailing commas
- Missing commas

Every array must be valid JSON.

If a field is unavailable, return:
- "" for strings
- [] for arrays
- 0 for experience

Never invent values.

Resume:

${resumeText}
`;

  const response = await ai.models.generateContent({
    
    model: "gemini-2.5-flash",
    contents: prompt,
  });
return response.text;
  
};

module.exports = {
  parseResume,
};