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

6. education must be an array of objects.

Each education object must contain:
- degree
- institution
- field_of_study
- start_year
- end_year
- grade

If any value is unavailable, return an empty string.

7. certifications must be an array of objects.

Each certification object must contain:
- name
- issuer
- issue_date
- expiry_date
- credential_id

If any value is unavailable, return an empty string.

8. projects must be an array of objects.

Each project object must contain:
- name
- description
- technologies (array)
- role
- duration

If unavailable, return an empty string or empty array.

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
Do not return education, certifications, or projects as plain strings.

Always return them as objects that exactly match the schema above.

If only a university name is found, populate the institution field and leave the remaining fields as empty strings.

If only a certification name is found, populate the name field and leave the remaining fields as empty strings.

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