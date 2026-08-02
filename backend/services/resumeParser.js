const extractText = require("../utils/extractText");
const { parseResume } = require("./geminiService");

const resumeParser = async (file) => {

  try {

    // =====================================
    // Step 1: Extract text from resume
    // =====================================

    const resumeText = await extractText(file);

    // =====================================
    // Step 2: Parse using Gemini
    // =====================================

    const candidateProfile =
      await parseResume(resumeText);

    console.log(
      "=========== PARSED JSON ==========="
    );

    console.log(
      JSON.stringify(candidateProfile, null, 2)
    );

    console.log(
      "=================================="
    );

    return candidateProfile;

  } catch (error) {

    console.error(
      "Resume Parser Error:",
      error.message
    );

    throw error;

  }

};

module.exports = resumeParser;