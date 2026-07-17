const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const parseResume = async (resumeText) => {
  const prompt = `
Extract the following information from this resume.

Return ONLY valid JSON.

{
  "name":"",
  "email":"",
  "phone":"",
  "totalExperience":"",
  "skills":[],
  "education":[],
  "certifications":[],
  "projects":[]
}

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