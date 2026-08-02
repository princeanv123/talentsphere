const { parseGeminiJSON } = require("../utils/geminiHelper");
const {
  buildResumePrompt,
} = require("../prompts/resumePrompt");
const {
  buildMatchPrompt,
} = require("../prompts/matchPrompt");
const {
  buildRankingPrompt,
} = require("../prompts/rankingPrompt");

// ===========================================
// Resume Parser
// ===========================================

const parseResume = async (resumeText) => {

  const prompt = buildResumePrompt(resumeText);

  return await parseGeminiJSON(prompt);

};

// ===========================================
// Candidate vs Job Match Analysis
// ===========================================

const generateMatchAnalysis = async (
  candidate,
  job
) => {

  const prompt = buildMatchPrompt(
    candidate,
    job
  );

  return await parseGeminiJSON(prompt);

};

// ===========================================
// Candidate Ranking
// ===========================================

const generateCandidateRanking = async (
  candidate,
  candidateSkills,
  job,
  jobSkills
) => {

  const prompt = buildRankingPrompt(
    candidate,
    candidateSkills,
    job,
    jobSkills
  );

  return await parseGeminiJSON(prompt);

};

// ===========================================

module.exports = {
  parseResume,
  generateMatchAnalysis,
  generateCandidateRanking,
};