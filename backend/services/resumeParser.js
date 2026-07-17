const extractText = require("../utils/extractText");
const { parseResume } = require("./geminiService");

const resumeParser = async (filePath) => {
  try {
    // Step 1: Extract text
    const resumeText = await extractText(filePath);

    // Step 2: Parse with Gemini
    const aiResponse = await parseResume(resumeText);

    // Step 3: Clean AI response
    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Step 4: Convert to JSON
    const candidateProfile = JSON.parse(cleanedResponse);

    return candidateProfile;

  } catch (error) {
    console.error("Resume Parser Error:", error.message);
    throw error;
  }
};

module.exports = resumeParser;