const {
  getCandidateProfile,
} = require("./candidateProfileService");

const {
  GoogleGenAI,
} = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const buildPrompt = (candidate) => {

  return `

  Important Rules:

- Evaluate only the information provided.
- Do NOT assume any field is suspicious unless there is clear evidence.
- Do NOT use created_at or updated_at timestamps as indicators of fraud.
- If information is missing, report it as "insufficient information" instead of assuming fraud.
- Base your conclusions only on the candidate profile provided.
.....
You are an expert ATS Resume Fraud Detection Engine.

Analyze the following candidate profile.

Return ONLY valid JSON.

Candidate:

${JSON.stringify(candidate, null, 2)}

Return this JSON format:

{
  "fraudScore": number,
  "riskLevel": "Low | Moderate | High",
  "confidence": number,
  "reasons": [],
  "suspiciousClaims": [],
  "recommendation": ""
}

Scoring Rules:

100 = Completely genuine
80-99 = Minor concerns
60-79 = Needs manual review
Below 60 = Highly suspicious

Evaluate:

• Experience realism
• Timeline consistency
• Skill inflation
• Education credibility
• Missing information
• Resume quality
• Overall authenticity
`;

};
const evaluateResumeFraud = async (candidateId) => {

  // Fetch complete candidate profile
  const {
    candidate,
  } = await getCandidateProfile(candidateId);

  console.log(
  "Candidate Profile Sent to Gemini:"
);

console.log(
  JSON.stringify(candidate, null, 2)
);

  // Build AI prompt
  const prompt = buildPrompt(candidate);

  // Call Gemini
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  // Extract response text
  const text = response.text;

  // Parse AI JSON response
  const result = JSON.parse(
    text.replace(/```json|```/g, "").trim()
  );

return {
  candidate: {
    id: candidate.id,
    name: candidate.full_name,
    email: candidate.email,
    experience: candidate.experience,
  },
  fraudAnalysis: result,
};
};
module.exports = {
  evaluateResumeFraud,
};