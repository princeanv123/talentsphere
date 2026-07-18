const extractText = require("../utils/extractText");
const { parseResume } = require("./geminiService");

const resumeParser = async (file) => {
  try {

    // Step 1: Extract text from resume
    const resumeText = await extractText(file);

    // Step 2: Send to Gemini
    const aiResponse = await parseResume(resumeText);

    console.log("=========== GEMINI RAW RESPONSE ===========");
    console.log(aiResponse);
    console.log("===========================================");

    // Step 3: Remove markdown
    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Step 4: Convert to JSON
    let candidateProfile;

try {
  candidateProfile = JSON.parse(cleanedResponse);
} catch (err) {
  console.error("=========== INVALID GEMINI RESPONSE ===========");
  console.error(cleanedResponse);
  console.error("===============================================");
  throw new Error("Gemini returned invalid JSON.");
}

    console.log("=========== PARSED JSON ===========");
    console.log(JSON.stringify(candidateProfile, null, 2));
    console.log("==================================");

    return candidateProfile;

  } catch (error) {
    console.error("Resume Parser Error:", error.message);
    throw error;
  }
};

module.exports = resumeParser;